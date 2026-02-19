import { DatasetUser, HistoricalTransaction, UpiIdInfo } from "./types";
import { SimTransactionType } from "@/components/SimulationControls";

// UPI ID registry with creation dates
export const upiIdRegistry: Record<string, UpiIdInfo> = {
  "priya.sharma@okaxis": { upiId: "priya.sharma@okaxis", creationDate: "2024-06-15", ageDays: 615 },
  "rahul.mehta@ybl": { upiId: "rahul.mehta@ybl", creationDate: "2025-01-10", ageDays: 405 },
  "anita.das@paytm": { upiId: "anita.das@paytm", creationDate: "2025-08-20", ageDays: 183 },
  "vikram.singh@oksbi": { upiId: "vikram.singh@oksbi", creationDate: "2024-11-01", ageDays: 476 },
  "deepa.nair@ibl": { upiId: "deepa.nair@ibl", creationDate: "2025-05-12", ageDays: 283 },
  "bigbasket@razorpay": { upiId: "bigbasket@razorpay", creationDate: "2022-03-01", ageDays: 1451 },
  "swiggy@paytm": { upiId: "swiggy@paytm", creationDate: "2021-06-01", ageDays: 1724 },
  "flipkart@axl": { upiId: "flipkart@axl", creationDate: "2020-01-15", ageDays: 2227 },
  "irctc@sbi": { upiId: "irctc@sbi", creationDate: "2019-09-01", ageDays: 2363 },
  "apollo247@hdfcbank": { upiId: "apollo247@hdfcbank", creationDate: "2023-01-10", ageDays: 1136 },
  "electricity.tneb@paytm": { upiId: "electricity.tneb@paytm", creationDate: "2022-08-15", ageDays: 1284 },
  "zomato@ybl": { upiId: "zomato@ybl", creationDate: "2021-11-01", ageDays: 1572 },
  "amazon@apl": { upiId: "amazon@apl", creationDate: "2020-05-01", ageDays: 2120 },
  "uber@icici": { upiId: "uber@icici", creationDate: "2021-03-15", ageDays: 1802 },
  "ola@paytm": { upiId: "ola@paytm", creationDate: "2021-07-20", ageDays: 1675 },
  "myntra@ybl": { upiId: "myntra@ybl", creationDate: "2022-01-10", ageDays: 1501 },
  "bookmyshow@hdfcbank": { upiId: "bookmyshow@hdfcbank", creationDate: "2022-04-05", ageDays: 1416 },
  "phonepe.merchant@ybl": { upiId: "phonepe.merchant@ybl", creationDate: "2020-09-10", ageDays: 1988 },
  "jiomart@sbi": { upiId: "jiomart@sbi", creationDate: "2023-06-15", ageDays: 980 },
  "tataneu@icici": { upiId: "tataneu@icici", creationDate: "2023-09-01", ageDays: 902 },
  "quickcash9871@ybl": { upiId: "quickcash9871@ybl", creationDate: "2026-02-14", ageDays: 5 },
  "earnmoney.now@okaxis": { upiId: "earnmoney.now@okaxis", creationDate: "2026-02-16", ageDays: 3 },
  "lucky.winner2026@paytm": { upiId: "lucky.winner2026@paytm", creationDate: "2026-02-12", ageDays: 7 },
  "invest.returns@ybl": { upiId: "invest.returns@ybl", creationDate: "2026-01-25", ageDays: 25 },
  "refund.process@oksbi": { upiId: "refund.process@oksbi", creationDate: "2026-02-10", ageDays: 9 },
  "cashback.offer@paytm": { upiId: "cashback.offer@paytm", creationDate: "2026-02-17", ageDays: 2 },
  "freelance.pay@ybl": { upiId: "freelance.pay@ybl", creationDate: "2026-01-05", ageDays: 45 },
  "prize.claim@okaxis": { upiId: "prize.claim@okaxis", creationDate: "2026-02-15", ageDays: 4 },
};

function generateHistory(userId: string, base: { amount: number; cities: string[]; upiIds: string[] }, count: number): HistoricalTransaction[] {
  const categories = ["Food & Dining", "Shopping", "Groceries", "Travel", "Entertainment", "Bills & Utilities", "Healthcare", "Other"];
  const txns: HistoricalTransaction[] = [];
  for (let i = 0; i < count; i++) {
    const variance = 0.3 + Math.random() * 1.4;
    const d = new Date("2026-02-19T00:00:00Z");
    d.setDate(d.getDate() - Math.floor(Math.random() * 60));
    d.setHours(Math.floor(Math.random() * 18) + 6, Math.floor(Math.random() * 60));
    txns.push({
      transactionId: `hist-${userId}-${String(i).padStart(3, "0")}`,
      userId,
      amount: Math.round(base.amount * variance),
      timestamp: d.toISOString(),
      city: base.cities[Math.floor(Math.random() * base.cities.length)],
      upiId: base.upiIds[Math.floor(Math.random() * base.upiIds.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
    });
  }
  return txns.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export const userDataset: DatasetUser[] = [
  // --- Salaried Users (15) ---
  {
    userId: "IND-001", name: "Priya Sharma", monthlySalary: 75000, avgTransactionAmount: 1200, avgMonthlySpend: 45000, avgWeeklyFrequency: 14,
    usualCities: ["Chennai", "Bangalore", "Coimbatore"], usualUpiIds: ["bigbasket@razorpay", "swiggy@paytm", "flipkart@axl", "electricity.tneb@paytm"],
    transactionHistory: generateHistory("IND-001", { amount: 1200, cities: ["Chennai", "Bangalore", "Coimbatore"], upiIds: ["bigbasket@razorpay", "swiggy@paytm", "flipkart@axl", "electricity.tneb@paytm"] }, 25),
    accountAgeDays: 1450, deviceFingerprints: ["dev-001a", "dev-001b"], historicalFraudCount: 0, profileType: "salaried",
  },
  {
    userId: "IND-002", name: "Rahul Mehta", monthlySalary: 120000, avgTransactionAmount: 2500, avgMonthlySpend: 72000, avgWeeklyFrequency: 10,
    usualCities: ["Mumbai", "Pune", "Nashik"], usualUpiIds: ["swiggy@paytm", "flipkart@axl", "zomato@ybl", "apollo247@hdfcbank"],
    transactionHistory: generateHistory("IND-002", { amount: 2500, cities: ["Mumbai", "Pune", "Nashik"], upiIds: ["swiggy@paytm", "flipkart@axl", "zomato@ybl", "apollo247@hdfcbank"] }, 20),
    accountAgeDays: 1200, deviceFingerprints: ["dev-002a"], historicalFraudCount: 0, profileType: "salaried",
  },
  {
    userId: "IND-003", name: "Anita Das", monthlySalary: 35000, avgTransactionAmount: 550, avgMonthlySpend: 22000, avgWeeklyFrequency: 16,
    usualCities: ["Kolkata", "Howrah", "Siliguri"], usualUpiIds: ["bigbasket@razorpay", "swiggy@paytm", "electricity.tneb@paytm"],
    transactionHistory: generateHistory("IND-003", { amount: 550, cities: ["Kolkata", "Howrah", "Siliguri"], upiIds: ["bigbasket@razorpay", "swiggy@paytm", "electricity.tneb@paytm"] }, 30),
    accountAgeDays: 980, deviceFingerprints: ["dev-003a", "dev-003b"], historicalFraudCount: 1, profileType: "salaried",
  },
  {
    userId: "IND-004", name: "Vikram Singh", monthlySalary: 150000, avgTransactionAmount: 4500, avgMonthlySpend: 95000, avgWeeklyFrequency: 8,
    usualCities: ["Delhi", "Gurgaon", "Noida"], usualUpiIds: ["flipkart@axl", "swiggy@paytm", "irctc@sbi", "zomato@ybl"],
    transactionHistory: generateHistory("IND-004", { amount: 4500, cities: ["Delhi", "Gurgaon", "Noida"], upiIds: ["flipkart@axl", "swiggy@paytm", "irctc@sbi", "zomato@ybl"] }, 18),
    accountAgeDays: 2100, deviceFingerprints: ["dev-004a"], historicalFraudCount: 0, profileType: "salaried",
  },
  {
    userId: "IND-005", name: "Deepa Nair", monthlySalary: 55000, avgTransactionAmount: 800, avgMonthlySpend: 35000, avgWeeklyFrequency: 12,
    usualCities: ["Kochi", "Trivandrum", "Calicut"], usualUpiIds: ["bigbasket@razorpay", "swiggy@paytm", "electricity.tneb@paytm", "apollo247@hdfcbank"],
    transactionHistory: generateHistory("IND-005", { amount: 800, cities: ["Kochi", "Trivandrum", "Calicut"], upiIds: ["bigbasket@razorpay", "swiggy@paytm", "electricity.tneb@paytm", "apollo247@hdfcbank"] }, 22),
    accountAgeDays: 730, deviceFingerprints: ["dev-005a", "dev-005b"], historicalFraudCount: 0, profileType: "salaried",
  },
  {
    userId: "IND-006", name: "Arjun Reddy", monthlySalary: 90000, avgTransactionAmount: 1800, avgMonthlySpend: 58000, avgWeeklyFrequency: 11,
    usualCities: ["Hyderabad", "Secunderabad", "Warangal"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl", "uber@icici"],
    transactionHistory: generateHistory("IND-006", { amount: 1800, cities: ["Hyderabad", "Secunderabad", "Warangal"], upiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl", "uber@icici"] }, 22),
    accountAgeDays: 1650, deviceFingerprints: ["dev-006a"], historicalFraudCount: 0, profileType: "salaried",
  },
  {
    userId: "IND-007", name: "Meera Joshi", monthlySalary: 65000, avgTransactionAmount: 1100, avgMonthlySpend: 42000, avgWeeklyFrequency: 13,
    usualCities: ["Pune", "Mumbai", "Nagpur"], usualUpiIds: ["flipkart@axl", "myntra@ybl", "bigbasket@razorpay", "ola@paytm"],
    transactionHistory: generateHistory("IND-007", { amount: 1100, cities: ["Pune", "Mumbai", "Nagpur"], upiIds: ["flipkart@axl", "myntra@ybl", "bigbasket@razorpay", "ola@paytm"] }, 26),
    accountAgeDays: 1100, deviceFingerprints: ["dev-007a", "dev-007b"], historicalFraudCount: 0, profileType: "salaried",
  },
  {
    userId: "IND-008", name: "Suresh Kumar", monthlySalary: 45000, avgTransactionAmount: 750, avgMonthlySpend: 30000, avgWeeklyFrequency: 15,
    usualCities: ["Jaipur", "Ajmer", "Udaipur"], usualUpiIds: ["swiggy@paytm", "bigbasket@razorpay", "jiomart@sbi"],
    transactionHistory: generateHistory("IND-008", { amount: 750, cities: ["Jaipur", "Ajmer", "Udaipur"], upiIds: ["swiggy@paytm", "bigbasket@razorpay", "jiomart@sbi"] }, 28),
    accountAgeDays: 850, deviceFingerprints: ["dev-008a"], historicalFraudCount: 0, profileType: "salaried",
  },
  {
    userId: "IND-009", name: "Kavitha Raman", monthlySalary: 85000, avgTransactionAmount: 1500, avgMonthlySpend: 52000, avgWeeklyFrequency: 10,
    usualCities: ["Chennai", "Madurai", "Pondicherry"], usualUpiIds: ["swiggy@paytm", "flipkart@axl", "electricity.tneb@paytm", "tataneu@icici"],
    transactionHistory: generateHistory("IND-009", { amount: 1500, cities: ["Chennai", "Madurai", "Pondicherry"], upiIds: ["swiggy@paytm", "flipkart@axl", "electricity.tneb@paytm", "tataneu@icici"] }, 20),
    accountAgeDays: 1800, deviceFingerprints: ["dev-009a", "dev-009b"], historicalFraudCount: 0, profileType: "salaried",
  },
  {
    userId: "IND-010", name: "Amit Patel", monthlySalary: 100000, avgTransactionAmount: 2200, avgMonthlySpend: 65000, avgWeeklyFrequency: 9,
    usualCities: ["Ahmedabad", "Surat", "Vadodara"], usualUpiIds: ["flipkart@axl", "amazon@apl", "swiggy@paytm", "bookmyshow@hdfcbank"],
    transactionHistory: generateHistory("IND-010", { amount: 2200, cities: ["Ahmedabad", "Surat", "Vadodara"], upiIds: ["flipkart@axl", "amazon@apl", "swiggy@paytm", "bookmyshow@hdfcbank"] }, 18),
    accountAgeDays: 1350, deviceFingerprints: ["dev-010a"], historicalFraudCount: 0, profileType: "salaried",
  },
  {
    userId: "IND-011", name: "Neha Gupta", monthlySalary: 70000, avgTransactionAmount: 1300, avgMonthlySpend: 46000, avgWeeklyFrequency: 12,
    usualCities: ["Lucknow", "Kanpur", "Varanasi"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "bigbasket@razorpay"],
    transactionHistory: generateHistory("IND-011", { amount: 1300, cities: ["Lucknow", "Kanpur", "Varanasi"], upiIds: ["swiggy@paytm", "zomato@ybl", "bigbasket@razorpay"] }, 24),
    accountAgeDays: 900, deviceFingerprints: ["dev-011a"], historicalFraudCount: 0, profileType: "salaried",
  },
  {
    userId: "IND-012", name: "Sanjay Verma", monthlySalary: 58000, avgTransactionAmount: 950, avgMonthlySpend: 38000, avgWeeklyFrequency: 14,
    usualCities: ["Bhopal", "Indore", "Gwalior"], usualUpiIds: ["swiggy@paytm", "flipkart@axl", "electricity.tneb@paytm", "jiomart@sbi"],
    transactionHistory: generateHistory("IND-012", { amount: 950, cities: ["Bhopal", "Indore", "Gwalior"], upiIds: ["swiggy@paytm", "flipkart@axl", "electricity.tneb@paytm", "jiomart@sbi"] }, 28),
    accountAgeDays: 1050, deviceFingerprints: ["dev-012a", "dev-012b"], historicalFraudCount: 0, profileType: "salaried",
  },
  {
    userId: "IND-013", name: "Pooja Iyer", monthlySalary: 110000, avgTransactionAmount: 2000, avgMonthlySpend: 68000, avgWeeklyFrequency: 9,
    usualCities: ["Bangalore", "Mysore", "Mangalore"], usualUpiIds: ["amazon@apl", "flipkart@axl", "uber@icici", "apollo247@hdfcbank"],
    transactionHistory: generateHistory("IND-013", { amount: 2000, cities: ["Bangalore", "Mysore", "Mangalore"], upiIds: ["amazon@apl", "flipkart@axl", "uber@icici", "apollo247@hdfcbank"] }, 18),
    accountAgeDays: 1500, deviceFingerprints: ["dev-013a"], historicalFraudCount: 0, profileType: "salaried",
  },
  {
    userId: "IND-014", name: "Rajesh Khanna", monthlySalary: 52000, avgTransactionAmount: 850, avgMonthlySpend: 34000, avgWeeklyFrequency: 15,
    usualCities: ["Patna", "Ranchi", "Dhanbad"], usualUpiIds: ["swiggy@paytm", "bigbasket@razorpay", "zomato@ybl"],
    transactionHistory: generateHistory("IND-014", { amount: 850, cities: ["Patna", "Ranchi", "Dhanbad"], upiIds: ["swiggy@paytm", "bigbasket@razorpay", "zomato@ybl"] }, 30),
    accountAgeDays: 700, deviceFingerprints: ["dev-014a"], historicalFraudCount: 1, profileType: "salaried",
  },
  {
    userId: "IND-015", name: "Divya Menon", monthlySalary: 95000, avgTransactionAmount: 1700, avgMonthlySpend: 60000, avgWeeklyFrequency: 11,
    usualCities: ["Kochi", "Bangalore", "Chennai"], usualUpiIds: ["flipkart@axl", "myntra@ybl", "swiggy@paytm", "tataneu@icici"],
    transactionHistory: generateHistory("IND-015", { amount: 1700, cities: ["Kochi", "Bangalore", "Chennai"], upiIds: ["flipkart@axl", "myntra@ybl", "swiggy@paytm", "tataneu@icici"] }, 22),
    accountAgeDays: 1250, deviceFingerprints: ["dev-015a", "dev-015b"], historicalFraudCount: 0, profileType: "salaried",
  },
  // --- Business Owners (10) ---
  {
    userId: "BIZ-001", name: "Ravi Agarwal", monthlySalary: 300000, avgTransactionAmount: 15000, avgMonthlySpend: 220000, avgWeeklyFrequency: 20,
    usualCities: ["Delhi", "Mumbai", "Kolkata", "Chennai"], usualUpiIds: ["flipkart@axl", "amazon@apl", "phonepe.merchant@ybl", "irctc@sbi"],
    transactionHistory: generateHistory("BIZ-001", { amount: 15000, cities: ["Delhi", "Mumbai", "Kolkata", "Chennai"], upiIds: ["flipkart@axl", "amazon@apl", "phonepe.merchant@ybl", "irctc@sbi"] }, 35),
    accountAgeDays: 2500, deviceFingerprints: ["dev-b01a", "dev-b01b", "dev-b01c"], historicalFraudCount: 0, profileType: "business",
  },
  {
    userId: "BIZ-002", name: "Sunita Bansal", monthlySalary: 200000, avgTransactionAmount: 8000, avgMonthlySpend: 150000, avgWeeklyFrequency: 18,
    usualCities: ["Mumbai", "Pune", "Ahmedabad"], usualUpiIds: ["amazon@apl", "flipkart@axl", "swiggy@paytm", "jiomart@sbi"],
    transactionHistory: generateHistory("BIZ-002", { amount: 8000, cities: ["Mumbai", "Pune", "Ahmedabad"], upiIds: ["amazon@apl", "flipkart@axl", "swiggy@paytm", "jiomart@sbi"] }, 30),
    accountAgeDays: 1800, deviceFingerprints: ["dev-b02a", "dev-b02b"], historicalFraudCount: 0, profileType: "business",
  },
  {
    userId: "BIZ-003", name: "Mohammed Iqbal", monthlySalary: 180000, avgTransactionAmount: 6500, avgMonthlySpend: 130000, avgWeeklyFrequency: 16,
    usualCities: ["Hyderabad", "Bangalore", "Chennai"], usualUpiIds: ["phonepe.merchant@ybl", "amazon@apl", "uber@icici"],
    transactionHistory: generateHistory("BIZ-003", { amount: 6500, cities: ["Hyderabad", "Bangalore", "Chennai"], upiIds: ["phonepe.merchant@ybl", "amazon@apl", "uber@icici"] }, 28),
    accountAgeDays: 2000, deviceFingerprints: ["dev-b03a"], historicalFraudCount: 0, profileType: "business",
  },
  {
    userId: "BIZ-004", name: "Lakshmi Narayan", monthlySalary: 250000, avgTransactionAmount: 12000, avgMonthlySpend: 180000, avgWeeklyFrequency: 22,
    usualCities: ["Chennai", "Coimbatore", "Madurai", "Bangalore"], usualUpiIds: ["flipkart@axl", "amazon@apl", "phonepe.merchant@ybl", "tataneu@icici"],
    transactionHistory: generateHistory("BIZ-004", { amount: 12000, cities: ["Chennai", "Coimbatore", "Madurai", "Bangalore"], upiIds: ["flipkart@axl", "amazon@apl", "phonepe.merchant@ybl", "tataneu@icici"] }, 40),
    accountAgeDays: 2200, deviceFingerprints: ["dev-b04a", "dev-b04b"], historicalFraudCount: 0, profileType: "business",
  },
  {
    userId: "BIZ-005", name: "Ajay Devgan", monthlySalary: 500000, avgTransactionAmount: 25000, avgMonthlySpend: 380000, avgWeeklyFrequency: 25,
    usualCities: ["Mumbai", "Delhi", "Goa", "Bangalore"], usualUpiIds: ["amazon@apl", "flipkart@axl", "bookmyshow@hdfcbank", "uber@icici", "irctc@sbi"],
    transactionHistory: generateHistory("BIZ-005", { amount: 25000, cities: ["Mumbai", "Delhi", "Goa", "Bangalore"], upiIds: ["amazon@apl", "flipkart@axl", "bookmyshow@hdfcbank", "uber@icici"] }, 45),
    accountAgeDays: 3000, deviceFingerprints: ["dev-b05a", "dev-b05b", "dev-b05c"], historicalFraudCount: 0, profileType: "business",
  },
  {
    userId: "BIZ-006", name: "Geeta Krishnan", monthlySalary: 160000, avgTransactionAmount: 5500, avgMonthlySpend: 110000, avgWeeklyFrequency: 15,
    usualCities: ["Trivandrum", "Kochi", "Bangalore"], usualUpiIds: ["flipkart@axl", "amazon@apl", "swiggy@paytm"],
    transactionHistory: generateHistory("BIZ-006", { amount: 5500, cities: ["Trivandrum", "Kochi", "Bangalore"], upiIds: ["flipkart@axl", "amazon@apl", "swiggy@paytm"] }, 25),
    accountAgeDays: 1600, deviceFingerprints: ["dev-b06a"], historicalFraudCount: 0, profileType: "business",
  },
  {
    userId: "BIZ-007", name: "Harpreet Kaur", monthlySalary: 220000, avgTransactionAmount: 9500, avgMonthlySpend: 165000, avgWeeklyFrequency: 19,
    usualCities: ["Chandigarh", "Delhi", "Amritsar", "Ludhiana"], usualUpiIds: ["amazon@apl", "flipkart@axl", "jiomart@sbi", "phonepe.merchant@ybl"],
    transactionHistory: generateHistory("BIZ-007", { amount: 9500, cities: ["Chandigarh", "Delhi", "Amritsar", "Ludhiana"], upiIds: ["amazon@apl", "flipkart@axl", "jiomart@sbi", "phonepe.merchant@ybl"] }, 32),
    accountAgeDays: 1900, deviceFingerprints: ["dev-b07a", "dev-b07b"], historicalFraudCount: 0, profileType: "business",
  },
  {
    userId: "BIZ-008", name: "Prakash Raj", monthlySalary: 280000, avgTransactionAmount: 11000, avgMonthlySpend: 200000, avgWeeklyFrequency: 21,
    usualCities: ["Bangalore", "Chennai", "Hyderabad"], usualUpiIds: ["phonepe.merchant@ybl", "amazon@apl", "uber@icici", "flipkart@axl"],
    transactionHistory: generateHistory("BIZ-008", { amount: 11000, cities: ["Bangalore", "Chennai", "Hyderabad"], upiIds: ["phonepe.merchant@ybl", "amazon@apl", "uber@icici", "flipkart@axl"] }, 38),
    accountAgeDays: 2400, deviceFingerprints: ["dev-b08a"], historicalFraudCount: 0, profileType: "business",
  },
  {
    userId: "BIZ-009", name: "Fatima Shaikh", monthlySalary: 140000, avgTransactionAmount: 4800, avgMonthlySpend: 95000, avgWeeklyFrequency: 14,
    usualCities: ["Mumbai", "Pune", "Goa"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl", "myntra@ybl"],
    transactionHistory: generateHistory("BIZ-009", { amount: 4800, cities: ["Mumbai", "Pune", "Goa"], upiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl", "myntra@ybl"] }, 24),
    accountAgeDays: 1400, deviceFingerprints: ["dev-b09a", "dev-b09b"], historicalFraudCount: 0, profileType: "business",
  },
  {
    userId: "BIZ-010", name: "Karthik Subramanian", monthlySalary: 350000, avgTransactionAmount: 18000, avgMonthlySpend: 260000, avgWeeklyFrequency: 23,
    usualCities: ["Chennai", "Bangalore", "Mumbai", "Delhi"], usualUpiIds: ["flipkart@axl", "amazon@apl", "phonepe.merchant@ybl", "irctc@sbi", "tataneu@icici"],
    transactionHistory: generateHistory("BIZ-010", { amount: 18000, cities: ["Chennai", "Bangalore", "Mumbai", "Delhi"], upiIds: ["flipkart@axl", "amazon@apl", "phonepe.merchant@ybl", "irctc@sbi"] }, 42),
    accountAgeDays: 2800, deviceFingerprints: ["dev-b10a", "dev-b10b", "dev-b10c"], historicalFraudCount: 0, profileType: "business",
  },
  // --- Students (10) ---
  {
    userId: "STU-001", name: "Aarav Mishra", monthlySalary: 8000, avgTransactionAmount: 200, avgMonthlySpend: 6000, avgWeeklyFrequency: 18,
    usualCities: ["Delhi", "Noida"], usualUpiIds: ["swiggy@paytm", "zomato@ybl"],
    transactionHistory: generateHistory("STU-001", { amount: 200, cities: ["Delhi", "Noida"], upiIds: ["swiggy@paytm", "zomato@ybl"] }, 35),
    accountAgeDays: 180, deviceFingerprints: ["dev-s01a"], historicalFraudCount: 0, profileType: "student",
  },
  {
    userId: "STU-002", name: "Ishita Kapoor", monthlySalary: 10000, avgTransactionAmount: 280, avgMonthlySpend: 8000, avgWeeklyFrequency: 20,
    usualCities: ["Mumbai", "Pune"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl"],
    transactionHistory: generateHistory("STU-002", { amount: 280, cities: ["Mumbai", "Pune"], upiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl"] }, 40),
    accountAgeDays: 220, deviceFingerprints: ["dev-s02a"], historicalFraudCount: 0, profileType: "student",
  },
  {
    userId: "STU-003", name: "Rohan Bhat", monthlySalary: 6000, avgTransactionAmount: 150, avgMonthlySpend: 4500, avgWeeklyFrequency: 22,
    usualCities: ["Bangalore", "Mysore"], usualUpiIds: ["swiggy@paytm", "zomato@ybl"],
    transactionHistory: generateHistory("STU-003", { amount: 150, cities: ["Bangalore", "Mysore"], upiIds: ["swiggy@paytm", "zomato@ybl"] }, 45),
    accountAgeDays: 90, deviceFingerprints: ["dev-s03a"], historicalFraudCount: 0, profileType: "student",
  },
  {
    userId: "STU-004", name: "Tanvi Deshpande", monthlySalary: 12000, avgTransactionAmount: 350, avgMonthlySpend: 9500, avgWeeklyFrequency: 16,
    usualCities: ["Pune", "Mumbai"], usualUpiIds: ["swiggy@paytm", "myntra@ybl", "amazon@apl"],
    transactionHistory: generateHistory("STU-004", { amount: 350, cities: ["Pune", "Mumbai"], upiIds: ["swiggy@paytm", "myntra@ybl", "amazon@apl"] }, 30),
    accountAgeDays: 300, deviceFingerprints: ["dev-s04a"], historicalFraudCount: 0, profileType: "student",
  },
  {
    userId: "STU-005", name: "Varun Nambiar", monthlySalary: 7000, avgTransactionAmount: 180, avgMonthlySpend: 5200, avgWeeklyFrequency: 19,
    usualCities: ["Kochi", "Trivandrum"], usualUpiIds: ["swiggy@paytm", "zomato@ybl"],
    transactionHistory: generateHistory("STU-005", { amount: 180, cities: ["Kochi", "Trivandrum"], upiIds: ["swiggy@paytm", "zomato@ybl"] }, 38),
    accountAgeDays: 150, deviceFingerprints: ["dev-s05a"], historicalFraudCount: 0, profileType: "student",
  },
  {
    userId: "STU-006", name: "Sneha Pandey", monthlySalary: 9000, avgTransactionAmount: 220, avgMonthlySpend: 7000, avgWeeklyFrequency: 17,
    usualCities: ["Lucknow", "Kanpur"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl"],
    transactionHistory: generateHistory("STU-006", { amount: 220, cities: ["Lucknow", "Kanpur"], upiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl"] }, 34),
    accountAgeDays: 200, deviceFingerprints: ["dev-s06a"], historicalFraudCount: 0, profileType: "student",
  },
  {
    userId: "STU-007", name: "Aditya Saxena", monthlySalary: 11000, avgTransactionAmount: 300, avgMonthlySpend: 8500, avgWeeklyFrequency: 21,
    usualCities: ["Delhi", "Gurgaon"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "uber@icici"],
    transactionHistory: generateHistory("STU-007", { amount: 300, cities: ["Delhi", "Gurgaon"], upiIds: ["swiggy@paytm", "zomato@ybl", "uber@icici"] }, 42),
    accountAgeDays: 250, deviceFingerprints: ["dev-s07a"], historicalFraudCount: 0, profileType: "student",
  },
  {
    userId: "STU-008", name: "Ritu Sharma", monthlySalary: 5000, avgTransactionAmount: 120, avgMonthlySpend: 3800, avgWeeklyFrequency: 24,
    usualCities: ["Jaipur", "Ajmer"], usualUpiIds: ["swiggy@paytm", "zomato@ybl"],
    transactionHistory: generateHistory("STU-008", { amount: 120, cities: ["Jaipur", "Ajmer"], upiIds: ["swiggy@paytm", "zomato@ybl"] }, 48),
    accountAgeDays: 60, deviceFingerprints: ["dev-s08a"], historicalFraudCount: 0, profileType: "student",
  },
  {
    userId: "STU-009", name: "Nikhil Rao", monthlySalary: 8500, avgTransactionAmount: 230, avgMonthlySpend: 6500, avgWeeklyFrequency: 18,
    usualCities: ["Hyderabad", "Secunderabad"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "bookmyshow@hdfcbank"],
    transactionHistory: generateHistory("STU-009", { amount: 230, cities: ["Hyderabad", "Secunderabad"], upiIds: ["swiggy@paytm", "zomato@ybl", "bookmyshow@hdfcbank"] }, 36),
    accountAgeDays: 170, deviceFingerprints: ["dev-s09a"], historicalFraudCount: 0, profileType: "student",
  },
  {
    userId: "STU-010", name: "Pallavi Ghosh", monthlySalary: 7500, avgTransactionAmount: 190, avgMonthlySpend: 5800, avgWeeklyFrequency: 20,
    usualCities: ["Kolkata", "Howrah"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "bigbasket@razorpay"],
    transactionHistory: generateHistory("STU-010", { amount: 190, cities: ["Kolkata", "Howrah"], upiIds: ["swiggy@paytm", "zomato@ybl", "bigbasket@razorpay"] }, 40),
    accountAgeDays: 130, deviceFingerprints: ["dev-s10a"], historicalFraudCount: 0, profileType: "student",
  },
  // --- High Spenders (8) ---
  {
    userId: "HIG-001", name: "Arun Ambani", monthlySalary: 800000, avgTransactionAmount: 45000, avgMonthlySpend: 600000, avgWeeklyFrequency: 15,
    usualCities: ["Mumbai", "Delhi", "London", "Dubai"], usualUpiIds: ["amazon@apl", "flipkart@axl", "bookmyshow@hdfcbank", "uber@icici"],
    transactionHistory: generateHistory("HIG-001", { amount: 45000, cities: ["Mumbai", "Delhi"], upiIds: ["amazon@apl", "flipkart@axl", "bookmyshow@hdfcbank", "uber@icici"] }, 30),
    accountAgeDays: 3500, deviceFingerprints: ["dev-h01a", "dev-h01b", "dev-h01c"], historicalFraudCount: 0, profileType: "high_spender",
  },
  {
    userId: "HIG-002", name: "Nita Kapadia", monthlySalary: 600000, avgTransactionAmount: 35000, avgMonthlySpend: 450000, avgWeeklyFrequency: 12,
    usualCities: ["Mumbai", "Bangalore", "Goa"], usualUpiIds: ["amazon@apl", "flipkart@axl", "myntra@ybl", "tataneu@icici"],
    transactionHistory: generateHistory("HIG-002", { amount: 35000, cities: ["Mumbai", "Bangalore", "Goa"], upiIds: ["amazon@apl", "flipkart@axl", "myntra@ybl", "tataneu@icici"] }, 24),
    accountAgeDays: 2800, deviceFingerprints: ["dev-h02a", "dev-h02b"], historicalFraudCount: 0, profileType: "high_spender",
  },
  {
    userId: "HIG-003", name: "Rohit Singhania", monthlySalary: 450000, avgTransactionAmount: 22000, avgMonthlySpend: 320000, avgWeeklyFrequency: 14,
    usualCities: ["Delhi", "Gurgaon", "Chandigarh"], usualUpiIds: ["flipkart@axl", "amazon@apl", "irctc@sbi", "bookmyshow@hdfcbank"],
    transactionHistory: generateHistory("HIG-003", { amount: 22000, cities: ["Delhi", "Gurgaon", "Chandigarh"], upiIds: ["flipkart@axl", "amazon@apl", "irctc@sbi", "bookmyshow@hdfcbank"] }, 28),
    accountAgeDays: 2600, deviceFingerprints: ["dev-h03a"], historicalFraudCount: 0, profileType: "high_spender",
  },
  {
    userId: "HIG-004", name: "Tara Devi", monthlySalary: 550000, avgTransactionAmount: 28000, avgMonthlySpend: 400000, avgWeeklyFrequency: 11,
    usualCities: ["Chennai", "Bangalore", "Mumbai"], usualUpiIds: ["amazon@apl", "myntra@ybl", "tataneu@icici"],
    transactionHistory: generateHistory("HIG-004", { amount: 28000, cities: ["Chennai", "Bangalore", "Mumbai"], upiIds: ["amazon@apl", "myntra@ybl", "tataneu@icici"] }, 22),
    accountAgeDays: 3200, deviceFingerprints: ["dev-h04a", "dev-h04b"], historicalFraudCount: 0, profileType: "high_spender",
  },
  {
    userId: "HIG-005", name: "Vijay Mallya Jr", monthlySalary: 700000, avgTransactionAmount: 40000, avgMonthlySpend: 520000, avgWeeklyFrequency: 16,
    usualCities: ["Bangalore", "Mumbai", "Goa", "Delhi"], usualUpiIds: ["amazon@apl", "flipkart@axl", "uber@icici", "bookmyshow@hdfcbank", "irctc@sbi"],
    transactionHistory: generateHistory("HIG-005", { amount: 40000, cities: ["Bangalore", "Mumbai", "Goa", "Delhi"], upiIds: ["amazon@apl", "flipkart@axl", "uber@icici", "bookmyshow@hdfcbank"] }, 32),
    accountAgeDays: 2900, deviceFingerprints: ["dev-h05a", "dev-h05b"], historicalFraudCount: 0, profileType: "high_spender",
  },
  {
    userId: "HIG-006", name: "Zara Khan", monthlySalary: 400000, avgTransactionAmount: 20000, avgMonthlySpend: 300000, avgWeeklyFrequency: 13,
    usualCities: ["Mumbai", "Delhi", "Hyderabad"], usualUpiIds: ["myntra@ybl", "amazon@apl", "flipkart@axl", "tataneu@icici"],
    transactionHistory: generateHistory("HIG-006", { amount: 20000, cities: ["Mumbai", "Delhi", "Hyderabad"], upiIds: ["myntra@ybl", "amazon@apl", "flipkart@axl", "tataneu@icici"] }, 26),
    accountAgeDays: 2400, deviceFingerprints: ["dev-h06a"], historicalFraudCount: 0, profileType: "high_spender",
  },
  {
    userId: "HIG-007", name: "Manish Tiwari", monthlySalary: 350000, avgTransactionAmount: 18000, avgMonthlySpend: 250000, avgWeeklyFrequency: 10,
    usualCities: ["Delhi", "Noida", "Gurgaon"], usualUpiIds: ["flipkart@axl", "amazon@apl", "irctc@sbi"],
    transactionHistory: generateHistory("HIG-007", { amount: 18000, cities: ["Delhi", "Noida", "Gurgaon"], upiIds: ["flipkart@axl", "amazon@apl", "irctc@sbi"] }, 20),
    accountAgeDays: 2100, deviceFingerprints: ["dev-h07a", "dev-h07b"], historicalFraudCount: 0, profileType: "high_spender",
  },
  {
    userId: "HIG-008", name: "Isha Ambani", monthlySalary: 900000, avgTransactionAmount: 50000, avgMonthlySpend: 700000, avgWeeklyFrequency: 18,
    usualCities: ["Mumbai", "Delhi", "Bangalore", "Goa", "Chennai"], usualUpiIds: ["amazon@apl", "flipkart@axl", "tataneu@icici", "bookmyshow@hdfcbank", "uber@icici"],
    transactionHistory: generateHistory("HIG-008", { amount: 50000, cities: ["Mumbai", "Delhi", "Bangalore", "Goa"], upiIds: ["amazon@apl", "flipkart@axl", "tataneu@icici", "bookmyshow@hdfcbank"] }, 36),
    accountAgeDays: 3800, deviceFingerprints: ["dev-h08a", "dev-h08b", "dev-h08c"], historicalFraudCount: 0, profileType: "high_spender",
  },
  // --- Low Spenders (7) ---
  {
    userId: "LOW-001", name: "Kamala Devi", monthlySalary: 15000, avgTransactionAmount: 150, avgMonthlySpend: 9000, avgWeeklyFrequency: 8,
    usualCities: ["Varanasi", "Lucknow"], usualUpiIds: ["swiggy@paytm", "bigbasket@razorpay"],
    transactionHistory: generateHistory("LOW-001", { amount: 150, cities: ["Varanasi", "Lucknow"], upiIds: ["swiggy@paytm", "bigbasket@razorpay"] }, 16),
    accountAgeDays: 400, deviceFingerprints: ["dev-l01a"], historicalFraudCount: 0, profileType: "low_spender",
  },
  {
    userId: "LOW-002", name: "Ram Prasad", monthlySalary: 18000, avgTransactionAmount: 200, avgMonthlySpend: 11000, avgWeeklyFrequency: 7,
    usualCities: ["Patna", "Ranchi"], usualUpiIds: ["swiggy@paytm", "electricity.tneb@paytm"],
    transactionHistory: generateHistory("LOW-002", { amount: 200, cities: ["Patna", "Ranchi"], upiIds: ["swiggy@paytm", "electricity.tneb@paytm"] }, 14),
    accountAgeDays: 350, deviceFingerprints: ["dev-l02a"], historicalFraudCount: 0, profileType: "low_spender",
  },
  {
    userId: "LOW-003", name: "Lakshmi Bai", monthlySalary: 12000, avgTransactionAmount: 100, avgMonthlySpend: 7500, avgWeeklyFrequency: 10,
    usualCities: ["Bhopal", "Indore"], usualUpiIds: ["bigbasket@razorpay", "electricity.tneb@paytm"],
    transactionHistory: generateHistory("LOW-003", { amount: 100, cities: ["Bhopal", "Indore"], upiIds: ["bigbasket@razorpay", "electricity.tneb@paytm"] }, 20),
    accountAgeDays: 280, deviceFingerprints: ["dev-l03a"], historicalFraudCount: 0, profileType: "low_spender",
  },
  {
    userId: "LOW-004", name: "Shankar Das", monthlySalary: 20000, avgTransactionAmount: 250, avgMonthlySpend: 13000, avgWeeklyFrequency: 9,
    usualCities: ["Kolkata", "Howrah"], usualUpiIds: ["swiggy@paytm", "bigbasket@razorpay", "zomato@ybl"],
    transactionHistory: generateHistory("LOW-004", { amount: 250, cities: ["Kolkata", "Howrah"], upiIds: ["swiggy@paytm", "bigbasket@razorpay", "zomato@ybl"] }, 18),
    accountAgeDays: 450, deviceFingerprints: ["dev-l04a"], historicalFraudCount: 0, profileType: "low_spender",
  },
  {
    userId: "LOW-005", name: "Parvathi Amma", monthlySalary: 10000, avgTransactionAmount: 80, avgMonthlySpend: 6000, avgWeeklyFrequency: 6,
    usualCities: ["Trivandrum", "Kochi"], usualUpiIds: ["bigbasket@razorpay", "electricity.tneb@paytm"],
    transactionHistory: generateHistory("LOW-005", { amount: 80, cities: ["Trivandrum", "Kochi"], upiIds: ["bigbasket@razorpay", "electricity.tneb@paytm"] }, 12),
    accountAgeDays: 500, deviceFingerprints: ["dev-l05a"], historicalFraudCount: 0, profileType: "low_spender",
  },
  {
    userId: "LOW-006", name: "Gopal Singh", monthlySalary: 16000, avgTransactionAmount: 180, avgMonthlySpend: 10000, avgWeeklyFrequency: 8,
    usualCities: ["Jaipur", "Jodhpur"], usualUpiIds: ["swiggy@paytm", "bigbasket@razorpay"],
    transactionHistory: generateHistory("LOW-006", { amount: 180, cities: ["Jaipur", "Jodhpur"], upiIds: ["swiggy@paytm", "bigbasket@razorpay"] }, 16),
    accountAgeDays: 380, deviceFingerprints: ["dev-l06a"], historicalFraudCount: 0, profileType: "low_spender",
  },
  {
    userId: "LOW-007", name: "Savitri Kumari", monthlySalary: 14000, avgTransactionAmount: 130, avgMonthlySpend: 8500, avgWeeklyFrequency: 7,
    usualCities: ["Siliguri", "Kolkata"], usualUpiIds: ["swiggy@paytm", "electricity.tneb@paytm"],
    transactionHistory: generateHistory("LOW-007", { amount: 130, cities: ["Siliguri", "Kolkata"], upiIds: ["swiggy@paytm", "electricity.tneb@paytm"] }, 14),
    accountAgeDays: 320, deviceFingerprints: ["dev-l07a"], historicalFraudCount: 1, profileType: "low_spender",
  },
];

// Anomalous cities not in any user's usual set
export const anomalousCities = ["Imphal", "Gangtok", "Port Blair", "Leh", "Itanagar", "Shillong", "Aizawl", "Kohima"];

// Suspicious payment links
export const suspiciousPaymentLinks = [
  "rzp.io/i/freeoffer2026",
  "paytm.me/quickcash",
  "bit.ly/win50k",
  "tinyurl.com/upi-refund",
  "shorturl.at/invest-now",
  "bit.ly/lottery-winner",
  "tinyurl.com/cashback-claim",
  "shorturl.at/free-recharge",
];

const categories = ["Food & Dining", "Shopping", "Groceries", "Travel", "Entertainment", "Bills & Utilities", "Healthcare", "Other"];

const suspiciousUpiIds = ["quickcash9871@ybl", "earnmoney.now@okaxis", "lucky.winner2026@paytm", "invest.returns@ybl", "refund.process@oksbi", "cashback.offer@paytm", "prize.claim@okaxis"];
const normalUpiIds = ["bigbasket@razorpay", "swiggy@paytm", "flipkart@axl", "irctc@sbi", "apollo247@hdfcbank", "electricity.tneb@paytm", "zomato@ybl", "amazon@apl", "uber@icici", "ola@paytm", "myntra@ybl", "bookmyshow@hdfcbank", "phonepe.merchant@ybl", "jiomart@sbi", "tataneu@icici"];

export function getUpiInfo(upiId: string): UpiIdInfo {
  return upiIdRegistry[upiId] || { upiId, creationDate: "2026-02-18", ageDays: 1 };
}

let txnCounter = 1000;

export interface SimulationInjection {
  highAmount?: boolean;
  newUpiId?: boolean;
  firstTimeBeneficiary?: boolean;
  paymentLink?: boolean;
  nightTransaction?: boolean;
}

export function generateDatasetTransaction(
  injection?: SimulationInjection,
  txnType?: SimTransactionType
): HistoricalTransaction & { _userRef: DatasetUser; _upiInfo: UpiIdInfo } {
  const user = userDataset[Math.floor(Math.random() * userDataset.length)];
  const hasInjection = injection && Object.values(injection).some(Boolean);
  const isAnomaly = hasInjection || Math.random() < 0.25;
  txnCounter++;

  const effectiveType = txnType || (["normal", "upi", "payment_link"] as SimTransactionType[])[Math.floor(Math.random() * 3)];

  let amount: number;
  let city: string;
  let upiId: string;
  let paymentLink: string | undefined;
  let timestamp = new Date().toISOString();

  if (hasInjection) {
    amount = injection.highAmount
      ? Math.round(user.avgTransactionAmount * (5 + Math.random() * 3))
      : Math.round(user.avgTransactionAmount * (0.5 + Math.random() * 1));

    city = user.usualCities[Math.floor(Math.random() * user.usualCities.length)];

    if (injection.firstTimeBeneficiary || injection.newUpiId) {
      upiId = suspiciousUpiIds[Math.floor(Math.random() * suspiciousUpiIds.length)];
    } else if (effectiveType === "upi") {
      upiId = user.usualUpiIds[Math.floor(Math.random() * user.usualUpiIds.length)];
    } else {
      upiId = user.usualUpiIds[Math.floor(Math.random() * user.usualUpiIds.length)];
    }

    if (injection.paymentLink || effectiveType === "payment_link") {
      paymentLink = suspiciousPaymentLinks[Math.floor(Math.random() * suspiciousPaymentLinks.length)];
    }

    if (injection.nightTransaction) {
      const d = new Date();
      d.setUTCHours(21 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60));
      timestamp = d.toISOString();
    }
  } else if (isAnomaly) {
    const anomalyType = Math.random();
    if (anomalyType < 0.25) {
      amount = user.avgTransactionAmount * (3.5 + Math.random() * 4);
      city = user.usualCities[Math.floor(Math.random() * user.usualCities.length)];
      upiId = suspiciousUpiIds[Math.floor(Math.random() * suspiciousUpiIds.length)];
    } else if (anomalyType < 0.45) {
      amount = user.avgTransactionAmount * (0.8 + Math.random() * 1.5);
      city = anomalousCities[Math.floor(Math.random() * anomalousCities.length)];
      upiId = normalUpiIds[Math.floor(Math.random() * normalUpiIds.length)];
    } else if (anomalyType < 0.65) {
      amount = user.avgTransactionAmount * (2 + Math.random() * 3);
      city = user.usualCities[Math.floor(Math.random() * user.usualCities.length)];
      upiId = suspiciousUpiIds[Math.floor(Math.random() * suspiciousUpiIds.length)];
      paymentLink = suspiciousPaymentLinks[Math.floor(Math.random() * suspiciousPaymentLinks.length)];
    } else if (anomalyType < 0.8) {
      amount = user.avgTransactionAmount * (3 + Math.random() * 3);
      city = user.usualCities[Math.floor(Math.random() * user.usualCities.length)];
      upiId = suspiciousUpiIds[Math.floor(Math.random() * suspiciousUpiIds.length)];
    } else {
      amount = user.avgTransactionAmount * (4 + Math.random() * 5);
      city = anomalousCities[Math.floor(Math.random() * anomalousCities.length)];
      upiId = suspiciousUpiIds[Math.floor(Math.random() * suspiciousUpiIds.length)];
      paymentLink = suspiciousPaymentLinks[Math.floor(Math.random() * suspiciousPaymentLinks.length)];
    }

    if (effectiveType === "payment_link" && !paymentLink) {
      paymentLink = suspiciousPaymentLinks[Math.floor(Math.random() * suspiciousPaymentLinks.length)];
    }
  } else {
    const variance = 0.3 + Math.random() * 1.4;
    amount = Math.round(user.avgTransactionAmount * variance * 100) / 100;
    city = user.usualCities[Math.floor(Math.random() * user.usualCities.length)];
    upiId = user.usualUpiIds[Math.floor(Math.random() * user.usualUpiIds.length)];

    if (effectiveType === "payment_link") {
      paymentLink = suspiciousPaymentLinks[Math.floor(Math.random() * suspiciousPaymentLinks.length)];
    }
  }

  amount = Math.round(amount);

  const upiInfo = getUpiInfo(upiId);

  return {
    transactionId: `txn-${txnCounter}`,
    userId: user.userId,
    amount,
    timestamp,
    city,
    upiId,
    category: categories[Math.floor(Math.random() * categories.length)],
    paymentLink,
    _userRef: user,
    _upiInfo: upiInfo,
  };
}

export function getUserProfile(userId: string): DatasetUser | undefined {
  return userDataset.find((u) => u.userId === userId);
}
