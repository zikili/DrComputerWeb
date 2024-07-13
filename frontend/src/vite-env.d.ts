interface ImportMetaEnv {
    VITE_API_BASE_URL: string;
    // Define other environment variables here as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }