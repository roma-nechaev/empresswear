export const state = () => ({
  locale: null,
  user: null,
  page: null,
  media: null,
  mediaHeaders: null,
  notify: {
    showAlert: false,
    code: null,
    message: null
  }
});
export const getters = {
  getUser: state => state.user,
  getPage: state => state.page,
  getMedia: state => state.media,
  getmediaHeaders: state => state.mediaHeaders
};
export const mutations = {
  locale(state, payload) {
    let locale = "";
    if (payload === "en") {
      locale = "en";
    }
    state.locale = locale;
  },
  showNotify(state, payload) {
    state.notify.showAlert = !state.notify.showAlert;
    state.notify.code = payload.code;
    state.notify.message = payload.message;
  },
  setUser(state, payload) {
    state.user = payload;
  },
  deleteUser(state) {
    state.user = null;
    localStorage.removeItem("user-token", state.user);
  },
  getPage(state, payload) {
    state.page = payload;
  },
  deletePage(state) {
    state.page = null;
  },
  getMedia(state, payload) {
    state.media = payload.data;
    state.mediaHeaders = payload.headers;
  }
};
export const actions = {
  nuxtServerInit({ commit }) {
    commit("locale", this.$i18n.locale);
  },
  async login({ commit, dispatch }, payload) {
    try {
      let { data } = await this.$axios.post(
        "/wp-json/jwt-auth/v1/token",
        payload
      );
      localStorage.setItem("user-token", data.token);
      commit("showNotify", {
        code: 200,
        message: this.$i18n.t("alerts.login")
      });
      await dispatch("getUser");
      await setTimeout(() => {
        this.$router.push("/");
      }, 500);
    } catch (e) {
      commit("showNotify", e.response.data);
      commit("deleteUser");
    }
  },
  async validate({ commit, dispatch, state }) {
    const token = localStorage.getItem("user-token");
    if (token !== null && token !== "undefined") {
      try {
        await this.$axios.post("/wp-json/jwt-auth/v1/token/validate", null, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        await dispatch("getUser");
        await dispatch("extendShop/getCustomer", state.user.id);
      } catch (e) {
        commit("showNotify", e.response.data);
      }
    }
  },
  async register({ commit }, payload) {
    try {
      let { data } = await this.$axios.post(
        "/wp-json/wp/v2/users/register",
        payload
      );
      commit("showNotify", data);
      await setTimeout(() => {
        this.$router.push("login");
      }, 500);
    } catch (e) {
      commit("showNotify", e.response.data);
    }
  },
  async forgotPassword({ commit }, payload) {
    try {
      await this.$axios.post("/wp-json/wp/v2/users/lost-password", payload);
      commit("showNotify", {
        code: "info",
        message: this.$i18n.t("alerts.reset_password")
      });
      await setTimeout(() => {
        this.$router.push(this.$i18n.locale);
      }, 500);
    } catch (e) {
      commit("showNotify", e.response.data);
    }
  },
  async getUser({ commit }) {
    try {
      let token = localStorage.getItem("user-token");
      let { data } = await this.$axios.get("/wp-json/wp/v2/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      commit("setUser", data);
    } catch (e) {
      commit("showNotify", e.response.data);
    }
  },
  deleteUser({ commit }) {
    commit("deleteUser");
    setTimeout(() => {
      this.$router.push("/");
    }, 500);
  },

  async getPage({ commit, state }, id) {
    try {
      let { data } = await this.$axios.get(
        state.locale + "/wp-json/wp/v2/pages",
        {
          params: {
            slug: id,
            _fields: "id,title,content,comment_status,featured_media,type"
          }
        }
      );
      commit("getPage", data[0]);
    } catch (e) {
      commit("showNotify", e.response.data);
    }
  },

  async getMedia({ commit }, payload) {
    try {
      let { data, headers } = await this.$axios.get("wp-json/wp/v2/media", {
        params: {
          page: payload,
          parent: 125,
          per_page: 12,
          _fields: "id,source_url,title"
        }
      });
      commit("getMedia", { data, headers });
    } catch (e) {
      commit("showNotify", e.response.data);
    }
  },
  async contactForm7({ commit }, payload) {
    try {
      let form = new FormData();
      for (const field in payload) {
        form.append(field, payload[field]);
      }
      let { data } = await this.$axios.post(
        "https://site.empresswear.ru/wp-json/contact-form-7/v1/contact-forms/124/feedback",
        form
      );
      if (data.status === "mail_sent") {
        await commit("showNotify", {
          code: 200,
          message: data.message
        });
      } else {
        await commit("showNotify", {
          code: 400,
          message: data.message
        });
      }
    } catch (e) {
      this.commit("showNotify", e.response.data);
    }
  }
};
