<template>
  <b-container>
    <b-row>
      <b-col sm="10" md="8" lg="6" class="mx-auto auth-form">
        <div class="text-center">
          <h2 class="h2">{{ $t("forms.not_password") }}</h2>
        </div>
        <b-form @submit.prevent="forgotPassword">
          <b-input-group>
            <b-form-input
              v-model="username"
              type="text"
              :placeholder="$t('forms.login_email')"
              :state="loginState"
            ></b-form-input>
            <b-input-group-append>
              <b-button type="submit" variant="primary">
                {{ $t("forms.reset_password") }}
              </b-button>
            </b-input-group-append>
            <b-form-invalid-feedback :state="loginState"
              >{{ $t("validation.empty_text") }}
            </b-form-invalid-feedback>
            <b-form-text>
              {{ $t("forms.reset_password_text") }}
            </b-form-text>
          </b-input-group>
        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  head() {
    return {
      title: this.$t("forms.not_password"),
      titleTemplate: "%s - " + this.$t("links.site_name")
    };
  },
  data() {
    return {
      username: "",
      loginState: null
    };
  },
  methods: {
    async forgotPassword() {
      this.loginState = null;
      if (this.username.length == 0) {
        this.loginState = false;
      } else {
        await this.$store.dispatch("forgotPassword", {
          user_login: this.username
        });
      }
    }
  }
};
</script>

<style></style>
