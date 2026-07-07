import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasourceUrl: env('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/pdftools'),
})
