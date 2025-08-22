import {  index, layout, route } from "@react-router/dev/routes";

export default [
    index("routes/home.jsx"),
    layout("routes/auth.jsx", [
        route("/login", "routes/login.jsx"),
        route("/register", "routes/register.jsx")
    ])
];
