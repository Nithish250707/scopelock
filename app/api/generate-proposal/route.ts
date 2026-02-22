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
        const prompt = `You are a professional freelance contract writer.
Generate a detailed project proposal for a freelancer.

Client Name: ${clientName}
Project Type: ${projectType}
Project Title: ${title}
Deliverables: ${deliverables}
Timeline: ${timeline}
Price: ${price}
Revisions Included: ${revisionLimit}
Payment Terms: ${paymentTerms}

Write a proposal with these exact sections:
1. Project Overview (2-3 sentences)
2. Scope of Work (detailed bullet points of what IS included)
3. What Is NOT Included (4-5 specific exclusions for this project type — be very specific)
4. Revision Policy (firm language referencing the exact revision limit)
5. Timeline & Milestones
6. Investment & Payment Schedule (include 5% late payment fee per week)
7. Project Kill Fee (50% of remaining balance if client cancels)

Tone: Professional, confident, protective of freelancer.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 2000,
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
