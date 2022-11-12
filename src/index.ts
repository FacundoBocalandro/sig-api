import 'dotenv/config';
import 'reflect-metadata';
// import { createConnection } from 'typeorm';
import { createServer, Server as HttpServer } from 'http';
import { Application } from 'express';
import { Server } from './server';
import { dbConnection } from './dbServer';
import { EntityManager } from 'typeorm';
import { Pig, PigStatus } from './entity/Pig';
import { addDays } from 'date-fns';
import { Cycle, CycleStatus } from './entity/Cycle';

let retries = 5;

const randomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const createData = async (manager: EntityManager) => {
  // create 20 pigs in cub state
  const cubBirthDates = Array(20).fill(1).map(() => randomDate(new Date('2022-11-09'), new Date('2022-07-22')));

  const pigsInCubState = cubBirthDates.map((birthDate, i) => {
    return manager.create(Pig, {
      pigId: `AG${i}`,
      birthDate: birthDate,
      genetics: 'AA0001',
      userId: 'q8Pmu6vXOxYIJgYp2hcxXfxgkIB2',
    });
  });

  await manager.save(pigsInCubState);

  // create 120 pigs in cycle
  const inCycleBirthDates = [
    ...Array(32).fill(1).map(() => randomDate(new Date('2022-03-05'), new Date('2022-06-25'))) ,
    ...Array(88).fill(1).map(() => randomDate(new Date('2022-06-25'), new Date('2022-07-23')))
  ];
  const pigsInCycleInfo = inCycleBirthDates.map((birthDate, i) => {
    const created_at = addDays(birthDate, 110);
    const services = Math.round(Math.random() * 2 );
    const zealDetection = services + Math.round(Math.random() * 5);
    return [{
      pigId: `AG${i + 20}`,
      birthDate: birthDate,
      genetics: 'AA0002',
      userId: 'q8Pmu6vXOxYIJgYp2hcxXfxgkIB2',
      pigStatus: PigStatus.IN_CYCLE,
    },
      manager.create(Cycle, {
        created_at,
        cycleNumber: 0,
        cycleStatus: CycleStatus.STARTED,
        semen: 'AA1234',
        zealDetection,
        services,
      }),
    ];
  });

  const firstCycles = await manager.save(pigsInCycleInfo.map(info => info[1]));
  await manager.save(pigsInCycleInfo.map(info => info[0]).map((pig, i) => manager.create(Pig, {
    ...pig,
    cycles: [firstCycles[i]],
  })));

  // create 248 pigs in pregnant state
  const pregnantBirthDates = [
    ...Array(8).fill(1).map(() => randomDate(new Date('2022-03-26'), new Date('2022-01-29'))),
    ...Array(240).fill(1).map(() => randomDate(new Date('2022-06-18'), new Date('2022-03-26')))
  ];
  const pregnantPigsInfo = pregnantBirthDates.map((birthDate, i) => {
    const created_at = addDays(birthDate, 110);
    const pregnancyDate = addDays(created_at, 30);
    const services = Math.round(Math.random() * 2 );
    const zealDetection = services + Math.round(Math.random() * 5);
    return [{
      pigId: `AG${i + 140}`,
      birthDate: birthDate,
      genetics: 'AA0003',
      userId: 'q8Pmu6vXOxYIJgYp2hcxXfxgkIB2',
      pigStatus: PigStatus.PREGNANT,
    }, manager.create(Cycle, {
      created_at,
      cycleNumber: 0,
      cycleStatus: CycleStatus.PREGNANT,
      semen: 'AA2345',
      zealDetection,
      services,
      pregnancyDate,
    })];
  });

  const secondCycles = await manager.save(pregnantPigsInfo.map(info => info[1]));
  await manager.save(pregnantPigsInfo.map(info => info[0]).map((pig, i) => manager.create(Pig, {
    ...pig,
    cycles: [secondCycles[i]],
  })));

  // create 190 pigs in birth state
  const birthPigsBirthDates = Array(190).fill(1).map(() => randomDate(new Date('2022-03-26'), new Date('2022-01-15')));
  const birthPigsInfo = birthPigsBirthDates.map((birthDate, i) => {
    const created_at = addDays(birthDate, 110);
    const pregnancyDate = addDays(created_at, 30);
    const cycleBirthDate = addDays(pregnancyDate, 84);
    const services = Math.round(Math.random() * 2 );
    const zealDetection = services + Math.round(Math.random() * 5);
    const liveBirths = 12 + Math.round(Math.random() * 4);
    const pigletLosses = Math.round(Math.random() * 2);
    const pigletLossesAfterBirth = Math.round(Math.random() * 2);
    const weaned = liveBirths - pigletLossesAfterBirth;
    const averageBirthWeight = 0.6 + (Math.random() * 1.2);
    const averageWeaningWeight = 0.6 + (Math.random() * 1.2);
    return [{
      pigId: `AG${i + 388}`,
      birthDate: birthDate,
      genetics: 'AA0004',
      userId: 'q8Pmu6vXOxYIJgYp2hcxXfxgkIB2',
      pigStatus: PigStatus.IN_BIRTH,
    }, manager.create(Cycle, {
      created_at,
      cycleNumber: 0,
      cycleStatus: CycleStatus.BIRTH_CONFIRMED,
      semen: 'AA2345',
      zealDetection,
      services,
      pregnancyDate,
      birthDate: cycleBirthDate,
      liveBirths,
      pigletLosses,
      pigletLossesAfterBirth,
      weaned,
      averageBirthWeight,
      averageWeaningWeight,
    })];
  });

  const thirdCycles = await manager.save(birthPigsInfo.map(info => info[1]));
  await manager.save(birthPigsInfo.map(info => info[0]).map((pig, i) => manager.create(Pig, {
    ...pig,
    cycles: [thirdCycles[i]],
  })));

  // create 190 pigs in recent birth state
  const recentBirthPigsBirthDates = Array(190).fill(1).map(() => randomDate(new Date('2022-01-15'), new Date('2021-11-06')));
  const recentBirthPigsInfo = recentBirthPigsBirthDates.map((birthDate, i) => {
    const created_at = addDays(birthDate, 110);
    const pregnancyDate = addDays(created_at, 30);
    const cycleBirthDate = addDays(pregnancyDate, 84);
    const closeDate = cycleBirthDate;
    const services = Math.round(Math.random() * 2 );
    const zealDetection = services + Math.round(Math.random() * 5);
    const liveBirths = 12 + Math.round(Math.random() * 4);
    const pigletLosses = Math.round(Math.random() * 2);
    const pigletLossesAfterBirth = Math.round(Math.random() * 2);
    const weaned = liveBirths - pigletLossesAfterBirth;
    const averageBirthWeight = 0.6 + (Math.random() * 1.2);
    const averageWeaningWeight = 0.6 + (Math.random() * 1.2);
    return [{
      pigId: `AG${i + 578}`,
      birthDate: birthDate,
      genetics: 'AA0005',
      userId: 'q8Pmu6vXOxYIJgYp2hcxXfxgkIB2',
      pigStatus: PigStatus.RECENT_BIRTH,
    }, manager.create(Cycle, {
      created_at,
      cycleNumber: 0,
      cycleStatus: CycleStatus.CLOSED,
      semen: 'AA4567',
      zealDetection,
      services,
      pregnancyDate,
      birthDate: cycleBirthDate,
      liveBirths,
      pigletLosses,
      pigletLossesAfterBirth,
      weaned,
      averageBirthWeight,
      averageWeaningWeight,
      closeDate,
    })];
  });

  const fourthCycles = await manager.save(recentBirthPigsInfo.map(info => info[1]));
  await manager.save(recentBirthPigsInfo.map(info => info[0]).map((pig, i) => manager.create(Pig, {
    ...pig,
    cycles: [fourthCycles[i]],
  })));

  // create 24 discarded pigs (in cycle)
  const discardedInCycleBirthDates = [
    ...Array(16).fill(1).map(() => randomDate(new Date('2022-03-05'), new Date('2022-06-25'))) ,
    ...Array(8).fill(1).map(() => randomDate(new Date('2022-06-25'), new Date('2022-07-23')))
  ];
  const discardedInCycleInfo = discardedInCycleBirthDates.map((birthDate, i) => {
    const created_at = addDays(birthDate, 110);
    const services = Math.round(Math.random() * 2 );
    const zealDetection = services + Math.round(Math.random() * 5);
    return [{
      pigId: `AG${i + 768}`,
      birthDate: birthDate,
      genetics: 'AA0002',
      userId: 'q8Pmu6vXOxYIJgYp2hcxXfxgkIB2',
      pigStatus: PigStatus.DISCARDED,
    }, manager.create(Cycle, {
      created_at,
      cycleNumber: 0,
      cycleStatus: CycleStatus.STARTED,
      semen: 'AA1234',
      zealDetection,
      services,
    })];
  });

  const fifthCycles = await manager.save(discardedInCycleInfo.map(info => info[1]));
  await manager.save(discardedInCycleInfo.map(info => info[0]).map((pig, i) => manager.create(Pig, {
    ...pig,
    cycles: [fifthCycles[i]],
  })));

  // create 20 discarded pigs (pregnant)
  const discardedPregnantBirthDates = Array(20).fill(1).map(() => randomDate(new Date('2022-06-18'), new Date('2022-01-29')));
  const discardedPregnantInfo = discardedPregnantBirthDates.map((birthDate, i) => {
    const created_at = addDays(birthDate, 110);
    const pregnancyDate = addDays(created_at, 30);
    const services = Math.round(Math.random() * 2 );
    const zealDetection = services + Math.round(Math.random() * 5);
    return [{
      pigId: `AG${i + 792}`,
      birthDate: birthDate,
      genetics: 'AA0003',
      userId: 'q8Pmu6vXOxYIJgYp2hcxXfxgkIB2',
      pigStatus: PigStatus.DISCARDED,
    }, manager.create(Cycle, {
      created_at,
      cycleNumber: 0,
      cycleStatus: CycleStatus.PREGNANT,
      semen: 'AA2345',
      zealDetection,
      services,
      pregnancyDate,
    })];
  });

  const sixthCycles = await manager.save(discardedPregnantInfo.map(info => info[1]));
  await manager.save(discardedPregnantInfo.map(info => info[0]).map((pig, i) => manager.create(Pig, {
    ...pig,
    cycles: [sixthCycles[i]],
  })));
}

async function createDbConection() {
  while (retries) {
    try {
      const connect = await dbConnection();
      if (connect.isConnected) {
        const app: Application = new Server().app;
        const server: HttpServer = createServer(app);
        console.log('process.env.NODE_ENV', process.env.NODE_ENV);

        // setup express app here
        await createData(connect.manager);
        const port = process.env.PORT || 4000;
        // start express server
        server.listen(port);
        console.log(`Express server has started on port ${port}.`);
      }
      break;
    } catch (err) {
      console.log(err);
      retries -= 1;
      console.log(`retries left ${retries}`);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
}

createDbConection();
