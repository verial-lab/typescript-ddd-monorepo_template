# Supabase Infrastructure Package

This package provides a configured Supabase client for use across the monorepo. It handles environment-based configuration and provides type-safe access to Supabase services.

## Installation

```bash
pnpm add @repo-infrastructure/supabase
```

## Usage

```typescript
import { supabase } from '@repo-infrastructure/supabase'

// Example: Query a table
const { data, error } = await supabase
  .from('your_table')
  .select('*')

// Example: Authentication
const { data: { user }, error } = await supabase.auth.getUser()
```

## Configuration

The package requires the following environment variables:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_KEY`: Your Supabase project API key (anon/public key)

In test environments, the package will use default values if these are not provided:

- URL: `http://localhost:54321`
- Key: `dummy-key`

## Features

- Pre-configured Supabase client
- Environment-based configuration
- Type-safe database operations
- Re-exports all types from `@supabase/supabase-js`

## Development

```bash
# Build the package
pnpm build

# Run tests
pnpm test

# Watch mode during development
pnpm dev
