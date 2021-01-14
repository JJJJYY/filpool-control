import { defineConfig } from 'umi';
export default defineConfig({
  // locale: { antd: true },
  targets: {
    ie: 11,
  },
  externals: {
    '@antv/data-set': 'DataSet',
  },
  title: 'FILPool-管理后台',
  // mock: false,
  ignoreMomentLocale: true,
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  proxy: {
    '/public': {
      target: 'http://localhost:63342/filpool-php',
      // target: 'http://testapi.filpool.c28e9d7b637474c3a98b2ed559c29434c.cn-hongkong.alicontainer.com',
      changeOrigin: true,
    },
    '/tmp': {
      target: 'http://localhost:63342/filpool-php',
      // target: 'http://testapi.filpool.c28e9d7b637474c3a98b2ed559c29434c.cn-hongkong.alicontainer.com',
      changeOrigin: true,
    },
  },
});
