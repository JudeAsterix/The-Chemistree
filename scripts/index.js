var canDiv = document.getElementById("canvas");
var context = canDiv.getContext("2d");
var screen1 = new Screen(0);
var screen2 = new Screen(1);

var mouseDown = false;
var mouseOnNode = false;
var mouseOnLine = false;
var mouseX = 0;
var mouseY = 0;

var dragX = 0;
var dragY = 0;

var onScreen = false;
var menu = new Menu();
var temp = 10;
var timer;

const HEIGHT = 720;
const WIDTH = 1080;

canDiv.height = HEIGHT;
canDiv.width = WIDTH;

function initialise() {
	canDiv.addEventListener("click", clickReporter, false);
	canDiv.addEventListener("mousemove", mouseMoveReporter, false);
	canDiv.addEventListener("mouseout", mouseOutReporter, false);
	canDiv.addEventListener("mousewheel", mouseWheelReporter, false);
	canDiv.addEventListener("mousedown", mouseDownReporter, false);
	canDiv.addEventListener("mouseup", mouseUpReporter, false);
	timer = setInterval(draw, 100);
	return timer;
}

/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
         This section is for mouse and keyboard listeners
  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

function clickReporter(event)
{
	var rect = canDiv.getBoundingClientRect();
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;
	screen2.clickUpdate(mouseX, mouseY);
}

function mouseMoveReporter(event)
{
	var rect = canDiv.getBoundingClientRect();
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;
	onScreen = false;
	
	if(mouseDown)
	{
		var temp = screen2.entities[0];
		temp.changeGlobalOffset(-dragX + mouseX, -dragY + mouseY);
	}
}

function mouseOutReporter(event)
{
	menu.update(-464, -4646, true);
}

function mouseWheelReporter(event)
{
	
	if(event.deltaY < 0)
	{
		console.log(screen2.entities.length);
		var temp = screen2.entities[0];
		temp.changeZoom(0.05);
		
	}
	else if(event.deltaY > 0)
	{
		var temp = screen2.entities[0];
		temp.changeZoom(-0.05);
	}
}

function mouseDownReporter(event)
{
	var rect = canDiv.getBoundingClientRect();
	if(!mouseOnNode)
	{
		mouseDown = true;
		dragX = event.clientX - rect.left;
		dragY = event.clientY - rect.top;
	}
}

function mouseUpReporter(event)
{
	if(mouseDown)
	{
		mouseDown = false;
		console.log(screen2.entities.length);
		var temp = screen2.entities[0];
		temp.saveGlobalOffset();
	}
}

/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  This is the main draw section and entity section.  Don't change.
  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

function draw() {
	context.fillStyle = "rgb(0, 0, 0)";
	screen2.draw();
	update();
}

function update()
{
	screen2.update(mouseX, mouseY, onScreen);
}

function Entity(x, y, width, height, color)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.draw = function()
	{
		context.fillStyle = "red";
		context.fillRect(this.x, this.y, this.width, this.height);
	}
	
	this.update = function(mouseX, mouseY, mouseOut)
	{}
}

function Screen(type)
{
	this.isShown = false;
	this.type = type; // 0 = Title Screen | 1 = Road Map Screen | 2 = Search Screen
	this.entities = [];
	this.droppedDown;
	this.verticalShift = 0;
	Entity.call(this, 0, 0, canDiv.height, canDiv.width, "rgb(109, 137, 107)");	
	
	if(this.type == 0)
	{
		this.droppedDown = false;
		this.entities.push(new Logo());
	}
	else if(this.type == 1)
	{
		var nodes = [];
		var lines = [];
		this.droppedDown = true;
		
		nodes.push(new RoadMapNode(300, 150, "rgb(0, 200, 200)", "the", "one"));
		nodes.push(new RoadMapNode(400, 250, "rgb(0, 200, 200)", "the", "two"));
		nodes.push(new RoadMapNode(200, 250, "rgb(0, 200, 200)", "the", "three"));
		
		lines.push(new RoadMapLine(nodes[0], nodes[1], "red", "Williamson Synthesis"));
		lines.push(new RoadMapLine(nodes[0], nodes[2], "purple", "Hydrolysis of Alkyl Halide"));
		/*nodes.push(new RoadMapNode(300, 150, "rgb(0, 200, 200)"));
		nodes.push(new RoadMapNode(400, 250, "rgb(0, 200, 200)"));
		nodes.push(new RoadMapNode(500, 350, "rgb(0, 200, 200)"));
		nodes.push(new RoadMapNode(600, 250, "rgb(0, 200, 200)"));
		nodes.push(new RoadMapNode(550, 400, "rgb(0, 200, 200)"));
		nodes.push(new RoadMapNode(700, 375, "rgb(0, 200, 200)"));
		
		lines.push(new RoadMapLine(nodes[0], nodes[1], "red", "yes"));
		lines.push(new RoadMapLine(nodes[2], nodes[3], "blue", "yes"));
		lines.push(new RoadMapLine(nodes[4], nodes[3], "red", "yes"));
		lines.push(new RoadMapLine(nodes[3], nodes[5], "purple", "yes"));
		lines.push(new RoadMapLine(nodes[1], nodes[5], "green", "yes"));*/
		
		this.entities.push(new RoadMap(nodes, lines));
		this.entities.push(new InfoScreen(720, 1080));
		this.isShown = true;
	}
	this.entities.push(new Menu());
	this.draw = function()
	{
		var frontGrad = context.createLinearGradient(0, 0, 0, 360);
		if(this.type == 0)
		{
			frontGrad.addColorStop(0, "rgb(38, 155, 132)");
			frontGrad.addColorStop(1, "rgb(56, 216, 155)");
		}
		else
		{
			frontGrad.addColorStop(0, "rgb(255, 235, 163)");
			frontGrad.addColorStop(1, "rgb(232, 255, 163)");
		}
		context.fillStyle = frontGrad;
		context.fillRect(0, 0, 1080, 720);
		context.fillRect(0, 0, canDiv.width, canDiv.height);
		
		for(var i = 0; i < this.entities.length; i++)
		{
			this.entities[i].draw();
		}
	}
	
	this.update = function(mouseX, mouseY, mouseOver)
	{
		for(var i = 0; i < this.entities.length; i++)
		{
			this.entities[i].update(mouseX, mouseY, mouseOver);
		}
	}
	
	this.clickUpdate = function(mouseX, mouseY)
	{
		
	}
}

/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
             This section is for the main menu screen.
  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

function Menu()
{
	Entity.call(this, 0, 0, 1080, 25, "rgb(144, 178, 141)");
	this.dropdownHighlighted = false;
	
	this.draw = function()
	{
		context.fillStyle = "rgb(144, 178, 141)";
		context.fillRect(this.x, this.y, this.width, this.height);
		if(this.dropdownHighlighted)
		{
			context.fillStyle = "rgb(81, 209, 138)";
		}
		else
		{
			context.fillStyle = "rgb(109, 137, 107)";
		}
		context.fillRect(this.x, this.y, this.width / 15, this.height);
		context.fillStyle ="rgb(40, 66, 51)";
		context.font = "20px Arial";
		context.textAlign = "center";
		context.fillText("V", this.width / 30, 20);
		
	}
	
	this.update = function(mouseX, mouseY, mouseOut)
	{
		if(mouseOut)
		{
			this.setDropDownHighlighted(false);
		}
		else
		{
			if(mouseX > 0 && mouseX < (this.width / 15) && mouseY > 0 && mouseY < this.height)
			{
				this.setDropDownHighlighted(true);
			}
			else
			{
				this.setDropDownHighlighted(false);
			}
		}
	}
	
	this.clickUpdate = function(mouseX, mouseY)
	{
		
	}
	
	this.setDropDownHighlighted = function(newBool)
	{
		this.dropdownHighlighted = newBool;
	}
}

function Logo()
{
	var hoverY = 0;
	Entity.call(this, 100, 100, 880, 500, "blue");
	
	this.moveShift = function(shift, mag)
	{
		return Math.sin(((hoverY / 4) + shift) / 20) * mag;
	}
	
	this.draw = function()
	{
		var points = [[this.moveShift(270, 20) + 500, this.moveShift(0, 20) + 100],
						 [this.moveShift(315, 20) + 600, this.moveShift(10, 20) + 100],
						 [this.moveShift(0, 20) + 700, this.moveShift(20, 20) + 200],
						 [this.moveShift(45, 20) + 700, this.moveShift(30, 20) + 300],
						 [this.moveShift(90, 20) + 600, this.moveShift(40, 20) + 400],
						 [this.moveShift(135, 20) + 500, this.moveShift(50, 20) + 400],
						 [this.moveShift(180, 20) + 400, this.moveShift(60, 20) + 300],
						 [this.moveShift(225, 20) + 400, this.moveShift(70, 20) + 200],
						 [this.moveShift(270, 20) + 500, this.moveShift(0, 20) + 100]];
		var moveY2 = Math.sin(((hoverY + 10) / 20)) * 20;
		context.strokeStyle = "rgb(50, 101, 186)";
		context.beginPath();
		context.moveTo(points[0][0], points[0][1]);
		context.lineTo(points[1][0], points[1][1]);
		context.lineTo(points[2][0], points[2][1]);
		context.lineTo(points[3][0], points[3][1]);
		context.lineTo(points[4][0], points[4][1]);
		context.lineTo(points[5][0], points[5][1]);
		context.lineTo(points[6][0], points[6][1]);
		context.lineTo(points[7][0], points[7][1]);
		context.lineTo(points[0][0], points[0][1]);
		
		context.moveTo(this.moveShift(270, 20) + 500, this.moveShift(0, 20) + 100);
		context.lineTo(this.moveShift(10, 20) + 700, this.moveShift(30, 20) + 300);
		context.lineTo(this.moveShift(40, 20) + 400, this.moveShift(60, 20) + 300);
		context.lineTo(this.moveShift(-10, 20) + 600, this.moveShift(10, 20) + 100);
		context.lineTo(this.moveShift(20, 20) + 600, this.moveShift(40, 20) + 400);
		context.lineTo(this.moveShift(50, 20) + 400, this.moveShift(70, 20) + 200);
		context.lineTo(this.moveShift(0, 20) + 700, this.moveShift(20, 20) + 200);
		context.lineTo(this.moveShift(30, 20) + 500, this.moveShift(50, 20) + 400);
		context.lineTo(this.moveShift(270, 20) + 500, this.moveShift(0, 20) + 100);
		
		context.moveTo(this.moveShift(270, 20) + 500, this.moveShift(0, 20) + 100);
		context.lineTo(this.moveShift(20, 20) + 600, this.moveShift(40, 20) + 400);
		context.lineTo(this.moveShift(-10, 20) + 600, this.moveShift(10, 20) + 100);
		context.lineTo(this.moveShift(30, 20) + 500, this.moveShift(50, 20) + 400);
		context.lineTo(this.moveShift(0, 20) + 700, this.moveShift(20, 20) + 200);
		context.lineTo(this.moveShift(40, 20) + 400, this.moveShift(60, 20) + 300);
		context.lineTo(this.moveShift(10, 20) + 700, this.moveShift(30, 20) + 300);
		context.lineTo(this.moveShift(50, 20) + 400, this.moveShift(70, 20) + 200);
		
		context.moveTo(this.moveShift(-20, 20) + 500, this.moveShift(0, 20) + 100);
		context.lineTo(this.moveShift(0, 20) + 700, this.moveShift(20, 20) + 200);
		context.lineTo(this.moveShift(20, 20) + 600, this.moveShift(40, 20) + 400);
		context.lineTo(this.moveShift(40, 20) + 400, this.moveShift(60, 20) + 300);
		context.lineTo(this.moveShift(-20, 20) + 500, this.moveShift(0, 20) + 100);
		context.lineTo(this.moveShift(-10, 20) + 600, this.moveShift(10, 20) + 100);
		context.lineTo(this.moveShift(10, 20) + 700, this.moveShift(30, 20) + 300);
		context.lineTo(this.moveShift(30, 20) + 500, this.moveShift(50, 20) + 400);
		context.lineTo(this.moveShift(50, 20) + 400, this.moveShift(70, 20) + 200);
		context.lineTo(this.moveShift(-10, 20) + 600, this.moveShift(10, 20) + 100);
		context.stroke();
		
		context.fillStyle = "rgb(68, 104, 163)";
		context.font = "70px Segoe UI Light";
		context.fillText("The ChemisTree", 550 - (context.measureText("The ChemisTree").width / 2),500);
		hoverY++;
	}
}

/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  =          This section is for the visual road-map             =
  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

function RoadMapNode(x, y, color, name, imageId) // ----This is the node class----
{
	Entity.call(this, x, y, 10, 10, color);
	this.nodeImage = document.getElementById(imageId);
	this.color = color;
	this.offsetX = 0;
	this.offsetY = 0;
	this.name = name;
	this.clicked = false;
	this.map = new RoadMap([], []);
	
	this.offsetSpaceX = 0;
	this.offsetSpaceY = 0;
	
	const SMALL_SIZE = 10;
	const BIG_SIZE = 20;
	
	this.draw = function()
	{
		context.fillStyle = this.color;	
		context.beginPath();
		context.arc((this.x + this.offsetX) * this.map.zoom + this.map.globalOffsetX, (this.y + this.offsetY) * this.map.zoom + this.map.globalOffsetY, this.width * this.map.zoom, this.height * this.map.zoom, 0, 2* Math.PI);
		context.fill();
		context.fillStyle = "rgba(255, 255, 255, 0.5)";
		context.fillRect((((this.x + this.offsetX) - (this.nodeImage.width / 2)) * this.map.zoom) + this.map.globalOffsetX, ((this.y + this.offsetY) + (this.nodeImage.height / 2)) * this.map.zoom + this.map.globalOffsetY, this.nodeImage.width * this.map.zoom, this.nodeImage.height * this.map.zoom);
		context.drawImage(this.nodeImage, (((this.x + this.offsetX) - (this.nodeImage.width / 2)) * this.map.zoom) + this.map.globalOffsetX, ((this.y + this.offsetY) + (this.nodeImage.height / 2)) * this.map.zoom + this.map.globalOffsetY, this.nodeImage.width * this.map.zoom, this.nodeImage.height * this.map.zoom);
		

	}
	
	this.getMap = function(nodeMap)
	{
		this.map = nodeMap;
	}
		
	this.update = function(mouseX, mouseY, mouseOut)
	{
		if(this.inTheCircle(mouseX, mouseY))
		{
			var sizeChange = BIG_SIZE - this.height;
			this.height += sizeChange / 4;
			this.width += sizeChange / 4;
		}
		else
		{
			var sizeChange = SMALL_SIZE - this.height;
			this.height += sizeChange / 4;
			this.width += sizeChange / 4;
		}
		
		var differenceX = -Math.pow(((mouseX - this.x) / 150.0), 3.0) - this.offsetX;
		this.offsetX += differenceX / 6;
		var differenceY = -Math.pow(((mouseY - this.y) / 150.0), 3.0) - this.offsetY;
		this.offsetY += differenceY / 6;
	}
	
	this.inTheCircle = function(mouseX, mouseY)
	{
		var dotX = (this.x + this.offsetX) * this.map.zoom;
		var dotY = (this.y + this.offsetY) * this.map.zoom;
		
		var distance = Math.sqrt(Math.pow((dotX - mouseX), 2) + Math.pow((dotY - mouseY), 2));
		
		if(distance < this.width)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}

function RoadMapLine(nodeFrom, nodeTo, color, name, roadMap)
{
	Entity.call(this, -1, -1, 10, 10, color);
	this.roadMap = new RoadMap([], []);
	this.nodeFrom = nodeFrom;
	this.nodeTo = nodeTo;
	this.name = name;
	this.color = color;
	this.textAlpha = 1.0;
	this.map = new RoadMap([], []);
	
	const TEXT_ALPHA_BIG = 1.0;
	const TEXT_ALPHA_SMALL = 0.0;
	
	this.draw = function()
	{
		var fromX = this.nodeFrom.offsetX + this.nodeFrom.x;
		var toX = this.nodeTo.offsetX + this.nodeTo.x;
		var fromY = this.nodeFrom.offsetY + this.nodeFrom.y;
		var toY = this.nodeTo.offsetY + this.nodeTo.y;
		
		var widthDiff = toX - fromX;
		var heightDiff = toY - fromY;
		
		var deg = Math.atan(heightDiff / widthDiff);
		
		context.lineWidth = 5;
		context.strokeStyle = this.color;
		context.fillStyle = this.color;
		context.beginPath();
		context.moveTo(toX * this.map.zoom + this.map.globalOffsetX, toY * this.map.zoom + this.map.globalOffsetY);
		context.lineTo(((fromX - this.getTrigPosition(false, deg, 1)) * this.map.zoom) + this.map.globalOffsetX, ((fromY - this.getTrigPosition(true, deg, 1)) * this.map.zoom) + this.map.globalOffsetY);
		context.lineTo(((fromX - this.getTrigPosition(false, deg, -1)) * this.map.zoom) + this.map.globalOffsetX, ((fromY - this.getTrigPosition(true, deg, -1)) * this.map.zoom) + this.map.globalOffsetY);
		context.fill();
		
		if(this.map.zoom >= 1)
		{
			context.translate((fromX + toX) / 2 * this.map.zoom + this.map.globalOffsetX, (fromY + toY) / 2 * this.map.zoom + this.map.globalOffsetY);
			context.rotate(deg);
			context.translate(0, -20);
			context.font = "12px Tahoma";
			context.fillStyle = "rgba(0, 0, 0, " + this.textAlpha + ")";
			context.textAlign = "center";
			context.fillText(this.name, 0, 0);
			context.translate(0, 20);
			context.rotate(-deg);
			context.translate(-(fromX + toX) / 2 * this.map.zoom - this.map.globalOffsetX, -(fromY + toY) / 2 * this.map.zoom - this.map.globalOffsetY);
			
			if(this.textAlpha != 1)
			{
				this.textAlpha = (this.textAlpha + this.TEXT_ALPHA_BIG) / 2.0;
			}
		}
		else
		{
			if(this.textAlpha != 0)
			{
				this.textAlpha = this.textAlpha / 2.0;
			}
		}
		
	}
	
	this.getTrigPosition = function(isSin, deg, plusOrMinus)
	{
		if(isSin == true)
		{
			return (Math.round(this.nodeFrom.height / 2 * Math.sin((deg + (plusOrMinus * 90)))));
		}
		else
		{
			return (Math.round(this.nodeFrom.height / 2 * Math.cos((deg + (plusOrMinus * 90)))));
		}
	}
	
	this.getMap = function(nodeMap)
	{
		this.map = nodeMap;
	}
}

function RoadMap(nodes, lines)
{
	this.nodes = nodes;
	this.numberOfNodes = nodes.length;
	this.lines = lines;
	this.numberOfLines = lines.length;
	this.zoom = 1;
	this.globalOffsetX = 0;
	this.globalOffsetY = 0;
	this.startGlobalOffsetX = 0;
	this.startGlobalOffsetY = 0;
	
	this.init = function()
	{
		for(var i = 0; i < this.nodes.length; i++)
		{
			this.nodes[i].getMap(this);
		}
		
		for(var i = 0; i < this.lines.length; i++)
		{
			this.lines[i].getMap(this);
		}
	}
	
	this.draw = function()
	{
		for(var i = 0; i < this.numberOfLines; i++)
		{
			this.lines[i].draw(this.globalOffsetX, this.globalOffsetY);
		}
		
		for(var i = 0; i < this.numberOfNodes; i++)
		{
			this.nodes[i].draw();
		}
	}
	
	this.update = function(mouseX, mouseY, mouseOut)
	{
		for(var i = 0; i < this.numberOfNodes; i++)
		{
			this.nodes[i].update(mouseX, mouseY, mouseOut);
		}
	}
	
	this.changeZoom = function(change)
	{
		this.zoom += change;
		for(var i = 0; i < this.nodes.length; i++)
		{
			this.nodes[i].getMap(this);
		}
		
		for(var i = 0; i < this.lines.length; i++)
		{
			this.lines[i].getMap(this);
		}
	}
	
	this.changeGlobalOffset = function(x, y)
	{
		this.globalOffsetX = this.startGlobalOffsetX + x;
		this.globalOffsetY = this.startGlobalOffsetY + y;
		console.log(this.globalOffsetX);
		for(var i = 0; i < this.nodes.length; i++)
		{
			this.nodes[i].getMap(this);
		}
		
		for(var i = 0; i < this.lines.length; i++)
		{
			this.lines[i].getMap(this);
		}
	}
	
	this.saveGlobalOffset = function()
	{
		this.startGlobalOffsetX = this.globalOffsetX;
		this.startGlobalOffsetY = this.globalOffsetY;
	}
}

/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  =            This section is for the info section              =
  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

function InfoScreen(height, width)
{
	Entity.call(this, width, 25, 500, height - 25, "blue");
	this.madeVisible = true;
	
	const INVISIBLEX = width;
	const VISIBLEX = width - this.width;
	
	this.draw = function()
	{
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		//console.log(canDiv.width - 25, this.width);
	}
	
	this.update = function(mouseX, mouseY, mouseOut)
	{
	}
}

setInterval(draw, 50);
