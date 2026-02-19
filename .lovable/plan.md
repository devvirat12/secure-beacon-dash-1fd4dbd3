

# Fraud Buster – Real-Time Behavioral Fraud Detection Dashboard

A polished fintech-style dashboard for real-time transaction fraud detection, designed to impress hackathon judges with clean visuals, behavioral intelligence, and explainable AI alerts.

## Design System
- **Style**: Clean, minimal fintech aesthetic with neutral light background
- **Cards**: Rounded 2xl with soft shadows
- **Typography**: Professional, clear hierarchy
- **Colors**: Risk-coded — Green (safe), Yellow (warning), Red (high risk)
- **Icons**: Minimalistic via Lucide React

---

## Page 1: Main Dashboard (`/`)

### Header
- App name "Fraud Buster" with subtitle "Behavioral Intelligence for Transaction Safety"
- Demo Mode toggle switch in the top-right corner

### User Overview Cards (top row)
- 5 metric cards: Monthly Income, Avg Transaction Amount, Avg Monthly Spend, Weekly Transaction Frequency, Usual Locations
- Data sourced from `GET /user/:userId` (or demo data when Demo Mode is on)

### Behavioral DNA Panel
- Insight card showing: Typical Spending Range, Most Frequent Location, Normal Spending Hours, Income vs Spend Ratio
- Risk Trend line chart (using Recharts) showing risk score over time

### Recent Transactions Table
- Columns: Date, Amount, Location, Risk Score, Risk Level (color-coded badges), Status
- Filter tabs: All / Safe / Warning / High Risk
- Data from `GET /transactions/:userId`

---

## Page 2: Simulate Transaction (`/simulate`)

### Transaction Analysis Form
- Inputs: Amount, Location (country dropdown), Date & Time (auto-filled), Category (optional dropdown)
- "Analyze Transaction" button calls `POST /analyze-transaction`

### Risk Result Display (shown after submission)
- Animated circular risk score gauge (0–100) with color transitions (green → yellow → red)
- Risk Level badge
- Score breakdown: Rule Score, ML Score, Behavioral Score (progress bars)
- "Why was this flagged?" section with bullet-point reasons from the API response

### Human Confirmation Modal
- Triggered when API returns `action: "CONFIRMATION_REQUIRED"`
- Shows risk score and reasons list
- Two buttons: "Yes, this was me" (green) and "Report Fraud" (red)
- Calls `POST /confirm-transaction` and updates transaction status

---

## Demo Mode
- Toggle switch enables presentation mode with pre-loaded mock data
- Simulates 5 transactions: 3 Safe, 1 Warning, 1 High Risk (foreign location + high amount)
- All features work without a live backend

---

## Technical Approach
- All API calls use `API_BASE_URL` environment variable
- Modular component architecture for easy backend integration
- Responsive layout for all screen sizes
- Smooth animations on risk gauge, modals, and transitions
- React Router for navigation between Dashboard and Simulate pages

