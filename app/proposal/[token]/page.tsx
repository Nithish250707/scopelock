"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ──────────────────────── Types ──────────────────────── */

interface Project {
    id: string;
    title: string;
    client_name: string;
    project_type: string;
    deliverables: string;
    timeline: string;
    price: number;
    revision_limit: number;
    payment_terms: string;
    proposal_content: string;
    status: "draft" | "sent" | "signed";
    created_at: string;
    signed_at: string | null;
    client_signature: string | null;
}

/* ──────────────────────── Proposal Content Renderer ──────────────────────── */

function ProposalContent({ content }: { content: string }) {
    const lines = content.split("\n");

    return (
        <div className="space-y-1">
            {lines.map((line, i) => {
                const trimmed = line.trim();

                if (!trimmed) {
                    return <div key={i} className="h-3" />;
                }

                const isHeading =
                    /^#{1,3}\s/.test(trimmed) ||
                    /^[A-Z][A-Z\s&]+$/.test(trimmed) ||
                    /^\*\*[A-Z]/.test(trimmed);

                if (isHeading) {
                    const clean = trimmed
                        .replace(/^#{1,3}\s*/, "")
                        .replace(/\*\*/g, "");
                    return (
                        <h3
                            key={i}
                            className="mt-6 mb-3 text-base font-bold text-[#1a1a1a] uppercase tracking-wide border-b border-[#e5e5e5] pb-1"
                        >
                            {clean}
                        </h3>
                    );
                }

                if (/^---+$/.test(trimmed)) {
                    return (
                        <hr key={i} className="my-4 border-t border-[#e5e5e5]" />
                    );
                }

                if (/^[-•*]\s/.test(trimmed)) {
                    const bulletText = trimmed.replace(/^[-•*]\s+/, "");
                    return (
                        <div
                            key={i}
                            className="flex items-start gap-2 pl-2 text-sm leading-relaxed text-[#333]"
                        >
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#7c3aed]" />
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: bulletText.replace(
                                        /\*\*(.*?)\*\*/g,
                                        '<strong class="text-[#1a1a1a] font-semibold">$1</strong>'
                                    ),
                                }}
                            />
                        </div>
                    );
                }

                if (/^\d+\.\s/.test(trimmed)) {
                    return (
                        <p
                            key={i}
                            className="text-sm leading-relaxed text-[#333] pl-2"
                            dangerouslySetInnerHTML={{
                                __html: trimmed.replace(
                                    /\*\*(.*?)\*\*/g,
                                    '<strong class="text-[#1a1a1a] font-semibold">$1</strong>'
                                ),
                            }}
                        />
                    );
                }

                return (
                    <p
                        key={i}
                        className="text-sm leading-relaxed text-[#333]"
                        dangerouslySetInnerHTML={{
                            __html: trimmed.replace(
                                /\*\*(.*?)\*\*/g,
                                '<strong class="text-[#1a1a1a] font-semibold">$1</strong>'
                            ),
                        }}
                    />
                );
            })}
        </div>
    );
}

/* ──────────────────────── Main Page ──────────────────────── */

export default function PublicProposalPage() {
    const params = useParams();
    const token = params.token as string;

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    // Signing state
    const [signatureName, setSignatureName] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [signing, setSigning] = useState(false);
    const [signed, setSigned] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadProposal() {
            const { data, error } = await supabase
                .from("projects")
                .select("*")
                .eq("signing_token", token)
                .single();

            if (error || !data) {
                setNotFound(true);
                setLoading(false);
                return;
            }

            const proj = data as Project;
            setProject(proj);

            // If already signed, show signed state
            if (proj.status === "signed" && proj.client_signature) {
                setSigned(true);
            }

            setLoading(false);
        }

        if (token) loadProposal();
    }, [token]);

    async function handleSign() {
        if (!project || !signatureName.trim() || !agreedToTerms) return;
        setError("");
        setSigning(true);

        try {
            const { error: updateError } = await supabase
                .from("projects")
                .update({
                    status: "signed",
                    signed_at: new Date().toISOString(),
                    client_signature: signatureName.trim(),
                })
                .eq("signing_token", token);

            if (updateError) {
                setError("Failed to sign proposal. Please try again.");
                return;
            }

            setSigned(true);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSigning(false);
        }
    }

    // ── Loading state ──
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
                <div className="flex flex-col items-center gap-4">
                    <svg
                        className="h-8 w-8 animate-spin text-[#7c3aed]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="text-sm text-[#71717a]">
                        Loading proposal...
                    </p>
                </div>
            </div>
        );
    }

    // ── Not Found state ──
    if (notFound || !project) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
                <div className="text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-bold text-[#1a1a1a]">
                        Proposal Not Found
                    </h1>
                    <p className="mt-2 text-sm text-[#71717a]">
                        This proposal link is invalid or has expired.
                    </p>
                </div>
            </div>
        );
    }

    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(project.price);

    const formattedDate = new Date(project.created_at).toLocaleDateString(
        "en-US",
        { month: "long", day: "numeric", year: "numeric" }
    );

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* ─── Header Bar ─── */}
            <div className="border-b border-[#e5e5e5] bg-white">
                <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
                    <span className="text-lg font-bold text-[#7c3aed]">
                        ScopeLock
                    </span>
                    <span className="rounded-full bg-[#7c3aed]/10 px-3 py-1 text-xs font-medium text-[#7c3aed]">
                        Project Proposal
                    </span>
                </div>
            </div>

            {/* ─── Main Content ─── */}
            <main className="mx-auto max-w-3xl px-6 py-10">
                {/* ── Project Info Header ── */}
                <div className="mb-8 rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-[#1a1a1a]">
                                {project.title}
                            </h1>
                            <p className="mt-1 text-sm text-[#71717a]">
                                Prepared for {project.client_name} · {formattedDate}
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-[#71717a]">
                                Project Investment
                            </p>
                            <p className="text-2xl font-extrabold text-[#1a1a1a]">
                                {formattedPrice}
                            </p>
                        </div>
                    </div>

                    {/* Quick details */}
                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-[#fafafa] p-4 sm:grid-cols-4">
                        <div>
                            <p className="text-xs text-[#71717a]">Type</p>
                            <p className="mt-0.5 text-sm font-medium text-[#1a1a1a]">
                                {project.project_type}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-[#71717a]">Timeline</p>
                            <p className="mt-0.5 text-sm font-medium text-[#1a1a1a]">
                                {project.timeline || "TBD"}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-[#71717a]">Revisions</p>
                            <p className="mt-0.5 text-sm font-medium text-[#1a1a1a]">
                                {project.revision_limit} included
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-[#71717a]">Payment</p>
                            <p className="mt-0.5 text-sm font-medium text-[#1a1a1a]">
                                {project.payment_terms}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Proposal Content ── */}
                <div className="mb-8 rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm sm:p-8">
                    <ProposalContent content={project.proposal_content} />
                </div>

                {/* ── Signing Section ── */}
                {signed ? (
                    /* Success state */
                    <div className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center shadow-sm">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-green-800">
                            ✅ Proposal Accepted
                        </h2>
                        <p className="mt-2 text-sm text-green-600">
                            A copy has been saved. Your freelancer will be notified.
                        </p>
                        {project.client_signature && (
                            <p className="mt-4 text-xs text-green-500">
                                Signed by: {project.client_signature}
                            </p>
                        )}
                    </div>
                ) : (
                    /* Accept Proposal form */
                    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-6 shadow-sm sm:p-8">
                        <h2 className="text-lg font-bold text-[#1a1a1a]">
                            Accept Proposal
                        </h2>
                        <p className="mt-1 text-sm text-[#71717a]">
                            Review the proposal above, then sign below to accept
                            the terms.
                        </p>

                        {/* Error message */}
                        {error && (
                            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}

                        <div className="mt-6 space-y-5">
                            {/* Name input */}
                            <div>
                                <label
                                    htmlFor="signatureName"
                                    className="mb-1.5 block text-sm font-medium text-[#333]"
                                >
                                    Type your full name to sign
                                </label>
                                <input
                                    id="signatureName"
                                    type="text"
                                    required
                                    value={signatureName}
                                    onChange={(e) =>
                                        setSignatureName(e.target.value)
                                    }
                                    placeholder={project.client_name}
                                    className="w-full rounded-xl border border-[#e5e5e5] bg-[#fafafa] px-4 py-3 text-sm text-[#1a1a1a] placeholder-[#a1a1aa] outline-none transition-all focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
                                />
                            </div>

                            {/* Terms checkbox */}
                            <label
                                htmlFor="agreeTerms"
                                className="flex items-start gap-3 cursor-pointer"
                            >
                                <input
                                    id="agreeTerms"
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) =>
                                        setAgreedToTerms(e.target.checked)
                                    }
                                    className="mt-0.5 h-4 w-4 rounded border-[#d4d4d8] text-[#7c3aed] accent-[#7c3aed]"
                                />
                                <span className="text-sm text-[#555]">
                                    I have read and agree to the terms outlined
                                    in the proposal above, including the scope
                                    of work, revision policy, payment terms,
                                    and cancellation policy.
                                </span>
                            </label>

                            {/* Sign button */}
                            <button
                                id="sign-and-accept-btn"
                                onClick={handleSign}
                                disabled={
                                    signing ||
                                    !signatureName.trim() ||
                                    !agreedToTerms
                                }
                                className="w-full rounded-xl bg-green-600 py-3.5 text-sm font-semibold text-white transition-all hover:bg-green-700 hover:shadow-lg hover:shadow-green-600/25 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {signing ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg
                                            className="h-4 w-4 animate-spin"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Signing...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Sign & Accept Proposal
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* ── Footer ── */}
                <div className="mt-8 text-center">
                    <p className="text-xs text-[#a1a1aa]">
                        Powered by{" "}
                        <span className="font-medium text-[#7c3aed]">
                            ScopeLock
                        </span>{" "}
                        · scopelock.dev
                    </p>
                </div>
            </main>
        </div>
    );
}
