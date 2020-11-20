<template>
  <section class="home">
    <section class="slide mb-50">
      <b-img-lazy src="/icon.png" fluid alt="Logo" />
    </section>
    <b-container>
      <section class="categories mb-50">
        <b-row class="no-gutters">
          <b-col
            col
            lg="4"
            md="4"
            sm="6"
            cols="12"
            v-for="data in categories"
            v-bind:key="data.id"
          >
            <post-card :item="data" />
          </b-col>
        </b-row>
      </section>
      <section class="popular mb-50">
        <h1 class="h1 text-center">{{ $t("home.popular_products") }}</h1>
        <spinner v-if="$fetchState.pending" />
        <div class="text-center" v-else-if="$fetchState.error">
          <p class=" text-muted">{{ $t("ui.error") }}</p>
          <b-button variant="primary" size="sm" @click="$fetch">{{
            $t("ui.refresh")
          }}</b-button>
        </div>
        <b-row v-else>
          <b-col
            col
            lg="3"
            md="3"
            sm="6"
            cols="12"
            v-for="data in popularProduct"
            v-bind:key="data.id"
          >
            <product-card :item="data" />
          </b-col>
          <b-col lg="12" class="text-center">
            <b-button variant="primary" :to="localePath('/shop')">
              {{ $t("home.all_products") }}
              <font-awesome-icon :icon="['fas', 'long-arrow-alt-right']" />
            </b-button>
          </b-col>
        </b-row>
      </section>
    </b-container>
    <section class="benefit-box">
      <b-container>
        <b-row>
          <b-col lg="8"
            ><b-img-lazy
              src="/img/benefit-box-1-red.jpeg"
              fluid
              alt="benefit-box"
          /></b-col>
          <b-col lg="4" class="mb-50">
            <p>
              {{ $t("home.t1") }}
            </p>
            <p>
              {{ $t("home.t2") }}
            </p>
            <div class="info-contact">
              <font-awesome-icon :icon="['fas', 'phone-alt']" />
              <a href="tel:+79657933637" rel="noreferrer">
                +7 (965) 793-36-37</a
              >
            </div>
            <div class="info-contact">
              <font-awesome-icon :icon="['fas', 'envelope']" />
              <a href="mailto:info@empresswear.ru" rel="noreferrer"
                >info@empresswear.ru</a
              >
            </div>
            <div class="info-contact">
              <font-awesome-icon :icon="['fab', 'instagram']" />
              <a
                href="https://www.instagram.com/empress_wear_by_tuktik/"
                target="_blank"
                rel="noreferrer"
                >empress_wear_by_tuktik
              </a>
            </div>
            <b-button
              href="https://www.instagram.com/empress_wear_by_tuktik/"
              target="_blank"
              variant="primary"
              rel="noopener"
            >
              <font-awesome-icon :icon="['fab', 'instagram']" />
              <span class="sr-only">instagram</span>
            </b-button>
          </b-col>
        </b-row>
      </b-container>
    </section>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import ProductCard from "~/components/ProductCard.vue";
import PostCard from "~/components/PostCard.vue";
import Spinner from "~/components/Spinner.vue";
export default {
  components: { ProductCard, PostCard, Spinner },
  head() {
    return {
      title: this.$t("links.site_name")
    };
  },
  async fetch() {
    await this.$store.dispatch("shop/popularProduct");
  },
  computed: {
    ...mapGetters({
      popularProduct: "shop/getPopularProduct"
    })
  },
  watch: { "$i18n.locale": "$fetch" },
  data() {
    return {
      categories: [
        {
          id: 0,
          slug: this.localePath("/shop/?categories=19"),
          name: this.$t("home.t_shirts"),
          src: "img/banner2_1.jpg"
        },
        {
          id: 1,
          slug: this.localePath("/shop/?categories=18"),
          name: this.$t("home.hoodies"),
          src: "img/banner2_2.jpg"
        },
        {
          id: 2,
          slug: this.localePath("/shop/?categories=17"),
          name: this.$t("home.pants"),
          src: "img/banner2_3.jpg"
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.home {
  .mb-50 {
    margin-bottom: 50px;
  }
  .slide {
    background-color: #f8f8f8;
    height: 600px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .popular {
    .h1 {
      color: #272727;
      font-size: 45px;
      font-weight: 600;
      margin-bottom: 50px;
    }
    .btn-primary {
      text-transform: uppercase;
      font-weight: 400;
      font-size: 0.8rem;
      svg {
        width: 12px;
      }
    }
  }
  .benefit-box {
    font-size: 0.875rem;
    color: #6a6a6a;
    margin-bottom: 0;
    img,
    .mb-50 {
      margin-bottom: 50px;
    }
    .info-contact {
      margin-bottom: 1rem;
      svg {
        margin-right: 10px;
        width: 16px;
      }
      a {
        font-size: 0.875rem;
        color: #6a6a6a;
      }
    }
    .btn-primary {
      min-width: 45px;
    }
  }
}
@media screen and (max-width: 576px) {
  .home .popular .h1 {
    font-size: 1.75rem;
  }
  .home .slide img {
    max-width: 90%;
  }
}
</style>
