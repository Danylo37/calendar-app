# 📆 Calendar App
A modern, interactive calendar application built with React that helps you organize your schedule with a clean and intuitive interface.

# 🌟 Features
- Multiple View Modes: Toggle between Day, Week, and Month views
- Event Management: Create, edit, and delete events with ease
- Category System: Organize events by customizable categories
- Color Coding: Assign colors to events for visual differentiation
- Reminders: Set custom reminders for your events
- Drag & Drop: Move event forms around the screen for better visibility
- Real-time Updates: Current time indicator shows your position in the day
- Persistent Storage: All your data is saved in your browser's local storage

# 🛠️ Technology Stack
- React 19: Latest version with powerful hooks and state management
- date-fns: Comprehensive date manipulation library
- Lucide Icons: Beautiful SVG icons for the interface
- Local Storage API: For client-side data persistence

# 📋 Project Structure
```
src/
├── components/           # UI Components
│   ├── add-event-menu/   # Event creation and editing forms
│   ├── calendar/         # Calendar views and grid components
│   ├── category/         # Category management 
│   ├── layout/           # App layout (Header, Main, Footer)
│   ├── reminder/         # Reminder notifications
│   └── settings/         # Settings modal
├── constants/            # App constants (icons, etc.)
├── context/              # React Context for state management
├── hooks/                # Custom React hooks
├── styles/               # CSS styles organized by component
└── utils/                # Utility functions
```

# ✨ Key Features Explained
## Calendar Views
Switch between Day, Week, and Month views to visualize your schedule at different levels of detail. The current day is highlighted for easy reference.

## Event Management
Click on any time slot to create a new event. Events include:
- Title
- Date and time range
- Optional category assignment
- Color selection
- Description
- Reminder settings

## Categories
Create custom categories with icons to organize your events. You can filter events by category and manage them through the category dropdown menu.

## Reminders
Set reminders for events with flexible timing options. When a reminder is due, a popup will appear with the event details.

## Persistent Data
All your events, categories, and settings are automatically saved to your browser's local storage, so your data persists between sessions.

## 👨‍💻 Author
Danylo Lopatin
