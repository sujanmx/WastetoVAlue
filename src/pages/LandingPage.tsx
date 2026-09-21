import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '../config/constants';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { useAuth } from '../hooks/useAuth';
import {
  ArrowRight,
  Sparkles,
  Camera,
  RefreshCw,
  HeartHandshake,
  DollarSign,
  Recycle,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(ROUTES.HOME);
    } else {
      navigate(ROUTES.SIGNUP);
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-primary-text flex flex-col selection:bg-soft-green selection:text-deep-forest overflow-x-hidden">
      {/* 1. Global Navigation Header */}
      <header className="sticky top-0 z-30 bg-surface/90 backdrop-blur-md border-b border-border">
        <div className="max-w-content w-full mx-auto px-4 xs:px-6 sm:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to={ROUTES.LANDING}
            className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green rounded-control"
            aria-label="Waste2Value Home"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-control bg-deep-forest text-white flex items-center justify-center font-bold text-base shadow-sm">
              W
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base sm:text-lg tracking-tight text-primary-text leading-none">
                Waste2Value
              </span>
              <span className="text-[10px] text-secondary-text hidden sm:inline-block leading-tight">
                Circular Platform
              </span>
            </div>
          </Link>

          {/* Desktop Nav Anchors (768px+) */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-secondary-text" aria-label="Main Navigation">
            <a href="#how-it-works" className="hover:text-primary-text transition-colors">
              How It Works
            </a>
            <a href="#value-paths" className="hover:text-primary-text transition-colors">
              Value Paths
            </a>
            <a href="#receivers" className="hover:text-primary-text transition-colors">
              Receivers
            </a>
            <a href="#impact" className="hover:text-primary-text transition-colors">
              Impact
            </a>
          </nav>

          {/* Header Action CTAs */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {isAuthenticated ? (
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                onClick={() => navigate(ROUTES.HOME)}
              >
                Go to Workspace
              </Button>
            ) : (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Sign in
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(ROUTES.SIGNUP)}
                  className="hidden xs:inline-flex"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-28 border-b border-border/70">
        <div className="max-w-content w-full mx-auto px-4 xs:px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Hero Content (7 cols on desktop) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-soft-green text-brand-green text-xs font-semibold tracking-wide border border-brand-green/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Circular Economy Operating System · Precision Eco-Tech</span>
              </div>

              <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary-text leading-[1.12]">
                Don't Throw It Away.
                <br />
                <span className="text-brand-green">Find Its Next Value.</span>
              </h1>

              <p className="text-base sm:text-lg text-secondary-text max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect discarded items to appropriate reuse centers, recyclers, donation partners, and buyers through transparent three-AI identification and matching.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button
                  size="lg"
                  variant="primary"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  onClick={handleGetStarted}
                >
                  Start with an Item
                </Button>
                <a href="#how-it-works" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="secondary"
                    fullWidth
                  >
                    See How It Works
                  </Button>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-border/70 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-secondary-text">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-green" />
                  <span>Free for households & community</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-green" />
                  <span>Verified local partner hubs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-brand-green" />
                  <span>Transparent CO₂ & diversion metrics</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Lifecycle Card (5 cols on desktop) */}
            <div className="lg:col-span-5 w-full max-w-md mx-auto lg:max-w-none">
              <Card className="p-5 sm:p-6 bg-surface shadow-raised border-border" variant="raised">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-brand-green animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                      Live AI Value Pipeline
                    </span>
                  </div>
                  <Badge variant="success" size="sm">
                    Verified Match
                  </Badge>
                </div>

                {/* Example Item Header */}
                <div className="flex items-start gap-3.5 mb-5 p-3 rounded-card bg-canvas border border-border">
                  <div className="w-12 h-12 rounded-control bg-soft-green text-deep-forest flex items-center justify-center font-bold text-lg flex-shrink-0">
                    🪑
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-sm font-bold text-primary-text truncate">
                      Solid Oak Dining Chair
                    </h2>
                    <p className="text-xs text-secondary-text">
                      Furniture · Solid Wood · Good Structural Condition
                    </p>
                  </div>
                </div>

                {/* 3 Step Timeline */}
                <div className="space-y-3.5 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
                  {/* Step 1: Vision AI */}
                  <div className="flex items-start gap-3 relative">
                    <div className="w-7 h-7 rounded-full bg-ai-vision-soft text-ai-vision border border-ai-vision/40 flex items-center justify-center text-xs font-bold z-10 flex-shrink-0">
                      1
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary-text">Vision AI</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-ai-vision-soft text-ai-vision font-mono font-medium">
                          94% Conf.
                        </span>
                      </div>
                      <p className="text-xs text-secondary-text mt-0.5">
                        Identified timber grade, joints, and zero dry rot.
                      </p>
                    </div>
                  </div>

                  {/* Step 2: Value AI */}
                  <div className="flex items-start gap-3 relative">
                    <div className="w-7 h-7 rounded-full bg-ai-value-soft text-ai-value border border-ai-value/40 flex items-center justify-center text-xs font-bold z-10 flex-shrink-0">
                      2
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary-text">Value AI</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-ai-value-soft text-ai-value font-semibold">
                          REUSE RECOMMENDED
                        </span>
                      </div>
                      <p className="text-xs text-secondary-text mt-0.5">
                        High repairability score avoids 18.4 kg CO₂ vs replacement.
                      </p>
                    </div>
                  </div>

                  {/* Step 3: Matching AI */}
                  <div className="flex items-start gap-3 relative">
                    <div className="w-7 h-7 rounded-full bg-ai-matching-soft text-ai-matching border border-ai-matching/40 flex items-center justify-center text-xs font-bold z-10 flex-shrink-0">
                      3
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-primary-text">Matching AI</span>
                        <span className="text-[10px] text-brand-green font-medium">
                          1.2 km away
                        </span>
                      </div>
                      <p className="text-xs text-secondary-text mt-0.5 font-medium text-primary-text">
                        The Upcycle Collective Hub · Drop-off open today
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-border">
                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={handleGetStarted}
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  >
                    Try With Your Own Item
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 3. The Three-AI Engine Section */}
      <section id="how-it-works" className="py-16 sm:py-20 lg:py-24 bg-surface border-b border-border scroll-mt-20">
        <div className="max-w-content w-full mx-auto px-4 xs:px-6 sm:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
            <Badge variant="default" size="sm" className="mb-3">
              The Engine
            </Badge>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-primary-text tracking-tight">
              Three Distinct AI Models.
              <br />
              <span className="text-brand-green">One Clear Circular Decision.</span>
            </h2>
            <p className="text-sm sm:text-base text-secondary-text mt-3 leading-relaxed">
              We never use a single black-box LLM. Waste2Value runs three specialized models in sequence with transparent confidence ratings.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Model 1: Vision AI */}
            <Card className="p-6 sm:p-7 border border-ai-vision/30 hover:border-ai-vision/60 transition-colors bg-surface" variant="raised">
              <div className="w-10 h-10 rounded-card bg-ai-vision-soft text-ai-vision flex items-center justify-center mb-4 border border-ai-vision/20">
                <Camera className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ai-vision mb-1">
                Model 1 · Vision AI
              </div>
              <h3 className="text-lg font-bold text-primary-text mb-2">
                "What is this?"
              </h3>
              <p className="text-sm text-secondary-text leading-relaxed mb-4">
                Identifies object geometry, primary materials (timber, metals, polymers), category classification, and signs of structural wear.
              </p>
              <ul className="space-y-1.5 text-xs text-secondary-text border-t border-border pt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-ai-vision" />
                  <span>Sub-second material detection</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-ai-vision" />
                  <span>Condition & quality flags</span>
                </li>
              </ul>
            </Card>

            {/* Model 2: Value AI */}
            <Card className="p-6 sm:p-7 border border-ai-value/30 hover:border-ai-value/60 transition-colors bg-surface" variant="raised">
              <div className="w-10 h-10 rounded-card bg-ai-value-soft text-ai-value flex items-center justify-center mb-4 border border-ai-value/20">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ai-value mb-1">
                Model 2 · Value AI
              </div>
              <h3 className="text-lg font-bold text-primary-text mb-2">
                "What should happen to it?"
              </h3>
              <p className="text-sm text-secondary-text leading-relaxed mb-4">
                Evaluates the four circular pathways against material longevity, repair cost, and ecological impact to recommend the best outcome.
              </p>
              <ul className="space-y-1.5 text-xs text-secondary-text border-t border-border pt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-ai-value" />
                  <span>Prioritizes reuse over downcycling</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-ai-value" />
                  <span>Explicit plain-language reasoning</span>
                </li>
              </ul>
            </Card>

            {/* Model 3: Matching AI */}
            <Card className="p-6 sm:p-7 border border-ai-matching/30 hover:border-ai-matching/60 transition-colors bg-surface" variant="raised">
              <div className="w-10 h-10 rounded-card bg-ai-matching-soft text-ai-matching flex items-center justify-center mb-4 border border-ai-matching/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ai-matching mb-1">
                Model 3 · Matching AI
              </div>
              <h3 className="text-lg font-bold text-primary-text mb-2">
                "Where can it go?"
              </h3>
              <p className="text-sm text-secondary-text leading-relaxed mb-4">
                Searches verified local community hubs, recyclers, donation centers, and buyers that specifically accept this item's material and condition.
              </p>
              <ul className="space-y-1.5 text-xs text-secondary-text border-t border-border pt-3">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-ai-matching" />
                  <span>Real operating hours & distance</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-ai-matching" />
                  <span>Scheduled drop-off & pickup</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. The Circular Value Matrix Section */}
      <section id="value-paths" className="py-16 sm:py-20 lg:py-24 bg-canvas border-b border-border scroll-mt-20">
        <div className="max-w-content w-full mx-auto px-4 xs:px-6 sm:px-8">
          <div className="max-w-2xl mx-auto text-center mb-12 sm:mb-16">
            <Badge variant="default" size="sm" className="mb-3">
              Circular Hierarchy
            </Badge>
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-primary-text tracking-tight">
              Four Practical Pathways.
              <br />
              <span className="text-brand-green">Zero Blind Landfill.</span>
            </h2>
            <p className="text-sm sm:text-base text-secondary-text mt-3 leading-relaxed">
              Every item is routed to preserve the highest environmental and economic utility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Reuse */}
            <Card className="p-6 bg-surface border-border flex flex-col justify-between" variant="raised">
              <div>
                <div className="w-10 h-10 rounded-control bg-soft-green text-brand-green flex items-center justify-center mb-4 font-bold">
                  <RefreshCw className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-brand-green mb-1">
                  Path 1 · Highest Value
                </div>
                <h3 className="text-lg font-bold text-primary-text mb-2">Reuse</h3>
                <p className="text-sm text-secondary-text leading-relaxed">
                  Keep functional items in circulation through community workshops, upcycling, repair cafes, and direct handovers.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border text-xs text-secondary-text">
                Best for: Furniture, tools, working appliances
              </div>
            </Card>

            {/* Donate */}
            <Card className="p-6 bg-surface border-border flex flex-col justify-between" variant="raised">
              <div>
                <div className="w-10 h-10 rounded-control bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center mb-4 font-bold">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#2563EB] mb-1">
                  Path 2 · Social Good
                </div>
                <h3 className="text-lg font-bold text-primary-text mb-2">Donate</h3>
                <p className="text-sm text-secondary-text leading-relaxed">
                  Channel gently used goods directly to vetted charities, non-profits, shelters, and educational programs.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border text-xs text-secondary-text">
                Best for: Clothing, books, usable housewares
              </div>
            </Card>

            {/* Resell */}
            <Card className="p-6 bg-surface border-border flex flex-col justify-between" variant="raised">
              <div>
                <div className="w-10 h-10 rounded-control bg-[#FEF3C7] text-[#D97706] flex items-center justify-center mb-4 font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-[#D97706] mb-1">
                  Path 3 · Value Recovery
                </div>
                <h3 className="text-lg font-bold text-primary-text mb-2">Resell</h3>
                <p className="text-sm text-secondary-text leading-relaxed">
                  Recover fair economic return by connecting with secondhand buyers, refurbished markets, and vintage collectors.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border text-xs text-secondary-text">
                Best for: Electronics, musical gear, vintage goods
              </div>
            </Card>

            {/* Recycle */}
            <Card className="p-6 bg-surface border-border flex flex-col justify-between" variant="raised">
              <div>
                <div className="w-10 h-10 rounded-control bg-soft-green/60 text-deep-forest flex items-center justify-center mb-4 font-bold">
                  <Recycle className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-deep-forest mb-1">
                  Path 4 · Material Circularity
                </div>
                <h3 className="text-lg font-bold text-primary-text mb-2">Recycle</h3>
                <p className="text-sm text-secondary-text leading-relaxed">
                  Route broken or end-of-life items to certified processors for high-grade material separation and re-smelting.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-border text-xs text-secondary-text">
                Best for: Scrap metals, e-waste, broken glass
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. Verified Receivers & Trust Section */}
      <section id="receivers" className="py-16 sm:py-20 lg:py-24 bg-surface border-b border-border scroll-mt-20">
        <div className="max-w-content w-full mx-auto px-4 xs:px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="space-y-6">
              <Badge variant="default" size="sm">
                Local Infrastructure
              </Badge>
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-primary-text tracking-tight">
                Verified Local Hubs.
                <br />
                <span className="text-brand-green">Real Drop-Off Logistics.</span>
              </h2>
              <p className="text-base text-secondary-text leading-relaxed">
                Waste2Value does not give vague advice like "recycle this." We match your exact material with real local facilities that have confirmed intake requirements, operating hours, and accepted conditions.
              </p>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-soft-green text-brand-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-primary-text">Live Operating Hours</h3>
                    <p className="text-xs text-secondary-text">Check if the partner hub is open right now before heading out.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-soft-green text-brand-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-primary-text">Verified Intake Standards</h3>
                    <p className="text-xs text-secondary-text">Avoid wasted trips: know exactly which materials and conditions are welcomed.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-soft-green text-brand-green flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-primary-text">Handover Scheduling</h3>
                    <p className="text-xs text-secondary-text">Coordinate drop-offs or direct pickups with real confirmation timelines.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Metric Demonstration */}
            <div id="impact" className="scroll-mt-20">
              <Card className="p-6 sm:p-8 bg-deep-forest text-white rounded-panel" variant="raised">
                <div className="flex items-center justify-between pb-4 border-b border-white/15">
                  <span className="text-xs font-semibold text-soft-green tracking-wider uppercase">
                    Platform Environmental Impact
                  </span>
                  <Badge variant="default" size="sm" className="bg-white/10 text-soft-green border-white/20">
                    Transparent Telemetry
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-6 my-6">
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                      12,450+
                    </div>
                    <div className="text-xs text-soft-green/80 mt-1">
                      Items Diverted from Landfill
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl sm:text-4xl font-bold tracking-tight text-soft-green">
                      48.6 t
                    </div>
                    <div className="text-xs text-soft-green/80 mt-1">
                      Estimated CO₂ Avoided
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-card bg-white/5 border border-white/10 text-xs text-soft-green/90 leading-relaxed space-y-2">
                  <p className="font-semibold text-white">Our Data Honesty Guarantee:</p>
                  <p>
                    All impact numbers are clearly labeled as measured or estimated based on EPA WARM conversion models. We never inflate statistics or hide methodology.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Entry Call to Action Banner */}
      <section className="py-16 sm:py-20 bg-canvas border-b border-border">
        <div className="max-w-3xl mx-auto px-4 xs:px-6 sm:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary-text">
            Ready to find your item's next value?
          </h2>
          <p className="text-base text-secondary-text leading-relaxed">
            Take a photo, let Vision AI understand its composition, and find the nearest verified circular destination in minutes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              size="lg"
              variant="primary"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={handleGetStarted}
            >
              Get Started Free
            </Button>
            {!isAuthenticated && (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Sign in to Account
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="py-10 bg-surface text-secondary-text text-xs border-t border-border">
        <div className="max-w-content w-full mx-auto px-4 xs:px-6 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-control bg-deep-forest text-white flex items-center justify-center font-bold text-xs">
              W
            </div>
            <span className="font-semibold text-primary-text">Waste2Value</span>
            <span>·</span>
            <span>Technical Minimalism + Precision Eco-Tech</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to={ROUTES.LOGIN} className="hover:text-primary-text transition-colors">
              Sign In
            </Link>
            <Link to={ROUTES.SIGNUP} className="hover:text-primary-text transition-colors">
              Sign Up
            </Link>
            <a href="#how-it-works" className="hover:text-primary-text transition-colors">
              Engine
            </a>
            <a href="#value-paths" className="hover:text-primary-text transition-colors">
              Value Matrix
            </a>
          </div>

          <div className="text-secondary-text/80">
            © {new Date().getFullYear()} Waste2Value · All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};
