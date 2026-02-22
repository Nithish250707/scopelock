"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, FormEvent } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
    const router = useRouter();
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                    },
                },
            });

            if (signUpError) {
                setError(signUpError.message);
                return;
            }

            if (data.user) {
                router.push("/dashboard");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#0f0f0f] px-4">
            {/* Background glow */}
            <div className="pointer-events-none fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[400px] w-[500px] rounded-full bg-[#7c3aed]/8 blur-[120px]" />

            <div className="relative z-10 w-full max-w-md">
                {/* Card */}
                <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-8 shadow-2xl shadow-black/40">
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <Link
                            href="/"
                            className="inline-block text-2xl font-bold tracking-tight text-[#7c3aed] transition-opacity hover:opacity-80"
                        >
                            ScopeLock
                        </Link>
                    </div>

                    {/* Headline */}
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-bold text-white">
                            Start your free trial
                        </h1>
                        <p className="mt-2 text-sm text-[#a1a1aa]">
                            7 days free, no credit card required
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div
                            id="signup-error"
                            className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                        >
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-4 w-4 shrink-0"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                {error}
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="fullName"
                                className="mb-1.5 block text-sm font-medium text-[#d4d4d8]"
                            >
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                placeholder="John Doe"
                                className="w-full rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-[#52525b] outline-none transition-all focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="mb-1.5 block text-sm font-medium text-[#d4d4d8]"
                            >
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="john@example.com"
                                className="w-full rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-[#52525b] outline-none transition-all focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="mb-1.5 block text-sm font-medium text-[#d4d4d8]"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                minLength={6}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-[#52525b] outline-none transition-all focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            id="signup-submit"
                            type="submit"
                            disabled={loading}
                            className="relative w-full rounded-xl bg-[#7c3aed] py-3 text-sm font-semibold text-white transition-all hover:bg-[#6d28d9] hover:shadow-lg hover:shadow-[#7c3aed]/25 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <svg
                                        className="h-4 w-4 animate-spin"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                        />
                                    </svg>
                                    Creating account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Bottom link */}
                    <p className="mt-6 text-center text-sm text-[#71717a]">
                        Already have an account?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-[#7c3aed] transition-colors hover:text-[#8b5cf6]"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </main>
    );
}
