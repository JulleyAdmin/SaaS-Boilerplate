Analyze and compare database schemas from reference templates with our current schema.

**Inputs:** $ARGUMENTS (space-separated file paths to schema files)

Follow these steps:

1. Read each provided schema file thoroughly
2. Read our current schema at `src/models/Schema.ts`
3. Create a comprehensive comparison:
   - Identify overlapping concepts (Team vs Organization vs Workspace)
   - Map similar fields and relationships
   - Find unique features in each template
   - Note data types and constraint differences
4. Think carefully about unified schema design that:
   - Preserves our existing functionality
   - Incorporates proven patterns from templates
   - Maintains TypeScript/Drizzle ORM compatibility
   - Follows our multi-tenant architecture
5. Generate SCHEMA_MAPPING.md with detailed field mappings
6. Provide recommendations for schema extension strategy

Remember to consider:
- Clerk organization integration
- Multi-tenancy requirements
- Type safety with TypeScript
- Migration complexity
