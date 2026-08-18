## 2026-07-06 - [Mobile Navigation Accessibility]
**Learning:** Icon-only navigation toggles in mobile views are often overlooked for screen reader accessibility and keyboard focus states, even when the rest of the application is well-structured.
**Action:** Always verify that responsive UI elements (like hamburger menus) have explicit `aria-label` attributes and clear `focus-visible` states, as they are a primary interaction point for mobile keyboard/screen reader users.
