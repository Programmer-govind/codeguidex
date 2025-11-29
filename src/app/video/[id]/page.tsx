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
    const [_api, setApi] = useState<any>(null);

    useEffect(() => {
        if (!user) {
            router.push(`/auth/login?redirect=/video/${params.id}`);
            return;
        }

        // Initialize Jitsi meeting directly
        setLoading(false);
        if (typeof window !== 'undefined' && window.JitsiMeetExternalAPI) {
            handleJitsiLoad();
        }
    }, [user, params.id, router]);

    const handleJitsiLoad = () => {
        if (!user) return;

        const appId = process.env.NEXT_PUBLIC_JAAS_APP_ID;

        // Create Jitsi meeting using JaaS
        const api = new window.JitsiMeetExternalAPI('8x8.vc', {
            roomName: `${appId}/${params.id}`,
            parentNode: document.querySelector('#jaas-container'),
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
