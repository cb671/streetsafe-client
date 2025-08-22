import { Link } from "react-router";

export default function Login(){
    return (
        <>
            <h1>Login page</h1>

            <div className="mt-6 text-center text-sm text-gray-500">
                <Link to="/register" className="underline">Register</Link>
            </div>
        </>
    );
}