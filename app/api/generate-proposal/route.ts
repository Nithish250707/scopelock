import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
    try {
        // ── Get auth token from header ──
        const authHeader = request.headers.get("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const token = authHeader.replace("Bearer ", "");

        // ── Verify user session via Supabase ──
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${token}` } },
        });

        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser(token);

        if (userError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // ── Fetch freelancer profile ──
        const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, plan")
            .eq("id", user.id)
            .single();

        const freelancerName = profile?.full_name || user.user_metadata?.full_name || "Freelancer";
        const userEmail = user.email || "";

        // ── Check free-tier proposal limit ──
        const userPlan = profile?.plan ?? "free";

        if (userPlan === "free") {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

            const { count } = await supabase
                .from("projects")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id)
                .gte("created_at", startOfMonth);

            if ((count ?? 0) >= 2) {
                return NextResponse.json(
                    { error: "free_limit_reached" },
                    { status: 403 }
                );
            }
        }

        // ── Parse form data ──
        const body = await request.json();
        const {
            clientName,
            clientEmail,
            title,
            projectType,
            deliverables,
            timeline,
            price,
            revisionLimit,
            paymentTerms,
        } = body;

        // Basic validation
        if (!clientName || !title || !projectType || !deliverables || !price) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // ── Generate proposal via OpenAI ──
        const revisionLimitNum = parseInt(revisionLimit) || 2;

        // Project-type-specific exclusions
        const projectSpecificExclusions: Record<string, string[]> = {
            'Web Design': [
                'Content writing or copywriting',
                'Stock photo licensing fees',
                'Domain registration or hosting fees',
                'Third-party plugin licenses',
                'Post-launch bug fixes after 14 days',
                'Social media graphics'
            ],
            'Web Development': [
                'UI/UX design unless specified',
                'Content population into CMS',
                'Third-party API costs or licenses',
                'Server setup beyond basic deployment',
                'Ongoing maintenance after delivery',
                'Browser testing beyond Chrome/Firefox/Safari'
            ],
            'Mobile App': [
                'App Store/Play Store submission fees',
                'Backend/API development unless specified',
                'UI/UX design unless specified',
                'Push notification service costs',
                'Third-party SDK licenses',
                'Post-launch updates or new features'
            ],
            'Copywriting': [
                'Design or visual layout work',
                'SEO keyword research',
                'Translation to other languages',
                'Printing or production costs',
                'Distribution or publishing',
                'Social media management'
            ],
            'Graphic Design': [
                'Copywriting or text content',
                'Stock image licensing',
                'Printing or production costs',
                'Animation or motion graphics',
                'Website implementation',
                'Social media management'
            ],
            'SEO': [
                'Content writing unless specified',
                'Paid advertising management',
                'Website development changes',
                'Link building outreach',
                'Social media management',
                'Guaranteed ranking results'
            ],
            'Video Editing': [
                'Original footage filming',
                'Script writing or voiceover',
                'Music licensing fees',
                'Motion graphics unless specified',
                'Color grading unless specified',
                'Distribution or publishing'
            ],
            'Social Media': [
                'Paid advertising budget',
                'Content photography or videography',
                'Website updates or changes',
                'Customer service or DM responses',
                'Influencer outreach or fees',
                'Guaranteed follower growth'
            ]
        };

        const exclusions = projectSpecificExclusions[projectType]
            || projectSpecificExclusions['Web Design']!;
        const exclusionsList = exclusions.map((e, i) => `${i + 1}. ${e}`).join('\n');

        // Calculate suggested hourly rate for revision overages
        const projectValue = parseInt(price.replace(/\D/g, '')) || 0;
        const hourlyRate = Math.round(projectValue / 20) || 75;

        const prompt = `You are an expert freelance contract writer used by top professionals on Toptal and 99designs.
Generate a premium, legally protective project proposal.

Freelancer: ${freelancerName}
Email: ${userEmail}
Client: ${clientName}
Project: ${title}
Type: ${projectType}
Deliverables: ${deliverables}
Timeline: ${timeline}
Investment: ${price}
Revisions: ${revisionLimit}
Payment: ${paymentTerms}

Generate a proposal with this EXACT structure and formatting:

---
PROJECT PROPOSAL
Prepared by: ${freelancerName}
Prepared for: ${clientName}
Date: [current date]
Project: ${title}
---

EXECUTIVE SUMMARY
Write 2-3 compelling sentences that show you understand the client's business goal, not just the technical task. Sound like a strategic partner, not just a vendor.

SCOPE OF WORK
Numbered list of exactly what is delivered.
Be hyper-specific. No vague language.
Each item on its own line with clear deliverable.

EXPLICITLY NOT INCLUDED
(This section is critical — use these EXACT exclusions)
${exclusionsList}

REVISION POLICY
${revisionLimit} rounds of revisions are included.
Define clearly what counts as a revision vs a new request. State clearly that revision ${revisionLimitNum + 1} and beyond will be billed at $${hourlyRate}/hour.
Make this section firm but professional.

TIMELINE & MILESTONES
Break ${timeline} into logical phases:
Phase 1 (Discovery & Planning): X days
Phase 2 (Design/Development): X days
Phase 3 (Review & Revisions): X days
Phase 4 (Final Delivery): X days
Include: client must provide feedback within 3 business days or timeline extends accordingly.

INVESTMENT
Total: ${price}
Payment schedule based on ${paymentTerms}

Include these clauses in professional language:
- Late payment: 5% fee per week on overdue amounts
- Expense reimbursement: pre-approved expenses billed at cost
- Currency: USD

PROJECT CANCELLATION
If client cancels after work begins:
- Before 25% complete: 25% of total fee
- 25-50% complete: 50% of total fee
- After 50% complete: 75% of total fee
All work completed to date will be delivered upon receipt of cancellation fee.

INTELLECTUAL PROPERTY
Full ownership transfers to client only upon receipt of final payment in full.
Freelancer retains right to display work in portfolio unless client requests otherwise in writing.

ACCEPTANCE
This proposal is valid for 14 days from date above.
By signing below, both parties agree to the terms outlined in this proposal.

Client signature: _______________ Date: _______
${freelancerName} signature: _______ Date: _______

---
Prepared with ScopeLock · scopelock.dev
---

IMPORTANT FORMATTING RULES:
- Use clear section headers in CAPS
- Use dashes --- as dividers between sections
- Be specific, not generic
- Sound like a $5,000+ proposal, not a $500 one
- Every section should make the client think 'this person is a true professional'
- Total length: 600-900 words`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 3000,
        });

        const proposalContent =
            completion.choices[0]?.message?.content ?? "Failed to generate proposal.";

        // ── Parse price to number ──
        const numericPrice = parseFloat(
            price.replace(/[^0-9.]/g, "")
        ) || 0;

        // ── Save to Supabase ──
        const { data: project, error: insertError } = await supabase
            .from("projects")
            .insert({
                user_id: user.id,
                title,
                client_name: clientName,
                client_email: clientEmail,
                project_type: projectType,
                deliverables,
                timeline,
                price: numericPrice,
                revision_limit: revisionLimit,
                payment_terms: paymentTerms,
                proposal_content: proposalContent,
                status: "draft",
            })
            .select()
            .single();

        if (insertError) {
            console.error("Supabase insert error:", insertError);
            return NextResponse.json(
                { error: "Failed to save project: " + insertError.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            id: project.id,
            proposal: proposalContent,
        });
    } catch (error) {
        console.error("Generate proposal error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
