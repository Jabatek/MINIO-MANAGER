<template>
  <div class="Documents">
    <h1>Documents</h1>
    <fieldset>
      <div id="uploder">
        <input type="file" v-on:change="handleFileSelect($event)" />
        <button v-on:click="upload()">Upload</button>
      </div>
    </fieldset>

    <div id="documents">
      <div
        class="doc"
        v-for="(file, index) in files"
        :key="index"
        v-on:click="getDocument(file)"
      >
        <img :src="file?.path" alt="" />
        <strong>{{ file.name }}</strong>
      </div>
    </div>
  </div>
</template>
<script>
import store from "../store";
import axios from "axios";

export default {
  name: "documents",
  components: {},
  data() {
    return {
      files: [],
      defaultImg: require("../assets/doc.svg"),
    };
  },
  methods: {
    handleFileSelect(event) {
      this.file = event.target.files[0];
    },

    async upload() {
      const data = await axios
        .get(
          `${store.state.serverEndpoint}/presignedPostObject/${this.file.name}`
        )
        .then((res) => res.data);

      const formData = new FormData();
      Object.keys(data.formData).forEach((key) =>
        formData.append(key, data.formData[key])
      );

      formData.append("file", this.file);
      await axios.post(data.postURL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTimeout(() => {
        this.getDocuments();
      }, 2000);
    },
    xml2Json(xmlData) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlData, "text/xml");
      return [...xmlDoc.getElementsByTagName("Key")].map((fileName) => {
        const name = fileName.innerHTML;
        if ("jpg/png/svg".includes(name.split(".")[1]))
          return {
            name,
            path: `${store.state.bucketUrlThumbnails}/${name}-thumbnail.jpg`,
          };
        return { name, path: this.defaultImg };
      });
    },
    async getDocuments() {
      const presignedUrl = await axios
        .get(`${store.state.serverEndpoint}/presignedGetObjects`)
        .then((res) => res.data);
      const xmlData = await axios.get(presignedUrl).then((res) => res.data);
      this.files = this.xml2Json(xmlData);
    },
    async getDocument(fileName) {
      const presignedUrl = await axios
        .get(
          `${
            store.state.serverEndpoint
          }/presignedGetObject/${fileName.name.replace("-thumbnail.jpg", "")}`
        )
        .then((res) => window.open(res.data, "_blank").focus());
    },
  },
  mounted() {
    this.getDocuments();
  },
};
</script>

<style scoped>
.doc img {
  width: 100px;
}
fieldset {
  margin: 10px 100px;
}
.doc {
  display: inline-grid;
  margin: 10px;
  padding: 10px;
  cursor: pointer;
}
</style>
>
