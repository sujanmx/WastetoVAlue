import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { AuthProvider } from '../context/AuthContext';

describe('LandingPage Component & UX Specifications', () => {
  const renderLanding = () => {
    return render(
      <MemoryRouter>
        <AuthProvider>
          <LandingPage />
        </AuthProvider>
      </MemoryRouter>
    );
  };

  it('renders the official tagline and primary hero heading', () => {
    renderLanding();
    expect(
      screen.getByRole('heading', { level: 1, name: /Don't Throw It Away/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Find Its Next Value/i)).toBeInTheDocument();
  });

  it('renders brand identity and navigation links', () => {
    renderLanding();
    const brandElements = screen.getAllByText('Waste2Value');
    expect(brandElements.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('link', { name: 'How It Works' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Value Paths' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Receivers' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Impact' })).toBeInTheDocument();
  });

  it('explains the Three-AI engine (Vision AI, Value AI, Matching AI)', () => {
    renderLanding();
    expect(screen.getByText(/Model 1 · Vision AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Model 2 · Value AI/i)).toBeInTheDocument();
    expect(screen.getByText(/Model 3 · Matching AI/i)).toBeInTheDocument();
  });

  it('renders all 4 circular value pathways in the matrix', () => {
    renderLanding();
    expect(screen.getByRole('heading', { level: 3, name: 'Reuse' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Donate' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Resell' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Recycle' })).toBeInTheDocument();
  });

  it('provides accessible call-to-action buttons for guest entry', () => {
    renderLanding();
    const startButtons = screen.getAllByRole('button', { name: /Start with an Item|Get Started/i });
    expect(startButtons.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /^Sign in$/i })).toBeInTheDocument();
  });
});
