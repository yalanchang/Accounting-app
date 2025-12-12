export default defineNuxtConfig({
  runtimeConfig: {
    db: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    }
  },

  imports: {
      dirs: [
        '~/composables',
        '~/composables/**'
      ]
    },

  css: ['~//main.css'],
  modules: ['@nuxtjs/tailwindcss']
})