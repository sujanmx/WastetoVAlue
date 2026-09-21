import { ImpactMetrics, ImpactActivityHistory } from '../../types/impact';

export interface IImpactService {
  getPersonalImpact(): Promise<ImpactMetrics>;
  getImpactHistory(): Promise<ImpactActivityHistory[]>;
}
