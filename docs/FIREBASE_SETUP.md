# Firebase Authentication setup

The browser signs users in with Firebase Authentication. It sends the Firebase ID token in every API request:

```http
Authorization: Bearer <firebase-id-token>
```

The backend verifies that token with the Firebase Admin SDK and stores the Firebase UID, email, interview history, answers, and scorecard in SQLite.

## 1. Create and configure a Firebase project

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. In **Authentication → Sign-in method**, enable **Email/Password**.
3. Create a Web app and copy its public configuration into the frontend environment variables below.
4. In **Project settings → Service accounts**, generate an Admin SDK private-key JSON file. Keep it out of Git.

## 2. Configure environments

Frontend (`frontend/.env`):

```dotenv
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
```

Backend (`backend/.env`):

```dotenv
FIREBASE_AUTH_REQUIRED=true
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

For Render, add the service-account JSON through a secret file (or use the platform service account / Application Default Credentials) and set `FIREBASE_AUTH_REQUIRED=true`. Never commit the JSON key.

## 3. Frontend integration

Use `createUserWithEmailAndPassword` for signup and `signInWithEmailAndPassword` for login. Before calling the API, obtain `await auth.currentUser.getIdToken()` and attach it as the Bearer token shown above.

When `FIREBASE_AUTH_REQUIRED=false` (the local default), the API remains usable without Firebase so the backend can be developed and tested independently. Enable it in shared or production environments.
