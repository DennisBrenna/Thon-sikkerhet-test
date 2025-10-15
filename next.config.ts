
/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const isVercel = !!process.env.VERCEL   
const repo = 'Thon-sikkerhet-test'     

const forGhPages = isProd && !isVercel   

export default {

  // Bilde-optimering: kun unoptimized på GH Pages
  images: { unoptimized: forGhPages },

  // Trailing slash: nyttig på GH Pages, unngås på Vercel
  trailingSlash: forGhPages,

  eslint: { ignoreDuringBuilds: true },
}
