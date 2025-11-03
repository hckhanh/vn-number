---
"vn-number": minor
---

Improve performance by reusing shared `Intl.NumberFormat` instances. The formatter instances for Vietnamese number, currency, and percent formats are now created once and reused across all function calls, reducing memory allocation and improving execution speed.
