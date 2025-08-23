import { Link } from "react-router";

export default function Login(){
    return (
        <>
            <h1>

            <form>
                <label className="block">Username
                    <input type="text" className="block"/>
                </label>
                <label className="block">Password
                    <input type="text" className="block" />
                </label>
            </form>

                
            </h1>

            <div className="mt-6 text-center text-sm text-gray-500">
                <Link to="/register" className="underline">Register</Link>
            </div>
        </>
    );
}