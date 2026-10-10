import assert from 'node:assert/strict';
import { 
  sqlQueryExecutionSchema, 
  databaseMigrationSchema 
} from '../../../lib/validations/supabase-postgresql-database-implementation.schema';

console.log('=== [TEST SUITE: MODUL 1 - SUPABASE POSTGRESQL DATABASE IMPLEMENTATION] ===');

export async function runModul1Tests() {
  // Test 1: Happy Path Query Execution
  const validQuery = sqlQueryExecutionSchema.parse({
    query: 'SELECT id, title, price FROM products LIMIT 5;',
    environment: 'development',
    readOnly: true,
    timeoutMs: 5000,
  });
  assert.equal(validQuery.readOnly, true);
  assert.equal(validQuery.timeoutMs, 5000);
  console.log('  ✓ Happy path Zod safe SQL query schema lolos');

  // Test 2: Destructive Query Rejection in Read-Only Mode
  const destructiveDrop = sqlQueryExecutionSchema.safeParse({
    query: 'DROP TABLE products CASCADE;',
    environment: 'production',
    readOnly: true,
  });
  assert.equal(destructiveDrop.success, false);
  console.log('  ✓ Perintah DROP TABLE ditolak oleh safety validator');

  const destructiveTruncate = sqlQueryExecutionSchema.safeParse({
    query: 'TRUNCATE TABLE orders;',
    readOnly: true,
  });
  assert.equal(destructiveTruncate.success, false);
  console.log('  ✓ Perintah TRUNCATE TABLE ditolak oleh safety validator');

  // Test 3: Migration Schema Validation
  const validMigration = databaseMigrationSchema.parse({
    migrationName: '20261010000000_create_products_table',
    appliedBy: 'supabase_admin',
    checksum: 'sha256_abcdef1234567890',
    statementsCount: 12,
  });
  assert.equal(validMigration.migrationName, '20261010000000_create_products_table');
  assert.equal(validMigration.statementsCount, 12);
  console.log('  ✓ Database migration checksum schema lolos');

  // Test 4: Invalid Migration Format rejection
  const invalidMigration = databaseMigrationSchema.safeParse({
    migrationName: 'invalid-name-format',
    appliedBy: 'admin',
    checksum: '123',
    statementsCount: 0,
  });
  assert.equal(invalidMigration.success, false);
  console.log('  ✓ Format nama migrasi tidak valid berhasil ditolak');

  console.log('✓ [MODUL 1] Seluruh pengujian otomatis 100% PASS!\n');
}

runModul1Tests().catch((err) => {
  console.error('Modul 1 test failed:', err);
  process.exit(1);
});
