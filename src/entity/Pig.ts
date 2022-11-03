import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Pig {
  @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
  public created_at: Date;

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({nullable: false})
  pigId: string;

  @Column({nullable: false})
  birthDate: Date;

  @Column({nullable: false})
  genetics: string;

  @Column({nullable: true})
  fatherId: string;

  @Column({nullable: false})
  userId: string;
}
