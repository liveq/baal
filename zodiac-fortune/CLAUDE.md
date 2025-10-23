# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Korean zodiac fortune-telling web application featuring 12 Chinese zodiac animals with comprehensive fortune readings. The application is a single-page application (SPA) built with vanilla HTML, CSS, and JavaScript, designed for Korean users.

## Core Architecture

### Single-File Structure
- **`index.html`**: Complete SPA with modular sections and modal dialogs
- **`script.js`**: All JavaScript functionality including data, navigation, and UI logic  
- **`style.css`**: Comprehensive styling with responsive design and Korean text optimization

### Data Architecture

#### 30-Year Zodiac Calendar (2025-2054)
```javascript
const year_data = {
    2025: { stem_branch: '을사년', color_animal: '파란뱀의 해', zodiac_animal: '뱀', icon: '🐍' },
    // ... continues for 30 years
}
```
- **stem_branch**: Traditional Korean year naming (간지)
- **color_animal**: User-friendly format (e.g., "파란뱀의 해")
- **Auto-updating**: Header title changes based on current year

#### Zodiac Animal Data
```javascript
const zodiac_data = {
    rat: { name: '쥐띠', icon: '🐭', years: [1996, 1984, 1972, 1960, 1948], traits: [...] }
    // ... 12 animals total
}
```

### UI Layout System

#### 3x4 Grid Layout (Main Page)
- **Grid**: 3 rows × 4 columns = 12 zodiac cards
- **CSS Grid**: `grid-template-columns: repeat(4, 1fr)` with `gap: 1.2rem`
- **Action Buttons**: Positioned below grid with calculated center alignment via `centerActionButtons()`

#### Dual Selection System
Each zodiac card supports:
- **Year Selection**: Birth year buttons (4 years per animal)
- **Gender Selection**: Mars (♂) and Venus (♀) symbols
- **Order Independence**: Works regardless of year→gender or gender→year selection order
- **Auto-Navigation**: Proceeds to detail page when both selections are made

### Modal System

#### Modal Types
1. **My Zodiac Modal** (`my-zodiac-modal`): Birth year input with year picker
2. **Compatibility Modal** (`simple-compatibility-modal`): Two-person compatibility testing
3. **Lifetime Fortune Modal** (`lifetime-modal`): Long-form fortune display
4. **Result Modal** (`result-modal`): Compatibility results display

#### Navigation Features
- **Keyboard Shortcuts**: ESC closes all modals, M/B/F/G for gender selection
- **History API Integration**: Browser back/forward button support
- **Focus Management**: Tab navigation and visual feedback

### State Management

#### Selection Tracking
```javascript
let selected_cards = {}; // Tracks year/gender per zodiac
let current_zodiac = null;
let current_gender = 'male';
let current_year = null;
```

#### State Synchronization
- **Cross-Page Sync**: Main page selections carry to detail page
- **Reset on Navigation**: `showMainPage()` clears all selections
- **Persistent During Session**: Selections maintained until page refresh

### Korean Localization Features

#### Text Handling
- **Word Breaking**: `word-break: keep-all` for proper Korean text wrapping
- **Tooltip System**: Header hover shows traditional year names (간지)
- **Gender Representation**: Mars/Venus symbols with pink styling for female selections

#### Cultural Elements
- **Traditional Calendar**: 60-year cycle stem-branch system (간지)
- **Color Coding**: 5-element color system (blue/red/yellow/white/black)
- **Fortune Categories**: Daily, weekly, monthly, yearly, and lifetime readings

## Key Functions

### Navigation Functions
- `showMainPage()`: Resets state and displays main grid
- `showZodiacDetail(zodiac)`: Navigate to specific animal's detail page
- `showZodiacWithYear(zodiac, year)`: Handle year selection with auto-navigation
- `selectGender(btn)`: Handle gender selection with auto-navigation

### UI Positioning Functions
- `centerActionButtons()`: Calculates precise center alignment for action buttons based on grid width
- `updateYearTitle()`: Updates header with current year's zodiac information
- `updateDetailYearButtons(zodiac)`: Populates year buttons on detail page

### Modal Management
- `showMyZodiacModal()`: Personal zodiac lookup
- `showCompatibilityModalSimple()`: Relationship compatibility testing
- `closeModal(modalId)`: Universal modal closer with History API integration

## Development Considerations

### Performance Optimizations
- **DOM Ready Handlers**: Key functions called after DOM load with `setTimeout` delays
- **Event Delegation**: Efficient handling of dynamic year/gender buttons
- **CSS Grid**: Hardware-accelerated layout for smooth performance

### Responsive Design
- **Mobile-First**: Breakpoints at 768px (tablet) and 480px (mobile)
- **Grid Adaptation**: 4→2→1 columns based on screen size
- **Touch-Friendly**: Large tap targets and gesture support

### Accessibility Features
- **Keyboard Navigation**: Full tab/arrow key support
- **Visual Feedback**: Clear active/selected states
- **Screen Reader**: Semantic HTML structure with proper labels

## Testing Approach

### Manual Testing Points
1. **Selection Orders**: Test year→gender and gender→year paths
2. **Modal Navigation**: Verify ESC key and back button behavior  
3. **State Persistence**: Check selection memory across page transitions
4. **Responsive Layout**: Test grid alignment on different screen sizes
5. **Year Transitions**: Verify header updates with calendar changes

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **CSS Grid Support**: Required for layout functionality
- **JavaScript ES6**: Uses modern syntax including template literals and arrow functions

## Content Management

### Adding New Years
1. Extend `year_data` object with new year entries
2. Follow stem-branch cycle and color-animal naming conventions
3. Update year arrays in `zodiac_data` for birth year calculations

### Fortune Content Generation
- Content generated dynamically in `generateFortuneContent()`
- Uses template system with zodiac traits and random elements
- Supports multiple time periods (daily, weekly, monthly, yearly, lifetime)