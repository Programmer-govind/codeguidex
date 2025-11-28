'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface VideoSessionPageProps {
    params: {
        id: string; // This is the unique room name
    };
}

declare global {
    interface Window {
        JitsiMeetExternalAPI: any;
    }
}

export default function VideoSessionPage({ params }: VideoSessionPageProps) {
    const router = useRouter();
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [jwtToken, setJwtToken] = useState<string | null>(null);
    const [_api, setApi] = useState<any>(null);

    useEffect(() => {
        if (!user) {
            router.push(`/auth/login?redirect=/video/${params.id}`);
            return;
        }

        // Generate JWT token for this specific user
        const generateToken = async () => {
            try {
                const response = await fetch('/api/generate-jitsi-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        roomName: params.id,
                        userName: user.displayName || user.email || 'User',
                        userEmail: user.email || '',
                        userId: user.id,
                        avatarUrl: '', // Can be added to User type later if needed
                        isModerator: user.role === 'mentor', // Only mentors are moderators
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Failed to generate token');
                }

                const { token } = await response.json();
                setJwtToken(token);
                setLoading(false);
            } catch (err: any) {
                console.error('Failed to generate JWT:', err);
                setError(`Failed to initialize video session: ${err.message}`);
                setLoading(false);
            }
        };

        generateToken();
    }, [user, params.id, router]);

    const handleJitsiLoad = () => {
        if (!user || !jwtToken) return;

        const appId = process.env.NEXT_PUBLIC_JAAS_APP_ID;

        // Create Jitsi meeting using JaaS with user-specific JWT
        const api = new window.JitsiMeetExternalAPI('8x8.vc', {
            roomName: `${appId}/${params.id}`,
            parentNode: document.querySelector('#jaas-container'),
            jwt: jwtToken, // User-specific JWT with their name, email, avatar
            configOverwrite: {
                startWithAudioMuted: false,
                startWithVideoMuted: false,
                prejoinPageEnabled: false,
                // Enable lobby mode - only moderator (mentor) can admit participants
                enableLobbyChat: user.role !== 'mentor', // Students wait in lobby
                disableLobby: user.role === 'mentor', // Mentors bypass lobby
            },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'profile', 'chat',
                    'settings', 'raisehand', 'videoquality', 'filmstrip',
                    'tileview', 'download', 'help', 'mute-everyone', 'security'
                ],
            },
        });

        setApi(api);

        // Handle when user leaves the meeting - redirect based on role
        api.addEventListener('videoConferenceLeft', () => {
            if (user.role === 'mentor') {
                router.push('/dashboard/mentor/bookings');
            } else {
                router.push('/dashboard/student/bookings');
            }
        });
    };

    if (loading) return <LoadingSpinner fullPage message="Preparing session..." />;

    if (error) {
        return (
            <div className="h-screen w-full bg-gray-900 flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <p className="text-red-500 mb-4">{error}</p>
                    <p className="text-gray-400 text-sm mb-4">
                        Make sure JAAS_PRIVATE_KEY is set in .env.local
                    </p>
                    <button
                        onClick={() => router.push(user?.role === 'mentor' ? '/dashboard/mentor/bookings' : '/dashboard/student/bookings')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                    >
                        Back to Bookings
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-gray-900 flex flex-col">
            <Script
                src={`https://8x8.vc/${process.env.NEXT_PUBLIC_JAAS_APP_ID}/external_api.js`}
                onLoad={handleJitsiLoad}
            />

            <div className="flex-1 relative">
                <div id="jaas-container" className="absolute inset-0 w-full h-full" />
            </div>
        </div>
    );
}
