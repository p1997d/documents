import client from "./api/modules/mongodb";

export default {
  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'documents',
    htmlAttrs: {
      lang: 'ru'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.0/dist/css/bootstrap.min.css', rel: 'stylesheet', integrity: 'sha384-KyZXEAg3QhqLMpG8r+8fhAXLRk2vvoC2f3B09zVXn8CA5QIVfZOJ3BCsw2P0p/We', crossorigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.5.0/font/bootstrap-icons.css' },
      { href: 'https://fonts.googleapis.com/icon?family=Material+Icons', rel: 'stylesheet' }
    ],
    script: [
      { src: '../ckeditor5/build/ckeditor.js' },
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@/assets/css/style.css',
    '@/assets/css/documents.css'
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
      '~/plugins/firebase.js',
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxt/http',
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
  ],
  http: {
    proxy: true
  },
  axios: {
    proxy: true
  },
  proxy: {
    '/api/': 'https://podobie-google-documentov.herokuapp.com/',
    '/api2/': 'https://podobie-google-documentov.herokuapp.com/',
  },
  auth: {
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
        },
        user: {
          property: 'user',
        },
        endpoints: {
          login: { url: '/api/auth/login', method: 'post', propertyName: 'token' },
          logout: { url: '/api/auth/logout', method: 'post' },
          registration: { url: '/api/auth/logout', method: 'post' },
          user: { url: '/api/auth/user', method: 'get', propertyName: 'user' }
        }
      }
    }
  },
  serverMiddleware: {
    '/api': '~/api'
  },
  loading: {
    color: '#0D6EFD'
  },
  babel: { compact: false }
}
