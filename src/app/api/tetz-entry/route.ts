import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const { p_user_id } = await request.json();

        // Debug: Gelen parametreleri logla
        console.log('🔍 TETZ Entry API - Gelen parametreler:', { p_user_id });

        if (!p_user_id) {
            console.log('❌ TETZ Entry API - Kullanıcı ID eksik');
            return NextResponse.json(
                { error: 'Kullanıcı ID\'si gerekli' },
                { status: 400 }
            );
        }

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        // Debug: Environment değişkenlerini kontrol et
        console.log('🔍 TETZ Entry API - Environment kontrolü:', {
            supabaseUrl: supabaseUrl ? '✅ Mevcut' : '❌ Eksik',
            supabaseAnonKey: supabaseAnonKey ? '✅ Mevcut' : '❌ Eksik'
        });

        if (!supabaseUrl || !supabaseAnonKey) {
            console.log('❌ TETZ Entry API - Supabase konfigürasyonu eksik');
            return NextResponse.json(
                { error: 'Supabase konfigürasyonu eksik' },
                { status: 500 }
            );
        }

        // Debug: Supabase API çağrısı öncesi
        console.log('🚀 TETZ Entry API - Supabase RPC çağrısı başlatılıyor:', {
            url: `${supabaseUrl}/rest/v1/rpc/tetz_entry`,
            userId: p_user_id,
            usingAnonKey: true
        });

        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/tetz_entry`, {
            method: 'POST',
            headers: {
                'apikey': supabaseAnonKey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                p_user_id: p_user_id
            }),
        });

        // Debug: Supabase yanıtını logla
        console.log('📡 TETZ Entry API - Supabase yanıtı:', {
            status: response.status,
            statusText: response.statusText,
            ok: response.ok
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ TETZ Entry API - Supabase RPC Error:', errorData);
            return NextResponse.json(
                { error: 'Giriş kaydı oluşturulamadı' },
                { status: response.status }
            );
        }

        const data = await response.json();

        // Debug: Başarılı yanıtı logla
        console.log('✅ TETZ Entry API - Başarılı yanıt:', data);

        return NextResponse.json({
            success: true,
            data: data
        });

    } catch (error) {
        console.error('💥 TETZ Entry API - Genel hata:', error);
        return NextResponse.json(
            { error: 'Sunucu hatası oluştu' },
            { status: 500 }
        );
    }
} 