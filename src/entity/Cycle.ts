import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from 'typeorm';
import { Pig } from './Pig';

export enum CycleStatus {
  STARTED = 'STARTED',
  PREGNANT = 'PREGNANT',
  BIRTH_CONFIRMED = 'BIRTH_CONFIRMED',
  CLOSED = 'CLOSED'
}

@Entity()
export class Cycle {
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Pig, (pig) => pig.cycles)
  pig: Pig

  @Column({nullable: false})
  cycleNumber: number;

  @Column({nullable: true})
  semen: string;

  @Column({nullable: true})
  services: number;

  @Column({nullable: true})
  zealDetection: number;

  @Column({nullable: true})
  liveBirths: number;

  @Column({nullable: true})
  pigletLosses: number;

  @Column({nullable: true})
  pigletLossesAfterBirth: number;

  @Column({nullable: true})
  weaned: number;

  @Column({nullable: true, type: 'decimal'})
  averageBirthWeight: number;

  @Column({nullable: true, type: 'decimal'})
  averageWeaningWeight: number;

  @Column({nullable: true})
  pregnancyDate: Date;

  @Column({nullable: true})
  birthDate: Date;

  @Column({nullable: true})
  closeDate: Date;

  @Column({
    type: 'text',
    default: CycleStatus.STARTED
  })
  cycleStatus: CycleStatus;

}
