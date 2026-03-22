# Food Donation Management System (FDMS) - Technical Specification

## 1. System Overview
The FDMS is a Next.js (v14) web application designed to connect food donors (e.g., restaurants, grocery stores) with recipients (e.g., shelters, individuals in need). The application utilizes Firebase for its backend services, including Authentication, Firestore for database management, and Storage for assets. The UI is built using React, Tailwind CSS, and Radix UI components for accessibility.

## 2. Architecture & Tech Stack
*   **Frontend Framework:** Next.js 14 (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, Radix UI (Headless UI components)
*   **State Management:** Zustand, React Context
*   **Backend & BaaS:** Firebase (Authentication, Firestore, Storage)
*   **Maps/Geolocation:** `@react-google-maps/api`, `geofire-common`
*   **Testing:** Vitest, Playwright

## 3. Current State Analysis
The project has a robust service layer (`lib/donation-service.ts`, `lib/auth.ts`, etc.) implemented with Firebase, but the frontend integration is currently incomplete.

### 3.1 Implemented (Service Layer)
*   **Authentication Service:** Email/Password & Google Sign-In.
*   **Donation Service:** Full CRUD lifecycle (Create, Reserve, Complete, Expire).
*   **Geospatial Search:** Ability to find donations by location (`geofire-common`).
*   **Notification Service:** Setup for notifications (FCM).

### 3.2 Incomplete/Missing (Frontend/Integration Layer)
*   **Mock Data Dependency:** Critical user flows, such as the `app/donor/dashboard/page.tsx`, rely on hardcoded `mockDonations` instead of querying the Firestore database.
*   **Donation Lifecycle UI:** The UI lacks clear actions to transition a donation state (e.g., Recipient clicking "Reserve", Donor confirming "Pickup Completed").
*   **RBAC Enforcement:** While the directory structure implies roles (`/admin`, `/donor`, `/recipient`), role-based routing and component rendering need strict enforcement (via `middleware.ts` and contexts) to prevent unauthorized access.
*   **Unutilized Services:** Advanced search and template features are available in the service layer but missing frontend interfaces.

## 4. Immediate Action Plan (The "One-Hour" Path to MVP)
To convert this partially finished project into a functional MVP, focus on connecting the existing UI components to the robust service layer.

### Task 1: Integrate Real Data in Donor Dashboard
*   **File:** `app/donor/dashboard/page.tsx`
*   **Action:** Remove `mockDonations`. Implement `useEffect` or React Query to call `getDonationsByDonorId(user.uid)` from `lib/donation-service.ts` and map the results to the dashboard UI.

### Task 2: Wire Up the Create Donation Form
*   **File:** Likely in `components/forms/` or `app/donor/donations/new/page.tsx` (or similar).
*   **Action:** Connect the form's `onSubmit` handler to the `createDonation` function in `lib/donation-service.ts`. Ensure image uploads are handled via Firebase Storage and the resulting URL is saved in the Firestore document.

### Task 3: Implement Recipient Reservation Flow
*   **File:** `app/donations/[id]/page.tsx` or `components/DonationCard.tsx`
*   **Action:** Add a "Reserve" button visible only to authenticated recipients. On click, trigger `reserveDonation(donationId, recipientId)` to change the status to 'Reserved' and update the UI accordingly.

### Task 4: Finalize Role-Based Navigation
*   **File:** `components/layout/` (MainLayout/Navigation) and `middleware.ts`.
*   **Action:** Verify that `middleware.ts` correctly redirects users based on their Firebase Custom Claims or Firestore User Role. Update navigation links to conditionally render based on the active user's role.

### Task 5: Automation (Expiry)
*   **File:** Firebase Functions (`functions/src/index.js`) or an API route `/api/cron/expire-donations`.
*   **Action:** Create a scheduled trigger to run `checkAndUpdateExpiredDonations()` periodically to maintain data accuracy.

## 5. Future Roadmap
*   Implement real-time chat between donors and recipients using Firestore real-time listeners.
*   Integrate push notifications via FCM for critical alerts (e.g., "Donation reserved", "Pickup soon").
*   Build out the Admin Dashboard (`app/admin/`) with analytics and user management interfaces.
*   Fully implement the Donation Templates feature to streamline regular donations.