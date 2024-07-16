interface ImportMetaEnv {
    VITE_API_BASE_URL: string;
    VITE_NEWS_API_KEY: string;
    // Define other environment variables here as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }