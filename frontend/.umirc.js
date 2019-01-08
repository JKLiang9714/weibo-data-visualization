
// ref: https://umijs.org/config/
export default {
  "proxy": {
    "/api": {
      "target": "http://localhost:8001",
      "changeOrigin": true,
      "pathRewrite": { "^/api": "" }
    }
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: true,
      dynamicImport: true,
      title: 'frontend',
      dll: false,
      routes: {
        exclude: [],
      },
      hardSource: false,
      routes: {
        exclude: [
          /components/,
        ],
      },
    }],
  ],
}
