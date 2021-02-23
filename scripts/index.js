var entityEnums = {
	SCREEN: "screen",
	MENU: "menu",
	LOGO: "logo",
	ROADMAPNODE: "roadmapnode",
	ROADMAPLINE: "roadmapline",
	ROADMAP: "roadmap",
	INFOSCREEN: "infoscreen",
	CREDITSSCREEN: "creditsscreen",
	LEGEND: "legend"
};

/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  These are the enumerations for the entities, reactions, and compounds; any text-based data will go here
  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

var canDiv = document.getElementById("canvas");
var context = canDiv.getContext("2d");
var screens = [new Screen(1), new Screen(0), new Screen(2)];
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
	
	for(var i = 0; i < screens.length; i++)
	{
		screens[i].clickUpdate(mouseX, mouseY);
	}
	
}

function mouseMoveReporter(event)
{
	var rect = canDiv.getBoundingClientRect();
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;
	onScreen = false;
	
	if(mouseDown)
	{
		var temp = screens[0].entities[0];
		temp.changeGlobalOffset(-dragX + mouseX, -dragY + mouseY);
	}
}

function mouseOutReporter(event)
{
	menu.update(-464, -4646, true);
}

function mouseWheelReporter(event)
{
	console.log("mouse");
	if(event.deltaY < 0)
	{
		zoom += 0.05;
		var temp = screens[1].entities[0];
		temp.changeZoom(0.05);
		
	}
	else if(event.deltaY > 0 && zoom > 0.25)
	{
		zoom -= 0.05;
		var temp = screens[1].entities[0];
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
		var temp = screens[0].entities[0];
		temp.saveGlobalOffset();
	}
}

/*||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
  This is the main draw section and entity section.  Don't change unless necessary.
  ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
*/

function draw() {
	context.fillStyle = "rgb(0, 0, 0)";
	for(var i = 0; i < screens.length; i++)
	{
		screens[i].draw(mouseX, mouseY);
	}
	update();
}

function update()
{
	for(var i = 0; i < screens.length; i++)
	{
		screens[i].update(mouseX, mouseY, onScreen);
	}
}

/**
	Representing any entity onscreen
	
	@param {integer} x - The X value.
	@param {integer} y - The Y value.
	@param {integer} width - The width of the entity in pixels
	@param {integer} height - The height of the entity in pixels
	@param {name} id - The type of class the entity is
*/

function Entity(x, y, width, height, color, id)
{
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.id = id;
	
	/**
		Draw the entity onscreen
	*/
	this.draw = function()
	{
		context.fillStyle = "red";
		context.fillRect(this.x, this.y, this.width, this.height);
	}
	
	/**
		Return the ID of the entity
		@return {name} id - The type of class the entity is
	*/
	this.getID = function()
	{
		return this.id;
	}
}


/**
	The screen that will be displayed; The type of screen will determine what is being displayed.
	
	@param {boolean} isShown - Whether or not the screen should be visible
	@param {type} - The type of screen that displays
		0 - Title Screen
		1 - Road Map Screen
		2 - Search Screen
	@param {Entity[]} entities - A list of entities that are displayed with the screen
	@param {boolean} droppedDown - Whether or not the screen has been dropped down
		[Note - This is different from isShown, as isShown determines whether the screen is visible, while droppedDown determines whether the slide down animation has completed.
	@param {integer} verticalShift - How much from the top of the screen the top of the screen is
*/

function Screen(type)
{
	this.isShown = false;
	this.type = type; // 0 = Title Screen | 1 = Road Map Screen | 2 = Search Screen
	this.entities = [];
	this.droppedDown;
	this.verticalShift = 0;
	
	/**Screen is an entity with the following initial properties
			x - 0
			y - 0
			height - Height of the canvas
			width - Width of the canvas
			color - A pale dark green color
			id - SCREEN
	*/
	Entity.call(this, 0, 0, canDiv.height, canDiv.width, "rgb(109, 137, 107)", entityEnums.SCREEN);	
	
	if(this.type == 0)
	{
		this.droppedDown = false;
		this.entities.push(new CreditsScreen());
		this.isShown = true;
	}
	else if(this.type == 1)
	{
		var nodes = [];
		var lines = [];
		this.droppedDown = true;
		
		nodes.push(new RoadMapNode(300, 150, "#0a6634", "Secondary-Alkyl-Halide-1"));
		nodes.push(new RoadMapNode(400, 250, "#f27e3f", "Ether-1"));
		nodes.push(new RoadMapNode(200, 250, "#9e0505", "Secondary-Alcohol-1"));
		nodes.push(new RoadMapNode(300, 0, "#633b26", "Ester-1"));
		nodes.push(new RoadMapNode(400, 50, "#180f6b", "Secondary-Nitrile-1"));
		nodes.push(new RoadMapNode(200, 50, "#f2c11f", "Secondary-Thiol-1"));
		nodes.push(new RoadMapNode(100, 75, "#8c8c8c", "Straight-Alkene-1"));
		nodes.push(new RoadMapNode(150, 160, "#9f26e0", "Secondary-Tosylate-1"));
		nodes.push(new RoadMapNode(500, 125, "#0a6634", "Tertiary-Alkyl-Halide-1"));
		nodes.push(new RoadMapNode(650, 60, "#9e0505", "Tertiary-Alcohol-1"));
		nodes.push(new RoadMapNode(750, 200, "#9f26e0", "Tertiary-Tosylate-1"));
		nodes.push(new RoadMapNode(650, 300, "#8c8c8c", "Branched-Alkene-2"));
		nodes.push(new RoadMapNode(550, 260, "#8c8c8c", "Branched-Alkene-1"));
		nodes.push(new RoadMapNode(580, 350, "#ffffff", "Alkane-1"));
		nodes.push(new RoadMapNode(600, 410, "#0a6634", "Secondary-Alkyl-Halide-2"));
		nodes.push(new RoadMapNode(700, 350, "#9e0505", "Secondary-Alcohol-2"));
		nodes.push(new RoadMapNode(800, 300, "#9e0505", "Diol-1"));
		
		lines.push(new RoadMapLine(nodes[0], nodes[2], "red", "NaOH", "HydroAlide", true));
		lines.push(new RoadMapLine(nodes[2], nodes[0], "blue", "HBr", "AlkylCohol", true));
		lines.push(new RoadMapLine(nodes[0], nodes[1], "red", "NaOR", "WilliHesis", false));
		lines.push(new RoadMapLine(nodes[0], nodes[3], "red", "NaOOR", "EsterAlide", false));
		lines.push(new RoadMapLine(nodes[0], nodes[4], "red", "NaCN", "NitriAlide", false));
		lines.push(new RoadMapLine(nodes[0], nodes[5], "red", "NaSH", "ThiolAlide", false));
		lines.push(new RoadMapLine(nodes[0], nodes[6], "red", "HBr/t-BuOK", "HoffmAtion", false));
		lines.push(new RoadMapLine(nodes[2], nodes[7], "red", "TsCl, py", "TosylCohol", true));
		lines.push(new RoadMapLine(nodes[7], nodes[2], "red", "NaOH", "HydroYlate", true));
		lines.push(new RoadMapLine(nodes[7], nodes[6], "red", "t-BuOK", "AlkenYlate", false));
		
		lines.push(new RoadMapLine(nodes[8], nodes[11], "blue", "t-BuOK", "E1EliH", false));
		lines.push(new RoadMapLine(nodes[8], nodes[12], "blue", "NaOH", "E1EliZ", false));
		lines.push(new RoadMapLine(nodes[8], nodes[9], "red", "H2O", "HydroAlideT", true));
		lines.push(new RoadMapLine(nodes[9], nodes[8], "red", "HBr", "AlkylCoholT", true));
		lines.push(new RoadMapLine(nodes[9], nodes[10], "grey", "N/A", "HoffmAtion", false));
		lines.push(new RoadMapLine(nodes[9], nodes[11], "blue", "conc. H2SO4", "AlkenCohol", false));
		lines.push(new RoadMapLine(nodes[10], nodes[11], "blue", "NaOH", "E1EliTsZ", false));
		lines.push(new RoadMapLine(nodes[10], nodes[12], "grey", "N/A", "HoffmAtion", false));
		
		var tempLine = new RoadMapLine(nodes[0], nodes[1], "blue", "Hydrolysis of an Alkyl Halide");
		var tempInfo = new InfoScreen(720, 1080, tempLine);
		var legend = new Legend(720);
		this.entities.push(new RoadMap(nodes, lines));
		this.entities.push(tempInfo);
		this.entities.push(legend);
		this.isShown = true;
	}
	else if(this.type = 2)
	{
		this.entities.push(new Menu());
	}
	
	/**
		Draw the screen... onscreen
		
		@param {int} mouseX - The x coordinate of the mouse
		@param {int} mouseY - The y coordinate of the mouse
	*/
	this.draw = function(mouseX, mouseY)
	{
		
		if(this.type == 1)
		{
			var frontGrad = context.createLinearGradient(0, 0, 0, 360);
			frontGrad.addColorStop(0, "#5a9d2d");
			frontGrad.addColorStop(1, "#ecf5ed");
			context.fillStyle = frontGrad;
			context.fillRect(0, 0, 1080, 720);
			context.fillRect(0, 0, canDiv.width, canDiv.height);
		}
		
		for(var i = 0; i < this.entities.length; i++)
		{
			this.entities[i].draw();
		}
	}
	
	/**
		Updates all of the components of the screen with every tick
		
		@param {int} mouseX - The x coordinate of the mouse
		@param {int} mouseY - The y coordinate of the mouse
		@param {boolean} mouseOver - Whether or not the mouse is on the canvas or not
	*/
	this.update = function(mouseX, mouseY, mouseOver)
	{
		for(var i = 0; i < this.entities.length; i++)
		{
			this.entities[i].update(mouseX, mouseY, mouseOver);
		}
	}
	
	/**
		Updates all of the components of the screen if the mouse is clicked
		
		@param {int} mouseX - The x coordinate of the mouse
		@param {int} mouseY - The y coordinate of the mouse
	*/
	this.clickUpdate = function(mouseX, mouseY)
	{
		for(var i = 0; i < this.entities.length; i++)
		{
			this.entities[i].clickUpdate(mouseX, mouseY);
		}
	}
}

/**
	Displays the top menu
	
	@param {boolean} dropDownHighlighted - Whether or not the button that drops another screen down is highlighted
	@param {boolean} infoScreenHighlighted - Whether or not the button that toggles the info screen in highlighted
	@param {String} infoScreenCharacter - A list of characters shown under certain conditions when the button is displayed
		Indexices:
			[0] - Infoscreen (Closed)
			[1] - Infoscreen (Open)
	@param {integer} infoScreenCharacterIndex - The current character shown for the Info Screen Button
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
			screens[1].entities[0].targetY = (screens[1].entities[0].targetY + canvas.height) % (canvas.height * 2);
		}
		else if(mouseX > this.width - this.width / 15 && mouseX < this.width && mouseY > 0 && mouseY < this.height)
		{
			for(var i = 0; i < screens[0].entities.length; i++)
			{
				if(screens[0].entities[i].id == "infoscreen")
				{
					screens[0].entities[i].updateVisible();
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

/**
	The node of a compound
	@param {image} nodeImage - An image of the respective compound
	@param {color} color - The color of the node
	@param {integer} offsetX - The additional X value of the node depending on the mouses direction
	@param {integer} offsetY - The additional Y value of the node depending on the mouses direction
	@param {boolean} clicked - Whether or not the node has been clicked
	@param {RoadMap} map - The map that contains the respective node
	@param {boolean} hovering - Whether or not the cursor is hovering over the node
	@param {CompoundEnum} info - Any info for the respective compound
	@param {double} imageTransparancy - The transparency of the image when shown
	
	@constant {integer} HOVER_TRANSPARENCY - The maximum transparency the image may have when hovered over
		:1
	@constant {integer} NONHOVER_TRANSPARENCY - The minimum transparency the image may have when not hovered over
		:0
	@constant SMALL_SIZE - The minimum length the node may be.
		:10
	@constant BIG_SIZE - The maximum length the node may be.
		:20
*/
function RoadMapNode(x, y, color, imageId)
{
	this.nodeImage = document.getElementById(imageId+"-icon");
	this.color = color;
	this.offsetX = 0;
	this.offsetY = 0;
	this.offsetX = 0;
	this.offsetY = 0;
	this.clicked = false;
	this.map = new RoadMap([], []);
	this.hovering = false;
	this.info = imageId;
	this.imageTransparancy = 0;
	
	/**Screen is an entity with the following initial properties
			x - Given
			y - Given
			height - 10px
			width - 10px
			color - Given
			id - ROADMAPNODE
	*/
	Entity.call(this, x, y, 15, 15, color, entityEnums.ROADMAPNODE);
	
	const HOVER_TRANSPARANCY = 1;
	const NONHOVER_TRANSPARANCY = 0;
	const SMALL_SIZE = 15;
	const BIG_SIZE = 30;
	
	this.draw = function()
	{
		context.fillStyle = this.color;	
		context.strokeStyle = "black";
		context.beginPath();
		context.arc((this.x + this.offsetX) * this.map.zoom + this.map.globalOffsetX, (this.y + this.offsetY) * this.map.zoom + this.map.globalOffsetY, this.width * this.map.zoom, this.height * this.map.zoom, 0, 2* Math.PI);
		context.fill();
		context.stroke();
		context.fillStyle = "rgba(255, 255, 255)";
		context.globalAlpha = this.imageTransparancy;
		context.fillRect((((this.x + this.offsetX) - (this.nodeImage.width / 2)) * this.map.zoom) + this.map.globalOffsetX, ((this.y + this.offsetY) + (this.nodeImage.height / 2)) * this.map.zoom + this.map.globalOffsetY, this.nodeImage.width * this.map.zoom, this.nodeImage.height * this.map.zoom);
		context.drawImage(this.nodeImage, (((this.x + this.offsetX) - (this.nodeImage.width / 2)) * this.map.zoom) + this.map.globalOffsetX, ((this.y + this.offsetY) + (this.nodeImage.height / 2)) * this.map.zoom + this.map.globalOffsetY, this.nodeImage.width * this.map.zoom, this.nodeImage.height * this.map.zoom);
		context.globalAlpha = 1.0;
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
		
		if(this.hovering && this.imageTransparancy != 1)
		{
			var transDifference = HOVER_TRANSPARANCY - this.imageTransparancy;
			this.imageTransparancy = this.imageTransparancy + (transDifference / 4);
		}
		else if(!this.hoverinf && this.imageTransparency != 0)
		{
			var transDifference = this.imageTransparancy - NONHOVER_TRANSPARANCY;
			this.imageTransparancy = this.imageTransparancy - (transDifference / 4);
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
			for(var i = 0; i < screens[0].entities.length; i++)
			{
				if(screens[0].entities[i].id == "infoscreen")
				{
					if(!screens[0].entities[i].madeVisible)
					{
						screens[0].entities[i].madeVisible = true;
					}
					screens[0].entities[i].compoundMechanismOrNil = 1;
					screens[0].entities[i].reference = document.getElementById(this.info);
				}
			}
		}
	}
}

/**
	A line that represents a chemical mechanism
	
	@param {RoadMap} roadMap - Refers to the map the line comes from
	@param {Node} nodeFrom - The starting node
	@param {Node} nodeTo - The ending node
	@param {int} fromWidth - The width of the line at the from-Node end
	@param {int} toWidth - The width of the line at the to-Node end
	@param {String} name - The name of the mechanism
	@param {Color} color - The color of the line
	@param {MechanismEnum} info - Any information about the mechanism
	@param {boolean} isTwoWayReaction - Whether or not there is another reaction that goes the opposite direction
*/
function RoadMapLine(nodeFrom, nodeTo, color, name, id, isTwoWayReaction, roadMap)
{
	this.roadMap = new RoadMap([], []);
	this.nodeFrom = nodeFrom;
	this.nodeTo = nodeTo;
	this.fromWidth = 10;
	this.toWidth = 2;
	this.name = name;
	this.color = color;
	this.info = id;
	this.isTwoWayReaction = isTwoWayReaction;
	Entity.call(this, -1, -1, 10, 10, color, entityEnums.ROADMAPLINE);
	
	this.textAlpha = 1.0;
	this.selected = false;
	this.map = new RoadMap([], []);
	const TEXT_ALPHA_BIG = 1.0;
	const TEXT_ALPHA_SMALL = 0.0;
	const WIDTH_FROM_BIG = 18;
	const WIDTH_FROM_SMALL = 10;
	const WIDTH_TO_BIG = 4;
	const WIDTH_TO_SMALL = 2;
	
	this.draw = function()
	{
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
			if(this.isTwoWayReaction && widthDiff < 0)
			{
				context.translate(0, (20 * this.map.zoom));
			}
			else
			{
				context.translate(0, -13 * this.map.zoom);
			}
			context.font = "12px Tahoma";
			context.fillStyle = "rgb(0, 0, 0)";
			context.textAlign = "center";
			context.fillText(this.name, 0, 0);
			if(this.isTwoWayReaction && widthDiff < 0)
			{
				context.translate(0, -20 * this.map.zoom);
			}
			else
			{
				context.translate(0, 13 * this.map.zoom);
			}
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
			if(this.cursorOver(mouseX, mouseY) && (this.fromWidth != WIDTH_FROM_BIG || this.toWidth != WIDTH_TO_BIG))
			{
				var sizeChangeFrom = WIDTH_FROM_BIG - this.fromWidth;
				var sizeChangeTo = WIDTH_TO_BIG - this.toWidth;
				this.fromWidth = this.fromWidth + sizeChangeFrom / 4;
				this.toWidth = this.toWidth + sizeChangeTo / 4;
			}
			else if(!this.cursorOver(mouseX, mouseY) && (this.fromWidth != WIDTH_FROM_SMALL || this.toWidth != WIDTH_TO_SMALL))
			{
				var sizeChange1 = this.fromWidth - WIDTH_FROM_SMALL;
				var sizeChange2 = this.toWidth - WIDTH_TO_SMALL;
				this.fromWidth = this.fromWidth - sizeChange1 / 4;
				this.toWidth = this.toWidth - sizeChange2 / 4;
				
			}
		}
		else if(this.nodeFrom.hovering)
		{
			var sizeChangeFrom = WIDTH_FROM_BIG - this.fromWidth;
			this.fromWidth = this.fromWidth + sizeChangeFrom / 4;
		}
		else if(this.nodeTo.hovering)
		{
			var sizeChangeTo = WIDTH_TO_BIG - this.toWidth;
			this.toWidth = this.toWidth + sizeChangeTo / 4;
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
		
		if(this.isTwoWayReaction)
		{
			if(widthDiff != 0 && heightDiff != 0)
			{
				if((widthDiff < 0 && heightDiff >= 0) || (widthDiff > 0 && heightDiff > 0))
				{
					deg += (Math.PI / 2);
				}
				else
				{
					deg -= (Math.PI / 2);
				}
				fromX += 7 * Math.sin(deg);
				fromY += 7 * Math.cos(deg);
				toX += 7 * Math.sin(deg);
				toY += 7 * Math.cos(deg);
				
				if((widthDiff < 0 && heightDiff > 0) || (widthDiff > 0 && heightDiff > 0))
				{
					deg -= (Math.PI / 2);
				}
				else
				{
					deg += (Math.PI / 2);
				}	
			}
			else
			{
				var Xadd = 7 * widthDiff / Math.abs(widthDiff);
				var Yadd = 7 * heightDiff / Math.abs(heightDiff);
				
				console.log(Xadd, Yadd);
				if(!isNaN(Xadd))
				{
					fromY += Xadd;
					toY += Xadd;
				}
				
				if(!isNaN(Yadd))
				{
					fromX += Yadd;
					toX += Yadd;
				}
			}
		}
		
		//Makes the actual line
		context.lineWidth = 2;
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
			for(var i = 0; i < screens[0].entities.length; i++)
			{
				if(screens[0].entities[i].id == "infoscreen")
				{
					if(!screens[0].entities[i].madeVisible)
					{
						screens[0].entities[i].madeVisible = true;
					}
					screens[0].entities[i].compoundMechanismOrNil = 2;
					console.log(this.info);
					console.log(document.getElementById(this.info));
					screens[0].entities[i].reference = document.getElementById(this.info);
				}
			}
		}
	}
}


/**
	The system of nodes and lines that make up the Chemistree
	
	@param {Node[]} nodes - The nodes of the road map
	@param {int} numberOfNodes - The number of nodes the road map has
	@param {Line[]} lines - The lines of the road map
	@param {int} numberOfLines - The number of lines the road map has
	@param {double} zoom - How zoomed in the road map is
		0.1 <= zoom <= 5
	@param {int} globalOffsetX - The x-coord offset of the offset of the road map
	@param {int} globalOffsetY - The y-coord offset of the offset of the road map
	@param {int} startGlobalOffsetX - A placeholder for the x-coord globalOffset
	@param {int} startGlobalOffsetY - A placeholder for the y-coord globalOffset
*/
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

function CreditsScreen()
{
	Entity.call(this, 0, -720, 1080, 720, null, entityEnums.CREDITSSCREEN);
	this.creditsImage = document.getElementById("Chemistree-Credits");
	this.offsetY = this.width;
	this.targetY = this.y;
	console.log(this.y);
	
	this.draw = function()
	{
		context.fillRect(this.x, this.y, this.width, this.height);
		context.drawImage(this.creditsImage, this.x, this.y);
		
	}
	
	this.update = function(mouseX, mouseY, mouseOut)
	{
		if(this.y != this.targetY)
		{
			var difference = -this.targetY - this.y;
			var change = difference / 6;
			this.y += change;
			console.log(this.y);
		}
	}
		
	this.clickUpdate = function(mouseX, mouseY)
	{
		
	}
}

/**
	A bar that shows information about a compound or mechanism
	
	@param {boolean} madeVisible - Whether or not the info screen should be toggled on
	@param {int} compoundMechanismOrNil - Determines whether a compound, mechanism, or neither is being displayed
		1 - Compound
		2 - Mechanism
		3 - Intro
	@param {image} infoImage - The image of the compound or mechanism being displayed
	@param {id} reference - What compound or mechanism is being displayed
	
	@const {int} INVISIBLEX - The target x-coord when toggled on
		:1080
	@const {int} VISIBLEX - The target x-coord when toggled off
		:1080 - width of the screen
*/

function InfoScreen(height, width, line)
{
	Entity.call(this, width - 400, 25, 400, height - 25, "#add285", entityEnums.INFOSCREEN);
	
	this.madeVisible = true;
	this.compoundMechanismOrNil = 3;
	this.infoImage = "";
	this.reference = "";
	this.INVISIBLEX = 1080;
	this.VISIBLEX = 1080 - this.width;
	this.offsetY = 0;
	
	this.draw = function()
	{
		context.fillStyle = "#4a7821";
		context.fillRect(this.x, this.y, this.width, this.height);
		if(this.compoundMechanismOrNil <= 2)
		{
			var mechanismImage = this.reference;
			var proportion = 400 / mechanismImage.width;
			context.drawImage(mechanismImage, this.x, this.y, Math.floor(mechanismImage.width * proportion), Math.floor(mechanismImage.height * proportion));
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
	
	this.clickUpdate = function(mouseX, mouseY)
	{
		
	}
	
	this.updateVisible = function()
	{
		this.madeVisible = !this.madeVisible;
	}
}

function Legend(height)
{
	Entity.call(this, 20, height - 320, 200, 300, "red", entityEnums.LEGEND);
	this.enabled = true;
	
	this.draw = function()
	{
		context.fillStyle = "rgba(200, 200, 200, 0.5)";
		context.fillRect(this.x, this.y, this.width, this.height);
		var temp = document.getElementById("Legend");
		context.drawImage(temp, this.x, this.y, this.width, this.height);
	}
	
	this.update = function(mouseX, mouseY, mouseOut){
		
	}
	
	this.clickUpdate = function(mouseX, mouseY)
	{
		
	}
	
}

setInterval(draw, 50);