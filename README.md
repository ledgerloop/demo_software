# Invoice Management System

A comprehensive invoice management system built with React, TypeScript, Supabase, and Express.js. This application provides a complete solution for managing clients, creating invoices, tracking time, and monitoring business analytics.

## Features

### Frontend (React + TypeScript)
- **Dashboard**: Revenue analytics, invoice status tracking, and recent activity
- **Invoice Management**: Create, edit, and track invoices with PDF generation
- **Client Management**: Comprehensive client profiles with contact information and billing rates
- **Time Tracking**: Built-in timer with project categorization and billing integration
- **Settings**: Company information, invoice templates, and notification preferences
- **Authentication**: Secure user authentication with Supabase
- **Dark Mode**: Full dark mode support with system preference detection
- **Responsive Design**: Mobile-first design that works on all devices

### Backend (Express.js + Node.js)
- **RESTful API**: Clean API architecture with proper error handling
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Data Validation**: Input validation using express-validator
- **Security**: Helmet.js for security headers, CORS configuration
- **Logging**: Request logging with Morgan
- **Error Handling**: Comprehensive error handling middleware

### Database (Supabase/PostgreSQL)
- **Row Level Security**: Secure data isolation between users
- **Optimized Queries**: Proper indexing for performance
- **Real-time Updates**: Supabase real-time subscriptions
- **Data Integrity**: Foreign key constraints and data validation
- **Backup & Recovery**: Automated backups with Supabase

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Supabase for backend services
- Recharts for data visualization
- Date-fns for date manipulation
- Lucide React for icons

### Backend
- Node.js with Express.js
- JWT for authentication
- Bcrypt for password hashing
- Express Validator for input validation
- Morgan for logging
- Helmet for security
- CORS for cross-origin requests

### Database
- PostgreSQL (via Supabase)
- Row Level Security (RLS)
- Real-time subscriptions
- Automated backups

## Project Structure

```
invoice-management-system/
├── src/                          # Frontend source code
│   ├── components/              # Reusable React components
│   │   ├── Layout.tsx          # Main layout wrapper
│   │   ├── Sidebar.tsx         # Navigation sidebar
│   │   ├── Header.tsx          # Top header bar
│   │   ├── InvoiceModal.tsx    # Invoice creation/editing modal
│   │   ├── ClientModal.tsx     # Client creation/editing modal
│   │   └── ProtectedRoute.tsx  # Route protection component
│   ├── contexts/               # React context providers
│   │   ├── AuthContext.tsx     # Authentication state management
│   │   ├── ThemeContext.tsx    # Dark/light theme management
│   │   └── DataContext.tsx     # Application data management
│   ├── pages/                  # Page components
│   │   ├── Dashboard.tsx       # Main dashboard with analytics
│   │   ├── Invoices.tsx        # Invoice management page
│   │   ├── Clients.tsx         # Client management page
│   │   ├── TimeTracking.tsx    # Time tracking interface
│   │   ├── Settings.tsx        # Application settings
│   │   └── Login.tsx           # Authentication page
│   ├── types/                  # TypeScript type definitions
│   │   └── index.ts           # Main type definitions
│   ├── utils/                  # Utility functions
│   │   └── formatters.ts      # Data formatting utilities
│   └── lib/                    # External library configurations
│       └── supabase.ts        # Supabase client configuration
├── server/                     # Backend source code
│   ├── routes/                 # API route handlers
│   │   ├── auth.js            # Authentication routes
│   │   ├── clients.js         # Client management routes
│   │   ├── invoices.js        # Invoice management routes
│   │   └── time.js            # Time tracking routes
│   └── index.js               # Express server configuration
├── supabase/                   # Database configuration
│   └── migrations/            # Database migration files
│       └── create_tables.sql  # Initial database schema
└── README.md                  # Project documentation
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd invoice-management-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new Supabase project
   - Copy the project URL and anon key
   - Run the migration file in the Supabase SQL editor

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Start the development servers**
   
   Frontend:
   ```bash
   npm run dev
   ```
   
   Backend (in a separate terminal):
   ```bash
   npm run server
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Database Schema

### Tables

#### `clients`
- Client information and contact details
- Hourly billing rates
- Tags and notes for organization

#### `invoices`
- Invoice data with line items (stored as JSONB)
- Status tracking (draft, sent, paid, overdue, cancelled)
- Tax calculations and totals

#### `time_entries`
- Time tracking with start/end times
- Project categorization
- Billable hours tracking
- Integration with client billing rates

### Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Secure authentication with Supabase Auth

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create new client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create new invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Time Tracking
- `GET /api/time` - Get all time entries
- `POST /api/time` - Create new time entry
- `PUT /api/time/:id` - Update time entry
- `DELETE /api/time/:id` - Delete time entry

## Features in Detail

### Dashboard Analytics
- Revenue tracking with trend visualization
- Invoice status distribution
- Recent activity feed
- Overdue invoice alerts

### Invoice Management
- Professional invoice templates
- Line item management with automatic calculations
- Tax handling with configurable rates
- Status tracking (draft → sent → paid)
- PDF generation and download

### Client Management
- Comprehensive client profiles
- Contact information management
- Hourly rate configuration
- Tag-based organization
- Notes and relationship tracking

### Time Tracking
- Built-in timer with start/pause/stop functionality
- Project categorization
- Automatic billing calculations
- Integration with client rates
- Billable vs non-billable time tracking

### Settings & Customization
- Company information management
- Invoice template customization
- Default tax rates and currency
- Notification preferences
- Dark/light theme toggle

## Security Features

- **Authentication**: Secure user authentication with Supabase Auth
- **Authorization**: Row Level Security ensures data isolation
- **Password Security**: Bcrypt hashing for password storage
- **API Security**: Helmet.js for security headers
- **Input Validation**: Comprehensive input validation and sanitization
- **CORS**: Properly configured cross-origin resource sharing

## Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexing
- **Code Splitting**: React lazy loading for better performance
- **Caching**: Efficient data caching with React Query patterns
- **Responsive Images**: Optimized image loading and display
- **Bundle Optimization**: Vite for fast builds and hot reloading

## Deployment

### Frontend (Netlify/Vercel)
1. Build the project: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Configure environment variables in your hosting dashboard

### Backend (Railway/Heroku)
1. Set up your hosting provider
2. Configure environment variables
3. Deploy the server code
4. Ensure database connectivity

### Database (Supabase)
- Database is automatically managed by Supabase
- Configure RLS policies as needed
- Monitor usage and performance

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation for common solutions
- Review the code comments for implementation details

## Roadmap

### Upcoming Features
- [ ] PDF invoice generation
- [ ] Email invoice sending
- [ ] Payment integration (Stripe)
- [ ] Multi-currency support
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native)
- [ ] API rate limiting
- [ ] Advanced user roles and permissions
- [ ] Invoice templates customization
- [ ] Automated invoice reminders

### Performance Improvements
- [ ] Database query optimization
- [ ] Frontend bundle size reduction
- [ ] Image optimization
- [ ] Caching strategies
- [ ] Progressive Web App (PWA) features