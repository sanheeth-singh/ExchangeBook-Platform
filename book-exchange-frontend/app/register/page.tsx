"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "@/lib/api";
import { AxiosError } from "axios";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");


    try {
      await api.post("/users/register", {
        username,
        email,
        password,
      });

      // Show a temporary success message before redirecting
      setSuccessMsg("Account created successfully! Redirecting to login...");
      
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error = err as AxiosError<any>;

    const backendError = error.response?.data?.detail;

    if (Array.isArray(backendError)) {
      setErrorMsg(backendError[0].msg);
    } else if (typeof backendError === "string") {
      setErrorMsg(backendError);
    } else {
      setErrorMsg("Registration failed. Please try again.");
    }
      } finally {
        setLoading(false);
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleRegister}
          className="space-y-6 bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-2xl"
        >
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white">Create an account</h1>
            <p className="text-sm text-zinc-400">Enter your details to get started</p>
          </div>

          {/* Inline Error & Success Handling */}
          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div
                key="error"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg text-center mb-4">
                  {errorMsg}
                </div>
              </motion.div>
            )}
            {successMsg && (
              <motion.div
                key="success"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-green-500/10 border border-green-500/50 text-green-400 text-sm p-3 rounded-lg text-center mb-4">
                  {successMsg}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Username</label>
              <input
                type="text"
                placeholder="Alex"
                className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white placeholder:text-zinc-600 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white transition-all pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || !!successMsg}
            className="w-full bg-white text-black p-3 rounded-lg font-semibold hover:bg-zinc-200 transition-colors disabled:opacity-50 flex justify-center items-center"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
              />
            ) : (
              "Create account"
            )}
          </button>

          <p className="text-center text-sm text-zinc-400">
            Already have an account?{" "}
            {/* Replace this <a> tag with Next.js <Link> component in your actual app if you have it imported */}
            <Link href="/login" className="text-white hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}