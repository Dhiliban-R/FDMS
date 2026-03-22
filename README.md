# Food Donation Management System (FDMS)

FDMS is a modern, responsive web application designed to connect food donors (restaurants, grocers, individuals) with recipients (shelters, food banks, individuals in need). The application streamlines the donation lifecycle from creation to reservation and pickup, helping reduce food waste and support communities.

Built with **Next.js 14**, **Tailwind CSS**, and **Firebase**, FDMS offers real-time updates, geospatial search for nearby donations, and a role-based dashboard system.

---

## 🚀 Features

### **Donor Capabilities**
*   **Donation Management:** Create, view, update, and manage active donations.
*   **Image Uploads:** Attach photos of food donations (handled securely via Firebase Storage).
*   **Templates (Coming Soon):** Quickly re-create recurring donations.

### **Recipient Capabilities**
*   **Geospatial Search:** Find available food donations nearby using interactive maps (Google Maps API).
*   **Reservation System:** Securely reserve a donation for pickup.
*   **Status Tracking:** Monitor the status of reservations from 'Active' to 'Completed'.

### **System Features**
*   **Role-Based Access Control (RBAC):** Secure routing and tailored dashboards for Donors, Recipients, and Admins.
*   **Automated Expiry:** System automatically manages the lifecycle of expired donations.
*   **Modern UI/UX:** Built with Tailwind CSS and Radix UI components for an accessible, responsive experience.

---

## 🛠️ Technology Stack

*   **Frontend:** Next.js 14 (App Router), React, TypeScript
*   **Styling:** Tailwind CSS, Radix UI (Headless components)
*   **Backend / Database:** Firebase (Authentication, Firestore, Storage)
*   **Maps:** `@react-google-maps/api`, `geofire-common`
*   **State Management:** Zustand, React Context
*   **Testing:** Vitest, Playwright

---

## 💻 Getting Started

### 1. Prerequisites

Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   npm (or yarn/pnpm)
*   A Firebase project configured (see step 3)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/fdms.git
cd fdms
npm install
```

### 3. Environment Setup

Copy the example environment file and configure it with your credentials:

```bash
npm run setup:env
# This copies .env.example to .env.local
```

Open `.env.local` and add your specific Firebase and Google Maps API keys:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google Maps API
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### 4. Running the Development Server

Start the Next.js development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## 🧪 Testing

The project uses Vitest for unit/integration tests and Playwright for end-to-end (E2E) testing.

```bash
# Run all unit tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run End-to-End tests
npm run test:e2e

# Run all verification scripts (type-checking, linting, tests)
npm run test:all
```

---

## 🏗️ Project Structure

*   `/app`: Next.js App Router pages and layouts (organized by roles like `/admin`, `/donor`, `/recipient`).
*   `/components`: Reusable React components (UI elements, forms, maps).
*   `/lib`: Core business logic, Firebase services (`donation-service.ts`, `auth.ts`), and utility functions.
*   `/contexts`: React Context providers for global state (Auth, Notifications).
*   `/hooks`: Custom React hooks for encapsulating logic.
*   `/e2e`: Playwright end-to-end testing scripts.

---

## 🚦 Roadmap to MVP (The "One-Hour" Fix List)

This project is currently in a transitional state. The backend services are implemented, but the frontend needs final integration. To turn this into a fully functional MVP within an hour, complete the following:

1.  **Replace Mock Data:** Update `app/donor/dashboard/page.tsx` to fetch real data using the `getDonationsByDonorId` service instead of hardcoded `mockDonations`.
2.  **Wire Up Creation:** Connect the "Create Donation" form to the `createDonation` function in `lib/donation-service.ts`.
3.  **Implement Reservations:** Add a functional "Reserve" button on the donation details page (`app/donations/[id]/page.tsx`) utilizing `reserveDonation`.
4.  **Enforce RBAC:** Verify that `middleware.ts` correctly prevents recipients from accessing `/donor` routes and vice versa. Update the main navigation to conditionally render based on the user's role.
5.  **Automate Expiry:** Implement a scheduled task (e.g., Firebase Cloud Function) to run `checkAndUpdateExpiredDonations`.

See `TECHNICAL_SPECIFICATION.md` for a detailed breakdown of the current architecture and integration steps.

---

## 📄 License

This project is licensed under the MIT License.