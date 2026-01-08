# SubTrack - Subscription Management Application

## Project Overview

SubTrack is a comprehensive Android application designed to help users manage their recurring subscriptions. The app enables users to track subscription costs, receive payment reminders, and monitor their monthly expenses across various services.

## Features

- **User Authentication**: Firebase-based authentication system with login and registration
- **Subscription Management**: Add, edit, and delete subscriptions with customizable details
- **Cost Tracking**: Monitor subscription costs with automatic monthly expenditure calculations
- **Billing Frequency Support**: Track subscriptions with various billing cycles:
  - Weekly
  - Monthly
  - Quarterly
  - Semi-annually
  - Yearly
- **Reminder System**: Configurable notifications for upcoming subscription charges
- **Search Functionality**: Real-time search to filter subscriptions
- **Service Icons**: Visual representation with predefined icons for popular services
- **Local Database**: Room database for offline data persistence
- **Cloud Sync**: Backend synchronization with Neon database using Retrofit
- **Background Workers**: Automated daily checks for upcoming payments using WorkManager

## Technical Specifications

### Build Configuration

- **Application ID**: com.dev.subtrack
- **Minimum SDK**: API 24 (Android 7.0)
- **Target SDK**: API 36
- **Compile SDK**: API 36
- **Version Code**: 1
- **Version Name**: 1.0

### Architecture & Technologies

**Core Technologies:**
- **Language**: Java
- **Database**: Room (SQLite wrapper)
- **Authentication**: Firebase Authentication
- **Networking**: Retrofit 2.9.0 with Gson converter
- **Background Tasks**: WorkManager 2.9.0
- **UI Framework**: Material Design Components

**Key Dependencies:**
- AndroidX AppCompat
- Material Components
- ConstraintLayout
- RecyclerView
- Lifecycle Components (ViewModel, LiveData)
- Firebase BoM 34.6.0
- OkHttp Logging Interceptor

**Project Structure:**
```
com.dev.subtrack/
├── data/
│   ├── entities/          # Room database entities
│   ├── dao/               # Data access objects
│   ├── remote/            # API service and models
│   └── SubTrackDatabase   # Room database configuration
├── ui/
│   ├── auth/              # Login and registration
│   ├── feed/              # Subscription list view
│   ├── add/               # Add new subscription
│   ├── edit/              # Edit subscription
│   ├── profile/           # User profile
│   └── settings/          # App settings
└── utils/                 # Helper classes (notifications, workers, etc.)
```

## Installation Instructions

### Prerequisites

1. **Android Studio**: Download and install the latest version
   - Minimum recommended: Android Studio Hedgehog (2023.1.1) or later
   - Download from: https://developer.android.com/studio

2. **Java Development Kit (JDK)**: JDK 11 or higher
   - Verify installation: `java -version`

3. **Android SDK**: Ensure the following are installed via SDK Manager:
   - Android SDK Build-Tools
   - Android SDK Platform 36
   - Android Emulator (for testing without physical device)

4. **Git**: For cloning the repository (if applicable)

### Setup Steps

#### 1. Clone or Open the Project

Navigate to the project directory:
```bash
cd /Users/mertcankara/AndroidStudioProjects/SubTrack
```

Or open Android Studio and select:
- File > Open > Navigate to `/Users/mertcankara/AndroidStudioProjects/SubTrack`

#### 2. Firebase Configuration

The project includes a `google-services.json` file located at:
```
app/google-services.json
```

**Note**: This file contains Firebase project credentials. Ensure it is properly configured for the Firebase project associated with this application.

#### 3. Gradle Sync

Once the project is opened:
1. Android Studio will automatically prompt for a Gradle sync
2. Click "Sync Now" or go to File > Sync Project with Gradle Files
3. Wait for all dependencies to download (this may take several minutes on first run)

#### 4. Build the Project

In Android Studio:
1. Select Build > Make Project (or press `Ctrl+F9` / `Cmd+F9`)
2. Ensure there are no build errors in the Build output panel

#### 5. Configure Run Configuration

1. Connect an Android device via USB with USB Debugging enabled, OR
2. Create an Android Virtual Device (AVD):
   - Tools > Device Manager > Create Device
   - Select a device definition (e.g., Pixel 5)
   - Choose a system image (API 24 or higher)
   - Finish and launch the emulator

#### 6. Run the Application

1. Select your target device from the device dropdown menu
2. Click the Run button (green play icon) or press `Shift+F10`
3. The app will be installed and launched on the selected device

### Gradle Command Line Build (Optional)

For command-line builds:

```bash
# Navigate to project root
cd /Users/mertcankara/AndroidStudioProjects/SubTrack

# Build debug APK
./gradlew assembleDebug

# Install on connected device
./gradlew installDebug

# Build and run tests
./gradlew test
```

The generated APK will be located at:
```
app/build/outputs/apk/debug/app-debug.apk
```

## Test User Credentials

For testing purposes, use the following pre-configured test account:

**Email**: testuser@test.com
**Password**: 123123

**Note**: If the test user does not exist, you can create a new account using the registration screen within the application.

## Application Workflow

### First Launch
1. App opens to `LaunchActivity` (splash/entry screen)
2. Automatically redirects to `LoginActivity` if user is not authenticated
3. User can either:
   - Login with existing credentials
   - Navigate to `RegisterActivity` to create a new account

### Post-Authentication
1. Upon successful login, user is directed to `MainActivity`
2. Bottom navigation provides access to:
   - **Feed**: View all subscriptions with search and summary card
   - **Add**: Create new subscription entries
   - **Profile**: User profile information
   - **Settings**: Application settings

### Adding a Subscription
1. Navigate to "Add" tab
2. Fill in subscription details:
   - Service name
   - Select icon from grid
   - Cost amount
   - Billing frequency
   - First charge date
   - Optional notes
   - Enable/disable reminder notifications
3. Click "Add" button
4. Data is saved to local Room database
5. Background sync attempts to push data to remote server

### Managing Subscriptions
- **View**: Feed displays all subscriptions sorted by next charge date
- **Search**: Type in search bar to filter by service name
- **Edit**: Tap a subscription to open `EditSubscriptionActivity`
- **Delete**: Long-press a subscription and confirm deletion

### Notifications
- Daily background worker checks for upcoming charges
- Users receive notifications based on reminder preferences
- Default: 5 days before next charge (configurable per subscription)

## Permissions

The application requires the following permissions:

```xml
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

## Troubleshooting

### Common Issues

**Build Errors:**
- Ensure you have the correct SDK version installed (API 36)
- Clean and rebuild: Build > Clean Project, then Build > Rebuild Project
- Invalidate caches: File > Invalidate Caches / Restart

**Firebase Authentication Issues:**
- Verify `google-services.json` is in the `app/` directory
- Check Firebase Console for correct project configuration
- Ensure Firebase Authentication is enabled for Email/Password

**Notification Not Working:**
- Grant notification permissions in device settings
- For Android 13+, runtime permission for notifications is required
- Check that alarm/reminder permissions are enabled

**Gradle Sync Failed:**
- Check internet connection for dependency downloads
- Update Android Gradle Plugin if prompted
- Verify `local.properties` contains correct SDK path

### Logs and Debugging

Enable verbose logging in Android Studio:
1. View > Tool Windows > Logcat
2. Filter by application package: `com.dev.subtrack`
3. Check for errors during runtime

## Project Metadata

- **Project Name**: SubTrack
- **Package Name**: com.dev.subtrack
- **Author**: Mertcan
- **Build System**: Gradle (Kotlin DSL)
- **Version Control**: Git

## Additional Notes

- The application uses Room database with schema export enabled
- Database schema located at: `app/schemas/`
- ProGuard rules configured in `app/proguard-rules.pro`
- View binding is enabled for type-safe view access
- The app follows MVVM architecture pattern with ViewModel and LiveData

## Support

For issues or questions related to this assignment, please contact the course instructor or teaching assistant.
