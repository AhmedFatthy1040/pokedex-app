import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class InitialSchema1760440344485 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create pokemons table
    await queryRunner.createTable(
      new Table({
        name: 'pokemons',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
          },
          {
            name: 'name',
            type: 'varchar',
          },
          {
            name: 'sprites',
            type: 'jsonb',
          },
          {
            name: 'types',
            type: 'jsonb',
          },
          {
            name: 'height',
            type: 'integer',
          },
          {
            name: 'weight',
            type: 'integer',
          },
          {
            name: 'moves',
            type: 'jsonb',
          },
          {
            name: 'order',
            type: 'integer',
          },
          {
            name: 'species',
            type: 'jsonb',
          },
          {
            name: 'stats',
            type: 'jsonb',
          },
          {
            name: 'abilities',
            type: 'jsonb',
          },
          {
            name: 'form',
            type: 'jsonb',
          },
        ],
      }),
      true,
    );

    // Create teams table
    await queryRunner.createTable(
      new Table({
        name: 'teams',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
          },
        ],
      }),
      true,
    );

    // Create team_pokemons junction table
    await queryRunner.createTable(
      new Table({
        name: 'team_pokemons',
        columns: [
          {
            name: 'teamsId',
            type: 'integer',
          },
          {
            name: 'pokemonsId',
            type: 'integer',
          },
        ],
      }),
      true,
    );

    // Add foreign key for teams
    await queryRunner.createForeignKey(
      'team_pokemons',
      new TableForeignKey({
        columnNames: ['teamsId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'teams',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Add foreign key for pokemons
    await queryRunner.createForeignKey(
      'team_pokemons',
      new TableForeignKey({
        columnNames: ['pokemonsId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'pokemons',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    // Create indexes for better query performance
    await queryRunner.query(
      `CREATE INDEX "idx_pokemons_name" ON "pokemons" USING gin (("types"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_pokemons_name"`);

    // Drop foreign keys
    const teamPokemonsTable = await queryRunner.getTable('team_pokemons');
    if (teamPokemonsTable) {
      const foreignKeys = teamPokemonsTable.foreignKeys;
      for (const foreignKey of foreignKeys) {
        await queryRunner.dropForeignKey('team_pokemons', foreignKey);
      }
    }

    // Drop tables
    await queryRunner.dropTable('team_pokemons', true);
    await queryRunner.dropTable('teams', true);
    await queryRunner.dropTable('pokemons', true);
  }
}
