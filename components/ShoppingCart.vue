<template>
  <b-sidebar
    id="shoppingCart"
    :title="$t('cart.cart') + '(' + totalQuantity + ')'"
    bg-variant="white"
    right
    shadow
  >
    <div
      class="d-flex h-100 text-center align-items-center"
      v-if="cart.length == 0"
    >
      <b-col>
        <font-awesome-icon icon="shopping-cart" />
        <h3 class="h3">{{ $t("cart.empty") }}</h3>
      </b-col>
    </div>
    <template v-else>
      <b-media
        no-body
        v-for="(product, index) in cart"
        :key="index"
        class="product-cart"
      >
        <b-img
          :src="product.images[0].src"
          :alt="product.images[0].name"
          width="100"
        />
        <b-media-body class="ml-3">
          <b-button-close
            @click="$store.dispatch('localStore/removeFromCart', index)"
          />
          <h5 class="product-name">
            <nuxt-link :to="localePath('/shop/' + product.slug)">
              {{ product.name }}
            </nuxt-link>
          </h5>
          <span class="product-meta"
            >{{ $t("cart.quantity") }}: {{ product.quantity }}
          </span>
          <div class="product-meta" v-if="product.type === 'variable'">
            <div v-for="text in product.variation_text" :key="text.id">
              {{ text.name }} :
              {{ text.option.substring(5, text.option.length - 3) }}
            </div>
          </div>
          <bdi class="product-price">
            {{ $t("ui.currency") + product.totalPrice }}
          </bdi>
        </b-media-body>
      </b-media>
    </template>
    <template v-slot:footer v-if="cart.length > 0">
      <div class="subtotal">
        <span class="total-title">{{ $t("cart.total") }}:</span>
        <span class="total-price">{{ $t("ui.currency") + totalPrice }}</span>
      </div>
      <b-button block variant="primary" :to="localePath('/checkout')">
        {{ $t("cart.checkout") }}
      </b-button>
    </template>
  </b-sidebar>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      cart: "localStore/getShoppingCart"
    }),
    totalQuantity() {
      let total = 0;
      for (let product of this.cart) {
        total += Number(product.quantity);
      }
      return total;
    },
    totalPrice() {
      let total = 0;
      for (let product of this.cart) {
        total += Number(product.totalPrice);
      }
      return total;
    }
  },
  mounted() {
    this.$store.dispatch("localStore/getCart");
  }
};
</script>

<style lang="scss">
#shoppingCart {
  padding: 1.25rem 2rem;
  width: 480px !important;
  .b-sidebar-header {
    padding: 0 0 1.25rem;
    margin-bottom: 1.25rem;
    border-bottom: 1px dashed #eee;
    strong {
      font-size: 1rem;
    }
  }
  .b-sidebar-body {
    padding-right: 0.75rem;
    .close {
      font-size: 2rem;
      font-weight: 300;
      color: #212529;
    }
  }
  .b-sidebar-footer {
    .subtotal {
      display: flex;
      justify-content: space-between;
      margin: 1.25rem 0;
      .total-title {
        font-size: 0.8rem;
        color: #858585;
        text-transform: uppercase;
      }
      .total-price {
        display: block;
        font-size: 1.5rem;
        font-weight: 700;
        color: #151515;
      }
    }
  }
  .fa-shopping-cart {
    font-size: 90px;
    color: #858585;
  }
  .h3 {
    margin-top: 0.75rem;
    font-size: 1.25rem;
    color: #8898aa;
    font-weight: 300;
  }
}
.product-cart {
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px dotted #eee;
  width: 100%;
  .product-name {
    font-size: 0.9rem;
    font-weight: 700;
    a {
      color: #6a6a6a;
    }
  }
  .product-meta {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
  }
  .product-price {
    color: #858585;
    font-weight: 600;
  }
}
.b-sidebar-body::-webkit-scrollbar {
  width: 6px;
  background-color: #f6f9fc;
}
.b-sidebar-body::-webkit-scrollbar-thumb {
  background-color: rgba(236, 49, 50, 0.7);
  border-radius: 6px;
}
@media screen and (max-width: 576px) {
  #shoppingCart {
    width: 100% !important;
  }
}
</style>
