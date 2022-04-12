function Sortable(element){
	this.ele = $(element);
	this.is_list = (this.ele[0].tagName == "UL");
	this.areas = [];
	this.ele.parent().append("<div class='sort_man card-s'></div>");
	this.sort_man = $(this.ele.parent().find(".sort_man")[0]);
	this.sort_man.css({"position":"absolute","display":"none", "box-shadow":"0px 0px 10px -2px rgba(0,0,0,.5)", "z-index":10})
}
Sortable.prototype = {
	__init__:function(){
		if(this.is_list){
			this.ele.children().append("<div class='sort_area'></div>")
		}
		for(let i = 0; i < this.ele.find(".sort_area").length; i++){
			new SortHandle(this.ele.find(".sort_area")[i], this.sort_man);
		}
	},
	
}

function SortHandle(element, sort_man){
	this.ele = $(element);
	this.sort_man = sort_man;
	this.parent = this.ele.parent();
	this.height = this.ele.css("height");
	this.timecount=null;
	this.ui = {};
	this.ui.position = {top:this.parent[0].offsetTop, left:this.parent[0].offsetLeft};
	this.ui.clientposition = {top:this.parent[0].clientTop, left:this.parent[0].clientLeft};
	this.ui.height = this.parent[0].offsetHeight;
	this.ui.width = this.parent[0].offsetWidth;
	this.ui.size = {height:this.parent.css("height"), width:this.parent.css("width")};
	this.is_sort = false;
	this.prev = this.parent.prev();
	this.next = this.parent.next();
	this.__init__();
	this.offset = {top:0, left:0};
	var temp = this.parent.parent();
	while(temp[0].nodeName != "#document"){
		this.offset.top += temp[0].offsetTop;
		this.offset.left += temp[0].offsetLeft;
		temp = temp.parent();
	}
}

SortHandle.prototype = {
	__init__:function(){
		var that = this;
		this.ele.mousedown(function(event){
			$(that.ele).animate({height:"100%"},"fast");
			that.sort_man.css("display","block");
			//that.parent.css("left", that.ui.position.left + that.offset.left - that.ui.width / 2);
			that.parent.css("opacity","0");
			//$(that.ele).animate({height:"100%"},"fast");
			//var left_ = event.pageX - that.offset.left - that.ui.width / 2 - that.ui.position.left;
			that.sort_man.css({left:event.pageX - that.offset.left- that.ui.width/2});
			// that.parent.css("z-index", 10);
			// that.parent.css("position", "absolute");
			// that.offset_x = event.pageX - that.ui.clientposition.left-left_;

			that.sort_man.css("box-shadow", "0px 3px 10px -2px rgba(0, 0, 0, 0.5)");
			that.is_sort = true;
			$(document).mousemove(function(event){
				if(!that.is_sort){return;}
				that.sort_man.css({left:event.pageX - that.offset.left - that.ui.width/2})
				if(that.next.length != 0 && event.pageX > that.next.position().left + that.ui.width/2){
					that.after_sblings(that.next);
				}
				else if(that.prev.length != 0&& event.pageX < that.prev.position().left + that.ui.width/2){
					that.before_sblings(that.prev);
				}

			})
		})
		$(document).mouseup(function(){
				that.is_sort = false;
				that.parent.css("opacity","1");
				that.sort_man.css("display","none");
				//that.parent.animate({height:that.ui.size.height, width:that.ui.size.width, top:0, left:0},"fast")
				that.ele.animate({height:that.height},"fast");
				that.sort_man.css("box-shadow", "0px 0px 0px");
				// setTimeout(function(){
				// 	that.parent.css("position", "relative");
				// 	that.parent.css("left", 0 );
				// }, 300);
				// that.parent.css("z-index", 0);
				// that.parent.css("box-shadow", "0px 0px 0px");
				// $(document).mousemove(function(){return null;});
				// $(document).mouseup(function(){return null;});
			})
	},
	after_sblings:function(prevElement){
		prevElement.after(this.parent);
		this.prev = this.parent.prev();
		this.next = this.parent.next();
		this.ui.position = {top:this.parent[0].offsetTop, left:this.parent[0].offsetLeft};
		this.ui.clientposition = {top:this.parent[0].clientTop, left:this.parent[0].clientLeft};
		this.offset_x = this.offset.left + this.ui.width / 2 + this.ui.position.left  - this.ui.clientposition.left;
	},
	before_sblings:function(nextElement){
		nextElement.before(this.parent);
		this.prev = this.parent.prev();
		this.next = this.parent.next();
		this.ui.position = {top:this.parent[0].offsetTop, left:this.parent[0].offsetLeft};
		this.ui.clientposition = {top:this.parent[0].clientTop, left:this.parent[0].clientLeft};
		this.offset_x = this.offset.left + this.ui.width / 2 + this.ui.position.left  - this.ui.clientposition.left;
	}
}