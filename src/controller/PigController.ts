import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Pig, PigStatus } from '../entity/Pig';
import { NotFoundError } from '../common/errorValidation/errors';
import { Cycle, CycleStatus } from '../entity/Cycle';
import { isInLastYear } from '../utils/dates';


export class PigController {
  private pigRepository = getRepository(Pig);
  private cycleRepository = getRepository(Cycle);

  async all(request: Request) {
    return this.pigRepository.find({where: {
        userId: request.body.userId
      }});
  }

  async one(request: Request) {
    const pig = await this.pigRepository.findOne(request.params.id, {where: {
        userId: request.body.userId
      }});

    if (!pig) throw new NotFoundError();

    const cycles = await this.cycleRepository.find({where: {
        pig: request.params.id
      }})

    const bornPerYear = cycles.reduce((previousValue, currentCycle) => {
      if (currentCycle.cycleStatus === CycleStatus.CLOSED && currentCycle.closeDate && isInLastYear(currentCycle.closeDate)) {
        return previousValue + currentCycle.liveBirths;
      }
      return previousValue;
    }, 0)

    const weanedPerYear = cycles.reduce((previousValue, currentCycle) => {
      if (currentCycle.cycleStatus === CycleStatus.CLOSED && currentCycle.closeDate && isInLastYear(currentCycle.closeDate)) {
        return previousValue + currentCycle.weaned;
      }
      return previousValue;
    }, 0)

    return {...pig, bornPerYear, weanedPerYear};
  }

  async save(request: Request) {
    try {
      return this.pigRepository.save(request.body);
    } catch (err) {
      throw err;
    }
  }

  async discard(request: Request) {
    const pig = this.pigRepository.findOne(request.params.id, {where: {
        userId: request.body.userId,
      }});

    if (!pig) throw new NotFoundError();

    try {
      return this.pigRepository.update(request.params.id, {pigStatus: PigStatus.DISCARDED});
    } catch (e) {
      throw e;
    }
  }

  // using query builder <createQueryBuilder>
  async remove(request: Request, response: Response) {
    try {
      const data = await this.pigRepository
        .createQueryBuilder()
        .delete()
        .from(Pig)
        .where('id = :id & userId = :userId', { id: request.params.id, userId: request.body.userId })
        .execute();
      if (data.affected === 1) {
        return 'Record successfully deleted';
      } else {
        throw new NotFoundError();
      }
    } catch (err) {
      throw err;
    }
  }
}
