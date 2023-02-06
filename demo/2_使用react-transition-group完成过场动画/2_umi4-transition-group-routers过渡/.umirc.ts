import { defineConfig } from "umi";

export default defineConfig({
  routes: [
    {
      path: '/',
      component: '@/layouts/index',
      routes: [
        { path: '/', component: '@/pages/index' },
        { path: '/hello', component: '@/pages/hello' },
        { path: '/world', component: '@/pages/world' },
      ],
    },
  ],
  npmClient: 'npm',
});
