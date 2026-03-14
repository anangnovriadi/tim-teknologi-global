# Tim Teknologi Global - Inventory Management System (Frontend)

A modern, responsive inventory management system built with Next.js, React, and TypeScript.

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)

You can check your versions with:
```bash
node --version
npm --version
```

## Installation

### 1. Navigate to the Frontend Directory

```bash
cd frontend
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

This will install all required packages including:
- Next.js 15.4.1
- React 19
- Redux Toolkit with RTK Query
- Tailwind CSS
- Shadcn/ui components
- And other dependencies

## Running the Development Server

### Start Development Server

Using npm:
```bash
npm run dev
```

Or using yarn:
```bash
yarn dev
```

The application will start on **http://localhost:3000** by default.

If port 3000 is already in use, you can specify a different port:
```bash
npm run dev -- -p 3001
```

### Building for Production

To create an optimized production build:
```bash
npm run build
```

### Running Production Build

After building, run the production server with:
```bash
npm run start
```

## Features

### Dashboard
- Welcome banner with quick overview
- Real-time inventory statistics
  - Total items count
  - Low stock items alert
- Responsive grid layout

### Inventory Management
- Complete inventory listing with detailed information
- **Search Functionality**: Search by SKU, item name, or category in real-time
- **Pagination**: Navigate through inventory items (10 items per page)
- Stock status indicators
  - Green badge: Normal stock level
  - Red badge: Low stock (needs reorder)
- Responsive table with horizontal scroll on mobile

### Authentication
- User login with email and password
- JWT-based token authentication
- Secure session management
- Auto-redirect based on authentication status

### UI/UX
- Dark mode support
- Responsive design (mobile, tablet, desktop)
- Side navigation with collapsible menu
- Loading states and error handling
- Toast notifications for user feedback
- Shadcn/ui components for consistent styling

## Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory with the following variables:

```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

**Important**: Environment variables must start with `NEXT_PUBLIC_` to be accessible in the browser.

## Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── admin/             # Admin routes
│   │   │   ├── page.tsx       # Dashboard page
│   │   │   └── inventory/     # Inventory page
│   │   ├── login/             # Login page
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── ui/               # UI components (buttons, cards, etc.)
│   │   ├── layouts/          # Layout components
│   │   ├── app-sidebar.tsx   # Sidebar navigation
│   │   └── login-form.tsx    # Login form
│   ├── store/                # Redux store configuration
│   │   ├── api/              # RTK Query API endpoints
│   │   ├── auth-slice.ts     # Auth state management
│   │   └── index.ts          # Store configuration
│   ├── constants/            # Application constants
│   │   └── routes.ts         # Route definitions
│   └── types/                # TypeScript type definitions
├── public/                   # Static assets
├── package.json              # Dependencies and scripts
├── next.config.ts           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process on port 3000 (macOS/Linux)
lsof -i :3000 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

### Dependencies Installation Issues
Try clearing npm cache and reinstalling:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Backend API Connection Issues
Ensure the backend server is running on `http://127.0.0.1:8000`:
```bash
# Check backend is running
curl http://127.0.0.1:8000/docs
```

If the backend is on a different URL, update the `NEXT_PUBLIC_API_BASE_URL` in `.env.local`.

### Clear Browser Cache
If you experience unexpected behavior, try clearing browser cache or using incognito mode.

## Login Credentials

Default admin credentials for testing:
- **Email**: admin@mail.com
- **Password**: Admin123

## Technology Stack

- **Framework**: Next.js 15.4.1
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Data Fetching**: RTK Query
- **Components**: Shadcn/ui
- **Icons**: Lucide React
- **Form Management**: Formik + Yup
- **Notifications**: Sonner

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary and belongs to Tim Teknologi Global.

## Support

For issues and questions, please contact the development team.
