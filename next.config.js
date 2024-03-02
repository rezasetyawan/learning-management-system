/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: process.env.SUPABASE_URL,
            port:'',
            pathname: '/storage/v1/object/public/**'

        }]
    },
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://learningspaceapi-rezasetyawan.vercel.app/:path*',
          },
        ]
    },
}

module.exports = nextConfig
