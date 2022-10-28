import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Pig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false})
  pigId: string;

  @Column({nullable: false})
  age: number;

  @Column({nullable: false})
  genetics: string;

  @Column({nullable: true})
  fatherId: string;
}
