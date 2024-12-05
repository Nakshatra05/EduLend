/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = (nextConfig) => {
  return {
    ...nextConfig,
    webpack(webpackConfig) {
      return {
        ...webpackConfig,
        optimization: {
          minimize: false
        }
      };
    }
  };
};