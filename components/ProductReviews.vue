<template>
  <div class="reviews">
    <b-media no-body v-if="$store.state.user">
      <b-media-aside>
        <b-img class="avatar" :src="$store.state.user.avatar_urls[96]" />
      </b-media-aside>
      <b-media-body class="ml-3">
        <b-form @submit.prevent="onSubmit">
          <b-form-group>
            <b-form-rating
              v-model="rating"
              variant="primary"
              inline
            ></b-form-rating>
            <b-form-invalid-feedback :state="ratingState">{{
              $t("validation.rate")
            }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :label="$t('forms.message')"
            label-sr-only
            label-for="input-1"
          >
            <b-form-textarea
              id="input-1"
              v-model="reviewText"
              :state="textState"
            />
            <b-form-invalid-feedback :state="textState">{{
              $t("validation.review")
            }}</b-form-invalid-feedback>
          </b-form-group>
          <b-button type="submit" variant="primary">{{
            $t("forms.send")
          }}</b-button>
        </b-form>
      </b-media-body>
    </b-media>
    <b-media no-body v-else>
      <b-media-body class="ml-3">
        <b-form @submit.prevent="onSubmit">
          <b-row>
            <b-col lg="6">
              <b-form-group
                :label="$t('forms.your_name')"
                label-sr-only
                label-for="input-2"
              >
                <b-form-input
                  id="input-2"
                  v-model="username"
                  :placeholder="$t('forms.your_name')"
                ></b-form-input>
              </b-form-group>
            </b-col>
            <b-col lg="6">
              <b-form-group
                :label="$t('forms.enter_email')"
                label-sr-only
                label-for="input-3"
              >
                <b-form-input
                  id="input-3"
                  v-model="email"
                  type="email"
                  :placeholder="$t('forms.enter_email')"
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <b-form-group>
            <b-form-rating
              v-model="rating"
              variant="primary"
              inline
            ></b-form-rating>
            <b-form-invalid-feedback :state="ratingState">{{
              $t("validation.rate")
            }}</b-form-invalid-feedback>
          </b-form-group>
          <b-form-group
            :label="$t('forms.message')"
            label-sr-only
            label-for="input-4"
          >
            <b-form-textarea
              id="input-4"
              v-model="reviewText"
              :state="textState"
            />
            <b-form-invalid-feedback :state="textState">{{
              $t("validation.review")
            }}</b-form-invalid-feedback>
          </b-form-group>
          <b-button type="submit" variant="primary">{{
            $t("forms.send")
          }}</b-button>
        </b-form>
      </b-media-body>
    </b-media>
    <b-pagination
      v-if="reviewsHeaders.total > 10"
      align="center"
      v-model="currentPage"
      :total-rows="reviewsHeaders.total"
      per-page="10"
    ></b-pagination>
    <transition-group name="fade" tag="div">
      <b-media no-body v-for="review in reviews" :key="review.id">
        <b-media-aside>
          <b-img :src="review.reviewer_avatar_urls[96]" class="avatar" />
        </b-media-aside>
        <b-media-body class="ml-3">
          <time class="float-right">{{ timestamp(review.date_created) }}</time>
          <h5 class="media-heading">{{ review.reviewer }}</h5>
          <div class="rating">
            <b-form-rating
              v-model="review.rating"
              variant="primary"
              inline
              readonly
            ></b-form-rating>
          </div>
          <p v-html="review.review"></p>
        </b-media-body>
      </b-media>
    </transition-group>
  </div>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";

export default {
  props: {
    reviews: {
      type: Array,
      reqired: true
    },
    productId: {
      type: Number,
      reqired: true
    },
    reviewsHeaders: {
      reqired: true
    }
  },
  data() {
    return {
      currentPage: 1,
      rating: 0,
      username: "",
      email: "",
      ratingState: null,
      reviewText: "",
      textState: null
    };
  },
  computed: {
    ...mapGetters({
      user: "getUser",
      customer: "extendShop/getCustomer"
    })
  },
  watch: {
    currentPage() {
      this.$store.dispatch("shop/ProductReviews", {
        id: this.productId,
        page: this.currentPage
      });
    }
  },
  methods: {
    timestamp(time) {
      moment.locale(this.$i18n.locale);
      return moment(time).calendar();
    },
    async onSubmit() {
      this.reviewValidate();
      this.ratingValidate();
      if (this.textState === null && this.ratingState === null) {
        if (this.user) {
          await this.$store.dispatch("shop/createReview", {
            product_id: this.productId,
            reviewer: this.user.name,
            reviewer_email: this.customer.email,
            rating: this.rating,
            review: this.reviewText
          });
        } else {
          await this.$store.dispatch("shop/createReview", {
            product_id: this.productId,
            reviewer: this.username,
            reviewer_email: this.email,
            rating: this.rating,
            review: this.reviewText
          });
        }

        if (this.currentPage === 1)
          await this.$store.dispatch("shop/getReviews", {
            id: this.productId,
            page: this.currentPage
          });
        this.username = "";
        this.email = "";
        this.rating = 0;
        this.reviewText = "";
      }
    },
    reviewValidate() {
      if (this.reviewText.length < 1) {
        this.textState = false;
      } else {
        this.textState = null;
      }
    },
    ratingValidate() {
      if (this.rating === 0) {
        this.ratingState = false;
      } else {
        this.ratingState = null;
      }
    }
  }
};
</script>

<style lang="scss">
.reviews .media {
  margin-bottom: 2rem;
  transition: all 0.7s;
  .avatar {
    margin-top: -1rem;
    margin-right: -2rem;
    position: relative;
    z-index: 1;
    width: 64px;
    height: 64px;
    border: 4px solid #fff;
    border-radius: 50%;
    transition: all 0.15s ease;
    &:hover {
      transform: scale(1.1);
    }
  }
  .media-body {
    border-radius: 0.3rem;
    border-top-left-radius: 0;
    position: relative;
    background-color: #f1f1f1;
    padding: 1rem 1.25rem 1rem 2.5rem;
    .media-heading {
      color: #32325d;
      display: inline-block;
      font-weight: 600;
      margin-bottom: 0;
    }
    time {
      color: #6c757d;
      font-size: 0.9em;
      font-weight: 600;
    }
    p {
      font-weight: 300;
      line-height: 1.7em;
      margin-bottom: 0;
    }
  }
  textarea.form-control {
    min-height: 110px;
  }
}
.reviews .pagination {
  margin-bottom: 2rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.7s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-move {
  transition: transform 1s;
}
</style>
