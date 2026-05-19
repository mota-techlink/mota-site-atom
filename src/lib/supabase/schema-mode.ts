export type DbSchemaMode = 'implicit-public' | 'explicit-public' | 'custom';

export type DbSchemaResolution = {
  rawSchema: string | undefined;
  schema: string;
  mode: DbSchemaMode;
};

export function resolveDbSchema(): DbSchemaResolution {
  const rawSchema = process.env.NEXT_PUBLIC_SUPABASE_DB_SCHEMA;
  const normalizedSchema = rawSchema?.trim();

  if (!normalizedSchema) {
    return {
      rawSchema,
      schema: 'public',
      mode: 'implicit-public',
    };
  }

  if (normalizedSchema === 'public') {
    return {
      rawSchema,
      schema: 'public',
      mode: 'explicit-public',
    };
  }

  return {
    rawSchema,
    schema: normalizedSchema,
    mode: 'custom',
  };
}

export function getDbSchema() {
  return resolveDbSchema().schema;
}

export function shouldUseCustomSchemaTransport() {
  return resolveDbSchema().mode === 'custom';
}
