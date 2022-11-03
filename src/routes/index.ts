import { PigRoutes } from './pigs';

export interface RouteInterface {
  method: string;
  route: string;
  action: string;
  auth?: boolean;
  uploadType?: any;
}
export const Routes = [...PigRoutes];
