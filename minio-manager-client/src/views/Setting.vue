<template>
  <div class="setting">
    <h1>setting</h1>

    <div id="setting">
      <fieldset>
        <label for="endPoint">EndPoint</label>
        <input
          id="endPoint"
          v-model="setting.endPoint"
          type="text"
          name="endPoint"
        />
        <br />
        <label for="port">Port</label>
        <input id="port" v-model="setting.port" type="number" name="port" />
        <br />
        <label for="useSSL">UseSSL</label>
        <input
          id="useSSL"
          v-model="setting.useSSL"
          type="checkbox"
          name="useSSL"
        />
        <br />
        <label for="accessKey">AccessKey</label>
        <input
          id="accessKey"
          v-model="setting.accessKey"
          type="text"
          name="accessKey"
        />
        <br />
        <label for="secretKey">SecretKey</label>
        <input
          id="secretKey"
          v-model="setting.secretKey"
          type="text"
          name="secretKey"
        />
        <br />
        <label for="bucket">Bucket</label>
        <input id="bucket" v-model="setting.bucket" type="text" name="bucket" />
        <br />
        <label for="thumbnailBucket">Thumbnail Bucket</label>
        <input
          id="thumbnailBucket"
          v-model="setting.thumbnailBucket"
          type="text"
          name="thumbnailBucket"
        />
      </fieldset>
      <button v-on:click="save()">Save</button>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import store from "../store";

export default {
  name: "Setting",
  components: {},
  data() {
    return {
      setting: {},
    };
  },
  methods: {
    async save() {
      await axios.post(`${store.state.serverEndpoint}/setting`, this.setting);
      setTimeout(() => {
        store.commit("initPublicSetting");
      }, 2000);
    },
  },
  async mounted() {
    this.setting = await axios
      .get(`${store.state.serverEndpoint}/setting`)
      .then((res) => (!res.data || res.data == "") ? {} : res.data);
  },
};
</script>
<style scoped>
#setting {
  text-align: left;
}
</style>
