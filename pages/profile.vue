<template>
  <b-container class="page">
    <b-row>
      <b-col lg="12">
        <h2 class="h2">{{ $t("links.profile") }}</h2>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <nuxt-link :to="localePath('/')">{{
                $t("links.home")
              }}</nuxt-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ $t("links.profile") }}
            </li>
          </ol>
        </nav>
      </b-col>
      <b-col lg="12">
        <b-tabs pills vertical>
          <b-tab :title="$t('links.orders')" active>
            <b-col lg="12" v-for="order in orders" :key="order.id">
              <div class="user-order">
                <div class="float-right">
                  <b-badge v-if="order.status === 'pending'" variant="warning">
                    В ожидании оплаты
                  </b-badge>
                  <b-badge
                    v-else-if="order.status === 'processing'"
                    variant="primary"
                  >
                    Обработка
                  </b-badge>
                  <b-badge
                    v-else-if="order.status === 'on-hold'"
                    variant="secondary"
                  >
                    На удержании
                  </b-badge>
                  <b-badge
                    v-else-if="order.status === 'cancelled'"
                    variant="secondary"
                  >
                    Отменен
                  </b-badge>
                  <b-badge
                    v-else-if="order.status === 'refunded'"
                    variant="secondary"
                  >
                    Возвращён </b-badge
                  ><b-badge
                    v-else-if="order.status === 'failed'"
                    variant="warning"
                  >
                    Не удался
                  </b-badge>
                  <b-badge v-else variant="success">
                    Выполнен
                  </b-badge>
                </div>
                <h4 class="h4">Заказ № {{ order.id }}</h4>
                <time>{{ timestamp(order.date_created) }}</time>
                <b-row v-for="product in order.line_items" :key="product.id">
                  <b-col cols="5">
                    <h5 class="product-name">{{ product.name }}</h5>
                  </b-col>
                  <b-col cols="3" class="product-name"
                    >Количество: {{ product.quantity }}</b-col
                  >
                  <b-col cols="4" class="text-right">
                    {{ order.currency_symbol }} {{ product.price }}
                  </b-col>
                </b-row>
                <b-row class="total-price">
                  <b-col cols="8">{{
                    order.shipping_lines[0].method_title
                  }}</b-col>
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
              </div>
            </b-col>
          </b-tab>
          <b-tab :title="$t('links.payment_info')" lazy>
            <b-form @submit.prevent="billing">
              <b-row v-if="customer">
                <b-form-group
                  label="Имя"
                  label-for="input-name"
                  class="col-lg-6"
                >
                  <b-form-input
                    id="input-name"
                    v-model="first_name"
                    type="text"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Фамилия"
                  label-for="input-lastName"
                  class="col-lg-6"
                >
                  <b-form-input
                    id="input-lastName"
                    v-model="last_name"
                    type="text"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Email "
                  label-for="input-email"
                  class="col-lg-6"
                >
                  <b-form-input
                    id="input-email"
                    v-model="email"
                    type="email"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Телефон"
                  label-for="input-phone"
                  class="col-lg-6"
                >
                  <b-form-input
                    id="input-phone"
                    v-model="phone"
                    type="text"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Адрес"
                  label-for="input-address"
                  class="col-lg-8"
                >
                  <b-form-input
                    id="input-address"
                    v-model="address_1"
                    type="text"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Почтовый индекс"
                  label-for="input-zipcode"
                  class="col-lg-4"
                >
                  <b-form-input
                    id="input-zipcode"
                    v-model="postcode"
                    type="text"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Населённый пункт"
                  label-for="input-city"
                  class="col-lg-6"
                >
                  <b-form-input
                    id="input-city"
                    v-model="city"
                    type="text"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  label="Область/район"
                  label-for="input-state"
                  class="col-lg-6"
                >
                  <b-form-input
                    id="input-state"
                    v-model="state"
                    type="text"
                  ></b-form-input>
                </b-form-group>
                <b-form-group class="col-lg-12">
                  <b-button type="submit" variant="primary">Сохранить</b-button>
                </b-form-group>
              </b-row>
            </b-form>
          </b-tab>
        </b-tabs>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  data() {
    return {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      address_1: "",
      postcode: "",
      city: "",
      state: ""
    };
  },
  computed: {
    ...mapGetters({
      user: "getUser",
      customer: "extendShop/getCustomer",
      orders: "extendShop/getOrders"
    })
  },
  async mounted() {
    if (this.$store.state.extendShop.customer) {
      let customer = this.$store.state.extendShop.customer;
      await this.$store.dispatch("extendShop/getOrders", customer.id);
      this.first_name = customer.billing.first_name;
      this.last_name = customer.billing.last_name;
      this.email = customer.billing.email;
      this.phone = customer.billing.phone;
      this.address_1 = customer.billing.address_1;
      this.postcode = customer.billing.postcode;
      this.city = customer.billing.city;
      this.state = customer.billing.state;
      this.customer_id = customer.id;
    }
  },
  methods: {
    billing() {
      let data = {
        billing: {
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email || this.user.email,
          phone: this.phone,
          address_1: this.address_1,
          postcode: this.postcode,
          city: this.city,
          state: this.state
        }
      };
      this.$store.dispatch("extendShop/updateCustomer", {
        id: this.user.id,
        data
      });
    },
    timestamp(time) {
      moment.locale("ru");
      return moment(time).calendar();
    }
  }
};
</script>

<style lang="scss">
.user-order {
  background-color: #f1f1f1;
  padding: 1rem;
  border-radius: 0.4rem;
  margin-bottom: 1rem;
  .h4 {
    font-weight: 400;
    font-size: 1.25rem;

    text-transform: uppercase;
  }
  time {
    color: #6a6a6a;
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    display: block;
  }
  .product-name {
    color: #6a6a6a;
    font-size: 0.8rem;
    font-weight: 400;
  }
  .total-price {
    font-size: 1rem;
    font-weight: 700;
    color: #151515;
  }
}
.nav-pills .nav-link {
  border-radius: 0.25rem;
  box-shadow: 0 4px 6px rgba(50, 50, 93, 0.11), 0 1px 3px rgba(0, 0, 0, 0.08);
  font-weight: 400;
  font-size: 0.8rem;
  margin-bottom: 1rem;
}
</style>
