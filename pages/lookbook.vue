<template>
  <b-container class="lookbook">
    <b-row>
      <b-col lg="12">
        <h2 class="h2">{{ $t("links.lookbook") }}</h2>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <nuxt-link :to="localePath('/')">{{
                $t("links.home")
              }}</nuxt-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ $t("links.lookbook") }}
            </li>
          </ol>
        </nav>
      </b-col>
    </b-row>
    <b-col cols="12" v-if="$fetchState.pending">
      <spinner />
    </b-col>
    <b-col cols="12" v-else-if="$fetchState.error" class="text-center">
      <p class=" text-muted">{{ $t("ui.error") }}</p>
      <b-button variant="primary" size="sm" @click="$fetch">{{
        $t("ui.refresh")
      }}</b-button>
    </b-col>
    <b-row v-else>
      <b-col
        cols="12"
        sm="6"
        md="4"
        lg="3"
        class="media-image"
        v-for="image in media"
        :key="image.id"
      >
        <a @click="getModal(image)">
          <b-img-lazy
            :src="image.source_url"
            :alt="image.title.rendered"
            fluid
          />
        </a>
      </b-col>
      <b-col lg="12">
        <b-pagination
          v-if="mediaHeaders['x-wp-totalpages'] > 1"
          v-model="currentPage"
          :per-page="12"
          :total-rows="mediaHeaders['x-wp-total']"
          align="center"
        ></b-pagination>
      </b-col>
    </b-row>
    <b-modal id="modal-1" hide-header hide-footer>
      <b-button-close @click="$bvModal.hide('modal-1')" />
      <b-img-lazy :src="currentMedia" fluid />
    </b-modal>
  </b-container>
</template>

<script>
import { mapGetters } from "vuex";
import Spinner from "~/components/Spinner.vue";
export default {
  loading: false,
  components: { Spinner },
  head() {
    return {
      title: this.$t("links.lookbook"),
      titleTemplate: "%s - " + this.$t("links.site_name")
    };
  },
  async fetch() {
    await this.$store.dispatch("getMedia", 1);
    return {
      currentMedia: this.$store.state.media[0].source_url
    };
  },
  data() {
    return {
      currentMedia: null,
      currentPage: 1
    };
  },
  computed: {
    ...mapGetters({
      media: "getMedia",
      mediaHeaders: "getmediaHeaders"
    })
  },
  watch: {
    currentPage() {
      this.$store.dispatch("getMedia", this.currentPage);
    }
  },
  methods: {
    getModal(image) {
      this.$bvModal.show("modal-1");
      this.currentMedia = image.source_url;
    }
  }
};
</script>

<style lang="scss">
.lookbook {
  margin-bottom: 50px;
  .media-image {
    margin-bottom: 30px;
    a {
      cursor: pointer;
    }
  }
}
#modal-1 .close {
  position: absolute;
  font-size: 2.5rem;
  right: 1rem;
}
</style>
