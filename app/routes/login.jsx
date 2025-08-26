import { Link } from "react-router";
import { login } from "../api/api.js";
import { useNavigate, useState } from "react";



export default function Login(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await login(username, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <>

            <h2 className="text-lg font-semibold text-center">Sign In</h2>


            <form onSubmit={handleSubmit} className="mt-6 space-y-4">

                <div className="px-8">
                    <label htmlFor="username" className="block text-sm">
                        Username
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        inputMode="text"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3
                        py-3 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. john_doe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="px-8">
                    <label htmlFor="password" className="block text-sm">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3 
                        py-3 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="***********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="mt-8 flex justify-center">
                    <button
                        type="submit"
                        className="inline-flex items-center bg-gray-500 hover:bg-blue-700 
                        text-white font-bold py-2 px-4 rounded-full"
                    >
                        Submit
                    </button>
                </div>
            
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
                Forgot password?
            </p>

            <p className="mt-6 text-center text-sm text-gray-500">
                New to StreetSafe?{" "}
                <Link to="/register" className="underline">
                    Register here
                </Link>
            </p>
        </>
    );
}