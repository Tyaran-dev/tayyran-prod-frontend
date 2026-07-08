import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  typescript: {
    // ✅ Ignore build errors caused by TypeScript
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.wego.com' },
      { protocol: 'https', hostname: 'api.tbotechnology.in' },
      { protocol: 'https', hostname: 'www.tboholidays.com' },
      { protocol: 'https', hostname: 'qessatravel.com' },
      { protocol: 'https', hostname: 'articles.tayyran.com' },
      { protocol: 'https', hostname: 'secure.gravatar.com' },
    ],
  },

};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);

