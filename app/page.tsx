"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/* ──────────────────────── IntersectionObserver Hook ──────────────────────── */

function useFadeIn() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll(".fade-in");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);
}

/* ──────────────────────── Check Icon ──────────────────────── */

function Check() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 shrink-0 text-[#22c55e]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   LANDING PAGE
   ══════════════════════════════════════════════════════════════ */

export default function LandingPage() {
  useFadeIn();

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqs = [
    {
      q: "Do I need to know what scope creep is to use this?",
      a: "No. ScopeLock works for anyone who wants professional proposals. If you're new to freelancing, think of it as an AI that writes your contracts — the scope protection is just a bonus.",
    },
    {
      q: "Is the digital signature legally binding?",
      a: "Yes. E-signatures are legally recognized in most countries. Both parties receive a signed PDF as proof of agreement.",
    },
    {
      q: "Can I use this just as a proposal generator?",
      a: "Absolutely. Many users only use the AI proposal generator and never touch the scope protection features. Generate, download as PDF, and send to your client however you want.",
    },
    {
      q: "What happens after the 7-day trial?",
      a: "You'll be asked to choose a plan. If you don't upgrade, you keep read-only access to your existing proposals — nothing gets deleted.",
    },
    {
      q: "Can I cancel anytime?",
      a: "Yes, cancel from your account settings anytime. No cancellation fees.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      {/* ═══════════════════ SECTION 1: NAVBAR ═══════════════════ */}
      <nav className="sticky top-0 z-50 border-b border-[#2d2d4e] bg-[#0f0f0f]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7c3aed] text-sm font-bold text-white">
              S
            </div>
            <span className="text-lg font-bold text-white">
              ScopeLock
            </span>
          </Link>

          {/* Center nav links */}
          <div className="hidden items-center gap-8 md:flex">
            {[
              ["Features", "#features"],
              ["Pricing", "#pricing"],
              ["How it Works", "#how-it-works"],
              ["FAQ", "#faq"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-sm text-[#94a3b8] transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="hidden text-sm text-[#94a3b8] transition-colors hover:text-white sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#6d28d9]"
            >
              Get Started Free →
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════ SECTION 2: HERO ═══════════════════ */}
      <section className="flex min-h-screen items-center justify-center px-6 py-32 text-center">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-block rounded-full border border-[#7c3aed]/40 bg-[#1a1a2e] px-4 py-1.5 text-sm text-[#a78bfa]">
            🔒 AI Proposal Generator + Scope Protection
          </div>

          {/* Headline */}
          <h1 className="mt-6 text-5xl font-bold leading-tight sm:text-6xl">
            Your clients will always
            <br />
            want more for free.
            <br />
            <span className="text-[#7c3aed]">Not anymore.</span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#94a3b8] sm:text-xl">
            ScopeLock does two things: generates professional AI
            proposals in 30 seconds AND protects you from scope
            creep. Use it just for proposals, or use the full
            protection suite — your choice.
          </p>

          {/* CTA row */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-xl bg-[#7c3aed] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#6d28d9] hover:shadow-lg hover:shadow-purple-500/25"
            >
              Start Free Trial →
            </Link>
            <a
              href="#how-it-works"
              className="rounded-xl border border-[#2d2d4e] px-8 py-4 text-lg text-white transition-all hover:border-[#7c3aed]/50"
            >
              See how it works
            </a>
          </div>

          {/* Trust badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-sm text-[#94a3b8]">
            <span className="flex items-center gap-1.5">
              <Check /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <Check /> 7-day free trial
            </span>
            <span className="flex items-center gap-1.5">
              <Check /> Cancel anytime
            </span>
          </div>

          {/* Mock proposal card */}
          <div className="mx-auto mt-16 max-w-md rounded-2xl border border-[#2d2d4e] bg-[#1a1a2e] p-6 shadow-2xl shadow-purple-500/10">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white">
                Project Proposal — Website Redesign
              </span>
              <span className="rounded bg-[#7c3aed]/20 px-2 py-1 text-xs text-[#a78bfa]">
                AI Generated ✓
              </span>
            </div>
            <div className="mt-2">
              <span className="rounded bg-green-500/10 px-2 py-1 text-xs text-green-400">
                Scope Protected ✓
              </span>
            </div>
            {/* Blurred content lines */}
            <div className="mt-4 space-y-3">
              <div className="h-2 w-full rounded-full bg-[#2d2d4e]" />
              <div className="h-2 w-3/4 rounded-full bg-[#2d2d4e]" />
              <div className="h-2 w-full rounded-full bg-[#2d2d4e]" />
              <div className="h-2 w-1/2 rounded-full bg-[#2d2d4e]" />
            </div>
            <p className="mt-4 text-xs text-[#94a3b8]">
              Client signed · Feb 22, 2025
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 3: TRUST BAR ═══════════════════ */}
      <section className="border-y border-[#2d2d4e] bg-[#0a0a0a] py-10">
        <p className="mb-6 text-center text-sm text-[#94a3b8]">
          Trusted by freelancers from these companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
          {["Toptal", "Fiverr", "Upwork", "99designs", "Contra"].map(
            (name) => (
              <span
                key={name}
                className="text-lg font-bold text-[#4a4a6a]"
              >
                {name}
              </span>
            )
          )}
        </div>
      </section>

      {/* ═══════════════════ SECTION 4: WHAT IS SCOPE CREEP ═══════════════════ */}
      <section id="features" className="px-6 py-24">
        <div className="fade-in mx-auto max-w-5xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-[#a78bfa]">
            THE $3,000–$10,000 PROBLEM
          </p>
          <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
            What is scope creep — and why is it costing you
            thousands?
          </h2>

          <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* Left: prose */}
            <div className="rounded-2xl border border-[#2d2d4e] bg-[#1a1a2e] p-8">
              <h3 className="mb-4 text-xl font-semibold text-white">
                Scope creep, explained simply
              </h3>
              <div className="space-y-4 text-[#94a3b8] leading-relaxed">
                <p>
                  Scope creep is when a project slowly grows
                  beyond what was originally agreed — without
                  additional payment. A client hires you to
                  design 5 pages, then casually asks for
                  &ldquo;1 small thing&rdquo; that turns into
                  weeks of extra work.
                </p>
                <p>
                  It&apos;s not always malicious. Sometimes
                  clients genuinely don&apos;t realize
                  they&apos;re asking for more. But without a
                  clear written agreement, you have no way to
                  say no — and no way to get paid for yes.
                </p>
                <p>
                  The result? Freelancers lose an estimated
                  $3,000–$10,000 every year to unpaid work.
                  That&apos;s a vacation. A new laptop. Months
                  of rent.
                </p>
              </div>
            </div>

            {/* Right: stat cards */}
            <div className="space-y-4">
              {[
                {
                  number: "$3,000–$10,000",
                  label: "Lost per year by average freelancer",
                },
                {
                  number: "76%",
                  label: "Of freelancers experience scope creep on every project",
                },
                {
                  number: "30 sec",
                  label: "Time to generate a scope-protecting proposal with ScopeLock",
                },
              ].map((stat) => (
                <div
                  key={stat.number}
                  className="rounded-xl border border-[#2d2d4e] bg-[#0f0f0f] p-6"
                >
                  <p className="text-3xl font-bold text-[#7c3aed]">
                    {stat.number}
                  </p>
                  <p className="mt-1 text-sm text-[#94a3b8]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 5: TWO USE CASES ═══════════════════ */}
      <section className="bg-[#0a0a0a] px-6 py-24">
        <div className="fade-in mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Use ScopeLock your way
          </h2>
          <p className="mt-4 text-center text-[#94a3b8]">
            Whether you just want better proposals or full scope
            protection — ScopeLock works for both.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Card 1: AI Proposals */}
            <div className="rounded-2xl border border-[#2d2d4e] bg-[#1a1a2e] p-8">
              <div className="text-4xl">📝</div>
              <h3 className="mt-4 text-xl font-semibold text-white">
                Just need AI proposals?
              </h3>
              <p className="mt-2 text-[#94a3b8]">
                Use ScopeLock as a powerful AI proposal
                generator. Fill in 8 fields, get a professional
                proposal with proper payment terms, milestones,
                and kill fees. In 30 seconds.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[#94a3b8]">
                <li className="flex items-center gap-2">
                  <Check /> Professional proposal in 30
                  seconds
                </li>
                <li className="flex items-center gap-2">
                  <Check /> Proper payment terms included
                </li>
                <li className="flex items-center gap-2">
                  <Check /> Kill fee + late payment clauses
                </li>
                <li className="flex items-center gap-2">
                  <Check /> Download as PDF instantly
                </li>
              </ul>
            </div>

            {/* Card 2: Full Protection */}
            <div className="rounded-2xl border border-[#7c3aed]/40 bg-[#1a1a2e] p-8">
              <div className="text-4xl">🛡️</div>
              <span className="mt-3 mb-3 inline-block rounded bg-[#7c3aed]/20 px-2 py-1 text-xs text-[#a78bfa]">
                Full Protection
              </span>
              <h3 className="text-xl font-semibold text-white">
                Want complete scope protection?
              </h3>
              <p className="mt-2 text-[#94a3b8]">
                Get proposals AND the full scope protection
                suite. Client asks for extras? One click
                generates a professional out-of-scope email.
                Track every revision. Send change orders.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[#94a3b8]">
                <li className="flex items-center gap-2">
                  <Check /> Everything in AI proposals
                </li>
                <li className="flex items-center gap-2">
                  <Check /> Scope alert email generator
                </li>
                <li className="flex items-center gap-2">
                  <Check /> Revision tracker per project
                </li>
                <li className="flex items-center gap-2">
                  <Check /> Change order generator
                </li>
                <li className="flex items-center gap-2">
                  <Check /> Digital client signing
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 6: HOW IT WORKS ═══════════════════ */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="fade-in mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            How it works
          </h2>

          <div className="relative mt-16 pl-6 sm:pl-0">
            {/* Vertical line */}
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#2d2d4e] sm:left-[19px]" />

            {[
              {
                num: "01",
                title: "Fill in your project details",
                body: "Client name, project type, deliverables, timeline, price, and revision limit. 8 fields. Takes 2 minutes.",
              },
              {
                num: "02",
                title: "AI generates your proposal",
                body: "GPT-4 writes a professional, legally protective proposal with scope of work, exclusions, revision policy, kill fee, and payment terms. Instantly.",
              },
              {
                num: "03",
                title: "Client signs, you're protected",
                body: "Send a signing link. Client reviews and signs digitally. Both parties get a PDF. Scope is locked. You're protected.",
              },
              {
                num: "04",
                title: "Client asks for more? Handled.",
                body: "When scope creep happens, click one button. AI drafts a professional, firm-but-friendly out-of-scope email in seconds. Stay paid. Keep the relationship.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="relative mb-12 flex gap-6 last:mb-0"
              >
                <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#7c3aed] text-sm font-bold text-white">
                  {step.num}
                </div>
                <div className="pt-1">
                  <h3 className="text-xl font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[#94a3b8]">
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 7: PRICING ═══════════════════ */}
      <section id="pricing" className="px-6 py-24">
        <div className="fade-in mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Simple pricing
          </h2>
          <p className="mt-3 text-center text-[#94a3b8]">
            Pays for itself the first time you prevent scope creep.
          </p>
          <p className="mt-4 text-center text-sm text-[#a78bfa]">
            🔒 30-day money back guarantee
          </p>

          <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
            {/* SOLO */}
            <div className="rounded-2xl border border-[#2d2d4e] bg-[#1a1a2e] p-8">
              <p className="text-lg font-semibold text-[#94a3b8]">
                Solo
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white">
                  $19
                </span>
                <span className="text-lg text-[#94a3b8]">
                  /month
                </span>
              </div>
              <p className="mt-1 text-sm text-[#94a3b8]">
                7 days free, then $19/month
              </p>

              <div className="my-6 border-t border-[#2d2d4e]" />

              <ul className="space-y-3 text-sm text-[#94a3b8]">
                {[
                  "Unlimited AI proposals",
                  "5 active projects",
                  "PDF download",
                  "Revision tracker",
                  "Scope alert emails",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2"
                  >
                    <Check /> {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="mt-6 block w-full rounded-xl border border-[#7c3aed] py-3 text-center text-sm font-semibold text-[#a78bfa] transition-all hover:bg-[#7c3aed] hover:text-white"
              >
                Start Free Trial
              </Link>
            </div>

            {/* PRO */}
            <div className="relative rounded-2xl border border-[#7c3aed] bg-[#1a1a2e] p-8">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-[#7c3aed] px-4 py-1 text-xs font-semibold text-white">
                  Most Popular
                </span>
              </div>

              <p className="text-lg font-semibold text-[#a78bfa]">
                Pro
              </p>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-5xl font-bold text-white">
                  $29
                </span>
                <span className="text-lg text-[#94a3b8]">
                  /month
                </span>
              </div>
              <p className="mt-1 text-sm text-[#94a3b8]">
                7 days free, then $29/month
              </p>

              <div className="my-6 border-t border-[#2d2d4e]" />

              <ul className="space-y-3 text-sm text-[#94a3b8]">
                {[
                  "Everything in Solo",
                  "Unlimited projects",
                  "Digital client signing",
                  "Change order generator",
                  "Custom proposal branding",
                  "Priority support",
                ].map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2"
                  >
                    <Check /> {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className="mt-6 block w-full rounded-xl bg-[#7c3aed] py-3 text-center text-sm font-semibold text-white transition-all hover:bg-[#6d28d9] hover:shadow-lg hover:shadow-purple-500/25"
              >
                Start Free Trial →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 8: FAQ ═══════════════════ */}
      <section id="faq" className="px-6 py-24">
        <div className="fade-in mx-auto max-w-3xl">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Questions
          </h2>

          <div className="mt-10">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="border-b border-[#2d2d4e] py-5"
              >
                <button
                  onClick={() =>
                    setOpenFAQ(openFAQ === i ? null : i)
                  }
                  className="flex w-full items-center justify-between text-left"
                >
                  <span className="font-medium text-white pr-4">
                    {faq.q}
                  </span>
                  <span className="shrink-0 text-xl text-[#7c3aed]">
                    {openFAQ === i ? "−" : "+"}
                  </span>
                </button>
                {openFAQ === i && (
                  <p className="mt-3 text-sm leading-relaxed text-[#94a3b8]">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ SECTION 9: FINAL CTA ═══════════════════ */}
      <section className="border-t border-[#2d2d4e] bg-[#0a0a0a] px-6 py-32 text-center">
        <div className="fade-in mx-auto max-w-2xl">
          <h2 className="text-4xl font-bold sm:text-5xl">
            Stop giving your work away for free.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#94a3b8] sm:text-xl">
            Generate your first scope-protecting proposal in 30
            seconds. Free for 7 days.
          </p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-2xl bg-[#7c3aed] px-10 py-5 text-lg font-semibold text-white transition-all hover:bg-[#6d28d9] hover:shadow-xl hover:shadow-purple-500/30 sm:text-xl"
          >
            Start Free Trial — No card required →
          </Link>
        </div>
      </section>

      {/* ═══════════════════ SECTION 10: FOOTER ═══════════════════ */}
      <footer className="border-t border-[#2d2d4e] px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 sm:grid-cols-3">
            {/* Left */}
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7c3aed] text-sm font-bold text-white">
                  S
                </div>
                <span className="text-lg font-bold text-white">
                  ScopeLock
                </span>
              </div>
              <p className="mt-2 text-sm text-[#94a3b8]">
                Protect your income.
              </p>
              <p className="mt-4 text-xs text-[#4a4a6a]">
                Built for freelancers who value their time.
              </p>
            </div>

            {/* Middle */}
            <div>
              <p className="text-sm font-semibold text-[#94a3b8]">
                Product
              </p>
              <ul className="mt-3 space-y-2">
                {[
                  ["Features", "#features"],
                  ["Pricing", "#pricing"],
                  ["FAQ", "#faq"],
                  ["Login", "/login"],
                  ["Sign Up", "/signup"],
                ].map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-[#4a4a6a] transition-colors hover:text-white"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right */}
            <div>
              <p className="text-sm font-semibold text-[#94a3b8]">
                Legal
              </p>
              <ul className="mt-3 space-y-2">
                {["Privacy Policy", "Terms of Service"].map(
                  (label) => (
                    <li key={label}>
                      <Link
                        href="#"
                        className="text-sm text-[#4a4a6a] transition-colors hover:text-white"
                      >
                        {label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-8 border-t border-[#2d2d4e] pt-8 text-center">
            <p className="text-xs text-[#4a4a6a]">
              © 2025 ScopeLock. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
