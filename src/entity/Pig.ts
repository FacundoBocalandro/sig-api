import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Cycle } from './Cycle';

export enum PigStatus {
  CUB = "CUB",
  IN_CYCLE = "IN_CYCLE",
  PREGNANT = "PREGNANT",
  IN_BIRTH = "IN_BIRTH",
  RECENT_BIRTH = "RECENT_BIRTH",
  DISCARDED = "DISCARDED"
}

@Entity()
export class Pig {
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false, unique: true})
  pigId: string;

  @Column({nullable: false, type: 'text', default: PigStatus.CUB})
  pigStatus: PigStatus;

  @Column({nullable: false})
  birthDate: Date;

  @Column({nullable: false})
  genetics: string;

  @Column({nullable: true})
  fatherId: string;

  @Column({nullable: true})
  motherId: string;

  @Column({nullable: false})
  userId: string;

  @OneToMany(() => Cycle, (cycle) => cycle.pig)
  cycles: Cycle[]
}
