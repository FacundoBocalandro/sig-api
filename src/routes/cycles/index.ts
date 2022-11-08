import { RouteInterface } from '../';
import { CycleController } from '../../controller/CycleController';

interface CycleRoutesInterface extends RouteInterface {
  controller: typeof CycleController;
}

export const CycleRoutes: CycleRoutesInterface[] = [
  {
    method: 'get',
    route: '/cycles/:pigId',
    controller: CycleController,
    action: 'all',
    auth: true
  },
  {
    method: 'post',
    route: '/cycles',
    controller: CycleController,
    action: 'save',
    auth: true
  },
  {
    method: 'put',
    route: '/cycles',
    controller: CycleController,
    action: 'change',
    auth: true
  },
];
