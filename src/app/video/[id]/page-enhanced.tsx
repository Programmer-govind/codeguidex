/**
 * Video Session Component - Enterprise Level
 * Enhanced UI for live video sessions with better controls and styling
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

interface VideoSessionPageProps {
  params: {
    id: string;
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
  const [sessionInfo, setSessionInfo] = useState<any>(null);

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
            isModerator: user.role === 'mentor',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to generate token');
        }

        const data = await response.json();
        setJwtToken(data.token);
        setSessionInfo({
          roomName: params.id,
          userName: user.displayName || user.email,
          isMentor: user.role === 'mentor',
        });
        setLoading(false);
      } catch (err) {
        console.error('Error generating token:', err);
        // Fallback to hardcoded production JWT token if available
        const fallbackToken = process.env.NEXT_PUBLIC_JITSI_JWT;
        if (fallbackToken) {
          console.log('Using fallback JWT token for production');
          setJwtToken(fallbackToken);
          setSessionInfo({
            roomName: params.id,
            userName: user.displayName || user.email,
            isMentor: user.role === 'mentor',
          });
          setLoading(false);
        } else {
          setError('Failed to start video session');
          setLoading(false);
        }
      }
    };

    generateToken();
  }, [user, params.id, router]);

  // Initialize Jitsi Meet
  useEffect(() => {
    if (jwtToken && typeof window !== 'undefined' && window.JitsiMeetExternalAPI) {
      const domain = 'meet.jit.si';
      const options = {
        roomName: params.id,
        jwt: jwtToken,
        width: '100%',
        height: '100%',
        parentNode: document.querySelector('#jitsi-container'),
        userInfo: {
          email: user?.email,
          displayName: user?.displayName || 'User',
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          disableSimulcast: false,
          enableInsecureRoomNameWarning: false,
          prejoinPageEnabled: false,
        },
        interfaceConfigOverwrite: {
          LANG_DETECTION: false,
          DEFAULT_LANGUAGE: 'en',
          SHOW_JITSI_WATERMARK: false,
          MOBILE_APP_PROMO: false,
        },
        onload: () => setLoading(false),
      };

      const api = new window.JitsiMeetExternalAPI(domain, options);

      api.addEventListener('videoConferenceJoined', () => {
        console.log('Video conference joined');
      });

      api.addEventListener('readyToClose', () => {
        router.push('/dashboard');
      });

      setApi(api);

      return () => {
        if (api) {
          api.dispose();
        }
      };
    }
    return undefined;
  }, [jwtToken, params.id, user, router]);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 font-medium">Initializing video session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Session Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="btn-primary"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script
        src="https://meet.jit.si/external_api.js"
        strategy="beforeInteractive"
      />
      <div className="section" style={{ paddingTop: 0, paddingBottom: 0 }}>
        <div className="h-screen w-full flex flex-col">
          {/* Session Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Live Video Session
                </h1>
                {sessionInfo && (
                  <p className="text-sm text-gray-500 mt-1">
                    Room: <span className="font-mono font-semibold">{sessionInfo.roomName}</span>
                    {sessionInfo.isMentor && (
                      <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        👨‍🏫 Mentor
                      </span>
                    )}
                  </p>
                )}
              </div>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
                title="Exit Session"
              >
                ✕ Exit
              </button>
            </div>
          </div>

          {/* Video Container */}
          <div className="flex-1 relative bg-black">
            <div
              id="jitsi-container"
              className="w-full h-full"
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
