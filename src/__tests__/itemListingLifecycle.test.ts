import { describe, it, expect, beforeEach } from 'vitest';
import { MockItemService } from '../services/mock/mockServices';
import { WasteItem, CreateItemPayload } from '../types/item';
import { AppError } from '../services/api/apiError';
import { MOCK_USER } from '../services/mock/mockData';

describe('Item Listing Lifecycle', () => {
  let itemService: MockItemService;

  beforeEach(() => {
    itemService = new MockItemService();
  });

  const validPayload: CreateItemPayload = {
    title: 'Test Oak Bookshelf',
    category: 'Furniture',
    material: 'Oak Wood',
    condition: 'Usable',
    description: 'A solid oak bookshelf in good condition.',
    imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=600&q=80',
    selectedValuePath: 'reuse',
  };

  // ==================================================
  // PHASE: CREATE
  // ==================================================

  describe('Create Item', () => {
    it('creates an item successfully and returns a WasteItem', async () => {
      const created = await itemService.createItem(validPayload);

      expect(created).toBeDefined();
      expect(created.id).toBeTruthy();
      expect(created.title).toBe(validPayload.title);
      expect(created.category).toBe(validPayload.category);
      expect(created.material).toBe(validPayload.material);
      expect(created.condition).toBe(validPayload.condition);
      expect(created.description).toBe(validPayload.description);
      expect(created.imageUrl).toBe(validPayload.imageUrl);
      expect(created.recommendedValuePath).toBe('reuse');
      expect(created.status).toBe('identified');
      expect(created.createdAt).toBeTruthy();
      expect(created.updatedAt).toBeTruthy();
    });

    it('created item contains the authenticated user ID', async () => {
      const created = await itemService.createItem(validPayload);
      expect(created.userId).toBe(MOCK_USER.id);
    });

    it('creates item with receiver_found status when receiverId is provided', async () => {
      const payload = { ...validPayload, receiverId: 'rec_01' };
      const created = await itemService.createItem(payload);
      expect(created.status).toBe('receiver_found');
      expect(created.receiverId).toBe('rec_01');
    });

    it('defaults material recommendedValuePath to reuse when no selectedValuePath', async () => {
      const payload = { ...validPayload, selectedValuePath: undefined };
      const created = await itemService.createItem(payload);
      expect(created.recommendedValuePath).toBe('reuse');
    });
  });

  // ==================================================
  // PHASE: FETCH / LIST
  // ==================================================

  describe('Fetch Items (getItems)', () => {
    it('newly created item appears in getItems without page reload', async () => {
      const beforeItems = await itemService.getItems();
      const countBefore = beforeItems.length;

      await itemService.createItem(validPayload);

      const afterItems = await itemService.getItems();
      expect(afterItems.length).toBe(countBefore + 1);
      expect(afterItems[0]!.title).toBe(validPayload.title);
    });

    it('filters items by status', async () => {
      await itemService.createItem(validPayload);
      const identifiedItems = await itemService.getItems({ status: 'identified' });
      expect(identifiedItems.length).toBeGreaterThan(0);
      identifiedItems.forEach((item) => {
        expect(item.status).toBe('identified');
      });
    });

    it('returns all items when status is "all"', async () => {
      const allItems = await itemService.getItems({ status: 'all' });
      const noFilterItems = await itemService.getItems();
      expect(allItems.length).toBe(noFilterItems.length);
    });

    it('filters items by category', async () => {
      const furnitureItems = await itemService.getItems({ category: 'Furniture' });
      furnitureItems.forEach((item) => {
        expect(item.category).toBe('Furniture');
      });
    });

    it('items are ordered by created_at descending (newest first)', async () => {
      await itemService.createItem({ ...validPayload, title: 'Older Item' });
      // Small delay to ensure different timestamps
      await new Promise((r) => setTimeout(r, 10));
      await itemService.createItem({ ...validPayload, title: 'Newer Item' });

      const items = await itemService.getItems();
      // The newest item should be first
      expect(items[0]!.title).toBe('Newer Item');
    });
  });

  // ==================================================
  // PHASE: GET BY ID
  // ==================================================

  describe('Get Item by ID', () => {
    it('retrieves a specific item by its ID', async () => {
      const created = await itemService.createItem(validPayload);
      const fetched = await itemService.getItemById(created.id);

      expect(fetched.id).toBe(created.id);
      expect(fetched.title).toBe(created.title);
    });

    it('throws NOT_FOUND for non-existent item ID', async () => {
      try {
        await itemService.getItemById('non_existent_id');
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe('NOT_FOUND');
      }
    });
  });

  // ==================================================
  // PHASE: UPDATE / EDIT
  // ==================================================

  describe('Update Item', () => {
    it('updates an existing item and returns the updated version', async () => {
      const created = await itemService.createItem(validPayload);
      const updated = await itemService.updateItem(created.id, {
        title: 'Updated Title',
        description: 'Updated description',
      });

      expect(updated.id).toBe(created.id);
      expect(updated.title).toBe('Updated Title');
      expect(updated.description).toBe('Updated description');
      // Unchanged fields preserved
      expect(updated.category).toBe(created.category);
      expect(updated.material).toBe(created.material);
    });

    it('updated item appears correctly in subsequent fetch', async () => {
      const created = await itemService.createItem(validPayload);
      await itemService.updateItem(created.id, { title: 'Refreshed Title' });

      const fetched = await itemService.getItemById(created.id);
      expect(fetched.title).toBe('Refreshed Title');
    });

    it('updates updatedAt timestamp', async () => {
      const created = await itemService.createItem(validPayload);
      const originalUpdatedAt = created.updatedAt;
      // Small delay to ensure different timestamp
      await new Promise((r) => setTimeout(r, 10));
      const updated = await itemService.updateItem(created.id, { title: 'Time Check' });

      expect(updated.updatedAt).not.toBe(originalUpdatedAt);
    });

    it('throws NOT_FOUND when updating non-existent item', async () => {
      try {
        await itemService.updateItem('non_existent_id', { title: 'fail' });
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe('NOT_FOUND');
      }
    });
  });

  // ==================================================
  // PHASE: DELETE
  // ==================================================

  describe('Delete Item', () => {
    it('deletes an item and removes it from the listing', async () => {
      const created = await itemService.createItem(validPayload);
      const beforeDelete = await itemService.getItems();
      const countBefore = beforeDelete.length;

      await itemService.deleteItem(created.id);

      const afterDelete = await itemService.getItems();
      expect(afterDelete.length).toBe(countBefore - 1);
      expect(afterDelete.find((i) => i.id === created.id)).toBeUndefined();
    });

    it('deleted item is not retrievable by ID', async () => {
      const created = await itemService.createItem(validPayload);
      await itemService.deleteItem(created.id);

      try {
        await itemService.getItemById(created.id);
        expect.fail('Expected an error to be thrown');
      } catch (err) {
        expect(err).toBeInstanceOf(AppError);
        expect((err as AppError).code).toBe('NOT_FOUND');
      }
    });
  });

  // ==================================================
  // PHASE: RECENT ITEMS
  // ==================================================

  describe('Recent Items', () => {
    it('returns limited number of recent items', async () => {
      const recentItems = await itemService.getRecentItems(2);
      expect(recentItems.length).toBeLessThanOrEqual(2);
    });

    it('newly created item appears in recent items', async () => {
      const created = await itemService.createItem(validPayload);
      const recentItems = await itemService.getRecentItems(1);
      expect(recentItems[0]!.id).toBe(created.id);
    });
  });

  // ==================================================
  // PHASE: ERROR HANDLING
  // ==================================================

  describe('Error Handling', () => {
    it('AppError has sanitized user message', () => {
      const error = AppError.fromSupabase(
        { message: 'relation "items" violates RLS policy', code: '42501' },
        'Failed to create item listing.'
      );
      expect(error.userMessage).not.toContain('RLS');
      expect(error.userMessage).not.toContain('relation');
      // It should contain the safe user-facing message about permission
      expect(error.code).toBe('AUTHORIZATION_ERROR');
    });

    it('AppError does not expose SQL details in user message', () => {
      const error = AppError.fromSupabase(
        { message: 'insert into items (user_id) values (abc) violates constraint' },
        'Unable to create this item. Please try again.'
      );
      // The userMessage should be the fallback, not the raw SQL
      expect(error.userMessage).toBe('Unable to create this item. Please try again.');
    });

    it('AppError properly identifies JWT/session errors', () => {
      const error = AppError.fromSupabase(
        { message: 'JWT expired' },
        'Session error'
      );
      expect(error.code).toBe('AUTHENTICATION_ERROR');
    });
  });

  // ==================================================
  // PHASE: DATA CONSISTENCY
  // ==================================================

  describe('Data Consistency', () => {
    it('WasteItem model is consistent across create → fetch → update → fetch', async () => {
      // Create
      const created = await itemService.createItem(validPayload);
      assertValidWasteItem(created);

      // Fetch after create
      const fetched = await itemService.getItemById(created.id);
      assertValidWasteItem(fetched);
      expect(fetched.id).toBe(created.id);

      // Update
      const updated = await itemService.updateItem(created.id, { title: 'Consistency Check' });
      assertValidWasteItem(updated);
      expect(updated.title).toBe('Consistency Check');

      // Fetch after update
      const refetched = await itemService.getItemById(created.id);
      assertValidWasteItem(refetched);
      expect(refetched.title).toBe('Consistency Check');
    });

    it('getItems returns items with all required fields', async () => {
      const items = await itemService.getItems();
      items.forEach(assertValidWasteItem);
    });
  });
});

/**
 * Asserts that a WasteItem has all required fields with correct types.
 * One malformed field must not cause the entire listing to disappear.
 */
function assertValidWasteItem(item: WasteItem): void {
  expect(item.id).toEqual(expect.any(String));
  expect(item.userId).toEqual(expect.any(String));
  expect(item.title).toEqual(expect.any(String));
  expect(item.category).toEqual(expect.any(String));
  expect(item.material).toEqual(expect.any(String));
  expect(item.condition).toEqual(expect.any(String));
  expect(item.imageUrl).toEqual(expect.any(String));
  expect(typeof item.isAiAssisted).toBe('boolean');
  expect(['High', 'Medium', 'Low']).toContain(item.aiConfidence);
  expect(item.recommendedValuePath).toEqual(expect.any(String));
  expect(['identified', 'value_selected', 'receiver_found', 'handover_scheduled', 'completed', 'cancelled']).toContain(item.status);
  expect(item.createdAt).toEqual(expect.any(String));
  expect(item.updatedAt).toEqual(expect.any(String));
}
