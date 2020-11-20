<template>
  <b-container class="checkout">
    <b-form @submit.prevent="createOrder">
      <b-row>
        <b-col lg="12">
          <h2 class="h2">{{ $t("checkout.checkout") }}</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <nuxt-link :to="localePath('/')">{{
                  $t("links.home")
                }}</nuxt-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                {{ $t("checkout.checkout") }}
              </li>
            </ol>
          </nav>
        </b-col>
        <b-col lg="4">
          <h3 class="h3">{{ $t("checkout.your_order") }}</h3>
          <b-media
            no-body
            v-for="(product, index) in cart"
            :key="index"
            class="checkout-product"
          >
            <nuxt-link :to="localePath('/shop/' + product.slug)">
              <div class="overflow-hidden">
                <div
                  class="featured-img-container"
                  :style="
                    'background-image: url(' + product.images[0].src + ');'
                  "
                ></div>
              </div>
            </nuxt-link>
            <b-media-body class="ml-3">
              <h4>
                <nuxt-link :to="localePath('/shop/' + product.slug)">{{
                  product.name
                }}</nuxt-link>
              </h4>

              <span class="checkout-text"
                >{{ $t("cart.quantity") }}: {{ product.quantity }}</span
              >
              <div class="checkout-text" v-if="product.type === 'variable'">
                <div v-for="text in product.variation_text" :key="text.id">
                  {{ text.name }} :
                  {{ text.option.substring(5, text.option.length - 3) }}
                </div>
              </div>
              <span class="checkout-price">₽ {{ product.totalPrice }}</span>
            </b-media-body>
          </b-media>

          <h3 class="h3">
            <span class="total-title">{{ $t("cart.total") }}:</span>
            <span class="total-price">₽ {{ totalPrice }}</span>
          </h3>
          <b-form-group :label="$t('checkout.delivery_method')" v-if="shipping">
            <div v-for="method in shipping" :key="method.method_id">
              <b-form-radio
                v-model="shipping_method"
                v-if="method.enabled"
                :value="method.method_id"
              >
                {{ method.title.substring(5, method.title.length - 3) }}
                <template v-if="method.settings.cost.value"
                  >₽ {{ method.settings.cost.value }}</template
                >
              </b-form-radio>
            </div>
          </b-form-group>
        </b-col>
        <b-col lg="8">
          <b-row>
            <b-form-group
              :label="$t('checkout.first_name')"
              label-for="input-name"
              class="col-lg-6"
            >
              <b-form-input
                id="input-name"
                v-model="$v.first_name.$model"
                type="text"
                :state="validateState('first_name')"
              >
              </b-form-input>
              <b-form-invalid-feedback>
                {{ $t("validation.empty_text") }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('checkout.last_name')"
              label-for="input-lastName"
              class="col-lg-6"
            >
              <b-form-input
                id="input-lastName"
                v-model="$v.last_name.$model"
                :state="validateState('last_name')"
                type="text"
              ></b-form-input>
              <b-form-invalid-feedback>
                {{ $t("validation.empty_text") }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              label="Email "
              label-for="input-email"
              class="col-lg-6"
            >
              <b-form-input
                id="input-email"
                v-model="$v.email.$model"
                :state="validateState('email')"
                type="email"
              ></b-form-input>
              <b-form-invalid-feedback>
                {{ $t("validation.invalid_email") }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('checkout.phone')"
              label-for="input-phone"
              class="col-lg-6"
            >
              <b-form-input
                id="input-phone"
                v-model="$v.phone.$model"
                :state="validateState('phone')"
                type="text"
              ></b-form-input>
              <b-form-invalid-feedback>
                {{ $t("validation.invalid_phone") }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('checkout.address')"
              label-for="input-address"
              class="col-lg-8"
            >
              <b-form-input
                id="input-address"
                v-model="$v.address_1.$model"
                :state="validateState('address_1')"
                type="text"
              ></b-form-input>
              <b-form-invalid-feedback>
                {{ $t("validation.empty_text") }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('checkout.postcode')"
              label-for="input-zipcode"
              class="col-lg-4"
            >
              <b-form-input
                id="input-zipcode"
                v-model="$v.postcode.$model"
                :state="validateState('postcode')"
                type="text"
              ></b-form-input>
              <b-form-invalid-feedback>
                {{ $t("validation.invalid_zip") }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('checkout.city')"
              label-for="input-city"
              class="col-lg-6"
            >
              <b-form-input
                id="input-city"
                v-model="$v.city.$model"
                :state="validateState('city')"
                type="text"
              ></b-form-input>
              <b-form-invalid-feedback>
                {{ $t("validation.empty_text") }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group
              :label="$t('checkout.state')"
              label-for="input-state"
              class="col-lg-6"
            >
              <b-form-input
                id="input-state"
                v-model="$v.state.$model"
                :state="validateState('state')"
                type="text"
              ></b-form-input>
              <b-form-invalid-feedback>
                {{ $t("validation.empty_text") }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-col lg="6">
              <b-form-group
                :label="$t('checkout.order_notes')"
                label-for="input-note"
              >
                <b-form-input
                  id="input-note"
                  v-model="customer_note"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-form-group
              :label="$t('checkout.payment_method')"
              class="col-lg-12"
            >
              <div v-for="payment in gateways" :key="payment.id">
                <b-form-radio
                  v-model="payment_method"
                  v-if="payment.enabled"
                  :value="payment.id"
                >
                  <template v-if="payment.method_title">
                    {{ payment.method_title }}
                  </template>
                  <template v-else>{{ payment.title }}</template>
                  <b-form-text>{{ payment.description }} </b-form-text>
                </b-form-radio>
              </div>
            </b-form-group>
            <b-form-group class="col-lg-12">
              <b-button type="submit" variant="primary">
                {{ $t("checkout.place_order") }}
              </b-button>
            </b-form-group>
          </b-row>
        </b-col>
      </b-row>
    </b-form>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import { validationMixin } from "vuelidate";
import { required, minLength, email, numeric } from "vuelidate/lib/validators";
export default {
  loading: false,
  async asyncData({ store }) {
    await store.dispatch("validate");
    await store.dispatch("extendShop/getPaymentGateways");
    let customer = store.state.extendShop.customer;
    if (customer) {
      return {
        first_name: customer.billing.first_name,
        last_name: customer.billing.last_name,
        email: customer.billing.email,
        phone: customer.billing.phone,
        address_1: customer.billing.address_1,
        postcode: customer.billing.postcode,
        city: customer.billing.city,
        state: customer.billing.state,
        customer_id: customer.id
      };
    } else {
      return {
        customer_id: 0
      };
    }
  },
  mixins: [validationMixin],
  head() {
    return {
      title: this.$t("checkout.checkout"),
      titleTemplate: "%s - " + this.$t("links.site_name")
    };
  },
  data() {
    return {
      customer_id: null,
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address_1: "",
      postcode: "",
      city: "",
      state: "",
      customer_note: "",
      payment_method: "tinkoff",
      shipping_method: "flat_rate"
    };
  },
  validations: {
    first_name: {
      required
    },
    last_name: {
      required,
      minLength: minLength(3)
    },
    email: {
      required,
      email
    },
    phone: {
      required
    },
    address_1: {
      required
    },
    postcode: {
      required,
      numeric
    },
    city: {
      required
    },
    state: {
      required
    }
  },
  computed: {
    ...mapGetters({
      user: "getUser",
      customer: "extendShop/getCustomer",
      cart: "localStore/getShoppingCart",
      gateways: "extendShop/getPaymentGateways",
      shipping: "extendShop/getShippingMethods"
    }),
    totalPrice() {
      let total = 0;
      for (let product of this.cart) {
        total += Number(product.totalPrice);
      }
      if (this.totalShipping) {
        return (total += this.totalShipping);
      } else {
        return total;
      }
    },
    totalShipping() {
      if (this.shipping) {
        const found = this.shipping.find(
          obj => obj.method_id === this.shipping_method
        );
        if (found) {
          return Number(found.settings.cost.value);
        }
      }
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    createOrder() {
      this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }
      let currency = "RUB";
      if (this.$i18n.locale === "en") {
        currency = "USD";
      }
      const line_items = this.cart.map(item => {
        if (item.type === "simple") {
          return {
            product_id: item.id,
            quantity: item.quantity
          };
        } else {
          return {
            product_id: item.id,
            variation_id: item.variation_id,
            quantity: item.quantity
          };
        }
      });
      const data = {
        payment_method: this.payment_method,
        customer_id: this.customer_id,
        currency: currency,
        set_paid: false,
        billing: {
          first_name: this.first_name,
          last_name: this.last_name,
          address_1: this.address,
          address_2: "",
          city: this.city,
          state: this.state,
          postcode: this.postcode,
          country: this.country,
          email: this.email,
          phone: this.phone
        },
        customer_note: this.customer_note,
        line_items: line_items,
        shipping_lines: [
          {
            method_id: this.shipping_method,
            total: String(this.totalShipping)
          }
        ]
      };

      this.$store.dispatch("localStore/createOrder", data);
    }
  }
};
</script>

<style lang="scss">
.checkout-product {
  color: #6a6a6a;
  font-size: 0.75rem;
  padding-bottom: 1.25rem;
  margin-bottom: 1.25rem;
  border-bottom: 1px dotted #eee;
  width: 100%;
  .featured-img-container {
    transition: transform 1s ease;
    padding-top: 100%;
    display: block;
    width: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 120px;
    min-height: 120px;
  }
  h4 {
    font-size: 0.9rem;
  }
  .checkout-text {
    display: block;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }
  .checkout-price {
    color: #858585;
    font-weight: 600;
  }
}
legend.col-form-label {
  font-size: 0.8rem;
}
</style>
