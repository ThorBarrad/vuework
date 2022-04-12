var E = window.wangEditor;

var tip_b = $("#tip_b");
function tip(msg){
    tip_b.css({"top":10});
    tip_b.text(msg);

    setTimeout(function(){
        tip_b.css({"top":-100});
    },1000);
}



// Tip

function Tip(parent, msg){
    /*
        msg:{main:"", detail:""}
    */
    this.parent_dom = $(parent)
    this.main_dom = $("<div class='item'></div>")
    this.title_dom = $("<div class='item_title'></div>")
    this.detail_dom  = $("<div class='item_content'></div>")
    this.msg = msg;
    this.closed = true;
    this.__init__();
}

Tip.prototype = {
    __init__:function(){
        this.parent_dom.append(this.main_dom);
        this.main_dom.append(this.title_dom);
        this.main_dom.append(this.detail_dom);
        this.detail_dom.text(this.msg.detail);
        this.title_dom.text(this.msg.main);
        var that = this;
        this.title_dom.on("click", function(){
            if(that.closed){
                that.detail_dom.css("max-height", "100px");
                that.closed = false;
            }
            else{
                that.detail_dom.css("max-height", "0px");
                that.closed = true;
            }
        })
    }
}


// t = new Tip(".scene_tips_board",{main:"title", detail:"this is details."});
function Editor(){
this.name = null;
this.main_roles = []
this.scene = null;
this.weather = null;
this.time = null;
this.all_scene = null;
this.all_weather = null;
this.app = null;

}

Editor.prototype = {
    __init__:function(obj){
        for(var key in obj){
            this[key] = obj[key];
        }

        this.editor = new E('#editor')
        this.editor.customConfig.menus = [
            'bold',
            'italic',
            'underline',  // 下划线
            'strikeThrough',  // 删除线
            'foreColor',  // 文字颜色
            'undo',  // 撤销
            'redo'  // 重复
        ]
        this.editor.create();
        this.editor.$textContainerElem[0].style.height = "calc(100% - 31px)";
        this.editor.$textContainerElem[0].style.border = "0px";
        this.editor.$toolbarElem[0].style.border = "0px";
        this.__init_menu__();
        var that = this;

        // association function
        var association_btn = $("<div class='w-e-menu' style='z-index:10001;'><i class='w-e-icon-association'></i></div>")
        $(this.editor.$toolbarElem[0]).append(association_btn);
        var association_flag = false;

        association_btn.on("click", function(){
            if(association_flag){
                tip("联想功能关闭");
                association_btn.find("i").css("color","#999");
                association_flag = false;
            }else{
                association_btn.find("i").css("color","#fbc02d");
                tip("联想功能打开");
                association_flag = true;
            }
        })

        this.editor.$textContainerElem[0].oncontextmenu = function (ev) {
            //阻止鼠标的默认事件
            ev.preventDefault();
            that.menu.css({"display":"block","top":ev.pageY, "left":ev.pageX});
        }

        this.editor.$textContainerElem[0].onclick = function (ev) {
            //阻止鼠标的默认事件
            ev.preventDefault();
            that.menu.css("display","none");
        }

        this.form = new Vue({
            el:'#info_form',
            data:{
                name:that.name,
                main_roles:that.main_roles,
                scene:that.scene,
                weather:that.weather,
                time:that.time,
                all_scene:that.all_scene,
                all_weather:that.all_weather
            },
            methods:{
                del_main_role:function(name){
                    var idx=this.main_roles.indexOf(name);
                    if(idx!=-1){
                        this.main_roles.splice(idx,1);
                    }
                },
                push_main_role:function(ev){
                    var name=ev.path[0].value;
                    var idx=this.main_roles.indexOf(name);
                    if (name == ""){
                        idx=1;
                    }
                    if(idx==-1){
                    this.main_roles.push(name);
                    ev.path[0].value = "";
                    }else{
                        ev.path[0].style.background = "#E57373";
                        setTimeout(function(){
                            ev.path[0].style.background = "#009688";
                        },500);
                    }
                }
            }
        })
    },
    __init_menu__:function(){
        this.selection = window.getSelection();
        this.tag=$("<div class='item'><div class='icon'></div><div class='text'>Tag</div></div>");
        this.menu=$("<div class='menu' style='display:none;'></div>")


        this.menu.append(this.tag);
        $(document.body).append(this.menu);
    }
}

function Sentence(){
this.role=null;
this.words=null;
this.relations=null;
};

Sentence.prototype={
__init__:function(obj){
for(let i in obj){this[i]=obj[i]};
}
}

function Word(){
this.text=null;
this.pos=null;
this.type=null;
this.content=null;
};
Word.prototype={
__init__:function(){
    this.dom=$("<span></span>");
    this.dom.text(this.text);
}
}

e = new Editor();
var obj = {
name:"chan",
main_roles:["lxh","hyj","djs"],
scene:1,
weather:"sunny",
time:"long long age",
}
e.__init__(obj);

