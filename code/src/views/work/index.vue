<template>
  <el-card id="container">
    资源库：
    <el-divider></el-divider>

    <!-- <el-row :gutter="10">
      <el-row :gutter="10" class="work-list" style="margin-top:10px;">
        <el-col :span="4" v-for="(item,index) in top_bg_list" :key="index" style="margin-top:10px;">
          <el-badge :value="item.id" class="mark">
            <el-card> -->

              <!-- <el-image style="width: 100%; min-height: 100px;" :src="item.pic_url"/> -->

              <!-- <img src="@/assets/404_images/404.png" style="width: 100%; min-height: 100px;">
              <el-button class='btn' type="danger" plain @click="favourite(item)">收藏</el-button>
              <el-button class='btn' type="danger" plain @click="download(item)">下载</el-button>
            </el-card>
          </el-badge>
        </el-col>
      </el-row>
    </el-row> -->

    <waterfall :col="6" :data="top_bg_list" class="work-list">
      <template>
        <div v-for="(item,index) in top_bg_list" class="work" :key="index">
          <el-card>
            <!-- <img src="@/assets/404_images/404.png" style="width: 100%; min-height: 100px;"> -->
            <el-image style="width: 100%; min-height: 100px;" :src="prefix.image+item.pic_url"/>
            <el-button class='btn' type="danger" plain @click="favourite(item)">收藏</el-button>
            <el-button class='btn' type="danger" plain @click="download(item)">下载</el-button>
          </el-card>
        </div>
      </template>
    </waterfall>

  </el-card>
</template>

<script>
import { Message } from 'element-ui'
import { getallimg,setfavourite } from '@/api/api'
export default {
  name: 'Work',
  data() {
    return {
      prefix: {
        image: 'http://182.92.124.204:5222/',
        // image: 'https://speechdb-oss-image.oss-cn-beijing.aliyuncs.com/',
        // text: 'https://speechdb-oss-text.oss-cn-beijing.aliyuncs.com/'
      },
      top_bg_list:[],
    }
  },
  mounted() {
    this.getTopBg();
  },
  methods: {
    getTopBg(){

      getallimg().then(res => {
        console.log("this is res")
        console.log(res)
        var that=this
        that.top_bg_list=[]
        res.forEach(element => {
          that.top_bg_list.push(element)
        });
        console.log("this is top_bg_list")
        console.log(this.top_bg_list)
      })
    },
    favourite(item){
      // setfavourite({id:item.id}).then(res => {
      //   Message.success('收藏成功');
      // })
    },
    download(item){

    }
  }
}
</script>

<style lang="scss" scoped>
.el-button+.el-button{
  margin-left: 0px;
}
.work{
  margin: 5px;
}
#container{
  // margin: 10px;
  min-height: calc(100vh - 90px);
  // min-height: 700px;
  background-color: darkgrey;
}
.el-card{
  border: 0px;
  border-radius: 0px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  margin-left: 10px;
  width: 90px;
  vertical-align: bottom;
}
.search_button{
  display: flex;
  align-content: center;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.work-list{
  .el-image{
    border-radius: 10px;
  }
  .title{
    font-size:1.2rem;
    font-weight: bold;
    padding:0px 10px;
  }
  .desc{
    padding:5px 10px; 
    font-size:0.6rem;
    color:#666;
  }
  .create_at{
    padding:5px 10px; 
    font-size:0.6rem;
    color:#666;
  }
  .tags{
    padding: 0px 10px;
    margin:5px 0px;
    .tag{
      font-size:0.7rem;
      margin:5px 0px;
      margin-right:5px;
      background:rgba(0,0,0,0.1);
      text-align: center;
      padding:3px 10px;
      border-radius: 10px;
    }
  }
  .btn{
    margin-top:10px;
    width:100%;
    // height: 30px;
    // line-height:30px;
  }

}
.sec-line{
  height: 50px;
  line-height: 50px;
  border-radius: 10px;
  border: 1px solid #eee;
  padding: 5px 20px;
  box-sizing: content-box;
  margin: 10px 0px;
  box-shadow: 0px 5px 10px -5px rgba(0,0,0,.1);
  .title{
      font-size: 1.6rem;
      font-weight: bold;
      margin-right: 20px;
      float:left;
  }
  .desc{
      font-size: 0.8rem;
      width: calc(80% - 100px);
      height:100%;
      overflow: hidden;
      display: block;
      float:left;
      color:#666;
  }
  .edit{
      float:right;
      margin:0px 5px;
  }
  .delete{
      float:right;
      margin:0px 5px;
  }
}
</style>
