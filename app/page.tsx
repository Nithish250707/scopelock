import Link from "next/link";

/* ──────────────────────────── SVG Icon Components ──────────────────────────── */

function WarningIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="url(#warningGrad)"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <defs>
        <linearGradient id="warningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f97316" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

function SparklesIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#7c3aed"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3l1.912 5.813a2 2 0 0 0 1.275 1.275L21 12l-5.813 1.912a2 2 0 0 0-1.275 1.275L12 21l-1.912-5.813a2 2 0 0 0-1.275-1.275L3 12l5.813-1.912a2 2 0 0 0 1.275-1.275L12 3z" />
    </svg>
  );
}

function PenToolIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#7c3aed"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19l7-7 3 3-7 7-3-3z" />
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
      <path d="M2 2l7.586 7.586" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#7c3aed"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-[#7c3aed] shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

/* ──────────────────────────── Page Component ──────────────────────────── */

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white overflow-x-hidden">
      {/* ─── NAVBAR ─── */}
      <nav
        id="navbar"
        className="fixed top-0 left-0 right-0 z-50 border-b border-[#1a1a1a] bg-[#0f0f0f]/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight text-[#7c3aed]">
            ScopeLock
          </Link>
          <div className="flex items-center gap-3">
            <Link
              id="nav-login"
              href="/signup"
              className="rounded-lg border border-[#2a2a2a] px-4 py-2 text-sm font-medium text-white transition-all hover:border-[#7c3aed]/50 hover:text-[#7c3aed]"
            >
              Login
            </Link>
            <Link
              id="nav-get-started"
              href="/signup"
              className="rounded-lg bg-[#7c3aed] px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-[#6d28d9] hover:shadow-lg hover:shadow-[#7c3aed]/25"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section
        id="hero"
        className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 text-center"
      >
        {/* Background glow */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-[#7c3aed]/10 blur-[120px]" />

        <div className="relative z-10 max-w-3xl">
          <h1 className="animate-fade-in-up text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl">
            Stop Losing Money to{" "}
            <span className="bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent">
              Scope Creep
            </span>
          </h1>

          <p className="animate-fade-in-up-delay-1 mx-auto mt-6 max-w-xl text-lg text-[#a1a1aa] sm:text-xl">
            Generate professional proposals that protect your time and income.
            AI-powered, client-signed in minutes.
          </p>

          <div className="animate-fade-in-up-delay-2 mt-10">
            <Link
              id="hero-cta"
              href="/signup"
              className="animate-pulse-glow inline-block rounded-xl bg-[#7c3aed] px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-[#6d28d9] hover:scale-105"
            >
              Generate Your First Proposal Free
            </Link>
          </div>

          <p className="animate-fade-in-up-delay-3 mt-5 text-sm text-[#71717a]">
            No credit card required · 7-day free trial
          </p>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 animate-bounce">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-[#71717a]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7" />
          </svg>
        </div>
      </section>

      {/* ─── PROBLEM SECTION ─── */}
      <section id="problem" className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Sound{" "}
              <span className="bg-gradient-to-r from-[#f97316] to-[#ef4444] bg-clip-text text-transparent">
                familiar?
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[#a1a1aa]">
              Every freelancer has been here. These problems cost you thousands.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: "Client asks for 10 extra revisions for free",
                desc: "You quoted 2 rounds of revisions. They're on round 12 and don't see the problem.",
              },
              {
                title: "Project scope keeps expanding, your rate drops",
                desc: "What started as a simple branding project now includes a full website redesign.",
              },
              {
                title: "No paper trail when client disputes the work",
                desc: 'They say "we never agreed to that." You know you discussed it, but can\'t prove it.',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-8 transition-all duration-300 hover:border-[#f97316]/30 hover:bg-[#1f1f1f] hover:-translate-y-1"
              >
                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#f97316]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[#f97316]/10 to-[#ef4444]/10 ring-1 ring-[#f97316]/20">
                    <WarningIcon />
                  </div>
                  <h3 className="text-lg font-semibold leading-snug">{card.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#a1a1aa]">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURES SECTION ─── */}
      <section id="features" className="relative py-24 sm:py-32">
        {/* Subtle divider glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent" />

        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent">
                protect your income
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[#a1a1aa]">
              Three powerful features that work together to keep your projects
              profitable.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: <SparklesIcon />,
                title: "AI Proposal Generator",
                desc: "Professional proposals in 30 seconds. Powered by AI that understands freelance contracts and scope management.",
              },
              {
                icon: <PenToolIcon />,
                title: "Digital Signing",
                desc: "Client signs online, legally binding. No more chasing signatures or printing documents.",
              },
              {
                icon: <ShieldIcon />,
                title: "Scope Alert Emails",
                desc: "AI drafts out-of-scope responses for you. Politely decline extra work with a single click.",
              },
            ].map((feat, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-8 transition-all duration-300 hover:border-[#7c3aed]/30 hover:bg-[#1f1f1f] hover:-translate-y-1"
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7c3aed]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <div className="relative z-10">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#7c3aed]/10 ring-1 ring-[#7c3aed]/20">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{feat.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#a1a1aa]">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING SECTION ─── */}
      <section id="pricing" className="relative py-24 sm:py-32">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent" />

        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Simple pricing,{" "}
              <span className="bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] bg-clip-text text-transparent">
                no surprises
              </span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[#a1a1aa]">
              Choose the plan that fits your freelance business. Upgrade or
              downgrade anytime.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {/* SOLO Plan */}
            <div
              id="plan-solo"
              className="group relative rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-8 transition-all duration-300 hover:border-[#7c3aed]/30 hover:-translate-y-1"
            >
              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa]">
                  Solo
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">$29</span>
                  <span className="text-[#71717a]">/month</span>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  "Unlimited proposals",
                  "5 active projects",
                  "E-signing",
                  "Revision tracker",
                  "Scope alerts",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#d4d4d8]">
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                id="plan-solo-cta"
                href="/signup"
                className="mt-8 block w-full rounded-xl border border-[#7c3aed] py-3 text-center text-sm font-semibold text-[#7c3aed] transition-all hover:bg-[#7c3aed] hover:text-white"
              >
                Start Free Trial
              </Link>
            </div>

            {/* PRO Plan */}
            <div
              id="plan-pro"
              className="group relative rounded-2xl border-2 border-[#7c3aed] bg-[#1a1a1a] p-8 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Badge */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-[#7c3aed] px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-lg shadow-[#7c3aed]/30">
                  Most Popular
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#a1a1aa]">
                  Pro
                </h3>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold">$49</span>
                  <span className="text-[#71717a]">/month</span>
                </div>
              </div>

              <ul className="space-y-3">
                {[
                  "Everything in Solo",
                  "Unlimited projects",
                  "Change order generator",
                  "Custom branding",
                  "Priority support",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-[#d4d4d8]">
                    <CheckIcon />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                id="plan-pro-cta"
                href="/signup"
                className="mt-8 block w-full rounded-xl bg-[#7c3aed] py-3 text-center text-sm font-semibold text-white transition-all hover:bg-[#6d28d9] hover:shadow-lg hover:shadow-[#7c3aed]/25"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer
        id="footer"
        className="border-t border-[#1a1a1a] py-10"
      >
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm text-[#71717a]">
            <span className="font-semibold text-[#7c3aed]">ScopeLock</span> ©
            2025 · Built for freelancers
          </p>
        </div>
      </footer>
    </main>
  );
}
