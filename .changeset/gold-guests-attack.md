---
"vn-number": patch
---

Refactors several functions related to reading and processing digit groups in Vietnamese number words, focusing on code readability, logic simplification, and consistent parameter handling. Minor formatting and code quality improvements are also included, along with updates to development dependencies.

### Refactoring and Code Simplification

* Replaced multi-line if statements with concise ternary expressions in `readFirstGroup` and `readSubsequentGroup` to improve readability in `src/read/three-digits.ts`.
* Simplified the `getDigitWord` function by removing the intermediate variable and returning the mapped value directly in `src/read/digits.ts`.

### Consistent Parameter Handling

* Updated `readHundreds` to use `groupLength` instead of a boolean flag, and made related changes in calls to `readHundreds`, `readTens`, and `readOnes` for more predictable behavior in `src/read/three-digits.ts`. [[1]](diffhunk://#diff-3fec7bfdd409e9017a9411ada902007e8e4e09dfe468f1566e38e002a7b0a521L6-R7) [[2]](diffhunk://#diff-3fec7bfdd409e9017a9411ada902007e8e4e09dfe468f1566e38e002a7b0a521L56-R65)

### Minor Code Quality Improvements

* Added spacing and minor formatting for readability in utility functions such as `allFollowingGroupsAreZero` in `src/read/utils.ts` and `calculateGroupTypes` in `src/read/groups.ts`. [[1]](diffhunk://#diff-3f1a9cf533aed941787f7a40ca3900d359c1da32f1bc1536d2380c3b4968dbb4R26-R31) [[2]](diffhunk://#diff-8c09ad2ec1c3b0524c8cdbfe07826bfc856285b756983a817f609404a880821aR14-R20)

### Dependency Updates

* Updated development dependencies in `package.json`, including `@biomejs/biome`, `syncpack`, and `tsdown` to their latest versions.
