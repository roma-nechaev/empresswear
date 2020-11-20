<template>
  <b-container>
    <b-row class="current-product">
      <b-col lg="6" class="mb-3">
        <b-carousel
          v-if="product.images.length > 1"
          id="carousel-1"
          v-model="slide"
          :interval="4000"
          background="#ababab"
          fade
          indicators
        >
          <b-carousel-slide
            v-for="images in product.images"
            :key="images.id"
            :img-src="images.src"
            :img-alt="images.name"
          ></b-carousel-slide>
        </b-carousel>
        <b-img-lazy
          v-else
          :src="product.images[0].src"
          :alt="product.images[0].name"
          fluid
        />
      </b-col>
      <b-col lg="6" class="mb-3">
        <div class="float-right">
          <span
            v-if="product.stock_status == 'outofstock'"
            class="stock-status text-secondary"
          >
            <font-awesome-icon :icon="['fas', 'minus-circle']" />
            {{ $t("ui.out_stock") }}
          </span>
          <span
            v-if="product.stock_status == 'onbackorder'"
            class="stock-status text-primary"
          >
            <font-awesome-icon :icon="['fas', 'check-circle']" />
            {{ $t("ui.pre_order") }}
          </span>
        </div>
        <h1 class="h1">{{ product.name }}</h1>
        <div class="sku">
          <span class="meta-title">{{ $t("product.sku") }}:</span>
          <span class="meta-name">{{ product.sku }}</span>
        </div>
        <div class="price">
          <template v-if="product.sale_price">
            <span>{{ $t("ui.currency") + product.sale_price }}</span>
            <span class="old-price">
              {{ $t("ui.currency") + product.regular_price }}
            </span>
          </template>
          <span v-else>{{ $t("ui.currency") + product.price }}</span>
        </div>
        <b-form-rating
          v-model="product.average_rating"
          variant="primary"
          inline
          readonly
        ></b-form-rating>
        <span>{{ reviewsString }}</span>
        <b-row>
          <b-col v-if="product.type === 'simple'">
            <b-button
              variant="primary"
              class="mb-3"
              v-if="product.stock_status !== 'outofstock'"
              @click="$store.dispatch('localStore/addToCart', product)"
              >{{ $t("ui.buy") }}</b-button
            >
            <b-button
              variant="light"
              class="mb-3"
              href="/sizes.pdf"
              target="_blank"
              >{{ $t("product.size_table") }}</b-button
            >
          </b-col>
          <b-col v-else>
            <div class="attribute">
              <b-form-group :label="product.attributes[1].name">
                <b-form-radio-group
                  :options="product.attributes[1].options"
                  buttons
                  button-variant="outline-dark"
                  size="sm"
                  v-model="size"
                  class="variation-size"
                >
                </b-form-radio-group>
              </b-form-group>
            </div>
            <b-button
              variant="primary"
              class="mb-3"
              v-if="product.stock_status !== 'outofstock' && size"
              @click="$store.dispatch('localStore/addToCart', product)"
              >{{ $t("ui.buy") }}
            </b-button>
            <b-button
              variant="light"
              class="mb-3"
              href="/sizes.pdf"
              target="_blank"
              >{{ $t("product.size_table") }}</b-button
            >
          </b-col>
        </b-row>

        <div class="product-meta" v-if="product.categories.length > 0">
          <span class="meta-title">{{ $t("product.categories") }}:</span>
          <router-link
            v-for="category in product.categories"
            v-bind:key="category.id"
            :to="`/shop/?categories=${category.id}`"
            class="meta-name"
            v-html="category.name"
          ></router-link>
        </div>
        <div class="product-meta" v-if="product.tags.length > 0">
          <span class="meta-title">{{ $t("product.tags") }}:</span>
          <span
            v-for="tag in product.tags"
            v-bind:key="tag.id"
            class="meta-name"
            v-html="tag.name"
          ></span>
        </div>
        <div class="description" v-html="product.short_description"></div>
      </b-col>
      <b-col lg="6" class="mb-3">
        <h2>{{ $t("product.description") }}</h2>
        <div v-html="product.description" class="description" />
      </b-col>
      <b-col lg="6" v-if="product.reviews_allowed">
        <h2 class="text-right">{{ reviewsString }}</h2>
        <product-reviews
          :reviews="reviews"
          :productId="product.id"
          :reviewsHeaders="reviewsHeaders"
        />
      </b-col>
    </b-row>

    <b-row v-if="upsell">
      <b-col lg="12">
        <h3 class="mb-3">{{ $t("product.recommend") }}</h3>
      </b-col>
      <b-col
        col
        lg="3"
        md="4"
        sm="6"
        cols="12"
        v-for="data in upsell"
        v-bind:key="data.id"
      >
        <product-card :item="data" />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ProductCard from "~/components/ProductCard.vue";
import ProductReviews from "~/components/ProductReviews.vue";
import { mapGetters } from "vuex";
export default {
  loading: false,
  components: { ProductReviews, ProductCard },
  head() {
    return {
      title: this.title,
      titleTemplate: "%s - " + this.$t("links.site_name")
    };
  },
  watchQuery: true,
  async asyncData({ store, route, error }) {
    await store.commit("shop/clearCurrentProduct");
    await store.dispatch("shop/getCurrentProduct", route.params.id);
    if (store.state.shop.currentProduct) {
      let product = store.state.shop.currentProduct;
      if (product.type === "variable") {
        await store.dispatch("shop/getProductVariations");
      }
      if (product.reviews_allowed) {
        await store.dispatch("shop/getReviews", {
          id: product.id,
          page: 1
        });
      }
      if (product.upsell_ids.length > 0) {
        let queryUpsell = product.upsell_ids.join(",");
        await store.dispatch("shop/getUpsellIds", queryUpsell);
      }
      return {
        title: product.name
      };
    } else {
      error({ statusCode: 404, message: "Page not found" });
    }
  },
  data() {
    return {
      slide: 0,
      size: ""
    };
  },
  computed: {
    ...mapGetters({
      product: "shop/getCurrentProduct",
      reviews: "shop/getReviews",
      reviewsHeaders: "shop/getreviewsHeaders",
      upsell: "shop/getUpsell"
    }),
    reviewsString() {
      if (this.$i18n.locale === "ru") {
        let n = Math.abs(this.reviewsHeaders.total) % 100;
        let n1 = n % 10;
        if (n > 10 && n < 20) {
          return this.reviewsHeaders.total + " отзывов";
        } else if (n1 > 1 && n1 < 5) {
          return this.reviewsHeaders.total + " отзыва";
        } else if (n1 == 1) {
          return this.reviewsHeaders.total + " отзыв";
        } else {
          return this.reviewsHeaders.total + " отзывов";
        }
      } else {
        return this.reviewsHeaders.total + " reviews";
      }
    }
  },
  watch: {
    size() {
      this.$store.dispatch("shop/getVariation", this.size);
    }
  }
};
</script>

<style lang="scss">
.current-product {
  padding-top: 70px;
  padding-bottom: 70px;
  h1 {
    color: #191919;
    font-size: 2rem;
    font-weight: 400;
    margin-bottom: 0;
  }
  .stock-status {
    font-size: 0.8rem;
    font-weight: 500;
  }
  .sku {
    color: #c7c7c7;
    font-size: 0.8rem;
  }
  .price {
    color: #191919;
    font-size: 2rem;
    font-weight: 700;
    margin: 25px 0 45px;
    .old-price {
      color: #959595;
      text-decoration: line-through;
      margin-left: 10px;
    }
  }
  .b-rating {
    width: 120px;
    height: calc(1.5em + 2px);
    background-color: transparent;
    margin-bottom: 1.5rem;
    border: 0;
    padding: 0;
    box-shadow: none;
  }

  .product-meta {
    font-size: 0.7rem;
    text-transform: uppercase;
    font-weight: 700;
    margin-bottom: 1rem;
    .meta-title {
      color: #adb5bd;
    }
    .meta-name {
      margin-left: 0.7rem;
      color: #172b4d;
    }
    a.meta-name:hover {
      opacity: 0.8;
    }
  }
  h2 {
    margin-bottom: 2rem;
    font-size: 1.75rem;
  }
  .description {
    font-size: 0.95rem;
    font-weight: 300;
    line-height: 1.7em;
  }
  .attribute {
    legend {
      font-size: 1rem;
      font-weight: 600;
    }
    .variation-size label {
      border-radius: 0;
      text-transform: uppercase;
      min-width: 30px;
    }
    .variation-size label + label {
      margin-left: 0.5rem;
    }
  }
}
</style>
