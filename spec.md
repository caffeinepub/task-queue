# IRONCLAD / VOLT

## Current State
- Login and Signup pages exist with white theme, VOLT logo in top nav, social login buttons (Google, Facebook, Twitter), bottom tab bar using emoji icons
- Dashboard with sidebar navigation, stats cards, recent workouts - all in light theme
- Auth flow: email/password login with simulated verification code

## Requested Changes (Diff)

### Add
- Nothing new added

### Modify
- LoginPage: Match the exact Workout.cool layout from image-6.png:
  - Top nav: logo (kettlebell/bolt icon) + "VOLT" brand name on left, clean icons on right (Remove Ads text, bell icon, dark/light toggle, language/translate icon, user avatar)
  - Page background: very light gray (#f5f7fa or similar)
  - Form centered with clean white card (no card border, just floating form)
  - Title: "Login to your account", subtitle: "Enter your credentials below to login"
  - Email field with placeholder "m@example.com"
  - Password field with "Forgot password?" link on right, eye toggle
  - Blue "Login" button (full width, rounded)
  - "OR" divider
  - "Sign in with Google" button (outlined, Google G icon, blue border)
  - "Don't have an account? Sign up" at bottom
  - Bottom tab bar: Workouts, Programs, Statistics, Tools, Leaderboard, Premium - with proper SVG icons (no emoji), grayed out (since user is not logged in)
  - No footer social links needed in mobile view (match the screenshot which is mobile)

### Remove
- Facebook and Twitter separate buttons in the bottom row (keep only Google as shown in image)
- Emoji icons in the bottom tab bar on login page

## Implementation Plan
1. Update LoginPage.tsx to match image-6.png layout exactly
2. Update SignupPage.tsx to match the same consistent style
3. Ensure bottom tab bar on login/signup uses proper Lucide icons (not emoji)

## UX Notes
- The image shows a clean, minimal login page similar to Workout.cool
- Bottom nav tabs are all grayed out on login page (not interactive)
- The "Sign in with Google" has a proper Google G colored icon, outlined blue border button
- Very clean and professional look
