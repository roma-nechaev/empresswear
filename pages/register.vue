<template>
  <b-container>
    <b-row>
      <b-col sm="8" lg="4" class="mx-auto auth-form">
        <div class="text-center">
          <h2 class="h2">{{ $t("forms.register") }}</h2>
          <nuxt-link :to="localePath('/login')" class="text-primary">
            {{ $t("forms.not_login") }}
          </nuxt-link>
        </div>
        <b-form @submit.prevent="regiser">
          <b-form-group>
            <b-form-input
              v-model="username"
              type="text"
              :placeholder="$t('forms.username')"
              @blur="loginValidate()"
              :state="loginState"
            ></b-form-input>
            <b-form-invalid-feedback :state="loginState">
              {{ invalidLogin }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <b-form-input
              v-model="email"
              type="email"
              placeholder="Email"
              :state="emailState"
              @blur="emailValidate()"
            ></b-form-input>
            <b-form-invalid-feedback :state="emailState">
              {{ invalidEmail }}
            </b-form-invalid-feedback>
          </b-form-group>
          <b-form-group>
            <b-form-input
              v-model="password"
              type="password"
              :placeholder="$t('forms.password')"
              :state="passwordState"
              @blur="passwordValidate()"
            ></b-form-input>
            <b-form-invalid-feedback :state="passwordState"
              >{{ invalidPassword }}
            </b-form-invalid-feedback>
            <b-form-text>
              <nuxt-link
                :to="localePath('/forgot-password')"
                class="text-muted"
              >
                {{ $t("forms.reset_password") }}
              </nuxt-link>
            </b-form-text>
          </b-form-group>
          <div class="text-center">
            <b-button type="submit" variant="primary">{{
              $t("forms.register")
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
      title: this.$t("forms.register"),
      titleTemplate: "%s - " + this.$t("links.site_name")
    };
  },
  data() {
    return {
      username: "",
      email: "",
      password: "",
      loginState: null,
      emailState: null,
      passwordState: null,
      invalidLogin: "",
      invalidEmail: "",
      invalidPassword: ""
    };
  },
  methods: {
    async regiser() {
      this.loginValidate();
      this.emailValidate();
      this.passwordValidate();
      if (
        this.loginState === null &&
        this.emailState === null &&
        this.passwordState === null
      ) {
        await this.$store.dispatch("register", {
          username: this.username,
          email: this.email,
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
    emailValidate() {
      if (this.email.length == 0) {
        this.invalidEmail = this.$t("validation.empty_text");
        this.emailState = false;
      } else if (!this.validEmail(this.email)) {
        this.invalidEmail = this.$t("validation.invalid_email");
        this.emailState = false;
      } else {
        this.emailState = null;
        this.invalidEmail = "";
      }
    },
    validEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
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

<style></style>
