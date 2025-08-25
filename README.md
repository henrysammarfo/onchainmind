# CircleLayer Frontend

A modern, professional-grade frontend for the CircleLayer AI-Powered Onchain Identity & SocialFi dApp, built with Next.js 14, TypeScript, and TailwindCSS.

## 🚀 Features

- **Modern Architecture**: Built with Next.js 14 App Router and TypeScript
- **Professional UI**: Clean, responsive design with TailwindCSS and shadcn/ui components
- **Authentication**: Complete JWT-based auth system with protected routes
- **Real-time Integration**: Fully connected to CircleLayer backend APIs
- **Mobile Responsive**: Optimized for all device sizes
- **Dark Mode**: Built-in dark theme support
- **Performance**: Optimized for speed and user experience

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: React Context + Hooks
- **HTTP Client**: Axios with interceptors
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   │   ├── signin/        # Sign in page
│   │   └── signup/        # Sign up page
│   ├── (dashboard)/       # Protected dashboard routes
│   │   └── dashboard/     # Main dashboard
│   ├── (marketing)/       # Public marketing pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/             # Reusable components
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Layout components
├── contexts/               # React contexts
├── lib/                    # Utilities and API client
├── hooks/                  # Custom React hooks
└── types/                  # TypeScript type definitions
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- CircleLayer backend running on `http://localhost:5000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📱 Available Pages

- **Landing Page** (`/`) - Marketing page with features and CTAs
- **Sign In** (`/signin`) - User authentication
- **Sign Up** (`/signup`) - User registration
- **Dashboard** (`/dashboard`) - Main user dashboard (protected)
- **Circles** (`/circles`) - Browse and join circles
- **Leaderboard** (`/leaderboard`) - Reputation rankings
- **Profile** (`/profile`) - User profile management
- **Settings** (`/settings`) - Account settings

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Next.js recommended rules
- **Prettier**: Consistent code formatting
- **Components**: Functional components with hooks
- **State**: React Context for global state

### API Integration

The frontend is fully integrated with the CircleLayer backend:

- **Authentication**: JWT tokens with automatic refresh
- **Real-time Data**: Live updates from backend APIs
- **Error Handling**: Comprehensive error management
- **Loading States**: Proper loading indicators
- **Offline Support**: Graceful degradation

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (`from-blue-500 to-indigo-500`)
- **Secondary**: Muted grays and accents
- **Success**: Green for positive actions
- **Warning**: Yellow for caution
- **Error**: Red for errors and destructive actions

### Components
- **Buttons**: Multiple variants (default, outline, ghost, gradient)
- **Cards**: Consistent card layouts with borders and shadows
- **Forms**: Accessible form inputs with validation
- **Navigation**: Responsive navbar with mobile menu
- **Modals**: Overlay dialogs for user interactions

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: TailwindCSS responsive utilities
- **Touch Friendly**: Proper touch targets and interactions
- **Performance**: Optimized images and animations

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on git push

### Other Platforms

- **Netlify**: Build command `npm run build`, publish directory `out`
- **AWS Amplify**: Connect repository and build
- **Docker**: Multi-stage build for containerization

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check this README and inline code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions on GitHub
- **Email**: Contact the development team directly

## 🔮 Roadmap

- [ ] **Real-time Chat**: WebSocket integration for live messaging
- [ ] **Mobile App**: React Native companion app
- [ ] **Advanced Analytics**: User behavior tracking and insights
- [ ] **Multi-language**: Internationalization support
- [ ] **PWA**: Progressive Web App capabilities
- [ ] **Advanced AI**: Enhanced AI Twin interactions

---

**Built with ❤️ by the CircleLayer Team**
