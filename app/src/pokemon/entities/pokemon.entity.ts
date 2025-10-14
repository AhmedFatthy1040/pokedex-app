import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('pokemons')
export class Pokemon {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'int', nullable: true })
  height: number;

  @Column({ type: 'int', nullable: true })
  weight: number;

  @Column({ type: 'int', nullable: true })
  order: number;

  @Column({ nullable: true })
  species: string;

  @Column({ nullable: true })
  form: string;

  @Column({ type: 'jsonb' })
  sprites: any;

  @Column({ type: 'jsonb' })
  types: any;

  @Column({ type: 'jsonb' })
  stats: any;

  @Column({ type: 'jsonb' })
  abilities: any;

  @Column({ type: 'jsonb' })
  moves: any;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
