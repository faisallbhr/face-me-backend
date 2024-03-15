const router = require("express").Router();
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const postRoute = require("./post.route");

const routes = [
  {
    path: "/auth",
    route: authRoute
  },
  {
    path: "/users",
    route: userRoute
  },
  {
    path: "/posts",
    route: postRoute
  }
];

routes.map((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
