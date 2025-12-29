// // "use client";
// // import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// // import { useRouter } from "next/navigation";
// // import axios from "axios";

// // // Define User interface
// // export interface User {
// //   _id: string;
// //   userName: string;
// //   fullName: string;
// //   email: string;
// //   avatar?: string;
// //   coverImage?: string;
// //   createdAt?: string;
// //   updatedAt?: string;
// // }

// // // Define Auth Context Type
// // interface AuthContextType {
// //   user: User | null;
// //   token: string | null;
// //   login: (email: string, password: string) => Promise<void>;
// //   register: (userData: RegisterData) => Promise<void>;
// //   logout: () => void;
// //   loading: boolean;
// //   isAuthenticated: boolean;
// // }

// // // Register Data Interface
// // interface RegisterData {
// //   userName: string;
// //   fullName: string;
// //   email: string;
// //   password: string;
// //   avatar?: File;
// //   coverImage?: File;
// // }

// // // Create Context
// // export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // // Auth Provider Component
// // export function AuthProvider({ children }: { children: ReactNode }) {
// //   const [user, setUser] = useState<User | null>(null);
// //   const [token, setToken] = useState<string | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const router = useRouter();

// //   // Initialize auth state from localStorage
// //   useEffect(() => {
// //     const initializeAuth = () => {
// //       try {
// //         const storedToken = localStorage.getItem("pharma_token");
// //         const storedUser = localStorage.getItem("pharma_user");

// //         if (storedToken && storedUser) {
// //           setToken(storedToken);
// //           setUser(JSON.parse(storedUser));
          
// //           // Set default axios headers
// //           axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
// //         }
// //       } catch (error) {
// //         console.error("Error loading auth from storage:", error);
// //         localStorage.removeItem("pharma_token");
// //         localStorage.removeItem("pharma_user");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     initializeAuth();
// //   }, []);

// //   // Login function
// //   const login = async (email: string, password: string) => {
// //     try {
// //       setLoading(true);
      
// //       const response = await axios.post(
// //         "http://localhost:8000/api/v1/users/login",
// //         { email, password },
// //         {
// //           headers: { "Content-Type": "application/json" },
// //           withCredentials: true,
// //         }
// //       );

// //       const { data } = response.data;
// //       const { accessToken, user: userData } = data;

// //       // Store in state
// //       setToken(accessToken);
// //       setUser(userData);

// //       // Store in localStorage
// //       localStorage.setItem("pharma_token", accessToken);
// //       localStorage.setItem("pharma_user", JSON.stringify(userData));

// //       // Set default axios headers
// //       axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

// //       // Redirect to dashboard
// //       router.push("/dashboard");
// //     } catch (error: any) {
// //       console.error("Login error:", error);
      
// //       let errorMessage = "Login failed. Please try again.";
// //       if (error.response) {
// //         switch (error.response.status) {
// //           case 400:
// //             errorMessage = "Invalid email or password format";
// //             break;
// //           case 401:
// //             errorMessage = "Invalid credentials";
// //             break;
// //           case 404:
// //             errorMessage = "User not found";
// //             break;
// //           case 500:
// //             errorMessage = "Server error. Please try again later";
// //             break;
// //         }
// //       }
      
// //       throw new Error(errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Register function
// //   const register = async (userData: RegisterData) => {
// //     try {
// //       setLoading(true);
      
// //       const formData = new FormData();
// //       formData.append("userName", userData.userName);
// //       formData.append("fullName", userData.fullName);
// //       formData.append("email", userData.email);
// //       formData.append("password", userData.password);
      
// //       if (userData.avatar) {
// //         formData.append("avatar", userData.avatar);
// //       }
      
// //       if (userData.coverImage) {
// //         formData.append("coverImage", userData.coverImage);
// //       }

// //       const response = await axios.post(
// //         "http://localhost:8000/api/v1/users/register",
// //         formData,
// //         {
// //           headers: { "Content-Type": "multipart/form-data" },
// //         }
// //       );

// //       const { data } = response.data;
// //       const { user: userData } = data;

// //       // Auto-login after registration
// //       await login(userData.email, userData.password);
// //     } catch (error: any) {
// //       console.error("Registration error:", error);
      
// //       let errorMessage = "Registration failed. Please try again.";
// //       if (error.response) {
// //         switch (error.response.status) {
// //           case 400:
// //             errorMessage = "Please fill all required fields";
// //             break;
// //           case 409:
// //             errorMessage = "User already exists with this email";
// //             break;
// //           case 500:
// //             errorMessage = "Server error. Please try again later";
// //             break;
// //         }
// //       }
      
// //       throw new Error(errorMessage);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // Logout function
// //   const logout = () => {
// //     // Clear state
// //     setUser(null);
// //     setToken(null);

// //     // Clear localStorage
// //     localStorage.removeItem("pharma_token");
// //     localStorage.removeItem("pharma_user");

// //     // Clear axios headers
// //     delete axios.defaults.headers.common['Authorization'];

// //     // Redirect to login
// //     router.push("/login");
// //   };

// //   // Check if user is authenticated
// //   const isAuthenticated = !!token && !!user;

// //   // Context value
// //   const contextValue: AuthContextType = {
// //     user,
// //     token,
// //     login,
// //     register,
// //     logout,
// //     loading,
// //     isAuthenticated,
// //   };

// //   return (
// //     <AuthContext.Provider value={contextValue}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // }

// "use client";
// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// // Define User interface
// export interface User {
//   _id: string;
//   userName: string;
//   fullName: string;
//   email: string;
//   avatar?: string;
//   coverImage?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// // Define Auth Context Type
// interface AuthContextType {
//   user: User | null;
//   token: string | null;
//   login: (email: string, password: string) => Promise<void>;
//   register: (userData: RegisterData) => Promise<void>;
//   logout: () => void;
//   loading: boolean;
//   isAuthenticated: boolean;
//   initialized: boolean;
// }

// // Register Data Interface
// interface RegisterData {
//   userName: string;
//   fullName: string;
//   email: string;
//   password: string;
//   avatar?: File;
//   coverImage?: File;
// }

// // Create Context
// export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // Auth Provider Component
// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [token, setToken] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [initialized, setInitialized] = useState(false);
//   const router = useRouter();

//   // Initialize auth state from localStorage - RUNS ONCE
//   useEffect(() => {
//     console.log("🔄 AuthContext: useEffect running for initialization");
//     const initializeAuth = () => {
//       try {
//         console.log("📝 AuthContext: Checking localStorage for tokens...");
        
//         // Check for both possible token keys
//         const storedToken = localStorage.getItem("accessToken") || localStorage.getItem("pharma_token");
//         const storedUser = localStorage.getItem("pharma_user");

//         console.log("🔍 AuthContext: storedToken found:", !!storedToken);
//         console.log("🔍 AuthContext: storedUser found:", !!storedUser);
        
//         if (storedToken && storedUser) {
//           console.log("✅ AuthContext: Setting token and user from localStorage");
//           setToken(storedToken);
//           setUser(JSON.parse(storedUser));
          
//           // Set default axios headers
//           axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
//           console.log("✅ AuthContext: Axios headers set");
//         } else {
//           console.log("⚠️ AuthContext: No valid tokens found in localStorage");
//         }
//       } catch (error) {
//         console.error("❌ AuthContext: Error loading auth from storage:", error);
//         localStorage.removeItem("accessToken");
//         localStorage.removeItem("pharma_token");
//         localStorage.removeItem("pharma_user");
//       } finally {
//         console.log("🏁 AuthContext: Initialization complete");
//         console.log("📊 AuthContext: Current state - token:", !!token, "user:", !!user);
//         setLoading(false);
//         setInitialized(true);
//       }
//     };

//     initializeAuth();
//   }, []);

//   // Login function
//   const login = async (email: string, password: string) => {
//     console.log("🔐 AuthContext: Login called for email:", email);
//     try {
//       setLoading(true);
      
//       console.log("📤 AuthContext: Making login API call...");
//       const response = await axios.post(
//         "http://localhost:8000/api/v1/users/login",
//         { email, password },
//         {
//           headers: { "Content-Type": "application/json" },
//           withCredentials: true,
//         }
//       );

//       console.log("✅ AuthContext: Login API response received");
//       const { data } = response.data;
//       const { accessToken, user: userData } = data;

//       console.log("📝 AuthContext: accessToken received:", !!accessToken);
//       console.log("📝 AuthContext: userData received:", userData);

//       // Store in state
//       setToken(accessToken);
//       setUser(userData);

//       // Store in localStorage - use consistent key
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("pharma_user", JSON.stringify(userData));
//       console.log("💾 AuthContext: Tokens saved to localStorage");

//       // Set default axios headers
//       axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
//       console.log("✅ AuthContext: Axios headers updated");

//       // Redirect to dashboard
//       console.log("🔄 AuthContext: Redirecting to /dashboard");
//       router.push("/dashboard");
//     } catch (error: any) {
//       console.error("❌ AuthContext: Login error:", error);
      
//       let errorMessage = "Login failed. Please try again.";
//       if (error.response) {
//         console.log("📊 AuthContext: Error response status:", error.response.status);
//         switch (error.response.status) {
//           case 400:
//             errorMessage = "Invalid email or password format";
//             break;
//           case 401:
//             errorMessage = "Invalid credentials";
//             break;
//           case 404:
//             errorMessage = "User not found";
//             break;
//           case 500:
//             errorMessage = "Server error. Please try again later";
//             break;
//         }
//       }
      
//       throw new Error(errorMessage);
//     } finally {
//       console.log("🏁 AuthContext: Login process complete");
//       setLoading(false);
//     }
//   };

//   // Register function
//   const register = async (userData: RegisterData) => {
//     console.log("📝 AuthContext: Register called");
//     try {
//       setLoading(true);
      
//       const formData = new FormData();
//       formData.append("userName", userData.userName);
//       formData.append("fullName", userData.fullName);
//       formData.append("email", userData.email);
//       formData.append("password", userData.password);
      
//       if (userData.avatar) {
//         formData.append("avatar", userData.avatar);
//       }
      
//       if (userData.coverImage) {
//         formData.append("coverImage", userData.coverImage);
//       }

//       console.log("📤 AuthContext: Making register API call...");
//       const response = await axios.post(
//         "http://localhost:8000/api/v1/users/register",
//         formData,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//         }
//       );

//       console.log("✅ AuthContext: Registration successful");
//       const { data } = response.data;
//       const { user: registeredUser } = data;

//       // Auto-login after registration
//       console.log("🔄 AuthContext: Auto-login after registration");
//       await login(userData.email, userData.password);
//     } catch (error: any) {
//       console.error("❌ AuthContext: Registration error:", error);
      
//       let errorMessage = "Registration failed. Please try again.";
//       if (error.response) {
//         console.log("📊 AuthContext: Error response status:", error.response.status);
//         switch (error.response.status) {
//           case 400:
//             errorMessage = "Please fill all required fields";
//             break;
//           case 409:
//             errorMessage = "User already exists with this email";
//             break;
//           case 500:
//             errorMessage = "Server error. Please try again later";
//             break;
//         }
//       }
      
//       throw new Error(errorMessage);
//     } finally {
//       console.log("🏁 AuthContext: Registration process complete");
//       setLoading(false);
//     }
//   };

//   // Logout function
//   const logout = () => {
//     console.log("🚪 AuthContext: Logout called");
    
//     // Clear state
//     console.log("🧹 AuthContext: Clearing state...");
//     setUser(null);
//     setToken(null);

//     // Clear localStorage
//     console.log("🗑️ AuthContext: Clearing localStorage...");
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("pharma_token");
//     localStorage.removeItem("pharma_user");

//     // Clear axios headers
//     console.log("🧹 AuthContext: Clearing axios headers...");
//     delete axios.defaults.headers.common['Authorization'];

//     console.log("✅ AuthContext: Logout complete");
//     // Don't redirect here - let components handle it
//   };

//   // Check if user is authenticated
//   const isAuthenticated = !!token && !!user;
//   console.log("📊 AuthContext: isAuthenticated check:", isAuthenticated, "token:", !!token, "user:", !!user);

//   // Context value
//   const contextValue: AuthContextType = {
//     user,
//     token,
//     login,
//     register,
//     logout,
//     loading,
//     isAuthenticated,
//     initialized,
//   };

//   console.log("🏗️ AuthContext: Rendering provider with context value");
//   return (
//     <AuthContext.Provider value={contextValue}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// Define User interface
export interface User {
  _id: string;
  userName: string;
  fullName: string;
  email: string;
  avatar?: string;
  coverImage?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Define Auth Context Type
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
  initialized: boolean;
}

// Register Data Interface
interface RegisterData {
  userName: string;
  fullName: string;
  email: string;
  password: string;
  avatar?: File;
  coverImage?: File;
}

// Create Context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const router = useRouter();

  // Initialize auth state from localStorage
  useEffect(() => {
    console.log("🔄 AuthContext: Initializing from localStorage...");
    
    const initializeAuth = () => {
      try {
        // Check for token in both possible keys
        const storedToken = localStorage.getItem("accessToken") || localStorage.getItem("pharma_token");
        const storedUser = localStorage.getItem("pharma_user");

        console.log("🔍 Found token:", !!storedToken);
        console.log("🔍 Found user:", !!storedUser);
        
        if (storedToken) {
          console.log("✅ Setting token from localStorage");
          setToken(storedToken);
          
          // Set axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          // If user data exists, parse and set it
          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser);
              setUser(userData);
              console.log("✅ User data loaded from localStorage");
            } catch (e) {
              console.error("❌ Error parsing user data:", e);
              localStorage.removeItem("pharma_user");
            }
          } else {
            console.log("⚠️ No user data in localStorage");
            // Try to extract user info from token if it's a JWT
            try {
              const parts = storedToken.split('.');
              if (parts.length === 3) {
                const payload = JSON.parse(atob(parts[1]));
                const userFromToken: User = {
                  _id: payload._id,
                  userName: payload.userName,
                  fullName: payload.fullName,
                  email: payload.email
                };
                setUser(userFromToken);
                localStorage.setItem("pharma_user", JSON.stringify(userFromToken));
                console.log("✅ User data extracted from token");
              }
            } catch (tokenError) {
              console.error("❌ Could not extract user from token:", tokenError);
            }
          }
        } else {
          console.log("⚠️ No token found in localStorage");
        }
      } catch (error) {
        console.error("❌ Error initializing auth:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("pharma_token");
        localStorage.removeItem("pharma_user");
      } finally {
        setLoading(false);
        setInitialized(true);
        console.log("🏁 Auth initialization complete");
      }
    };

    initializeAuth();
  }, []);

  // Login function - FIXED VERSION
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      console.log("🔐 Attempting login for:", email);
      
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      console.log("✅ Login API response:", response.data);
      const { data } = response.data;
      const { accessToken, user: userData } = data;

      if (!accessToken || !userData) {
        throw new Error("Invalid login response from server");
      }

      console.log("🔑 Access token received:", !!accessToken);
      console.log("👤 User data received:", userData);

      // Store in state
      setToken(accessToken);
      setUser(userData);

      // Store in localStorage - CRITICAL: Save BOTH token and user
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("pharma_user", JSON.stringify(userData));
      console.log("💾 Saved to localStorage: accessToken and pharma_user");

      // Set default axios headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

      // Redirect to dashboard
      console.log("🔄 Redirecting to /dashboard");
      router.push("/dashboard");
    } catch (error: any) {
      console.error("❌ Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      if (error.response) {
        console.error("📊 Error response:", error.response.data);
        switch (error.response.status) {
          case 400:
            errorMessage = "Invalid email or password format";
            break;
          case 401:
            errorMessage = "Invalid credentials";
            break;
          case 404:
            errorMessage = "User not found";
            break;
          case 500:
            errorMessage = "Server error. Please try again later";
            break;
        }
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Register function - FIXED VERSION
  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      console.log("📝 Registering user:", userData.email);
      
      const formData = new FormData();
      formData.append("userName", userData.userName);
      formData.append("fullName", userData.fullName);
      formData.append("email", userData.email);
      formData.append("password", userData.password);
      
      if (userData.avatar) {
        formData.append("avatar", userData.avatar);
      }
      
      if (userData.coverImage) {
        formData.append("coverImage", userData.coverImage);
      }

      const response = await axios.post(
        "http://localhost:8000/api/v1/users/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("✅ Registration successful:", response.data);
      
      // Auto-login after registration using the same credentials
      await login(userData.email, userData.password);
    } catch (error: any) {
      console.error("❌ Registration error:", error);
      
      let errorMessage = "Registration failed. Please try again.";
      if (error.response) {
        console.error("📊 Error response:", error.response.data);
        switch (error.response.status) {
          case 400:
            errorMessage = "Please fill all required fields";
            break;
          case 409:
            errorMessage = "User already exists with this email";
            break;
          case 500:
            errorMessage = "Server error. Please try again later";
            break;
        }
      }
      
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log("🚪 Logging out...");
    
    // Clear state
    setUser(null);
    setToken(null);

    // Clear localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("pharma_token");
    localStorage.removeItem("pharma_user");

    // Clear axios headers
    delete axios.defaults.headers.common['Authorization'];

    console.log("✅ Logout complete, redirecting to /login");
    router.push("/login");
  };

  // Check if user is authenticated - FIXED: Check token only
  const isAuthenticated = !!token;

  // Context value
  const contextValue: AuthContextType = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated,
    initialized,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}