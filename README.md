# Alcohol Reduction Tracker

A comprehensive alcohol reduction tracking application designed to help users monitor, understand, and reduce their alcohol consumption in line with NHS health guidelines. The app provides a supportive, non-judgmental interface that encourages healthier drinking habits through goal setting, progress tracking, and motivational features.

## Features

### 🔐 Authentication System
- **Mock Authentication**: Uses localStorage to simulate user accounts (easily upgradeable to Supabase)
- **Demo Credentials**: `demo@example.com` / `demo123` for testing
- **User Registration**: Full registration flow with password validation
- **Persistent Sessions**: Users remain logged in across browser sessions

### 📊 Dashboard
- **Overview Statistics**: Today's intake, weekly progress, current streak
- **Quick Actions**: Add drink, view calendar, view progress charts
- **Goal Progress**: Visual indicators showing progress toward weekly goals
- **Motivational Elements**: Streak counter and achievement indicators

### 🍷 Drink Logger
- **Quick Logging**: Pre-defined drink types with automatic unit calculations
- **Custom Drinks**: Add custom alcoholic beverages with manual unit input
- **Real-time Validation**: Prevents duplicate entries and validates input
- **Today's Summary**: Shows all drinks logged for the current day

### 🎯 Goal Setting
- **Weekly Limits**: Set weekly alcohol unit targets (default: 14 units per NHS guidelines)
- **Reduction Targets**: Set percentage reduction goals from current consumption
- **Personal Motivation**: Add personal motivation statements for accountability
- **NHS Guidelines**: Built-in reference to recommended alcohol limits

### 📈 Progress Visualization
- **Interactive Charts**: Line charts showing daily/weekly consumption trends
- **Multiple Timeframes**: 7-day, 30-day, and 90-day views
- **Goal Comparison**: Visual comparison of actual vs. target consumption
- **Statistical Insights**: Average consumption, best/worst days, trend analysis

### 📅 Calendar View
- **Monthly Overview**: Calendar grid showing daily consumption levels
- **Color-coded Days**: Visual indicators for days within/above goals
- **Daily Details**: Click any day to see detailed drink log
- **Streak Visualization**: Clear visual representation of goal-adherent days

### ⚙️ Settings & Data Management
- **Profile Management**: Edit name, email, and personal information
- **App Preferences**: Units system (UK/US), theme selection (light/dark/system)
- **Data Export/Import**: Full data portability in JSON format
- **Data Deletion**: Complete data removal functionality

### 🔔 Notifications
- **Daily Reminders**: Customizable time and message for tracking reminders
- **Weekly Reports**: Automated progress summaries on chosen days
- **Goal Reminders**: Configurable frequency for goal-focused notifications
- **Encouragement Messages**: Motivational content with adjustable frequency
- **Streak Celebrations**: Milestone notifications for achievement recognition
- **Warning Alerts**: Proactive notifications when approaching limits

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS v4 with custom design system
- **UI Components**: Shadcn/UI component library
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications + Browser Notification API
- **Data Storage**: localStorage (ready for cloud database upgrade)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd alcohol-tracking-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Demo Account
- **Email**: `demo@example.com`
- **Password**: `demo123`

## Project Structure

```
alcohol-tracking-app/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── DashboardView.tsx
│   ├── DrinkLogger.tsx
│   ├── GoalSetting.tsx
│   ├── ProgressView.tsx
│   ├── CalendarView.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── SettingsPage.tsx
│   └── NotificationsPage.tsx
├── services/            # Business logic services
│   ├── dataService.ts   # Data persistence and management
│   └── notificationService.ts # Notification system
├── styles/              # Global styles
│   └── globals.css
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.html           # HTML template
```

## Key Features Implementation

### Data Persistence
- All user data is stored in localStorage
- Automatic saving of all user actions
- Data export/import functionality for portability
- Ready for cloud database integration (Supabase)

### Notification System
- Browser notification API integration
- Configurable notification settings
- Smart scheduling for reminders and reports
- Milestone celebrations and warning alerts

### Health & Wellness Focus
- NHS guidelines integration (14 units weekly default)
- Non-judgmental approach with positive reinforcement
- Streak tracking for motivation
- Educational content about healthy drinking limits

## Future Enhancements

- **Cloud Database**: Easy upgrade to Supabase for multi-device sync
- **Push Notifications**: Native mobile notifications
- **Social Features**: Community support and sharing
- **Advanced Analytics**: Machine learning insights
- **Healthcare Integration**: Export for medical consultations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- NHS for alcohol consumption guidelines
- Shadcn/UI for the component library
- Recharts for data visualization
- Lucide for the icon set
