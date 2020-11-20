<template>
  <b-input-group class="mr-2 search" v-on-clickaway="clickAway">
    <b-form-input
      v-model="searchQuery"
      :placeholder="$t('ui.search')"
      v-on:keyup.enter="search"
    ></b-form-input>
    <b-input-group-append>
      <b-button variant="primary" @click="search">
        <font-awesome-icon :icon="['fas', 'search']" />
      </b-button>
    </b-input-group-append>
    <div id="search-box" :class="{ show: isShow }">
      <div v-if="!result" class="load-result">
        <spinner />
      </div>
      <div v-else-if="result.length == 0" class="no-result">
        {{ $t("ui.no_results") }}
      </div>
      <template v-else>
        <b-media
          no-body
          v-for="(product, index) in result"
          :key="index"
          class="result"
        >
          <nuxt-link :to="localePath('/shop/' + product.slug)">
            <div class="overflow-hidden">
              <div
                class="featured-img-container"
                :style="'background-image: url(' + product.images[0].src + ');'"
              ></div>
            </div>
          </nuxt-link>
          <b-media-body class="ml-3">
            <div class="card-badges">
              <b-badge variant="warning" v-if="product.on_sale">{{
                $t("ui.discount")
              }}</b-badge>
              <b-badge variant="warning" v-if="product.featured">{{
                $t("ui.popular")
              }}</b-badge>
              <b-badge
                variant="light"
                v-if="product.stock_status == 'outofstock'"
                >{{ $t("ui.out_stock") }}</b-badge
              >
              <b-badge
                variant="info"
                v-else-if="product.stock_status == 'onbackorder'"
              >
                {{ $t("ui.pre_order") }}
              </b-badge>
            </div>
            <h4>
              <nuxt-link :to="localePath('/shop/' + product.slug)">{{
                product.name
              }}</nuxt-link>
            </h4>
            <div class="result-text" v-html="product.short_description"></div>
          </b-media-body>
        </b-media>
      </template>
    </div>
  </b-input-group>
</template>

<script>
import { mapGetters } from "vuex";
import { mixin as clickaway } from "vue-clickaway";
import Spinner from "~/components/Spinner.vue";
export default {
  components: { Spinner },
  mixins: [clickaway],
  data() {
    return {
      isShow: false,
      searchQuery: ""
    };
  },
  computed: {
    ...mapGetters({ result: "shop/getResult" })
  },
  methods: {
    search() {
      if (this.searchQuery) {
        this.isShow = true;
        if (this.isShow) {
          this.$store.dispatch("shop/GetSearch", this.searchQuery);
          this.searchQuery = null;
        }
      }
    },
    clickAway() {
      this.isShow = false;
    }
  }
};
</script>

<style lang="scss">
.search {
  .form-control {
    font-size: 0.8rem;
    height: 50px;
  }
  .form-control,
  .btn-primary {
    background-color: #f1f1f1;
    border-color: #f1f1f1;
    box-shadow: none;
    color: #313131;
  }
}

#search-box {
  display: none;
  width: 100%;
  border-radius: 0.25rem;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.175);
  background-color: #fff;
  padding: 0.5rem 0;
  margin: 0.5rem 0 0;
  font-size: 0.875rem;
  color: #191919;
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1000;
  .result {
    padding: 1rem;
    font-size: 0.75rem;
    font-weight: 400;
    color: #6a6a6a;
    width: 100%;
    a {
      color: #6a6a6a;
      font-size: 0.875rem;
      font-weight: 400;
    }
    .card-badges {
      font-size: 1rem;
    }
  }
  .load-result {
    text-align: center;
    margin: 1rem auto;
    .sk-cube-grid {
      width: 40px;
      height: 40px;
      margin: 0 auto;
    }
  }
  .no-result {
    color: #32325d;
    font-size: 0.75rem;
    padding: 1rem;
  }
}
.show {
  display: block !important;
}
#search-box.show {
  transition: height 0.35s ease;
  animation: j 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  z-index: 1050;
}
</style>
