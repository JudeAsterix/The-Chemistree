var MechanismEnums = {
	HydroAlide: {
		id: "HydroAlide",
		commonName: "Hydrolisis of an Alkyl Halide"
	},
	WilliHesis: {
		id: "WilliHesis",
		commonName: "Williamson Synthesis"
	}
};

var CompoundEnums = {
	Isobutanol: {
		id: "Isobutanol",
		commonName: "Isobutanol",
		IUPACName: "2-Methyl-1-propanol",
		molecularWeight: "74.12 g/mol",
		meltingPoint: "-108.0°C",
		refImage: document.getElementById("OneCloroTwoMethyl-b")
	},
	OneCloroTwoMethyl: {
		id:"OneCloroTwoMethyl",
		commonName: "1-Chloro-2-Methylpropane",
		IUPACName: "2-Methyl-1-propanol",
		molecularWeight: "74.12 g/mol",
		meltingPoint: "-108.0°C",
		refImage: document.getElementById("OneCloroTwoMethyl-b")
	},
	TwoMethoxypropane: {
		id:"TwoMethoxypropane",
		commonName:"2-Methoxypropane",
		IUPACName: "2-Methyl-1-propanol",
		molecularWeight: "74.12 g/mol",
		meltingPoint: "-108.0°C",
		refImage: document.getElementById("OneCloroTwoMethyl-b")
	}, 
};

var entityEnums = {
	SCREEN: "screen",
	MENU: "menu",
	LOGO: "logo",
	ROADMAPNODE: "roadmapnode",
	ROADMAPLINE: "roadmapline",
	ROADMAP: "roadmap",
	INFOSCREEN: "infoscreen"
};

/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  These are the enumerations for the entities, reactions, and compounds; any text-based data will go here
  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

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

var zoom = 1;

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
		zoom += 0.05
		var temp = screen2.entities[0];
		temp.changeZoom(0.05);
		
	}
	else if(event.deltaY > 0 && zoom > 0.25)
	{
		zoom -= 0.05
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
		var temp = screen2.entities[0];
		temp.saveGlobalOffset();
	}
}

/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  This is the main draw section and entity section.  Don't change unless necessary.
  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

function draw() {
	context.fillStyle = "rgb(0, 0, 0)";
	screen2.draw(mouseX, mouseY);
	update();
}

function update()
{
	screen2.update(mouseX, mouseY, onScreen);
}

function Entity(x, y, width, height, color, id)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.id = id;
	
	this.draw = function()
	{
		context.fillStyle = "red";
		context.fillRect(this.x, this.y, this.width, this.height);
	}
	
	this.draw = function(mouseX, mouseY)
	{
	}
	
	this.update = function(mouseX, mouseY, mouseOut)
	{}
	
	this.clickUpdate = function(mouseX, mouseY)
	{
	}
	
	this.getID = function()
	{
		return this.id;
	}
}

function Screen(type)
{
	this.isShown = false;
	this.type = type; // 0 = Title Screen | 1 = Road Map Screen | 2 = Search Screen
	this.entities = [];
	this.droppedDown;
	this.verticalShift = 0;
	Entity.call(this, 0, 0, canDiv.height, canDiv.width, "rgb(109, 137, 107)", entityEnums.SCREEN);	
	
	if(this.type == 0)
	{
		this.droppedDown = false;
	}
	else if(this.type == 1)
	{
		var nodes = [];
		var lines = [];
		this.droppedDown = true;
		
		nodes.push(new RoadMapNode(300, 150, "rgb(0, 200, 200)", "the", "OneCloroTwoMethyl"));
		nodes.push(new RoadMapNode(400, 250, "rgb(0, 200, 200)", "the", "TwoMethoxypropane"));
		nodes.push(new RoadMapNode(200, 250, "rgb(0, 200, 200)", "the", "Isobutanol"));
		
		lines.push(new RoadMapLine(nodes[0], nodes[1], "red", "NaOCH3", "HydroAlide"));
		lines.push(new RoadMapLine(nodes[0], nodes[2], "purple", "NaOH", "WilliHesis"));
		
		var tempLine = new RoadMapLine(nodes[0], nodes[1], "blue", "Hydrolysis of an Alkyl Halide");
		var tempInfo = new InfoScreen(720, 1080, tempLine);
		tempInfo.setText();
		
		this.entities.push(new RoadMap(nodes, lines));
		this.entities.push(tempInfo);
		
		this.isShown = true;
	}
	this.entities.push(new Menu());
	this.draw = function(mouseX, mouseY)
	{
		var frontGrad = context.createLinearGradient(0, 0, 0, 360);
		if(this.type == 0)
		{
			frontGrad.addColorStop(0, "#5a9d2d");
			frontGrad.addColorStop(1, "rgb(56, 216, 155)");
		}
		else
		{
			frontGrad.addColorStop(0, "#5a9d2d");
			frontGrad.addColorStop(1, "#ecf5ed");
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
		for(var i = 0; i < this.entities.length; i++)
		{
			this.entities[i].clickUpdate(mouseX, mouseY);
		}
	}
}

/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
             This section is for the main menu screen.
  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

function Menu()
{
	Entity.call(this, 0, 0, 1080, 25, "#38630e", entityEnums.MENU);
	this.dropdownHighlighted = false;
	this.infoScreenHighlighted = false;
	this.infoScreenCharacter = [">", "<"];
	this.infoScreenCharacterIndex = 0;
	
	this.draw = function()
	{
		context.fillStyle = "#38630e";
		context.fillRect(this.x, this.y, this.width, this.height);
		if(this.dropdownHighlighted)
		{
			context.fillStyle = "#d0e1ca";
		}
		else
		{
			context.fillStyle = "#aec5aa";
		}
		context.fillRect(this.x, this.y, this.width / 15, this.height);
		context.fillStyle ="rgb(40, 66, 51)";
		context.font = "20px Arial";
		context.textAlign = "center";
		context.fillText("V", this.width / 30, 20);
			
		if(this.infoScreenHighlighted)
		{
			context.fillStyle = "#d0e1ca";
		}
		else
		{
			context.fillStyle = "#aec5aa";
		}
		
		context.fillRect(this.x + this.width - (this.width / 15), this.y, this.width / 15, this.height);
		context.fillStyle ="rgb(40, 66, 51)";
		context.font = "20px Arial";
		context.textAlign = "center";
		context.fillText(this.infoScreenCharacter[this.infoScreenCharacterIndex], this.x + this.width - this.width / 30, 20);
		
	}
	
	this.update = function(mouseX, mouseY, mouseOut)
	{
		if(mouseOut)
		{
			this.setDropDownHighlighted(false);
			this.setInfoScreenHighlighted(false);
		}
		else
		{
			if(mouseX > 0 && mouseX < (this.width / 15) && mouseY > 0 && mouseY < this.height)
			{
				this.setDropDownHighlighted(true);
			}
			else if(mouseX > this.width - this.width / 15 && mouseX < this.width && mouseY > 0 && mouseY < this.height)
			{
				this.setInfoScreenHighlighted(true);
			}
			else
			{
				this.setDropDownHighlighted(false);
				this.setInfoScreenHighlighted(false);
			}
		}
		
	}
	
	this.clickUpdate = function(mouseX, mouseY)
	{
		if(mouseX > 0 && mouseX < (this.width / 15) && mouseY > 0 && mouseY < this.height)
		{
		}
		else if(mouseX > this.width - this.width / 15 && mouseX < this.width && mouseY > 0 && mouseY < this.height)
		{
			for(var i = 0; i < screen2.entities.length; i++)
			{
				if(screen2.entities[i].id == "infoscreen")
				{
					screen2.entities[i].updateVisible();
					this.infoScreenCharacterIndex = (this.infoScreenCharacterIndex + 1) % 2;
					break;
				}
			}
		}
	}
	
	this.setDropDownHighlighted = function(newBool)
	{
		this.dropdownHighlighted = newBool;
	}
	
	this.setInfoScreenHighlighted = function(newBool)
	{
		this.infoScreenHighlighted = newBool;
	}
}

/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  =          This section is for the visual road-map             =
  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

function RoadMapNode(x, y, color, name, imageId) // ----This is the node class----
{
	Entity.call(this, x, y, 10, 10, color, entityEnums.ROADMAPNODE);
	this.nodeImage = document.getElementById(imageId);
	this.color = color;
	this.offsetX = 0;
	this.offsetY = 0;
	this.name = name;
	this.clicked = false;
	this.map = new RoadMap([], []);
	this.hovering = false;
	this.offsetSpaceX = 0;
	this.offsetSpaceY = 0;
	this.info = CompoundEnums[imageId];
	
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
		var dotX = (this.x + this.offsetX) * this.map.zoom + this.map.globalOffsetX;
		var dotY = (this.y + this.offsetY) * this.map.zoom + this.map.globalOffsetY;
		
		var distance = Math.sqrt(Math.pow((dotX - mouseX), 2) + Math.pow((dotY - mouseY), 2));
		
		if(distance < this.width * this.map.zoom)
		{
			this.hovering = true;
			return true;
		}
		else
		{
			this.hovering = false;
			return false;
		}
	}
	
	this.clickUpdate = function(mouseX, mouseY)
	{
		if(this.inTheCircle(mouseX, mouseY))
		{
			for(var i = 0; i < screen2.entities.length; i++)
			{
				if(screen2.entities[i].id == "infoscreen")
				{
					screen2.entities[i].compoundMechanismOrNil = 1;
					screen2.entities[i].reference = this.info.id;
				}
			}
		}
	}
}

function RoadMapLine(nodeFrom, nodeTo, color, name, roadMap, id)
{
	Entity.call(this, -1, -1, 10, 10, color, entityEnums.ROADMAPLINE);
	this.roadMap = new RoadMap([], []);
	this.nodeFrom = nodeFrom;
	this.nodeTo = nodeTo;
	this.fromWidth = 10;
	this.toWidth = 10;
	this.name = name;
	this.color = color;
	this.info = MechanismEnums[id];
	
	this.textAlpha = 1.0;
	this.selected = false;
	this.map = new RoadMap([], []);
	const TEXT_ALPHA_BIG = 1.0;
	const TEXT_ALPHA_SMALL = 0.0;
	const WIDTH_BIG = 20;
	const WIDTH_SMALL = 10;
	
	this.draw = function()
	{
		console.log(this.info);
		var fromX = this.nodeFrom.offsetX + this.nodeFrom.x;
		var toX = this.nodeTo.offsetX + this.nodeTo.x;
		var fromY = this.nodeFrom.offsetY + this.nodeFrom.y;
		var toY = this.nodeTo.offsetY + this.nodeTo.y;
		
		var widthDiff = toX - fromX;
		var heightDiff = toY - fromY;
		
		var deg = Math.atan(heightDiff / widthDiff);
		this.makeLine();
		
		//Creates the text
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
	
	this.update = function(mouseX, mouseY, mouseOut)
	{
		if(!this.nodeFrom.hovering && !this.nodeTo.hovering)
		{
			if(this.cursorOver(mouseX, mouseY) && (this.fromWidth != WIDTH_BIG || this.toWidth != WIDTH_BIG))
			{
				var sizeChange = WIDTH_BIG - this.fromWidth;
				this.fromWidth = this.fromWidth + sizeChange / 6;
				this.toWidth = this.toWidth + sizeChange / 6;
			}
			else if(!this.cursorOver(mouseX, mouseY) && (this.fromWidth != WIDTH_SMALL || this.toWidth != WIDTH_SMALL))
			{
				var sizeChange = this.fromWidth - WIDTH_SMALL;
				this.fromWidth = this.fromWidth - sizeChange / 6;
				this.toWidth = this.toWidth - sizeChange / 6;
			}
		}
		else if(this.fromWidth != WIDTH_SMALL || this.toWidth != WIDTH_SMALL)
		{
			this.fromWidth = WIDTH_SMALL;
			this.toWidth = WIDTH_SMALL;
		}
	}
	
	this.getTrigPosition = function(isSin, deg, plusOrMinus, nodeIsTo)
	{
		var width;
		if(nodeIsTo)
		{
			width = this.toWidth;
		}
		else
		{
			width = this.fromWidth;
		}
		
		if(isSin == true)
		{
			return (Math.round(width / 2 * Math.sin((deg + (plusOrMinus * 90)))));
		}
		else
		{
			return (Math.round(width / 2 * Math.cos((deg + (plusOrMinus * 90)))));
		}
	}
	
	this.makeLine = function()
	{
		var fromX = this.nodeFrom.offsetX + this.nodeFrom.x;
		var toX = this.nodeTo.offsetX + this.nodeTo.x;
		var fromY = this.nodeFrom.offsetY + this.nodeFrom.y;
		var toY = this.nodeTo.offsetY + this.nodeTo.y;
		
		var widthDiff = toX - fromX;
		var heightDiff = toY - fromY;
		
		var deg = Math.atan(heightDiff / widthDiff);
		
		//Makes the actual line
		context.lineWidth = 5;
		context.strokeStyle = this.color;
		context.fillStyle = this.color;
		context.beginPath();
		context.moveTo((toX - this.getTrigPosition(false, deg, 1, true)) * this.map.zoom + this.map.globalOffsetX, (toY - this.getTrigPosition(true, deg, 1, true)) * this.map.zoom + this.map.globalOffsetY);
		context.lineTo((toX - this.getTrigPosition(false, deg, -1, true)) * this.map.zoom + this.map.globalOffsetX, (toY - this.getTrigPosition(true, deg, -1, true)) * this.map.zoom + this.map.globalOffsetY);
		context.lineTo(((fromX - this.getTrigPosition(false, deg, -1, false)) * this.map.zoom) + this.map.globalOffsetX, ((fromY - this.getTrigPosition(true, deg, -1, false)) * this.map.zoom) + this.map.globalOffsetY);
		context.lineTo(((fromX - this.getTrigPosition(false, deg, 1, false)) * this.map.zoom) + this.map.globalOffsetX, ((fromY - this.getTrigPosition(true, deg, 1, false)) * this.map.zoom) + this.map.globalOffsetY);
		context.fill();
	}
	
	this.cursorOver = function(mouseX, mouseY)
	{
		context.globalAlpha = 0.0;
		this.makeLine();
		context.globalAlpha = 1.0;
		return(context.isPointInPath(mouseX, mouseY));
	}
	
	this.getMap = function(nodeMap)
	{
		this.map = nodeMap;
	}
	
	this.clickUpdate = function(mouseX, mouseY)
	{
		if(this.cursorOver(mouseX, mouseY) && !this.nodeTo.hovering && !this.nodeFrom.hovering)
		{
			for(var i = 0; i < screen2.entities.length; i++)
			{
				if(screen2.entities[i].id == "infoscreen")
				{
					screen2.entities[i].compoundMechanismOrNil = 2;
					screen2.entities[i].reference = this.info.id;
				}
			}
		}
	}
}

function RoadMap(nodes, lines)
{
	Entity.call(this, -1, -1, -1, -1, "Pink", entityEnums.ROADMAP);
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
		
		for(var i = 0; i < this.numberOfLines; i++)
		{
			this.lines[i].update(mouseX, mouseY, mouseOut);
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
	
	this.clickUpdate = function(mouseX, mouseY)
	{
		for(var i = 0; i < this.nodes.length; i++)
		{
			this.nodes[i].clickUpdate(mouseX, mouseY);
		}
		
		for(var i = 0; i < this.lines.length; i++)
		{
			this.lines[i].clickUpdate(mouseX, mouseY);
		}
	}
}

/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  =            This section is for the info section              =
  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

function InfoScreen(height, width, line)
{
	Entity.call(this, width - 400, 25, 400, height - 25, "#add285", entityEnums.INFOSCREEN);
	this.madeVisible = true;
	this.compoundMechanismOrNil = 3; // Compound - 1 | Mechanism - 2 | Nil - 3
	this.reference = "";
	
	this.INVISIBLEX = 1080;
	this.VISIBLEX = 1080 - this.width;
	
	this.draw = function()
	{
		context.fillStyle = "#4a7821";
		context.fillRect(this.x, this.y, this.width, this.height);
		if(this.compoundMechanismOrNil == 1)
		{
			context.font = "40px Century Gothic";
			context.fillStyle = "black";
			context.textAlign = "left";
			context.fillText(CompoundEnums[this.reference].commonName, this.x + 10, this.y + 50, this.width - 20);
			var compoundImage = document.getElementById(this.reference);
			context.drawImage(compoundImage, this.x + 10, this.y + 70);
			
		}
		else if(this.compoundMechanismOrNil == 2)
		{
			context.font = "40px Century Gothic";
			context.fillStyle = "black";
			context.textAlign = "left";
			//context.fillText(MechanismEnums[this.reference].commonName, this.x + 10, this.y + 50, this.width - 20);
		}
		else if(this.compoundMechanismOrNil == 3)
		{
			context.font = "40px Century Gothic";
			context.fillStyle = "black";
			context.textAlign = "left";
			context.fillText("'Ello!", this.x + 10, this.y + 50, this.width - 20);
			var puppyImage = document.getElementById("cute-puppy");
			context.drawImage(puppyImage, this.x + 10, this.y + 70, this.width - 20, 230);
			context.font = "20px Century Gothic";
			this.wrapText("This is where the information for any compounds and mechanisms you click on will go, but this feature hasn't been implemented yet."
			+ " Until then, this little message will pop up! This is also a test for me to see if this font and the line breaks look nice."
			+ " Obviously if you're seeing this, that's very much the case. Overall, I'm feeling a strong 8 to a light 9.", this.x + 10, this.y + 340, this.width - 20, 25);
		}
		context.fontcolor = "red";
	}
	
	this.wrapText = function(text, x, y, maxWidth, lineHeight) 
	{
		var words = text.split(' ');
		var line = '';
		
		for(var n = 0; n < words.length; n++) 
		{
			var testLine = line + words[n] + ' ';
			var metrics = context.measureText(testLine);
			var testWidth = metrics.width;
			if(testWidth > maxWidth && n > 0) 
			{
				context.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
			}
			else
			{
				line = testLine;
			}
		}
		context.fillText(line, x, y);
	}
	
	this.update = function(mouseX, mouseY, mouseOut)
	{
		if((this.madeVisible && this.x != this.VISIBLEX) || (!this.madeVisible && this.x != this.INVISIBLEX))
		{
			var change;
			if(this.madeVisible)
			{
				change = this.x - this.VISIBLEX;
			}
			else
			{
				change = this.x - this.INVISIBLEX;
			}
			
			this.x -= change / 5;
		}
	}
	
	this.setText = function()
	{
		if(this.compoundMechanismOrNil == 3)
		{
			this.infoText = "If you see this, you got yourself an empty thing!"
		}
	}
	
	this.clickUpdate = function(mouseX, mouseY)
	{
		
	}
	
	this.updateVisible = function()
	{
		this.madeVisible = !this.madeVisible;
	}
}

setInterval(draw, 50);
