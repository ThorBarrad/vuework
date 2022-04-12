<template>
  <el-card id="container">
    管理员权限：
    <el-divider></el-divider>
    <el-row class="sec-line">
      <span class='title'>{{section_info.title}}</span>
      <span class='desc'>{{section_info.description}}</span>
    </el-row>

    <el-row :gutter="10" size="mini">
      <el-row style="margin-bottom: 10px;text-align: center;line-height: 40px;">
        <el-col :span="4">标题：</el-col>
        <el-col :span="20">
          <el-input v-model="section_info.title"></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px;text-align: center;line-height: 40px;">
        <el-col :span="4" >描述：</el-col>
        <el-col :span="20">
          <el-input v-model="section_info.description"></el-input>
        </el-col>
      </el-row>
      <el-row style="text-align:center;">
        <el-button type="primary" plain @click="submitSectionUpdate">提交</el-button>
      </el-row>
    </el-row>
    <el-divider/>

    <el-row>
      <el-button type="primary" plain @click="add_item">新增项</el-button>
      <el-row class="item-line" v-for="item in item_list" :key="item.id">
        <span class='title' @click="show_item_work(item)">{{item.title}}</span>
        <span class='desc'>{{item.description}}</span>
        <span class="delete">
            <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
              <el-button type="danger" icon="el-icon-delete" circle @click="deleteItem(item)"></el-button>
            </el-tooltip>
        </span>
      </el-row>

      <el-dialog
        title="新增项"
        :visible.sync="item_modal.visible"
        width="800px"
        center
      >
        <el-tooltip class="item" effect="dark" content="刷新works" placement="bottom">
          <el-button type="primary" icon="el-icon-refresh" circle @click="getAllWorks(true)"></el-button>
        </el-tooltip>

        <div class='works-board'>
          <el-row  :gutter="5" v-for="(work,index) in works_dict" style="margin:5px;" :key="index">
              <el-radio v-model="item_modal.work_id" :label="work.id" :disabled="work.selected" border @change="change_item_work(work)">
                  {{work.title}} || {{work.create_at}} ||
                  <span class='tags'>
                    <span class="tag" v-for="tag in work.tag.split(';')" :key="tag">{{tag}} </span>
                  </span> ||{{categories[work.category]}}
              </el-radio>
          </el-row>
        </div>
        <el-divider/>
        <el-row style="margin-bottom: 10px;text-align: left;line-height: 40px;">
          <el-col :span="2">标题：</el-col>
          <el-col :span="22">
            <el-input v-model="item_modal.title"></el-input>
          </el-col>
        </el-row>
        <el-row style="margin-bottom: 10px;text-align: left;line-height: 40px;">
          <el-col :span="2" >描述：</el-col>
          <el-col :span="22">
            <el-input v-model="item_modal.description"></el-input>
          </el-col>
        </el-row>
        <el-row style="text-align:center;">
          <el-button type="primary" plain @click="submitItemUpload">提交</el-button>
        </el-row>
      </el-dialog>
    </el-row>

    <el-dialog
        class="work-list"
        title="包含的作品内容"
        :visible.sync="show_work.visible"
        width="300px"
        center
      >
      <el-card>
        <el-image
          style="width: 200px; min-height: 100px;margin-left:calc(50% - 100px);margin-bottom:20px;"
          :src="prefix.image+show_work.pic_url"
        />
        <div class="title">{{show_work.title}}</div>
        <div class="desc">{{show_work.description}}</div>
        <div class="create_at">{{show_work.create_at}}</div>

        <div class='tags'>
          <span class="tag" v-for="tag in show_work.tag.split(';')" :key="tag">{{tag}}</span>
        </div>
      </el-card>
    </el-dialog>
  </el-card>
</template>

<script>
import { Message } from 'element-ui'
import { getSection, updateSection, getAllWorks, getItemBySection, uploadItem, deleteItem } from '@/api/api'
export default {
  name: 'Work',
  props:['id'],
  data() {
    return {
      prefix: {
        video: 'https://speechdb-oss-video.oss-cn-beijing.aliyuncs.com/',
        image: 'https://speechdb-oss-image.oss-cn-beijing.aliyuncs.com/',
        text: 'https://speechdb-oss-text.oss-cn-beijing.aliyuncs.com/'
      },
      categories: this.$store.state.categories.categories,
      section_info:{},
      works_list:[],
      works_dict:{},
      item_list:[],
      item_modal:{
        visible:false,
        work_id:-1,
        title:"",
        description:"",
        orders:0,
        section_id:0
      },
      show_work:{
        visible:false,
        id:"",
        author:"",
        category:"",
        pic_url:"",
        title:"",
        tag:"",
        description:"",
        like_num:0,
        repost_num:0,
        create_at:"",
      }
    }
  },
  mounted() {
    this.getSection();
    this.getItem();
    this.getAllWorks();
  },
  methods: {
    getSection(){
      getSection({id:this.id}).then(res=>{
        this.section_info = res.data.result
      })
    },
    getAllWorks(refresh=false){
      let _works_list = window.sessionStorage.getItem('works_list')
      if(!refresh&&_works_list){
        this.works_list = JSON.parse(_works_list)
      }else{
        getAllWorks().then(res=>{
          window.sessionStorage.setItem('works_list',JSON.stringify(res.data.result))
          this.works_list = res.data.result;
          Message.success("更新Works成功")
        })
      }
      this.works_dict = {}
      this.works_list.forEach(ele=>{
        this.works_dict[ele.id] = ele
      })
    },
    getItem(){
      getItemBySection({section_id:this.id}).then(res=>{
        this.item_list = res.data.result;
      })
    },
    add_item(){
      this.item_modal={
        visible:true,
        work_id:-1,
        title:"",
        description:"",
        orders:this.item_list.length+1,
        section_id:this.id
      }
      // refresh work_dict
      for(let i in this.works_dict){
        this.works_dict[i].selected = false
      }
      // add selected
      this.item_list.forEach(ele=>{
        this.works_dict[ele.work_id].selected = true
      })
    },
    change_item_work(work){
      this.item_modal.title = work.title;
      this.item_modal.description = work.description;
      this.item_modal.work_id = work.id
    },
    submitSectionUpdate(){
      console.log(this.section_info)
      if (this.section_info.title.length == 0){Message.warning('未填写标题');return}
      if (this.section_info.description.length == 0){Message.warning('未填写描述');return}
      let data = {
        id: this.section_info.id,
        keys:[
          {key:'title',value:this.section_info.title},
          {key:'description',value:this.section_info.description},
        ]
      }
      updateSection(data).then(res => {
        // this.getSection();
        Message.success('更新版块成功')
      })
    },
    submitItemUpload(){
      console.log(this.item_modal)
      if (this.item_modal.work_id == -1){Message.warning('未选择作品');return}
      if (this.item_modal.title.length == 0){Message.warning('未填写标题');return}
      if (this.item_modal.description.length == 0){Message.warning('未填写描述');this.item_modal.description="";}
      let data = {
        section_id :this.item_modal.section_id,
        work_id: this.item_modal.work_id,
        title:this.item_modal.title,
        description:this.item_modal.description,
        orders:this.item_modal.orders
      }
      uploadItem(data).then(res=>{
        this.getItem();
        Message.success('上传Item成功')
        this.item_modal.visible = false
      })
    },
    deleteItem(item){
      deleteItem({id:item.id}).then(res=>{
        Message.success('删除Item成功')
        this.getItem();
      })
    },
    show_item_work(item){
      this.show_work.visible = true;
      for(let k in this.works_dict[item.work_id]){
        this.show_work[k] = this.works_dict[item.work_id][k]
      }
      console.log(this.show_work)
    }
  }
}
</script>

<style lang="scss" scoped>
#container{
  // margin: 10px;
  height: 100%;
  background-color: darkgrey;
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
.works-board{
  margin:10px 0px;
  max-height:40vh;
  overflow-y: scroll;
  overflow-x: hidden;
}

.item-line{
  height: 40px;
  line-height: 40px;
  border-radius: 5px;
  border: 1px solid #eee;
  border-left: 10px solid #eee;
  padding: 5px 20px;
  box-sizing: content-box;
  margin: 10px 0px;
  // box-shadow: 0px 5px 10px -5px rgba(0,0,0,.1);
  .title{
      font-size: 1.2rem;
      font-weight: bold;
      margin-right: 20px;
      float:left;
      cursor: pointer;
  }
  .desc{
      font-size: 0.6rem;
      width: calc(80% - 100px);
      height:100%;
      overflow: hidden;
      display: block;
      float:left;
      color:#666;
  }
  .delete{
      float:right;
      margin:0px 5px;
  }
}
</style>
