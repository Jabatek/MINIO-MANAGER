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
import axios from "axios";
import store from "../store";
import { MDBCol, MDBRow, MDBBtn, MDBInput } from "mdb-vue-ui-kit";

export default {
  name: "Login",
  components: { MDBCol, MDBRow, MDBBtn, MDBInput },
  data() {
    return {
      username: "",
      password: "",
      message: "",
    };
  },
  methods: {
    login() {
      axios
        .post(`${store.state.serverEndpoint}/login`, {
          username: this.username,
          password: this.password,
        })
        .then((res) => {
          if (res.data?.access_token) {
            sessionStorage.setItem("accessToken", res.data.access_token);
            store.dispatch("auth");
          }
          return res.data;
        })
        .catch((error) => {
          this.message = error;
        });
    },
  },
};
</script>

<style scoped>
#message {
  color: red;
}
</style>
