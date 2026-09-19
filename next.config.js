/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /**
   * The standalone Diligence demo is now step 3 of the Compliance suite.
   *
   * Declared here rather than in vercel.json so the redirect also runs under
   * `next dev` and can be verified locally. Next applies redirects before
   * filesystem routing, so these shadow app/diligence/ while that folder is
   * still present as a safety net.
   */
  async redirects() {
    return [
      {
        source: '/diligence',
        destination: '/compliance/diligence',
        permanent: true,
      },
      {
        source: '/diligence/consignment',
        destination: '/compliance/diligence',
        permanent: true,
      },
      {
        source: '/diligence/collect',
        destination: '/compliance/diligence',
        permanent: true,
      },
      {
        source: '/diligence/assess',
        destination: '/compliance/diligence',
        permanent: true,
      },
      {
        source: '/diligence/statement',
        destination: '/compliance/diligence',
        permanent: true,
      },
      {
        source: '/diligence/ready',
        destination: '/compliance/ready',
        permanent: true,
      },
      // Anything else under the old route lands on the suite's Diligence step.
      {
        source: '/diligence/:step',
        destination: '/compliance/diligence',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
