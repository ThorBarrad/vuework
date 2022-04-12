<template>
  <el-card id="container">
    关于我们：
    <el-divider></el-divider>
    <el-form class="myform">
      <el-row :gutter="10">
        <el-col :span="12">
          <el-container class="mycontainer1">
      
          </el-container>
        </el-col>
        <el-col :span="12">
          <el-container class="mycontainer2">
      
          </el-container>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
import { Message } from 'element-ui'
export default {
  name: 'Work',
  data() {
    return {
      
    }
  },
  computed: {
    
  },
  mounted() {
    
  },
  methods: {
    
  }
}
</script>

<style lang="scss" scoped>
.myform{
  width: 80%;
  position: absolute;
  left: 50%;
  transform: translate(-50%,0);
}
#container{
  // margin: 10px;
  height: calc(100vh - 90px);
  // min-height: 700px;
  background-color: darkgrey;
}
.mycontainer1{
  margin: 30px;
  background-color:gainsboro;
  height: calc(100vh - 300px);
  // width: 40%;
}
.mycontainer2{
  margin: 30px;
  background-color:gainsboro;
  height: calc(100vh - 300px);
  // width: 40%;
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
