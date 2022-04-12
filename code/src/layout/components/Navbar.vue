<template>
  <div class="navbar">
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->
    <!-- <img src="@/assets/404_images/404.png" class="mydawpimg" @click="$router.push('/count')"> -->
    <p class="mydawpimg">电影数据库</p>

    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <!-- <div class="mydiv">
      <el-input v-model="search" class="mysearchbox" size="small"></el-input>
      <el-button @click="$router.push('/work')" class="mysearchbutton" size="small">搜索</el-button>
    </div> -->

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" src='https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/section">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { Logout } from '@/api/api'
import { removeToken } from '@/utils/auth'
import { getPubKey } from '@/api/api'


export default {
  data(){
    return{
      search:"",
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
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
    }
  }
}
</script>

<style lang="scss" scoped>
.mydawpimg{
  height: 40px;
  width: 200px;
  position: absolute;
  top: 13px;
  left: 30px;
  margin: 0px;
  font-size: 24px;
}
.mysearchbox{
  width: 250px;
  padding: 5px;
  // font-size: 10px;
  // margin: 5px;
}
.mysearchbutton{
  // padding: 5px,0;
  margin: 5px;
}
.mydiv{
  position: absolute;
  top: 50%;
  transform: translate(0,-50%);
  left: 60px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #5a5e66;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
