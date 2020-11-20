<template>
  <div class="about">
    <b-container>
      <b-row>
        <b-col lg="12">
          <h2 class="h2">{{ $t("links.about") }}</h2>
          <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
              <li class="breadcrumb-item">
                <nuxt-link :to="localePath('/')">{{
                  $t("links.home")
                }}</nuxt-link>
              </li>
              <li class="breadcrumb-item active" aria-current="page">
                {{ $t("links.about") }}
              </li>
            </ol>
          </nav>
        </b-col>
        <b-col lg="12">
          <b-card
            overlay
            img-src="/img/about-brand-hero.jpg"
            text-variant="white"
            :img-alt="$t('about.page_name')"
            :title="$t('about.page_name')"
          >
          </b-card>
          <b-row>
            <b-col lg="6">
              <p>{{ $t("about.t1") }}</p>
              <p>{{ $t("about.t2") }}</p>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </b-container>
    <b-container fluid class="instagram text-center">
      <b-row>
        <h3 class="h1 text-center col-12">
          {{ $t("about.follow_me") }}
          <span class="text-primary d-block">{{ $t("about.instagram") }}</span>
        </h3>
        <instagram />
        <b-col cols="12">
          <b-button
            variant="primary"
            size="lg"
            href="https://www.instagram.com/empress_wear_by_tuktik/"
            target="_blank"
            rel="noreferrer"
          >
            {{ $t("about.instagram_btn") }}
          </b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-container>
      <b-col lg="12" class="benefit text-center">
        <b-row>
          <b-col cols="6" md="3">
            <b-img-lazy src="~assets/img/i1.png" :alt="$t('about.quality')" />
            <h4>{{ $t("about.quality") }}</h4>
            <span>{{ $t("about.quality_text") }}</span>
          </b-col>
          <b-col cols="6" md="3">
            <b-img-lazy src="~assets/img/i2.png" :alt="$t('about.style')" />
            <h4>{{ $t("about.style") }}</h4>
            <span>{{ $t("about.style_text") }}</span>
          </b-col>
          <b-col cols="6" md="3">
            <b-img-lazy src="~assets/img/i3.png" :alt="$t('about.comfort')" />
            <h4>{{ $t("about.comfort") }}</h4>
            <span>{{ $t("about.comfort_text") }}</span>
          </b-col>
          <b-col cols="6" md="3">
            <b-img-lazy src="~assets/img/i6.png" :alt="$t('about.brand')" />
            <h4>{{ $t("about.brand") }}</h4>
            <span>{{ $t("about.brand_text") }}</span>
          </b-col>
        </b-row>
      </b-col>
      <section class="benefit-box">
        <b-row>
          <b-col lg="8"
            ><b-img-lazy src="/img/benefit-box-2.jpg" fluid alt="benefit-box"
          /></b-col>
          <b-col lg="4" class="mb-50">
            <p>
              {{ $t("about.t3") }}
            </p>
            <p>
              {{ $t("about.t4") }}
            </p>
            <div class="info-contact">
              <font-awesome-icon :icon="['fas', 'phone-alt']" />
              <a href="tel:+79657933637" rel="noreferrer">
                +7 (965) 793-36-37</a
              >
            </div>
            <div class="info-contact">
              <font-awesome-icon :icon="['fas', 'envelope']" />
              <a href="mailto:info@empresswear.ru" rel="noreferrer"
                >info@empresswear.ru</a
              >
            </div>
            <div class="info-contact">
              <font-awesome-icon :icon="['fab', 'instagram']" />
              <a
                href="https://www.instagram.com/empress_wear_by_tuktik/"
                target="_blank"
                rel="noreferrer"
                >empress_wear_by_tuktik
              </a>
            </div>
            <b-button
              href="https://www.instagram.com/empress_wear_by_tuktik/"
              target="_blank"
              rel="noreferrer"
              variant="primary"
            >
              <font-awesome-icon :icon="['fab', 'instagram']" />
              <span class="sr-only">instagram</span>
            </b-button>
          </b-col>
        </b-row>
      </section>
    </b-container>
  </div>
</template>

<script>
import Instagram from "~/components/Instagram.vue";
export default {
  loading: false,
  head() {
    return {
      title: this.$t("links.about"),
      titleTemplate: "%s - " + this.$t("links.site_name")
    };
  },
  components: { Instagram }
};
</script>

<style lang="scss">
.about {
  .card {
    margin-bottom: 50px;
    .card-title {
      position: absolute;
      left: 70px;
      bottom: 70px;
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 55px;
      max-width: 600px;
    }
  }
  p {
    font-size: 0.875rem;
    color: #6a6a6a;
  }
  .instagram {
    margin-bottom: 50px;
    .h1 {
      color: #272727;
      font-size: 3rem;
      font-weight: 700;
      line-height: 1;
      margin-top: 50px;
      margin-bottom: 65px;
    }
    .btn-primary {
      margin-top: 50px;
    }
  }
  .benefit {
    img {
      display: block;
      margin: 0 auto 1.5rem;
    }
    h4 {
      color: #272727;
      font-size: 1.12rem;
      font-weight: 400;
      text-transform: uppercase;
    }
    span {
      display: block;
      color: #6a6a6a;
      font-size: 0.85rem;
      font-weight: 400;
      line-height: 1.25rem;
      max-width: 225px;
      display: block;
      margin: 1.5rem auto 50px;
    }
  }
  .benefit-box {
    font-size: 0.875rem;
    color: #6a6a6a;
    svg {
      width: 16px;
    }
    img,
    .mb-50 {
      margin-bottom: 50px;
    }
    .info-contact {
      margin-bottom: 1rem;
      a {
        font-size: 0.875rem;
        color: #6a6a6a;
      }
    }
    .btn-primary {
      min-width: 45px;
    }
  }
}
@media screen and (max-width: 576px) {
  .about .instagram .h1 {
    font-size: 1.75rem;
  }
}
@media screen and (max-width: 768px) {
  .about {
    .card {
      .card-title {
        font-size: 1.5rem;
        line-height: 24px;
        left: 30px;
        bottom: 30px;
      }
    }
  }
}
</style>
