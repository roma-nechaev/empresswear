<template>
  <b-container class="shop">
    <b-row>
      <b-col lg="12">
        <h2 class="h2">{{ $t("links.catalog") }}</h2>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <nuxt-link :to="localePath('/')">{{
                $t("links.home")
              }}</nuxt-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ $t("links.catalog") }}
            </li>
          </ol>
        </nav>
      </b-col>
      <b-col lg="3" class="filters">
        <h3 class="h3">{{ $t("catalog.categories") }}</h3>
        <div class="mb-4">
          <b-form-radio
            v-model="params.category"
            v-for="category in categories"
            :key="category.slug"
            :value="String(category.id)"
          >
            {{ category.name }}
          </b-form-radio>
        </div>
        <h3 class="h3">{{ $t("catalog.size") }}</h3>
        <div class="mb-4">
          <b-form-checkbox-group v-model="selectedSize" stacked>
            <b-form-checkbox
              v-for="size in sizes"
              :key="size.slug"
              :value="String(size.id)"
              class="variation-size btn btn-outline-dark btn-sm"
            >
              {{ size.slug }}
            </b-form-checkbox>
          </b-form-checkbox-group>
        </div>
      </b-col>
      <b-col lg="9" v-if="shop">
        <b-row v-if="shop.length > 0">
          <b-col lg="12" class="text-right">
            <b-form-group class="sort">
              <span class="custom-control">{{ $t("catalog.sort") }}:</span>
              <b-form-radio v-model="orderby" value="date">{{
                $t("catalog.newest_first")
              }}</b-form-radio>
              <b-form-radio v-model="orderby" value="maxPrice">{{
                $t("catalog.more_expensive")
              }}</b-form-radio>
              <b-form-radio v-model="orderby" value="minPrice">{{
                $t("catalog.first_cheaper")
              }}</b-form-radio>
            </b-form-group>
          </b-col>
          <b-col lg="12" class="text-center" v-if="$fetchState.error">
            <p class=" text-muted">{{ $t("ui.error") }}</p>
            <b-button variant="primary" size="sm" @click="$fetch">{{
              $t("ui.refresh")
            }}</b-button>
          </b-col>
          <template v-else>
            <b-col
              col
              lg="4"
              md="4"
              sm="6"
              cols="12"
              v-for="data in shop"
              v-bind:key="data.id"
            >
              <product-card :item="data" />
            </b-col>
          </template>
          <b-col lg="12">
            <b-pagination
              v-if="shopData.totalPages > 1"
              v-model="params.page"
              :per-page="params.per_page"
              :total-rows="shopData.total"
              align="center"
            ></b-pagination
          ></b-col>
        </b-row>
        <b-row v-else>
          <h2 class="col-lg-12 h2 text-center">
            {{ $t("catalog.no_result") }}
          </h2>
        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import ProductCard from "~/components/ProductCard.vue";
import Spinner from "~/components/Spinner.vue";
export default {
  loading: false,
  components: { ProductCard, Spinner },
  head() {
    return {
      title: this.$t("links.catalog"),
      titleTemplate: "%s - " + this.$t("links.site_name")
    };
  },
  async fetch() {
    this.$store.dispatch("shop/setParams", { ...this.params });
    await this.$store.dispatch("shop/getShop");
    if (!this.colors) {
      await this.$store.dispatch("shop/getAttr", 2);
    }
    if (!this.sizes) {
      await this.$store.dispatch("shop/getAttr", 4);
    }
  },
  data() {
    return {
      params: {
        page: 1,
        per_page: 9,
        category: "",
        attribute: "",
        attribute_term: "",
        tag: [],
        min_price: "",
        max_price: "",
        orderby: "title",
        order: "desc"
      },
      selectedColors: [],
      selectedSize: [],
      pol: [],
      orderby: "title",
      price: "any"
    };
  },
  computed: {
    ...mapGetters({
      colors: "shop/getColor",
      sizes: "shop/getSize",
      shop: "shop/getShop",
      shopData: "shop/getShopHeaders",
      parameters: "shop/getParams",
      categories: "shop/getCategories"
    })
  },
  watch: {
    "$route.query": "$fetch",
    "params.page": function() {
      this.$router.push({
        path: this.$route.fullPath,
        query: {
          page: this.params.page
        }
      });
    },
    "params.per_page": function() {
      this.$fetch();
    },
    "params.category": function() {
      this.params.page = 1;
      this.$router.push({
        path: this.$route.fullPath,
        query: {
          categories: this.params.category
        }
      });
    },
    pol() {
      this.params.page = 1;
      this.params.tag = this.pol.join(",");
      this.$fetch();
    },
    orderby() {
      this.order();
      this.$router.push({
        path: this.$route.fullPath,
        query: { orderby: this.orderby }
      });
    },
    price() {
      this.params.page = 1;
      this.priceFilter();
      this.$router.push({
        path: this.$route.fullPath,
        query: { price: this.price }
      });
    },
    selectedColors() {
      this.params.page = 1;
      this.params.attribute = "pa_color";
      this.params.attribute_term = this.selectedColors.join(",");
      this.$router.push({
        path: this.$route.fullPath,
        query: {
          colors: this.params.attribute_term
        }
      });
    },
    selectedSize() {
      this.params.page = 1;
      this.params.attribute = "pa_size";
      this.params.attribute_term = this.selectedSize.join(",");
    }
  },
  created() {
    if (this.$route.query.page) {
      this.params.page = this.$route.query.page;
    }
    if (this.$route.query.categories) {
      this.params.category = this.$route.query.categories;
    }
    if (this.$route.query.colors) {
      this.params.attribute = "pa_color";
      this.params.attribute_term = this.$route.query.colors;
    }
    if (this.$route.query.price) {
      this.price = this.$route.query.price;
      this.priceFilter();
    }
    if (this.$route.query.orderby) {
      this.orderby = this.$route.query.orderby;
      this.order();
    }
  },
  methods: {
    order() {
      switch (this.orderby) {
        case "date":
          this.params.orderby = "date";
          this.params.order = "desc";
          break;
        case "minPrice":
          this.params.orderby = "price";
          this.params.order = "asc";
          break;
        case "maxPrice":
          this.params.orderby = "price";
          this.params.order = "desc";
          break;
        default:
          break;
      }
    },
    priceFilter() {
      switch (this.price) {
        case "any":
          this.params.min_price = "";
          this.params.max_price = "";
          break;
        case "to2500":
          this.params.min_price = "0";
          this.params.max_price = "2500";
          break;
        case "to5000":
          this.params.min_price = "2500";
          this.params.max_price = "5000";
          break;
        case "to7500":
          this.params.min_price = "5000";
          this.params.max_price = "7500";
          break;
        case "to10000":
          this.params.min_price = "7500";
          this.params.max_price = "10000";
          break;
        case "more10000":
          this.params.min_price = "10000";
          this.params.max_price = "100000";
          break;
        default:
          break;
      }
    }
  },
  mounted() {
    this.$fetch();
  }
};
</script>

<style lang="scss">
.shop {
  .custom-control {
    font-weight: 300;
    padding: 0;
    line-height: 2.25;
    .custom-control-input:checked + .custom-control-label {
      color: #ec3132;
    }
    .custom-control-label:hover {
      cursor: pointer;
      color: #bf1213;
    }
    .custom-control-label::before,
    .custom-control-label::after {
      display: none;
    }
  }
  .filters {
    font-size: 0.75rem;
    text-transform: capitalize;
    color: #191919;
  }
  .sort {
    text-align: right;
    margin-bottom: 1.5rem;
    .custom-control {
      padding-left: 1.5rem;
      display: inline-block;
      font-size: 0.8rem;
      font-weight: 300;
    }
    span {
      padding-left: 0 !important;
    }
  }
  .filter-color {
    display: inline-block;
    .custom-control-label {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      border: 1px solid transparent;
    }
    .custom-control-label::after {
      display: block;
      content: "";
      border: 1px solid #ccc;
      position: absolute;
      top: 0;
      left: 0;
      border-radius: 50%;
      width: 100%;
      height: 100%;
    }
  }
  .filter-color + .filter-color {
    margin-left: 10px;
  }
  .bg-white .custom-control-label {
    background-color: #fff;
  }
  .bg-white .custom-control-input:checked ~ .custom-control-label::after {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%23000' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26l2.974 2.99L8 2.193z'/%3e%3c/svg%3e");
  }
  .bg-green .custom-control-label {
    background-color: #2dce89;
  }
  .bg-red .custom-control-label {
    background-color: #ec3132;
  }
  .bg-gray .custom-control-label {
    background-color: #8898aa;
  }
  .bg-blue .custom-control-label {
    background-color: #5e72e4;
  }
  .bg-black .custom-control-label {
    background-color: #000;
  }
  .variation-size {
    display: inline-block;
    text-transform: uppercase;
    min-width: 30px;
    font-weight: 600;
    border-radius: 0;
    .custom-control-label {
      width: 100%;
    }
    .custom-control-input:checked + .custom-control-label,
    .custom-control-label:hover {
      color: #fff;
      background-color: #212529;
      border-color: #212529;
    }
  }
  .variation-size + .variation-size {
    margin-left: 0.5rem;
  }
}
</style>
