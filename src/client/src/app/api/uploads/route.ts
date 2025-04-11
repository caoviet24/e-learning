// /app/api/uploads/route.ts
import axios from 'axios';

export async function POST(request: Request) {
    const imgBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!imgBB_API_KEY) {
        return new Response(JSON.stringify({ error: 'Missing API key' }), { status: 500 });
    }

    const formData = await request.formData();

    try {
        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${imgBB_API_KEY}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );

        const url = response.data.data.url;
        return new Response(JSON.stringify({ url }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error: any) {
        console.error('Image upload failed:', error.response?.data || error.message);
        return new Response(JSON.stringify({ error: 'Failed to upload image' }), {
            status: 500,
        });
    }
}
