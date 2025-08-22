import {
  Outlet,
} from "react-router";

export default function AuthLayout(){
    return <div className="this-stuff-will-be-in-both-pages">
        <h1>this appears on both</h1>
        <Outlet/>
    </div>
}