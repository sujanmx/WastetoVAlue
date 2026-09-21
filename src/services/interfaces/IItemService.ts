import { WasteItem, CreateItemPayload } from '../../types/item';

export interface IItemService {
  getItems(params?: { status?: string; category?: string }): Promise<WasteItem[]>;
  getItemById(id: string): Promise<WasteItem>;
  createItem(payload: CreateItemPayload): Promise<WasteItem>;
  updateItem(id: string, updates: Partial<WasteItem>): Promise<WasteItem>;
  deleteItem(id: string): Promise<void>;
  getRecentItems(limit?: number): Promise<WasteItem[]>;
}
