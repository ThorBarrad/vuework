
const groups = {
    // 输入链接桩群组定义
    in: {
        position: 'top',
        attrs: {
          circle: {
            r: 4,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
          },
        },
      },
      // 输出链接桩群组定义
    out: {
        position: 'bottom',
        attrs: {
            circle: {
            r: 4,
            magnet: true,
            stroke: '#31d0c6',
            strokeWidth: 2,
            fill: '#fff',
            },
        },
    }
}

module.exports={
    "edge":{
        shape:"edge",
        source:"",
        target: "",
        data:{
            form:{
                id:null,
                parent_id:null,
                children_id:null,
                is_start:0,
                remark:"",
            },
            updated:false,
        },

        // connector: { name: 'rounded' },
        // router: {
        //     name: 'manhattan',
        //     args: {
        //       startDirections: ['bottom'],
        //       endDirections: ['top'],
        //     },
        // },
    },
    "start":{
        width: 100,
        height: 40,
        attrs: {
            body: {
            stroke: 'black',
            fill: 'white',
            rx: 20,
            ry: 20,
            },
            label:{
                text:"START"
            }
        },
        updated:false,
        data:{
            form:{
                element_id:null,
                scene_id:null,
                element_type:"start",
                element_content:"START",
                element_condition:"",
                is_start:1,
                is_end:0,
            },
            updated:false,
        },
        ports:{
            groups:groups,
            items:[
                {id:"output_port",group:"out"}
            ]
        }
    },
    "end":{
        width: 100,
        height: 40,
        attrs: {
            body: {
            stroke: 'black',
            fill: 'white',
            rx: 20,
            ry: 20,
            },
            label:{
                text:"END"
            }
        },
        updated:false,
        data:{
            form:{
                element_id:null,
                scene_id:null,
                element_type:"end",
                element_content:"END",
                element_condition:"",
                is_start:0,
                is_end:1,
            },
            updated:false,
        },
        ports:{
            groups:groups,
            items:[
                {id:"input_port",group:"in"}
            ]
        }
    },
    "scene":{
        width: 100,
        height: 40,
        
        attrs: {
            body: {
            stroke: '#00bcd4',
            fill: '#3f51b5',
            },
            label:{
                text:"SCENE",
                // stroke:"white",
                fill:"white"
            }
        },
        data:{
            form:{
                element_id:null,
                scene_id:null,
                element_type:"scene",
                element_content:"SCENE",
                element_condition:"",
                is_start:0,
                is_end:0,
            },
            updated:false,
        },
        ports:{
            groups:groups,
            items:[
                {id:"input_port",group:"in"},
                {id:"output_port",group:"out"}
            ]
        }
    },
    "condition":{
        shape: 'polygon',
        width: 60,
        height: 60,
        attrs: {
            body: {
                fill: 'white',
                stroke: 'black',
                // 指定 refPoints 属性，多边形顶点随图形大小自动缩放
                // https://x6.antv.vision/zh/docs/api/registry/attr#refpointsresetoffset
                refPoints: '0,10 10,0 20,10 10,20',
            },
            label: {
                text: 'Condition',
                fill: 'black',
                textAnchor:"middle"
            },
        },
        data:{
            form:{
                element_id:null,
                scene_id:null,
                element_type:"condition",
                element_content:"Condition",
                element_condition:"",
                is_start:0,
                is_end:0,
            },
            updated:false,
        },
        ports:{
            groups:groups,
            items:[
                {id:"input_port",group:"in"},
                {id:"output_port",group:"out"}
            ]
        }
    }
}