# PrakritiConnect

A React + Vite application for connecting organizations and volunteers.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Firebase project

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Firebase configuration details:
     ```
     VITE_FIREBASE_API_KEY=your_firebase_api_key
     VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
     VITE_FIREBASE_PROJECT_ID=your_project_id
     VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
     VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
     VITE_FIREBASE_APP_ID=your_app_id
     VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## Security Notice

⚠️ **Important**: Never commit your `.env` file to version control. The `.gitignore` file is configured to exclude environment files to protect your Firebase credentials.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Firebase Setup

1. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
2. Enable Authentication and Firestore in your project
3. Get your Firebase configuration from Project Settings > Your Apps
4. Add the configuration to your `.env` file
