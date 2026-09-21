import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  validateImageInput,
  normalizeCategory,
  normalizeCondition,
  normalizeConfidence,
  normalizeCircularPath,
  toDomainResults,
  ValidationError,
} from '../../supabase/functions/_shared/validators';
import type { GeminiStructuredOutput } from '../../supabase/functions/_shared/types';
import { AppError } from '../services/api/apiError';
import { SupabaseAiService } from '../services/supabase/SupabaseAiService';
import { MockAiService } from '../services/mock/mockServices';
import { supabase } from '../lib/supabase/client';
import { env } from '../config/env';
import { PipelineStage } from '../types/ai';

describe('Gemini AI Multimodal System Test Suite', () => {
  describe('Image Input Validation (validateImageInput)', () => {
    // Standard minimal headers base64 encoded
    const validJpegBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
    const validPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const validWebpBase64 = 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==';

    it('accepts valid JPEG base64 payload', () => {
      const result = validateImageInput(validJpegBase64, 'image/jpeg');
      expect(result.cleanBase64).toBe(validJpegBase64);
      expect(result.validMimeType).toBe('image/jpeg');
    });

    it('accepts valid PNG base64 payload and extracts MIME from data URI', () => {
      const dataUri = `data:image/png;base64,${validPngBase64}`;
      const result = validateImageInput(dataUri);
      expect(result.cleanBase64).toBe(validPngBase64);
      expect(result.validMimeType).toBe('image/png');
    });

    it('accepts valid WebP base64 payload', () => {
      const result = validateImageInput(validWebpBase64, 'image/webp');
      expect(result.cleanBase64).toBe(validWebpBase64);
      expect(result.validMimeType).toBe('image/webp');
    });

    it('throws AI_INVALID_IMAGE if payload is missing', () => {
      expect(() => validateImageInput(undefined as unknown as string)).toThrowError(
        ValidationError
      );
      try {
        validateImageInput(undefined as unknown as string);
      } catch (e) {
        expect((e as ValidationError).code).toBe('AI_INVALID_IMAGE');
      }
    });

    it('throws AI_INVALID_IMAGE if payload is empty', () => {
      expect(() => validateImageInput('')).toThrow(ValidationError);
      try {
        validateImageInput('data:image/jpeg;base64,');
      } catch (e) {
        expect((e as ValidationError).code).toBe('AI_INVALID_IMAGE');
      }
    });

    it('throws AI_UNSUPPORTED_IMAGE if mime type is unsupported (e.g. image/gif)', () => {
      expect(() => validateImageInput(validJpegBase64, 'image/gif')).toThrow(ValidationError);
      try {
        validateImageInput(validJpegBase64, 'image/gif');
      } catch (e) {
        expect((e as ValidationError).code).toBe('AI_UNSUPPORTED_IMAGE');
        expect((e as ValidationError).status).toBe(415);
      }
    });

    it('throws AI_IMAGE_TOO_LARGE if image payload exceeds 10MB', () => {
      // 10MB limit in base64 is ~14.3MB string
      const hugeBase64 = 'A'.repeat(15 * 1024 * 1024);
      expect(() => validateImageInput(hugeBase64, 'image/jpeg')).toThrow(ValidationError);
      try {
        validateImageInput(hugeBase64, 'image/jpeg');
      } catch (e) {
        expect((e as ValidationError).code).toBe('AI_IMAGE_TOO_LARGE');
        expect((e as ValidationError).status).toBe(413);
      }
    });

    it('throws AI_UNSUPPORTED_IMAGE if magic bytes do not match supported image types', () => {
      const corruptedBase64 = 'AAAA1234567890abcdefg';
      expect(() => validateImageInput(corruptedBase64)).toThrow(ValidationError);
      try {
        validateImageInput(corruptedBase64);
      } catch (e) {
        expect((e as ValidationError).code).toBe('AI_UNSUPPORTED_IMAGE');
      }
    });
  });

  describe('Domain Normalization and Data Honesty', () => {
    it('normalizes categories accurately or defaults to Other', () => {
      expect(normalizeCategory('Wooden Dining Table')).toBe('Furniture');
      expect(normalizeCategory('Vintage Laptop Electronics')).toBe('Electronics');
      expect(normalizeCategory('Cotton T-Shirt apparel')).toBe('Clothing');
      expect(normalizeCategory('HDPE polymer bottle')).toBe('Plastic');
      expect(normalizeCategory('Corrugated cardboard box')).toBe('Paper');
      expect(normalizeCategory('Aluminum soda can')).toBe('Metal');
      expect(normalizeCategory('Glass jar')).toBe('Glass');
      expect(normalizeCategory('Unicorn horn')).toBe('Other');
      expect(normalizeCategory(null)).toBe('Other');
    });

    it('normalizes conditions accurately or defaults to Unknown', () => {
      expect(normalizeCondition('Fully working good condition')).toBe('Usable');
      expect(normalizeCondition('Needs repair and fixable')).toBe('Repairable');
      expect(normalizeCondition('Recyclable scraps')).toBe('Recyclable');
      expect(normalizeCondition('For component parts only')).toBe('Parts Only');
      expect(normalizeCondition('Mysterious entity')).toBe('Unknown');
      expect(normalizeCondition(123)).toBe('Unknown');
    });

    it('enforces Data Honesty: confidence scores strictly clamped between 0.10 and 0.98, NEVER 1.0', () => {
      // Raw 1.0 must be clamped to 0.98
      const perfectScore = normalizeConfidence('High', 1.0);
      expect(perfectScore.confidenceScore).toBe(0.98);
      expect(perfectScore.confidenceScore).toBeLessThan(1.0);
      expect(perfectScore.confidence).toBe('High');

      // Raw 0.999 must be clamped to 0.98
      const nearPerfectScore = normalizeConfidence('High', 0.999);
      expect(nearPerfectScore.confidenceScore).toBe(0.98);

      // Raw 0.01 must be clamped to 0.10
      const extremelyLow = normalizeConfidence('Low', 0.01);
      expect(extremelyLow.confidenceScore).toBe(0.10);
      expect(extremelyLow.confidence).toBe('Low');

      // Valid medium score preserved
      const normalScore = normalizeConfidence('Medium', 0.75);
      expect(normalScore.confidenceScore).toBe(0.75);
      expect(normalScore.confidence).toBe('Medium');
    });

    it('normalizes circular paths accurately or defaults to recycle', () => {
      expect(normalizeCircularPath('reuse')).toBe('reuse');
      expect(normalizeCircularPath('donate')).toBe('donate');
      expect(normalizeCircularPath('resell')).toBe('resell');
      expect(normalizeCircularPath('recycle')).toBe('recycle');
      expect(normalizeCircularPath('landfill')).toBe('recycle');
      expect(normalizeCircularPath(null)).toBe('recycle');
    });

    it('converts GeminiStructuredOutput to full domain results with 4 circular pathways', () => {
      const mockStructuredOutput: GeminiStructuredOutput = {
        detected_object: 'Ergonomic Office Chair',
        category: 'Furniture',
        material: 'Mesh and Polymer',
        condition: 'Usable',
        confidence: 'High',
        confidence_score: 0.92,
        quality_issues: ['Slight armrest scuff'],
        tags: ['office', 'chair', 'furniture'],
        recommended_value_path: 'reuse',
        summary_reasoning: 'Chair is mechanically intact and ergonomic for home office reuse.',
        paths_evaluation: {
          reuse: {
            title: 'Office Reuse',
            tagline: 'Keep in service',
            is_recommended: true,
            reasoning: ['All levers work smoothly'],
            potential_demand: 'High',
            estimated_effort: 'Low',
            recovery_potential: '100% item retention',
          },
          donate: {
            title: 'Nonprofit Donation',
            tagline: 'Equip a local student',
            is_recommended: false,
            reasoning: ['Accepted by community centers'],
            potential_demand: 'Moderate',
            estimated_effort: 'Moderate',
            recovery_potential: 'Direct utility',
          },
          resell: {
            title: 'Marketplace Resale',
            tagline: 'Secondary market listing',
            is_recommended: false,
            reasoning: ['Brand holds resale value'],
            potential_demand: 'Moderate',
            estimated_effort: 'High',
            recovery_potential: 'Recover economic value',
          },
          recycle: {
            title: 'Material Reclaim',
            tagline: 'Separate metals and plastics',
            is_recommended: false,
            reasoning: ['Disassembly required'],
            potential_demand: 'Low',
            estimated_effort: 'High',
            recovery_potential: 'Raw polymer salvage',
          },
        },
      };

      const { vision, value } = toDomainResults(mockStructuredOutput);

      expect(vision.detectedObject).toBe('Ergonomic Office Chair');
      expect(vision.category).toBe('Furniture');
      expect(vision.material).toBe('Mesh and Polymer');
      expect(vision.condition).toBe('Usable');
      expect(vision.confidence).toBe('High');
      expect(vision.confidenceScore).toBe(0.92);
      expect(vision.qualityIssues).toContain('Slight armrest scuff');

      expect(value.recommendedPath).toBe('reuse');
      expect(value.summaryReasoning).toContain('Chair is mechanically intact');
      expect(value.paths.reuse.isRecommended).toBe(true);
      expect(value.paths.donate.isRecommended).toBe(false);
      expect(value.paths.resell.isRecommended).toBe(false);
      expect(value.paths.recycle.isRecommended).toBe(false);
    });
  });

  describe('Edge Function AI Error Mapping (AppError.fromAiEdgeFunction)', () => {
    it('maps AI_AUTH_REQUIRED to 401 with sign-in advice', () => {
      const err = AppError.fromAiEdgeFunction({ code: 'AI_AUTH_REQUIRED' });
      expect(err.code).toBe('AI_AUTH_REQUIRED');
      expect(err.status).toBe(401);
      expect(err.recoveryAdvice?.suggestedRoute).toBe('/login');
    });

    it('maps AI_FORBIDDEN to 403', () => {
      const err = AppError.fromAiEdgeFunction({ code: 'AI_FORBIDDEN' });
      expect(err.code).toBe('AUTHORIZATION_ERROR');
      expect(err.status).toBe(403);
    });

    it('maps AI_INVALID_IMAGE to 400 with re-upload advice', () => {
      const err = AppError.fromAiEdgeFunction({ code: 'AI_INVALID_IMAGE' });
      expect(err.code).toBe('AI_INVALID_IMAGE');
      expect(err.status).toBe(400);
      expect(err.recoveryAdvice?.actionType).toBe('re-upload');
    });

    it('maps AI_IMAGE_TOO_LARGE to 413', () => {
      const err = AppError.fromAiEdgeFunction({ code: 'AI_IMAGE_TOO_LARGE' });
      expect(err.code).toBe('AI_IMAGE_TOO_LARGE');
      expect(err.status).toBe(413);
      expect(err.userMessage).toContain('10MB');
    });

    it('maps AI_UNSUPPORTED_IMAGE to 415', () => {
      const err = AppError.fromAiEdgeFunction({ code: 'AI_UNSUPPORTED_IMAGE' });
      expect(err.code).toBe('AI_UNSUPPORTED_IMAGE');
      expect(err.status).toBe(415);
      expect(err.userMessage).toContain('JPEG, PNG, or WebP');
    });

    it('maps AI_RATE_LIMITED to 429 with retry advice', () => {
      const err = AppError.fromAiEdgeFunction({ code: 'AI_RATE_LIMITED' });
      expect(err.code).toBe('AI_RATE_LIMITED');
      expect(err.status).toBe(429);
      expect(err.recoveryAdvice?.actionType).toBe('retry');
    });

    it('maps AI_TIMEOUT to 504', () => {
      const err = AppError.fromAiEdgeFunction({ code: 'AI_TIMEOUT' });
      expect(err.code).toBe('AI_TIMEOUT');
      expect(err.status).toBe(504);
    });

    it('maps AI_CONTENT_REJECTED to 422', () => {
      const err = AppError.fromAiEdgeFunction({ code: 'AI_CONTENT_REJECTED' });
      expect(err.code).toBe('AI_CONTENT_REJECTED');
      expect(err.status).toBe(422);
      expect(err.userMessage).toContain('safety guidelines');
    });

    it('maps AI_INVALID_OUTPUT to 502', () => {
      const err = AppError.fromAiEdgeFunction({ code: 'AI_INVALID_OUTPUT' });
      expect(err.code).toBe('AI_INVALID_OUTPUT');
      expect(err.status).toBe(502);
    });

    it('maps AI_PROVIDER_UNAVAILABLE to 503', () => {
      const err = AppError.fromAiEdgeFunction({ code: 'AI_PROVIDER_UNAVAILABLE', message: 'API key error' });
      expect(err.code).toBe('AI_PROVIDER_UNAVAILABLE');
      expect(err.status).toBe(503);
    });

    it('handles unknown arbitrary error safely without crashing', () => {
      const err = AppError.fromAiEdgeFunction(new Error('Network disconnected'));
      expect(err.code).toBe('AI_UNKNOWN_ERROR');
      expect(err.userMessage).toContain('AI analysis could not be completed');
    });
  });

  describe('SupabaseAiService Integration & Execution', () => {
    let aiService: SupabaseAiService;

    beforeEach(() => {
      aiService = new SupabaseAiService();
      vi.restoreAllMocks();
      vi.spyOn(supabase.auth, 'getUser').mockResolvedValue({
        data: { user: { id: 'test-user-id', email: 'user@test.com' } },
        error: null,
      } as never);
    });

    it('invokes supabase.functions.invoke("analyze-item") and triggers 5 progressive stages', async () => {
      const stagesReceived: PipelineStage[] = [];
      const onProgress = (progress: { stage: PipelineStage }) => {
        stagesReceived.push(progress.stage);
      };

      const mockFunctionResponse = {
        data: {
          vision: {
            detectedObject: 'Glass Bottle',
            category: 'Glass',
            material: 'Borosilicate Glass',
            condition: 'Usable',
            confidence: 'High',
            confidenceScore: 0.94,
            tags: ['bottle', 'glass'],
          },
          value: {
            recommendedPath: 'reuse',
            summaryReasoning: 'Intact bottle ideal for refill or repurpose.',
            paths: {
              reuse: {
                path: 'reuse',
                title: 'Reuse',
                tagline: 'Refill or repurpose',
                isRecommended: true,
                reasoning: ['Clean and unbroken'],
                potentialDemand: 'High',
                estimatedEffort: 'Low',
                recoveryPotential: '100%',
              },
              donate: {
                path: 'donate',
                title: 'Donate',
                tagline: 'Give to community kitchen',
                isRecommended: false,
                reasoning: ['Accepted by soup kitchens'],
                potentialDemand: 'Moderate',
                estimatedEffort: 'Moderate',
                recoveryPotential: 'Direct utility',
              },
              resell: {
                path: 'resell',
                title: 'Resell',
                tagline: 'Sell decorative glass',
                isRecommended: false,
                reasoning: ['Low resale price point'],
                potentialDemand: 'Low',
                estimatedEffort: 'High',
                recoveryPotential: 'Minimal cash',
              },
              recycle: {
                path: 'recycle',
                title: 'Recycle',
                tagline: 'Cullet remelt',
                isRecommended: false,
                reasoning: ['100% infinitely recyclable'],
                potentialDemand: 'High',
                estimatedEffort: 'Low',
                recoveryPotential: 'Material reclaim',
              },
            },
          },
          assessmentId: 'test-assessment-uuid',
        },
        error: null,
      };

      const mockInvoke = vi.fn().mockResolvedValue(mockFunctionResponse);
      vi.spyOn(supabase, 'functions', 'get').mockReturnValue({
        invoke: mockInvoke,
      } as never);

      const fakeBase64 = '/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';
      const fakeDataUri = `data:image/jpeg;base64,${fakeBase64}`;

      const result = await aiService.identifyItem(fakeDataUri, onProgress);

      expect(mockInvoke).toHaveBeenCalledWith(
        'analyze-item',
        expect.objectContaining({
          body: expect.objectContaining({
            imageBase64: fakeBase64,
            mimeType: 'image/jpeg',
          }),
        })
      );

      // Verify all 5 stages were fired
      expect(stagesReceived).toContain('detecting_object');
      expect(stagesReceived).toContain('identifying_material');
      expect(stagesReceived).toContain('assessing_condition');
      expect(stagesReceived).toContain('evaluating_value_paths');
      expect(stagesReceived).toContain('preparing_recommendation');

      expect(result.detectedObject).toBe('Glass Bottle');
      expect(result.confidenceScore).toBe(0.94);

      // Verify caching in recommendValuePaths
      const valueResult = await aiService.recommendValuePaths(result);
      expect(valueResult.recommendedPath).toBe('reuse');
      // Should NOT have called invoke a second time because value was cached
      expect(mockInvoke).toHaveBeenCalledTimes(1);
    });

    it('transforms Edge Function errors into typed AppError', async () => {
      const mockInvoke = vi.fn().mockResolvedValue({
        data: null,
        error: {
          message: 'Rate limit exceeded',
          context: {
            status: 429,
            json: async () => ({
              error: {
                code: 'AI_RATE_LIMITED',
                message: 'Too many requests to Gemini Vision API',
              },
            }),
          },
        },
      });
      vi.spyOn(supabase, 'functions', 'get').mockReturnValue({
        invoke: mockInvoke,
      } as never);

      const fakeDataUri = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

      await expect(aiService.identifyItem(fakeDataUri)).rejects.toThrow();

      try {
        await aiService.identifyItem(fakeDataUri);
      } catch (e) {
        expect(e).toBeInstanceOf(AppError);
        expect((e as AppError).code).toBe('AI_RATE_LIMITED');
      }
    });
  });

  describe('Mock AI Service Mode & Service Container', () => {
    it('MockAiService executes and triggers all 5 progressive pipeline stages', async () => {
      const mockService = new MockAiService();
      const stagesReceived: PipelineStage[] = [];

      const result = await mockService.identifyItem(
        'data:image/jpeg;base64,test',
        (progress) => stagesReceived.push(progress.stage)
      );

      expect(stagesReceived).toEqual([
        'detecting_object',
        'identifying_material',
        'assessing_condition',
        'evaluating_value_paths',
        'preparing_recommendation',
      ]);

      expect(result.detectedObject).toBeDefined();
      expect(result.category).toBeDefined();
      expect(result.condition).toBeDefined();
      expect(result.confidenceScore).toBeLessThan(1.0);

      const valueResult = await mockService.recommendValuePaths(result);
      expect(valueResult.recommendedPath).toBeDefined();
      expect(valueResult.paths.reuse).toBeDefined();
      expect(valueResult.paths.recycle).toBeDefined();
    });

    it('respects env.useMockServices when determining service behavior', () => {
      // In testing environment without VITE_SUPABASE_URL, useMockServices is true
      expect(env.useMockServices).toBe(true);
    });
  });
});
