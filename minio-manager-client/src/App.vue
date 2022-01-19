<template>
  <div id="nav">
    <router-link to="/documents"> Documents</router-link>
    <router-link to="/setting"> | Setting</router-link>
  </div>
  <router-view />
</template>
<script>
import store from "./store";

export default {
  name: "Setting",
  components: {},
  data() {
    return {
      username: store.state.username,
    };
  },
};
</script>
>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-size: 20px;
}
button {
  font-size: 20px;
}
input {
  margin: 5px;
  font-size: 20px;
}
label {
  margin: 5px;
  display: inline-block;
  width: 200px;
}
fieldset {
  border-radius: 5px;
  border-color: blanchedalmond;
  background: aliceblue;
  box-shadow: 0 0 2px darkgoldenrod;
}
#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
