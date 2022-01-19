import { createStore } from "vuex";
import axios from "axios";

export interface ISetting {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucket: string;
  thumbnailBucket: string;
}

export default createStore({
  state: {
    publicSetting: {
      endPoint: "",
      port: "",
      useSSL: false,
      bucket: "",
      thumbnailBucket: "",
    },
    bucketUrl: "",
    bucketUrlThumbnails: "",
    serverEndpoint: process.env.VUE_APP_SERVER_ENDPOINT,
    username: null,
  },
  mutations: {
    async initPublicSetting(state) {
      state.publicSetting = await axios
        .get(`${state.serverEndpoint}/publicSetting`)
        .then((res) => res.data);

      const minioUrl = `${state.publicSetting?.useSSL ? "https" : "http"}://${
        state.publicSetting?.endPoint
      }:${state.publicSetting?.port}`;

      state.bucketUrl = `${minioUrl}/${state.publicSetting?.bucket}`;

      state.bucketUrlThumbnails = `${minioUrl}/${state.publicSetting?.thumbnailBucket}`;
    },
  },
  actions: {},
  modules: {},
});
