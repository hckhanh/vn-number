# GitHub Copilot Instructions for vn-number

## Project Overview

This repository contains `vn-number`, a TypeScript library providing utility functions for working with numbers in the Vietnamese language. The library:

- Converts numbers to Vietnamese text (`readVnNumber`)
- Formats numbers in Vietnamese style (`formatVnNumber`)
- Formats Vietnamese currency (VND) (`formatVnCurrency`)
- Formats percentages in Vietnamese style (`formatVnPercent`)

## Code Style and Formatting

### Formatting Tool
- Use **Biome** for code formatting and linting (configured in `biome.json`)
- Run `pnpm format` to format and lint code
- Always format code before committing

### Style Guidelines
- **Quotes**: Use single quotes for strings
- **Semicolons**: Use semicolons only when needed (ASNeeded style)
- **Arrow Functions**: Always use parentheses around arrow function parameters
- **Indentation**: 2 spaces
- **Import Organization**: Organize imports automatically (enabled in Biome config)
- **File Extensions**: Always include `.ts` extension in imports (e.g., `import { x } from './file.ts'`)

### TypeScript
- **Strict Mode**: Always enabled
- **Target**: ESNext
- **Module System**: ESM (ES Modules) only
- **Type Safety**: Avoid `any` types; use proper typing
- **JSDoc**: Document all exported functions with JSDoc comments including `@example` blocks
- **No Emit**: This project uses `tsdown` for bundling, not `tsc`

## Testing

### Test Framework
- Use **Vitest** for all tests
- Run tests with `pnpm test`
- Test files should be co-located with source files (e.g., `file.test.ts` next to `file.ts`)

### Testing Standards
- Maintain 100% test coverage for new functions
- Write comprehensive test cases covering:
  - Normal cases
  - Edge cases (empty strings, zero, negative numbers)
  - Large numbers (including bigint support)
  - Boundary conditions
- Use descriptive test names that explain what is being tested
- Follow existing test patterns in the codebase

### Coverage Exclusions
- `src/index.ts` (barrel exports only)
- `src/format/index.ts` (barrel exports only)
- Configuration files

## Vietnamese Language Rules

When working with number-to-text conversion, follow these Vietnamese language conventions:

- **"lăm" rule**: Numbers ending in 15, 25, 35, etc. use "lăm" (e.g., 15 → "mười lăm")
- **"mốt" rule**: Numbers ending in 21, 31, 41, etc. use "mốt" (e.g., 21 → "hai mươi mốt")
- **"lẻ" rule**: Use "lẻ" for numbers with zeros in the tens place (e.g., 101 → "một trăm lẻ một")
- **Zero handling**: Handle zeros properly in different positions

## Build and Release

### Build Process
- Build tool: **tsdown** (configured in `tsdown.config.ts`)
- Build command: `pnpm prepublishOnly` or `pnpm release`
- Output directory: `dist/`
- Do NOT commit the `dist/` directory (it's in `.gitignore`)

### Release Process
- This project uses **Changesets** for versioning
- Create changesets using `@changesets/cli`
- Release command: `pnpm release`

## Dependencies

### Zero Runtime Dependencies
- This library has **zero runtime dependencies** by design
- Do NOT add runtime dependencies unless absolutely necessary
- Only add devDependencies for tooling

### Package Manager
- Use **pnpm** (not npm or yarn)
- Workspaces are configured for the `docs` subdirectory

## Security Best Practices

- Never hardcode sensitive values or secrets
- Validate all input parameters, especially when accepting `string | number | bigint` types
- Handle edge cases like `Infinity`, `NaN`, and very large numbers
- Ensure safe string manipulation without injection risks
- No external HTTP requests or file system operations in the main library

## Documentation

### Code Documentation
- All exported functions must have JSDoc comments
- Include `@param` for all parameters with clear descriptions
- Include `@return` describing what the function returns
- Include `@example` blocks showing real usage
- Examples should be executable TypeScript code

### README and Docs
- Keep `README.md` up to date with API changes
- Documentation site is in the `docs/` subdirectory
- Update documentation when adding or changing public APIs

## Project Structure

```
src/
├── index.ts           # Main entry point (barrel exports)
├── format/            # Number formatting functions
│   ├── index.ts       # Format module exports
│   ├── number.ts      # Implementation
│   └── number.test.ts # Tests
└── read/              # Number reading (text conversion) functions
    ├── index.ts       # Read module exports
    ├── digits.ts      # Digit processing
    ├── groups.ts      # Group processing
    ├── three-digits.ts # Three-digit processing
    ├── utils.ts       # Utility functions
    └── *.test.ts      # Test files
```

## Contributing Guidelines

- Make minimal, focused changes
- Ensure all tests pass before committing
- Run `pnpm format` before committing
- Follow existing code patterns and conventions
- Add tests for new functionality
- Update documentation for API changes

## Browser and Runtime Compatibility

- Support Node.js 14+, Bun, Deno, modern browsers, React Native, Electron
- Support Edge Runtime (Vercel, Cloudflare Workers)
- No Node.js-specific APIs (keep it platform-agnostic)
- ES Module format only

## Common Patterns

### Input Validation
```ts
// Accept flexible input types
function myFunction(value: string | number | bigint): string {
  const str = value.toString()
  // ... process
}
```

### Error Handling
- Return sensible defaults rather than throwing errors when possible
- Use fallback parameters for formatting functions

### Performance
- Benchmark files (`*.bench.ts`) use CodSpeed for performance testing
- Consider performance for large numbers
- Avoid unnecessary allocations and string operations
