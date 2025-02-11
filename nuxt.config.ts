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
  ],
  components: {
    path: "~/components",
    pathPrefix: false,
    extensions: [".vue"],
    global: true,
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    jwtSecret: process.env.JWT_SECRET,
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
    buildAssetsDir: "/_nuxt/", // Para mejor compatibilidad con Vercel
  },
  colorMode: {
    preference: "system",
    fallback: "light",
    classSuffix: "",
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
      include: [
        "vue", 
        "vue-router", 
        "@google/generative-ai", 
        "jwt-decode",
        "@prisma/client/runtime",
      ],
      exclude: ["@prisma/client"],
    },
    css: {
      preprocessorMaxWorkers: true,
    },
    ssr: {
      noExternal: ["@prisma/client"],
    },
  },
  experimental: {
    asyncEntry: true,
    componentIslands: true,
    viewTransition: true,
    renderJsonPayloads: false,
    clientFallback: true,
    payloadExtraction: false,
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
    esbuild: {
      options: {
        target: 'esnext',
        platform: 'node',
      }
    },
    externals: {
      inline: ["@prisma/client", "@prisma/client/runtime"],
    },
  },
  typescript: {
    strict: true,
    typeCheck: true,
    shim: false,
  },
  build: {
    transpile: [
      "@google/generative-ai", 
      "cookie",
      "@prisma/client",
      "bcryptjs",
      "jsonwebtoken",
      "@prisma/client/runtime",
    ],
  },
  tailwindcss: {
    configPath: "~/tailwind.config.ts",
    exposeConfig: false,
    viewer: false,
    config: {
      darkMode: "class",
    },
  },
  hooks: {
    'build:before': () => {
      process.env.PRISMA_SKIP_POSTINSTALL = 'true'
    },
  },
});
