import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { ScanFlowProvider, useScanFlowContext } from '../context/ScanFlowContext';
import { MockItemService, MockReceiverService } from '../services/mock/mockServices';
import { VisionAnalysisResult, ValueAiResult } from '../types/ai';

describe('ScanFlowContext Lifecycle & State Transitions', () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    React.createElement(ScanFlowProvider, null, children)
  );

  it('initializes with null state', () => {
    const { result } = renderHook(() => useScanFlowContext(), { wrapper });
    expect(result.current.imageData).toBeNull();
    expect(result.current.visionResult).toBeNull();
    expect(result.current.valueAiResult).toBeNull();
    expect(result.current.selectedValuePath).toBeNull();
    expect(result.current.selectedReceiver).toBeNull();
  });

  it('updates image data correctly', () => {
    const { result } = renderHook(() => useScanFlowContext(), { wrapper });
    act(() => {
      result.current.setImage({ previewUrl: 'blob:http://localhost/test-preview' });
    });
    expect(result.current.imageData?.previewUrl).toBe('blob:http://localhost/test-preview');
  });

  it('progresses through AI analysis and value path selection', () => {
    const { result } = renderHook(() => useScanFlowContext(), { wrapper });
    const mockVision: VisionAnalysisResult = {
      detectedObject: 'Oak Table',
      category: 'Furniture',
      material: 'Solid Oak',
      condition: 'Usable',
      confidence: 'High',
      confidenceScore: 0.95,
      tags: ['furniture', 'wood'],
    };

    const mockValue: ValueAiResult = {
      recommendedPath: 'reuse',
      summaryReasoning: 'Item is structurally sound and retains utility.',
      paths: {
        reuse: {
          path: 'reuse',
          title: 'Reuse',
          tagline: 'Keep in service',
          isRecommended: true,
          reasoning: ['Solid construction'],
          potentialDemand: 'High',
          estimatedEffort: 'Low',
          recoveryPotential: '100%',
        },
        donate: {
          path: 'donate',
          title: 'Donate',
          tagline: 'Pass to shelter',
          isRecommended: false,
          reasoning: ['Accepts furniture'],
          potentialDemand: 'Moderate',
          estimatedEffort: 'Moderate',
          recoveryPotential: 'Direct utility',
        },
        resell: {
          path: 'resell',
          title: 'Resell',
          tagline: 'Sell directly',
          isRecommended: false,
          reasoning: ['Market value'],
          potentialDemand: 'Low',
          estimatedEffort: 'High',
          recoveryPotential: 'Financial recovery',
        },
        recycle: {
          path: 'recycle',
          title: 'Recycle',
          tagline: 'Reclaim materials',
          isRecommended: false,
          reasoning: ['Downcycle wood'],
          potentialDemand: 'Low',
          estimatedEffort: 'Low',
          recoveryPotential: 'Material only',
        },
      },
    };

    act(() => {
      result.current.setVisionResult(mockVision);
      result.current.setValueAiResult(mockValue);
      result.current.selectValuePath('reuse');
    });

    expect(result.current.visionResult?.detectedObject).toBe('Oak Table');
    expect(result.current.valueAiResult?.recommendedPath).toBe('reuse');
    expect(result.current.selectedValuePath).toBe('reuse');
  });

  it('resets flow state completely on resetFlow', () => {
    const { result } = renderHook(() => useScanFlowContext(), { wrapper });
    act(() => {
      result.current.setImage({ previewUrl: 'blob:http://localhost/test-preview' });
      result.current.selectValuePath('donate');
    });
    expect(result.current.imageData).not.toBeNull();
    expect(result.current.selectedValuePath).toBe('donate');

    act(() => {
      result.current.resetFlow();
    });

    expect(result.current.imageData).toBeNull();
    expect(result.current.selectedValuePath).toBeNull();
    expect(result.current.visionResult).toBeNull();
  });
});

describe('Domain Mock Services Business Logic', () => {
  it('filters items by status and category', async () => {
    const itemService = new MockItemService();
    const allItems = await itemService.getItems();
    expect(allItems.length).toBeGreaterThan(0);

    const furnitureItems = await itemService.getItems({ category: 'Furniture' });
    expect(furnitureItems.every((i) => i.category === 'Furniture')).toBe(true);

    const completedItems = await itemService.getItems({ status: 'completed' });
    expect(completedItems.every((i) => i.status === 'completed')).toBe(true);
  });

  it('creates, retrieves, and deletes items', async () => {
    const itemService = new MockItemService();
    const created = await itemService.createItem({
      title: 'Test Office Chair',
      description: 'Used ergonomic chair',
      category: 'Furniture',
      material: 'Mesh and Metal',
      condition: 'Usable',
      imageUrl: 'https://example.com/chair.jpg',
      selectedValuePath: 'reuse',
    });

    expect(created.id).toBeDefined();
    expect(created.title).toBe('Test Office Chair');

    const fetched = await itemService.getItemById(created.id);
    expect(fetched.id).toBe(created.id);

    await itemService.deleteItem(created.id);
    await expect(itemService.getItemById(created.id)).rejects.toThrow();
  });

  it('matches receivers based on item attributes and circular value path', async () => {
    const receiverService = new MockReceiverService();
    const matches = await receiverService.matchReceivers({
      item: { category: 'Furniture' },
      valuePath: 'reuse',
    });

    expect(matches.length).toBeGreaterThan(0);
    expect(matches.every((r) => r.supportedValuePaths.includes('reuse'))).toBe(true);
  });
});
