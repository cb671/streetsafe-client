import { Link } from "react-router";
import { register } from "../api/api.js";
import { useNavigate, useState } from "react";


export default function Register(){
    
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [postcode, setPostcode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
        
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await register(username, email, password, postcode);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false)
        }
    }
    

    return (
        <>

            <h2 className="text-lg font-semibold text-center">Register</h2>


            <form onSubmit={handleSubmit} className="mt-6 space-y-4">

                <div className="px-4">
                    <label htmlFor="username" className="block text-sm">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        autoComplete="username"
                        required
                        className="h-8 mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3
                        py-3 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="e.g. john_doe"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                <div className="px-4">
                    <label htmlFor="email" className="block text-sm">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        inputMode="email"
                        required
                        className="h-8 mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3 
                        py-3 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className="px-4">
                    <label htmlFor="password" className="block text-sm">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="new-password"
                        required
                        className="h-8 mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3
                        py-3 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="px-4">
                    <label htmlFor="postcode" className="block text-sm">Postcode</label>
                    <input
                        id="postcode"
                        name="postcode"
                        type="text"
                        required
                        className="h-8 mt-1 block w-full rounded-md border border-gray-300 bg-white/80 px-3 
                        py-3 text-gray-900 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={postcode}
                        onChange={(e) => setPostcode(e.target.value)}
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
                Already registered?{" "}
                <Link to="/login" className="underline">
                    Log In here
                </Link>
            </p>
        </>
    );
}