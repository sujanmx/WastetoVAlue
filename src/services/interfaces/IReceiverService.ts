import { Receiver, ReceiverFilters } from '../../types/receiver';
import { VisionAnalysisResult } from '../../types/ai';
import { CircularValuePath } from '../../types/item';

export interface IReceiverService {
  /**
   * Model 3: Matching AI — "Who can take it?"
   * Finds and ranks suitable receivers based on item attributes and chosen value path.
   */
  matchReceivers(params: {
    item: Partial<VisionAnalysisResult>;
    valuePath: CircularValuePath;
    filters?: ReceiverFilters;
  }): Promise<Receiver[]>;

  getReceivers(filters?: ReceiverFilters): Promise<Receiver[]>;
  getReceiverById(id: string): Promise<Receiver>;
}
