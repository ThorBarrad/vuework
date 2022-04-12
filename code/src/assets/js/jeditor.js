$("#new_jumu").on("click",function(){
$("#add_new_jumu_board").css("display", "block")
})
$("#new_juji").on("click",function(){
$("#add_new_juji_board").css("display", "block")
})

$("#new_chang").on("click",function(){
$("#add_new_chang_board").css("display", "block")
})
function Edit_Board(name){
this.jumuid = null;
this.jujiid = null;
this.name = name;
this.main_dom = $("<div class='msgBox' id='edit_jumu_board' style='display:none;z-index:11;'></div>")
$("body").append(this.main_dom);

this.close_btn_dom = $("<div class='btn close_btn'></div>");
var that = this;
this.close_btn_dom.on("click", function(){that.close();});
this.form = $("<div class='form'></div>");
this.btn = $("<div class='btn submit_btn'>submit</div>");
this.todo = null;
this.btn.on("click",function(){that.todo();});
this.item = {};
this.done();
}

Edit_Board.prototype = {
add_item:function(title, value, name){

    var item = $("<div class='item''></div>");
    var item_title = $("<div class='item_title'>"+title+"</div>");
    var item_content = $("<div class='item_content'></div>");
    var input = $("<input type='text' value='"+value+"' />")
    this.item[name] = input;

    item.append(item_title);
    item_content.append(this.item[name])
    item.append(item_content);
    this.form.append(item)
},
add_confirm_event:function(todo){
    this.todo = todo;
},
done:function(){
this.main_dom.append(this.close_btn_dom);
this.main_dom.append("<div class='title'>"+this.name+"</div>")
this.main_dom.append(this.form);
var container_btn = $("<div style='height:40px;margin:10px;margin-top:20px;'></div>");
container_btn.append(this.btn);
this.main_dom.append(container_btn);
},
reset:function(){
this.form.html("");
this.item = {};
this.todo = null;
},
warning:function(){
alert("!");
},
close:function(){
this.main_dom.css("display", "none");
},
show:function(){
this.main_dom.css("display", "block");
},
get_info:function(){
var item2 = {};
for(let name in this.item){
item2[name] = this.item[name].val();
}
return item2;
}

}

var edit_jumu = new Edit_Board("编辑剧目");
var edit_juji = new Edit_Board("编辑剧集");

function Jumu(){
this.parent = $(".item_board");

this.id=null;
this.drama_name = null;
this.author_id = null;
this.main_roles = null;
this.drama_theme = null;
this.drama_type = null;
this.c_time = null;
this.u_time = null;
}

Jumu.prototype = {
    __init__ : function(obj){
        for(var key in obj){
            this[key] = obj[key];
        }
    },
    create:function(){
        this.jumu_dom = $("<div class='jumu_item'>")
        this.download_dom = $("<div class='btn'>下载</div>")
        this.edit_dom = $("<div class='btn'>编辑</div>")
        this.delete_dom = $("<div class='btn'>删除</div>")
        this.coverdom = $("<div class='cover-loading' style='display:none;' id='delete_cover'></div>");
        var that = this;
        this.download_dom.on("click", function(){
            that.download_();
        });
        this.edit_dom.on("click", function(){
            that.edit_();
        });
        this.delete_dom.on("click", function(){
            that.delete_();
        });
        var menu = $("<div class='hidden_menu'></div>");
        menu.append(this.download_dom);
        menu.append(this.edit_dom);
        menu.append(this.delete_dom);
        this.titledom = $("<div class='title'>"+this.drama_name+"</div>");
        this.titledom.on("click",function(){
            window.location.href = "/jeditor/drama/"+that.id;
        })
        this.jumu_dom.append(this.titledom);
        this.jumu_dom.append("<div class='c_time'>"+this.c_time+"</div>")
        this.jumu_dom.append(menu)
        this.parent.append(this.jumu_dom)
    },
    edit_:function(){
        if(edit_jumu.jumuid != this.id){
        edit_jumu.reset();
        edit_jumu.jumuid = this.id;
        edit_jumu.add_item("剧目名称", this.drama_name, "drama_name");
        var that = this;
        edit_jumu.add_confirm_event(function(){alert(that.drama_name)})
        }
        edit_jumu.show();
    },
    delete_:function(){
        var that = this;
        delete_board.change_todo(function(){
            delete_board.coverdom.css("display","block");
            $.ajax({
            type:"POST",
            url:"/jeditor/api/deletedrama/"+that.id,
            async:true,
            success:function(returndata){
                console.log(returndata);
                that.jumu_dom.css({"transition":"ease .3s", "width":0});
                setTimeout(function(){that.jumu_dom.remove();}, 1000);
            }
            })
            delete_board.coverdom.css("display","none");
            delete_board.hidden();
            });
        delete_board.show();
    }
}

function Juji(){
this.parent = $(".item_board")
this.id = null;
this.drama_id = null;
this.author_id = null;
this.episode_name = null;
this.main_roles = null;
this.episode_rank = null;
this.c_time = null;
this.u_time = null;
}

Juji.prototype = {
    __init__ : function(obj){
        for(var key in obj){
            this[key] = obj[key];
        }
    },
    create:function(){
        this.juji_dom = $("<div class='jumu_item'>")
        this.download_dom = $("<div class='btn'>下载</div>")
        this.edit_dom = $("<div class='btn'>编辑</div>")
        this.delete_dom = $("<div class='btn'>删除</div>")
        var that = this;
        this.download_dom.on("click", function(){
            that.download_();
        });
        this.edit_dom.on("click", function(){
            that.edit_();
        });
        this.delete_dom.on("click", function(){
            that.delete_();
        });
        var menu = $("<div class='hidden_menu'></div>");
        menu.append(this.download_dom);
        menu.append(this.edit_dom);
        menu.append(this.delete_dom);
        this.juji_dom.append("<div class='title' onclick=\"backto(\'/jeditor/drama/"+this.drama_id+"/" + this.id+"\')\">"+this.episode_name+"</div>")
        this.juji_dom.append("<div class='c_time'>"+this.c_time+"</div>")
        this.juji_dom.append(menu)
        this.parent.append(this.juji_dom)
    },
    edit_:function(){
        if(edit_juji.jujiid != this.id){
        edit_juji.reset();
        edit_juji.jujiid = this.id;
        edit_juji.add_item("剧目名称", this.episode_name, "episode_name");
        var that = this;
        edit_juji.add_confirm_event(function(){alert(that.episode_name)})
        }
        edit_juji.show();
    },
    delete_:function(){
        var that = this;
        delete_board.change_todo(function(){
            delete_board.coverdom.css("display","block");
            $.ajax({
            type:"POST",
            url:"/jeditor/api/deleteepisode/"+that.drama_id + "/" + that.id,
            async:true,
            success:function(returndata){
                console.log(returndata);
                that.juji_dom.css({"transition":"ease .5s", "width":0});
                setTimeout(function(){that.juji_dom.remove();}, 1000);
            }
            })
            delete_board.coverdom.css("display","none");
            delete_board.hidden();
            });
        delete_board.show();
    }
}
