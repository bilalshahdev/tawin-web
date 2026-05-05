import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                port: "",
                pathname: "/**",
            },
           {
                protocol: "http",
                hostname: "104.128.190.131",
                port: "3520", 
                pathname: "/**",
            },
           {
                protocol: "http",
                hostname: "localhost",
                port: "3520", 
                pathname: "/**",
            },
        ],
    },
};

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
export default withNextIntl(nextConfig);