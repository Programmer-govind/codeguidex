# Mentor System Instructions

## Overview
The Mentor System has been fully implemented with the following features:
1.  **Find Mentors**: Browse and filter mentors by specialization, rating, and price.
2.  **Book Sessions**: Schedule 1:1 sessions with mentors.
3.  **Payments**: Secure payments via Stripe.
4.  **Video Calls**: Integrated Jitsi Meet video conferencing.
5.  **Dashboards**: Separate dashboards for students and mentors.

## URLs
-   **Find Mentors**: [http://localhost:3000/mentors](http://localhost:3000/mentors)
-   **Mentor Dashboard**: [http://localhost:3000/dashboard/mentor/bookings](http://localhost:3000/dashboard/mentor/bookings) (Redirects from /mentor/bookings)
-   **Student Dashboard**: [http://localhost:3000/dashboard/student/bookings](http://localhost:3000/dashboard/student/bookings)
-   **Apply to be a Mentor**: [http://localhost:3000/mentors/apply](http://localhost:3000/mentors/apply)

## Configuration Required

### Stripe
Ensure your `.env.local` file contains the following keys for payments to work:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
```

### Jitsi (Video)
No configuration is required. The system uses the free `meet.jit.si` public instance.

## How to Test

1.  **Create a Mentor Profile**:
    *   Log in.
    *   Go to [http://localhost:3000/mentors/apply](http://localhost:3000/mentors/apply).
    *   Fill out the form and submit.

2.  **Book a Session (as a Student)**:
    *   Log in with a *different* account (or the same one for testing).
    *   Go to [http://localhost:3000/mentors](http://localhost:3000/mentors).
    *   Click "Book Session" on a mentor card.
    *   Select details and proceed to payment.
    *   Use Stripe test card numbers (e.g., 4242 4242 4242 4242) to pay.

3.  **Join Video Session**:
    *   Go to your dashboard ([Student](http://localhost:3000/dashboard/student/bookings) or [Mentor](http://localhost:3000/dashboard/mentor/bookings)).
    *   Click "Join Session" or "Start Session".
    *   You will be connected via Jitsi.
