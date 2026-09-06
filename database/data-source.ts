import { DataSource } from 'typeorm';
import { join } from 'path';
import { TypeOrmConfig } from '../libs/configuration/src/lib/type-orm.config';

/**
 * DataSource used exclusively by the TypeORM CLI (migration:generate / run / revert).
 *
 * This is deliberately separate from `getTypeOrmProvider()` in
 * libs/configuration/src/lib/type-orm.config.ts, which builds the runtime
 * connection through Nest's DI container and is unavailable to the CLI.
 *
 * Connection credentials are shared with the runtime by reusing `TypeOrmConfig`,
 * so the CLI can never drift from what the apps connect to.
 */
const config = new TypeOrmConfig();

export default new DataSource({
  type: 'postgres',
  host: config.HOST,
  port: config.PORT,
  username: config.USERNAME,
  password: config.PASSWORD,
  database: config.DATABASE,

  // Globs are valid here but NOT in the runtime config: the CLI runs against
  // TypeScript sources through ts-node, whereas each app is bundled by webpack
  // into a single main.js where no per-entity file exists on disk.
  entities: [join(__dirname, '../libs/entities/src/lib/**/*.entity.ts')],
  migrations: [join(__dirname, 'migrations/*.ts')],

  // Migrations are the only way schema changes reach a database that holds data.
  synchronize: false,
});
