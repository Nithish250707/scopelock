"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

/* ──────────────────────── Types ──────────────────────── */

interface Project {
    id: string;
    client_name: string;
    project_type: string;
    status: "draft" | "sent" | "signed";
    price: number;
    created_at: string;
}

/* ──────────────────────── Status Badge ──────────────────────── */

function StatusBadge({ status }: { status: Project["status"] }) {
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

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${c.bg} ${c.text} ${c.ring}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
            {c.label}
        </span>
    );
}

/* ──────────────────────── Project Card ──────────────────────── */

function ProjectCard({ project }: { project: Project }) {
    const formattedDate = new Date(project.created_at).toLocaleDateString(
        "en-US",
        {
            month: "short",
            day: "numeric",
            year: "numeric",
        }
    );

    const formattedPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(project.price);

    return (
        <Link
            href={`/dashboard/${project.id}`}
            className="group relative rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 transition-all duration-300 hover:border-[#7c3aed]/30 hover:bg-[#1f1f1f] hover:-translate-y-1"
        >
            {/* Hover glow */}
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7c3aed]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative z-10">
                {/* Header: Client + Status */}
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                        <h3 className="truncate text-base font-semibold text-white">
                            {project.client_name}
                        </h3>
                        <p className="mt-1 truncate text-sm text-[#71717a]">
                            {project.project_type}
                        </p>
                    </div>
                    <StatusBadge status={project.status} />
                </div>

                {/* Divider */}
                <div className="my-4 h-px bg-[#2a2a2a]" />

                {/* Footer: Price + Date */}
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-white">{formattedPrice}</span>
                    <span className="text-xs text-[#71717a]">{formattedDate}</span>
                </div>
            </div>
        </Link>
    );
}

/* ──────────────────────── Empty State ──────────────────────── */

function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 animate-fade-in-up">
            {/* Dashed border illustration area */}
            <div className="flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-[#3f3f46] bg-[#1a1a1a]/50 transition-colors">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-16 w-16 text-[#3f3f46]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
            </div>

            <h3 className="mt-8 text-xl font-semibold text-white">
                No proposals yet
            </h3>
            <p className="mt-2 max-w-sm text-center text-sm text-[#71717a]">
                Create your first proposal to protect your income
            </p>

            <Link
                id="create-first-proposal"
                href="/dashboard/new"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#7c3aed] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#6d28d9] hover:shadow-lg hover:shadow-[#7c3aed]/25 hover:scale-105"
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
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Create First Proposal
            </Link>
        </div>
    );
}

/* ──────────────────────── Loading Skeleton ──────────────────────── */

function LoadingSkeleton() {
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
                <p className="text-sm text-[#71717a]">Loading your dashboard...</p>
            </div>
        </div>
    );
}

/* ──────────────────────── Dashboard Page ──────────────────────── */

export default function DashboardPage() {
    const router = useRouter();
    const [userEmail, setUserEmail] = useState<string>("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [signingOut, setSigningOut] = useState(false);

    useEffect(() => {
        async function init() {
            // Check session — redirect to /login if not authenticated
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!session) {
                router.push("/login");
                return;
            }

            setUserEmail(session.user.email ?? "");

            // Fetch projects for this user
            const { data: projectsData } = await supabase
                .from("projects")
                .select("*")
                .eq("user_id", session.user.id)
                .order("created_at", { ascending: false });

            setProjects(projectsData ?? []);
            setLoading(false);
        }

        init();
    }, [router]);

    async function handleSignOut() {
        setSigningOut(true);
        await supabase.auth.signOut();
        router.push("/");
    }

    if (loading) return <LoadingSkeleton />;

    return (
        <div className="min-h-screen bg-[#0f0f0f]">
            {/* ─── TOP NAVBAR ─── */}
            <nav
                id="dashboard-navbar"
                className="sticky top-0 z-50 border-b border-[#1a1a1a] bg-[#0f0f0f]/80 backdrop-blur-xl"
            >
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <Link
                        href="/"
                        className="text-xl font-bold tracking-tight text-[#7c3aed] transition-opacity hover:opacity-80"
                    >
                        ScopeLock
                    </Link>

                    <div className="flex items-center gap-4">
                        {/* User email */}
                        <span className="hidden text-sm text-[#a1a1aa] sm:block">
                            {userEmail}
                        </span>

                        {/* Sign Out button */}
                        <button
                            id="sign-out-btn"
                            onClick={handleSignOut}
                            disabled={signingOut}
                            className="rounded-lg border border-[#2a2a2a] px-4 py-2 text-sm font-medium text-[#a1a1aa] transition-all hover:border-red-500/30 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {signingOut ? (
                                <span className="flex items-center gap-2">
                                    <svg
                                        className="h-3.5 w-3.5 animate-spin"
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
                                    Signing out...
                                </span>
                            ) : (
                                "Sign Out"
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ─── MAIN CONTENT ─── */}
            <main className="mx-auto max-w-6xl px-6 py-10">
                {/* Page header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-white sm:text-3xl">
                            My Projects
                        </h1>
                        {projects.length > 0 && (
                            <p className="mt-1 text-sm text-[#71717a]">
                                {projects.length} proposal{projects.length !== 1 ? "s" : ""}
                            </p>
                        )}
                    </div>

                    <Link
                        id="new-project-btn"
                        href="/dashboard/new"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#7c3aed] px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-[#6d28d9] hover:shadow-lg hover:shadow-[#7c3aed]/25"
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
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        New Project
                    </Link>
                </div>

                {/* Divider */}
                <div className="mt-6 h-px bg-[#1a1a1a]" />

                {/* Content: Empty state or grid */}
                {projects.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
