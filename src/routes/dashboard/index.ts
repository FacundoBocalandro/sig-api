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
  {
    method: 'get',
    route: '/dashboard/objectives',
    controller: DashboardController,
    action: 'objectives',
    auth: true
  },
  {
    method: 'put',
    route: '/dashboard/objectives/:id',
    controller: DashboardController,
    action: 'changeObjectives',
    auth: true
  },
];
