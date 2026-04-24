"use client";

import { useState } from "react";
import { auth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await auth.login({
        email: identity,
        password: password,
      });

      if (response.data.success === true) {
        localStorage.setItem("token", response.data.access_token);
        router.push("/dashboard");

      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="relative z-10 w-full max-w-[420px]">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-[#131b2e] rounded-lg mb-4">
          <span className="material-symbols-outlined text-white text-2xl">inventory_2</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Ceyntics Systems</h1>
        <p className="text-sm text-gray-500 mt-1">Inventory Management Portal</p>
      </div>

      <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-xl shadow-2xl shadow-black/40 backdrop-blur-sm">
        <div className="px-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-center">Sign In</h2>
          </div>

          {error && <p className="text-red-500 text-xs bg-red-300/5 p-2 rounded mb-4">{error}</p>}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Username or Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">person</span>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-11 pr-md font-body-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                  placeholder="john.doe@ceyntics.com"
                  type="text"
                  value={identity}
                  onChange={(e) => setIdentity(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                {/* <a className="text-xs font-bold text-blue-600 hover:underline" href="#">Forgot password?</a> */}
              </div>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">lock</span>
                <input
                  className="w-full bg-surface-container-low border border-outline-variant rounded-lg py-3 pl-11 pr-12 font-body-md text-on-surface placeholder:text-outline/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/3 text-gray-400 hover:text-on-surface transition-colors focus:outline-none"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <button
              className={`w-full text-white font-semibold py-3 mt-10 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary-container hover:bg-primary cursor-pointer"}
              `}
              type="submit"
              disabled={loading}
            >
              <span className="material-symbols-outlined text-lg pointer-events-none">
                login
              </span>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}