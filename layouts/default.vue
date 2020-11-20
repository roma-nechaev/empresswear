<template>
  <div class="app">
    <app-header />
    <div class="content">
      <nuxt />
    </div>
    <app-footer />
    <notification />
    <shopping-cart />
    <mobile-screen />
  </div>
</template>
<script>
import AppHeader from "~/components/AppHeader.vue";
import AppFooter from "~/components/AppFooter.vue";
import Notification from "~/components/Notification.vue";
import ShoppingCart from "~/components/ShoppingCart.vue";
import MobileScreen from "~/components/MobileScreen.vue";
export default {
  components: { AppHeader, AppFooter, Notification, ShoppingCart, MobileScreen }
};
</script>
<style>
html,
body,
#__nuxt,
#__layout {
  height: 100%;
}
.app {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.app .content {
  flex: 1 0 auto;
}
a {
  transition: all 0.3s;
}
button:focus {
  outline: none;
}
.h2 {
  font-weight: 400;
  margin-top: 50px;
  text-transform: uppercase;
}
.h3 {
  font-size: 1.12rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}
.form-group label {
  font-size: 0.8rem;
}
</style>
