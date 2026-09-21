import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';

// Lightweight accessible route suspense fallback
const RouteLoader: React.FC = () => (
  <div className="w-full min-h-[50vh] flex flex-col items-center justify-center p-6 bg-canvas">
    <div className="w-8 h-8 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
    <span className="sr-only">Loading page...</span>
  </div>
);

// Lazy-loaded pages for high performance and route-level bundle splitting
const LandingPage = lazy(() => import('../pages/LandingPage').then((m) => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('../pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const SignUpPage = lazy(() => import('../pages/SignUpPage').then((m) => ({ default: m.SignUpPage })));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage })));
const OnboardingPage = lazy(() => import('../pages/OnboardingPage').then((m) => ({ default: m.OnboardingPage })));
const HomePage = lazy(() => import('../pages/HomePage').then((m) => ({ default: m.HomePage })));
const ScanPage = lazy(() => import('../pages/ScanPage').then((m) => ({ default: m.ScanPage })));
const ScanReviewPage = lazy(() => import('../pages/ScanReviewPage').then((m) => ({ default: m.ScanReviewPage })));
const ScanAnalyzePage = lazy(() => import('../pages/ScanAnalyzePage').then((m) => ({ default: m.ScanAnalyzePage })));
const ScanResultPage = lazy(() => import('../pages/ScanResultPage').then((m) => ({ default: m.ScanResultPage })));
const ReceiversPage = lazy(() => import('../pages/ReceiversPage').then((m) => ({ default: m.ReceiversPage })));
const ReceiverDetailPage = lazy(() => import('../pages/ReceiverDetailPage').then((m) => ({ default: m.ReceiverDetailPage })));
const ItemsPage = lazy(() => import('../pages/ItemsPage').then((m) => ({ default: m.ItemsPage })));
const ItemTrackPage = lazy(() => import('../pages/ItemTrackPage').then((m) => ({ default: m.ItemTrackPage })));
const CreateListingPage = lazy(() => import('../pages/CreateListingPage').then((m) => ({ default: m.CreateListingPage })));
const HandoverConfirmPage = lazy(() => import('../pages/HandoverConfirmPage').then((m) => ({ default: m.HandoverConfirmPage })));
const HandoverSuccessPage = lazy(() => import('../pages/HandoverSuccessPage').then((m) => ({ default: m.HandoverSuccessPage })));
const DiscoverPage = lazy(() => import('../pages/DiscoverPage').then((m) => ({ default: m.DiscoverPage })));
const ImpactPage = lazy(() => import('../pages/ImpactPage').then((m) => ({ default: m.ImpactPage })));
const ProfilePage = lazy(() => import('../pages/ProfilePage').then((m) => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const HelpPage = lazy(() => import('../pages/HelpPage').then((m) => ({ default: m.HelpPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })));

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<RouteLoader />}>
      <Routes>
        {/* Public Pages */}
        <Route path={ROUTES.LANDING} element={<LandingPage />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.SIGNUP} element={<SignUpPage />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

        {/* Onboarding */}
        <Route
          path={ROUTES.ONBOARDING}
          element={
            <ProtectedRoute>
              <OnboardingPage />
            </ProtectedRoute>
          }
        />

        {/* Protected Main Workspace (AppLayout) */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.SCAN} element={<ScanPage />} />
          <Route path={ROUTES.SCAN_REVIEW} element={<ScanReviewPage />} />
          <Route path={ROUTES.SCAN_ANALYZE} element={<ScanAnalyzePage />} />
          <Route path={ROUTES.SCAN_RESULT} element={<ScanResultPage />} />
          <Route path={ROUTES.RECEIVERS} element={<ReceiversPage />} />
          <Route path={ROUTES.RECEIVER_DETAIL} element={<ReceiverDetailPage />} />
          <Route path={ROUTES.ITEMS} element={<ItemsPage />} />
          <Route path={ROUTES.ITEM_DETAIL} element={<ItemTrackPage />} />
          <Route path={ROUTES.ITEM_TRACK} element={<ItemTrackPage />} />
          <Route path={ROUTES.CREATE_LISTING} element={<CreateListingPage />} />
          <Route path={ROUTES.HANDOVER_CONFIRM} element={<HandoverConfirmPage />} />
          <Route path={ROUTES.HANDOVER_SUCCESS} element={<HandoverSuccessPage />} />
          <Route path={ROUTES.DISCOVER} element={<DiscoverPage />} />
          <Route path={ROUTES.IMPACT} element={<ImpactPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
          <Route path={ROUTES.HELP} element={<HelpPage />} />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
