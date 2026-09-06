/**
 *   nx run user-access:seed                 -> migrate (default), insert what is missing
 *   nx run user-access:seed --mode=prune    -> delete every role, then insert
 */
import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { RoleDestination } from '@common/schemas/role.schema';
import { CONFIGURATION } from './configuration';
import { loadRoleSeeds, RoleSeed } from './seeds/role-seed.loader';

enum SeedMode {
  MIGRATE = 'migrate',
  PRUNE = 'prune',
}

const SEED_MODES = Object.values(SeedMode) as string[];
const logger = new Logger('Seed');

/** Accepts `--mode=prune`, `--mode prune` or a bare `prune` positional. */
function parseMode(argv: string[]): SeedMode {
  const flagIndex = argv.findIndex((arg) => arg === '--mode' || arg.startsWith('--mode='));
  const raw =
    flagIndex === -1
      ? argv.find((arg) => !arg.startsWith('-'))
      : argv[flagIndex].includes('=')
      ? argv[flagIndex].split('=')[1]
      : argv[flagIndex + 1];

  if (!raw) {
    return SeedMode.MIGRATE;
  }

  const mode = raw.toLowerCase();
  if (!SEED_MODES.includes(mode)) {
    throw new Error(`Unknown seed mode "${raw}". Expected one of: ${SEED_MODES.join(', ')}`);
  }

  return mode as SeedMode;
}

const RoleModel = mongoose.model(RoleDestination.name, RoleDestination.schema);

async function migrate(seeds: RoleSeed[]) {
  let inserted = 0;

  for (const seed of seeds) {
    // $setOnInsert keeps permissions edited in the database intact;
    // runValidators re-applies the schema enums, which upserts skip by default.
    const result = await RoleModel.updateOne(
      { roleName: seed.roleName },
      { $setOnInsert: seed },
      { upsert: true, runValidators: true },
    );

    if (result.upsertedCount) {
      inserted += 1;
      logger.log(`✅ Inserted role ${seed.roleName}`);
    } else {
      logger.log(`⏭️  Role ${seed.roleName} already exists — skipped`);
    }
  }

  logger.log(`🌱 Done [migrate] inserted=${inserted} skipped=${seeds.length - inserted}`);
}

async function prune(seeds: RoleSeed[]) {
  const { deletedCount } = await RoleModel.deleteMany({});
  logger.warn(`🗑️  Deleted ${deletedCount} existing role(s)`);

  const inserted = await RoleModel.insertMany(seeds);
  logger.log(`🌱 Done [prune] deleted=${deletedCount} inserted=${inserted.length}`);
}

async function run() {
  const argv = process.argv.slice(2);
  const mode = parseMode(argv);
  const seeds = loadRoleSeeds();

  // Prune also drops roles created at runtime.
  if (mode === SeedMode.PRUNE && CONFIGURATION.NODE_ENV === 'production' && !argv.includes('--force')) {
    throw new Error('Refusing to prune roles with NODE_ENV=production. Re-run with --force if this is intended.');
  }

  await mongoose.connect(CONFIGURATION.MONGO_DB.MONGO_URI, {
    dbName: CONFIGURATION.MONGO_DB.MONGO_DB_NAME,
  });

  try {
    await (mode === SeedMode.PRUNE ? prune(seeds) : migrate(seeds));
  } finally {
    await mongoose.disconnect();
  }
}

run().catch((error: Error) => {
  logger.error(`❌ ${error.message}`);
  process.exitCode = 1;
});
