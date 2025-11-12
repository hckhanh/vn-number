---
"vn-number": patch
---

Refactor several functions related to reading and processing digit groups in Vietnamese number words. The changes focus on improving code readability, simplifying logic, and making parameter handling more consistent across functions.

### Refactoring and Code Simplification

* Refactored conditional logic in `readFirstGroup` and `readSubsequentGroup` to use concise ternary expressions instead of multi-line if statements, improving readability in `src/read/three-digits.ts`.
* Simplified the implementation of `getDigitWord` by removing the intermediate variable and directly returning the mapped value in `src/read/digits.ts`.

### Consistent Parameter Handling

* Updated `readHundreds` to use `groupLength` instead of a boolean flag, and adjusted calls to `readHundreds`, `readTens`, and `readOnes` to consistently use `groupLength` or derived flags, ensuring more predictable behavior in `src/read/three-digits.ts`. [[1]](diffhunk://#diff-3fec7bfdd409e9017a9411ada902007e8e4e09dfe468f1566e38e002a7b0a521L6-R7) [[2]](diffhunk://#diff-3fec7bfdd409e9017a9411ada902007e8e4e09dfe468f1566e38e002a7b0a521L56-R65)

### Minor Code Quality Improvements

* Added spacing and minor formatting improvements for readability in utility functions such as `allFollowingGroupsAreZero` in `src/read/utils.ts` and `calculateGroupTypes` in `src/read/groups.ts`. [[1]](diffhunk://#diff-3f1a9cf533aed941787f7a40ca3900d359c1da32f1bc1536d2380c3b4968dbb4R26-R31) [[2]](diffhunk://#diff-8c09ad2ec1c3b0524c8cdbfe07826bfc856285b756983a817f609404a880821aR14-R20)
* Refactored the logic in `processGroup` to use a concise conditional expression when choosing between processing the first group or subsequent groups in `src/read/groups.ts`.
