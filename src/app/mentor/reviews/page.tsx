'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { SubNav, MENTOR_DASHBOARD_NAV } from '@/components/navigation/SubNav';
import { MentorService } from '@/services/mentor.service';
import { MentorReview } from '@/types/mentor.types';

export default function MentorReviewsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<MentorReview[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (user?.id && user.role === 'mentor') {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    if (!user?.id) return;

    try {
      setIsLoadingReviews(true);
      const mentorProfile = await MentorService.getMentorProfileByUserId(user.id);
      if (mentorProfile) {
        const fetchedReviews = await MentorService.getReviews(mentorProfile.id);
        setReviews(fetchedReviews);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setIsLoadingReviews(false);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-500' : 'text-gray-300'}>
        ★
      </span>
    ));
  };

  const calculateReviewStats = (reviews: MentorReview[]) => {
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;

    const ratingBreakdown = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews,
      ratingBreakdown,
      recentReviews: reviews.slice(0, 5) // Show last 5 reviews
    };
  };

  const reviewStats = calculateReviewStats(reviews);

  if (isLoadingReviews) {
    return (
      <div className="section">
        <div className="section-container">
          <SubNav items={MENTOR_DASHBOARD_NAV} />
          <div className="flex items-center justify-center py-20">
            <LoadingSpinner message="Loading reviews..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section-container">
        <SubNav items={MENTOR_DASHBOARD_NAV} />

        <div className="section-header">
          <h1 className="section-title">Reviews & Ratings</h1>
          <p className="section-subtitle">See what your students say about your mentoring</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">⭐</div>
            <div className="text-2xl font-bold">{reviewStats.averageRating}</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">📝</div>
            <div className="text-2xl font-bold">{reviewStats.totalReviews}</div>
            <div className="text-gray-600">Total Reviews</div>
          </div>
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">👍</div>
            <div className="text-2xl font-bold">{reviewStats.ratingBreakdown[5]}</div>
            <div className="text-gray-600">5-Star Reviews</div>
          </div>
          <div className="card-lg text-center">
            <div className="text-3xl mb-2">📈</div>
            <div className="text-2xl font-bold">95%</div>
            <div className="text-gray-600">Satisfaction Rate</div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="card-lg">
            <h2 className="text-xl font-semibold mb-4">Rating Breakdown</h2>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center space-x-3">
                  <span className="text-sm w-8">{stars}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${(reviewStats.ratingBreakdown[stars as keyof typeof reviewStats.ratingBreakdown] / reviewStats.totalReviews) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm w-8">{reviewStats.ratingBreakdown[stars as keyof typeof reviewStats.ratingBreakdown]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-lg">
            <h2 className="text-xl font-semibold mb-4">Recent Reviews</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {reviewStats.recentReviews.map((review: MentorReview) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{review.studentName}</span>
                      <div className="flex">{renderStars(review.rating)}</div>
                    </div>
                    <span className="text-sm text-gray-600">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Mentoring Session</p>
                  <p className="text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}