import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Şirket listesi için POST endpoint
export async function POST(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

        if (!supabaseUrl || !supabaseAnonKey) {
            return NextResponse.json({
                success: false,
                error: "Supabase config eksik"
            }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        const { p_lang } = await request.json();

        if (!p_lang) {
            return NextResponse.json({
                success: false,
                error: "p_lang zorunlu"
            }, { status: 400 });
        }

        // Supabase RPC çağrısı
        const { data, error } = await supabase.rpc("companies", { p_lang });

        if (error) {
            return NextResponse.json({
                success: false,
                error: error.message
            }, { status: 500 });
        }

        // Supabase RPC'den dönen data zaten bir response objesi içeriyor
        // Bu yüzden data.companies'i alıyoruz
        const companies = data?.companies || [];

        return NextResponse.json({
            success: true,
            code: "SUCCESS",
            message: "Companies fetched successfully.",
            companies: companies
        });
    } catch {
        return NextResponse.json({
            success: false,
            error: "Sunucu hatası"
        }, { status: 500 });
    }
} 