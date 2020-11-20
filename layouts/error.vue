<template>
  <div class="error-page">
    <b-col>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="90"
        height="90"
        fill="#DBE1EC"
        viewBox="0 0 48 48"
      >
        <path
          d="M22 30h4v4h-4zm0-16h4v12h-4zm1.99-10C12.94 4 4 12.95 4 24s8.94 20 19.99 20S44 35.05 44 24 35.04 4 23.99 4zM24 40c-8.84 0-16-7.16-16-16S15.16 8 24 8s16 7.16 16 16-7.16 16-16 16z"
        ></path>
      </svg>
      <h1 v-if="error.statusCode === 404" class="title">
        {{ $t("ui.error_404") }}
      </h1>
      <h1 v-else>An error occurred</h1>
      <NuxtLink to="/" class="description">{{ $t("ui.go_home") }}</NuxtLink>
    </b-col>
  </div>
</template>

<script>
export default {
  props: ["error"],
  layout: "default"
};
</script>
<style scoped>
.error-page {
  text-align: center;
  color: #47494e;
  text-align: center;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.error-page .title {
  font-size: 1.5rem;
  margin-top: 15px;
  color: #47494e;
  margin-bottom: 8px;
}
.error-page .description {
  color: #7f828b;
  line-height: 21px;
  margin-bottom: 10px;
}
.error-page a {
  color: #7f828b !important;
}
</style>
