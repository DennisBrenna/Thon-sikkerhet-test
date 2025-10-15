// next.config.mjs
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const isVercel = !!process.env.VERCEL   // Vercel setter denne
const repo = 'Thon-sikkerhet-test'      // kun for GitHub Pages

const forGhPages = isProd && !isVercel   // prod + ikke Vercel => GitHub Pages

export default {
  // Kun for GitHub Pages:
  basePath: forGhPages ? `/${repo}` : '',
  assetPrefix: forGhPages ? `/${repo}/` : '',

  // Bilde-optimering: kun unoptimized på GH Pages
  images: { unoptimized: forGhPages },

  // Trailing slash: nyttig på GH Pages, unngås på Vercel
  trailingSlash: forGhPages,

  eslint: { ignoreDuringBuilds: true },
}
