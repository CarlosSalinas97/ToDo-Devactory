<template>
  <div id="nav">
    <router-link to="/">To Do List</router-link> |
    <router-link to="/guia">Guía de uso</router-link>
  </div>
  <router-view/>
</template>

<script>
import {mapActions} from 'vuex'
export default {
  methods:{
    ...mapActions(['getTareas'])
  },
  created(){
    this.getTareas()
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  text-decoration: none;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
