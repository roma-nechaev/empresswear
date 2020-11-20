const wc_auth = {
  consumer_key: "ck_5824cd3f5f4e8b26f2453782f11fd1a67f92b54e",
  consumer_secret: "cs_000ec54e6311a44de75b93732605e9fcde74589d"
};

export const state = () => ({
  shop: null,
  shopHeaders: {
    totalPages: null,
    total: null
  },
  params: {
    page: 1,
    per_page: 9,
    category: "",
    attribute: "",
    attribute_term: "",
    tag: "",
    min_price: "",
    max_price: "",
    orderby: "title",
    order: "desc"
  },

  categories: null,
  color: null,
  size: null,

  currentProduct: null,
  variation: null,
  reviews: null,
  reviewsHeaders: {
    total: null,
    totalpages: null
  },
  upsell: null,

  popularProduct: null,
  search: null
});
export const getters = {
  getShop: state => state.shop,
  getShopHeaders: state => state.shopHeaders,
  getParams: state => state.params,

  getCategories: state => state.categories,
  getColor: state => state.color,
  getSize: state => state.size,

  getCurrentProduct: state => state.currentProduct,
  getReviews: state => state.reviews,
  getreviewsHeaders: state => state.reviewsHeaders,

  getUpsell: state => state.upsell,

  getPopularProduct: state => state.popularProduct,
  getResult: state => state.search
};
export const mutations = {
  getShop(state, payload) {
    state.shop = payload.data;
    state.shopHeaders.total = payload.headers["x-wp-total"];
    state.shopHeaders.totalPages = payload.headers["x-wp-totalpages"];
  },
  setParams(state, payload) {
    state.params = payload;
  },
  getCategories(state, payload) {
    state.categories = payload;
  },
  getColor(state, payload) {
    state.color = payload;
  },
  getSize(state, payload) {
    state.size = payload;
  },
  clearFilters(state) {
    state.params.page = 1;
    state.params.per_page = 9;
    state.params.category = "";
    state.params.attribute_term = "";
    state.params.tag = "";
    state.params.min_price = "";
    state.params.max_price = "";
    state.params.orderby = "title";
    state.params.order = "desc";
  },

  getCurrentProduct(state, payload) {
    state.currentProduct = payload;
  },
  clearCurrentProduct(state) {
    state.reviews = null;
    state.reviewsHeaders.total = null;
    state.reviewsHeaders.totalpages = null;
    state.upsell = null;
  },
  getReviewsProduct(state, payload) {
    state.reviews = payload.data;
    state.reviewsHeaders.total = payload.headers["x-wp-total"];
    state.reviewsHeaders.totalpages = payload.headers["x-wp-totalpages"];
  },
  getUpsell(state, payload) {
    state.upsell = payload;
  },

  getProductVariation(state, payload) {
    state.variation = payload;
  },
  getVariation(state, payload) {
    state.currentProduct.sku = payload.sku;
    state.currentProduct.regular_price = payload.regular_price;
    state.currentProduct.price = payload.price;
    state.currentProduct.sale_price = payload.sale_price;
    state.currentProduct.images[0].src = payload.image.src;
    state.currentProduct.short_description = payload.description;
    state.currentProduct.stock_status = payload.stock_status;

    state.currentProduct.variation_text = payload.attributes;
    state.currentProduct.variation_id = payload.id;
  },

  popularProduct(state, payload) {
    state.popularProduct = payload;
  },
  GetSearch(state, payload) {
    state.search = payload;
  }
};
export const actions = {
  async getShop({ commit, state, rootState }) {
    try {
      let { data, headers } = await this.$axios.get(
        rootState.locale + "/wp-json/wc/v3/products",
        {
          params: {
            _fields:
              "id,slug,images,name,stock_status,on_sale,featured,sale_price,regular_price,price,attributes,type",
            ...state.params,
            ...wc_auth
          }
        }
      );
      commit("getShop", { data, headers });
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },
  setParams({ commit }, payload) {
    commit("setParams", payload);
  },
  async getCategories({ commit, rootState }, payload) {
    try {
      let { data } = await this.$axios.get(
        rootState.locale + "/wp-json/wc/v3/products/categories",
        {
          params: { ...wc_auth }
        }
      );
      commit("getCategories", data);
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },
  async getAttr({ commit }, payload) {
    try {
      let { data } = await this.$axios.get(
        `/wp-json/wc/v3/products/attributes/${payload}/terms`,
        {
          params: { ...wc_auth }
        }
      );
      if (payload === 2) {
        commit("getColor", data);
      } else {
        commit("getSize", data);
      }
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },

  async getCurrentProduct({ commit, rootState }, payload) {
    try {
      let { data } = await this.$axios.get(
        rootState.locale + "/wp-json/wc/v3/products",
        {
          params: {
            slug: payload,
            _fields:
              "id,slug,images,name,stock_status,on_sale,sale_price,regular_price,price,type,attributes,average_rating,categories,description,short_description,sku,upsell_ids,tags,reviews_allowed,variations,meta_data",
            ...wc_auth
          }
        }
      );
      commit("getCurrentProduct", data[0]);
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },
  async clearCurrentProduct({ commit }) {
    await commit("clearCurrentProduct");
  },

  async getReviews({ commit }, payload) {
    try {
      let { data, headers } = await this.$axios.get(
        "/wp-json/wc/v3/products/reviews",
        {
          params: {
            product: payload.id,
            page: payload.page,
            ...wc_auth
          }
        }
      );
      commit("getReviewsProduct", { data, headers });
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },
  async createReview({ commit }, payload) {
    try {
      await this.$axios.post("/wp-json/wc/v3/products/reviews", payload, {
        params: { ...wc_auth }
      });
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },

  async getUpsellIds({ commit, rootState }, payload) {
    try {
      let { data } = await this.$axios.get(
        rootState.locale + "/wp-json/wc/v3/products",
        {
          params: {
            _fields:
              "id,slug,images,name,stock_status,on_sale,featured,sale_price,regular_price,price,attributes,type",
            include: payload,
            ...wc_auth
          }
        }
      );
      commit("getUpsell", data);
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },

  async getProductVariations({ commit, state, rootState }, payload) {
    try {
      let { data } = await this.$axios.get(
        rootState.locale +
          "/wp-json/wc/v3/products/" +
          state.currentProduct.id +
          "/variations/",
        {
          params: {
            _fields:
              "sku,regular_price,price,sale_price,image,description,stock_status,attributes,id",
            ...wc_auth
          }
        }
      );
      commit("getProductVariation", data);
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },
  async getVariation({ commit, state }, payload) {
    let found = state.variation.find(
      obj => obj.attributes[0].option === "[:ru]" + payload + "[:]"
    );
    commit("getVariation", found);
  },

  async popularProduct({ commit, rootState }, payload) {
    try {
      let { data } = await this.$axios.get(
        rootState.locale + "/wp-json/wc/v3/products",
        {
          params: {
            per_page: 4,
            featured: true,
            _fields:
              "id,slug,images,name,stock_status,on_sale,sale_price,regular_price,price,type",
            ...wc_auth
          }
        }
      );
      commit("popularProduct", data);
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  },
  async GetSearch({ commit, rootState }, payload) {
    commit("GetSearch", null);
    try {
      let { data } = await this.$axios.get(
        rootState.locale + "/wp-json/wc/v3/products/",
        {
          params: {
            _fields:
              "id,slug,images,name,stock_status,on_sale,featured,sale_price,regular_price,price,attributes,type,short_description",
            search: payload,
            ...wc_auth
          }
        }
      );
      commit("GetSearch", data);
    } catch (e) {
      commit("showNotify", e.response.data, { root: true });
    }
  }
};
