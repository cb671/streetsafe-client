import {
  Outlet, Link
} from "react-router";


export default function AuthLayout(){
    return (
    <div className="min-h-screen flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border-2 border-white/80 bg-white/70 p-6 shadow-sm backdrop-blur
                      dark:bg-gray-900/60">   
            <h1 className="text-center text-2xl font-semibold text-gray-900 dark:text-gray-100">    
                StreetSafe
            </h1>

             <p className="mt-1 text-center text-sm text-gray-600 dark:text-gray-400">
                See the facts. Stay informed. Stay Safe
            </p>

            {/* Child route renders here */}
            <div className="mt-8">
                <Outlet />
            </div>
  
        </div>
    </div>
  );
}








