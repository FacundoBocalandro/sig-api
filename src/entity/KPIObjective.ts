import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class KPIObjective {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false})
  userId: string;

  @Column({nullable: true, type: 'decimal'})
  weeklyServices: number;

  @Column({nullable: true, type: 'decimal'})
  pregnancyPercentage: number;

  @Column({nullable: true, type: 'decimal'})
  birthPerServicesPercentage: number;

  @Column({nullable: true, type: 'decimal'})
  birthPerPregnancyPercentage: number;

  @Column({nullable: true, type: 'decimal'})
  weeklyLivePigsPerBirth: number;

  @Column({nullable: true, type: 'decimal'})
  weeklyWeanedPerBirth: number;

  @Column({nullable: true, type: 'decimal'})
  weeklyDeathRate: number;

  @Column({nullable: true, type: 'decimal'})
  weeklyBirthWeight: number;

  @Column({nullable: true, type: 'decimal'})
  weeklyWeanedWeight: number;

}
