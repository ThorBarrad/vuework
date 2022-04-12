function ChangListItem(parent_dom){
this.parent = $(parent_dom);
this.title = null;
this.roles_number = null;
this.topic = null;
this.type = null;
this.time = null;
this.changid = null;
}

ChangListItem.prototype = {
    __init__ : function(obj){
        for(var key in obj){
            this[key] = obj[key];
        }
    },
    create:function(){
        this.chang_dom = $("<div class='item'>")
        this.download_dom = $("<div class='btn'>下载</div>")
        this.edit_dom = $("<div class='btn'>编辑</div>")
        this.delete_dom = $("<div class='btn'>删除</div>")
        this.simul_dom = $("<div class='btn'>删除</div>")
        var that = this;
        this.download_dom.on("click", function(){
            that.download();
        });
        this.edit_dom.on("click", function(){
            that.edit();
        });
        this.delete_dom.on("click", function(){
            that.delete();
        });
        var menu = $("<div class='hidden_menu'></div>");
        menu.append(this.download_dom);
        menu.append(this.edit_dom);
        menu.append(this.delete_dom);
        menu.append(this.simul_dom);
        this.chang_dom.append("<div class='title'>"+this.title+"</div>")
        this.chang_dom.append(menu)
        this.parent.append(this.chang_dom)
    }
}

function Anchor(parent_dom, parent_id, position){
this.parent_dom = parent_dom;
this.parent_id = parent_id;
this.position = position;
this.dom = $("<div class='anchor'></div>");
this.lock = false;
}

Anchor.prototype = {
__init__:function(){
this.parentH = this.parent_dom.height();
this.parentW = this.parent_dom.width();
this.pos_transformation = {
"top":{"top":0,"left":this.parentW/2},
"bottom":{"top":this.parentH,"left":this.parentW/2},
"left":{"top":this.parentH/2,"left":0},
"right":{"top":this.parentH/2,"left":this.parentW}
}
this.dom.css(this.pos_transformation[this.position]);
this.parent_dom.append(this.dom);
},
}

function Line(sourceAnchor, targetAnchor, svgdom){
this.stroke = "#2196f4";
this.stroke_width = 2;
this.source = sourceAnchor;
this.target = targetAnchor;
this.svgdom = svgdom;
this.dom = null;
this.arrow_position = {"vertical":"down", "horizontal":"right"}
}
Line.prototype = {
__init__:function(){
this.source_position = {"left" : this.source.dom.position()["left"] + this.source.parent_dom.position()["left"],"top" : this.source.dom.position()["top"] + this.source.parent_dom.position()["top"]}
this.target_position = {"left" : this.target.dom.position()["left"] + this.target.parent_dom.position()["left"],"top" : this.target.dom.position()["top"] + this.target.parent_dom.position()["top"]}
if (this.source_position.top > this.target_position.top){
this.arrow_position["vertical"] = "up";
}
if (this.source_position.left > this.target_position.left){
this.arrow_position["horizontal"] = "left";
}
this.step = {
"left":-10,
"up":-10,
"down":10,
"right":10
}
var that = this;
function addstep(left, top){
return (left + that.step[that.arrow_position["horizontal"]]) + " "+(top + that.step[that.arrow_position["vertical"]])
}
console.log(this.source_position.top,this.arrow_position["vertical"], this.step[this.arrow_position["vertical"]],this.step[this.arrow_position["vertical"]] * 4)
this.dom = this.svgdom.append("path");

this.pathstr = "M"+this.source_position.left+" "+this.source_position.top;
this.source_addition_path = {
"top":"L"+this.source_position.left+" "+(this.source_position.top -10) + " L" +this.source_position.left+" "+(this.source_position.top -10),
"bottom":"L"+this.source_position.left+" "+(this.source_position.top + 10),
"left":{"top":this.parentH/2,"left":0},
"right":{"top":this.parentH/2,"left":this.parentW}
}
this.dom.attr("d","M"+this.source_position.left+" "+this.source_position.top+" L"+this.source_position.left+" "+(this.source_position.top+ this.step[this.arrow_position["vertical"]] * 4)+" L"+(this.target_position.left- this.step[this.arrow_position["horizontal"]])+" "+(this.source_position.top+ this.step[this.arrow_position["vertical"]] * 4) + " L"+(this.target_position.left- this.step[this.arrow_position["horizontal"]])+" "+(this.target_position.top- this.step[this.arrow_position["vertical"]] * 4)+" L"+this.target_position.left+" "+this.target_position.top);
this.dom.style({"stroke": this.stroke, "stroke-width": this.stroke_width, "fill":"transparent"});
this.dom.interpolate("cardinal");
}
}

function StartNode(){
this.nodeid = null;
this.height = 50;
this.width = 100;
this.top = 0;
this.left = 0;
this.dom = $("<div class='normal_node start_node' ></div>");
this.thumbnail_dom = $("<div class='thumbnail_node start_thumbnail_node'></div>");
this.anchor = {"left":null, "right":null, "bottom":null, "top":null};
}

StartNode.prototype = {
__init__:function(){
this.dom.css({"height":this.height, "width":this.width, "top":this.top, "left":this.left});
this.add_anchor("right");
},
add_anchor:function(position){
if(this.anchor[position] == null){
this.anchor[position] = new Anchor(this.dom, this.nodeid, position);
this.anchor[position].__init__();
}
}
}



function EventNode(){
this.nodeid = null;
this.height = 80;
this.width = 150;
this.top = 0;
this.left = 0;
this.dom = $("<div class='normal_node event_node' ></div>");
this.thumbnail_dom = $("<div class='thumbnail_node event_thumbnail_node'></div>");
this.anchor = {"left":null, "right":null, "bottom":null, "top":null};
}

EventNode.prototype = {
__init__:function(){
this.dom.css({"height":this.height, "width":this.width, "top":this.top, "left":this.left});
this.add_anchor("right");
},
add_anchor:function(position){
if(this.anchor[position] == null){
this.anchor[position] = new Anchor(this.dom, this.nodeid, position);
this.anchor[position].__init__();
}
}
}

function ChangEditor(canvasdom,toolbardom){
this.canvasdom = $(canvasdom);
this.toolbardom = $(toolbardom);
this.start_node = new StartNode();
this.demo_node = new EventNode();
}

ChangEditor.prototype = {
__init__:function(){
//init__all comps
this.start_node.__init__();

this.demo_node.__init__();
this.demo_node.dom.css({"top":100})

this.canvas_height = this.canvasdom.height();
this.canvas_width = this.canvasdom.width();
// svg
this.svgdom = d3.select(this.canvasdom[0]).append("svg")
this.svgdom.attr("id","canvas_svg");
this.svgdom.style({"height": this.canvas_height, "width":this.canvas_width, "position":"absolute", "top":0, "left":0,"z-index":1});
// div
this.divdom = $("<div/>")
this.canvasdom.append(this.divdom);
this.divdom.attr("id","canvas_div");
this.divdom.css({"height": this.canvas_height, "width":this.canvas_width, "position":"absolute", "top":0, "left":0,"z-index":2});
//tools bar
this.toolbardom.append(this.start_node.thumbnail_dom);

this.divdom.append(this.start_node.dom);
this.divdom.append(this.demo_node.dom);

this.line = new Line(this.start_node.anchor["right"], this.demo_node.anchor["right"], this.svgdom);
this.line.__init__();

this.enum_map = {
"start":StartNode
}
},
load_from_obj:function(obj){
this.nodes = obj.nodes;
this.links = obj.nodes;

for(var i in this.nodes){
    this.nodes[i]
}
},
}

var changeditor = new ChangEditor("#chang_canvas", "#tool_item_board");
changeditor.__init__();

var obj = {
title :"meiyotitle",
roles_number:1900,
topic:'funny',
type:'haha',
time:'this one',
jumuid : 1,
}

var chang = new ChangListItem("#chang_item_board");
chang.__init__(obj);
chang.create();


var chang_obj = {
nodes:[
{id:1,
type:"changnode",
title:"nanzhujinrudixiacheku"
},
{id:2,
type:"changnode",
title:"nanzhujinrudixiacheku"
},
],
links:[
{source:1, target:2}
]
}

