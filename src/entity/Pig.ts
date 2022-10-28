import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

enum PigStatus {
  Weaned = "Weaned",
  Pregnant = "Pregnant",
  Empty = "Empty"
}

@Entity()
export class Pig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  pigId: string;

  @Column()
  birthDate: Date;

  @Column({
    type: 'enum',
    enum: PigStatus,
    nullable: true,
  })
  status: PigStatus;
}
