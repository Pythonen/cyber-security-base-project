<template>
  <div id="app">
    <button v-if="loginView && !this.token" @click="registerView = true, loginView = false">Register!</button>
    <button v-if="this.token" @click='signOut'>Logout</button>
    <div v-if="!this.token && this.loginView" id='login'>
      <h1>{{this.warning}}</h1>
      <h1>Login</h1>
      <form>
        <input type="text" name="name" v-model="name">
        <input type="password" name="password" v-model="password">
        <input type="submit" @click.prevent="signIn">
      </form>
    </div>
   <div v-if="this.token">
     <h1>Your diary!</h1>
    <div :key="entry.title" v-for="entry in entries"  id="index">
      <div v-html="entry.title" style="font-size: 2em; font-weight: bold"></div>
      <p>{{entry.body}}</p>
    </div>
  </div>
  <div v-if="this.token">
    <form>
        <input type="text" name="title" v-model="title">
        <br/>
        <input type="text" name="body" v-model="body">
        <input type="submit" @click.prevent="sendEntry">
      </form> 
  </div>

  <div v-if="this.registerView">
   <h1>{{this.warning}}</h1>
    <h1>Register</h1>
   <form>
        <input type="text" name="name" v-model="name">
        <input type="password" name="password" v-model="password">
        <input type="submit" @click.prevent="registerUser">
      </form> 
  </div>

  </div>
</template>

<script>

import axios from 'axios';
export default {
  name: 'App',
  data: () => ({
    loginView: true,
    registerView: false,
    entries: [],
    token: localStorage.token,
    name: "",
    password: "",
    title: "",
    body: "",
    warning: ''
  }),
  mounted() {
    if (this.token){
      this.fetchDiary()
    }
  },
  methods: {
    async fetchDiary() {
      const config = {
        headers: { Authorization: this.token }
    }
      const res = await axios.get("http://localhost:5000/diaries",config);
      const diaries = res.data;
      this.entries = diaries
    },
    async signIn() {
      const res = await axios.post("http://localhost:5000/login", {name: this.name, password: this.password});
      if(res.data.message && res.data.message.startsWith('Name or password wrong')) {
        this.warning = res.data.message;
        setInterval(() => {
          this.warning = ''
        }, 3000)
        this.name = ''
        this.password = ''
        return;
      }
      this.token = res.data
      localStorage.token = this.token;
      this.name = ''
      this.password = ''
      console.log(this.token)
      if(this.token || localStorage.token) {
        this.isLoggedIn = true
        this.fetchDiary()
      }
    },
    signOut(){
      this.token = '';
      localStorage.token = ''
      this.isLoggedIn = false
    },
    async sendEntry(){
      console.log(this.title, this.body)
      const config = {
        headers: { Authorization: this.token }
      }
      const res = await axios.post('http://localhost:5000/diary',{title: this.title, ret: this.body}, config)
      if(res.status === 200){
        this.entries.push({title: this.title, body: this.body})
        this.title = '';
        this.body = ''
      }
    },
    async registerUser(){
     const res = await axios.post('http://localhost:5000/register',{name: this.name, password: this.password});
      if(res.data.message && res.data.message.startsWith('User already exists')) { 
        this.warning = res.data.message;
        setInterval(() => {
          this.warning = ''
        }, 3000)
        this.name = ''
        this.password = ''
        return;
    }
    else {
      this.registerView = false;
      this.loginView = true
    }
  },
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
  margin-top: 60px;
}
</style>
