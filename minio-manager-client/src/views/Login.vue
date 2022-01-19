<template>
  <div class="login">
    <h2 class="mt-5">Login</h2>

    <MDBRow center class="d-flex">
      <MDBCol md="6">
        <MDBInput
          type="text"
          label="Username"
          id="username"
          v-model="username"
          wrapperClass="mb-4"
        />

        <MDBInput
          type="password"
          label="Password"
          id="password"
          v-model="password"
          wrapperClass="mb-4"
        />

        <MDBBtn v-on:click="login()" color="primary" block class="mb-4"
          >Login</MDBBtn
        >

        <h3 id="message">{{ message }}</h3>
      </MDBCol>
    </MDBRow>

    <strong>User : </strong> user | password: user
    <br />
    <strong>Supe User: </strong> admin | password: admin
  </div>
</template>
<script>
import router from "@/router";
import store from "../store";
import { MDBCol, MDBRow, MDBBtn, MDBInput } from "mdb-vue-ui-kit";
store.commit("initPublicSetting");

export default {
  name: "Login",
  components: { MDBCol, MDBRow, MDBBtn, MDBInput },
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
