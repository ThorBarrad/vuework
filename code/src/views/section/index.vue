<template>
  <el-card id="container">


    <el-row :gutter="0" class="myrow">
      <!-- <el-col :span="2">
        <img class="personalimg" src="@/assets/404_images/tou.png"/>
      </el-col> -->
      <el-col :span="20">
        <div class="myinfo">
          <div class="title">{{ "欢迎！ "+username}}</div>
          <!-- <div class="desc">{{ "关注: "+personal.subscribe }}</div> -->
        </div>
      </el-col>
      <el-col :span="4">
        <el-button class="leftbuttom" @click.native="logout">退出登录</el-button>
      </el-col>
    </el-row>


    <el-divider></el-divider>


    <el-form size="mini">
      <el-form-item class="myrow">
        <div class="desc">您的浏览历史：</div>
      </el-form-item>
    </el-form>
    <waterfall :col="6" :data="movielist" class="work-list">
          <template>
            <div v-for="(item,index) in movielist" class="work" :key="index">
              <el-card>
                <p style="font-size:20px">{{item.title}}</p>
                <el-tag v-for="(tagitem,index) in item.tags" :key="index" size="mini">{{item.tags[index]+"("+item.relevance[index]*100+"%)"}}</el-tag>
                <!-- <p style="font-size:15px">{{"类别："+item.genre}}</p> -->
                <!-- <p style="font-size:15px">{{"关联度："+item.relevance}}</p> -->
                <p style="font-size:15px">{{"观看时间："+item.created_on}}</p>
                <a :href="prefix.url_title+item.imdb">
                  <img :src="item.src" style="width:100%">
                </a>
              </el-card>
            </div>
          </template>
        </waterfall>
        <waterfall :col="1" :data="movielist" class="work-list-mobile">
          <template>
            <div v-for="(item,index) in movielist" class="work" :key="index">
              <el-card>
                <p style="font-size:20px">{{item.title}}</p>
                <el-tag v-for="(tagitem,index) in item.tags" :key="index" size="mini">{{tagitem}}</el-tag>
                <!-- <p style="font-size:15px">{{"类别："+item.genre}}</p> -->
                <!-- <p style="font-size:15px">{{"关联度："+item.relevance}}</p> -->
                <p style="font-size:15px">{{"观看时间："+item.created_on}}</p>
                <a :href="prefix.url_title+item.imdb">
                  <img :src="item.src" style="width:100%">
                </a>
              </el-card>
            </div>
          </template>
        </waterfall>
  </el-card>
</template>

<script>
import { Message } from 'element-ui'
import { search_by_userid,rec_by_userid } from '@/api/api'
import { removeToken } from '@/utils/auth'
import { getPubKey } from '@/api/api'
export default {
  name: 'Work',
  data() {
    return {
      username:sessionStorage.getItem('username'),
      prefix: {
        url_title:'https://www.imdb.com/title/tt',
      },
      movielist:[
        // {title:"toy story",tags:["children","classic","new"],created_on:"2019",relevance:[0.9,0.8,0.7],imdb:"114709",src:"https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_QL75_UX190_CR0,1,190,281_.jpg"},
      ],
      personal:{
        name:"神奇的托尔巴拉德",
        id:"123",
        subscribe:"13",
        description:"",
        top_bg_list:[],
      },
      modal: {
        visible: false,
        pic: [],
        name:"",
        description:"",
        loginkey:"",

      },
    }
  },
  mounted() {
    this.getbyuserid();
  },
  methods: {
    getbyuserid(){
      console.log(sessionStorage.getItem('userid'))
      search_by_userid({userid:sessionStorage.getItem('userid')}).then(res=>{
        console.log(res)
        var that = this
        if(res){
          that.movielist = res
        }
        that.movielist.forEach(element=>{
          if(element.imdb.length==5){
            element.imdb='00'+element.imdb
          }
          else if(element.imdb.length==6){
            element.imdb='0'+element.imdb
          }
        })
      })
    },
    async logout() {
      removeToken()
      // getPubKey().then(res => {
      //   sessionStorage.setItem('publicKey', res.pubkey)
      //   sessionStorage.setItem('csrf_token', res.csrf_token)
      // },err => {
      //     console.log(err)
      // })
      // var id = Math.random()
      // const form_data = new FormData()
      // form_data.append('id', id)
      // form_data.append('pubkey', sessionStorage.getItem('publicKey'))
      // RetrieveCaptcha(form_data).then(res => {
      //   this.captcha_name = res.captcha_name
      // })
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },







    getTopBg(){
      // getallimg().then(res => {
      //   console.log("this is res")
      //   console.log(res)
      //   var that=this
      //   that.personal.top_bg_list=[]
      //   res.forEach(element => {
      //     that.personal.top_bg_list.push(element)
      //   });
      //   console.log("this is top_bg_list")
      //   console.log(this.personal.top_bg_list)
      // })
    },
    add_top_bg(){
      this.modal={
        visible: true,
        pic:[],
        name:"",
        description:"",
        loginkey:"",
      }
    },
    handlePicUpload: function(file) {
      console.log(file)
      this.modal.pic.push(file)
      return false
    },
    submitTopBgUpload(){
      console.log(this.modal)
      if (this.top_bg_modal.pic.length == 0){Message.warning('未上传头图');return}
      const form_data = new FormData()
      form_data.append('pic', this.modal.pic[0])
      form_data.append('name', this.modal.name)
      form_data.append('description', this.modal.description)
      form_data.append('loginkey', this.modal.loginkey)
      console.log(form_data)
      // updateinfo(form_data).then(res => {
      //   console.log('更新个人信息成功')
      //   this.getTopBg();
      //   this.top_bg_modal.visible=false
      // })
    },
  }
}
</script>

<style lang="scss" scoped>
@media screen and (max-width: 700px){
    .work-list{
        display: none;
    }
    .work-list-mobile{
        display: block;
    }
    // .mysearchbox{
    //   margin-top: 5px;
    // }
}
@media screen and (min-width: 701px){
    .work-list{
        display: block;
    }
    .work-list-mobile{
        display: none;
    }
}
.work{
  margin: 5px;
  .el-card{
    border-radius: 5px;
    box-shadow:1.5px 1.5px 0px 0px #666;
  }
}
.el-button+.el-button{
  margin-left: 0px;
}
.myinfo{
  position: relative;
  // left: 10%;
  top: 50%;
  transform: translate(0,25%);
}
.title{
  font-size: 23px;
  font-weight: 500;
  line-height: 30px;
}
.desc{
  font-size: 20px;
  line-height: 30px;
}
.myrow{
  width: 90%;
  position: relative;
  left: 50%;
  transform: translate(-50%,0);
}
.leftbuttom{
  position: relative;
  left: 100%;
  transform: translate(-70%,0%);
}
.rightbuttom{
  position: relative;
  left: 100%;
  transform: translate(-200%,0%);
}
.personalimg{
  position: relative;
  left:50%;
  transform: translate(-50%,0);
  height: 100px;
  width: 100px;
  border-radius: 50px;
  background-color: aqua;
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
.work-list-mobile{
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
