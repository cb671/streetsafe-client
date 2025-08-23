import {index, layout, route} from "@react-router/dev/routes";

export default [
  layout("routes/map-layout.jsx", [
    index("routes/home.jsx"),
    route("/go", "routes/go.jsx"),
  ]),
  route("/learn", "routes/learn.jsx"),
  route("chart", "routes/ChartPage.jsx"),
  layout("routes/auth.jsx", [
      route("/login", "routes/login.jsx"),
      route("/register", "routes/register.jsx")
  ])
];
