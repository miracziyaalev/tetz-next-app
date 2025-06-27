import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
    console.log('🔵 [LOCATION-REPORT] API çağrısı başladı');

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        // Environment variables kontrolü
        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('❌ [LOCATION-REPORT] Missing Supabase environment variables');
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
        console.log('🔐 [LOCATION-REPORT] Authorization header:', authHeader ? 'Mevcut' : 'YOK');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ [LOCATION-REPORT] Geçersiz authorization header');
            return NextResponse.json(
                {
                    success: false,
                    message: "Authorization token required"
                },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        console.log('✅ [LOCATION-REPORT] Token alındı:', token ? `${token.substring(0, 10)}...` : 'YOK');

        // Supabase client oluştur
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Token'ı doğrula
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.log('❌ [LOCATION-REPORT] Geçersiz token');
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid token"
                },
                { status: 401 }
            );
        }

        console.log('✅ [LOCATION-REPORT] Token doğrulandı, kullanıcı:', user.id);

        // Konum raporu verilerini al
        console.log('🚀 [LOCATION-REPORT] get_user_location_report RPC çağrısı başlatılıyor...');
        const response = await fetch("https://yrdzcrunsaahbyalnryr.supabase.co/rest/v1/rpc/get_user_location_report", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZHpjcnVuc2FhaGJ5YWxucnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Nzk4MDYsImV4cCI6MjA2MjM1NTgwNn0.0fNVNUZvWkoqYcOr-i0sDRKW0FY_nLI2EczATyYIZ-c",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });

        console.log("📡 [LOCATION-REPORT] RPC yanıt durumu:", response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ [LOCATION-REPORT] RPC hata yanıtı:", errorText);

            return NextResponse.json(
                {
                    success: false,
                    message: "Konum raporu verileri alınamadı",
                    error: errorText
                },
                { status: response.status }
            );
        }

        const locationReportData = await response.json();
        console.log("📥 [LOCATION-REPORT] Veriler alındı:", {
            report_count: locationReportData.report?.length || 0,
            success: locationReportData.success
        });

        // Başarılı yanıt
        console.log('✅ [LOCATION-REPORT] Başarılı yanıt döndürülüyor');
        return NextResponse.json({
            success: true,
            data: locationReportData
        }, { status: 200 });

    } catch (error) {
        console.error("💥 [LOCATION-REPORT] Beklenmeyen hata:", {
            error: error instanceof Error ? error.message : 'Bilinmeyen hata',
            stack: error instanceof Error ? error.stack : undefined
        });

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