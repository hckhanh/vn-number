---
"vn-number": minor
---

Simplify the internal `formatNumber` helper by removing the `invalidValue` parameter. The function now directly checks if the parsed number is `NaN` and returns the fallback value, making the code more straightforward and easier to maintain.
