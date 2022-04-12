import "../index";
const $ = require("jquery");
const Loadding = require("./loadding").default.Loadding;
// var jsPlumb = require("jsplumb").jsPlumb;
// const Storage = window.sessionStorage;
var drag = require("./drag");
var DragHandle = drag.default.draghandle1;
var DragHandle2 = drag.default.draghandle2;
const d3 = require("d3");
var time = new Date();
const path_color = "rgba(0, 0, 0,.5)";
const highlight_path_color = "rgba(0, 0, 0,1)";
const path_width = 2;
const highlight_path_width = 4;
const VueRouter = require('vue-router')

var drama_id = null;
var episode_id = null;

// jsPlumb.Defaults.Overlays=[ ['Arrow', { width: 10, length: 10, location: 0.25 ,fill:path_color}],['Arrow', { width: 10, length: 10, location: 0.75 ,fill:path_color}] ]
// jsPlumb.Defaults.PaintStyle = {stroke:path_color};


function encode(code) {
    return window.btoa(code);
}

function Node_Connection(conn, changeditor) {
    this.conn = conn;
    this.is_modified = false;
    this.conn2 = conn.connector;
    this.changeditor = changeditor;
    this.source_id = parseInt($(conn.source).attr("nid"));
    this.target_id = parseInt($(conn.target).attr("nid"));
    if (changeditor.added_node_set.has(this.source_id)) {
        this.source = changeditor.added_nodes[this.source_id];
    }
    else {
        this.source = changeditor.existed_nodes[this.source_id];
    }

    if (changeditor.added_node_set.has(this.target_id)) {
        this.target = changeditor.added_nodes[this.target_id];
    }
    else {
        this.target = changeditor.existed_nodes[this.target_id];
    }

    this.info = {
        parent_id: parseInt($(conn.source).attr("nid")),
        children_id: parseInt($(conn.target).attr("nid")),
        remark: "",
        is_start: 0,
        is_end: 0,
    }

    if (this.source.info.is_start == 1) {
        this.info.is_start = 1;
    }

    if (this.target.info.is_end == 1) {
        this.info.is_end = 1;
    }

    this.__init__();
}

Node_Connection.prototype = {
    __init__: function () {
        this.conn.content_dom = $("<div class='connection_content'></div>");
        this.content_dom = $("<div class='connection_content_text'></div>");
        this.conn.content_dom.append(this.content_dom);
        this.menu_load();

        var that = this;
        this.source.add_Connection(this);
        this.target.add_Connection(this);

        this.conn.content_dom.mouseenter(function () {
            $(that.conn.connector.path).css({ "stroke": highlight_path_color, "stroke-width": highlight_path_width });
        })
        this.conn.content_dom.mouseleave(function () {
            $(that.conn.connector.path).css({ "stroke": path_color, "stroke-width": path_width });
        })

        $(that.conn.connector.path).mouseenter(function () {
            $(that.conn.connector.path).css({ "stroke": highlight_path_color, "stroke-width": highlight_path_width });
            that.content_dom.css({ "background": "rgba(0,0,0,0.2)" });
        })
        $(that.conn.connector.path).mouseleave(function () {
            $(that.conn.connector.path).css({ "stroke": path_color, "stroke-width": path_width });
            that.content_dom.css({ "background": "rgba(0,0,0,0)" });
        })

        this.changeditor.divdom.append(this.conn.content_dom);

        this.conn.content_dom.css({ "top": (this.conn2.y + (this.conn2.h + 2) / 2), "left": (this.conn2.x + this.conn2.w / 2) })
        if (this.conn2.w > this.conn2.h) {
            this.content_dom.css({ "top": 20, "text-align": "center", "text-indent": 0 });
        }
        else {
            this.content_dom.css({ "left": 90, "text-align": "left", "text-indent": 10 });
        }
    },
    init_remark:function(remark){
        this.info.remark=remark;
        this.remark_default=remark;
        this.content_dom.text(remark);
    },
    resetpos: function () {
        this.conn.content_dom.css({ "top": (this.conn2.y + (this.conn2.h + 2) / 2), "left": (this.conn2.x + this.conn2.w / 2) })
        if (this.conn2.w > this.conn2.h) {
            this.content_dom.css({ "top": 20, "text-align": "center", "text-indent": 0 });
        }
        else {
            this.content_dom.css({ "left": 90, "text-align": "left", "text-indent": 10 });
        }

    },
    menu_load: function () {
        this.menu_flag = true;

        var that = this;
        this.menu_board = $("<div class='menu' style='display: none;'></div>")
        this.conn.content_dom.append(this.menu_board);

        this.connection_edit_inner = $("<div class='connection_edit_inner' ></div>")
        this.connection_edit_input = $("<input class='connection_input' style='margin-bottom:10px;' type='text'/>");
        this.connection_edit_confirm = $("<div class='btn confirm_left_btn' style='margin-bottom:10px;'></div>");
        // this.connection_edit_cancel = $("<div class='btn' style='float:right;'>Cancel</div>");
        this.connection_edit_inner.append(this.connection_edit_input);
        this.connection_edit_inner.append(this.connection_edit_confirm);
        this.menu_board.append(this.connection_edit_inner);

        this.connection_delete_inner = $("<div class='connection_delete_inner'></div>")
        this.connection_delete_confirm = $("<div class='btn delete_right_btn' style='background:#f44236;margin-bottom:10px;'></div>");
        this.connection_delete_cancel = $("<div class='menu_btn' ></div>");
        this.connection_delete_inner.append(this.connection_delete_confirm);
        this.connection_delete_inner.append(this.connection_delete_cancel);
        this.menu_board.append(this.connection_delete_inner);

        this.content_dom[0].oncontextmenu = function (ev) {
            //阻止鼠标的默认事件
            ev.preventDefault();
            that.menu_board.css("display", "block");
            that.connection_edit_input.val(that.content_dom.text());
            that.content_dom.css("opacity", "0");
            // that.connection_edit_inner.css("display","block");
        };

        this.connection_edit_confirm.on("click", function () {
            that.content_dom.text(that.connection_edit_input.val());
            // that.dom.css("margin-left",-that.content_dom[0].offsetWidth/2);
            that.info.remark = that.connection_edit_input.val();
            if(that.remark_default!=that.info.remark){
                that.changeditor.add_update_Connection(that.info.id);
                that.is_modified = true;
            }
            else{
                that.changeditor.del_update_Connection(that.info.id);
                that.is_modified = false;
            }
            that.menu_board.css("display", "none");
            that.content_dom.css("opacity", "1");

            // 已修改
            that.changeditor.vue.is_edited=true;
        })

        this.conn.connector.path.oncontextmenu = function (ev) {
            //阻止鼠标的默认事件
            ev.preventDefault();
            that.menu_board.css("display", "block");
            that.connection_edit_input.val(that.content_dom.text());
            that.content_dom.css("opacity", "0");
        }
        this.connection_delete_confirm.on("click", function () {
            that.deleteItself();

        });
        this.connection_delete_cancel.on("click", function () {
            that.menu_board.css("display", "none");
            that.content_dom.css("opacity", "1");
        })
    },
    deleteItself: function () {
        console.log("deleteIt");
        // 已修改
        this.changeditor.vue.is_edited=true;
        for (var j = 0; j < this.source.connections.length; j++) {
            if (this.source.connections[j].info.id == this.info.id) {
                // for (var m = j; m < this.source.connections.length - 1; m++) {
                //     this.source.connections[m] = this.source.connections[m + 1]
                // }
                this.source.connections.splice(j,1)
                break;
            }
        };
        // delete this.source.connections[this.source.connections.length - 1];
        // this.source.connections.length -= 1
        this.source.connection_num -= 1
        for (var j = 0; j < this.target.connections.length; j++) {
            if (this.target.connections[j].info.id == this.info.id) {
                this.target.connections.splice(j,1)
                break;
            }
        };
        // delete this.target.connections[this.target.connections.length - 1];
        // this.target.connections.length -= 1
        this.target.connection_num -= 1

        this.changeditor.delete_Connection(this.info.id);
        this.conn.content_dom.remove();

        this.changeditor.jsPlumb.deleteConnection(this.conn);

        for (var i in this) {
            delete this[i];
        };


    }
}

function ChangRow(changeditor) {
    this.changeditor = changeditor;
    this.parent_dom = changeditor.canvasdom;
    this.canvas_parent = changeditor.canvas_parent;
    this.dom = $("<div class='editor_row'></div>");
    this.nodes = new Array();
    this.nodes_num = 0;
    this.__init__();
}

ChangRow.prototype = {
    __init__: function () {
        this.parent_dom.append(this.dom);
    },
    addNode: function (info) {
        this.nodes_num += 1;
        for (var i = 0; i < this.nodes_num - 1; i++) {
            this.nodes[i].resetpos();
        };

        this.nodes[this.nodes_num - 1] = (new Node(this.changeditor, this, this.nodes_num, info));
        // 已修改
        this.changeditor.vue.is_edited=true;

    },
    delete_Node: function (nodeid) {
        for (var i = 0; i < this.nodes_num; i++) {
            if (this.nodes[i].info.element_id == nodeid) {
                for (var j = i; j < this.nodes_num - 1; j++) {
                    this.nodes[j] = this.nodes[j + 1];
                    this.nodes[j].num = j + 1;
                }
                this.nodes_num -= 1;
                this.nodes[this.nodes_num] = null;
                break
            }
        }
        for (var i = 0; i < this.nodes_num; i++) {
            this.nodes[i].resetpos();
        };
    },
    in_box: function (dom) {
        var hoverdom = $(dom);
        if (hoverdom[0].offsetTop + hoverdom[0].offsetHeight/2 > this.dom[0].offsetTop - this.dom.parent()[0].scrollTop + this.canvas_parent[0].offsetTop && hoverdom[0].offsetTop  + hoverdom[0].offsetHeight/2< this.dom[0].offsetTop + this.dom.height() - this.dom.parent()[0].scrollTop + this.canvas_parent[0].offsetTop) {
            if (hoverdom[0].offsetLeft  + hoverdom[0].offsetWidth/2> this.dom[0].offsetLeft + this.changeditor.center_main_dom[0].offsetLeft + this.changeditor.left_menu_dom[0].offsetWidth && hoverdom[0].offsetLeft   + hoverdom[0].offsetWidth/2< this.dom[0].offsetLeft + this.dom.width() + this.changeditor.center_main_dom[0].offsetLeft + this.changeditor.left_menu_dom[0].offsetWidth) {
                this.dom.css("box-shadow", "0px 0px 0px 2px #03A9F4 inset");
                return true;
            }
        }
        this.dom.css("box-shadow", "0px 0px 0px");
        return false;
    },

    in_box_finally: function (dom, info) {
        console.log(info)
        var hoverdom = $(dom);
        if (hoverdom[0].offsetTop + hoverdom[0].offsetHeight/2 > this.dom[0].offsetTop - this.dom.parent()[0].scrollTop + this.canvas_parent[0].offsetTop && hoverdom[0].offsetTop  + hoverdom[0].offsetHeight/2< this.dom[0].offsetTop + this.dom.height() - this.dom.parent()[0].scrollTop + this.canvas_parent[0].offsetTop) {
            if (hoverdom[0].offsetLeft  + hoverdom[0].offsetWidth/2> this.dom[0].offsetLeft + this.changeditor.center_main_dom[0].offsetLeft + this.changeditor.left_menu_dom[0].offsetWidth && hoverdom[0].offsetLeft   + hoverdom[0].offsetWidth/2< this.dom[0].offsetLeft + this.dom.width() + this.changeditor.center_main_dom[0].offsetLeft + this.changeditor.left_menu_dom[0].offsetWidth) {
                this.dom.css("box-shadow", "0px 0px 0px");
                this.addNode(info);
                return true;
            }
        }
        return false;
    }
}

function Node(changeditor, row, num, info) {
    this.changeditor = changeditor;
    this.canvasdom = changeditor.canvasdom;
    this.num = num;
    this.row = row;
    this.is_modified = false;
    this.content_default = ""
    this.all_nodes_in_row = this.row.nodes_num;
    this.dom = null;
    this.info = info;
    this.content_default = info.element_content;
    this.father = null;
    this.children = null;
    this.connections = [];
    this.connection_num = 0;
    this.columns = ["id", "author_id", "parent_id", "children_id", "is_start", "is_scene", "is_condition", "is_input", "remark", "c_time", "u_time"]
    this.__init__();

}
Node.prototype = {
    __init__: function () {

        this.dom = $("<div class='editor_node_" + this.info.element_type + "'></div>")
        this.content_dom = $("<div class='content'>" + this.info.element_content + "</div>")
        this.dom.css("background-image","url('"+ROOT_HOST+"/static/tools/"+this.info.element_type+".svg')");
        this.dom.append(this.content_dom);

        this.dom.css({ "position": "absolute", "top": (this.row.dom[0].offsetTop), "left": (this.row.dom[0].offsetLeft + (this.row.dom[0].offsetWidth / (this.row.nodes_num + 1)) * this.num) });
        var that = this;
        if (typeof (this.info.scene_name) != "undefined") {
            this.content_dom.text(this.info.scene_name);
            this.info.element_content = this.info.scene_name;
        }
        
        this.canvasdom.append(this.dom);
        this.dom.css("margin-left",-(this.content_dom[0].offsetWidth/2));
        this.menu = $("<div class='node_menu'></div>");
        // if(this.info.element_type != "start" && this.info.element_type != "end"){

        this.menu_btn = $("<div class='menu_btn'></div>");
        this.canvasdom.append(this.menu);

        this.menu.append(this.menu_btn);
        this.menu_load();
        this.menu.css({ "top": (this.dom[0].offsetTop + this.dom[0].offsetHeight / 2 - 5), "left": (this.dom[0].offsetLeft + this.dom[0].offsetWidth - 30) })

        // }
        if (this.info.element_type == "start") {
            this.changeditor.jsPlumb.makeSource(this.dom, {
                endpoint: "Dot",
                anchor: "Continuous",
                connector: "Flowchart",
            });
        }
        else if (this.info.element_type == "end") {
            this.changeditor.jsPlumb.makeTarget(this.dom, {
                endpoint: "Rectangle",
                anchor: "Continuous",
                connector: "Flowchart",
            })
        }
        else if (this.info.element_type == "condition") {
            this.changeditor.jsPlumb.makeTarget(this.dom, {
                endpoint: "Rectangle",
                anchors:["Top"],
                connector: "Flowchart",
            })
            this.changeditor.jsPlumb.makeSource(this.dom, {
                endpoint: "Dot",
                anchors:["Bottom","Left","Right"],
                connector: "Flowchart",
            });
        }
        else{
            this.changeditor.jsPlumb.makeSource(this.dom, {
                endpoint: "Dot",
                anchor: "Continuous",
                connector: "Flowchart",
            });
            this.changeditor.jsPlumb.makeTarget(this.dom, {
                endpoint: "Rectangle",
                anchor: "Continuous",
                connector: "Flowchart",
            })
        }

        //    jsPlumb.addEndpoint(this.dom, {anchors:["Bottom","Top", "Left", "Right"]}, {isSource: true,
        //        isTarget: true, connector:"Flowchart", maxConnections : -1});
    },
    resetpos: function () {
        var that = this;
        setTimeout(function () {
            that.dom.css({ "position": "absolute", "top": (that.row.dom[0].offsetTop), "left": (that.row.dom[0].offsetLeft + (that.row.dom[0].offsetWidth / (that.row.nodes_num + 1)) * that.num) });
            if (that.menu != null) that.menu.css({ "top": (that.dom[0].offsetTop + that.dom[0].offsetHeight / 2 - 5), "left": (that.dom[0].offsetLeft + that.dom[0].offsetWidth - 30) });
            that.changeditor.jsPlumb.revalidate(that.dom);

            for (var i = 0; i < that.connection_num; i++) {
                that.connections[i].resetpos();
            }
        }, 0);
    },
    add_Connection: function (conn) {
        this.connections[this.connection_num] = conn;
        this.connection_num += 1;
    },
    menu_load: function () {
        this.menu_flag = true;

        this.node_delete_inner = $("<div class='node_delete_inner' style='display:block'></div>")
        this.node_delete_confirm = $("<div class='btn delete_right_btn' style='background:#f44236;margin-bottom:10px;'></div>");
        this.node_delete_inner.append(this.node_delete_confirm);

        var that = this;
        this.dom[0].oncontextmenu = function (ev) {
            //阻止鼠标的默认事件
            ev.preventDefault();
            //            var ev = ev || event;
            //            var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            //            that.menu.css({"display":"block", "left":ev.clientX, "top":(ev.clientY + scrollTop)});
            that.menu.css({ "display": "block", "z-index": 6 });
            if(that.sim){that.sim.remove();}
        }

        this.menu_btn.on("click", function () {
            if (that.menu_flag) {
                that.menu.css({ "z-index": 0, "display": "none" });
            }
        });

        this.node_delete_confirm.on("click", function () {
            that.deleteItself();
        });
        if(this.info.element_type == "scene"){
            var info = this.changeditor.scenes_info_index[this.info.scene_id];
            this.node_info_inner=$("<div class='node_scene_info_inner'></div>");
            this.node_fast_edit=$("<div class='node_scene_fast_edit'>快速编辑</div>");
            this.node_fast_edit.on('click',function(){
                that.changeditor.vue.faste_url = "";
                that.changeditor.vue.frame_show=true;
                that.changeditor.vue.frame_hidden=false;
                var offset = that.dom.offset();
                offset.left = parseInt(that.dom.css('left').split("px")[0]) + 10-50;
                that.changeditor.vue.float_frames.node_top=offset.top+"px";
                that.changeditor.vue.float_frames.node_left=offset.left+"px";
                that.changeditor.vue.float_frames.scene_id = that.info.scene_id;
                let encode = that.changeditor.vue.encode;
                setTimeout(()=>{
                    that.changeditor.vue.faste_url = '#/board/faste/'+encode(that.changeditor.drama_id) + '/'+encode(that.changeditor.episode_id)+'/'+encode(that.info.scene_id)
                },500)
                if (that.menu_flag) {
                    that.menu.css({ "z-index": 0, "display": "none" });
                }

            });
            this.node_location_info=$("<div class='node_location_info'>"+info.scene_location+"</div>");
            this.node_time_info=$("<div class='node_time_info'>"+info.scene_time+"</div>");
            this.node_roles_info=$("<div class='node_roles_info'></div>");
            var roles = []
            for(var i = 0;i < info.main_roles.length;i++){
                var node_role_info=$("<div class='node_role_info'><div class='name' c_id="+info.main_roles[i].id+">"+info.main_roles[i].name+"</div><div class='status' style='display:none;'>"+(info.main_roles[i].status==undefined || info.main_roles[i].status.length==0?"无":info.main_roles[i].status)+"</div></div>");
                roles.push(info.main_roles[i].name);
                this.node_roles_info.append(node_role_info);
                node_role_info.on("click",function(){
                    let d = $(this).find(".status")[0];
                    console.log(d);
                    d.style.display=d.style.display=="none"?"block":"none";
                })
            }
            this.node_roles_info.append("<div style='height: 20px;width: 0px;'></div>");
            this.node_info_inner.append(this.node_fast_edit);
            this.node_info_inner.append(this.node_location_info);
            this.node_info_inner.append(this.node_time_info);
            this.node_info_inner.append(this.node_roles_info);
            this.menu.append(this.node_info_inner);
            this.sim == null;
            this.dom.on("mouseover",function(ev){
                that.sim = $("<div class='simpleInfo' style='display:block;'></div>")
                that.canvasdom.append(that.sim);
                that.sim.css({"top":that.dom.css("top")})
                that.sim[0].innerHTML="<p>场："+info.scene_name+"</p><p>时间："+(info.scene_time==''?'无':info.scene_time)+"</p><p>地点："+(info.scene_location==''?'无':info.scene_location)+"</p><p>人物："+(roles.length==0?'无':roles.join('、'))+"</p>"
                $(this).on("mouseout",function(){
                    if(that.sim == null)return;
                    that.sim.remove();
                    that.sim = null;
                })
            })
            // this.dom.on("mousedown",function(ev){
            //     if(ev.button==1){
            //         VueRouter.push("/e/" + encode(info.drama_id) + "/" + encode(info.episode_id) + "/" + encode(info.id));
            //     }
            // })
            this.dom.unbind("mousedown")
            this.dom.unbind("mouseup")
            this.dom.unbind("dblclick")
            this.dom.on("dblclick",function(ev){
                ev.preventDefault();
                console.log("asdfasdf")
            })
            this.dom.bind("mousedown",function(){
                console.log("md")
            })
            this.dom.bind("mouseup",function(){
                console.log("mp")
            })
        }
        if (this.info.element_type != "start" && this.info.element_type != "end") {
            this.node_edit_inner = $("<div class='node_edit_inner'  style='display:block'></div>")
            this.node_edit_input = $("<input class='node_input' style='margin-bottom:10px;' type='text'/>");
            this.node_edit_confirm = $("<div class='btn confirm_left_btn' style='margin-bottom:10px;'></div>");

            this.node_edit_inner.append(this.node_edit_input);
            this.node_edit_inner.append(this.node_edit_confirm);

            this.node_edit_input.val(this.content_dom.text());

            this.node_edit_confirm.on("click", function () {
                that.content_dom.text(that.node_edit_input.val());
                that.dom.css("margin-left",-that.content_dom[0].offsetWidth/2);
                that.info.element_content = that.node_edit_input.val();
                if (that.info.element_content != that.content_default){
                    that.changeditor.add_update_Node(that.info.element_id);
                    that.is_modified = true;
                }
                else{
                    that.changeditor.del_update_Node(that.info.element_id);
                    that.is_modified = false;
                }
                that.menu.css("display", "none");
                // 已修改
                that.changeditor.vue.is_edited=true;
                that.resetpos();    
            })


            this.menu.append(this.node_edit_inner);
        } else {
            this.node_delete_confirm.css("margin", "10px 20px");
        }
        this.menu.append(this.node_delete_inner);
    },
    deleteItself: function () {

        // 已修改
        this.changeditor.vue.is_edited=true;
            var num = this.connections.length;
            for (var i = 0; i < num; i++) {
                this.connections[0].deleteItself();
            }
            // delete from row
            this.row.delete_Node(this.info.element_id);
            // delete itself
            if (this.info.element_type == "start") {
                this.changeditor.start_node = null;
            }
            if (this.info.element_type == "end") {
                this.changeditor.end_node_num -= 1;
            }
            this.changeditor.delete_Node(this.info.element_id);


            if (this.info.element_type == "scene") {
                $(this.changeditor.scenes[this.info.scene_id].drag_handle.ele).css("background", "#3F51B5");
                this.changeditor.scenes[this.info.scene_id].drag_handle.allow_drag = true;
            }

            // delete dom
            this.dom.remove();
            this.menu.remove();

            for (var key in this) { delete this[key]; };
    }
}

function Link() {
    this.source = null;
    this.target = null;
    this.remark = null;
}

Link.prototype = {
    __init__: function () { },
    deleteItself: function () { }
}


function Chang(canvasdom, toolbardom,center_main_dom, left_menu_dom, vue) {
    this.vue = vue;
    this.added_nodes = {};
    this.added_nodes_num = 0;
    this.added_connections = {};
    this.added_connection_num = 0;

    this.existed_nodes = {};
    this.existed_nodes_num = 0;
    this.existed_connections = {};
    this.existed_connection_num = 0;

    this.delete_node_set = new Set();
    this.update_node_set = new Set();
    this.added_node_set = new Set();
    this.existed_node_set = new Set();

    this.delete_connection_set = new Set();
    this.update_connection_set = new Set();
    this.added_connection_set = new Set();
    this.existed_connection_set = new Set();

    this.links = {}

    this.scenes={}
    /*
    {8934543532:[83243242134,8123412356]}
    */

    this.rows = new Array();
    this.rows_num = 0;
    this.canvasdom = $(canvasdom);
    this.toolbardom = $(toolbardom);
    this.center_main_dom = $(center_main_dom);
    this.left_menu_dom = $(left_menu_dom);

    this.exist_nodes = [];
    this.added_nodes = [];
    this.delete_nodes = [];
    this.connection_stack = new Array();
    this.loaded_lock = true;

    this.scenes_info_index = {}
    this.scene_num = 0;

    this.start_node = null;
    this.end_node_num = 0;

    this.start_tool = null;
    this.input_tool = null;
    this.condition_tool = null;
    this.end_tool = null;


    this.__init__();
}


Chang.prototype = {
    __init__: function () {

        this.canvas_height = this.canvasdom.height();
        this.canvas_width = this.canvasdom.width();
        // svg
        this.svgdom = d3.select(this.canvasdom[0]).append("svg")
        this.svgdom.attr("id", "canvas_svg");
        this.svgdom.style({ "height": this.canvas_height, "width": this.canvas_width, "position": "absolute", "top": 0, "left": 0, "z-index": 1 });
        // div
        this.divdom = $("<div/>")
        this.canvasdom.append(this.divdom);
        this.divdom.attr("id", "canvas_div");
        this.divdom.css({ "height": this.canvas_height, "width": this.canvas_width, "position": "absolute", "top": 0, "left": 0, "z-index": 2, "overflow-y": "scroll" });
        // rows
        this.canvas_parent = this.canvasdom;
        this.canvasdom = this.divdom;
        this.rows[this.rows_num] = (new ChangRow(this));
        this.rows_num += 1;

        this.start_tool = (new Tool_Thumb(this, "start"));
        this.input_tool = (new Tool_Thumb(this, "input"));
        this.condition_tool = (new Tool_Thumb(this, "condition"));
        this.end_tool = (new Tool_Thumb(this, "end"));

    },
    add_jsplumb: function (jsplumb) {
        this.jsPlumb = jsplumb;
    },
    set_id: function (drama_id_, episode_id_) {
        drama_id = drama_id_;
        episode_id = episode_id_;
        this.drama_id = drama_id_;
        this.episode_id = episode_id_;
    },
    in_box: function (dom) {

        for (var i = 0; i < this.rows.length; i++) {
            this.rows[i].in_box(dom);
        }
    },
    in_box_finally: function (dom, info) {
        if (info.element_type == "start") {
            if (this.start_node != null) {
                this.start_tool.drag_handle.allow_drag = false;
                alert("no more start node.");
                return false;
            }
        }

        for (var i = 0; i < this.rows.length; i++) {
            if (this.rows[i].in_box_finally(dom, info)) {
                if (i == this.rows_num - 1) {
                    this.rows[this.rows_num] = (new ChangRow(this));
                    this.rows_num += 1;
                }
                this.add_Node(this.rows[i].nodes[(this.rows[i].nodes_num - 1)]);
                return true;
            };
        }
        return false;
    },

    add_Connection: function (conn) {
        if (this.loaded_lock) {
            this.connection_stack.push((new Node_Connection(conn, this)));
            return;
        };

        time = new Date();
        var id = parseInt(String(time.getTime()));
        this.added_connections[id] = (new Node_Connection(conn, this));
        this.added_connections[id].conn2.nid = id;
        this.added_connections[id].conn.nid = id;
        this.added_connections[id].info.id = id;
        $(this.added_connections[id].conn2.path).attr("nid", id);
        this.added_connection_num += 1;
        this.added_connection_set.add(id);
    },
    add_update_Connection:function(connid){
        if(this.existed_connection_set.has(connid)){
            this.update_connection_set.add(connid);
        }
    },
    del_update_Connection:function(connid){
        this.update_connection_set.delete(connid);
    },
    delete_Connection: function (connid) {

        var conn_id = connid;
        if (this.added_connection_set.has(conn_id)) {
            this.added_connection_set.delete(conn_id);
            this.added_connection_num -= 1;
        } else {
            this.existed_connection_set.delete(conn_id);
            this.delete_connection_set.add(conn_id);
            this.existed_connection_num -= 1;
        }

    },
    find_Connection:function(connid){
        var conn_id = connid;
        if (this.added_connection_set.has(conn_id)) {
            return this.added_connections[connid];
        } else {
            return this.existed_connections[connid];
        }
    },
    add_Node: function (node) {
        time = new Date();
        var id = parseInt(String(time.getTime()));
        if (node.info.element_type == "start" && this.start_node == null) {
            this.start_node = node;
            this.start_tool.drag_handle.allow_drag = false;
        }
        if (node.info.element_type == "end") {
            this.end_node_num += 1;
        }
        this.added_nodes[id] = node;
        this.added_nodes[id].dom.attr("nid", id);
        this.added_nodes[id].info.element_id = id;
        this.added_nodes_num += 1;
        this.added_node_set.add(id);
    },
    add_update_Node:function(nodeid){
        if(this.existed_node_set.has(nodeid)){
            this.update_node_set.add(nodeid);
        }

    },
    del_update_Node:function(nodeid){
        this.update_node_set.delete(nodeid);
    },
    delete_Node: function (nodeid) {
        var node_id = nodeid;
        if (this.added_node_set.has(node_id)) {
            this.added_node_set.delete(node_id)
            this.added_nodes_num -= 1;
        } else {
            this.existed_node_set.delete(node_id);
            this.delete_node_set.add(node_id);
            this.existed_nodes_num -= 1;
        }
    },
    add_Scene: function (id, scene) {
        this.scenes[id] = scene;
        this.scene_num += 1;
    },

    delete_Scene: function (id) {
        this.scenes[id] = null;
        this.scene_num -= 1;
    },
    prePaint: function () {
        var that = this;
        // var insession = false;
        // if (Storage.getItem("chang_element") == null || Storage.getItem("chang_relation") == null) {
        //     Storage.removeItem("chang_element");
        //     Storage.removeItem("chang_relation");
        //     insession = false;
        // }
        // else insession = true;
        //console.log(that.scenes);
        function format_elements(items) {
            for (var i = 0; i < items.length; i++) {
                that.links[items[i].element_id] = new Set();
                if (items[i].scene_id != null) {
                    $(that.scenes[items[i].scene_id].drag_handle.ele).css("background", "#EEE");
                    that.scenes[items[i].scene_id].drag_handle.allow_drag = false;
                }
                that.existed_nodes[items[i].element_id] = { is_built: false };
                that.existed_nodes[items[i].element_id]["info"] = items[i];
                that.existed_node_set.add(items[i].element_id);
                that.existed_nodes_num += 1;
            }
        }
        var items = null;
        // if (!insession) {
            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url: ROOT_HOST + "/jeditor/api/episodeemelemt/" + drama_id + "/" + episode_id,
                async: false,
                dataType: "json",
                success: function (returndata) {
                    // if (returndata[0] == null) return;
                    items = returndata[0];
                    // Storage.setItem("chang_element", JSON.stringify(returndata[0]));

                }
            });
        // }
        // var items = JSON.parse(Storage.getItem("chang_element"));
        format_elements(items);
        console.log(that);
        if (that.existed_nodes_num == 0) {
            this.loaded_lock = false;
            return;
        }
        var start_node = null;
        function format_relations(items) {
            for (var i = 0; i < items.length; i++) {

                that.links[items[i].parent_id].add(items[i].children_id);
                that.existed_connections[items[i].id] = items[i];
                that.existed_connections[items[i].id]["info"] = items[i];
                that.existed_connection_set.add(items[i].id);
                that.existed_connection_num += 1;
                if (items[i].is_start == 1) {
                    start_node = items[i].parent_id;
                }

            }
        }
        var ritems =null;
        // if (!insession) {
            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url: ROOT_HOST + "/jeditor/api/episoderelation/" + drama_id + "/" + episode_id,
                async: false,
                dataType: "json",
                success: function (returndata) {
                    // if (returndata[0] == null) return;
                    ritems = returndata[0];
                    // Storage.setItem("chang_relation", JSON.stringify(returndata[0]));
                }
            });
        // }
        // var ritems = JSON.parse(Storage.getItem("chang_relation"));
        format_relations(ritems);

        function build_children(rootNodeId, row_num) {
            if (!that.existed_node_set.has(rootNodeId) || that.existed_nodes[rootNodeId].is_built) {
                return;
            }
            if (row_num == that.rows_num - 1) {
                that.rows[that.rows_num] = (new ChangRow(that));
                that.rows_num += 1;
            }
            that.rows[row_num].addNode(that.existed_nodes[rootNodeId].info);
            that.existed_nodes[rootNodeId] = that.rows[row_num].nodes[(that.rows[row_num].nodes_num - 1)];
            if (that.existed_nodes[rootNodeId].info.element_type == "start" && that.start_node == null) {
                that.start_node = that.existed_nodes[rootNodeId];
                that.start_tool.drag_handle.allow_drag = false;
            }
            if (that.existed_nodes[rootNodeId].info.element_type == "end") {
                that.end_node_num += 1;
            }
            that.existed_nodes[rootNodeId].dom.attr("nid", rootNodeId);
            that.existed_nodes[rootNodeId].is_built = true;

            that.links[rootNodeId].forEach(function (item) {
                build_children(item, row_num + 1)
            })
        }
        build_children(start_node, 0);

        setTimeout(function () {
            for (var i in that.existed_connections) {
                console.log(that.existed_connections[i])
                that.jsPlumb.connect({
                    source: that.existed_nodes[that.existed_connections[i].info.parent_id].dom,
                    target: that.existed_nodes[that.existed_connections[i].info.children_id].dom,
                    // endpointStyle:{ fill:"black", outlineStroke:"black", outlineWidth:1 },
                });
                var id = that.existed_connections[i].info.id;
                var remark = that.existed_connections[i].info.remark;
                that.existed_connections[id] = that.connection_stack.pop();
                that.existed_connections[id].conn2.nid = id;
                that.existed_connections[id].conn.nid = id;
                that.existed_connections[id].info.id = id;
                that.existed_connections[id].init_remark(remark);
                $(that.existed_connections[id].conn2.path).attr("nid", id);
            }

            that.loaded_lock = false;
            console.log(that)
            //初始状态未修改
            that.vue.is_edited=false;
        }, 0);

    },
    update_nodes: function () {
        var all_steps = this.added_node_set.size + this.delete_node_set.size;
        var finished_size = 0
        var that = this;
        var success_added_item = new Set();
        var success_delete_item = new Set();
        var success_update_item = new Set();
        this.added_node_set.forEach(function (item) {   
            if (that.added_nodes[parseInt(item)].connection_num == 0) { return; }
            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url: ROOT_HOST + "/jeditor/api/createepisodeele/" + drama_id + "/" + episode_id,
                async: false,
                dataType: "json",
                data: JSON.stringify(that.added_nodes[parseInt(item)].info),
                success: function (returndata) {
                    success_added_item.add(item)
                    finished_size += 1;
                }
            });
        });

        success_added_item.forEach(function (item) {
            that.added_node_set.delete(item);
            that.added_nodes_num -= 1;
            that.existed_nodes[item] = that.added_nodes[item];
            that.existed_node_set.add(item);
            that.added_nodes_num += 1;
        });

        this.delete_node_set.forEach(function (item) {
            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url: ROOT_HOST + "/jeditor/api/deleteele/" + drama_id + "/" + episode_id + "/" + item,
                async: false,
                dataType: "json",
                success: function (returndata) {
                    success_delete_item.add(item)
                    finished_size += 1;
                }
            });
        });
        success_delete_item.forEach(function (item) {
            that.delete_node_set.delete(item);
            delete that.existed_nodes[item];
            that.existed_node_set.delete(item);
            that.added_nodes_num -= 1;
        });

        this.update_node_set.forEach(function(item){
            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url: ROOT_HOST + "/jeditor/api/updateele/" + drama_id + "/" + episode_id + "/" + item,
                async: false,
                data:JSON.stringify(that.existed_nodes[parseInt(item)].info),
                dataType: "json",
                success: function (returndata) {
                    success_update_item.add(item)
                    finished_size += 1;
                }
            });
        });

        success_update_item.forEach(function (item) {
            that.update_node_set.delete(item);
        });
    },
    update_relations: function () {
        var all_steps = this.added_connection_set.size + this.delete_node_set.size;
        var finished_size = 0
        var that = this;
        var success_added_item = new Set();
        var success_delete_item = new Set();
        var success_update_item = new Set();
        this.added_connection_set.forEach(function (item) {
            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url: ROOT_HOST + "/jeditor/api/createepisoderel/" + drama_id + "/" + episode_id,
                async: false,
                dataType: "json",
                data: JSON.stringify(that.added_connections[parseInt(item)].info),
                success: function (returndata) {
                    success_added_item.add(item)
                    finished_size += 1;
                }
            });
        });
        success_added_item.forEach(function (item) {
            that.added_connection_set.delete(item);
            that.added_connection_num -= 1;
            that.existed_connections[item] = that.added_connections[item];
            that.existed_connection_set.add(item);
            that.existed_connection_num += 1;
        });
        this.delete_connection_set.forEach(function (item) {
            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url: ROOT_HOST + "/jeditor/api/deleteepisoderel/" + drama_id + "/" + episode_id + "/" + item,
                async: false,
                dataType: "json",
                success: function (returndata) {
                    success_delete_item.add(item)

                    finished_size += 1;
                }
            });
        });
        success_delete_item.forEach(function (item) {
            that.delete_connection_set.delete(item);
            delete that.existed_connections[item];
            that.existed_connection_set.delete(item);
            that.existed_connection_num -= 1;
        });
        this.update_connection_set.forEach(function(item){
            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url: ROOT_HOST + "/jeditor/api/updaterel/" + drama_id + "/" + episode_id + "/" + item,
                async: false,
                data:JSON.stringify(that.existed_connections[parseInt(item)].info),
                dataType: "json",
                success: function (returndata) {
                    success_update_item.add(item)
                    finished_size += 1;
                }
            });
        });

        success_update_item.forEach(function (item) {
            that.update_connection_set.delete(item);
        });
    },
    delete_no_connections_node: function () {
        var that = this;
        var flag = true;
        this.added_node_set.forEach(function (item) {
            if (that.added_nodes[item].connection_num == 0) {
                if (that.added_nodes[item].info.element_type == "start") {
                    alert("start node have no connection.");
                    flag = false;
                } else if (that.added_nodes[item].info.element_type == "end") {
                    alert("end node have no connection.");
                    flag = false;
                }
                that.added_nodes[item].deleteItself();

            }
        })
        this.existed_node_set.forEach(function (item) {
            if (that.existed_nodes[item].connection_num == 0) {
                if (that.existed_nodes[item].info.element_type == "start") {
                    alert("start node have no connection.");
                    flag = false;
                } else if (that.existed_nodes[item].info.element_type == "end") {
                    alert("end node have no connection.");
                    flag = false;
                }
                that.existed_nodes[item].deleteItself();
            }
        })
        return flag;
    },
    is_right: function () {
        var that = this;
        this.added_node_set.forEach(function (item) {
            if (that.added_nodes[item].connection_num == 0) {
                if (that.added_nodes[item].info.element_type == "start" || that.added_nodes[item].info.element_type == "end") {
                    return false;
                }
            }
        })
        this.existed_node_set.forEach(function (item) {
            if (that.existed_nodes[item].connection_num == 0) {
                if (that.existed_nodes[item].info.element_type == "start" || that.existed_nodes[item].info.element_type == "end") {
                    return false;
                }
            }
        })
        if (this.start_node == null || this.end_node_num == 0) {
            if(this.start_node == null && this.end_node_num == 0 && this.existed_nodes_num == 0 && this.added_nodes_num == 0){
                return true;
            }
            return false;
        }
        return true;
    },
    //
    //replace:function(){
    //    var that = this;
    //    var links = {}
    //    that.existed_connection_set.forEach(function(item){
    //        linkes[that.existed_connections[item].]
    //    });
    //
    //},
    save_all: function () {

        if (!this.is_right()||!this.delete_no_connections_node()) {
            console.log("false !");
            alert("逻辑错误");
            return;
        }
        // console.log(this.added_nodes)
        // return
        var that = this;
        var saving_loadding = new Loadding();
        saving_loadding.add_title("保存排布");
        saving_loadding.__init__();

        // saving_loadding.add_process(
        //     "删除多余未连接节点",
        //     function () {
        //         that.delete_no_connections_node();
        //     }
        // );
        saving_loadding.add_process(
            "更新节点",
            function () {
                that.update_nodes();
            }
        );
        saving_loadding.add_process(
            "更新关系",
            function () {
                that.update_relations();
            }
        );
        saving_loadding.add_process(
            "更新缓存",
            function () {
                that.vue.is_edited = false;
            }
        );

        saving_loadding.start();

    },
    highlight:function(){
        this.canvasdom.addClass("highlight-row")
    },
    stop_highlight:function(){
        this.canvasdom.removeClass("highlight-row")
    }
    // update_session: function () {
    //     var elements = [], connections = [];
    //     for (var i in this.existed_nodes) {
    //         elements.push(this.existed_nodes[i].info)
    //     }
    //     for (var i in this.existed_connections) {
    //         connections.push(this.existed_connections[i].info)
    //     }
    //     console.log(this.existed_connections);
    //     // Storage.setItem("chang_relation", JSON.stringify(connections));
    //     // Storage.setItem("chang_element", JSON.stringify(elements));
    // }

}

function Tool_Thumb(editor, type) {
    this.editor = editor;
    this.parent = $("#tool_item_board")
    this.type = type;
    this.info = {
        element_type: type,
        element_content: "",
        element_condition: "",
        is_start: 0,
        is_end: 0,
        scene_id: null
    };

    if (this.type == "start") {
        this.info.is_start = 1;
    }
    else if (this.type == "end") {
        this.info.is_end = 1;
    }

    this.__init__();
}

Tool_Thumb.prototype = {
    __init__: function () {
        this.create();
    },
    create: function () {
        this.dom = $("<div class='tool_item tool_item_" + this.type + " style='background-image:url('"+ROOT_HOST+"/static/tools/"+this.type+".svg')'></div>");
        this.parent.append(this.dom);
        this.dom.css("background-image","url('"+ROOT_HOST+"/static/tools/"+this.type+".svg')");
        this.drag_handle = new DragHandle2(this.dom, 1.2, this.editor, this.info);
    }
}
function Delete_Board(name, root_dom) {
    this.jumuid = null;
    this.name = name;
    this.jujiid = null;
    this.todo = null;
    this.dom = $("<div class='msgBox' id='question_board' style='display:none; z-index:11;border-top: 5px solid #F44336;'></div>")
    this.title = $("<div style='text-align: justify;font-size: 18px;font-weight: 900;padding: 15px 50px;'>你正在进行删除操作，删除后文件无法恢复，是否继续？</div>")
    this.confirm = $("<div id='confirm' style='height:40px;margin:10px;margin-top:20px;'>");
    this.deletedom = $("<div class='left left_40'><div class='btn delete_btn'>delete</div></div>");
    this.cancledom = $("<div class='right right_60'><div class='btn cancel_btn'>cancel</div></div>")
    this.root_dom = root_dom;


    this.__init__();
}

Delete_Board.prototype = {
    __init__: function () {
        this.dom.append(this.title);
        this.confirm.append(this.deletedom);
        this.confirm.append(this.cancledom);
        var that = this;
        window.onload = () => { $(that.root_dom).append(that.dom); }
        this.deletedom.on("click", function () {
            that.todo();
        });
        this.cancledom.on("click", function () { that.hidden(); });
        this.dom.append(this.confirm);
    },
    change_todo: function (todo) {
        this.todo = todo;
    },
    show: function () {
        this.dom.css("display", "block");
    },
    hidden: function () {
        this.dom.css("display", "none");
    }
}


var delete_board = new Delete_Board("Delete", "#right_board");

function Scene_Thumb(editor = null, router = null) {
    this.editor = editor;
    this.router = router;
    this.parent = $("#chang_item_board")
    this.element_id = null;
    this.id = null;
    this.scene_name = null;
    this.drama_id = null;
    this.episode_id = null;
    this.main_roles = null;
    this.c_time = null;
    this.u_time = null;
    this.info = null;
}

Scene_Thumb.prototype = {
    __init__: function (obj) {
        for (var key in obj) {
            this[key] = obj[key];
        }
        this.info = obj;
        this.editor.scenes_info_index[this.info.id]=this.info;
        this.info.element_type = "scene";
        this.info.scene_id = this.id;
        this.info.is_start = 0;
        this.info.is_end = 0;
        this.info.element_condition = "";
        this.editor.add_Scene(this.id, this);
    },
    create: function () {
        this.drag_area_dom = $("<div class='drag_area'></div>")
        this.thumb_dom = $("<div class='item'></div>")
        this.download_dom = $("<div class='btn'><a class='hidden_a' href='"+ROOT_HOST+"/tool/downloadword/"+(new Date()).getTime()+"/"+this.drama_id+"/"+this.episode_id+"/"+this.id+"'>下载</div>")

        this.delete_dom = $("<div class='btn'>删除</div>")
        this.edit_dom = $("<div class='btn'>编辑</div>")
        this.remove_dom = $("<div class='btn'>移除</div>")
        var that = this;
        this.title_dom = $("<div class='title'>" + that.scene_name + "</div>");
        // this.download_dom.on("click", function () {
        //     that.download_();
        // });
        this.edit_dom.on("click", function () {
            that.edit_();
        });
        this.delete_dom.on("click", function () {
            that.delete_();
        });
        this.remove_dom.on("click", function () {
            that.remove_();
        });
        var menu = $("<div class='hidden_menu'></div>");
        menu.append(this.download_dom);
        menu.append(this.edit_dom);
        menu.append(this.delete_dom);
        menu.append(this.remove_dom);
        this.thumb_dom.append(this.title_dom)
        this.title_dom.on("click", function () {

            that.router.push("/board/e/" + encode(that.drama_id) + "/" + encode(that.episode_id) + "/" + encode(that.id));
        })
        this.thumb_dom.append(menu)
        this.thumb_dom.append(this.drag_area_dom)
        this.parent.append(this.thumb_dom)

        this.drag_handle = new DragHandle(this.drag_area_dom, .5, this.editor, this.info);
        console.log(this.drag_handle)
    },
    edit_: function () {
        this.title_dom.click();
    },
    remove_: function () {
        let vue = this.editor.vue;
        if(this.drag_handle.allow_drag==false){
            vue.$message({
                type: 'info',
                message: '该场在剧集逻辑图上，请删除图中对应节点后操作'
              });  
            return;
        }
        
        vue.$confirm('此操作将保存逻辑图并从剧集组中移除该场, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.editor.save_all();
            let form={
                "drama_id":this.drama_id,
                "old_episode_id":this.episode_id,
                "new_episode_id":-1,
                "scene_list":[this.id]
            }
            var that = this;
            var update_loadding=new Loadding();
            update_loadding.add_title("更新场");
            update_loadding.__init__();
            update_loadding.add_process(
                "新建",
                function(){
                    $.ajax({
                        type:"POST",
                        xhrFields: {
                            withCredentials: true
                        },
                        crossDomain: true,
                        url:ROOT_HOST + "/jeditor/api/update_scene_episode",

                        contentType:'application/json;charset=UTF-8',
                        data:JSON.stringify(form),
                        async:false,
                        dataType:"json",
                        success:function(returndata){
                            console.log(returndata)
                        }
                    })
                    }
            );

            update_loadding.start(
                function(){
                    that.thumb_dom.css({ "transition": "ease .5s", "max-height": "0px", "padding-bottom": "0px" });
                    setTimeout(function () { that.thumb_dom.remove(); }, 1000);
                    delete_board.hidden();
                    that.editor.delete_Scene(that.id);
                    vue.$message({
                        type: 'success',
                        message: '移除成功!'
                      });
                }
            );
          }).catch(() => {
            vue.$message({
              type: 'info',
              message: '已取消移除'
            });          
          });
    },
    delete_: function () {
        var that = this;
        delete_board.change_todo(function () {
            var l = new Loadding();
            l.add_title("delete");
            l.__init__();
            l.add_process("delete", function () {
                $.ajax({
                    type: "POST",
                    xhrFields: {
                        withCredentials: true
                    },
                    crossDomain: true,
                    url: ROOT_HOST + "/jeditor/api/deletescene/" + that.drama_id + "/" + that.episode_id + "/" + that.id,
                    async: false,
                    success: function (returndata) {
                        console.log(returndata);
                    }
                })
            });
            l.start(
                function () {
                    that.thumb_dom.css({ "transition": "ease .5s", "max-height": "0px", "padding-bottom": "0px" });
                    setTimeout(function () { that.thumb_dom.remove(); }, 1000);
                    delete_board.hidden();
                    that.editor.delete_Scene(that.id);
                }
            );
        });
        delete_board.show();
    }
}


export default {
    "Chang": Chang,
    "scene_thumb": Scene_Thumb,
}
