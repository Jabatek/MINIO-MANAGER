<template>
  <div class="Documents">
    <h2 class="mt-5">Documents</h2>

    <MDBFile v-on:change="handleFileSelect($event)" />
    <MDBBtn v-on:click="upload()" color="primary" block class="mb-4"
      >Upload</MDBBtn
    >

    <MDBContainer class="d-flex flex-wrap">
      <MDBCard
        v-for="(file, index) in files"
        :key="index"
        v-on:click="getDocument(file)"
      >
        <MDBCardImg :src="file?.path" top alt="..." />
        <MDBCardBody>
          <MDBCardTitle>{{ file.name }}</MDBCardTitle>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  </div>
</template>
<script>
import store from "../store";
import axios from "axios";
import {
  MDBContainer,
  MDBFile,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardImg,
} from "mdb-vue-ui-kit";

export default {
  name: "documents",
  components: {
    MDBContainer,
    MDBFile,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardImg,
  },
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

<style >
.card {
  cursor: pointer;
  width: 110px;
  margin: 10px;
  text-align: center;
}

.card-title {
    margin-bottom: 0.2rem;
    font-size: 12px;
    margin-top: 0.2rem;;
}
.card-img-top {
height: 120px;
}
.card-body {
  flex: 1 1 auto;
  padding: 0.2rem 0.2rem;
}
</style>
>
