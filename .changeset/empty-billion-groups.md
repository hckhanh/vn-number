---
'vn-number': patch
---

Preserve "tỷ" when an intermediate billion group is zero and lower groups are nonzero. Also retain every repeated billion scale for large values ending in "nghìn tỷ tỷ" or "triệu tỷ tỷ". This fixes readings such as `1000500000000` to "một nghìn tỷ năm trăm triệu" for number, string, and bigint inputs.
