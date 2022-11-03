import { getRepository } from 'typeorm';
import { Request, Response } from 'express';
import { Pig } from '../entity/Pig';
import { NotFoundError } from '../common/errorValidation/errors';


export class PigController {
  private pigRepository = getRepository(Pig);
  async all(request: Request) {
    return this.pigRepository.find({where: {
        userId: request.body.userId
      }});
  }

  async one(request: Request) {
    return this.pigRepository.findOne(request.params.id, {where: {
        userId: request.body.userId
      }});
  }

  async save(request: Request) {
    try {
      return this.pigRepository.save(request.body);
    } catch (err) {
      throw err;
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
