import { getRepository } from 'typeorm';
import { Request } from 'express';
import { Cycle, CycleStatus } from '../entity/Cycle';
import { Pig, PigStatus } from '../entity/Pig';
import { isBetweenDates } from '../utils/dates';
import { KPIObjective } from '../entity/KPIObjective';

type Stats = {
  weeklyServices: number;
  pregnancyPercentage: number;
  birthPerServicesPercentage: number;
  birthPerPregnancyPercentage: number;
  weeklyLivePigsPerBirth: number;
  weeklyWeanedPerBirth: number;
  weeklyDeathRate: number;
  weeklyBirthWeight: number;
  weeklyWeanedWeight: number;
}

type CyclePigJoin = {
  pig_created_at: Date;
  pig_id: string;
  pig_pigId: string;
  pig_pigStatus: PigStatus;
  pig_birthDate: Date;
  pig_genetics: string;
  pig_fatherId: string;
  pig_motherId: string;
  pig_userId: string;
  cycle_created_at: Date;
  cycle_id: string;
  cycle_cycleNumber: number;
  cycle_semen: string | null;
  cycle_services: number | null;
  cycle_zealDetection: number | null;
  cycle_liveBirths: number | null;
  cycle_pigletLosses: number;
  cycle_pigletLossesAfterBirth: number;
  cycle_weaned: number;
  cycle_averageBirthWeight: number;
  cycle_averageWeaningWeight: number;
  cycle_pregnancyDate: Date | null;
  cycle_birthDate: Date | null;
  cycle_closeDate: Date | null;
  cycle_cycleStatus: CycleStatus;
  cycle_pigId: string | null;
}


const initialStats: Stats[] = Array(10).fill({
  weeklyServices: 0,
  pregnancyPercentage: 0,
  birthPerServicesPercentage: 0,
  birthPerPregnancyPercentage: 0,
  weeklyLivePigsPerBirth: 0,
  weeklyWeanedPerBirth: 0,
  weeklyDeathRate: 0,
  weeklyBirthWeight: 0,
  weeklyWeanedWeight: 0,
});

export class DashboardController {
  private pigRepository = getRepository(Pig);
  private KPIObjectiveRepository = getRepository(KPIObjective);

  async objectives(request: Request) {
    const KPIObjective = await this.KPIObjectiveRepository.findOne({where: {userId: request.body.userId}});
    if (!KPIObjective) {
      return this.KPIObjectiveRepository.save({userId: request.body.userId});
    }
    return KPIObjective;
  }

  async changeObjectives(request: Request) {
    return this.KPIObjectiveRepository.update(request.params.id, {...request.body});
  }

  async stats(request: Request) {
    const cycles = await this.pigRepository
      .createQueryBuilder('pig')
      .innerJoinAndSelect('pig.cycles', 'cycle')
      .where('pig.userId = :id', { id: request.body.userId })
      .execute();

    const stats = [...initialStats];
    return stats.map((weeklyStats: Stats, i: number) => {
      const initialDate = new Date();
      initialDate.setDate(initialDate.getDate() - 7 * (i + 1));
      initialDate.setDate(initialDate.getDate() - initialDate.getDay());
      initialDate.setHours(0, 0, 0);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - 7 * (i + 1));
      endDate.setDate(endDate.getDate() + 6 - endDate.getDay());
      endDate.setHours(23, 59, 59);
      const weeklyServices = DashboardController.getWeeklyServices(cycles, initialDate, endDate);
      const pregnancyPercentage = DashboardController.getPregnancyPercentage(cycles, initialDate, endDate);
      const birthPerServicesPercentage = DashboardController.getBirthPerServicesPercentage(cycles, initialDate, endDate);
      const birthPerPregnancyPercentage = DashboardController.getBirthPerPregnancyPercentage(cycles, initialDate, endDate);
      const weeklyLivePigsPerBirth = DashboardController.getWeeklyLivePigsPerBirth(cycles, initialDate, endDate);
      const weeklyWeanedPerBirth = DashboardController.getWeeklyWeanedPerBirth(cycles, initialDate, endDate);
      const weeklyDeathRate = DashboardController.getWeeklyDeathRate(cycles, initialDate, endDate);
      const weeklyBirthWeight = DashboardController.getWeeklyBirthWeight(cycles, initialDate, endDate);
      const weeklyWeanedWeight = DashboardController.getWeeklyWeanedWeight(cycles, initialDate, endDate);
      return {
        weeklyServices, pregnancyPercentage, birthPerServicesPercentage, birthPerPregnancyPercentage,
        weeklyLivePigsPerBirth, weeklyWeanedPerBirth, weeklyDeathRate,
        weeklyBirthWeight, weeklyWeanedWeight, initialDate, endDate,
      };
    });
  }

  private static getWeeklyServices(cycles: CyclePigJoin[], initialDate: Date, endDate: Date) {
    return cycles.reduce((previousValue, cycle) => {
      if (cycle.cycle_cycleStatus === CycleStatus.CLOSED && isBetweenDates(cycle.cycle_created_at, initialDate, endDate)) {
        return previousValue + 1;
      }
      return previousValue;
    }, 0);
  }

  private static getWeeklyPregnant(cycles: CyclePigJoin[], initialDate: Date, endDate: Date) {
    return cycles.reduce((previousValue, cycle) => {
      if (cycle.cycle_cycleStatus === CycleStatus.CLOSED && cycle.cycle_pregnancyDate && isBetweenDates(cycle.cycle_pregnancyDate, initialDate, endDate)) {
        return previousValue + 1;
      }
      return previousValue;
    }, 0);
  }

  private static getWeeklyBirth(cycles: CyclePigJoin[], initialDate: Date, endDate: Date) {
    return cycles.reduce((previousValue, cycle) => {
      if (cycle.cycle_cycleStatus === CycleStatus.CLOSED && cycle.cycle_birthDate && isBetweenDates(cycle.cycle_birthDate, initialDate, endDate)) {
        return previousValue + 1;
      }
      return previousValue;
    }, 0);
  }

  private static getWeeklyLivePigs(cycles: CyclePigJoin[], initialDate: Date, endDate: Date) {
    return cycles.reduce((previousValue, cycle) => {
      if (cycle.cycle_cycleStatus === CycleStatus.CLOSED && cycle.cycle_birthDate && isBetweenDates(cycle.cycle_birthDate, initialDate, endDate) && cycle.cycle_liveBirths) {
        return previousValue + cycle.cycle_liveBirths;
      }
      return previousValue;
    }, 0);
  }

  private static getWeeklyWeaned(cycles: CyclePigJoin[], initialDate: Date, endDate: Date) {
    return cycles.reduce((previousValue, cycle) => {
      if (cycle.cycle_cycleStatus === CycleStatus.CLOSED && cycle.cycle_birthDate && isBetweenDates(cycle.cycle_birthDate, initialDate, endDate) && cycle.cycle_weaned) {
        return previousValue + cycle.cycle_weaned;
      }
      return previousValue;
    }, 0);
  }

  private static getWeeklyPigletLossesAfterBirth(cycles: CyclePigJoin[], initialDate: Date, endDate: Date) {
    return cycles.reduce((previousValue, cycle) => {
      if (cycle.cycle_cycleStatus === CycleStatus.CLOSED && cycle.cycle_birthDate && isBetweenDates(cycle.cycle_birthDate, initialDate, endDate) && cycle.cycle_pigletLossesAfterBirth) {
        return previousValue + cycle.cycle_pigletLossesAfterBirth;
      }
      return previousValue;
    }, 0);
  }

  private static getPregnancyPercentage(cycles: CyclePigJoin[], initialDate: Date, endDate: Date) {
    const pregnantPigs = this.getWeeklyPregnant(cycles, initialDate, endDate);
    const newInitialDate = new Date();
    newInitialDate.setDate(initialDate.getDate() - 30);
    const newEndDate = new Date();
    newEndDate.setDate(endDate.getDate() - 30);
    const weeklyServices = this.getWeeklyServices(cycles, newInitialDate, newEndDate);
    if (!weeklyServices) return 0;
    return pregnantPigs / weeklyServices;
  }

  private static getBirthPerServicesPercentage(cycles: CyclePigJoin[], initialDate: Date, endDate: Date) {
    const weeklyBirth = this.getWeeklyBirth(cycles, initialDate, endDate);
    const newInitialDate = new Date();
    newInitialDate.setDate(initialDate.getDate() - 114);
    const newEndDate = new Date();
    newEndDate.setDate(endDate.getDate() - 114);
    const weeklyServices = this.getWeeklyServices(cycles, newInitialDate, newEndDate);
    if (!weeklyServices) return 0;
    return weeklyBirth / weeklyServices;
  }

  private static getBirthPerPregnancyPercentage(cycles: CyclePigJoin[], initialDate: Date, endDate: Date) {
    const weeklyBirth = this.getWeeklyBirth(cycles, initialDate, endDate);
    const newInitialDate = new Date();
    newInitialDate.setDate(initialDate.getDate() - 84);
    const newEndDate = new Date();
    newEndDate.setDate(endDate.getDate() - 84);
    const weeklyPregnant = this.getWeeklyPregnant(cycles, newInitialDate, newEndDate);
    if (!weeklyPregnant) return 0;
    return weeklyBirth / weeklyPregnant;
  }

  private static getWeeklyLivePigsPerBirth(cycles: CyclePigJoin[], initialDate: Date, endDate: Date) {
    const weeklyLivePigs = this.getWeeklyLivePigs(cycles, initialDate, endDate);
    const weeklyBirth = this.getWeeklyBirth(cycles, initialDate, endDate);
    if (!weeklyBirth) return 0;
    return weeklyLivePigs / weeklyBirth;
  }

  private static getWeeklyWeanedPerBirth(cycles: CyclePigJoin[], initialDate: Date, endDate: Date) {
    const weeklyWeaned = this.getWeeklyWeaned(cycles, initialDate, endDate);
    const weeklyBirth = this.getWeeklyBirth(cycles, initialDate, endDate);
    if (!weeklyBirth) return 0;
    return weeklyWeaned / weeklyBirth;
  }

  private static getWeeklyDeathRate(cycles: CyclePigJoin[], initialDate: Date, endDate: Date) {
    const weeklyPigletLossesAfterBirth = this.getWeeklyPigletLossesAfterBirth(cycles, initialDate, endDate);
    const weeklyBirth = this.getWeeklyBirth(cycles, initialDate, endDate);
    if (!weeklyBirth) return 0;
    return weeklyPigletLossesAfterBirth / weeklyBirth;
  }

  private static getWeeklyBirthWeight(cycles: CyclePigJoin[], initialDate: Date, endDate: Date) {
    const weeklyBirthWeight = cycles.reduce((previousValue, cycle) => {
      if (cycle.cycle_cycleStatus === CycleStatus.CLOSED && cycle.cycle_birthDate && isBetweenDates(cycle.cycle_birthDate, initialDate, endDate) && cycle.cycle_averageBirthWeight && cycle.cycle_liveBirths) {
        return [previousValue[0] + (cycle.cycle_averageBirthWeight * cycle.cycle_liveBirths), previousValue[0] + cycle.cycle_liveBirths];
      }
      return previousValue;
    }, [0, 0]);

    if (!weeklyBirthWeight[1]) return 0;
    return weeklyBirthWeight[0] / weeklyBirthWeight[1];
  }

  private static getWeeklyWeanedWeight(cycles: CyclePigJoin[], initialDate: Date, endDate: Date) {
    const weeklyWeanedWeight = cycles.reduce((previousValue, cycle) => {
      if (cycle.cycle_cycleStatus === CycleStatus.CLOSED && cycle.cycle_birthDate && isBetweenDates(cycle.cycle_birthDate, initialDate, endDate) && cycle.cycle_averageWeaningWeight && cycle.cycle_weaned) {
        return [previousValue[0] + (cycle.cycle_averageWeaningWeight * cycle.cycle_weaned), previousValue[0] + cycle.cycle_weaned];
      }
      return previousValue;
    }, [0, 0]);

    if (!weeklyWeanedWeight[1]) return 0;
    return weeklyWeanedWeight[0] / weeklyWeanedWeight[1];
  }
}
