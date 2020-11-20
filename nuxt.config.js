module.exports = {
  /*
   ** Headers of the page
   */
  target: "static",
  head: {
    title: "Empress Wear",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "Магазин женской и мужской одежды Елизаветы Туктамышыевой, чемпионкой мира по фигурному катанию."
      },
      { hid: "og:site_name", property: "og:site_name", content: "EmpressWear" },
      { hid: "og:type", property: "og:type", content: "website" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
      }
    ],
    link: [
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      {
        rel: "stylesheet",
        href:
          "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
      }
    ]
  },
  /*
   ** Customize the progress bar color
   */
  loading: { color: "#ec3132" },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** Run ESLint on save
     */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: "pre",
          test: /\.(js|vue)$/,
          loader: "eslint-loader",
          exclude: /(node_modules)/
        });
      }
    }
  },
  buildModules: ["@nuxtjs/pwa", "@nuxtjs/google-analytics"],
  modules: ["@nuxtjs/axios", "nuxt-i18n", "@nuxtjs/pwa", "bootstrap-vue/nuxt"],
  i18n: {
    locales: [
      {
        code: "ru",
        iso: "ru-RU",
        file: "ru-RU.js"
      },
      {
        code: "en",
        iso: "en-US",
        file: "en-US.js"
      }
    ],
    lazy: true,
    langDir: "lang/",
    defaultLocale: "ru",
    vueI18n: {
      fallbackLocale: "ru"
    }
  },
  pwa: {
    theme_color: "#ec3132",
    manifest: {
      name: "Empress Wear",
      description: "Магазин женской и мужской одежды",
      theme_color: "#ec3132",
      start_url: "/",
      icons: [
        {
          src: "/manifest-logo.png",
          type: "image/png",
          sizes: "512x512",
          purpose: "any maskable"
        }
      ]
    }
  },
  axios: {
    baseURL: "https://site.empresswear.ru/"
  },
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: true
  },
  googleAnalytics: {
    id: "G-9L2YCGVG99"
  },
  css: ["~/assets/scss/bootstrap.scss"],
  plugins: [
    "~/plugins/font-awesome",
    "~/plugins/vuelidate",
    { src: "~/plugins/tawk", ssr: false }
  ]
};
