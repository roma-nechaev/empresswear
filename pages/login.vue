<template>
  <b-container>
    <b-row>
      <b-col sm="8" lg="4" class="mx-auto auth-form">
        <div class="text-center">
          <h2 class="h2">{{ $t("forms.login") }}</h2>
          <nuxt-link :to="localePath('/register')" class="text-primary">
            {{ $t("forms.not_register") }}
          </nuxt-link>
        </div>
        <b-form @submit.prevent="login">
          <b-form-group>
            <b-form-input
              v-model="username"
              type="text"
              @blur="loginValidate"
              :state="loginState"
              :placeholder="$t('forms.username')"
            ></b-form-input>
            <b-form-invalid-feedback :state="loginState">
              {{ invalidLogin }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <b-form-input
              v-model="password"
              type="password"
              :state="passwordState"
              @blur="passwordValidate"
              :placeholder="$t('forms.password')"
            ></b-form-input>
            <b-form-invalid-feedback :state="passwordState"
              >{{ invalidPassword }}
            </b-form-invalid-feedback>
            <b-form-text>
              <nuxt-link
                :to="localePath('/forgot-password')"
                class="text-muted"
              >
                {{ $t("forms.not_password") }}
              </nuxt-link>
            </b-form-text>
          </b-form-group>
          <div class="text-center">
            <b-button type="submit" variant="primary">{{
              $t("forms.login_btn")
            }}</b-button>
          </div>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  head() {
    return {
      title: this.$t("forms.login"),
      titleTemplate: "%s - " + this.$t("links.site_name")
    };
  },
  data() {
    return {
      username: "",
      password: "",
      loginState: null,
      passwordState: null,
      invalidLogin: "",
      invalidPassword: ""
    };
  },
  methods: {
    async login() {
      if (this.loginState === null && this.passwordState === null) {
        await this.$store.dispatch("login", {
          username: this.username,
          password: this.password
        });
      }
    },

    loginValidate() {
      if (this.username.length == 0) {
        this.invalidLogin = this.$t("validation.empty_text");
        this.loginState = false;
      } else {
        this.loginState = null;
        this.invalidLogin = "";
      }
    },
    passwordValidate() {
      if (this.password.length < 8) {
        this.invalidPassword = this.$t("validation.empty_password");
        this.passwordState = false;
      } else {
        this.passwordState = null;
        this.invalidPassword = "";
      }
    }
  }
};
</script>

<style>
.auth-form .text-center .btn-primary {
  padding: 0.625rem 2.25rem;
  margin-bottom: 1.25rem;
}
.auth-form .text-primary {
  display: inline-block;
  font-size: 0.875rem;
  margin-bottom: 1.25rem;
}
</style>
