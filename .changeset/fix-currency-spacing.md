---
"vn-number": patch
---

Fix currency formatting to use Unicode non-breaking space (U+00A0) between number and currency symbol. This ensures consistent spacing that won't break across lines and matches the standard Intl.NumberFormat behavior.
