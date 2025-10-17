/** @type {import('next').NextConfig} */
const defaultBasePath = '/afco-kpi'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? defaultBasePath
const assetPrefixEnv = process.env.NEXT_PUBLIC_ASSET_PREFIX

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: assetPrefixEnv ?? (basePath || undefined),
  trailingSlash: true,
  reactStrictMode: true,
}

export default nextConfig
