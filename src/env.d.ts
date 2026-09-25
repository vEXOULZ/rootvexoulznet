/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the public archive API; see .env.example. */
  readonly VITE_ARCHIVE_API?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
