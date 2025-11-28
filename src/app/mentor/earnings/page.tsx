'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SubNav, MENTOR_DASHBOARD_NAV } from '@/components/navigation/SubNav';
import { MentorService } from '@/services/mentor.service';

interface Payment {
  date: string;
  amount: number;
  student: string;
  status: string;
}

interface MonthlyData {
  month: string;
  earnings: number;
  sessions: number;
}

interface EarningsData {
  totalEarned: number;
  thisMonth: number;
  pending: number;
  sessionsThisMonth: number;
  averageRate: number;
  recentPayments: Payment[];
  monthlyBreakdown: MonthlyData[];
}

export default function MentorEarningsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [earningsData, setEarningsData] = useState<EarningsData | null>(null);
  const [isLoadingEarnings, setIsLoadingEarnings] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user?.id && user.role === 'mentor') {
      fetchEarningsData();
    }
  }, [user]);

  const fetchEarningsData = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingEarnings(true);

      // Get mentor profile to get hourly rate and correct ID
      const mentorProfile = await MentorService.getMentorProfileByUserId(user.id);
      if (!mentorProfile) return;

      // Get all sessions for this mentor using mentor profile ID
      const sessions = await MentorService.getSessions(mentorProfile.id, 'mentor');

      // Calculate earnings from completed sessions
      const completedSessions = sessions.filter(session => session.status === 'completed');

      // Get bookings to get payment information using mentor profile ID
      const bookings = await MentorService.getBookings(mentorProfile.id, 'mentor');

      // Calculate earnings
      let totalEarned = 0;
      let pendingAmount = 0;
      const recentPayments: any[] = [];
      const monthlyBreakdown: { [key: string]: { earnings: number; sessions: number } } = {};

      // Process completed sessions
      completedSessions.forEach(session => {
        const booking = bookings.find(b => b.id === session.bookingId);
        if (booking) {
          const amount = booking.amount;
          totalEarned += amount;

          if (booking.paymentStatus === 'paid') {
            recentPayments.push({
              date: session.scheduledDate,
              amount: amount,
              student: booking.studentName,
              status: 'paid'
            });
          } else if (booking.paymentStatus === 'pending') {
            pendingAmount += amount;
            recentPayments.push({
              date: session.scheduledDate,
              amount: amount,
              student: booking.studentName,
              status: 'pending'
            });
          }

          // Monthly breakdown
          const monthKey = new Date(session.scheduledDate).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          });

          if (!monthlyBreakdown[monthKey]) {
            monthlyBreakdown[monthKey] = { earnings: 0, sessions: 0 };
          }
          monthlyBreakdown[monthKey].earnings += amount;
          monthlyBreakdown[monthKey].sessions += 1;
        }
      });

      // Current month data
      const currentMonth = new Date().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      });

      const thisMonthEarnings = monthlyBreakdown[currentMonth]?.earnings || 0;
      const thisMonthSessions = monthlyBreakdown[currentMonth]?.sessions || 0;

      // Convert monthly breakdown to array
      const monthlyBreakdownArray = Object.entries(monthlyBreakdown)
        .map(([month, data]: [string, any]) => ({
          month,
          earnings: data.earnings,
          sessions: data.sessions
        }))
        .sort((a, b) => new Date(`01 ${a.month}`).getTime() - new Date(`01 ${b.month}`).getTime())
        .slice(-6); // Last 6 months

      setEarningsData({
        totalEarned,
        thisMonth: thisMonthEarnings,
        pending: pendingAmount,
        sessionsThisMonth: thisMonthSessions,
        averageRate: mentorProfile.hourlyRate,
        recentPayments: recentPayments.slice(0, 5), // Last 5 payments
        monthlyBreakdown: monthlyBreakdownArray
      });

    } catch (error) {
      console.error('Failed to fetch earnings data:', error);
    } finally {
      setIsLoadingEarnings(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading earnings..." />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  if (isLoadingEarnings) {
    return (
      <div className="section">
        <div className="section-container">
          <SubNav items={MENTOR_DASHBOARD_NAV} />
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner message="Loading earnings data..." />
          </div>
        </div>
      </div>
    );
  }

  const earnings = earningsData || {
    totalEarned: 0,
    thisMonth: 0,
    pending: 0,
    sessionsThisMonth: 0,
    averageRate: 0,
    recentPayments: [],
    monthlyBreakdown: []
  };

  return (
    <div className="section">
      <div className="section-container">
        <SubNav items={MENTOR_DASHBOARD_NAV} />

        <div className="section-header">
          <h1 className="section-title">Earnings</h1>
          <p className="section-subtitle">Track your mentoring income and payments</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">💰</div>
            <div className="text-2xl font-bold">${earnings.totalEarned.toFixed(2)}</div>
            <div className="text-gray-600">Total Earned</div>
          </div>
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">📅</div>
            <div className="text-2xl font-bold">${earnings.thisMonth.toFixed(2)}</div>
            <div className="text-gray-600">This Month</div>
          </div>
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">⏳</div>
            <div className="text-2xl font-bold">${earnings.pending.toFixed(2)}</div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="text-2xl font-bold">{earnings.sessionsThisMonth}</div>
            <div className="text-gray-600">Sessions This Month</div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-lg">
            <h2 className="text-xl font-semibold mb-4">Recent Payments</h2>
            <div className="space-y-4">
              {earnings.recentPayments.map((payment: Payment, index: number) => (
                <div key={index} className="flex justify-between items-center border-b pb-3">
                  <div>
                    <div className="font-medium">{payment.student}</div>
                    <div className="text-sm text-gray-600">{payment.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${payment.amount.toFixed(2)}</div>
                    <div className={`text-sm ${payment.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                      {payment.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-lg">
            <h2 className="text-xl font-semibold mb-4">Monthly Breakdown</h2>
            <div className="space-y-4">
              {earnings.monthlyBreakdown.map((month: MonthlyData, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{month.month}</div>
                    <div className="text-sm text-gray-600">{month.sessions} sessions</div>
                  </div>
                  <div className="font-semibold">${month.earnings.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-lg mt-6">
          <h2 className="text-xl font-semibold mb-4">Payment Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Hourly Rate</h3>
                <p className="text-sm text-gray-600">Current rate: ${earnings.averageRate}/hour</p>
              </div>
              <button className="button-secondary">
                Update Rate
              </button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Payment Method</h3>
                <p className="text-sm text-gray-600">PayPal - john.doe@email.com</p>
              </div>
              <button className="button-secondary">
                Change Method
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}