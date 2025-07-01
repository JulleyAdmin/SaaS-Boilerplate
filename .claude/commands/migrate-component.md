Migrate the component at $ARGUMENTS to use the latest patterns.

Follow these steps:

1. Read the existing component file
2. Check existing components in `src/features/` and `src/components/` for current patterns
3. Update the component to use:
   - ES modules (import/export)
   - TypeScript strict typing
   - React Hook Form with Zod validation (if forms are involved)
   - Proper Clerk auth patterns for multi-tenancy
   - Tailwind CSS with Shadcn UI components
4. Run tests to ensure the migration doesn't break functionality
5. Run `npm run check-types` and `npm run lint` to verify code quality
6. Commit the changes with a descriptive message
