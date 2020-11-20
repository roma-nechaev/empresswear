const wc_auth = {
  consumer_key: "ck_5824cd3f5f4e8b26f2453782f11fd1a67f92b54e",
  consumer_secret: "cs_000ec54e6311a44de75b93732605e9fcde74589d"
};

export const state = () => ({
  coupon: null,
  country: null,
  customer: null,
  orders: null,
  payment_gateways: null,
  shipping_methods: null
});
export const getters = {
  getCountry: state => state.country,
  getCoupon: state => state.coupon,
  getCustomer: state => state.customer,
  getOrders: state => state.orders,
  getPaymentGateways: state => state.payment_gateways,
  getShippingMethods: state => state.shipping_methods
};
export const mutations = {
  getCountry(state, payload) {
    state.country = payload;
  },
  useCoupon(state, payload) {
    state.coupon = payload;
  },
  getCustomer(state, payload) {
    state.customer = payload;
  },
  getOrders(state, payload) {
    state.orders = payload;
  },
  getPaymentGateways(state, payload) {
    state.payment_gateways = payload;
  },
  getShippingMethods(state, payload) {
    state.shipping_methods = payload;
  }
};
export const actions = {
  async getCountry({ commit, rootState }) {
    try {
      let { data } = await this.$axios.get(
        rootState.locale + "/wp-json/wc/v3/data/countries",
        {
          params: { ...wc_auth }
        }
      );
      commit("getCountry", data);
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },
  async useCoupon({ commit }, payload) {
    try {
      let { data } = await this.$axios.get("/wp-json/wc/v3/coupons", {
        params: { code: payload, ...wc_auth }
      });
      commit("useCoupon", data);
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },
  async getCustomer({ commit }, payload) {
    try {
      let { data } = await this.$axios.get(
        "/wp-json/wc/v3/customers/" + payload,
        {
          params: { ...wc_auth }
        }
      );
      commit("getCustomer", data);
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },
  async updateCustomer({ commit, dispatch }, payload) {
    try {
      await this.$axios.put(
        "/wp-json/wc/v3/customers/" + payload.id,
        payload.data,
        {
          params: { ...wc_auth }
        }
      );
      await dispatch("getCustomer", payload.id);
      commit(
        "showNotify",
        {
          code: "info",
          message: this.$i18n.t("alerts.save_data")
        },
        { root: true }
      );
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },
  async getOrders({ commit }, payload) {
    try {
      let { data } = await this.$axios.get("/wp-json/wc/v3/orders", {
        params: { customer: payload, ...wc_auth }
      });
      commit("getOrders", data);
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },
  async getPaymentGateways({ commit, rootState }) {
    try {
      let { data } = await this.$axios.get(
        rootState.locale + "/wp-json/wc/v3/payment_gateways",
        {
          params: { ...wc_auth }
        }
      );
      commit("getPaymentGateways", data);
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },
  async getShippingMethods({ commit, rootState }) {
    try {
      let { data } = await this.$axios.get(
        rootState.locale + "/wp-json/wc/v3/shipping/zones/2/methods",
        {
          params: { ...wc_auth }
        }
      );
      commit("getShippingMethods", data);
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },
  async tinkoffPayment({ commit, state }, payload) {
    try {
      let found = state.payment_gateways.find(obj => obj.id === "tinkoff");
      let line_items = payload.line_items.map(item => {
        return {
          Name: item.name,
          Quantity: item.quantity,
          Amount: Number(item.total) * 100,
          Price: Number(item.price) * 100,
          PaymentObject: "commodity",
          Tax: "none"
        };
      });
      let req = {
        TerminalKey: found.settings.merchant_id.value,
        Amount: Number(payload.total - payload.shipping_total) * 100,
        OrderId: payload.id,
        Language: this.$i18n.locale,
        SuccessURL:
          "https://empresswear.ru/checkout/" + payload.id + "?success=true",
        Receipt: {
          Email: payload.billing.email,
          Phone: payload.billing.phone,
          Taxation: found.settings.taxation.value,
          Items: line_items
        }
      };

      let { data } = await this.$axios.post(
        "https://securepay.tinkoff.ru/v2/Init",
        req,
        {
          headers: {
            "content-type": "application/json"
          }
        }
      );

      window.location.href = data.PaymentURL;
    } catch (e) {
      commit("showNotify", e.response.data);
    }
  }
};
