// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindTypography from "@tailwindcss/typography";
import vsharp from "vite-plugin-vsharp";

export default defineNuxtConfig({
  debug: true,
  build: {
    transpile: ["trpc-nuxt"]
  },
  typescript: {
    shim: false
  },
  modules: [
    "@vueuse/nuxt",
    "@nuxtjs/supabase",
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss"
  ],
  nitro: {
    prerender: {
      routes: ["/landing"]
    }
  },
  vite: {
    plugins: [vsharp()]
  },
  imports: {
    dirs: ["./stores"]
  },
  // runtimeConfig:{
  //   stripeSecretKey: process.env.STRIPE_SECRET_KEY,
  //   stripeEndpointSecret: process.env.STRIPE_ENDPOINT_SECRET,
  //   stripeCallbackUrl: process.env.STRIPE_CALLBACK_URL,
  //   subscriptionGraceDays: 3,
  //   initialPlanName: '3 Month Trial',
  //   initialPlanActiveMonths: 3,
  //   public: {
  //     debugMode: true,
  //   }
  // },
  runtimeConfig: {
    stripeSecret: "",
    stripeWebhookSecret: "",
    public: {
      stripeKey: ""
    }
  },

  tailwindcss: {
    // @ts-ignore
    config: {
      plugins: [tailwindTypography]
    }
  }
});
