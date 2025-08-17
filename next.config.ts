import createMDX from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    mdxRs: true,
  },
  pageExtensions: ['js', 'jsx', 'mdx', 'ts', 'tsx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https' as const,
        hostname: '**',
      },
    ],
  },
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [
      require('remark-gfm'),
    ],
    rehypePlugins: [
      require('rehype-slug'),
      [require('rehype-autolink-headings'), { behavior: 'wrap' }],
      require('rehype-highlight'),
    ],
  },
});

export default withMDX(nextConfig);