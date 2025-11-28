import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { roomName } = await request.json();

        if (!roomName) {
            return NextResponse.json(
                { error: 'Room name is required' },
                { status: 400 }
            );
        }

        const apiKey = process.env.DAILY_API_KEY;

        if (!apiKey) {
            console.error('DAILY_API_KEY is not set in environment variables');
            return NextResponse.json(
                { error: 'Daily.co API key not configured' },
                { status: 500 }
            );
        }

        // Create a Daily.co room
        const response = await fetch('https://api.daily.co/v1/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                name: roomName,
                privacy: 'public',
                properties: {
                    enable_screenshare: true,
                    enable_chat: true,
                    start_video_off: false,
                    start_audio_off: false,
                    enable_recording: 'cloud',
                    max_participants: 10,
                },
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Daily.co API error:', error);
            return NextResponse.json(
                { error: 'Failed to create room' },
                { status: response.status }
            );
        }

        const room = await response.json();

        return NextResponse.json({
            roomUrl: room.url,
            roomName: room.name,
        });
    } catch (error: any) {
        console.error('Error creating Daily.co room:', error);
        return NextResponse.json(
            { error: `Failed to create room: ${error.message}` },
            { status: 500 }
        );
    }
}
