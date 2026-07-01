# AI Life Tracker - Design Plan

## Design Philosophy
Minimalist, distraction-free interface following Apple Human Interface Guidelines. Focus on functionality and speed over visual effects. Clean typography, card-based layout, and intuitive navigation for one-handed usage in portrait orientation.

## Color Palette
- **Primary**: #0a7ea4 (Teal - for actions and highlights)
- **Background**: #ffffff (Light) / #151718 (Dark)
- **Surface**: #f5f5f5 (Light) / #1e2022 (Dark) - for cards
- **Foreground**: #11181C (Light) / #ECEDEE (Dark) - primary text
- **Muted**: #687076 (Light) / #9BA1A6 (Dark) - secondary text
- **Success**: #22C55E (Green)
- **Warning**: #F59E0B (Amber)
- **Error**: #EF4444 (Red)

## Screen List

### 1. Dashboard (Home)
**Purpose**: Central hub showing today's overview and recent activity.

**Content**:
- Date header with greeting
- Today's summary card (habits completed, goals progress)
- Quick stats (mood, energy, sleep)
- Recent activities list (last 5 entries)
- AI Summary card (if available for today)
- Quick action buttons (+ Activity, + Habit)

**Functionality**:
- Tap on any section to navigate to detailed view
- Pull-to-refresh to update data
- Swipe to access other tabs

### 2. Daily Check-in
**Purpose**: Quick morning/evening check-in for mood, energy, sleep, and focus.

**Content**:
- Check-in type selector (Morning / Evening)
- Mood selector (5-point scale with emoji: 😢 😕 😐 🙂 😄)
- Energy level slider (1-10)
- Sleep duration input (hours)
- Weight input (optional, with toggle)
- Main focus for today (text input)
- Notes field (optional)
- Save button

**Functionality**:
- Save check-in data
- Show confirmation message
- Return to dashboard

### 3. Activity Log
**Purpose**: Log daily activities throughout the day.

**Content**:
- Activity category tabs (All, Workout, Meal, Study, Work, Reading, Walking, Meditation, Custom)
- Time picker for activity
- Category selector
- Notes field
- Add button
- List of today's activities with time, category, and notes
- Swipe to delete

**Functionality**:
- Add new activity
- Edit existing activity
- Delete activity
- Filter by category
- Show activity history

### 4. Habit Tracker
**Purpose**: Track daily recurring habits and view streaks.

**Content**:
- List of active habits
- Each habit shows:
  - Habit name
  - Today's status (completed/not completed)
  - Current streak (days)
  - Weekly progress (7 dots for past week)
- Tap to toggle completion
- Add new habit button
- Edit/delete options (swipe or long-press)

**Functionality**:
- Mark habit as completed
- Create new habit
- Edit habit details
- Delete habit
- View streak history
- Show weekly progress

### 5. Goals
**Purpose**: Manage short-term and long-term goals.

**Content**:
- Goal type tabs (All, Short-term, Long-term)
- Goal cards showing:
  - Goal title
  - Description
  - Deadline
  - Progress percentage (visual bar)
  - Status (On track / At risk / Completed)
- Add new goal button
- Tap to view/edit goal details

**Functionality**:
- Create new goal
- Edit goal
- Update progress
- Mark as completed
- Delete goal
- Filter by type and status

### 6. Nutrition Log
**Purpose**: Track meals and nutritional intake.

**Content**:
- Date selector
- Meal entries for the day:
  - Meal name
  - Time
  - Calories (optional)
  - Protein (optional)
  - Notes
- Add meal button
- AI health comment (simple observation)

**Functionality**:
- Add new meal
- Edit meal
- Delete meal
- View meal history
- Calculate daily totals (if calories provided)

### 7. Workout Log
**Purpose**: Record exercise and track workout history.

**Content**:
- Date selector
- Workout entries:
  - Exercise name
  - Duration (minutes)
  - Sets/Reps (optional)
  - Notes
- Add workout button
- Workout history summary

**Functionality**:
- Add new workout
- Edit workout
- Delete workout
- View workout history
- Show total duration for the day

### 8. Daily Journal
**Purpose**: Reflective journaling at end of day.

**Content**:
- Date header
- Large text area for journal entry
- Character count (optional)
- Save button
- View past entries (list with dates)

**Functionality**:
- Write/edit journal entry
- Save entry
- View past entries
- Delete entry

### 9. AI Daily Summary
**Purpose**: Display AI-generated insights and recommendations.

**Content**:
- Date header
- Summary sections:
  - Activities completed (list)
  - Habits completed and missed (with counts)
  - Workout summary (total duration, exercises)
  - Meal summary (total meals, calories if available)
  - Goal progress (updated goals)
  - Productivity overview (brief assessment)
  - One encouraging observation
  - Three practical suggestions for tomorrow
- Regenerate button (optional)
- Share button

**Functionality**:
- Generate summary (triggered at end of day)
- Display summary
- Share summary
- Regenerate if needed

## Navigation Structure

**Tab Bar (5 tabs)**:
1. Dashboard (Home icon)
2. Check-in (Heart icon)
3. Activities (List icon)
4. Habits (Target icon)
5. More (Menu icon)

**More Tab contains**:
- Goals
- Nutrition Log
- Workout Log
- Daily Journal
- Settings

## Key User Flows

### Flow 1: Daily Check-in
1. User opens app
2. Taps Check-in tab
3. Selects check-in type (Morning/Evening)
4. Fills in mood, energy, sleep, focus
5. Taps Save
6. Returns to Dashboard

### Flow 2: Log Activity
1. User taps Activities tab
2. Taps + button
3. Selects time and category
4. Adds optional notes
5. Taps Save
6. Activity appears in list

### Flow 3: Track Habit
1. User taps Habits tab
2. Sees list of habits
3. Taps habit to toggle completion
4. Habit marked as completed
5. Streak updates

### Flow 4: View AI Summary
1. User opens app at end of day
2. Taps Dashboard
3. Sees AI Summary card
4. Taps to view full summary
5. Reads insights and suggestions

## Design System

### Typography
- **Headlines**: 24px, bold (SF Pro Display)
- **Subheadings**: 18px, semibold
- **Body**: 16px, regular
- **Caption**: 14px, regular (muted color)
- **Small**: 12px, regular (muted color)

### Spacing
- **Padding**: 16px (standard), 12px (compact), 24px (large)
- **Gap**: 12px (between items), 8px (compact)
- **Margin**: 16px (between sections)

### Components
- **Buttons**: Rounded corners (8px), padding 12px 24px, full width for primary actions
- **Cards**: Rounded corners (12px), 1px border (light color), padding 16px
- **Inputs**: Rounded corners (8px), 1px border, padding 12px
- **Sliders**: 4px height, teal accent
- **Toggles**: Standard iOS style

### Interactions
- **Press feedback**: 0.97 scale + light haptic
- **Transitions**: 200ms fade/slide (minimal)
- **Loading**: Spinner or skeleton (no progress bars)
- **Confirmation**: Toast messages (2s duration)

## Light/Dark Mode
- Automatic detection based on system settings
- All colors use CSS variables (no hardcoded colors)
- Smooth transition when toggling modes

## Responsive Design
- Portrait orientation (9:16 aspect ratio)
- One-handed usage priority
- Safe area handling for notch and home indicator
- Tab bar at bottom (always accessible)

## Future Expansion Considerations
- Calendar integration (date picker component)
- AI scheduling (time slot visualization)
- Smart reminders (notification settings screen)
- Food image recognition (camera integration)
- Wearable integration (data sync settings)
- Advanced analytics (charts and graphs)
- Voice input (microphone button)
- AI coaching (chat interface)
- Weekly/monthly reports (report generation)

## Accessibility
- Minimum touch target size: 44px
- Sufficient color contrast ratios
- Clear labels for all inputs
- Haptic feedback for important actions
- Support for dynamic text sizing
