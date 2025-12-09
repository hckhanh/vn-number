# vn-number

## 2.0.4

### Patch Changes

- eafda0c: Add PURE annotations to enable better tree-shaking

## 2.0.3

### Patch Changes

- 2ea7e8e: Refactors several functions related to reading and processing digit groups in Vietnamese number words, focusing on code readability, logic simplification, and consistent parameter handling. Minor formatting and code quality improvements are also included, along with updates to development dependencies.

  ### Refactoring and Code Simplification

  - Replaced multi-line if statements with concise ternary expressions in `readFirstGroup` and `readSubsequentGroup` to improve readability in `src/read/three-digits.ts`.
  - Simplified the `getDigitWord` function by removing the intermediate variable and returning the mapped value directly in `src/read/digits.ts`.

  ### Consistent Parameter Handling

  - Updated `readHundreds` to use `groupLength` instead of a boolean flag, and made related changes in calls to `readHundreds`, `readTens`, and `readOnes` for more predictable behavior in `src/read/three-digits.ts`. [[1]](diffhunk://#diff-3fec7bfdd409e9017a9411ada902007e8e4e09dfe468f1566e38e002a7b0a521L6-R7) [[2]](diffhunk://#diff-3fec7bfdd409e9017a9411ada902007e8e4e09dfe468f1566e38e002a7b0a521L56-R65)

  ### Minor Code Quality Improvements

  - Added spacing and minor formatting for readability in utility functions such as `allFollowingGroupsAreZero` in `src/read/utils.ts` and `calculateGroupTypes` in `src/read/groups.ts`. [[1]](diffhunk://#diff-3f1a9cf533aed941787f7a40ca3900d359c1da32f1bc1536d2380c3b4968dbb4R26-R31) [[2]](diffhunk://#diff-8c09ad2ec1c3b0524c8cdbfe07826bfc856285b756983a817f609404a880821aR14-R20)

  ### Dependency Updates

  - Updated development dependencies in `package.json`, including `@biomejs/biome`, `syncpack`, and `tsdown` to their latest versions.

## 2.0.2

### Patch Changes

- 6c3cdee: Exclude test and benchmark files from the JSR package

## 2.0.1

### Patch Changes

- e9b3f15: Simplified `readVnNumber` string conversion to improve performance
- e9b3f15: Fixed logic to repeat "tỷ" based on group position dynamically, ensuring accurate representation for billions, octillions, and undecillions.

## 2.0.0

### Major Changes

- 4b7c059: Performance Optimization & Code Quality Improvements

  ### Breaking Changes

  - **Refactored from OOP to functional programming**: Removed class-based architecture (`NumberReader`, `Numbers`, `Thousand`, `Million`, `Billion`, `Zerofill` classes) in favor of pure functional approach
  - Internal implementation completely restructured for better performance and maintainability
  - **Note**: Public API (`readVnNumber`) remains unchanged and fully compatible

  ### Performance Improvements

  - **Eliminated class instantiation overhead**: No more object creation for each 3-digit group
  - **Removed property access overhead**: Direct string index access instead of class properties
  - **Eliminated inheritance chain lookups**: Flat function calls instead of prototype chain traversal
  - **Removed dynamic dispatch**: Direct function calls instead of class lookup maps
  - **Optimized string operations**: More efficient concatenation patterns
  - **Benchmarks**: Maintained excellent performance (2.3-6.8M ops/sec for typical use cases)

  ### Code Quality

  - **Reduced cognitive complexity**: Refactored complex functions to meet SonarCloud standards (<15 complexity)
    - `readThreeDigits`: Complexity reduced from 27 to <15
    - `readVnNumber`: Complexity reduced from 37 to <15
  - **Better code organization**: Split monolithic file into 5 focused modules:
    - `digits.ts` - Digit mapping and conversion
    - `utils.ts` - Utility functions for grouping and validation
    - `three-digits.ts` - Three-digit group reading logic
    - `groups.ts` - Group type calculation and processing
    - `index.ts` - Clean public API entry point
  - **Improved maintainability**: Smaller, focused functions with single responsibilities
  - **Better testability**: Individual modules can be tested in isolation

  ### Testing

  - **Expanded test coverage**: Increased from 42 to 68 tests (+62% increase)
  - **Comprehensive edge case coverage**: Added extensive tests for:
    - All leading zero patterns (001, 068, 060, etc.)
    - All tens patterns (10-99) with special rules
    - All hundreds patterns (100-999)
    - Mixed magnitude numbers
    - Boundary values at each magnitude level
    - All Vietnamese reading rules (mốt, lăm, lẻ, không trăm)
  - **91 total tests passing** (68 for read module, 23 for format module)

  ### Internal Changes

  - Removed 12 files (old class implementations and their tests)
  - Added 4 new modular files with clear separation of concerns
  - Maintained 100% backward compatibility for public API

### Patch Changes

- 4b7c059: Optimize logic of `formatNumber` function

## 1.6.1

### Patch Changes

- 59d9cfb: Fix configurations for release workflow

## 1.6.0

### Minor Changes

- d47e3e4: Simplify the internal `formatNumber` helper by removing the `invalidValue` parameter. The function now directly checks if the parsed number is `NaN` and returns the fallback value, making the code more straightforward and easier to maintain.
- d47e3e4: Improve performance by reusing shared `Intl.NumberFormat` instances. The formatter instances for Vietnamese number, currency, and percent formats are now created once and reused across all function calls, reducing memory allocation and improving execution speed.

### Patch Changes

- 6c09073: Fix currency formatting to use Unicode non-breaking space (`U+00A0`) between number and currency symbol. This ensures consistent spacing that won't break across lines and matches the standard `Intl.NumberFormat` behavior.
