<template>
  <b-container class="checkout">
    <b-row v-if="order">
      <div class="order-success col-12" v-if="$route.query.success">
        <font-awesome-icon :icon="['far', 'check-circle']" />
        <h2 class="h2">{{ $t("ui.order_paid") }}</h2>
      </div>
      <template v-else>
        <h2 class="h2 col-12 text-center">{{ $t("ui.order_details") }}</h2>
        <b-col lg="12 order">
          <h4 class="h4">№ {{ order.id }}</h4>
          <b-row v-for="product in order.line_items" :key="product.id">
            <b-col cols="5">
              <h5 class="product-name">
                {{
                  product.name.substring(0, product.name.length - 9) +
                    product.meta_data[0].value
                }}
              </h5>
            </b-col>
            <b-col cols="3" class="product-name"
              >Количество: {{ product.quantity }}</b-col
            >
            <b-col cols="4" class="text-right">
              {{ order.currency_symbol }} {{ product.price }}
            </b-col>
          </b-row>
          <b-row class="total-price">
            <b-col cols="8">{{ order.shipping_lines[0].method_title }}</b-col>
            <b-col cols="4" class="text-right">
              {{ order.currency_symbol }}
              {{ order.shipping_lines[0].total }}
            </b-col>
          </b-row>
          <b-row class="total-price">
            <b-col cols="8">Всего:</b-col>
            <b-col cols="4" class="text-right">
              {{ order.currency_symbol }} {{ order.total }}
            </b-col>
          </b-row>
        </b-col>
        <b-col lg="12" class="text-center">
          <b-button variant="primary" size="lg" @click="tinkoffPayment">{{
            $t("ui.pay")
          }}</b-button>
        </b-col>
      </template>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  loading: false,
  computed: {
    ...mapGetters({
      order: "localStore/getOrder"
    })
  },
  mounted() {
    this.$nextTick(async () => {
      this.$nuxt.$loading.start();
      if (this.$route.query.success) {
        await this.$store.dispatch(
          "localStore/updateOrder",
          this.$route.params.id
        );
      }
      await this.$store.dispatch("localStore/getOrder", this.$route.params.id);
      await this.$store.dispatch("extendShop/getPaymentGateways");
      await setTimeout(() => this.$nuxt.$loading.finish(), 500);
    });
  },
  methods: {
    async tinkoffPayment() {
      await this.$store.dispatch("extendShop/tinkoffPayment", this.order);
    }
  }
};
</script>

<style lang="scss">
.order-success {
  margin-top: 50px;
  font-size: 2rem;
  text-align: center;
  svg {
    color: #2dce89;
    font-size: 140px;
  }
}
</style>
