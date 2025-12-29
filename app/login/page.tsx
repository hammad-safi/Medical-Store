// "use client";
// import { useEffect, useState } from "react";
// import { Eye, EyeOff, Mail, Lock, User, UserCircle, AlertCircle } from "lucide-react";

// const API_URL = "http://localhost:8000/api/v1/users";

// export default function AuthPage() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [showPassword, setShowPassword] = useState(false);

//   // Login state
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   // Register state
//   const [userName, setUserName] = useState("");
//   const [fullName, setFullName] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   // Auto redirect if logged in
//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     if (token) {
//       window.location.href = "/dashboard";
//     }
//   }, []);

//   // Clear messages when switching forms
//   useEffect(() => {
//     setError("");
//     setSuccess("");
//   }, [isLogin]);

//   // LOGIN
//   const handleLogin = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const res = await fetch(`${API_URL}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Login failed");

//       localStorage.setItem("accessToken", data.data.accessToken);
//       window.location.href = "/dashboard";
//     } catch (err) {
//       setError(err.message || "Login failed. Please check your credentials.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // REGISTER
//   const handleRegister = async () => {
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const res = await fetch(`${API_URL}/register`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           userName,
//           fullName,
//           email,
//           password,
//         }),
//       });

//       const data = await res.json();

//       if (!res.ok) throw new Error(data.message || "Registration failed");

//       setSuccess("Registration successful! Please login with your credentials.");
//       setTimeout(() => {
//         setIsLogin(true);
//         setSuccess("");
//       }, 2000);
//     } catch (err) {
//       setError(err.message || "Registration failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = (e) => {
//     if (e.key === "Enter") {
//       isLogin ? handleLogin() : handleRegister();
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
//             <UserCircle className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Medical Store</h1>
//           <p className="text-gray-600">
//             {isLogin ? "Welcome back! Please login to continue." : "Create your account to get started."}
//           </p>
//         </div>

//         {/* Form Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
//           <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
//             <button
//               type="button"
//               onClick={() => setIsLogin(true)}
//               className={`flex-1 py-2.5 rounded-md font-medium transition-all ${
//                 isLogin
//                   ? "bg-white text-blue-600 shadow-sm"
//                   : "text-gray-600 hover:text-gray-800"
//               }`}
//             >
//               Login
//             </button>
//             <button
//               type="button"
//               onClick={() => setIsLogin(false)}
//               className={`flex-1 py-2.5 rounded-md font-medium transition-all ${
//                 !isLogin
//                   ? "bg-white text-blue-600 shadow-sm"
//                   : "text-gray-600 hover:text-gray-800"
//               }`}
//             >
//               Register
//             </button>
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
//               <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
//               <p className="text-sm text-red-700">{error}</p>
//             </div>
//           )}

//           {/* Success Message */}
//           {success && (
//             <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
//               <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
//               <p className="text-sm text-green-700">{success}</p>
//             </div>
//           )}

//           <div onKeyDown={handleSubmit}>
//             {!isLogin && (
//               <>
//                 {/* Username */}
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Username
//                   </label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Choose a username"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                       value={userName}
//                       onChange={(e) => setUserName(e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>

//                 {/* Full Name */}
//                 <div className="mb-4">
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Full Name
//                   </label>
//                   <div className="relative">
//                     <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                     <input
//                       type="text"
//                       placeholder="Enter your full name"
//                       className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                       value={fullName}
//                       onChange={(e) => setFullName(e.target.value)}
//                       required
//                     />
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* Email */}
//             <div className="mb-4">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type="email"
//                   placeholder="you@example.com"
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             {/* Password */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   placeholder="Enter your password"
//                   className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
//                 >
//                   {showPassword ? (
//                     <EyeOff className="w-5 h-5" />
//                   ) : (
//                     <Eye className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//               {!isLogin && (
//                 <p className="mt-1 text-xs text-gray-500">
//                   Must be at least 6 characters
//                 </p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               onClick={isLogin ? handleLogin : handleRegister}
//               disabled={loading}
//               className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
//             >
//               {loading ? (
//                 <span className="flex items-center justify-center gap-2">
//                   <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                       fill="none"
//                     />
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                     />
//                   </svg>
//                   Processing...
//                 </span>
//               ) : isLogin ? (
//                 "Sign In"
//               ) : (
//                 "Create Account"
//               )}
//             </button>
//           </div>

//           {/* Footer */}
//           {isLogin && (
//             <div className="mt-4 text-center">
//               <a href="#" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
//                 Forgot password?
//               </a>
//             </div>
//           )}
//         </div>

//         {/* Terms */}
//         <p className="text-center text-xs text-gray-500 mt-6">
//           By continuing, you agree to our{" "}
//           <a href="#" className="text-blue-600 hover:underline">
//             Terms of Service
//           </a>{" "}
//           and{" "}
//           <a href="#" className="text-blue-600 hover:underline">
//             Privacy Policy
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }


"use client";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, UserCircle, AlertCircle } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Register state
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { isAuthenticated, login, register, loading: authLoading } = useAuth();
  const router = useRouter();

  // Auto redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      console.log("✅ AuthPage: Already authenticated, redirecting to dashboard");
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Clear messages when switching forms
  useEffect(() => {
    setError("");
    setSuccess("");
  }, [isLogin]);

  // LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("🔐 AuthPage: Calling login function");
      await login(email, password);
      // login() will handle redirect
    } catch (err: any) {
      console.error("❌ AuthPage: Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // REGISTER
  const handleRegister = async () => {
    if (!userName || !fullName || !email || !password) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      console.log("📝 AuthPage: Calling register function");
      await register({
        userName,
        fullName,
        email,
        password,
      });
      // register() will call login() and handle redirect
    } catch (err: any) {
      console.error("❌ AuthPage: Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      isLogin ? handleLogin() : handleRegister();
    }
  };

  // Show loading if auth is still checking
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't show auth page if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 shadow-lg">
            <UserCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Medical Store</h1>
          <p className="text-gray-600">
            {isLogin ? "Welcome back! Please login to continue." : "Create your account to get started."}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-md font-medium transition-all ${
                isLogin
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-md font-medium transition-all ${
                !isLogin
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Register
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700">{success}</p>
            </div>
          )}

          <div onKeyDown={handleSubmit}>
            {!isLogin && (
              <>
                {/* Username */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Choose a username"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {!isLogin && (
                <p className="mt-1 text-xs text-gray-500">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={isLogin ? handleLogin : handleRegister}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Footer */}
          {isLogin && (
            <div className="mt-4 text-center">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                Forgot password?
              </a>
            </div>
          )}
        </div>

        {/* Terms */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By continuing, you agree to our{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
