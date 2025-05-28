# Online Examination System

<div align="center">
  <img src="public/logo.svg" alt="Logo" width="100%" height="250" />
</div>

An online examination platform built with Next.js, designed to facilitate seamless exam creation, management, and participation.

## Features

- User authentication and authorization
- Role-based access control for admins, teachers, and students
- Exam creation and management
- Real-time exam participation
- Result calculation and analytics
- Responsive design for various devices
- Anti Cheating Mechanism
- Ai Feedback generation

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Firebase](https://firebase.google.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- Sonner toast notifications
- React Hook Form with Zod validation
- Google Gemini AI for response analysis

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/bhupesh227/examination_system.git
   cd examination_system
    ```
2. Install dependencies:
    ```bash
    npm install
    # or
    yarn install
    ```
3. Configure environment variables:
    ```bash
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    FIREBASE_PROJECT_ID=
    FIREBASE_PRIVATE_KEY=
    FIREBASE_CLIENT_EMAIL=
    GOOGLE_GENERATIVE_AI_API_KEY=
    NEXT_PUBLIC_MAX_EXAMCARD=
    NEXT_PUBLIC_EXAMCARD_PER_PAGE=
    ```


Running the Application <br>
Start the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Folder Structure
### The project follows a modular and scalable structure:

- /app – Main application components and pages

- /components – Reusable UI components

- /constants – Application constants

- /firebase – Firebase configuration and initialization

- /lib – Utility functions and libraries

- /public – Static assets (images, icons, etc.)

## Deploy on Vercel

This application can be easily deployed to Vercel:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Configure the environment variables
4. Deploy




## ✌️ Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/branch_name`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/branch_name`)
5. Open a Pull Request

## License

[MIT License](LICENSE) - Feel free to use and modify this project for your needs.

------------