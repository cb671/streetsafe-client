import {
  Outlet, Link
} from "react-router";


export default function AuthLayout(){
    return (
    <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200/60 bg-white/70 p-6 shadow-sm backdrop-blur
                      dark:border-gray-800/60 dark:bg-gray-900/60">   
            <h1 className="text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">    
                Welcome
            </h1>

             <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-400">
                Sign up or sign in to continue
            </p>

            {/* Child route renders here */}
            <div className="mt-8">
                <Outlet />
            </div>

            <div className="mt-6 text-center text-sm text-gray-500">
                <Link to="/login" className="underline mr-4">Sign In</Link>
                <Link to="/register" className="underline">Register</Link>
            </div>    
        </div>
    </div>
  );
}








