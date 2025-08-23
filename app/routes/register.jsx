import { Link } from "react-router";

export default function Register(){
    return (
        <>
            <h1>Register page</h1>

            <div className="mt-6 text-center text-sm text-gray-500">
                <Link to="/login" className="underline">Login</Link>
            </div>
        </>
    );
}