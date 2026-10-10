import { z } from 'zod';

export const sqlQueryExecutionSchema = z.object({
  query: z.string().min(5, 'Query SQL minimal 5 karakter'),
  environment: z.enum(['development', 'staging', 'production']).default('development'),
  readOnly: z.boolean().default(true),
  timeoutMs: z.number().int().min(100).max(30000).default(5000),
}).refine(
  (data) => {
    if (data.readOnly) {
      const lower = data.query.toLowerCase().trim();
      return (
        !lower.startsWith('drop') &&
        !lower.startsWith('truncate') &&
        !lower.startsWith('delete') &&
        !lower.startsWith('alter')
      );
    }
    return true;
  },
  {
    message: 'Aksi destruktif (DROP, TRUNCATE, DELETE, ALTER) dilarang pada mode Read-Only',
    path: ['query'],
  }
);

export const databaseMigrationSchema = z.object({
  migrationName: z.string().min(3).regex(/^[0-9]{14}_[a-z0-9_]+$/, 'Format nama migrasi harus YYYYMMDDHHMMSS_nama_fitur'),
  appliedBy: z.string().min(3),
  checksum: z.string().min(8),
  statementsCount: z.number().int().positive(),
});

export type SqlQueryExecutionInput = z.infer<typeof sqlQueryExecutionSchema>;
export type DatabaseMigrationInput = z.infer<typeof databaseMigrationSchema>;
