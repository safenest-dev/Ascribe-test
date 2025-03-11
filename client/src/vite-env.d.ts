/// <reference types="vite/client" />

interface ImportMetaEnv {
    VITE_API_URL: string;  // example environment variable
    // Add other environment variables as needed
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  