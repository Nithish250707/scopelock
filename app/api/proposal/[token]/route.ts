import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service role key (bypasses RLS) or fall back to REST API approach
function getSupabaseAdmin() {
    const key = supabaseServiceKey || supabaseAnonKey;
    return createClient(supabaseUrl, key, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
        // When using service role key, this bypasses RLS
        ...(supabaseServiceKey
            ? { global: { headers: { Authorization: `Bearer ${supabaseServiceKey}` } } }
            : {}),
    });
}

// Fallback: Use Supabase REST API directly when no service role key
async function fetchProjectByToken(token: string) {
    // Try with the admin client first
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
        .from("projects")
        .select(
            "id, title, client_name, project_type, deliverables, timeline, price, revision_limit, payment_terms, proposal_content, status, created_at, signed_at, client_signature"
        )
        .eq("signing_token", token)
        .single();

    if (!error && data) return data;

    // Fallback: Direct REST API call with apikey header
    const restUrl = `${supabaseUrl}/rest/v1/projects?signing_token=eq.${encodeURIComponent(token)}&select=id,title,client_name,project_type,deliverables,timeline,price,revision_limit,payment_terms,proposal_content,status,created_at,signed_at,client_signature&limit=1`;

    const res = await fetch(restUrl, {
        headers: {
            apikey: supabaseServiceKey || supabaseAnonKey,
            Authorization: `Bearer ${supabaseServiceKey || supabaseAnonKey}`,
            "Content-Type": "application/json",
            Prefer: "return=representation",
        },
    });

    if (!res.ok) return null;

    const rows = await res.json();
    return rows?.[0] || null;
}

async function updateProjectByToken(
    token: string,
    updates: Record<string, unknown>
) {
    // Try with the admin client first
    const supabase = getSupabaseAdmin();
    const { error } = await supabase
        .from("projects")
        .update(updates)
        .eq("signing_token", token);

    if (!error) return true;

    // Fallback: Direct REST API call
    const restUrl = `${supabaseUrl}/rest/v1/projects?signing_token=eq.${encodeURIComponent(token)}`;

    const res = await fetch(restUrl, {
        method: "PATCH",
        headers: {
            apikey: supabaseServiceKey || supabaseAnonKey,
            Authorization: `Bearer ${supabaseServiceKey || supabaseAnonKey}`,
            "Content-Type": "application/json",
            Prefer: "return=minimal",
        },
        body: JSON.stringify(updates),
    });

    return res.ok;
}

/* ── GET: Fetch proposal by signing token ── */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        if (!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 400 }
            );
        }

        const project = await fetchProjectByToken(token);

        if (!project) {
            return NextResponse.json(
                { error: "Proposal not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ project });
    } catch (error) {
        console.error("Fetch proposal error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/* ── POST: Sign the proposal ── */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ token: string }> }
) {
    try {
        const { token } = await params;

        if (!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 400 }
            );
        }

        const body = await request.json();
        const { clientSignature } = body;

        if (!clientSignature || !clientSignature.trim()) {
            return NextResponse.json(
                { error: "Signature is required" },
                { status: 400 }
            );
        }

        // First verify the project exists
        const existing = await fetchProjectByToken(token);

        if (!existing) {
            return NextResponse.json(
                { error: "Proposal not found" },
                { status: 404 }
            );
        }

        if (existing.status === "signed") {
            return NextResponse.json(
                { error: "This proposal has already been signed" },
                { status: 400 }
            );
        }

        // Update the project
        const success = await updateProjectByToken(token, {
            status: "signed",
            signed_at: new Date().toISOString(),
            client_signature: clientSignature.trim(),
        });

        if (!success) {
            return NextResponse.json(
                { error: "Failed to sign proposal" },
                { status: 500 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Sign proposal error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
