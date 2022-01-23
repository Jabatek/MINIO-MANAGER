<template>
  <div class="setting">
    <h2 class="mt-5">Setting</h2>

    <MDBContainer>
      <MDBInput
        id="endPoint"
        v-model="setting.endPoint"
        type="text"
        name="EndPoint"
      />
      <br />

      <MDBInput id="port" v-model="setting.port" type="number" name="port" />
      <br />

      <MDBCheckbox
        id="useSSL"
        v-model="setting.useSSL"
        type="checkbox"
        label="UseSSL"
      />
      <br />

      <MDBInput
        id="accessKey"
        v-model="setting.accessKey"
        type="text"
        name="AccessKey"
      />
      <br />

      <MDBInput
        id="secretKey"
        v-model="setting.secretKey"
        type="text"
        name="SecretKey"
      />
      <br />

      <MDBInput
        id="bucket"
        v-model="setting.bucket"
        type="text"
        name="bucket"
      />
      <br />

      <MDBInput
        id="thumbnailBucket"
        v-model="setting.thumbnailBucket"
        type="text"
        name="Thumbnail Bucket"
      />
      <br />
      <MDBBtn v-on:click="save()" color="primary" block class="mb-4"
        >Save</MDBBtn
      >
    </MDBContainer>
  </div>
</template>
<script>
import axios from "axios";
import store from "../store";
import { MDBContainer, MDBBtn, MDBInput, MDBCheckbox } from "mdb-vue-ui-kit";

export default {
  name: "Setting",
  components: { MDBContainer, MDBBtn, MDBInput, MDBCheckbox },
  data() {
    return {
      setting: {},
    };
  },
  methods: {
    async save() {
      await axios.post(`${store.state.serverEndpoint}/setting`, this.setting, {
        headers: store.state.authHeader,
      });
      setTimeout(() => {
        store.commit("initPublicSetting");
      }, 2000);
    },
  },
  async mounted() {
    this.setting = await axios
      .get(`${store.state.serverEndpoint}/setting`, {
        headers: store.state.authHeader,
      })
      .then((res) => (!res.data || res.data == "" ? {} : res.data));
  },
};
</script>
<style scoped></style>
