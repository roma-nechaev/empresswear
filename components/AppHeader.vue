<template>
  <header class="app-header">
    <div class="top-bar">
      <b-container>
        <b-row align-v="center">
          <a href="tel:+79657933637" rel="noreferrer" class="phone">
            <font-awesome-icon :icon="['fas', 'phone-alt']" />
            +7 (965) 793-36-37
            <span class="text-primary">{{ $t("links.call") }}</span>
          </a>
          <img src="~assets/img/korona.png" class="mx-auto" alt="korona" />
          <b-nav>
            <b-nav-item :to="localePath('/contact')">{{
              $t("links.contact")
            }}</b-nav-item>
            <b-nav-item :to="localePath('/dostavka-i-oplata')">
              {{ $t("links.shipping") }}
            </b-nav-item>
          </b-nav>
          <b-nav class="lang-swicher">
            <b-nav-item @click="switchLocale('ru')">
              <b-img src="~assets/img/rus.png" alt="ru" />
            </b-nav-item>
            <b-nav-item @click="switchLocale('en')">
              <b-img src="~assets/img/eng.png" alt="en" />
            </b-nav-item>
          </b-nav>
        </b-row>
      </b-container>
    </div>
    <b-container>
      <b-row align-v="center">
        <b-navbar toggleable="md" type="light" variant="white" class="w-100">
          <b-navbar-brand :to="localePath('/')">
            <img src="/img/ew-logo.png" width="64" height="54" alt="logo" />
            <span class="sr-only">Empress Wear</span>
          </b-navbar-brand>
          <b-navbar-nav class="top-menu">
            <b-nav-item-dropdown no-caret :text="$t('links.catalog')">
              <b-dropdown-item :to="localePath('/shop')">
                {{ $t("links.all_products") }}</b-dropdown-item
              >
              <b-dropdown-item
                v-for="category in categories"
                :key="category.id"
                :to="localePath('/shop/?categories=' + category.id)"
                >{{ category.name }}</b-dropdown-item
              >
            </b-nav-item-dropdown>
            <b-nav-item :to="localePath('/lookbook')">
              {{ $t("links.lookbook") }}
            </b-nav-item>
            <b-nav-item :to="localePath('/about')">{{
              $t("links.about")
            }}</b-nav-item>
          </b-navbar-nav>
          <search-box />
          <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown v-if="user" no-caret class="user-dropdown">
              <template v-slot:button-content>
                <img src="~assets/img/profile.png" alt="Profile" />
                <span class="sr-only">Profile</span>
              </template>
              <b-dropdown-item :to="localePath('/profile')">
                {{ $t("links.profile") }}
              </b-dropdown-item>
              <b-dropdown-item :to="localePath('/profile')">
                {{ $t("links.orders") }}
              </b-dropdown-item>
              <b-dropdown-item @click="$store.dispatch('deleteUser')">
                {{ $t("links.logout") }}
              </b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item v-else :to="localePath('/login')">
              <img src="~assets/img/profile.png" alt="Profile" />
              <span class="sr-only">Profile</span>
            </b-nav-item>
            <b-nav-item v-b-toggle.shoppingCart>
              <img src="~assets/img/card.png" alt="Card" />
              <span class="sr-only">Card</span>
              <b-badge variant="primary" class="badge-circle">
                {{ totalQuantity }}
              </b-badge>
            </b-nav-item>
          </b-navbar-nav>
          <b-navbar-toggle target="mobile-screen"></b-navbar-toggle>
        </b-navbar>
      </b-row>
    </b-container>
  </header>
</template>

<script>
import SearchBox from "~/components/SearchBox.vue";
import { mapGetters } from "vuex";
export default {
  components: { SearchBox },
  async fetch() {
    await this.$store.dispatch("shop/getCategories");
  },
  computed: {
    ...mapGetters({
      user: "getUser",
      categories: "shop/getCategories"
    }),
    totalQuantity() {
      let total = 0;
      for (let product of this.$store.state.localStore.cart) {
        total += Number(product.quantity);
      }
      return total;
    }
  },
  watch: { "$i18n.locale": "$fetch" },
  methods: {
    switchLocale(lang) {
      this.$router.push(this.switchLocalePath(lang));
      this.$store.commit("locale", lang);
    }
  },
  mounted() {
    if (!this.$store.state.extendShop.customer) {
      this.$store.dispatch("validate");
    }
  }
};
</script>

<style lang="scss">
.top-bar {
  background-color: #f1f1f1;
  font-size: 0.75rem;
  padding: 8px 0;
  .fa-phone-alt {
    margin-right: 10px;
    width: 12px;
  }
  .text-primary {
    font-weight: 700;
    margin-left: 6px;
  }
  a,
  .nav-link {
    color: #191919;
  }
  .nav-link {
    padding: 0 1rem;
  }
  .lang-swicher .nav-link {
    padding: 0 0.5rem;
  }
  .lang-swicher .nav-item + .nav-item .nav-link {
    border-left: 0;
  }
  .nav-item + .nav-item .nav-link {
    border-left: 1px solid #dedede;
  }
}
.navbar {
  padding: 2rem 1rem !important;
  .top-menu .nav-link {
    text-transform: uppercase;
    font-size: 0.8rem;
    font-weight: 500;
    padding-right: 2rem !important;
    padding-left: 2rem !important;
    min-width: 140px;
  }
  .navbar-nav .nav-link {
    position: relative;
    transition: color 0.3s;
    .badge-circle {
      position: absolute;
      right: 0;
      top: -20%;
      border: 3px solid #fff;
      text-align: center;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 26px;
      height: 26px;
      font-size: 0.75rem;
    }
  }
  .user-dropdown .dropdown-menu {
    left: -45px;
  }

  .navbar-toggler {
    border-color: transparent !important;
    .navbar-toggler-icon {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba(236, 49, 50, 1)' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
    }
  }
}
@media screen and (max-width: 576px) {
  .top-bar .phone {
    font-size: 0.6rem;
    span {
      display: block;
    }
  }
}
@media screen and (max-width: 768px) {
  .top-bar {
    .mx-auto,
    .nav {
      display: none;
    }
    .lang-swicher {
      display: flex;
      margin-left: auto;
    }
  }
  .navbar {
    .navbar-brand {
      margin-bottom: 1.25rem;
    }
    .top-menu {
      display: none;
    }
    .input-group {
      order: 12;
    }
  }
  .navbar-expand-md .navbar-nav {
    flex-direction: row;

    .nav-link {
      padding-right: 0.5rem;
      padding-left: 0.5rem;
    }
    .dropdown-menu {
      position: absolute;
    }
  }
}
@media screen and (max-width: 992px) {
  .navbar .top-menu .nav-link {
    font-size: 0.7rem;
    padding: 0.75rem 1rem !important;
    min-width: 100px;
  }
}
</style>
