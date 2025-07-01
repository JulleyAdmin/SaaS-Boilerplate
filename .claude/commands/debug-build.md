Debug build issues and fix them.

Follow these steps:

1. Run `npm run build` to identify build errors
2. If there are TypeScript errors, run `npm run check-types` for detailed output
3. If there are linting errors, run `npm run lint` and `npm run lint:fix`
4. Analyze each error systematically:
   - Type errors: Check imports, exports, and type definitions
   - Module resolution: Verify file paths and imports
   - Dependency issues: Check package.json and node_modules
5. Fix errors one by one, testing after each fix
6. Ensure all fixes follow the project's patterns and best practices
7. Run the full test suite to ensure no regressions
8. Create a commit with all the build fixes
