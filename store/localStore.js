import Vue from "vue";
const wc_auth = {
  consumer_key: "ck_5824cd3f5f4e8b26f2453782f11fd1a67f92b54e",
  consumer_secret: "cs_000ec54e6311a44de75b93732605e9fcde74589d"
};
export const state = () => ({
  cart: [],
  order: null
});
export const getters = {
  getShoppingCart: state => state.cart,
  getOrder: state => state.order
};
export const mutations = {
  getCart(state, payload) {
    state.cart = payload;
  },
  addToCart(state, product) {
    let found = state.cart.find(obj => obj.id === product.id);
    if (found) {
      found.quantity++;
      found.totalPrice = found.quantity * found.price;
    } else {
      state.cart.push(product);
      Vue.set(product, "quantity", 1);
      Vue.set(product, "totalPrice", product.price);
    }
    localStorage.setItem("cart", JSON.stringify(state.cart));
  },
  addToCartVariation(state, product) {
    let found = state.cart.find(
      obj => obj.variation_id === product.variation_id
    );
    if (found) {
      found.quantity++;
      found.totalPrice = found.quantity * found.price;
    } else {
      state.cart.push(product);
      Vue.set(product, "quantity", 1);
      Vue.set(product, "totalPrice", product.price);
    }
    localStorage.setItem("cart", JSON.stringify(state.cart));
    this.dispatch("localStore/getCart");
  },
  removeFromCart(state, payload) {
    state.cart.splice(payload, 1);
    localStorage.setItem("cart", JSON.stringify(state.cart));
  },
  clearCart(state) {
    state.cart = [];
    localStorage.setItem("cart", JSON.stringify(state.cart));
  },

  getOrder(state, payload) {
    state.order = payload;
  }
};
export const actions = {
  getCart({ commit }) {
    const cachedCart = JSON.parse(localStorage.getItem("cart"));

    if (cachedCart && cachedCart.length !== 0) {
      commit("getCart", cachedCart);
    } else {
      commit("getCart", []);
    }
  },
  addToCart({ commit }, payload) {
    if (payload.type === "simple") commit("addToCart", payload);
    else {
      commit("addToCartVariation", payload);
    }
    commit(
      "showNotify",
      {
        code: 200,
        message: this.$i18n.t("alerts.add_product")
      },
      { root: true }
    );
  },
  removeFromCart({ commit }, payload) {
    commit("removeFromCart", payload);
  },

  async createOrder({ commit }, payload) {
    try {
      let { data } = await this.$axios.post("/wp-json/wc/v3/orders", payload, {
        params: {
          ...wc_auth
        }
      });
      commit("clearCart");
      await commit("getOrder", data);
      await setTimeout(() => {
        this.$router.push("checkout/" + data.id);
      }, 500);
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },
  async getOrder({ commit, state }, payload) {
    try {
      if (!state.order) {
        let id = String(payload);
        let { data } = await this.$axios.get("/wp-json/wc/v3/orders" + id, {
          params: {
            ...wc_auth
          }
        });
        await commit("getOrder", data[0]);
      }
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },
  async updateOrder({ commit }, payload) {
    try {
      let id = String(payload);
      await this.$axios.put(
        "/wp-json/wc/v3/orders/" + id,
        { set_paid: true },
        {
          params: {
            ...wc_auth
          }
        }
      );
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  }
};
