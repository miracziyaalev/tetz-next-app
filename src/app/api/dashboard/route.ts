import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        // Environment variables kontrolü
        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('Missing Supabase environment variables');
            return NextResponse.json(
                {
                    success: false,
                    message: 'Server configuration error'
                },
                { status: 500 }
            );
        }

        // Authorization header'dan token'ı al
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Authorization token required"
                },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);

        // Supabase client oluştur
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Token'ı doğrula
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid token"
                },
                { status: 401 }
            );
        }

        // Dashboard verilerini al
        const response = await fetch("https://yrdzcrunsaahbyalnryr.supabase.co/rest/v1/rpc/get_user_stats", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZHpjcnVuc2FhaGJ5YWxucnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Nzk4MDYsImV4cCI6MjA2MjM1NTgwNn0.0fNVNUZvWkoqYcOr-i0sDRKW0FY_nLI2EczATyYIZ-c",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });

        console.log("Dashboard API yanıt durumu:", response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Dashboard API hata yanıtı:", errorText);

            return NextResponse.json(
                {
                    success: false,
                    message: "Dashboard verileri alınamadı",
                    error: errorText
                },
                { status: response.status }
            );
        }

        const dashboardData = await response.json();
        console.log("Dashboard verileri alındı:", dashboardData);

        // Başarılı yanıt
        return NextResponse.json({
            success: true,
            data: dashboardData
        }, { status: 200 });

    } catch (error) {
        console.error("Dashboard API hatası:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Sunucu hatası oluştu",
                error: error instanceof Error ? error.message : "Bilinmeyen hata"
            },
            { status: 500 }
        );
    }
} 