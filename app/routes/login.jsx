import { Link } from "react-router";

export default function Login(){
    return (
        <>

            <h2 className="text-lg font-semibold text-center">Sign In</h2>


            <form className="mt-6 space-y-4">

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