/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [{
            protocol: 'https',
            hostname: process.env.SUPABASE_URL,
            port:'',
            pathname: '/storage/v1/object/public/**'

        }]
    }
}

module.exports = nextConfig
