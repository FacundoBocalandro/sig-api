import { RouteInterface } from '../';
import { PigController } from '../../controller/PigController';

interface PigRoutesInterface extends RouteInterface {
  controller: typeof PigController;
}

export const PigRoutes: PigRoutesInterface[] = [
  {
    method: 'get',
    route: '/pigs',
    controller: PigController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/pigs/:id',
    controller: PigController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/pigs',
    controller: PigController,
    action: 'save',
  },
  {
    method: 'delete',
    route: '/pigs/:id',
    controller: PigController,
    action: 'remove',
  },
];
