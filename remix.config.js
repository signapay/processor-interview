/** @type {import('@remix-run/dev/config').AppConfig} */
export default {
  appDirectory: "app",
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildPath: "build/server.js",
  serverModuleFormat: "esm",
  serverPlatform: "node",
  ignoredRouteFiles: ["**/.*"],
};
