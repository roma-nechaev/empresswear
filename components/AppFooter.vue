<template>
  <footer class="app-footer">
    <b-container>
      <b-row>
        <b-col md="4">
          <p>{{ $t("links.copyright") }}</p>
        </b-col>
        <b-col md="8">
          <b-nav>
            <b-nav-item :to="localePath('/dostavka-i-oplata')">{{
              $t("links.terms_shipping")
            }}</b-nav-item>
            <b-nav-item>{{ $t("links.terms_return") }}</b-nav-item>
            <b-nav-item :to="localePath('/privacy-policy')">
              {{ $t("links.privacy_policy") }}
            </b-nav-item>
          </b-nav>
        </b-col>
      </b-row>
    </b-container>
  </footer>
</template>
<style lang="scss">
.app-footer {
  background: #232323;
  padding: 1rem 0;
  color: #9c9c9c;
  font-size: 0.8rem;
  p {
    margin-bottom: 0;
  }
  .nav-link {
    padding: 0 1.25rem;
    color: #9c9c9c;
  }
  .nav-link:hover {
    color: #ced4da;
  }
}
@media screen and (max-width: 768px) {
  .app-footer {
    text-align: center;
    .col-md-8 {
      order: 1;
    }
    .col-md-4 {
      order: 2;
    }
    .nav {
      display: block;
      .nav-link {
        padding: 0.9rem 0;
        display: inline-block;
      }
    }
  }
}
</style>
