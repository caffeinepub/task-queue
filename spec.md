# Specification

## Summary
**Goal:** Add category delete protection for default categories, smart emoji icon suggestions for new categories, unify the logo across Login and Dashboard pages, and add a password criteria hint on the Signup page.

**Planned changes:**
- In the Sidebar, show a delete (×) button only on user-created custom categories; default categories (Work, Personal, Education, Household, Shopping, Health, Other) have no delete button and cannot be removed
- Clicking the delete button on a custom category removes it from localStorage and the sidebar; if the deleted category is currently active, revert to "All Tasks"
- When typing a new category name in the Add Category input, auto-suggest a relevant emoji based on keyword matching (e.g. "gym" → 🏋️, "political" → 🏛️, "music" → 🎵, "travel" → ✈️, "food" → 🍔, "sport" → ⚽, "finance" → 💰, "family" → 👨‍👩‍👧, "health" → 💊, "art" → 🎨, "tech" → 💻, "nature" → 🌿); display the suggested emoji as a preview next to the input and save it as the category icon; fall back to 📁 if no match
- Replace any placeholder or different logo on the Login page with the exact same logo image file used in DashboardHeader.tsx
- On the Signup page, add a "Minimum 6 characters" hint below the Password field that turns red when fewer than 6 characters are entered and green when the requirement is met
- Block signup form submission if the password is fewer than 6 characters and show a custom popup with the message "Password must be at least 6 characters."

**User-visible outcome:** Users can safely delete only their own custom categories, get smart emoji suggestions when naming new categories, see the same consistent logo on both the Login and Dashboard pages, and receive real-time password length feedback on the Signup page.
