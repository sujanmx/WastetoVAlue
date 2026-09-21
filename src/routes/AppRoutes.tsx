import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '../components/layout/AppLayout';

// Pages
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { SignUpPage } from '../pages/SignUpPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { OnboardingPage } from '../pages/OnboardingPage';
import { HomePage } from '../pages/HomePage';
import { ScanPage } from '../pages/ScanPage';
import { ScanReviewPage } from '../pages/ScanReviewPage';
import { ScanAnalyzePage } from '../pages/ScanAnalyzePage';
import { ScanResultPage } from '../pages/ScanResultPage';
import { ReceiversPage } from '../pages/ReceiversPage';
import { ReceiverDetailPage } from '../pages/ReceiverDetailPage';
import { ItemsPage } from '../pages/ItemsPage';
import { ItemTrackPage } from '../pages/ItemTrackPage';
import { CreateListingPage } from '../pages/CreateListingPage';
import { HandoverConfirmPage } from '../pages/HandoverConfirmPage';
import { HandoverSuccessPage } from '../pages/HandoverSuccessPage';
import { DiscoverPage } from '../pages/DiscoverPage';
import { ImpactPage } from '../pages/ImpactPage';
import { ProfilePage } from '../pages/ProfilePage';
import { SettingsPage } from '../pages/SettingsPage';
import { HelpPage } from '../pages/HelpPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
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
  );
};
