"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
        size === "lg"
            ? "px-3.5 py-1.5 text-sm"
            : "px-2.5 py-1 text-xs";

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
    // Parse proposal content, bolding numbered section headings
    const lines = content.split("\n");

    return (
        <div className="prose-invert space-y-1">
            {lines.map((line, i) => {
                const trimmed = line.trim();

                // Empty line → spacer
                if (!trimmed) {
                    return <div key={i} className="h-3" />;
                }

                // Numbered heading (e.g. "1. Project Overview" or "## 1. ...")
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

                // Bullet point
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

                // Regular paragraph — handle bold markdown
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

/* ──────────────────────── Proposal View Page ──────────────────────── */

export default function ProposalViewPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        async function load() {
            // Auth check
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.push("/login");
                return;
            }

            // Fetch project
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
        }

        load();
    }, [projectId, router]);

    async function handleCopy() {
        if (!project) return;
        try {
            await navigator.clipboard.writeText(project.proposal_content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            // Fallback for older browsers
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

    return (
        <div className="min-h-screen bg-[#0f0f0f] print:bg-white print:text-black">
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
                    <div>
                        <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 sm:p-8">
                            {/* Section header */}
                            <div className="mb-6 flex items-center justify-between">
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
                            <div className="mb-6 h-px bg-[#2a2a2a]" />

                            {/* Proposal text */}
                            <ProposalContent
                                content={project.proposal_content}
                            />
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
                        <div className="sticky top-20 rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6">
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
                                    label="Revisions"
                                    value={`0 / ${project.revision_limit} used`}
                                    icon={<RefreshIcon />}
                                />

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
                    </div>
                </div>
            </main>
        </div>
    );
}
