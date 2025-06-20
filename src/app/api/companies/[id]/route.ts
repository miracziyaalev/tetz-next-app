import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Dynamic route olarak işaretle
export const dynamic = 'force-dynamic';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get('lang') || 'tr';
        const resolvedParams = await params;

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json(
                { success: false, message: 'Supabase configuration missing' },
                { status: 500 }
            );
        }

        const { data, error } = await createClient(supabaseUrl, supabaseKey)
            .rpc('get_company_details', {
                p_company_id: parseInt(resolvedParams.id),
                p_lang: lang
            });

        if (error) {
            console.error('Supabase error:', error);
            return NextResponse.json(
                { success: false, message: 'Şirket detayları alınamadı' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            company: data
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { success: false, message: 'Sunucu hatası' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const body = await request.json();
        const resolvedParams = await params;
        const companyId = parseInt(resolvedParams.id);

        console.log('PUT request - Company ID:', companyId);
        console.log('PUT request - Body:', JSON.stringify(body, null, 2));

        // Admin token'ını al
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.error('No admin token provided');
            return NextResponse.json(
                { success: false, message: 'Admin yetkisi gerekli' },
                { status: 401 }
            );
        }

        const adminToken = authHeader.split(' ')[1];

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            console.error('Supabase configuration missing');
            return NextResponse.json(
                { success: false, message: 'Supabase configuration missing' },
                { status: 500 }
            );
        }

        // Supabase RPC fonksiyonunu çağır
        console.log('Calling Supabase RPC with params:', {
            p_company_id: companyId,
            p_name: body.name,
            p_description: body.description,
            p_logo_url: body.logo_url || null,
            p_website_url: body.website_url || null,
            p_representative_info: body.representative_info || null,
            p_area_of_activity: body.area_of_activity || null,
            p_stand_number: body.stand_number || null,
            p_sponsorship_level: body.sponsorship_level || null,
            p_phone_number: body.phone_number || null,
            p_email: body.email || null,
            p_address: body.address,
            p_is_active: body.is_active
        });

        // Supabase client'ı admin token ile oluştur
        const supabaseWithAuth = createClient(supabaseUrl, supabaseKey, {
            global: {
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                }
            }
        });

        const { data, error } = await supabaseWithAuth
            .rpc('update_company', {
                p_company_id: companyId,
                p_name: body.name,
                p_description: body.description,
                p_logo_url: body.logo_url || null,
                p_website_url: body.website_url || null,
                p_representative_info: body.representative_info || null,
                p_area_of_activity: body.area_of_activity || null,
                p_stand_number: body.stand_number || null,
                p_sponsorship_level: body.sponsorship_level || null,
                p_phone_number: body.phone_number || null,
                p_email: body.email || null,
                p_address: body.address,
                p_is_active: body.is_active
            });

        console.log('Supabase RPC response - Data:', data);
        console.log('Supabase RPC response - Error:', error);

        if (error || (data && data.success === false)) {
            console.error('Supabase update error:', error || data);

            // Eğer RPC çalışmazsa, Edge Function'ı dene
            console.log('Trying Edge Function approach...');

            try {
                const edgeFunctionResponse = await fetch(`${supabaseUrl}/functions/v1/update-company`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        company_id: companyId,
                        name: body.name,
                        description: body.description,
                        logo_url: body.logo_url || null,
                        website_url: body.website_url || null,
                        representative_info: body.representative_info || null,
                        area_of_activity: body.area_of_activity || null,
                        stand_number: body.stand_number || null,
                        sponsorship_level: body.sponsorship_level || null,
                        phone_number: body.phone_number || null,
                        email: body.email || null,
                        address: body.address,
                        is_active: body.is_active
                    })
                });

                const edgeFunctionData = await edgeFunctionResponse.json();
                console.log('Edge Function response:', edgeFunctionData);

                if (edgeFunctionResponse.ok && edgeFunctionData.success) {
                    return NextResponse.json({
                        success: true,
                        message: 'Şirket başarıyla güncellendi',
                        company: edgeFunctionData.company
                    });
                } else {
                    throw new Error(edgeFunctionData.error || 'Edge Function hatası');
                }
            } catch (edgeError) {
                console.error('Edge Function error:', edgeError);
                return NextResponse.json(
                    { success: false, message: `Şirket güncellenemedi: ${error?.message || data?.message || 'Bilinmeyen hata'}` },
                    { status: 500 }
                );
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Şirket başarıyla güncellendi',
            company: data
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { success: false, message: 'Sunucu hatası' },
            { status: 500 }
        );
    }
} 