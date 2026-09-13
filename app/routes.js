import { index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/map-layout.jsx", [
    index("routes/home.jsx"),
    route("/go", "routes/go.jsx"),
  ]),
  route("/learn", "routes/learn.jsx"),
  route("/trends", "routes/ChartPage.jsx"),

  layout("routes/protected.jsx", [route("/dashboard", "routes/dashboard.jsx")]),

  layout("routes/auth.jsx", [
    route("/login", "routes/login.jsx"),
    route("/forgot-password", "routes/forgot-password.jsx"),
    route("/reset-password", "routes/reset-password.jsx"),
    route("/register", "routes/register.jsx"),
    route("/confirm-email", "routes/confirm-email.jsx"),
  ]),
];
