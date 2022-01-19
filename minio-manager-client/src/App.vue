<template>
  <MDBNavbar expand="lg" light bg="light" container>
    <MDBNavbarToggler
      @click="collapse1 = !collapse1"
      target="#navbarSupportedContent"
    ></MDBNavbarToggler>
    <MDBCollapse v-model="collapse1" id="navbarSupportedContent">
      <MDBNavbarNav class="mb-2 mb-lg-0">
        <MDBNavbarItem v-if="state.username" to="documents"> Documents </MDBNavbarItem>
        <MDBNavbarItem v-if="state.username=='admin'" to="/setting"> Setting </MDBNavbarItem>
      </MDBNavbarNav>
    </MDBCollapse>
  </MDBNavbar>
  <router-view class="container mt-5 px-lg-5" />
</template>
<script>
import store from "./store";
import { ref } from "vue";
import {
  MDBNavbar,
  MDBCollapse,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarItem,
} from "mdb-vue-ui-kit";

export default {
  name: "Setting",
  components: {
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
  setup() {
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
