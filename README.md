# Poalim Flex - Frontend

## Project Overview
Poalim Flex is a flexible mortgage repayment system that provides an intuitive interface for managing mortgage payments, offering dynamic repayment options and financial insights.

## Purpose
The frontend application delivers a comprehensive user experience for:
- User Authentication
- Mortgage Management
- Flexible Payment Reduction
- Financial Health Tracking
- Personalized Notifications

## Tech Stack
- **Frontend Framework**: React
- **UI Library**: Material-UI
- **State Management**: Context API
- **Routing**: React Router
- **Charting**: Recharts

## Key Features
- Interactive Dashboard
- Flex Payment Calculator
- Financial Stress Detection Visualization
- Personalized Notifications
- Responsive Design with RTL Support

## System Components
- User Authentication
- Mortgage Overview
- Flex Reduction Calculator
- Notification Center
- Profile Management

## Prerequisites
- Node.js (v14 or later)
- npm or Yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/nirshar1977/poalim-flex-frontend.git
```

2. Navigate to the project directory:
```bash
cd poalim-flex-frontend
```

3. Install dependencies:
```bash
npm install
```

4. Set up environment variables:
Create a `.env` file with the following variables:
- `REACT_APP_API_URL`: Backend API endpoint
- `REACT_APP_ENVIRONMENT`: Development or production

## Running the Application

### Development Mode
```bash
npm start
```
Runs the app on [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
```
Builds the app for production in the `build` folder

## Project Structure
```
poalim-flex-frontend/
│
├── public/
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   ├── Footer.js
│   │   ├── MortgageCard.js
│   │   └── ...
│   ├── pages/
│   │   ├── Dashboard.js
│   │   ├── Login.js
│   │   ├── MortgageDetails.js
│   │   └── ...
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── NotificationContext.js
│   ├── utils/
│   │   └── api.js
│   ├── App.js
│   └── index.js
└── package.json
```

## Key Components
- `AuthContext`: Manages authentication state
- `NotificationContext`: Handles notification management
- `api.js`: Axios configuration for backend communication
- Routing with protected routes
- Responsive design with Material-UI

## Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Internationalization
- Built with RTL support for Hebrew
- Easily adaptable to other languages

## Limitations and Future Improvements
- Enhance accessibility features
- Add more comprehensive financial predictions
- Improve mobile responsiveness

## License
[Specify your license]

## Contact
Your Name - your.email@example.com

Project Link: [https://github.com/nirshar1977/poalim-flex-frontend](https://github.com/nirshar1977/poalim-flex-frontend)
