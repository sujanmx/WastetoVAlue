import { IAuthService } from '../interfaces/IAuthService';
import { IItemService } from '../interfaces/IItemService';
import { IAiService } from '../interfaces/IAiService';
import { IReceiverService } from '../interfaces/IReceiverService';
import { IHandoverService } from '../interfaces/IHandoverService';
import { IImpactService } from '../interfaces/IImpactService';
import {
  MOCK_USER,
  MOCK_ITEMS,
  MOCK_RECEIVERS,
  MOCK_IMPACT,
  MOCK_IMPACT_HISTORY,
} from './mockData';
import {
  User,
  AuthSession,
  LoginCredentials,
  SignUpPayload,
  OnboardingPayload,
} from '../../types/auth';
import { WasteItem, CreateItemPayload, CircularValuePath } from '../../types/item';
import { Receiver, ReceiverFilters } from '../../types/receiver';
import {
  VisionAnalysisResult,
  ValueAiResult,
  PipelineProgress,
} from '../../types/ai';
import {
  HandoverRecord,
  ConfirmHandoverPayload,
} from '../../types/handover';
import { ImpactMetrics, ImpactActivityHistory } from '../../types/impact';
import { safeStorage } from '../../lib/storage';
import { AUTH_STORAGE_KEY } from '../../config/constants';
import { AppError } from '../api/apiError';

// Helper for realistic simulated network delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export class MockAuthService implements IAuthService {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    await delay(600);
    if (!credentials.email) {
      throw new AppError({
        message: 'Invalid email',
        code: 'AUTHENTICATION_ERROR',
        userMessage: 'Please enter a valid email address.',
      });
    }

    const session: AuthSession = {
      token: 'mock_jwt_token_' + Date.now(),
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      user: {
        ...MOCK_USER,
        email: credentials.email,
      },
    };

    safeStorage.setItem(AUTH_STORAGE_KEY, session);
    return session;
  }

  async signUp(payload: SignUpPayload): Promise<AuthSession> {
    await delay(700);
    const session: AuthSession = {
      token: 'mock_jwt_token_' + Date.now(),
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      user: {
        ...MOCK_USER,
        name: payload.name || 'New Member',
        email: payload.email,
        role: payload.role || 'household',
      },
    };
    safeStorage.setItem(AUTH_STORAGE_KEY, session);
    return session;
  }

  async loginWithGoogle(): Promise<AuthSession> {
    await delay(800);
    const session: AuthSession = {
      token: 'mock_google_jwt_' + Date.now(),
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      user: {
        ...MOCK_USER,
        name: 'Google User',
        email: 'user@gmail.com',
      },
    };
    safeStorage.setItem(AUTH_STORAGE_KEY, session);
    return session;
  }

  async logout(): Promise<void> {
    await delay(200);
    safeStorage.removeItem(AUTH_STORAGE_KEY);
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    await delay(150);
    return safeStorage.getItem<AuthSession>(AUTH_STORAGE_KEY);
  }

  async completeOnboarding(payload: OnboardingPayload): Promise<User> {
    await delay(400);
    const session = safeStorage.getItem<AuthSession>(AUTH_STORAGE_KEY);
    const updatedUser: User = {
      ...(session?.user || MOCK_USER),
      role: payload.role,
      preferences: {
        ...(session?.user.preferences || MOCK_USER.preferences),
        interests: payload.interests,
      },
      location: payload.location ? { city: payload.location } : session?.user.location,
    };
    if (session) {
      safeStorage.setItem(AUTH_STORAGE_KEY, { ...session, user: updatedUser });
    }
    return updatedUser;
  }

  async requestPasswordReset(_email: string): Promise<void> {
    await delay(500);
    // Silent success for security (do not disclose account existence)
  }

  async updatePassword(newPassword: string): Promise<void> {
    await delay(500);
    if (!newPassword || newPassword.length < 8) {
      throw AppError.validation('Password must be at least 8 characters.');
    }
    const session = safeStorage.getItem<AuthSession>(AUTH_STORAGE_KEY);
    if (session) {
      safeStorage.setItem(AUTH_STORAGE_KEY, { ...session });
    }
  }

  onAuthStateChange(_callback: (session: AuthSession | null, event?: string) => void): () => void {
    // No-op for mock service
    return () => {};
  }
}

export class MockItemService implements IItemService {
  private items: WasteItem[] = [...MOCK_ITEMS];

  async getItems(params?: { status?: string; category?: string }): Promise<WasteItem[]> {
    await delay(400);
    let result = [...this.items];
    if (params?.status && params.status !== 'all') {
      result = result.filter((i) => i.status === params.status);
    }
    if (params?.category) {
      result = result.filter((i) => i.category === params.category);
    }
    return result;
  }

  async getItemById(id: string): Promise<WasteItem> {
    await delay(300);
    const item = this.items.find((i) => i.id === id);
    if (!item) {
      throw new AppError({
        message: 'Item not found',
        code: 'NOT_FOUND',
        userMessage: "The requested item could not be found.",
      });
    }
    return item;
  }

  async createItem(payload: CreateItemPayload): Promise<WasteItem> {
    await delay(500);
    const newItem: WasteItem = {
      id: `item_${Date.now()}`,
      userId: MOCK_USER.id,
      title: payload.title,
      description: payload.description,
      category: payload.category,
      material: payload.material,
      condition: payload.condition,
      imageUrl: payload.imageUrl,
      isAiAssisted: false,
      aiConfidence: 'High',
      recommendedValuePath: payload.selectedValuePath || 'reuse',
      selectedValuePath: payload.selectedValuePath,
      receiverId: payload.receiverId,
      status: payload.receiverId ? 'receiver_found' : 'identified',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.items.unshift(newItem);
    return newItem;
  }

  async updateItem(id: string, updates: Partial<WasteItem>): Promise<WasteItem> {
    await delay(300);
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) {
      throw new AppError({ message: 'Item not found', code: 'NOT_FOUND' });
    }
    const updated = {
      ...this.items[index]!,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.items[index] = updated;
    return updated;
  }

  async deleteItem(id: string): Promise<void> {
    await delay(300);
    this.items = this.items.filter((i) => i.id !== id);
  }

  async getRecentItems(limit = 3): Promise<WasteItem[]> {
    await delay(250);
    return this.items.slice(0, limit);
  }
}

export class MockAiService implements IAiService {
  async identifyItem(
    _imageFileOrUrl: File | string,
    onProgress?: (progress: PipelineProgress) => void
  ): Promise<VisionAnalysisResult> {
    // Progressive feedback stages matching specification
    if (onProgress) {
      onProgress({
        stage: 'detecting_object',
        stageIndex: 1,
        totalStages: 5,
        label: 'Detecting object and geometry...',
      });
      await delay(250);
      onProgress({
        stage: 'identifying_material',
        stageIndex: 2,
        totalStages: 5,
        label: 'Identifying material and composition...',
      });
      await delay(250);
      onProgress({
        stage: 'assessing_condition',
        stageIndex: 3,
        totalStages: 5,
        label: 'Assessing structural condition...',
      });
      await delay(250);
      onProgress({
        stage: 'evaluating_value_paths',
        stageIndex: 4,
        totalStages: 5,
        label: 'Evaluating circular pathways...',
      });
      await delay(250);
      onProgress({
        stage: 'preparing_recommendation',
        stageIndex: 5,
        totalStages: 5,
        label: 'Preparing circular recommendations...',
      });
      await delay(200);
    } else {
      await delay(800);
    }

    return {
      detectedObject: 'Wooden Dining Chair',
      category: 'Furniture',
      material: 'Solid Oak Wood',
      condition: 'Usable',
      confidence: 'High',
      confidenceScore: 0.94,
      tags: ['furniture', 'timber', 'seating', 'solid-wood'],
    };
  }

  async recommendValuePaths(_visionResult: VisionAnalysisResult): Promise<ValueAiResult> {
    await delay(600);
    return {
      recommendedPath: 'reuse',
      summaryReasoning:
        'Based on structural integrity and timber construction, keeping this item in active use retains more practical value than downcycling materials.',
      paths: {
        reuse: {
          path: 'reuse',
          title: 'Reuse',
          tagline: 'Keep the item in active service',
          isRecommended: true,
          reasoning: [
            'Usable condition with sturdy frame and joints',
            'Solid oak timber retains aesthetic and functional value',
            'High local community demand for dining furniture',
          ],
          potentialDemand: 'High',
          estimatedEffort: 'Low',
          recoveryPotential: '100% item retention',
        },
        donate: {
          path: 'donate',
          title: 'Donate',
          tagline: 'Pass to non-profits and families in need',
          isRecommended: false,
          reasoning: [
            'Suitable for low-income home improvement shelters',
            'Requires immediate transport coordination',
          ],
          potentialDemand: 'Moderate',
          estimatedEffort: 'Moderate',
          recoveryPotential: 'Immediate social utility',
        },
        resell: {
          path: 'resell',
          title: 'Resell',
          tagline: 'Recover direct economic value',
          isRecommended: false,
          reasoning: [
            'Estimated secondary market value: $25–$45',
            'Listing and buyer negotiation required',
          ],
          potentialDemand: 'Moderate',
          estimatedEffort: 'High',
          recoveryPotential: 'Financial recovery',
        },
        recycle: {
          path: 'recycle',
          title: 'Recycle',
          tagline: 'Recover raw materials and fibers',
          isRecommended: false,
          reasoning: [
            'Material recovery is possible but downcycles usable furniture',
            'Should be treated as secondary option after direct reuse',
          ],
          potentialDemand: 'High',
          estimatedEffort: 'Low',
          recoveryPotential: 'Raw material recovery',
        },
      },
    };
  }
}

export class MockReceiverService implements IReceiverService {
  private receivers: Receiver[] = [...MOCK_RECEIVERS];

  async matchReceivers(params: {
    item: Partial<VisionAnalysisResult>;
    valuePath: CircularValuePath;
    filters?: ReceiverFilters;
  }): Promise<Receiver[]> {
    await delay(550);
    let matched = this.receivers.filter((r) =>
      r.supportedValuePaths.includes(params.valuePath)
    );

    if (params.item.category) {
      matched = matched.filter(
        (r) =>
          r.acceptedCategories.includes(params.item.category!) ||
          r.acceptedCategories.includes('Other')
      );
    }

    if (params.filters?.maxDistanceKm) {
      matched = matched.filter((r) => r.distanceKm <= params.filters!.maxDistanceKm!);
    }

    return matched;
  }

  async getReceivers(filters?: ReceiverFilters): Promise<Receiver[]> {
    await delay(350);
    let list = [...this.receivers];
    if (filters?.query) {
      const q = filters.query.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.typeLabel.toLowerCase().includes(q)
      );
    }
    if (filters?.valuePath) {
      list = list.filter((r) => r.supportedValuePaths.includes(filters.valuePath!));
    }
    if (filters?.category) {
      list = list.filter(
        (r) =>
          r.acceptedCategories.includes(filters.category!) ||
          r.acceptedCategories.includes('Other')
      );
    }
    if (filters?.maxDistanceKm) {
      list = list.filter((r) => r.distanceKm <= filters.maxDistanceKm!);
    }
    return list;
  }

  async getReceiverById(id: string): Promise<Receiver> {
    await delay(250);
    const receiver = this.receivers.find((r) => r.id === id);
    if (!receiver) {
      throw new AppError({
        message: 'Receiver not found',
        code: 'NOT_FOUND',
        userMessage: 'The selected receiver could not be found.',
      });
    }
    return receiver;
  }
}

export class MockHandoverService implements IHandoverService {
  async confirmHandover(payload: ConfirmHandoverPayload): Promise<HandoverRecord> {
    await delay(600);
    const receiver = MOCK_RECEIVERS.find((r) => r.id === payload.receiverId);
    return {
      id: `handover_${Date.now()}`,
      itemId: payload.itemId,
      itemTitle: 'Old Wooden Chair',
      itemCategory: 'Furniture',
      itemImageUrl:
        'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80',
      valuePath: payload.valuePath,
      receiverId: payload.receiverId,
      receiverName: receiver?.name || 'Community Partner',
      receiverAddress: receiver?.address || 'Community Hub',
      status: 'receiver_found',
      scheduledDate: payload.scheduledDate,
      handoverNotes: payload.notes,
      timeline: [
        {
          step: 'identified',
          label: 'Identified',
          description: 'Vision AI identified item and material properties',
          isCurrent: false,
          isCompleted: true,
          timestamp: new Date().toISOString(),
        },
        {
          step: 'value_selected',
          label: 'Value Path Selected',
          description: `Path set to ${payload.valuePath.toUpperCase()}`,
          isCurrent: false,
          isCompleted: true,
          timestamp: new Date().toISOString(),
        },
        {
          step: 'receiver_found',
          label: 'Receiver Selected',
          description: `Matched with ${receiver?.name || 'Receiver'}`,
          isCurrent: true,
          isCompleted: true,
          timestamp: new Date().toISOString(),
        },
        {
          step: 'handover_scheduled',
          label: 'Handover Scheduled',
          description: 'Coordinate physical drop-off or pickup',
          isCurrent: false,
          isCompleted: false,
        },
        {
          step: 'completed',
          label: 'Completed',
          description: 'Item transitioned to next circular lifecycle',
          isCurrent: false,
          isCompleted: false,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  async getHandoverById(_id: string): Promise<HandoverRecord> {
    await delay(300);
    return this.confirmHandover({
      itemId: 'item_01',
      receiverId: 'rec_01',
      valuePath: 'reuse',
    });
  }

  async getHandoverByItemId(itemId: string): Promise<HandoverRecord | null> {
    await delay(250);
    if (itemId === 'item_01') {
      return this.getHandoverById('mock');
    }
    return null;
  }

  async cancelHandover(_id: string): Promise<void> {
    await delay(300);
  }
}

export class MockImpactService implements IImpactService {
  async getPersonalImpact(): Promise<ImpactMetrics> {
    await delay(350);
    return MOCK_IMPACT;
  }

  async getImpactHistory(): Promise<ImpactActivityHistory[]> {
    await delay(400);
    return MOCK_IMPACT_HISTORY;
  }
}
