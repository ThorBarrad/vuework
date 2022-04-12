<template>
  <el-card id="container">
    主页：
    <el-divider></el-divider>
    <el-form>
      <el-container class="mycontainer">
        <el-main>
          <el-header>
            <el-image style="width: 100%; min-height: 100px;" :src="prefix.image+pic_url"/>
          </el-header>
          <el-main class="editor">  
          </el-main>
          <el-footer>
          </el-footer>
        </el-main>
        <el-aside width="50%">

          <el-form-item label="封图上传">
            <el-upload
              class="upload-demo"
              action=""
              :file-list="modal.pic"
              :before-upload="handlePicUpload"
              list-type="picture"
            >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              <div>只能上传jpg/png文件</div>
            </div>
            </el-upload>
          </el-form-item>

          <p class="setborder">请输入关键词</p>

          <el-form-item>
            <el-input v-model="modal.description" type="textarea" :rows="5"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button @click="submitUpload">生成</el-button>
          </el-form-item>

        </el-aside>
      </el-container>
    </el-form>
  </el-card>
</template>

<script>
import { Message } from 'element-ui'
import { upload } from '@/api/api'

const modal_template = {
  pic: [],
  description:"",
}
export default {
  name: 'Work',
  data() {
    return {
      prefix: {
        // video: 'http://cucmcl913.ml:20001/pic/',
        // image: 'http://cucmcl913.ml:20001/pic/',
        image: 'http://182.92.124.204:5222/',
        // text: 'https://speechdb-oss-text.oss-cn-beijing.aliyuncs.com/'
      },
      modal: JSON.parse(JSON.stringify(modal_template)),
      pic_url:"",
      winheight:1000,
    }
  },
  computed: {
    
  },
  mounted() {

  },
  methods: {
    
    
    
    submitUpload() {
      console.log(this.modal)
      if (this.modal.pic.length == 0) { Message.warning('未上传封图'); return }
      if (this.modal.description == '') {Message.warning('未填写关键词');return}
      const form_data = new FormData()
      form_data.append('pic', this.modal.pic[0])
      form_data.append('description', this.modal.description)
      upload(form_data).then(res => {
        console.log(res)
        this.pic_url=res.pic_url
        Message.success('新增作品成功')
      })
    },
    handlePicUpload: function(file) {
      console.log(file)
      this.modal.pic.push(file)
      return false
    },
  }
}
</script>

<style lang="scss" scoped>
.setborder{
  margin: 10px;
}
.mycontainer{
  margin: 30px;
  background-color:gainsboro;
  height: calc(100vh - 300px);
}
#container{
  // margin: 10px;
  height: calc(100vh - 90px);
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
  .el-card{
    margin: 3px;
  }
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
      margin:5px 1px;
      background:rgba(0,0,0,0.1);
      text-align: center;
      padding:3px 5px;
      border-radius: 10px;
      float:left;
    }
  }
  .btn{
    margin-top:10px;
    width:100%;
  }
}
</style>
<style scoped>
  .el-dialog__wrapper >>> .el-dialog__body{
    padding: 0;
  }
  .el-dialog__wrapper >>> .el-header{
    height: 40px !important;
  }
  .el-dialog__wrapper >>> .el-footer{
    height: 40px !important;
  }
  .el-dialog__wrapper .editor{
    /* height: 77vh; */
  }
  .el-aside .el-form-item{
    margin: 10px;
  }
  .el-upload__tip {
    line-height: 20px;
  }
  .el-main{
    overflow:visible;
  }
</style>
<style>
  .tox-tinymce-aux {
    z-index: 3000 !important;
  }
</style>
