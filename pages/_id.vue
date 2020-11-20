<template>
  <b-container class="page">
    <b-row v-if="page">
      <b-col lg="12">
        <h2 class="h2">{{ page.title.rendered }}</h2>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <nuxt-link :to="localePath('/')">{{
                $t("links.home")
              }}</nuxt-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ page.title.rendered }}
            </li>
          </ol>
        </nav>
      </b-col>
      <b-col lg="12" v-html="page.content.rendered"></b-col>
    </b-row>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  loading: false,
  computed: {
    ...mapGetters({
      page: "getPage"
    })
  },
  head() {
    return {
      title: this.title,
      titleTemplate: "%s - " + this.$t("links.site_name")
    };
  },
  watchQuery: true,
  async asyncData({ store, route, error }) {
    await store.dispatch("getPage", route.params.id);

    if (store.state.page === undefined) {
      error({ statusCode: 404, message: "Page not found" });
    } else {
      return {
        title: store.state.page.title.rendered
      };
    }
  }
};
</script>

<style></style>
