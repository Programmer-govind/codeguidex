'use client';

import { useEffect, useState, useRef } from 'react';
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
    const [api, setApi] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const isInitialized = useRef(false); // Track if Jitsi has been initialized
    const [scriptLoaded, setScriptLoaded] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push(`/auth/login?redirect=/video/${params.id}`);
            return;
        }

        // Set loading to false once user is ready
        setLoading(false);
    }, [user, router, params.id]);

    useEffect(() => {
        // Initialize Jitsi meeting once user is ready, script is loaded, and not already initialized
        if (!loading && user && scriptLoaded && typeof window !== 'undefined' && window.JitsiMeetExternalAPI && !isInitialized.current) {
            handleJitsiLoad();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading, user, scriptLoaded]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (api) {
                console.log('Cleaning up Jitsi API');
                api.dispose();
            }
        };
    }, [api]);

    const handleJitsiLoad = () => {
        if (!user || isInitialized.current) {
            console.log('Jitsi already initialized or user not ready');
            return;
        }

        // Mark as initialized to prevent multiple calls
        isInitialized.current = true;

        try {
            const appId = process.env.NEXT_PUBLIC_JAAS_APP_ID;
            const jwtToken = process.env.NEXT_PUBLIC_JITSI_JWT;

            if (!appId) {
                console.error('JAAS App ID not configured');
                setError('Video service not configured properly');
                return;
            }

            // If JWT token is available, use JaaS with authentication
            if (jwtToken) {
                console.log('Using JaaS with JWT authentication');
                const api = new window.JitsiMeetExternalAPI('8x8.vc', {
                    roomName: `${appId}/${params.id}`,
                    parentNode: document.querySelector('#jaas-container'),
                    jwt: jwtToken,
                    configOverwrite: {
                        startWithAudioMuted: false,
                        startWithVideoMuted: false,
                        prejoinPageEnabled: true,
                        disableSimulcast: false,
                    },
                    interfaceConfigOverwrite: {
                        SHOW_JITSI_WATERMARK: false,
                        MOBILE_APP_PROMO: false,
                        TOOLBAR_BUTTONS: [
                            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                            'fodeviceselection', 'hangup', 'profile', 'chat',
                            'settings', 'raisehand', 'videoquality', 'filmstrip',
                            'tileview', 'download', 'help', 'mute-everyone', 'security'
                        ],
                    },
                });

                setApi(api);

                // Handle when user leaves the meeting
                api.addEventListener('videoConferenceLeft', () => {
                    if (user.role === 'mentor') {
                        router.push('/mentor/sessions');
                    } else {
                        router.push('/dashboard/student/bookings');
                    }
                });
            } else {
                // Fallback to free Jitsi Meet without authentication
                console.log('JWT not available, using free Jitsi Meet');
                const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
                    roomName: `codeguidex-${params.id}`,
                    parentNode: document.querySelector('#jaas-container'),
                    userInfo: {
                        email: user.email,
                        displayName: user.displayName || 'User',
                    },
                    configOverwrite: {
                        startWithAudioMuted: false,
                        startWithVideoMuted: false,
                        prejoinPageEnabled: true,
                        disableSimulcast: false,
                    },
                    interfaceConfigOverwrite: {
                        SHOW_JITSI_WATERMARK: false,
                        MOBILE_APP_PROMO: false,
                        TOOLBAR_BUTTONS: [
                            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                            'fodeviceselection', 'hangup', 'profile', 'chat',
                            'settings', 'raisehand', 'videoquality', 'filmstrip',
                            'tileview', 'download', 'help', 'mute-everyone', 'security'
                        ],
                    },
                });

                setApi(api);

                // Handle when user leaves the meeting
                api.addEventListener('videoConferenceLeft', () => {
                    if (user.role === 'mentor') {
                        router.push('/mentor/sessions');
                    } else {
                        router.push('/dashboard/student/bookings');
                    }
                });
            }
        } catch (error) {
            console.error('Error initializing Jitsi:', error);
            setError('Failed to initialize video session');
        }
    };

    if (loading) return <LoadingSpinner fullPage message="Preparing session..." />;

    if (error) {
        return (
            <div className="h-screen w-full flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md p-8">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-gray-900 flex flex-col">
            <Script
                src={
                    process.env.NEXT_PUBLIC_JITSI_JWT 
                        ? `https://8x8.vc/${process.env.NEXT_PUBLIC_JAAS_APP_ID}/external_api.js`
                        : "https://meet.jit.si/external_api.js"
                }
                onLoad={() => {
                    console.log('Jitsi script loaded');
                    setScriptLoaded(true);
                }}
                strategy="afterInteractive"
            />

            <div className="flex-1 relative">
                <div id="jaas-container" className="absolute inset-0 w-full h-full" />
            </div>
        </div>
    );
}
