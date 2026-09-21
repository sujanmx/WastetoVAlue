import { env } from '../config/env';
import { IAuthService } from './interfaces/IAuthService';
import { IItemService } from './interfaces/IItemService';
import { IAiService } from './interfaces/IAiService';
import { IReceiverService } from './interfaces/IReceiverService';
import { IHandoverService } from './interfaces/IHandoverService';
import { IImpactService } from './interfaces/IImpactService';

// Mock service implementations (for offline/design testing)
import {
  MockAuthService,
  MockItemService,
  MockAiService,
  MockReceiverService,
  MockHandoverService,
  MockImpactService,
} from './mock/mockServices';

// Real Supabase service implementations
import { SupabaseAuthService } from './supabase/SupabaseAuthService';
import { SupabaseItemService } from './supabase/SupabaseItemService';
import { SupabaseAiService } from './supabase/SupabaseAiService';
import { SupabaseReceiverService } from './supabase/SupabaseReceiverService';
import { SupabaseHandoverService } from './supabase/SupabaseHandoverService';
import { SupabaseImpactService } from './supabase/SupabaseImpactService';

/**
 * Waste2Value Unified Service Container
 * Provides strict interface-driven access to backend services.
 * Dynamically wires either Supabase services (production) or design mock services (offline development).
 */
class ServiceContainer {
  public readonly auth: IAuthService;
  public readonly items: IItemService;
  public readonly ai: IAiService;
  public readonly receivers: IReceiverService;
  public readonly handover: IHandoverService;
  public readonly impact: IImpactService;

  constructor() {
    if (env.useMockServices) {
      this.auth = new MockAuthService();
      this.items = new MockItemService();
      this.ai = new MockAiService();
      this.receivers = new MockReceiverService();
      this.handover = new MockHandoverService();
      this.impact = new MockImpactService();
    } else {
      this.auth = new SupabaseAuthService();
      this.items = new SupabaseItemService();
      this.ai = new SupabaseAiService();
      this.receivers = new SupabaseReceiverService();
      this.handover = new SupabaseHandoverService();
      this.impact = new SupabaseImpactService();
    }
  }
}

export const services = new ServiceContainer();
export * from './api/apiError';
export type {
  IAuthService,
  IItemService,
  IAiService,
  IReceiverService,
  IHandoverService,
  IImpactService,
};
