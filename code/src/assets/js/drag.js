const $=require("jquery");
function Draggable(element){
	this.ele = $(element);
	this.is_list = (this.ele[0].tagName == "UL");
	this.areas = [];
}

Draggable.prototype = {
	__init__:function(){
		if(this.is_list){
			this.ele.children().append("<div class='drag_area'></div>")
		}
		//this.ele.children().after("<div class='placeholder'></div>");
		//this.ele.prepend("<div class='placeholder'></div>");
		//this.ele.children().attr("draggable","true");
		for(let i = 0; i < this.ele.find(".drag_area").length; i++){
			new DragHandle(this.ele.find(".drag_area")[i]);
		}

	}
}

function DragHandle(element, scale=.5, stop_box_obj, info){
	this.ele = $(element);
	this.stop_box_obj = stop_box_obj;
	this.scale = scale;
	this.info = info;

	this.parent = this.ele.parent();
	this.height = this.ele.css("height");
	this.timecount=null;
	this.ui = {};
	this.ui.position = {top:this.parent[0].offsetTop, left:this.parent[0].offsetLeft};
	this.ui.clientposition = {top:this.parent[0].clientTop, left:this.parent[0].clientLeft};
	this.ui.height = this.parent[0].offsetHeight;
	this.ui.width = this.parent[0].offsetWidth;
	this.ui.size = {height:this.parent.css("height"), width:this.parent.css("width")};
	this.is_drag = false;
	this.allow_drag = true;
	this.root=document.getElementById("right_board");
	this.__init__();
	console.log(this.ui.position)
	var temp = this.parent;
	this.fake_dom = $("<div class='fake_scene_dom'></div>")

	$('body').append(this.fake_dom);
	this.offset = {top:0, left:0};
	while(temp[0].nodeName != "#document"){
		this.offset.top += temp[0].clientTop;
		this.offset.left += temp[0].clientLeft;
		this.offset.top += temp[0].scrollTop;
		this.offset.left += temp[0].scrollLeft;
		temp = temp.parent();
	}
	this.offset.left+=this.root.offsetLeft;
}
DragHandle.prototype = {
    can_drag:function(){
        that.allow_drag = true;
        $(that.ele).css("background","#3F51B5");
    },
	__init__:function(){
		var that = this;
		this.ele.on("drag", function(){})
		this.ele.mousedown(function(event){

			$(that.ele).animate({height:"100%"},"fast");
			if(!that.allow_drag){
			return;};
			var temp = that.parent;


            that.offset = {top:0, left:0};
            while(temp[0].nodeName != "#document"){
                that.offset.top += temp[0].clientTop;
                that.offset.left += temp[0].clientLeft;
                that.offset.top -= temp[0].scrollTop;
                that.offset.left -= temp[0].scrollLeft;
                temp = temp.parent();
            }

			that.offset.left+=that.root.offsetLeft;
            that.ui.position = {top:that.parent[0].offsetTop, left:that.parent[0].offsetLeft};
	        that.ui.clientposition = {top:that.parent[0].clientTop, left:that.parent[0].clientLeft};
			var left_ = event.pageX;
			var top_ = event.pageY;
			that.fake_dom.css({top:top_,left: left_,opacity:1,zIndex:100});
			that.parent.animate({"opacity":0,height:that.ui.height * that.scale},'fast');
			that.fake_dom.animate({height:that.ui.height * that.scale, width:that.ui.width * that.scale,marginLeft:-(that.ui.width*that.scale/2),marginTop:-(that.ui.height*that.scale/2)},"fast")
			that.offset_x = event.pageX - that.ui.clientposition.left-left_;
			that.offset_y = event.pageY - that.ui.clientposition.top-top_;
            that.is_drag = true;
			that.stop_box_obj.highlight();
            $(document).mousemove(function(event){
                if(!that.allow_drag){
                return;};
                if(!that.is_drag){return;}
                that.fake_dom.css({top:event.pageY - that.offset_y,left:event.pageX - that.offset_x})
                that.stop_box_obj != null && that.stop_box_obj.in_box(that.fake_dom);
            })
		})
		$(document).mouseup(function(){
			that.ele.animate({height:that.height},"fast");
			that.stop_box_obj.stop_highlight();
				if(!that.allow_drag){
					return;};
				if(!that.is_drag){return;}


				that.is_drag = false;
				// that.ele.animate({height:that.height},"fast");
//				if(that.stop_box_obj != null && that.stop_box_obj.in_box(that.parent)){
//				    that.parent.animate({height:that.ui.size.height, width:that.ui.size.width},"fast")}
//				else{
					that.parent.animate({"opacity":1,height:that.ui.size.height},'fast');
				    that.fake_dom.css({"opacity":0,'z-index':-1});
				    that.parent.css("z-index", 0);
//				}
                if(that.stop_box_obj != null && that.stop_box_obj.in_box_finally(that.fake_dom, that.info)){
                $(that.ele).css("background","#EEE");
                    that.allow_drag = false;
                };
				$(document).mousemove(function(){return null;});
				$(document).mouseup(function(){return null;});
			})
	}
}



function DragHandle2(element, scale=1, stop_box_obj, info){
	this.ele = $(element);
	this.stop_box_obj = stop_box_obj;
	this.scale = scale;
	this.info = info;

	this.parent = this.ele.parent();
	this.height = this.ele.css("height");
	this.timecount=null;
	this.ui = {};
	this.ui.position = {top:this.ele[0].offsetTop, left:this.ele[0].offsetLeft};
	this.ui.clientposition = {top:this.ele[0].clientTop, left:this.ele[0].clientLeft};
	this.ui.height = this.ele[0].offsetHeight;
	this.ui.width = this.ele[0].offsetWidth;
	this.ui.size = {height:this.ele.css("height"), width:this.ele.css("width")};
	this.is_drag = false;
	this.allow_drag = false;
	this.root=document.getElementById("right_board");
	this.__init__();

	var temp = this.parent;
	this.fake_dom = $("<div class='fake_tool_dom' style='background-image:"+this.ele.css('background-image')+"'></div>")
	$('body').append(this.fake_dom);
	this.offset = {top:0, left:0};
	while(temp[0].nodeName != "#document"){
		this.offset.top += temp[0].clientTop;
		this.offset.left += temp[0].clientLeft;
		this.offset.top += temp[0].scrollTop;
		this.offset.left += temp[0].scrollLeft;
		temp = temp.parent();
	}
	this.offset.left+=this.root.offsetLeft;
}
DragHandle2.prototype = {
    can_drag:function(){
        that.allow_drag = false;
        $(that.ele).css("background","#3F51B5");
    },
	__init__:function(){
		var that = this;
		
		

		this.ele.on("drag", function(){})
		this.ele.mousedown(function(event){

			that.allow_drag = true;
			var temp = that.parent;
            that.offset = {top:0, left:0};
            while(temp[0].nodeName != "#document"){
                that.offset.top += temp[0].clientTop;
                that.offset.left += temp[0].clientLeft;
                that.offset.top -= temp[0].scrollTop;
                that.offset.left -= temp[0].scrollLeft;
                temp = temp.parent();
            }
			that.offset.left+=that.root.offsetLeft;
            that.ui.position = {top:that.ele[0].offsetTop, left:that.ele[0].offsetLeft};
	        that.ui.clientposition = {top:that.ele[0].clientTop, left:that.ele[0].clientLeft};
			var left_ = event.pageX;
			var top_ = event.pageY;
			that.fake_dom.css({top:top_,left: left_,opacity:1,zIndex:100});
			that.ele.animate({"opacity":0,"transform":"scale(.8)"},'fast');
			that.fake_dom.animate({height:that.ui.height * that.scale, width:that.ui.width * that.scale,marginLeft:-(that.ui.width*that.scale/2),marginTop:-(that.ui.height*that.scale/2)},"fast")

			that.offset_x = event.pageX - that.ui.clientposition.left-left_;
			that.offset_y = event.pageY - that.ui.clientposition.top-top_;
            that.is_drag = true;
			that.stop_box_obj.highlight();
            $(document).mousemove(function(event){
                if(!that.allow_drag){
					return;};
                if(!that.is_drag){return;}
                that.fake_dom.css({top:event.pageY - that.offset_y,left:event.pageX - that.offset_x})
                that.stop_box_obj != null && that.stop_box_obj.in_box(that.fake_dom);
            })
		})
		$(document).mouseup(function(){
			that.stop_box_obj.stop_highlight();
            if(!that.allow_drag){
                return;};
				that.is_drag = false;
//				if(that.stop_box_obj != null && that.stop_box_obj.in_box(that.parent)){
//				    that.parent.animate({height:that.ui.size.height, width:that.ui.size.width},"fast")}
//				else{
					that.ele.animate({"opacity":1,height:that.ui.size.height},'fast');
					that.fake_dom.css({"opacity":0,'z-index':-1});
					that.ele.css("z-index", 0);
//				}
                if(that.stop_box_obj != null && that.stop_box_obj.in_box_finally(that.fake_dom, that.info)){
                    that.allow_drag = false;
                };
				$(document).mousemove(function(){return null;});
				$(document).mouseup(function(){return null;});
			})
	}
}

export default{
	"draghandle1":DragHandle,
	"draghandle2":DragHandle2
}
