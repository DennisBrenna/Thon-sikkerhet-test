/* eslint-disable import/no-anonymous-default-export */
// next.config.mjs
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const repo = 'Thon-sikkerhet-test' // <-- bytt dette

export default {
  basePath: isProd ? `/${repo}` : '',
  assetPrefix: isProd ? `/${repo}/` : '',
  images: { unoptimized: true }, // nødvendig for export + GitHub Pages
  trailingSlash: true,          // anbefalt for GitHub Pages
  eslint: { ignoreDuringBuilds: true }
  
}
