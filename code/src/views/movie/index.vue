<template>
  <el-card id="container">
    欢迎！{{username}}
    <el-button class="leftbuttom" @click.native="recommend">为我推荐</el-button>
    <el-divider></el-divider>
    <el-input v-model="keyword" placeholder="请输入keyword" class="mysearchbox" size="small"></el-input>
    <el-autocomplete v-model="genre" placeholder="请输入genre" class="mysearchbox" size="small" :fetch-suggestions="querySearchAsync"></el-autocomplete>
    <select type="text" id="select_input" class="mysearchbox2" v-model="gender">
        <option v-for="(gender, index) in gender_selection" :value="index" :key="index">{{ gender }}</option>
    </select>
    <el-button class="mysearchbutton" size="small" @click="handlesearch">搜索</el-button>
    <waterfall :col="6" :data="movielist" class="work-list">
      <template>
        <div v-for="(item,index) in movielist" class="work" :key="index">
          <el-card>
            <p style="font-size:20px">{{item.title}}</p>
            <el-tag v-for="(tagitem,index) in item.tags" :key="index" size="mini">{{tagitem}}</el-tag>
            <!-- <p style="font-size:15px">{{"类别："+item.genre}}</p> -->
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
import { search_by_all,search_by_userid,getallgenre,rec_by_userid } from '@/api/api'
import axios from 'axios'


export default {
  name: 'Work',
  data() {
    return {
      username:sessionStorage.getItem('username'),
      prefix: {
        url_title:'https://www.imdb.com/title/tt',
      },
      keyword:"",
      userid:"",
      gender_selection: ["无性别","Female", "Male"],
      genre_selection: ["no tag","quanquan", "helmet"],
      gender:0,
      genre:"",
      movielist:[
        // {title:"toy story",tags:["children","classic","new"],imdb:"114709",src:"https://m.media-amazon.com/images/M/MV5BMDU2ZWJlMjktMTRhMy00ZTA5LWEzNDgtYmNmZTEwZTViZWJkXkEyXkFqcGdeQXVyNDQ2OTk4MzI@._V1_QL75_UX190_CR0,1,190,281_.jpg"},
      ],
    }
  },
  mounted() {
    this.getgenre()
    this.handlesearch()
  },
  methods: {
    recommend(){
      rec_by_userid({userid:sessionStorage.getItem('userid')}).then(res=>{
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
    querySearchAsync(queryString, cb) {
      //在这里为这个数组中每一个对象加一个value字段, 因为autocomplete只识别value字段并在下拉列中显示，所以我从新封装了
      let programs = this.genre_selection
      let programList = [];
      for(let i=0;i<this.genre_selection.length;i++){
        programList.push({'value':programs[i]})
      }
      let results = queryString ? programList.filter(this.createStateFilter(queryString)) : programList;
	    //基本思路就是实现一个过滤器，过滤存在你输入字段的所有数据。
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 1000 * Math.random());
    },
    createStateFilter(queryString) {
      return (program) => {
        return (program.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
      };
    },
    handleSelect(item) {
      this.event.programCode = item.value
    },
    //hangdleSelect你选中那行，item就就是那那条数据，直接赋值v-modal就实现回显了。
    getTopBg(){

    },
    favourite(item){

    },
    download(item){

    },
    getgenre(){
      getallgenre().then(res=>{
        console.log("this is genre res")
        console.log(res)
        var that = this
        that.genre_selection = res
      })
    },
    handlesearch(){
      console.log(this.genre,this.keyword,this.gender)
      if(this.genre==""&&this.keyword==""&&this.gender==0){
        search_by_userid({userid:sessionStorage.getItem('userid')}).then(res=>{
          console.log("this is movie res")
          console.log(res)
          var that = this
          if(res){
            that.movielist = res
          }
          that.movielist.forEach(element=>{
            if(element.imdb.length==5){
              element.imdb='00'+element.imdb
            }
            if(element.imdb.length==6){
              element.imdb='0'+element.imdb
            }
          })
        })
      }
      else{
        search_by_all({genre:this.genre, keyword:this.keyword, gender:this.gender}).then(res=>{
          console.log("this is movie res")
          console.log(res)
          var that = this
          if(res){
            that.movielist = res
          }
          that.movielist.forEach(element=>{
            if(element.imdb.length==5){
              element.imdb='00'+element.imdb
            }
            if(element.imdb.length==6){
              element.imdb='0'+element.imdb
            }
          })
        })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.leftbuttom{
  position: relative;
  left: 100%;
  transform: translate(-250%,0%);
}
@media screen and (max-width: 700px){
    .work-list{
        display: none;
    }
    .work-list-mobile{
        display: block;
    }
    .mysearchbox{
      margin-top: 5px;
    }
}
@media screen and (min-width: 701px){
    .work-list{
        display: block;
    }
    .work-list-mobile{
        display: none;
    }
}
.mysearchbox{
  width: 200px;
  margin-left: 5px;
  margin-right: 5px;
  box-shadow:1.5px 1.5px 0px 0px #666;
  // font-size: 10px;
  // margin: 5px;
}
.mysearchbox2{
  width: 200px;
  padding-left: 5px;
  padding-right: 5px;
  padding-bottom: 5px;
  padding-top: 3px;
  margin-left: 5px;
  margin-right: 5px;
  border-radius: 5px;
  box-shadow:1.5px 1.5px 0px 0px #666;
}
.mysearchbutton{
  // padding: 5px,0;
  margin: 5px;
  box-shadow:1.5px 1.5px 0px 0px #666;
}
.el-button+.el-button{
  margin-left: 0px;
}

.work{
  margin: 5px;
  .el-card{
    border-radius: 5px;
    box-shadow:1.5px 1.5px 0px 0px #666;
  }
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
