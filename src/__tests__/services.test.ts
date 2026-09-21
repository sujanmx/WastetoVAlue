import { describe, it, expect } from 'vitest';
import { services } from '../services';

describe('Service Container Contract Verification', () => {
  it('instantiates all domain services required by the architectural contract', () => {
    expect(services.auth).toBeDefined();
    expect(services.items).toBeDefined();
    expect(services.ai).toBeDefined();
    expect(services.receivers).toBeDefined();
    expect(services.handover).toBeDefined();
    expect(services.impact).toBeDefined();
  });

  it('exposes expected contract methods on auth service', () => {
    expect(typeof services.auth.login).toBe('function');
    expect(typeof services.auth.signUp).toBe('function');
    expect(typeof services.auth.logout).toBe('function');
    expect(typeof services.auth.getCurrentSession).toBe('function');
    expect(typeof services.auth.completeOnboarding).toBe('function');
    expect(typeof services.auth.onAuthStateChange).toBe('function');
  });

  it('exposes expected contract methods on items service', () => {
    expect(typeof services.items.getItems).toBe('function');
    expect(typeof services.items.getItemById).toBe('function');
    expect(typeof services.items.createItem).toBe('function');
    expect(typeof services.items.updateItem).toBe('function');
    expect(typeof services.items.deleteItem).toBe('function');
  });

  it('exposes expected contract methods on ai service', () => {
    expect(typeof services.ai.identifyItem).toBe('function');
    expect(typeof services.ai.recommendValuePaths).toBe('function');
  });

  it('exposes expected contract methods on receivers service', () => {
    expect(typeof services.receivers.getReceivers).toBe('function');
    expect(typeof services.receivers.getReceiverById).toBe('function');
  });

  it('exposes expected contract methods on handover service', () => {
    expect(typeof services.handover.confirmHandover).toBe('function');
    expect(typeof services.handover.getHandoverById).toBe('function');
    expect(typeof services.handover.cancelHandover).toBe('function');
  });

  it('exposes expected contract methods on impact service', () => {
    expect(typeof services.impact.getPersonalImpact).toBe('function');
    expect(typeof services.impact.getImpactHistory).toBe('function');
  });
});
