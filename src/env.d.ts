/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** vexoulz-auth's URL (the shared sign-in); empty turns it off. See .env.example. */
  readonly VITE_AUTH_BASE?: string
  /** Base URL of the public archive API; see .env.example. */
  readonly VITE_ARCHIVE_API?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

/** The commit this build comes from (vite.config.ts). */
declare const __COMMIT__: string
