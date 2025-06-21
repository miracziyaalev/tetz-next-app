import { NextRequest, NextResponse } from "next/server";
import { createClient } from '@supabase/supabase-js';

export async function GET(request: NextRequest) {
    console.log('🔵 [DASHBOARD] API çağrısı başladı');

    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        // Environment variables kontrolü
        if (!supabaseUrl || !supabaseServiceKey) {
            console.error('❌ [DASHBOARD] Missing Supabase environment variables');
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
        console.log('🔐 [DASHBOARD] Authorization header:', authHeader ? 'Mevcut' : 'YOK');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ [DASHBOARD] Geçersiz authorization header');
            return NextResponse.json(
                {
                    success: false,
                    message: "Authorization token required"
                },
                { status: 401 }
            );
        }

        const token = authHeader.substring(7);
        console.log('✅ [DASHBOARD] Token alındı:', token ? `${token.substring(0, 10)}...` : 'YOK');

        // Supabase client oluştur
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Token'ı doğrula
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            console.log('❌ [DASHBOARD] Geçersiz token');
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid token"
                },
                { status: 401 }
            );
        }

        console.log('✅ [DASHBOARD] Token doğrulandı, kullanıcı:', user.id);

        // Dashboard verilerini al
        console.log('🚀 [DASHBOARD] get_user_stats RPC çağrısı başlatılıyor...');
        const response = await fetch("https://yrdzcrunsaahbyalnryr.supabase.co/rest/v1/rpc/get_user_stats", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZHpjcnVuc2FhaGJ5YWxucnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3Nzk4MDYsImV4cCI6MjA2MjM1NTgwNn0.0fNVNUZvWkoqYcOr-i0sDRKW0FY_nLI2EczATyYIZ-c",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({})
        });

        console.log("📡 [DASHBOARD] RPC yanıt durumu:", response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ [DASHBOARD] RPC hata yanıtı:", errorText);

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
        console.log("📥 [DASHBOARD] Veriler alındı:", {
            general_stats: dashboardData.general_stats,
            fair_activity_stats: dashboardData.fair_activity_stats,
            location_stats_count: dashboardData.location_stats?.top_10_states?.length || 0,
            registration_trends_count: dashboardData.registration_trends?.daily_registrations_last_14_days?.length || 0,
            education_sector_stats: dashboardData.education_sector_stats
        });

        // TETZ entries verilerini özel olarak logla
        if (dashboardData.fair_activity_stats) {
            console.log("🎯 [DASHBOARD] TETZ Entries İstatistikleri:", {
                tetz_entries_today: dashboardData.fair_activity_stats.tetz_entries_today || 0,
                total_tetz_entries: dashboardData.fair_activity_stats.total_tetz_entries || 0,
                gate_entries_today: dashboardData.fair_activity_stats.gate_entries_today || 0
            });
        }

        // Bugünkü giriş istatistiklerini özel olarak logla
        console.log("📊 [DASHBOARD] Bugünkü Giriş İstatistikleri:", {
            tetz_entries_today: dashboardData.fair_activity_stats?.tetz_entries_today || 0,
            gate_entries_today: dashboardData.fair_activity_stats?.gate_entries_today || 0
        });

        // Başarılı yanıt
        console.log('✅ [DASHBOARD] Başarılı yanıt döndürülüyor');
        return NextResponse.json({
            success: true,
            data: dashboardData
        }, { status: 200 });

    } catch (error) {
        console.error("💥 [DASHBOARD] Beklenmeyen hata:", {
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