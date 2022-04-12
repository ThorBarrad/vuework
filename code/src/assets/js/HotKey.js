const $ = require("jquery");
function HotKey(){
    this.rootDom = $("body")[0];
    this.hotkeys=[];
        /*
        {
        "keys":[],//keys
        "todo":,//function
        }
        */ 
    this.enable=[];
    // this.key_status=[];
}


HotKey.prototype={
    setRootDom:function(rootDom){
        this.rootDom=rootDom;
    },
    __init__:function(){
        var that=this;
        // init key_status;
        // for(let i =0;i<255;i++){
        //     this.key_status[i]=false;
        // };
        this.rootDom.onkeydown = function (e) {
            // console.log(e.keyCode);
            for(var i =0;i< that.hotkeys.length;i++){
                if(that.enable[i]){
                    var flag=true;
                    for(var key in that.hotkeys[i]["keys"]){
                        if(that.hotkeys[i]["keys"][key]==17 && e.ctrlKey){continue;}
                        else if(that.hotkeys[i]["keys"][key]==18 && e.altKey){continue;}
                        else if(that.hotkeys[i]["keys"][key]==16 && e.shiftKey){continue;}
                        else if(e.keyCode==that.hotkeys[i]["keys"][key]){continue;}
                        else{flag=false;break;}
                    }
                    if(flag){that.hotkeys[i]["todo"]();}
                }else{continue;}
            }
        };
        // this.rootDom.onkeyup=function(e){
        //     that.key_status[e.keyCode]=false;
        // }
    },
    add_keys:function(keys,todo){
        //console.log(this);
        var key=this.hotkeys.length;
        var flag=true;
        for(var i =0;i<this.hotkeys.length;i++){
            flag=true;
            if(this.hotkeys[i].keys.length!=keys.length){flag=false;continue;}
            for(var j=0;j<this.hotkeys[i].keys.length;j++){
                if(this.hotkeys[i].keys[j]!=keys[j]){flag=false;break;}
            }
            if(flag)break;
        }
        if(key!=0&&flag)return;
        this.hotkeys[key]={
            "keys":keys,
            "todo":todo,
        };
        this.enable[key]=true;
        
        return key;
    },
    disabel_keys:function(index){
        try{
            this.enable[index]=false;
        }catch{
            console.log("disable_keys("+index+") Wrong!:"+index+" NOT FOUND!")
        }       
    }
}

export default{
    "HotKey":new HotKey()
}