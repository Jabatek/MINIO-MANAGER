<template>
  <MDBNavbar v-if="state.user?.username" expand="lg" light bg="light" container>
    <MDBNavbarToggler
      @click="collapse1 = !collapse1"
      target="#navbarSupportedContent"
    ></MDBNavbarToggler>
    <MDBCollapse v-model="collapse1" id="navbarSupportedContent">
      <MDBNavbarNav class="mb-2 mb-lg-0">
        <MDBNavbarItem to="/"> Home </MDBNavbarItem>
        <MDBNavbarItem v-if="state.user?.role == 'admin'" to="/setting">
          Setting
        </MDBNavbarItem>
      </MDBNavbarNav>
      <MDBBtn
        v-on:click="logout()"
        color="warning"
        type="button"
        class="btn btn-link px-3 me-2"
      >
        logout
      </MDBBtn>
    </MDBCollapse>
  </MDBNavbar>
  <router-view class="container mt-5 px-lg-5" />
</template>
<script>
import store from "./store";
import { ref } from "vue";
import {
  MDBBtn,
  MDBNavbar,
  MDBCollapse,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
} from "mdb-vue-ui-kit";

export default {
  name: "Setting",
  components: {
    MDBBtn,
    MDBNavbar,
    MDBCollapse,
    MDBNavbarToggler,
    MDBNavbarNav,
    MDBNavbarItem,
  },
  data() {
    return {
      state: store.state,
    };
  },
  methods: {
    logout() {
      store.dispatch("logout");
    },
  },
  setup() {
    store.dispatch("auth");
    store.commit("initPublicSetting");
    const collapse1 = ref(false);
    const dropdown1 = ref(false);
    return {
      collapse1,
      dropdown1,
    };
  },
};
</script>

<style lang="scss">
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
