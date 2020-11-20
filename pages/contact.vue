<template>
  <b-container class="contact">
    <b-row>
      <b-col lg="12">
        <h2 class="h2">{{ $t("links.contact") }}</h2>
        <nav aria-label="breadcrumb">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <nuxt-link :to="localePath('/contact')">{{
                $t("links.home")
              }}</nuxt-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">
              {{ $t("links.contact") }}
            </li>
          </ol>
        </nav>
      </b-col>
      <b-col lg="4">
        <h3 class="h3">{{ $t("about.store") }}</h3>
        <div class="info-contact">
          <font-awesome-icon :icon="['fas', 'phone-alt']" />
          <a href="tel:+89657933637" rel="noreferrer"> +7 (965) 793-36-37</a>
        </div>
        <div class="info-contact">
          <font-awesome-icon :icon="['fas', 'envelope']" />
          <a href="mailto:info@empresswear.ru" rel="noreferrer"
            >info@empresswear.ru</a
          >
          <span class="text-muted">{{ $t("about.question") }}</span>
        </div>
        <div class="info-contact">
          <b-button
            variant="success"
            href="https://api.whatsapp.com/send?phone=79657933637&text=Здравствуйте"
            target="_blank"
            rel="noreferrer"
          >
            <font-awesome-icon :icon="['fab', 'whatsapp']" />
            {{ $t("about.question") }}
          </b-button>

          <a
            href="https://www.instagram.com/empress_wear_by_tuktik/"
            target="_blank"
            rel="noreferrer"
            class="insta-text"
          >
            <b-img
              src="~assets/img/insta-photo.png"
              alt="empress_wear_by_tuktik"
            />
            empress_wear_by_tuktik
          </a>
        </div>
        <span class="text-muted">ИНН 123456789123</span>
        <span class="text-muted">ОГРН 123456789123</span>
      </b-col>
      <b-col lg="8">
        <b-form @submit.prevent="feedback()">
          <b-row>
            <b-form-group class="col-lg-6">
              <b-form-input
                :placeholder="$t('checkout.first_name')"
                v-model="$v.first_name.$model"
                type="text"
                :state="validateState('first_name')"
              >
              </b-form-input>
              <b-form-invalid-feedback>
                {{ $t("validation.empty_text") }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group class="col-lg-6">
              <b-form-input
                placeholder="Email"
                v-model="$v.email.$model"
                :state="validateState('email')"
                type="email"
              ></b-form-input>
              <b-form-invalid-feedback>
                {{ $t("validation.invalid_email") }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group class="col-lg-12">
              <b-form-textarea
                :placeholder="$t('forms.message')"
                v-model="$v.message.$model"
                :state="validateState('message')"
                rows="3"
              ></b-form-textarea>
              <b-form-invalid-feedback>
                {{ $t("validation.message") }}
              </b-form-invalid-feedback>
            </b-form-group>
            <b-form-group class="col-lg-12">
              <b-button type="submit" variant="primary">
                {{ $t("forms.send") }}
              </b-button>
            </b-form-group>
          </b-row>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, email } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  head() {
    return {
      title: this.$t("links.contact"),
      titleTemplate: "%s - " + this.$t("links.site_name")
    };
  },
  data() {
    return {
      first_name: "",
      email: "",
      message: ""
    };
  },
  validations: {
    first_name: {
      required
    },
    email: {
      required,
      email
    },
    message: {
      required,
      minLength: minLength(10)
    }
  },
  methods: {
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
    async feedback() {
      this.$v.$touch();
      if (this.$v.$anyError) {
        return;
      }
      this.$store.dispatch("contactForm7", {
        username: this.first_name,
        email: this.email,
        message: this.message
      });
      this.first_name = null;
      this.email = null;
      this.message = null;
      this.$nextTick(() => {
        this.$v.$reset();
      });
    }
  }
};
</script>

<style lang="scss">
.contact {
  margin-bottom: 50px;
  .text-muted {
    font-size: 0.75rem;
    display: block;
  }
  textarea.form-control {
    min-height: 130px;
    max-height: 130px;
  }
  .info-contact {
    font-size: 1.25rem;
    color: #191919;
    margin-bottom: 1.25rem;
    a {
      color: #191919;
    }
    svg {
      margin-right: 1.25rem;
      width: 1em;
    }
    .text-muted {
      margin: 45px 0 0 45px;
      font-size: 0.875rem;
    }
    .btn-success {
      align-items: center;
      display: flex;
      background-color: #28a71a;
      border-color: #28a71a;
      font-weight: 400;
      font-size: 0.75rem;
      margin-bottom: 35px;
      color: #fff;
      display: inline-block !important;
      &:hover {
        background-color: #31d020;
        border-color: #31d020;
      }
      svg {
        font-size: 1.25rem;
      }
    }
    .insta-text {
      font-size: 1rem;
      margin-bottom: 60px;
      display: block;
      img {
        margin-right: 1.25rem;
      }
    }
  }
}
</style>
