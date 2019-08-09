var canDiv = document.getElementById("canvas");
var context = canDiv.getContext("2d");
var screen1 = new Screen(0);
var screen2 = new Screen(1);
var mouseX = 0;
var mouseY = 0;
var onScreen = false;
var menu = new Menu();
canDiv.height = 720;
canDiv.width = 1080;
var temp = 10;
var timer;

function initialise() {
	canDiv.addEventListener("click", clickReporter, false);
	canDiv.addEventListener("mousemove", mouseOverReporter, false);
	canDiv.addEventListener("mouseout", mouseOutReporter, false);
	timer = setInterval(draw, 100);
	return timer;
}

/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
         This section is for mouse and keyboard listeners
  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

function clickReporter(event)
{
	
}

function mouseOverReporter(event)
{
	var rect = canDiv.getBoundingClientRect();
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;
	onScreen = false;
}

function mouseOutReporter(event)
{
	menu.update(-464, -4646, true);
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
	this.type = type; // 0 = Title Screen | 1 = Road Map Screen | 2 = Search Screen
	this.entities = []
	this.verticalShift = 0;
	Entity.call(this, 0, 0, canDiv.height, canDiv.width, "rgb(109, 137, 107)");
	
	if(this.type == 0)
	{
		this.entities.push(new Logo());
		this.entities.push(new Menu());
	}
	else if(this.type == 1)
	{
		var nodes = [];
		nodes.push(new RoadMapNode(300, 150, "rgb(0, 200, 200)"));
		nodes.push(new RoadMapNode(400, 250, "rgb(0, 200, 200)"));
		nodes.push(new RoadMapNode(500, 350, "rgb(0, 200, 200)"));
		nodes.push(new RoadMapNode(600, 250, "rgb(0, 200, 200)"));
		nodes.push(new RoadMapNode(550, 400, "rgb(0, 200, 200)"));
		nodes.push(new RoadMapNode(700, 375, "rgb(0, 200, 200)"));
		
		var lines = [];
		lines.push(new RoadMapLine(nodes[0], nodes[1], "red", "yes"));
		lines.push(new RoadMapLine(nodes[2], nodes[3], "blue", "yes"));
		lines.push(new RoadMapLine(nodes[4], nodes[3], "red", "yes"));
		lines.push(new RoadMapLine(nodes[3], nodes[5], "purple", "yes"));
		lines.push(new RoadMapLine(nodes[1], nodes[5], "green", "yes"));
		
		this.entities.push(new RoadMap(nodes, lines));
	}
	
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
		context.fillText("V", 30, 20);
		
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

function RoadMapNode(x, y, color, name)
{
	Entity.call(this, x, y, 10, 10, color);
	this.color = color;
	this.offsetX = 0;
	this.offsetY = 0;
	this.name = name;
	this.clicked = false;
	
	const SMALL_SIZE = 10;
	const BIG_SIZE = 20;
	
	this.draw = function()
	{
		context.fillStyle = this.color;	
		context.beginPath();
		context.arc(this.x + this.offsetX, this.y + this.offsetY, this.width, this.height, 0, 2* Math.PI);
		context.fill();
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
		var dotX = this.x + this.offsetX;
		var dotY = this.y + this.offsetY;
		
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

function RoadMapLine(nodeFrom, nodeTo, color, name)
{
	Entity.call(this, -1, -1, 10, 10, color);
	this.nodeFrom = nodeFrom;
	this.nodeTo = nodeTo;
	this.name = name;
	this.color = color;
	
	this.draw = function()
	{
		var fromX = this.nodeFrom.offsetX + this.nodeFrom.x;
		var toX = this.nodeTo.offsetX + this.nodeTo.x;
		var fromY = this.nodeFrom.offsetY + this.nodeFrom.y;
		var toY = this.nodeTo.offsetY + this.nodeTo.y;
		
		var widthDiff = toX - fromX;
		var heightDiff = toY - fromY;
		
		var deg = Math.atan(heightDiff / widthDiff) / (Math.PI / 180);
		
		context.lineWidth = 5;
		context.strokeStyle = this.color;
		//context.beginPath();
		//context.moveTo(fromX, fromY);
		//context.lineTo(toX, toY);
		//context.stroke();
		context.fillStyle = this.color;
		context.beginPath();
		context.moveTo(fromX, fromY);
		context.lineTo(toX - Math.round(5 * Math.cos((deg + 90) * (Math.PI / 180))), toY - Math.round(5 * Math.sin((deg + 90) * (Math.PI / 180))));
		context.lineTo(toX - Math.round(5 * Math.cos((deg - 90) * (Math.PI / 180))), toY - Math.round(5 * Math.sin((deg - 90) * (Math.PI / 180))));
		context.fill();
	}
}

function RoadMap(nodes, lines)
{
	this.nodes = nodes;
	this.numberOfNodes = nodes.length;
	this.lines = lines;
	this.numberOfLines = lines.length;
	
	this.draw = function()
	{
		for(var i = 0; i < this.numberOfLines; i++)
		{
			this.lines[i].draw();
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
}


setInterval(draw, 50);
