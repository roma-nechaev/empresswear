<template>
  <div class="instagram">
    <b-row class="no-gutters" v-if="posts">
      <b-col
        col
        lg="2"
        md="2"
        sm="4"
        cols="6"
        v-for="data in posts"
        v-bind:key="data.id"
        class="instagram-feed"
      >
        <a :href="data.permalink" target="_blank" rel="noreferrer">
          <b-img
            :src="data.thumbnail_url"
            v-if="data.media_type === 'VIDEO'"
            :alt="data.caption"
            fluid
          />
          <b-img :src="data.media_url" :alt="data.caption" v-else fluid />
          <svg viewBox="0 0 24 24" v-if="data.media_type === 'VIDEO'">
            <path
              d="M23.467,5.762c-0.118-0.045-0.232-0.068-0.342-0.068c-0.246,0-0.451,0.087-0.615,0.26l-3.76,3.217v5.766l3.76,3.578c0.164,0.173,0.369,0.26,0.615,0.26c0.109,0,0.223-0.023,0.342-0.068C23.822,18.552,24,18.284,24,17.901V6.57C24,6.186,23.822,5.917,23.467,5.762z"
            ></path>
            <path
              d="M16.33,4.412c-0.77-0.769-1.696-1.154-2.78-1.154H3.934c-1.084,0-2.01,0.385-2.78,1.154C0.385,5.182,0,6.108,0,7.192v9.616c0,1.084,0.385,2.01,1.154,2.78c0.77,0.77,1.696,1.154,2.78,1.154h9.616c1.084,0,2.01-0.385,2.78-1.154c0.77-0.77,1.154-1.696,1.154-2.78v-3.076v-3.478V7.192C17.484,6.108,17.099,5.182,16.33,4.412z M8.742,17.229c-2.888,0-5.229-2.341-5.229-5.229c0-2.888,2.341-5.229,5.229-5.229S13.971,9.112,13.971,12C13.971,14.888,11.63,17.229,8.742,17.229z"
            ></path>
            <circle cx="8.742" cy="12" r="3.5"></circle>
          </svg>
          <svg
            viewBox="0 0 45.964 45.964"
            v-if="data.media_type === 'CAROUSEL_ALBUM'"
          >
            <path
              d="M32.399,40.565H11.113v1.297c0,2.24,1.838,4.051,4.076,4.051h26.733c2.239,0,4.042-1.811,4.042-4.051V15.13c0-2.237-1.803-4.068-4.042-4.068h-1.415v21.395C40.507,36.904,36.845,40.566,32.399,40.565z"
            ></path>
            <path
              d="M0,4.102l0,28.355c0,2.241,1.814,4.067,4.051,4.067h28.365c2.237,0,4.066-1.826,4.066-4.067l0-28.356c0-2.238-1.828-4.051-4.066-4.051H4.051C1.814,0.05,0,1.862,0,4.102z"
            ></path>
          </svg>
        </a>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import Spinner from "~/components/Spinner.vue";
export default {
  components: { Spinner },
  data() {
    return {
      access_token:
        "IGQVJYNFl1ZAVFxM25qOU93anZANVlJWLS1iRkN0WnRYcE9nb19QXzlNQ2JoRGMzNEhGZAFRXZAzFSUHhYenA2RFFLaVN0bUpMRzhERUhyOUhnNGljVWExOGZAtaldvanE3a05aMWVaMGtR",
      user_id: "17841401227840626",
      fields:
        "caption,id,media_type,media_url,permalink,thumbnail_url,timestamp",
      posts: null
    };
  },
  async mounted() {
    try {
      let { data } = await this.$axios.$get(
        "https://graph.instagram.com/" +
          this.user_id +
          "/media/?fields=" +
          this.fields +
          "&access_token=" +
          this.access_token
      );
      this.posts = data.slice(0, 6);
    } catch (e) {
      this.$store.commit("showNotify", {
        code: e.response.data.error.code,
        message: e.response.data.error.message
      });
    }
  }
};
</script>

<style>
.instagram {
  flex: 0 0 100%;
  max-width: 100%;
}
.instagram-feed a:hover img {
  transition: filter 0.7s;
  filter: grayscale(1);
}
.instagram-feed svg {
  position: absolute;
  top: 15px;
  right: 15px;
  display: block;
  width: 24px;
  height: 24px;
  fill: rgba(255, 255, 255, 0.8);
}
</style>
