import { createStore } from "vuex";
import axios from "axios";
import jwt_decode from "jwt-decode";
import router from "../router";

export interface ISetting {
  endPoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucket: string;
  thumbnailBucket: string;
}

export interface IAccessTokenData {
  username: string;
  role: string;
  exp: number;
}

export default createStore({
  state: {
    publicSetting: {
      endPoint: "",
      port: 0,
      useSSL: false,
      bucket: "",
      thumbnailBucket: "",
    },
    bucketUrl: "",
    bucketUrlThumbnails: "",
    serverEndpoint: process.env.VUE_APP_SERVER_ENDPOINT,
    user: { username: null, role: null },
    authHeader: null,
  },
  mutations: {
    async initPublicSetting(state) {
      state.publicSetting = await axios
        .get(`${state.serverEndpoint}/publicSetting`, {
          headers: state.authHeader || {},
        })
        .then((res) => res.data);

      const minioUrl = `${state.publicSetting?.useSSL ? "https" : "http"}://${
        state.publicSetting?.endPoint
      }:${state.publicSetting?.port}`;

      state.bucketUrl = `${minioUrl}/${state.publicSetting?.bucket}`;
      state.bucketUrlThumbnails = `${minioUrl}/${state.publicSetting?.thumbnailBucket}`;
    },
    setAuthHeader(stats, authHeader) {
      stats.authHeader = authHeader;
    },
    setUser(stats, user) {
      stats.user = user;
    },
  },
  actions: {
    auth(context) {
      const accessToken = sessionStorage.getItem("accessToken");
      if (accessToken) {
        const accessTokenData: IAccessTokenData = jwt_decode(accessToken);

        const timeOut = accessTokenData.exp * 1000 - new Date().getTime();
        if (timeOut > 0) {
          context.commit("setAuthHeader", {
            Authorization: "Bearer " + accessToken,
          });
          context.commit("setUser", {
            username: accessTokenData.username,
            role: accessTokenData.role,
          });
          router.push("/");
          setTimeout(() => {
            this.dispatch("logout");
          }, timeOut);
        }
      }
    },
    logout(context) {
      sessionStorage.removeItem("accessToken");
      context.commit("setAuthHeader", "");
      context.commit("setUser", { username: null, role: null });
      router.push("/login");
    },
  },
  modules: {},
});
