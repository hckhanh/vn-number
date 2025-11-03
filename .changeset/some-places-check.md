---
"vn-number": patch
---

- Fix currency formatting to use Unicode non-breaking space (U+00A0) between number and currency symbol. This ensures consistent spacing that won't break across lines and matches the standard Intl.NumberFormat behavior.
- Improve performance by reusing shared Intl.NumberFormat instances. The formatter instances for Vietnamese number, currency, and percent formats are now created once and reused across all function calls, reducing memory allocation and improving execution speed.
- Simplify internal formatNumber helper by removing the invalidValue parameter. The function now directly checks if the parsed number is NaN and returns the fallback value, making the code more straightforward and easier to maintain.
