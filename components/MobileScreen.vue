<template>
  <b-sidebar id="mobile-screen" bg-variant="white" left shadow>
    <div
      class="d-flex h-100 text-center align-items-center justify-content-center"
    >
      <b-nav align="center" vertical>
        <b-nav-item :to="localePath('/shop')">
          {{ $t("links.all_products") }}
        </b-nav-item>
        <b-nav-item
          v-for="category in categories"
          :key="category.id"
          :to="localePath('/shop/?categories=' + category.id)"
          >{{ category.name }}</b-nav-item
        >
        <b-nav-item :to="localePath('/lookbook')">
          {{ $t("links.lookbook") }}
        </b-nav-item>
        <b-nav-item :to="localePath('/about')">{{
          $t("links.about")
        }}</b-nav-item>
        <b-nav-item :to="localePath('/contact')">{{
          $t("links.contact")
        }}</b-nav-item>
      </b-nav>
    </div>
  </b-sidebar>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      categories: "shop/getCategories"
    })
  }
};
</script>

<style>
#mobile-screen {
  width: 100% !important;
}
#mobile-screen .nav .nav-link {
  font-size: 0.75rem;
  text-transform: uppercase;
  border-bottom: 1px solid #f1f1f1;
  padding: 1.25rem 1rem;
}
#mobile-screen .nav .nav-item:last-child .nav-link {
  border-bottom-color: transparent;
}
</style>
