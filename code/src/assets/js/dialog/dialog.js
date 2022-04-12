const Loadding = require("../../js/loadding").default.Loadding;
import "../../index"
import { set } from "d3";
const $=require("jquery");
function Dialog(drama_id,episode_id,scene_id){
    this.loadded_set=new Set();
    this.now_set=new Set();
    this.loaded_lrom_server={};
    this.now_list={};
    this.need_to_remove=new Set();
    this.need_to_add=new Set();
    this.need_to_updata=new Set();
    this.drama_id=drama_id;
    this.episode_id=episode_id;
    this.scene_id=scene_id;
}

Dialog.prototype={
        __init__:function(loadded,now,old_dialogue,new_dialogue,scene_info){
            this.loaded_lrom_server=loadded;
            this.now_list=now;
            this.old_dialogue=old_dialogue;
            this.new_dialogue=new_dialogue;
            for(var i in this.loaded_lrom_server) this.loadded_set.add(i);
            for(var i in this.now_list) this.now_set.add(i);
            this.scene_info=scene_info;
        },
        compare:function(a,b){
            if(a.length!=b.length){return false;};
            try
            {
                for(var i in a){
                    if(a[i]!=b[i]){return false};
                }
                return true;
            }
            catch{
                console.log(this);
                return false;
            }


        },
        calc_all:function(){
            var that=this;
            that.now_set.forEach(Element=>{
                if(that.loadded_set.has(Element)){
                    if(!that.compare(that.loaded_lrom_server[Element], that.now_list[Element]))that.need_to_updata.add(Element);
                }
                else{
                    that.need_to_add.add(Element);
                }
            })
            that.loadded_set.forEach(Element=>{
                if(!that.now_set.has(Element)){
                    that.need_to_remove.add(Element);
                }
            })
            console.log(this);
        },
        update:function(){
            var updatedata=[];
            var that=this;
            that.need_to_updata.forEach(Element=>{
                updatedata[updatedata.length]=that.now_list[Element];
            });
            if(updatedata.length==0)return;
            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url: ROOT_HOST+"/jeditor/api/updatedialog/"+that.drama_id+"/"+that.episode_id+"/"+that.scene_id,
                data:JSON.stringify(updatedata),
                dataType: "json",
                async:false,
                success: function(data){
                        console.log(data);
                    },
                    error:function(){
                        throw "wrong";
                    }
            });
        },
        remove:function(){
            var deletedata=[];
            var that=this;
            that.need_to_remove.forEach(Element=>{
                deletedata[deletedata.length]=Element;
            });
            if(deletedata.length==0)return;
            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url: ROOT_HOST+"/jeditor/api/deletedialog/"+that.drama_id+"/"+that.episode_id+"/"+that.scene_id,
                data:JSON.stringify(deletedata),
                dataType: "json",
                async:false,
                success: function(data){
                        console.log(data);
                    },
                    error:function(){
                        throw "wrong";
                    }
            });
        },
        add:function(){
            var addedata=[];
            var that=this;
            that.need_to_add.forEach(Element=>{
                addedata[addedata.length]=that.now_list[Element];
            });
            if(addedata.length==0)return;
            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url: ROOT_HOST+"/jeditor/api/createdialog/"+that.drama_id+"/"+that.episode_id+"/"+that.scene_id,
                data:JSON.stringify(addedata),
                async:false,
                dataType: "json",
                success: function(data){
                        console.log(data);
                    },
                    error:function(){
                        throw "wrong";
                    }
            });
        },
        update_dialogue:function(){
            var that=this;
            if(this.compare(this.new_dialogue,this.old_dialogue)){return;}
            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url: ROOT_HOST+"/jeditor/api/updateorder/"+that.drama_id+"/"+that.episode_id+"/"+that.scene_id,
                data:JSON.stringify(that.new_dialogue),
                async:false,
                dataType: "json",
                success: function(data){
                        console.log(data);
                    },
                error:function(){
                    throw "wrong";
                }
            });
        },
        update_scene:function(){
            var that=this;
            $.ajax({
                type: "POST",
                xhrFields: {
                    withCredentials: true
                },
                crossDomain: true,
                url: ROOT_HOST+"/jeditor/api/updatescene/"+that.drama_id+"/"+that.episode_id+"/"+that.scene_id,
                data:JSON.stringify(that.scene_info),
                async:false,
                dataType: "json",
                success: function(data){
                        console.log(data);
                    },
                error:function(){
                    throw "wrong";
                }
            });
        },
        save:function(success_todo=null,failed_todo=null){
            var that=this;
            var loadding = new Loadding();
            loadding.add_title("保存数据");
            loadding.__init__();
            loadding.add_process(
                "计算过程",
                function(){
                    that.calc_all();
                }
            );
            loadding.add_process(
                "删除多余数据",
                function(){
                    that.remove();
                }
            );
            loadding.add_process(
                "更新数据",
                function(){
                    that.update();
                }
            );
            loadding.add_process(
                "新增数据",
                function(){
                    that.add();
                }
            );
            loadding.add_process(
                "更新结构",
                function(){
                    that.update_dialogue();
                }
            );
            loadding.add_process(
                "更新场景配置",
                function(){
                    that.update_scene();
                }
            );

            loadding.start(success_todo,failed_todo);
        }

}


export default{
    "Dialog":Dialog,
}
