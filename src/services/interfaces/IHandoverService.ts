import { HandoverRecord, ConfirmHandoverPayload } from '../../types/handover';

export interface IHandoverService {
  confirmHandover(payload: ConfirmHandoverPayload): Promise<HandoverRecord>;
  getHandoverById(id: string): Promise<HandoverRecord>;
  getHandoverByItemId(itemId: string): Promise<HandoverRecord | null>;
  cancelHandover(id: string): Promise<void>;
}
