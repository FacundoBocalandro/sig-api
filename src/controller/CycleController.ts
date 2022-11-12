import { getRepository } from 'typeorm';
import { Request } from 'express';
import { Cycle, CycleStatus } from '../entity/Cycle';
import { NotAuthorizedError } from '../common/errorValidation/errors';
import { Pig, PigStatus } from '../entity/Pig';


export class CycleController {
  private cycleRepository = getRepository(Cycle);
  private pigRepository = getRepository(Pig);

  async all(request: Request) {
    const pig = await this.pigRepository.findOne({where: {
        id: request.params.pigId,
        userId: request.body.userId,
      }})

    if (!pig) throw new NotAuthorizedError();

    return this.cycleRepository.find({where: {
        pig: request.params.pigId
      }});
  }

  async save(request: Request) {
    const pig = await this.pigRepository.findOne({where: {
        id: request.body.pig,
        userId: request.body.userId,
      }})

    if (!pig) throw new NotAuthorizedError();

    try {
      const cycle = await this.cycleRepository.save(request.body);
      await this.updatePigStatus(cycle.cycleStatus, pig);
      return cycle;
    } catch (err) {
      throw err;
    }
  }

  async change(request: Request) {
    const pig = await this.pigRepository.findOne({where: {
        id: request.body.pig,
        userId: request.body.userId,
      }})

    if (!pig) throw new NotAuthorizedError();

    try {
      await this.updatePigStatus(request.body.cycleStatus, pig);
      return this.cycleRepository.save(request.body);
    } catch (err) {
      throw err;
    }
  }

  private async updatePigStatus(cycleStatus: CycleStatus, pig: Pig) {
    switch (cycleStatus) {
      case CycleStatus.STARTED:
        if (pig.pigStatus !== PigStatus.IN_CYCLE) {
          return this.pigRepository.update(pig.id, {pigStatus: PigStatus.IN_CYCLE});
        }
        break;
      case CycleStatus.PREGNANT:
        if (pig.pigStatus !== PigStatus.PREGNANT) {
          return this.pigRepository.update(pig.id, {pigStatus: PigStatus.PREGNANT});
        }
        break;
      case CycleStatus.BIRTH_CONFIRMED:
        if (pig.pigStatus !== PigStatus.IN_BIRTH) {
          return this.pigRepository.update(pig.id, {pigStatus: PigStatus.IN_BIRTH});
        }
        break;
      case CycleStatus.CLOSED:
        if (pig.pigStatus !== PigStatus.RECENT_BIRTH) {
          return this.pigRepository.update(pig.id, {pigStatus: PigStatus.RECENT_BIRTH});
        }
        break;
    }
  }
}
