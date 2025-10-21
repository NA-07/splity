# Splity - Expense Sharing Made Easy

A modern, full-featured expense-sharing platform built with Next.js 15, Firebase, and TypeScript. Split bills, track group expenses, and settle up with friends effortlessly.

## 🚀 Features

- **User Authentication**: Secure signup/login with Firebase Authentication
- **Group Management**: Create and manage expense groups for trips, roommates, or any shared activities
- **Expense Tracking**: Add expenses with detailed descriptions, categories, and split options
- **Smart Splitting**: Support for equal splits, exact amounts, and percentage-based splits
- **Balance Calculations**: Automatic calculation of who owes whom
- **Settlement System**: Track and manage debt settlements within groups
- **Real-time Updates**: Firebase Firestore ensures data is always in sync
- **Responsive Design**: Beautiful UI that works on all devices

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Backend**: [Firebase](https://firebase.google.com/)
  - Authentication
  - Firestore Database
  - Cloud Storage
- **Icons**: [Lucide React](https://lucide.dev/)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.x or higher
- npm or yarn package manager
- A Firebase account ([Create one here](https://firebase.google.com/))

## 🔧 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/splity.git
   cd splity
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase**:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project (or use an existing one)
   - Enable Authentication with Email/Password provider
   - Create a Firestore database
   - Copy your Firebase configuration

4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
splity/
├── app/                      # Next.js App Router pages
│   ├── auth/                 # Authentication pages
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/            # Main dashboard
│   ├── groups/               # Group management pages
│   ├── expenses/             # Expense listing pages
│   ├── profile/              # User profile page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/               # React components
│   ├── auth/                 # Authentication components
│   ├── expense/              # Expense-related components
│   ├── group/                # Group-related components
│   ├── layout/               # Layout components
│   ├── split/                # Split calculation components
│   └── ui/                   # Reusable UI components
├── hooks/                    # Custom React hooks
│   ├── useAuth.ts            # Authentication hook
│   ├── useGroups.ts          # Groups data hook
│   └── useExpenses.ts        # Expenses data hook
├── lib/                      # Utility functions
│   ├── firebase.ts           # Firebase configuration
│   ├── utils.ts              # General utilities
│   └── formatters.ts         # Data formatters
├── services/                 # Firebase service layer
│   ├── auth.ts               # Authentication services
│   ├── groups.ts             # Group management services
│   ├── expenses.ts           # Expense management services
│   └── settlements.ts        # Settlement services
├── types/                    # TypeScript type definitions
│   └── index.ts              # Shared types
└── public/                   # Static assets
```

## 🗄️ Database Schema

### Users Collection (`users`)
```typescript
{
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Groups Collection (`groups`)
```typescript
{
  id: string
  name: string
  description: string
  createdBy: string
  members: [
    {
      userId: string
      email: string
      displayName: string
      role: 'admin' | 'member'
      joinedAt: Timestamp
    }
  ]
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Expenses Collection (`expenses`)
```typescript
{
  id: string
  groupId: string
  description: string
  amount: number
  currency: string
  paidBy: string
  splitType: 'equal' | 'exact' | 'percentage'
  splits: [
    {
      userId: string
      amount: number
      percentage?: number
      paid: boolean
    }
  ]
  category: string
  date: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### Settlements Collection (`settlements`)
```typescript
{
  id: string
  groupId: string
  fromUserId: string
  toUserId: string
  amount: number
  currency: string
  status: 'pending' | 'completed'
  createdAt: Timestamp
  settledAt?: Timestamp
}
```

## 🚀 Development Workflow

### Running the Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
```

### Starting Production Server
```bash
npm start
```

### Linting
```bash
npm run lint
```

## 🔐 Security Best Practices

- Never commit `.env` files to version control
- Keep Firebase API keys secure (they're safe for client-side use but restrict by domain in Firebase Console)
- Set up Firestore Security Rules in production:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Groups can be read by members, written by admins
    match /groups/{groupId} {
      allow read: if request.auth != null && 
        request.auth.uid in resource.data.members.map(m => m.userId);
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && 
        resource.data.createdBy == request.auth.uid;
    }
    
    // Expenses can be accessed by group members
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null;
    }
    
    // Settlements can be accessed by involved users
    match /settlements/{settlementId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 📱 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com/)
3. Add environment variables in Vercel project settings
4. Deploy!

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- [Netlify](https://www.netlify.com/)
- [Railway](https://railway.app/)
- [Render](https://render.com/)
- [AWS Amplify](https://aws.amazon.com/amplify/)

Make sure to:
1. Set all environment variables
2. Configure build command: `npm run build`
3. Configure start command: `npm start`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Firebase](https://firebase.google.com/) for backend infrastructure
- [Shadcn UI](https://ui.shadcn.com/) for beautiful components
- [Vercel](https://vercel.com/) for hosting

## 📞 Support

For support, email support@splity.example.com or open an issue in the repository.

---

Built with ❤️ by the Splity Team