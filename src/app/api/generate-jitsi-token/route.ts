import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    try {
        const { userName, userEmail, userId, avatarUrl, isModerator } = await request.json();

        const appId = process.env.NEXT_PUBLIC_JAAS_APP_ID;
        const privateKey = process.env.JAAS_PRIVATE_KEY;

        if (!appId || !privateKey) {
            return NextResponse.json(
                { error: 'JaaS credentials not configured' },
                { status: 500 }
            );
        }

        // Generate JWT token with user-specific information
        const payload = {
            aud: 'jitsi',
            iss: 'chat',
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (2 * 60 * 60), // 2 hours
            nbf: Math.floor(Date.now() / 1000) - 10,
            sub: appId,
            context: {
                features: {
                    livestreaming: false,
                    'file-upload': false,
                    'outbound-call': false,
                    'sip-outbound-call': false,
                    transcription: false,
                    'list-visitors': false,
                    recording: true, // Enable recording
                    flip: false,
                },
                user: {
                    'hidden-from-recorder': false,
                    moderator: isModerator || false,
                    name: userName,
                    id: userId || `user-${Date.now()}`,
                    avatar: avatarUrl || '',
                    email: userEmail,
                },
            },
            room: '*', // Allow access to all rooms
        };

        const token = jwt.sign(payload, privateKey, {
            algorithm: 'RS256',
            header: {
                kid: `${appId}/750172`, // Updated to use production identifier instead of SAMPLE_APP
                typ: 'JWT',
                alg: 'RS256',
            },
        });

        return NextResponse.json({ token });
    } catch (error: any) {
        console.error('Error generating JWT:', error);
        return NextResponse.json(
            { error: `Failed to generate token: ${error.message}` },
            { status: 500 }
        );
    }
}
