// postcss.config.mjs

const config = {
  plugins: {
    "@tailwindcss/postcss": {}, // Az önce yüklediğimiz paket
    autoprefixer: {}, // Az önce yüklediğimiz diğer paket
  },
};

export default config;
