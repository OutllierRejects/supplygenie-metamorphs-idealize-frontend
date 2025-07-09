# SupplyGenie Frontend

![SupplyGenie Logo](supplygenie-frontend/public/logo.png)

## Overview

SupplyGenie is an AI-powered supply chain advisor that helps businesses discover, evaluate, and connect with suppliers based on their exact requirements. This repository contains the frontend application built with Next.js 15, React 18, and modern UI components.

## 🚀 Features

- **AI-Powered Chat Interface**: Interactive chat system for supplier recommendations and supply chain guidance
- **User Authentication**: Secure Firebase-based authentication with sign-up and login functionality
- **Responsive Design**: Modern, mobile-first UI built with Tailwind CSS and shadcn/ui components
- **Speech-to-Text**: Voice input capability for hands-free interaction
- **Real-time Supplier Data**: Integration with supply chain APIs for up-to-date supplier information
- **Dark Theme**: Professional dark-themed interface optimized for business use

## 🛠️ Tech Stack

**Frontend**: Next.js 15.2.4 with React 18 and TypeScript 5  
**UI/Styling**: Tailwind CSS, shadcn/ui, Radix UI components  
**Authentication**: Firebase 11.9.1 for user management and security  
**Database**: MongoDB 6.17.0 for data persistence and chat history  
**Forms**: React Hook Form with Zod validation  
**Voice**: Web Speech API for speech-to-text functionality  
**Charts**: Recharts for data visualization  
**Icons**: Lucide React icon library  
**Deployment**: Vercel with automatic deployments

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or later
- pnpm (recommended) or npm
- Firebase account and project
- MongoDB database (local or cloud)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/supplygenie-metamorphs-idealize-frontend.git
   cd supplygenie-metamorphs-idealize-frontend/supplygenie-frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the `supplygenie-frontend` directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/supplygenie
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/supplygenie

   # Supply Chain API
   SUPPLY_CHAIN_API_URL=your_backend_api_url
   ```

4. **Firebase Setup**
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password provider)
   - Enable Firestore Database
   - Add your domain to authorized domains

5. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Authentication
1. **Sign Up**: Create a new account with email and password
2. **Login**: Sign in to access the chat interface

### Chat Interface
1. **Text Input**: Type your supply chain questions or requirements
2. **Voice Input**: Click the microphone icon to use speech-to-text
3. **Supplier Recommendations**: Get AI-powered supplier suggestions based on your needs
4. **Contact Information**: Access supplier contact details, ratings, and specifications

### Example Responses

**Query**: "I need electronics manufacturers in Asia"

**Response**: 
```
🏭 Found 3 suppliers matching your criteria:

1. TechSource Electronics (Shenzhen, China)
   ⭐ Rating: 4.8/5 | 📅 Lead Time: 15-20 days
   💰 Price Range: Competitive
   📞 Contact: +86-755-xxxx | tech@techsource.com

2. Pacific Components (Taipei, Taiwan)
   ⭐ Rating: 4.6/5 | 📅 Lead Time: 10-15 days
   💰 Price Range: Premium
   🌐 Website: www.pacificcomp.tw

3. ElectroAsia Manufacturing (Bangkok, Thailand)
   ⭐ Rating: 4.4/5 | 📅 Lead Time: 20-25 days
   💰 Price Range: Budget-friendly
   📧 Contact: sales@electroasia.th
```

## 🌐 API Integration

The application integrates with:

1. **Supply Chain API**: Backend service for supplier data and recommendations
2. **Firebase Authentication**: User management and security
3. **MongoDB**: Data persistence and chat history
4. **Web Speech API**: Browser-native speech recognition

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🎯 Roadmap

- [ ] Advanced supplier filtering and sorting
- [ ] Bulk supplier comparison
- [ ] Integration with procurement systems
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

---

**Built with ❤️ by the SupplyGenie Team**
