<template>
  <div class="navbar">
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <!-- <breadcrumb class="breadcrumb-container" /> -->

    <!-- <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img class="user-avatar" src='https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              Homee
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">Log Out</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->

    <!-- <div @click="$router.push('/course')" class="toaboutus">关于我们</div> -->
    <!-- <div @click="$router.push('/teacher')" class="tofeedback">问题反馈</div> -->
    <div @click="$router.push('/movie')" class="toaboutus">电影数据库</div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { Logout } from '@/api/api'
import { removeToken } from '@/utils/auth'

export default {
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
      Logout().then(() => {
        removeToken()
        this.$store.state.user.token = null
        this.$store.state.user.name = null
        console.log("已经退出登录")
        this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.toaboutus{
  // height: 50px;
  // left:0%;
  // width: 100%;
  color: aliceblue;
  position: absolute;
  font-size: 17px;
  margin: 10px;
}
.tofeedback{
  // height: 50px;
  // left:100px;
  color: aliceblue;
  transform: translate(130%,0);
  position: absolute;;
  font-size: 17px;
  margin: 10px;
}
.tofeedback2{
  // height: 50px;
  // left:100px;
  color: aliceblue;
  transform: translate(230%,0);
  position: absolute;;
  font-size: 17px;
  margin: 10px;
}
.navbar {
  height: 40px;
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
