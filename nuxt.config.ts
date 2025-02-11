import { theme } from "#tailwind-config";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  features: {
    devLogs: false,
  },
  ssr: false,
  css: ["~/assets/css/main.css"],
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxt/ui",
  ], // Removí @prisma/nuxt ya que manejaremos Prisma manualmente
  components: {
    path: "~/components",
    pathPrefix: false,
    extensions: [".vue"],
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "/api",
    },
  },
  app: {
    head: {
      link: [
        {
          rel: "preload",
          href: "/_nuxt/@nuxt/ui-templates/dist/templates.min.css",
          as: "style",
        },
      ],
    },
  },
  colorMode: {
    preference: "system",
    fallback: "light",
  },
  vite: {
    build: {
      cssMinify: "esbuild",
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === "production",
          drop_debugger: process.env.NODE_ENV === "production",
        },
        format: {
          comments: false,
        },
      },
    },
    optimizeDeps: {
      include: ["vue", "vue-router", "@google/generative-ai", "jwt-decode"],
    },
    css: {
      preprocessorMaxWorkers: true,
    },
  },
  experimental: {
    asyncEntry: true,
    componentIslands: true,
    viewTransition: true,
    renderJsonPayloads: false,
    clientFallback: true,
  },
  nitro: {
    storage: {
      data: {
        driver: 'vercelKV'
      }
    },
    compressPublicAssets: {
      gzip: true,
      brotli: true,
    },
    prerender: {
      crawlLinks: true,
      routes: ["/"],
    },
    moduleSideEffects: [],
    minify: true,
    routeRules: {
      "/api/**": {
        cors: true,
        headers: {
          "Access-Control-Allow-Methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Headers": "*",
        },
      },
      "/api/news": { swr: 1800 },
    },
    // Añadido para manejar mejor ESM
    esbuild: {
      options: {
        target: 'esnext'
      }
    }
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
  build: {
    transpile: [
      "@google/generative-ai", 
      "cookie",
      "@prisma/client", // Añadido para manejar Prisma
      "bcryptjs",       // Añadido para manejar bcryptjs
      "jsonwebtoken"    // Añadido para manejar jwt
    ]
  },
  tailwindcss: {
    configPath: "~/tailwind.config.ts",
    exposeConfig: false,
    viewer: false,
  },
});
