"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

/* ──────────────────────── Types ──────────────────────── */

interface Project {
    id: string;
    title: string;
    client_name: string;
    client_email: string;
    project_type: string;
    deliverables: string;
    timeline: string;
    price: number;
    revision_limit: number;
    revisions_used: number;
    payment_terms: string;
    proposal_content: string;
    status: "draft" | "sent" | "signed";
    created_at: string;
}

/* ──────────────────────── Status Badge ──────────────────────── */

function StatusBadge({
    status,
    size = "sm",
}: {
    status: Project["status"];
    size?: "sm" | "lg";
}) {
    const config = {
        draft: {
            label: "Draft",
            bg: "bg-[#3f3f46]/40",
            text: "text-[#a1a1aa]",
            ring: "ring-[#3f3f46]",
            dot: "bg-[#a1a1aa]",
        },
        sent: {
            label: "Sent",
            bg: "bg-[#1e3a5f]/40",
            text: "text-[#60a5fa]",
            ring: "ring-[#1e3a5f]",
            dot: "bg-[#60a5fa]",
        },
        signed: {
            label: "Signed",
            bg: "bg-[#14532d]/40",
            text: "text-[#4ade80]",
            ring: "ring-[#14532d]",
            dot: "bg-[#4ade80]",
        },
    };

    const c = config[status];
    const sizeClasses =
        size === "lg" ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-1 text-xs";

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ${sizeClasses} ${c.bg} ${c.text} ${c.ring}`}
        >
            <span
                className={`rounded-full ${c.dot} ${size === "lg" ? "h-2 w-2" : "h-1.5 w-1.5"}`}
            />
            {c.label}
        </span>
    );
}

/* ──────────────────────── Proposal Renderer ──────────────────────── */

function ProposalContent({ content }: { content: string }) {
    const lines = content.split("\n");

    return (
        <div className="prose-invert space-y-1">
            {lines.map((line, i) => {
                const trimmed = line.trim();

                if (!trimmed) {
                    return <div key={i} className="h-3" />;
                }

                const isHeading =
                    /^#{1,3}\s/.test(trimmed) ||
                    /^\d+\.\s+[A-Z]/.test(trimmed) ||
                    /^\*\*\d+\./.test(trimmed);

                if (isHeading) {
                    const clean = trimmed
                        .replace(/^#{1,3}\s*/, "")
                        .replace(/\*\*/g, "");
                    return (
                        <h3
                            key={i}
                            className="mt-6 mb-3 text-lg font-bold text-white"
                        >
                            {clean}
                        </h3>
                    );
                }

                if (/^[-•*]\s/.test(trimmed)) {
                    const bulletText = trimmed.replace(/^[-•*]\s+/, "");
                    return (
                        <div
                            key={i}
                            className="flex items-start gap-2 pl-2 text-sm leading-relaxed text-[#d4d4d8]"
                        >
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[#7c3aed]" />
                            <span
                                dangerouslySetInnerHTML={{
                                    __html: bulletText.replace(
                                        /\*\*(.*?)\*\*/g,
                                        '<strong class="text-white font-semibold">$1</strong>'
                                    ),
                                }}
                            />
                        </div>
                    );
                }

                return (
                    <p
                        key={i}
                        className="text-sm leading-relaxed text-[#d4d4d8]"
                        dangerouslySetInnerHTML={{
                            __html: trimmed.replace(
                                /\*\*(.*?)\*\*/g,
                                '<strong class="text-white font-semibold">$1</strong>'
                            ),
                        }}
                    />
                );
            })}
        </div>
    );
}

/* ──────────────────────── Detail Row ──────────────────────── */

function DetailRow({
    label,
    value,
    icon,
}: {
    label: string;
    value: React.ReactNode;
    icon: React.ReactNode;
}) {
    return (
        <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#7c3aed]/10 text-[#7c3aed]">
                {icon}
            </div>
            <div className="min-w-0 flex-1">
                <p className="text-xs text-[#71717a]">{label}</p>
                <div className="mt-0.5 text-sm font-medium text-white">
                    {value}
                </div>
            </div>
        </div>
    );
}

/* ──────────────────────── SVG Icons ──────────────────────── */

function UserIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
        </svg>
    );
}

function DollarIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    );
}

function ClockIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

function RefreshIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
        </svg>
    );
}

function CreditCardIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
            <line x1="1" y1="10" x2="23" y2="10" />
        </svg>
    );
}

function CalendarIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
    );
}

/* ──────────────────────── Scope Alert Modal ──────────────────────── */

function ScopeAlertModal({
    project,
    onClose,
}: {
    project: Project;
    onClose: () => void;
}) {
    const [clientRequest, setClientRequest] = useState("");
    const [generatedEmail, setGeneratedEmail] = useState("");
    const [generating, setGenerating] = useState(false);
    const [emailCopied, setEmailCopied] = useState(false);
    const [error, setError] = useState("");

    async function handleGenerate() {
        if (!clientRequest.trim()) return;
        setError("");
        setGenerating(true);

        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) return;

            const res = await fetch("/api/scope-alert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    projectId: project.id,
                    clientRequest,
                    originalDeliverables: project.deliverables,
                    revisionLimit: project.revision_limit,
                    revisionsUsed: project.revisions_used ?? 0,
                    price: project.price,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Failed to generate response");
                return;
            }

            setGeneratedEmail(data.email);
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setGenerating(false);
        }
    }

    async function handleCopyEmail() {
        try {
            await navigator.clipboard.writeText(generatedEmail);
            setEmailCopied(true);
            setTimeout(() => setEmailCopied(false), 2500);
        } catch {
            const textArea = document.createElement("textarea");
            textArea.value = generatedEmail;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setEmailCopied(true);
            setTimeout(() => setEmailCopied(false), 2500);
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 shadow-2xl shadow-black/60 sm:p-8">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-lg p-1.5 text-[#71717a] transition-colors hover:bg-[#2a2a2a] hover:text-white"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                {/* Title */}
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-white">
                        Generate Scope Response
                    </h2>
                    <p className="mt-1 text-sm text-[#71717a]">
                        Describe what the client is asking for, and we&apos;ll
                        draft a professional response.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {!generatedEmail ? (
                    <>
                        {/* Input area */}
                        <div className="mb-6">
                            <label
                                htmlFor="clientRequest"
                                className="mb-1.5 block text-sm font-medium text-[#d4d4d8]"
                            >
                                What is the client asking for?
                            </label>
                            <textarea
                                id="clientRequest"
                                rows={4}
                                value={clientRequest}
                                onChange={(e) =>
                                    setClientRequest(e.target.value)
                                }
                                placeholder="e.g. Client wants to add an e-commerce section that wasn't in the original scope"
                                className="w-full resize-none rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm text-white placeholder-[#52525b] outline-none transition-all focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
                            />
                        </div>

                        {/* Generate button */}
                        <button
                            id="generate-scope-response-btn"
                            onClick={handleGenerate}
                            disabled={generating || !clientRequest.trim()}
                            className="w-full rounded-xl bg-[#7c3aed] py-3 text-sm font-semibold text-white transition-all hover:bg-[#6d28d9] hover:shadow-lg hover:shadow-[#7c3aed]/25 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {generating ? (
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
                                    Generating response...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
                                    </svg>
                                    Generate Response
                                </div>
                            )}
                        </button>
                    </>
                ) : (
                    <>
                        {/* Generated email — editable */}
                        <div className="mb-6">
                            <label className="mb-1.5 block text-sm font-medium text-[#d4d4d8]">
                                Generated Email{" "}
                                <span className="text-[#71717a]">
                                    (editable)
                                </span>
                            </label>
                            <textarea
                                id="generated-email"
                                rows={12}
                                value={generatedEmail}
                                onChange={(e) =>
                                    setGeneratedEmail(e.target.value)
                                }
                                className="w-full resize-y rounded-xl border border-[#2a2a2a] bg-[#0f0f0f] px-4 py-3 text-sm leading-relaxed text-white outline-none transition-all focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/50"
                            />
                        </div>

                        {/* Action buttons */}
                        <div className="flex gap-3">
                            <button
                                id="copy-email-btn"
                                onClick={handleCopyEmail}
                                className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all ${emailCopied
                                    ? "bg-green-500/10 text-green-400 ring-1 ring-green-500/20"
                                    : "bg-[#7c3aed] text-white hover:bg-[#6d28d9] hover:shadow-lg hover:shadow-[#7c3aed]/25"
                                    }`}
                            >
                                {emailCopied ? (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                        </svg>
                                        Copy Email
                                    </>
                                )}
                            </button>

                            <button
                                id="close-modal-btn"
                                onClick={onClose}
                                className="flex-1 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] py-3 text-sm font-semibold text-[#a1a1aa] transition-all hover:border-[#3f3f46] hover:text-white"
                            >
                                Close
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

/* ──────────────────────── Proposal View Page ──────────────────────── */

export default function ProposalViewPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [showScopeModal, setShowScopeModal] = useState(false);
    const [loggingRevision, setLoggingRevision] = useState(false);

    const loadProject = useCallback(async () => {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            router.push("/login");
            return;
        }

        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("id", projectId)
            .eq("user_id", session.user.id)
            .single();

        if (error || !data) {
            router.push("/dashboard");
            return;
        }

        setProject(data as Project);
        setLoading(false);
    }, [projectId, router]);

    useEffect(() => {
        loadProject();
    }, [loadProject]);

    async function handleCopy() {
        if (!project) return;
        try {
            await navigator.clipboard.writeText(project.proposal_content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            const textArea = document.createElement("textarea");
            textArea.value = project.proposal_content;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        }
    }

    function handleDownloadPDF() {
        window.print();
    }

    async function handleLogRevision() {
        if (!project) return;
        setLoggingRevision(true);

        const newCount = (project.revisions_used ?? 0) + 1;

        const { error } = await supabase
            .from("projects")
            .update({ revisions_used: newCount })
            .eq("id", project.id);

        if (!error) {
            setProject({ ...project, revisions_used: newCount });
        }

        setLoggingRevision(false);
    }

    // ── Loading state ──
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#0f0f0f]">
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

    if (!project) return null;

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

    const revisionsUsed = project.revisions_used ?? 0;
    const revisionsMaxed = revisionsUsed >= project.revision_limit;
    const revisionPercentage = Math.min(
        (revisionsUsed / project.revision_limit) * 100,
        100
    );

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            {/* ─── Print-specific CSS ─── */}
            <style jsx global>{`
                @media print {
                    /* Hide everything except proposal content */
                    nav, header, button, .sidebar,
                    .no-print { display: none !important; }

                    body {
                        background: white !important;
                        color: black !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }

                    /* Show only proposal content */
                    .proposal-print {
                        font-family: 'Georgia', serif !important;
                        font-size: 11pt !important;
                        line-height: 1.6 !important;
                        color: #000000 !important;
                        max-width: 750px !important;
                        margin: 0 auto !important;
                        padding: 40px !important;
                        background: white !important;
                        border: none !important;
                        box-shadow: none !important;
                        border-radius: 0 !important;
                    }

                    /* Page setup */
                    @page {
                        margin: 1in;
                        size: A4;
                    }

                    /* Section headers */
                    .proposal-print h1 {
                        font-size: 20pt !important;
                        font-weight: bold !important;
                        text-align: center !important;
                        margin-bottom: 4px !important;
                        color: #000 !important;
                    }
                    .proposal-print .meta-info {
                        text-align: center;
                        font-size: 10pt;
                        color: #555;
                        margin-bottom: 30px;
                        border-bottom: 2px solid #000;
                        padding-bottom: 16px;
                    }
                    .proposal-print h2 {
                        font-size: 11pt !important;
                        font-weight: bold !important;
                        text-transform: uppercase !important;
                        letter-spacing: 1px !important;
                        margin-top: 24px !important;
                        margin-bottom: 8px !important;
                        border-bottom: 1px solid #ccc !important;
                        padding-bottom: 4px !important;
                        color: #000 !important;
                    }
                    .proposal-print h3 {
                        font-size: 11pt !important;
                        font-weight: bold !important;
                        text-transform: uppercase !important;
                        letter-spacing: 1px !important;
                        margin-top: 24px !important;
                        margin-bottom: 8px !important;
                        border-bottom: 1px solid #ccc !important;
                        padding-bottom: 4px !important;
                        color: #000 !important;
                    }
                    .proposal-print p, .proposal-print li, .proposal-print span, .proposal-print div {
                        font-size: 10.5pt !important;
                        color: #222 !important;
                        margin-bottom: 6px !important;
                    }
                    .proposal-print strong {
                        color: #000 !important;
                    }
                    .proposal-print .divider {
                        border-top: 1px solid #ddd;
                        margin: 20px 0;
                    }
                    .proposal-print .signature-block {
                        margin-top: 40px;
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        gap: 40px;
                    }
                    .proposal-print .signature-line {
                        border-top: 1px solid #000;
                        padding-top: 8px;
                        font-size: 10pt;
                    }

                    /* Hide all non-proposal elements */
                    .min-h-screen { background: white !important; }
                    .print-hide-all > *:not(.proposal-print-wrapper) { display: none !important; }
                    .proposal-print-wrapper { display: block !important; }
                    .proposal-print-wrapper > .no-print { display: none !important; }
                }
            `}</style>
            {/* ─── Scope Alert Modal ─── */}
            {showScopeModal && (
                <ScopeAlertModal
                    project={project}
                    onClose={() => setShowScopeModal(false)}
                />
            )}

            {/* ─── TOP NAVBAR ─── */}
            <nav className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0f0f0f]/80 backdrop-blur-xl print:hidden">
                <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
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
            <main className="mx-auto max-w-7xl px-6 py-10">
                {/* ── Page Header ── */}
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-white sm:text-3xl">
                                {project.client_name}
                            </h1>
                            <StatusBadge
                                status={project.status}
                                size="lg"
                            />
                        </div>
                        <p className="mt-1 text-sm text-[#71717a]">
                            {project.project_type} · {project.title}
                        </p>
                    </div>
                </div>

                {/* ── Two Column Layout ── */}
                <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
                    {/* ── LEFT: Proposal Content ── */}
                    <div className="proposal-print-wrapper">
                        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 sm:p-8 proposal-print">
                            {/* Section header */}
                            <div className="mb-6 flex items-center justify-between no-print">
                                <h2 className="text-lg font-bold text-white">
                                    Your Proposal
                                </h2>
                                <div className="flex items-center gap-2">
                                    {/* Copy button */}
                                    <button
                                        id="copy-proposal-btn"
                                        onClick={handleCopy}
                                        className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-all ${copied
                                            ? "bg-green-500/10 text-green-400 ring-1 ring-green-500/20"
                                            : "bg-[#7c3aed]/10 text-[#7c3aed] ring-1 ring-[#7c3aed]/20 hover:bg-[#7c3aed]/20"
                                            }`}
                                    >
                                        {copied ? (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12" />
                                                </svg>
                                                Copied!
                                            </>
                                        ) : (
                                            <>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                                </svg>
                                                Copy Proposal
                                            </>
                                        )}
                                    </button>

                                    {/* Download PDF button */}
                                    <button
                                        id="download-pdf-btn"
                                        onClick={handleDownloadPDF}
                                        className="inline-flex items-center gap-2 rounded-lg bg-[#2a2a2a]/50 px-3.5 py-2 text-xs font-medium text-[#a1a1aa] ring-1 ring-[#2a2a2a] transition-all hover:bg-[#2a2a2a] hover:text-white"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                            <polyline points="7 10 12 15 17 10" />
                                            <line x1="12" y1="15" x2="12" y2="3" />
                                        </svg>
                                        Download PDF
                                    </button>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="mb-6 h-px bg-[#2a2a2a] no-print" />

                            {/* Proposal text */}
                            <ProposalContent
                                content={project.proposal_content}
                            />
                        </div>

                        {/* ── Scope Protection Section ── */}
                        <div className="mt-6 rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 sm:p-8 print:hidden">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-bold text-white">
                                        Scope Protection
                                    </h2>
                                    <p className="mt-1 text-sm text-[#71717a]">
                                        Handle out-of-scope requests
                                        professionally
                                    </p>
                                </div>
                                <button
                                    id="scope-alert-btn"
                                    onClick={() => setShowScopeModal(true)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-[#7c3aed] px-5 py-2.5 text-sm font-semibold text-[#7c3aed] transition-all hover:bg-[#7c3aed]/10 hover:shadow-lg hover:shadow-[#7c3aed]/10"
                                >
                                    <span className="text-base">⚠️</span>
                                    Client Asked For Something Extra?
                                </button>
                            </div>
                        </div>

                        {/* ── Bottom Actions ── */}
                        <div className="mt-6 flex flex-col gap-3 sm:flex-row print:hidden">
                            <button
                                id="send-to-client-btn"
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#7c3aed] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#6d28d9] hover:shadow-lg hover:shadow-[#7c3aed]/25"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13" />
                                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                                </svg>
                                Send to Client
                            </button>

                            <Link
                                id="edit-project-btn"
                                href={`/dashboard/${project.id}/edit`}
                                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#2a2a2a] bg-[#1a1a1a] px-6 py-3 text-sm font-semibold text-[#a1a1aa] transition-all hover:border-[#3f3f46] hover:text-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                </svg>
                                Edit Project
                            </Link>
                        </div>
                    </div>

                    {/* ── RIGHT: Project Details Card ── */}
                    <div className="print:hidden">
                        <div className="sticky top-20 space-y-6">
                            {/* Project Details Card */}
                            <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
                                <h2 className="mb-6 text-sm font-semibold uppercase tracking-wider text-[#7c3aed]">
                                    Project Details
                                </h2>

                                {/* Price — prominent */}
                                <div className="mb-6 rounded-xl bg-[#7c3aed]/10 p-4 text-center ring-1 ring-[#7c3aed]/20">
                                    <p className="text-xs text-[#a1a1aa]">
                                        Project Value
                                    </p>
                                    <p className="mt-1 text-3xl font-extrabold text-white">
                                        {formattedPrice}
                                    </p>
                                </div>

                                {/* Details list */}
                                <div className="space-y-5">
                                    <DetailRow
                                        label="Client Name"
                                        value={project.client_name}
                                        icon={<UserIcon />}
                                    />

                                    {project.client_email && (
                                        <DetailRow
                                            label="Client Email"
                                            value={
                                                <a
                                                    href={`mailto:${project.client_email}`}
                                                    className="text-[#7c3aed] transition-colors hover:text-[#8b5cf6]"
                                                >
                                                    {project.client_email}
                                                </a>
                                            }
                                            icon={<MailIcon />}
                                        />
                                    )}

                                    {project.timeline && (
                                        <DetailRow
                                            label="Timeline"
                                            value={project.timeline}
                                            icon={<ClockIcon />}
                                        />
                                    )}

                                    <DetailRow
                                        label="Payment Terms"
                                        value={project.payment_terms}
                                        icon={<CreditCardIcon />}
                                    />

                                    <DetailRow
                                        label="Status"
                                        value={
                                            <StatusBadge
                                                status={project.status}
                                            />
                                        }
                                        icon={<DollarIcon />}
                                    />

                                    <DetailRow
                                        label="Created"
                                        value={formattedDate}
                                        icon={<CalendarIcon />}
                                    />
                                </div>
                            </div>

                            {/* ── Revision Tracker Card ── */}
                            <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-semibold uppercase tracking-wider text-[#7c3aed]">
                                        Revision Tracker
                                    </h2>
                                    {revisionsMaxed && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-400 ring-1 ring-red-500/20">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                                <line x1="12" y1="9" x2="12" y2="13" />
                                                <line x1="12" y1="17" x2="12.01" y2="17" />
                                            </svg>
                                            Limit Reached
                                        </span>
                                    )}
                                </div>

                                {/* Progress display */}
                                <div className="mb-4">
                                    <div className="flex items-baseline justify-between mb-2">
                                        <span className="text-2xl font-bold text-white">
                                            {revisionsUsed}
                                        </span>
                                        <span className="text-sm text-[#71717a]">
                                            of {project.revision_limit}{" "}
                                            revisions
                                        </span>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="h-2 w-full rounded-full bg-[#2a2a2a]">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${revisionsMaxed
                                                ? "bg-red-500"
                                                : revisionPercentage >= 66
                                                    ? "bg-yellow-500"
                                                    : "bg-[#7c3aed]"
                                                }`}
                                            style={{
                                                width: `${revisionPercentage}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Log Revision button */}
                                <button
                                    id="log-revision-btn"
                                    onClick={handleLogRevision}
                                    disabled={loggingRevision}
                                    className={`w-full inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${revisionsMaxed
                                        ? "border border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                        : "border border-[#2a2a2a] bg-[#0f0f0f] text-[#a1a1aa] hover:border-[#7c3aed]/30 hover:text-white"
                                        } disabled:cursor-not-allowed disabled:opacity-50`}
                                >
                                    {loggingRevision ? (
                                        <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="12" y1="5" x2="12" y2="19" />
                                            <line x1="5" y1="12" x2="19" y2="12" />
                                        </svg>
                                    )}
                                    {revisionsMaxed
                                        ? "Log Revision (Over Limit)"
                                        : "+ Log Revision"}
                                </button>

                                {revisionsMaxed && (
                                    <p className="mt-3 text-xs text-red-400/80 text-center">
                                        All revisions have been used. Further
                                        changes should be billed as change
                                        orders.
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
