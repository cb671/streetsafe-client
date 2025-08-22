import {index, layout, route} from "@react-router/dev/routes";

export default [
  layout("routes/map-layout.jsx", [
    index("routes/home.jsx"),
    route("/go", "routes/go.jsx")
  ]),
  route("chart", "./components/ChartPage.jsx"),
];
