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
  const [_api, setApi] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push(`/auth/login?redirect=/video/${params.id}`);
      return;
    }

    // Initialize Jitsi meeting directly
    if (typeof window !== 'undefined' && window.JitsiMeetExternalAPI) {
      const domain = 'meet.jit.si';
      const options = {
        roomName: params.id,
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
      setApi(api);

      // Handle when user leaves the meeting
      api.addEventListener('videoConferenceLeft', () => {
        router.push('/dashboard');
      });

      return () => {
        if (api) {
          api.dispose();
        }
      };
    }
    return undefined;
  }, [user, params.id, router]);

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
                <p className="text-sm text-gray-500 mt-1">
                  Room: <span className="font-mono font-semibold">{params.id}</span>
                  {user?.role === 'mentor' && (
                    <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                      👨‍🏫 Mentor
                    </span>
                  )}
                </p>
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
