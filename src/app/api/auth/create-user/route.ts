import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    console.log('🔵 [CREATE-USER] API çağrısı başladı');

    try {
        const body = await request.json();
        const { email, password, full_name, title, institution, phone_number, is_in_education_sector, education_sector_type, user_state, user_province } = body;

        console.log('📝 [CREATE-USER] Gelen veriler:', {
            email,
            full_name,
            title,
            institution,
            phone_number,
            is_in_education_sector,
            education_sector_type,
            user_state,
            user_province,
            password: password ? '[GİZLİ]' : 'YOK'
        });

        // Session kontrolü için admin kullanıcının token'ını al
        const authHeader = request.headers.get('authorization');
        console.log('🔐 [CREATE-USER] Authorization header:', authHeader ? 'Mevcut' : 'YOK');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('❌ [CREATE-USER] Geçersiz authorization header');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        console.log('✅ [CREATE-USER] Token alındı:', token ? `${token.substring(0, 10)}...` : 'YOK');

        // Supabase Edge Function'a gönderilecek veriyi hazırla
        const requestData = {
            email,
            password,
            full_name,
            title,
            institution,
            phone_number,
            is_in_education_sector,
            education_sector_type: is_in_education_sector ? education_sector_type : null,
            user_state,
            user_province
        };

        console.log('📤 [CREATE-USER] Supabase Edge Function\'a gönderilecek veri:', {
            ...requestData,
            password: '[GİZLİ]',
            education_sector_type: requestData.education_sector_type || 'NULL'
        });

        // Supabase Edge Function'ı çağır
        console.log('🌐 [CREATE-USER] Supabase Edge Function çağrısı başlıyor...');
        const response = await fetch('https://yrdzcrunsaahbyalnryr.supabase.co/functions/v1/create-user', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        console.log('📡 [CREATE-USER] Supabase yanıt durumu:', response.status, response.statusText);

        const data = await response.json();
        console.log('📥 [CREATE-USER] Supabase yanıt verisi:', data);

        if (!response.ok) {
            console.error('❌ [CREATE-USER] Supabase hatası:', {
                status: response.status,
                statusText: response.statusText,
                error: data.error,
                data: data
            });
            return NextResponse.json({ error: data.error || 'Kullanıcı oluşturulamadı' }, { status: response.status });
        }

        console.log('✅ [CREATE-USER] Kullanıcı başarıyla oluşturuldu:', data);
        return NextResponse.json({ success: true, data });

    } catch (error) {
        console.error('💥 [CREATE-USER] Beklenmeyen hata:', {
            error: error instanceof Error ? error.message : 'Bilinmeyen hata',
            stack: error instanceof Error ? error.stack : undefined
        });
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
} 