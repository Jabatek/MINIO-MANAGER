<template>
  <div class="login">
    <h1>Login</h1>
    <fieldset>
      <label for="username">User Name</label>
      <input id="username" v-model="username" type="text" name="username" />
      <br />
      <label for="password">Password</label>
      <input id="password" v-model="password" type="text" name="password" />
      <br />
      <button v-on:click="login()">Login</button>
    </fieldset>
    <h4>User : user | password: user</h4>
    <h4>Supe User: admin | password: admin</h4>
    <h3 id="message">{{ message }}</h3>
  </div>
</template>
<script>
import router from "@/router";
import store from "../store";
store.commit("initPublicSetting");

export default {
  name: "Login",
  components: {},
  data() {
    return {
      username: "admin",
      password: "admin",
      message: "",
    };
  },
  methods: {
    login() {
      if (this.username == this.password && this.username == "user") {
        store.state.username = "user";
        router.push("Documents");

        return;
      }

      if (this.username == this.password && this.username == "admin") {
        store.state.username = "admin";
        router.push("Documents");
        return;
      }

      this.message = "Incorrect username or password";
    },
  },
};
</script>

<style scoped>
#message {
  color: red;
}
</style>
