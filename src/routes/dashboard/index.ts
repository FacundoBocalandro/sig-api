import { RouteInterface } from '../';
import { DashboardController } from '../../controller/DashboardController';

interface DashboardRoutesInterface extends RouteInterface {
  controller: typeof DashboardController;
}

export const DashboardRoutes: DashboardRoutesInterface[] = [
  {
    method: 'get',
    route: '/dashboard/stats',
    controller: DashboardController,
    action: 'stats',
    auth: true
  },
];
