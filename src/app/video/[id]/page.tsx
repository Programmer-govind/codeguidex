'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface VideoSessionPageProps {
    params: {
        id: string; // This is the videoRoomId
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
        // In a real app, we would verify the session exists and the user is a participant
        // For now, we'll just allow access if logged in
        if (!user) {
            router.push(`/auth/login?redirect=/video/${params.id}`);
            return;
        }
        setLoading(false);
    }, [user, params.id, router]);

    const handleJitsiLoad = () => {
        if (!user) return;

        const domain = 'meet.jit.si';
        const options = {
            roomName: params.id,
            width: '100%',
            height: '100%',
            parentNode: document.getElementById('jitsi-container'),
            userInfo: {
                displayName: user.displayName || 'User',
                email: user.email,
            },
            configOverwrite: {
                startWithAudioMuted: true,
                startWithVideoMuted: true,
                prejoinPageEnabled: false,
            },
            interfaceConfigOverwrite: {
                TOOLBAR_BUTTONS: [
                    'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                    'fodeviceselection', 'hangup', 'profile', 'chat', 'recording',
                    'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                    'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                    'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                    'security'
                ],
            },
        };

        const api = new window.JitsiMeetExternalAPI(domain, options);
        setApi(api);

        api.addEventListeners({
            videoConferenceLeft: () => {
                router.push('/dashboard/student/bookings'); // Or determine role and redirect accordingly
            },
        });
    };

    if (loading) return <LoadingSpinner fullPage message="Preparing session..." />;

    return (
        <div className="h-screen w-full bg-gray-900 flex flex-col">
            <Script
                src="https://meet.jit.si/external_api.js"
                onLoad={handleJitsiLoad}
            />

            <div className="flex-1 relative">
                <div id="jitsi-container" className="absolute inset-0 w-full h-full" />
            </div>
        </div>
    );
}
