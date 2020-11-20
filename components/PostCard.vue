<template>
  <b-card
    overlay
    :img-src="item.src"
    :img-alt="item.name"
    text-variant="white"
    class="card-post"
  >
    <b-card-body>
      <b-card-title>
        <nuxt-link :to="item.slug" class="card-link stretched-link">{{
          item.name
        }}</nuxt-link>
      </b-card-title>
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
.card-post {
  border: 0;
  border-radius: 0;
  .card-img {
    border-radius: 0;
  }
  .card-img-overlay {
    align-items: flex-end;
    display: flex;
    text-align: center;
    text-transform: uppercase;
    font-size: 1.5rem;
    transition: 0.5s;
    a {
      color: #fff;
      padding: 1rem 0;
      display: inline-flex;
    }
  }
  .card-img-overlay:hover {
    background: rgba(0, 0, 0, 0.6);
    a {
      border-top: 1px solid #ec3132;
      border-bottom: 1px solid #ec3132;
    }
  }
}
</style>
