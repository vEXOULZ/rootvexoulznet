/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the public archive API; see .env.example. */
  readonly VITE_ARCHIVE_API?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** The commit this build comes from (vite.config.ts). */
declare const __COMMIT__: string
