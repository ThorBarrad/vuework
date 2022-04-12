<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getPubKey } from '@/api/api'

export default {
  name: 'App',
  mounted() {
    
  }
}

</script>

<style>
html,body,#app{
  height: 100%;
}
</style>
