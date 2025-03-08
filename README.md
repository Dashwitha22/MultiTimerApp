# MultiTimerApp

A React Native app for managing multiple timers with features like start, pause, reset, and bulk actions for timers in a category.

---

## Features
- Start, pause, and reset individual timers.
- Bulk actions (start all, pause all, reset all) for timers in a category.
- Halfway alerts and completion notifications.
- Display timer status (Running, Paused, Completed) with color-coded text.

---

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm
- React Native CLI
- Android Studio (for Android development) or Xcode (for iOS development)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/Dashwitha22/MultiTimerApp.git

2. Navigate to the project directory:
    cd MultiTimerApp

3. Install dependencies:
    npm install

4. Running the App
    1. Start an Android emulator or connect a physical device.
    2. Run the app:
        npm run android
    
## Assumptions Made During Development
    1. Timer Behavior:
        - Timers count down in seconds.
        - Timers can be started, paused, and reset individually or in bulk.
        - Timers display their status (Running, Paused, Completed).

    2. Alerts:
        - A halfway alert is triggered when the timer reaches 50% of its duration.
        - Alerts are displayed only once per timer session.

    3. Bulk Actions:
        - Bulk actions (start all, pause all, reset all) apply to all timers in a specific category.
        - Timers in a category are grouped together for easy management.

    4. State Management:
        - Timer states (remaining time, status, alerts) are managed using React's useState and useEffect hooks.
        - Timer data is persisted using AsyncStorage.

    5. UI/UX:
        - The app uses a simple and intuitive interface.
        - Status text is color-coded (e.g., blue for completed timers).

    6. Platform Compatibility:
        - The app is designed to work on both Android and iOS platforms.