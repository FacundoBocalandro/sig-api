import { PigRoutes } from './pigs';
import { CycleRoutes } from './cycles';
import { DashboardRoutes } from './dashboard';

export interface RouteInterface {
  method: string;
  route: string;
  action: string;
  auth?: boolean;
  uploadType?: any;
}
export const Routes = [...PigRoutes, ...CycleRoutes, ...DashboardRoutes];
