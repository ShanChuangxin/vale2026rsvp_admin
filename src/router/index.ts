import type { App } from "vue";
import { createRouter, createWebHashHistory, type RouteRecordRaw } from "vue-router";

export const Layout = () => import("@/layouts/index.vue");

export const constantRoutes: RouteRecordRaw[] = [
  // 登录页
  {
    path: "/login",
    component: () => import("@/views/login/index.vue"),
    meta: { hidden: true },
  },

  // 首页（一级菜单）
  // {
  //   path: "/",
  //   component: Layout,
  //   redirect: "/dashboard",
  //   children: [
  //     {
  //       path: "dashboard",
  //       name: "Dashboard",
  //       component: () => import("@/views/dashboard/index.vue"),
  //       meta: {
  //         title: "首页",
  //         icon: "homepage",
  //         affix: true,
  //       },
  //     },
  //   ],
  // },

  // ✅ 用户（一级菜单）
  {
    path: "/user",
    component: Layout,
    children: [
      {
        path: "",
        name: "User",
        component: () => import("@/views/user/index.vue"),
        meta: {
          title: "用户列表",
          icon: "user",
        },
      },
      {
        path: "detail/:id",
        name: "UserDetail",
        component: () => import("@/views/user/detail.vue"),
        meta: {
          title: "用户详情",
          hidden: true, // ✅ 不出现在菜单
          activeMenu: "/user", // ✅ 高亮左侧“用户信息”
        },
      },
    ],
  },

  // ✅ 公司（先保留，后面再做）
  {
    path: "/company",
    component: Layout,
    children: [
      {
        path: "",
        name: "Company",
        component: () => import("@/views/company/index.vue"),
        meta: {
          title: "公司列表",
          icon: "tree",
        },
      },
    ],
  },

  // 404
  {
    path: "/:pathMatch(.*)*",
    component: () => import("@/views/error/404.vue"),
    meta: { hidden: true },
  },
];

/**
 * 创建路由
 */
const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  // 刷新时，滚动条位置还原
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// 全局注册 router
export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
