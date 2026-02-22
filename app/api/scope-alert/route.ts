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

        // ── Parse request data ──
        const body = await request.json();
        const {
            clientRequest,
            originalDeliverables,
            revisionLimit,
            revisionsUsed,
            price,
        } = body;

        if (!clientRequest) {
            return NextResponse.json(
                { error: "Client request is required" },
                { status: 400 }
            );
        }

        // ── Generate scope response via OpenAI ──
        const prompt = `You are helping a freelancer professionally respond to a client request that falls outside the agreed project scope.

Original deliverables: ${originalDeliverables}
Original price: ${price}
Revision limit: ${revisionLimit}
Revisions used: ${revisionsUsed}
Client's new request: ${clientRequest}

Write a professional email that:
1. Greets the client warmly by referencing the project
2. Acknowledges their request positively
3. Clearly explains this falls outside the original scope
4. Offers 2 options:
   Option A: Add as a change order (suggest a fair price based on the original project price)
   Option B: Defer to a future project
5. Keeps the door open and stays friendly
6. Signs off professionally

Tone: Confident, firm but friendly. Never apologetic for enforcing scope. Under 200 words.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.7,
            max_tokens: 500,
        });

        const emailContent =
            completion.choices[0]?.message?.content ??
            "Failed to generate response.";

        return NextResponse.json({ email: emailContent });
    } catch (error) {
        console.error("Scope alert error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
