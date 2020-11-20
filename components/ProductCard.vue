<template>
  <b-card img-top class="card-shop" no-body>
    <nuxt-link :to="localePath('/shop/' + item.slug)">
      <div class="overflow-hidden">
        <div
          class="featured-img-container"
          :style="'background-image: url(' + item.images[0].src + ');'"
        ></div>
      </div>
    </nuxt-link>
    <b-card-body>
      <b-card-title>
        <nuxt-link :to="localePath('/shop/' + item.slug)" class="card-link">{{
          item.name
        }}</nuxt-link>
      </b-card-title>
      <b-card-text text-tag="div">
        <div class="card-badges">
          <b-badge variant="warning" v-if="item.on_sale">{{
            $t("ui.discount")
          }}</b-badge>
          <b-badge variant="warning" v-if="item.featured">{{
            $t("ui.popular")
          }}</b-badge>
          <b-badge variant="light" v-if="item.stock_status == 'outofstock'">{{
            $t("ui.out_stock")
          }}</b-badge>
          <b-badge
            variant="info"
            v-else-if="item.stock_status == 'onbackorder'"
          >
            {{ $t("ui.pre_order") }}
          </b-badge>
        </div>
        <b-button
          variant="primary"
          size="sm"
          class="float-right"
          v-if="item.stock_status !== 'outofstock' && item.type === 'simple'"
          @click="$store.dispatch('localStore/addToCart', item)"
        >
          {{ $t("ui.buy") }}
        </b-button>
        <div class="price">
          <template v-if="item.sale_price">
            <span>{{ $t("ui.currency") + item.sale_price }}</span>
            <span class="old-price">{{
              $t("ui.currency") + item.regular_price
            }}</span>
          </template>
          <span v-else> {{ $t("ui.currency") + item.price }}</span>
        </div>
      </b-card-text>
    </b-card-body>
  </b-card>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      reqired: true
    }
  }
};
</script>

<style lang="scss">
.card-shop {
  margin-bottom: 1.5rem;
  border: 0;
  .featured-img-container {
    transition: transform 1s ease;
    min-height: 350px;
    padding-top: 100%;
    display: block;
    width: 100%;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }
  &:hover .featured-img-container {
    -webkit-transform: scale(1.06);
    -ms-transform: scale(1.06);
    transform: scale(1.06);
  }
  .card-body {
    padding: 1.25rem 0;
  }
  .card-title {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .card-title,
  .card-link {
    color: #6a6a6a;
    font-size: 14px;
    font-weight: 400;
  }
  .card-badges {
    position: absolute;
    top: 10px;
    left: 10px;
  }
  .price {
    color: #464646;
    font-size: 1.25rem;
    font-weight: 700;
    .old-price {
      color: #959595;
      text-decoration: line-through;
      margin-left: 10px;
    }
  }
}
</style>
