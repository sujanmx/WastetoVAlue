import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ScanFlowProvider } from './context/ScanFlowContext';
import { ErrorBoundary } from './components/feedback/ErrorBoundary';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ScanFlowProvider>
            <AppRoutes />
          </ScanFlowProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
