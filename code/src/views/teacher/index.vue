<template>
  <el-card id="container">
    问题反馈：
    <el-divider></el-divider>
    <el-form size="mini" class="myfeedback">
      <el-form-item>
        <p>请在下方输入框提交您的问题反馈，或者邮箱联系我们zhuoliang233@163.com</p>
      </el-form-item>
      <el-form-item>
        <el-input v-model="comment" type="textarea" :rows="15"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="clear" class="leftbuttom">清空</el-button>
        <el-button type="danger" plain @click="submitUpload" class="rightbuttom">提交</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { Message } from 'element-ui'
import { uploadComment } from '@/api/api'
export default {
  name: 'Work',
  data() {
    return {
      comment:"",
    }
  },
  computed: {
    
  },
  mounted() {
    
  },
  methods: {
    clear(){
      this.comment=""
    },
    submitUpload() {
      console.log(this.comment)
      if (this.comment == '') {Message.warning('未填写');return}
      Message.success('提交成功')
      // uploadComment({comment:this.comment}).then(res => {
      //   if(res.error_code==0){
      //     Message.success('新增教师成功')
      //   }
      //   else{
      //     Message.error("新增教师失败")
      //   }
      // })
    },
  }
}
</script>

<style lang="scss" scoped>
.myfeedback{
  width: 80%;
  position: absolute;
  left: 50%;
  transform: translate(-50%,0);
}
.leftbuttom{
  position: absolute;
  left: 50%;
  transform: translate(-250%,0);
}
.rightbuttom{
  position: absolute;
  left: 50%;
  transform: translate(150%,0);
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
    // height: 30px;
    // line-height:30px;
  }

}
</style>
