"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import { supabase } from "@/lib/supabase";

/* ──────────────────────── Constants ──────────────────────── */

const PROJECT_TYPES = [
    "Web Design",
    "Web Development",
    "Mobile App",
    "Copywriting",
    "Video Editing",
    "Graphic Design",
    "SEO",
    "Social Media",
    "Other",
];

const PAYMENT_TERMS = [
    "50% upfront + 50% on delivery",
    "100% upfront",
    "Monthly retainer",
    "Milestone-based",
];

/* ──────────────────────── New Project Page ──────────────────────── */

export default function NewProjectPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);
    const [error, setError] = useState("");

    // Form state
    const [clientName, setClientName] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [title, setTitle] = useState("");
    const [projectType, setProjectType] = useState(PROJECT_TYPES[0]);
    const [deliverables, setDeliverables] = useState("");
    const [timeline, setTimeline] = useState("");
    const [price, setPrice] = useState("");
    const [revisionLimit, setRevisionLimit] = useState(3);
    const [paymentTerms, setPaymentTerms] = useState(PAYMENT_TERMS[0]);

    // Auth check
    useEffect(() => {
        async function checkAuth() {
            const {
                data: { session },
            } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }
            setAuthLoading(false);
        }
        checkAuth();
    }, [router]);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // Get current access token
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.push("/login");
                return;
            }

            const res = await fetch("/api/generate-proposal", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    clientName,
                    clientEmail,
                    title,
                    projectType,
                    deliverables,
                    timeline,
                    price,
                    revisionLimit,
                    paymentTerms,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.error === "free_limit_reached") {
                    setError(
                        "You've used your 2 free proposals this month. Upgrade to Pro for unlimited proposals."
                    );
                } else {
                    setError(data.error || "Failed to generate proposal");
                }
                return;
            }

            // Redirect to the new project page
            router.push(`/dashboard/${data.id}`);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (authLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f]">
                <div className="flex flex-col items-center gap-4">
                    <svg
                        className="h-8 w-8 animate-spin text-[#7c3aed]"
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
                    <p className="text-sm text-[#71717a]">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            {/* ─── TOP NAVBAR ─── */}
            <nav className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0f0f0f]/80 backdrop-blur-xl">
                <div className="mx-auto flex max-w-4xl items-center px-6 py-4">
                    <Link
                        id="back-to-dashboard"
                        href="/dashboard"
                        className="flex items-center gap-2 text-sm font-medium text-[#a1a1aa] transition-colors hover:text-white"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 19 5 12 12 5" />
                        </svg>
                        Back to Dashboard
                    </Link>
                </div>
            </nav>

            {/* ─── MAIN CONTENT ─── */}
            <main className="mx-auto max-w-4xl px-6 py-10">
                {/* Page title */}
                <div className="mb-10">
                    <h1 className="text-2xl font-bold text-white sm:text-3xl">
                        Create New Proposal
                    </h1>
                    <p className="mt-2 text-sm text-[#71717a]">
                        Fill in the project details and we&apos;ll generate a
                        professional, protective proposal for you.
                    </p>
                </div>

                {/* Error message */}
                {error && (
                    <div
                        id="form-error"
                        className={`mb-8 rounded-xl border px-4 py-3 text-sm ${error.includes("free proposals")
                                ? "border-[#7c3aed]/30 bg-[#7c3aed]/10 text-[#d4d4d8]"
                                : "border-red-500/20 bg-red-500/10 text-red-400"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={`h-4 w-4 shrink-0 ${error.includes("free proposals")
                                        ? "text-[#a78bfa]"
                                        : ""
                                    }`}
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
                            <span className="flex-1">{error}</span>
                        </div>
                        {error.includes("free proposals") && (
                            <div className="mt-3 flex justify-end">
                                <Link
                                    href="/#pricing"
                                    className="inline-flex items-center gap-2 rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#6d28d9] hover:shadow-lg hover:shadow-[#7c3aed]/25"
                                >
                                    Upgrade to Pro
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* ─── FORM ─── */}
                <form onSubmit={handleSubmit}>
                    <div className="space-y-8">
                        {/* ── Section: Client Info ── */}
                        <fieldset className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 sm:p-8">
                            <legend className="mb-6 text-sm font-semibold uppercase tracking-wider text-[#7c3aed]">
                                Client Information
                            </legend>
                            <div className="grid gap-5 sm:grid-cols-2">
                                {/* Client Name */}
                                <div>
                                    <label
                                        htmlFor="clientName"
                                        className="mb-1.5 block text-sm font-medium text-[#d4d4d8]"
                                    >
                                        Client Name{" "}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <input
                                        id="clientName"
                                        type="text"
                                        required
                                        value={clientName}
                                        onChange={(e) =>
                                            setClientName(e.target.value)
                                        }
                                        placeholder="Acme Corp"
                                        className="w-full rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-[#52525b] outline-none transition-all focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
                                    />
                                </div>

                                {/* Client Email */}
                                <div>
                                    <label
                                        htmlFor="clientEmail"
                                        className="mb-1.5 block text-sm font-medium text-[#d4d4d8]"
                                    >
                                        Client Email
                                    </label>
                                    <input
                                        id="clientEmail"
                                        type="email"
                                        value={clientEmail}
                                        onChange={(e) =>
                                            setClientEmail(e.target.value)
                                        }
                                        placeholder="client@acmecorp.com"
                                        className="w-full rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-[#52525b] outline-none transition-all focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
                                    />
                                </div>
                            </div>
                        </fieldset>

                        {/* ── Section: Project Details ── */}
                        <fieldset className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 sm:p-8">
                            <legend className="mb-6 text-sm font-semibold uppercase tracking-wider text-[#7c3aed]">
                                Project Details
                            </legend>
                            <div className="space-y-5">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {/* Project Title */}
                                    <div>
                                        <label
                                            htmlFor="title"
                                            className="mb-1.5 block text-sm font-medium text-[#d4d4d8]"
                                        >
                                            Project Title{" "}
                                            <span className="text-red-400">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            id="title"
                                            type="text"
                                            required
                                            value={title}
                                            onChange={(e) =>
                                                setTitle(e.target.value)
                                            }
                                            placeholder="Website Redesign"
                                            className="w-full rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-[#52525b] outline-none transition-all focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
                                        />
                                    </div>

                                    {/* Project Type */}
                                    <div>
                                        <label
                                            htmlFor="projectType"
                                            className="mb-1.5 block text-sm font-medium text-[#d4d4d8]"
                                        >
                                            Project Type{" "}
                                            <span className="text-red-400">
                                                *
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="projectType"
                                                required
                                                value={projectType}
                                                onChange={(e) =>
                                                    setProjectType(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full appearance-none rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 pr-10 text-sm text-white outline-none transition-all focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
                                            >
                                                {PROJECT_TYPES.map((type) => (
                                                    <option
                                                        key={type}
                                                        value={type}
                                                    >
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52525b]"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                {/* Deliverables */}
                                <div>
                                    <label
                                        htmlFor="deliverables"
                                        className="mb-1.5 block text-sm font-medium text-[#d4d4d8]"
                                    >
                                        Deliverables{" "}
                                        <span className="text-red-400">*</span>
                                    </label>
                                    <textarea
                                        id="deliverables"
                                        required
                                        rows={4}
                                        value={deliverables}
                                        onChange={(e) =>
                                            setDeliverables(e.target.value)
                                        }
                                        placeholder="List exactly what you're delivering e.g. 5 page website, logo design, 3 revisions"
                                        className="w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-[#52525b] outline-none transition-all focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
                                    />
                                </div>
                            </div>
                        </fieldset>

                        {/* ── Section: Terms & Pricing ── */}
                        <fieldset className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 sm:p-8">
                            <legend className="mb-6 text-sm font-semibold uppercase tracking-wider text-[#7c3aed]">
                                Terms & Pricing
                            </legend>
                            <div className="space-y-5">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    {/* Timeline */}
                                    <div>
                                        <label
                                            htmlFor="timeline"
                                            className="mb-1.5 block text-sm font-medium text-[#d4d4d8]"
                                        >
                                            Timeline
                                        </label>
                                        <input
                                            id="timeline"
                                            type="text"
                                            value={timeline}
                                            onChange={(e) =>
                                                setTimeline(e.target.value)
                                            }
                                            placeholder="e.g. 4 weeks"
                                            className="w-full rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-[#52525b] outline-none transition-all focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
                                        />
                                    </div>

                                    {/* Price */}
                                    <div>
                                        <label
                                            htmlFor="price"
                                            className="mb-1.5 block text-sm font-medium text-[#d4d4d8]"
                                        >
                                            Price{" "}
                                            <span className="text-red-400">
                                                *
                                            </span>
                                        </label>
                                        <input
                                            id="price"
                                            type="text"
                                            required
                                            value={price}
                                            onChange={(e) =>
                                                setPrice(e.target.value)
                                            }
                                            placeholder="e.g. $2,000"
                                            className="w-full rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-[#52525b] outline-none transition-all focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    {/* Revisions Included */}
                                    <div>
                                        <label
                                            htmlFor="revisionLimit"
                                            className="mb-1.5 block text-sm font-medium text-[#d4d4d8]"
                                        >
                                            Revisions Included
                                        </label>
                                        <input
                                            id="revisionLimit"
                                            type="number"
                                            min={0}
                                            max={99}
                                            value={revisionLimit}
                                            onChange={(e) =>
                                                setRevisionLimit(
                                                    Number(e.target.value)
                                                )
                                            }
                                            className="w-full rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-[#52525b] outline-none transition-all focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
                                        />
                                    </div>

                                    {/* Payment Terms */}
                                    <div>
                                        <label
                                            htmlFor="paymentTerms"
                                            className="mb-1.5 block text-sm font-medium text-[#d4d4d8]"
                                        >
                                            Payment Terms
                                        </label>
                                        <div className="relative">
                                            <select
                                                id="paymentTerms"
                                                value={paymentTerms}
                                                onChange={(e) =>
                                                    setPaymentTerms(
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full appearance-none rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 pr-10 text-sm text-white outline-none transition-all focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
                                            >
                                                {PAYMENT_TERMS.map((term) => (
                                                    <option
                                                        key={term}
                                                        value={term}
                                                    >
                                                        {term}
                                                    </option>
                                                ))}
                                            </select>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#52525b]"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth={2}
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <polyline points="6 9 12 15 18 9" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>

                    {/* ── Submit Button ── */}
                    <div className="mt-10">
                        <button
                            id="generate-proposal-btn"
                            type="submit"
                            disabled={loading}
                            className="relative w-full rounded-xl bg-[#7c3aed] py-4 text-base font-semibold text-white transition-all hover:bg-[#6d28d9] hover:shadow-lg hover:shadow-[#7c3aed]/25 disabled:cursor-not-allowed disabled:opacity-60 sm:text-lg"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <svg
                                        className="h-5 w-5 animate-spin"
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
                                    Generating your proposal...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
                                    </svg>
                                    Generate Proposal
                                </div>
                            )}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
