import { DatasetUser, HistoricalTransaction, UpiIdInfo } from "./types";

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
  { userId: "IND-001", name: "Priya Sharma", monthlySalary: 75000, avgTransactionAmount: 1200, avgMonthlySpend: 45000, avgWeeklyFrequency: 14, usualCities: ["Chennai", "Bangalore", "Coimbatore"], usualUpiIds: ["bigbasket@razorpay", "swiggy@paytm", "flipkart@axl", "electricity.tneb@paytm"], transactionHistory: generateHistory("IND-001", { amount: 1200, cities: ["Chennai", "Bangalore", "Coimbatore"], upiIds: ["bigbasket@razorpay", "swiggy@paytm", "flipkart@axl", "electricity.tneb@paytm"] }, 25), accountAgeDays: 1450, deviceFingerprints: ["dev-001a", "dev-001b"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "IND-002", name: "Rahul Mehta", monthlySalary: 120000, avgTransactionAmount: 2500, avgMonthlySpend: 72000, avgWeeklyFrequency: 10, usualCities: ["Mumbai", "Pune", "Nashik"], usualUpiIds: ["swiggy@paytm", "flipkart@axl", "zomato@ybl", "apollo247@hdfcbank"], transactionHistory: generateHistory("IND-002", { amount: 2500, cities: ["Mumbai", "Pune", "Nashik"], upiIds: ["swiggy@paytm", "flipkart@axl", "zomato@ybl", "apollo247@hdfcbank"] }, 20), accountAgeDays: 1200, deviceFingerprints: ["dev-002a"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "IND-003", name: "Anita Das", monthlySalary: 35000, avgTransactionAmount: 550, avgMonthlySpend: 22000, avgWeeklyFrequency: 16, usualCities: ["Kolkata", "Howrah", "Siliguri"], usualUpiIds: ["bigbasket@razorpay", "swiggy@paytm", "electricity.tneb@paytm"], transactionHistory: generateHistory("IND-003", { amount: 550, cities: ["Kolkata", "Howrah", "Siliguri"], upiIds: ["bigbasket@razorpay", "swiggy@paytm", "electricity.tneb@paytm"] }, 30), accountAgeDays: 980, deviceFingerprints: ["dev-003a", "dev-003b"], historicalFraudCount: 1, profileType: "salaried" },
  { userId: "IND-004", name: "Vikram Singh", monthlySalary: 150000, avgTransactionAmount: 4500, avgMonthlySpend: 95000, avgWeeklyFrequency: 8, usualCities: ["Delhi", "Gurgaon", "Noida"], usualUpiIds: ["flipkart@axl", "swiggy@paytm", "irctc@sbi", "zomato@ybl"], transactionHistory: generateHistory("IND-004", { amount: 4500, cities: ["Delhi", "Gurgaon", "Noida"], upiIds: ["flipkart@axl", "swiggy@paytm", "irctc@sbi", "zomato@ybl"] }, 18), accountAgeDays: 2100, deviceFingerprints: ["dev-004a"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "IND-005", name: "Deepa Nair", monthlySalary: 55000, avgTransactionAmount: 800, avgMonthlySpend: 35000, avgWeeklyFrequency: 12, usualCities: ["Kochi", "Trivandrum", "Calicut"], usualUpiIds: ["bigbasket@razorpay", "swiggy@paytm", "electricity.tneb@paytm", "apollo247@hdfcbank"], transactionHistory: generateHistory("IND-005", { amount: 800, cities: ["Kochi", "Trivandrum", "Calicut"], upiIds: ["bigbasket@razorpay", "swiggy@paytm", "electricity.tneb@paytm", "apollo247@hdfcbank"] }, 22), accountAgeDays: 730, deviceFingerprints: ["dev-005a", "dev-005b"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "IND-006", name: "Arjun Reddy", monthlySalary: 90000, avgTransactionAmount: 1800, avgMonthlySpend: 58000, avgWeeklyFrequency: 11, usualCities: ["Hyderabad", "Secunderabad", "Warangal"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl", "uber@icici"], transactionHistory: generateHistory("IND-006", { amount: 1800, cities: ["Hyderabad", "Secunderabad", "Warangal"], upiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl", "uber@icici"] }, 22), accountAgeDays: 1650, deviceFingerprints: ["dev-006a"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "IND-007", name: "Meera Joshi", monthlySalary: 65000, avgTransactionAmount: 1100, avgMonthlySpend: 42000, avgWeeklyFrequency: 13, usualCities: ["Pune", "Mumbai", "Nagpur"], usualUpiIds: ["flipkart@axl", "myntra@ybl", "bigbasket@razorpay", "ola@paytm"], transactionHistory: generateHistory("IND-007", { amount: 1100, cities: ["Pune", "Mumbai", "Nagpur"], upiIds: ["flipkart@axl", "myntra@ybl", "bigbasket@razorpay", "ola@paytm"] }, 26), accountAgeDays: 1100, deviceFingerprints: ["dev-007a", "dev-007b"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "IND-008", name: "Suresh Kumar", monthlySalary: 45000, avgTransactionAmount: 750, avgMonthlySpend: 30000, avgWeeklyFrequency: 15, usualCities: ["Jaipur", "Ajmer", "Udaipur"], usualUpiIds: ["swiggy@paytm", "bigbasket@razorpay", "jiomart@sbi"], transactionHistory: generateHistory("IND-008", { amount: 750, cities: ["Jaipur", "Ajmer", "Udaipur"], upiIds: ["swiggy@paytm", "bigbasket@razorpay", "jiomart@sbi"] }, 28), accountAgeDays: 850, deviceFingerprints: ["dev-008a"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "IND-009", name: "Kavitha Raman", monthlySalary: 85000, avgTransactionAmount: 1500, avgMonthlySpend: 52000, avgWeeklyFrequency: 10, usualCities: ["Chennai", "Madurai", "Pondicherry"], usualUpiIds: ["swiggy@paytm", "flipkart@axl", "electricity.tneb@paytm", "tataneu@icici"], transactionHistory: generateHistory("IND-009", { amount: 1500, cities: ["Chennai", "Madurai", "Pondicherry"], upiIds: ["swiggy@paytm", "flipkart@axl", "electricity.tneb@paytm", "tataneu@icici"] }, 20), accountAgeDays: 1800, deviceFingerprints: ["dev-009a", "dev-009b"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "IND-010", name: "Amit Patel", monthlySalary: 100000, avgTransactionAmount: 2200, avgMonthlySpend: 65000, avgWeeklyFrequency: 9, usualCities: ["Ahmedabad", "Surat", "Vadodara"], usualUpiIds: ["flipkart@axl", "amazon@apl", "swiggy@paytm", "bookmyshow@hdfcbank"], transactionHistory: generateHistory("IND-010", { amount: 2200, cities: ["Ahmedabad", "Surat", "Vadodara"], upiIds: ["flipkart@axl", "amazon@apl", "swiggy@paytm", "bookmyshow@hdfcbank"] }, 18), accountAgeDays: 1350, deviceFingerprints: ["dev-010a"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "IND-011", name: "Neha Gupta", monthlySalary: 70000, avgTransactionAmount: 1300, avgMonthlySpend: 46000, avgWeeklyFrequency: 12, usualCities: ["Lucknow", "Kanpur", "Varanasi"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "bigbasket@razorpay"], transactionHistory: generateHistory("IND-011", { amount: 1300, cities: ["Lucknow", "Kanpur", "Varanasi"], upiIds: ["swiggy@paytm", "zomato@ybl", "bigbasket@razorpay"] }, 24), accountAgeDays: 900, deviceFingerprints: ["dev-011a"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "IND-012", name: "Sanjay Verma", monthlySalary: 58000, avgTransactionAmount: 950, avgMonthlySpend: 38000, avgWeeklyFrequency: 14, usualCities: ["Bhopal", "Indore", "Gwalior"], usualUpiIds: ["swiggy@paytm", "flipkart@axl", "electricity.tneb@paytm", "jiomart@sbi"], transactionHistory: generateHistory("IND-012", { amount: 950, cities: ["Bhopal", "Indore", "Gwalior"], upiIds: ["swiggy@paytm", "flipkart@axl", "electricity.tneb@paytm", "jiomart@sbi"] }, 28), accountAgeDays: 1050, deviceFingerprints: ["dev-012a", "dev-012b"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "IND-013", name: "Pooja Iyer", monthlySalary: 110000, avgTransactionAmount: 2000, avgMonthlySpend: 68000, avgWeeklyFrequency: 9, usualCities: ["Bangalore", "Mysore", "Mangalore"], usualUpiIds: ["amazon@apl", "flipkart@axl", "uber@icici", "apollo247@hdfcbank"], transactionHistory: generateHistory("IND-013", { amount: 2000, cities: ["Bangalore", "Mysore", "Mangalore"], upiIds: ["amazon@apl", "flipkart@axl", "uber@icici", "apollo247@hdfcbank"] }, 18), accountAgeDays: 1500, deviceFingerprints: ["dev-013a"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "IND-014", name: "Rajesh Khanna", monthlySalary: 52000, avgTransactionAmount: 850, avgMonthlySpend: 34000, avgWeeklyFrequency: 15, usualCities: ["Patna", "Ranchi", "Dhanbad"], usualUpiIds: ["swiggy@paytm", "bigbasket@razorpay", "zomato@ybl"], transactionHistory: generateHistory("IND-014", { amount: 850, cities: ["Patna", "Ranchi", "Dhanbad"], upiIds: ["swiggy@paytm", "bigbasket@razorpay", "zomato@ybl"] }, 30), accountAgeDays: 700, deviceFingerprints: ["dev-014a"], historicalFraudCount: 1, profileType: "salaried" },
  { userId: "IND-015", name: "Divya Menon", monthlySalary: 95000, avgTransactionAmount: 1700, avgMonthlySpend: 60000, avgWeeklyFrequency: 11, usualCities: ["Kochi", "Bangalore", "Chennai"], usualUpiIds: ["flipkart@axl", "myntra@ybl", "swiggy@paytm", "tataneu@icici"], transactionHistory: generateHistory("IND-015", { amount: 1700, cities: ["Kochi", "Bangalore", "Chennai"], upiIds: ["flipkart@axl", "myntra@ybl", "swiggy@paytm", "tataneu@icici"] }, 22), accountAgeDays: 1250, deviceFingerprints: ["dev-015a", "dev-015b"], historicalFraudCount: 0, profileType: "salaried" },
  // --- Business Owners (10) ---
  { userId: "BIZ-001", name: "Ravi Agarwal", monthlySalary: 300000, avgTransactionAmount: 15000, avgMonthlySpend: 220000, avgWeeklyFrequency: 20, usualCities: ["Delhi", "Mumbai", "Kolkata", "Chennai"], usualUpiIds: ["flipkart@axl", "amazon@apl", "phonepe.merchant@ybl", "irctc@sbi"], transactionHistory: generateHistory("BIZ-001", { amount: 15000, cities: ["Delhi", "Mumbai", "Kolkata", "Chennai"], upiIds: ["flipkart@axl", "amazon@apl", "phonepe.merchant@ybl", "irctc@sbi"] }, 35), accountAgeDays: 2500, deviceFingerprints: ["dev-b01a", "dev-b01b", "dev-b01c"], historicalFraudCount: 0, profileType: "business" },
  { userId: "BIZ-002", name: "Sunita Bansal", monthlySalary: 200000, avgTransactionAmount: 8000, avgMonthlySpend: 150000, avgWeeklyFrequency: 18, usualCities: ["Mumbai", "Pune", "Ahmedabad"], usualUpiIds: ["amazon@apl", "flipkart@axl", "swiggy@paytm", "jiomart@sbi"], transactionHistory: generateHistory("BIZ-002", { amount: 8000, cities: ["Mumbai", "Pune", "Ahmedabad"], upiIds: ["amazon@apl", "flipkart@axl", "swiggy@paytm", "jiomart@sbi"] }, 30), accountAgeDays: 1800, deviceFingerprints: ["dev-b02a", "dev-b02b"], historicalFraudCount: 0, profileType: "business" },
  { userId: "BIZ-003", name: "Mohammed Iqbal", monthlySalary: 180000, avgTransactionAmount: 6500, avgMonthlySpend: 130000, avgWeeklyFrequency: 16, usualCities: ["Hyderabad", "Bangalore", "Chennai"], usualUpiIds: ["phonepe.merchant@ybl", "amazon@apl", "uber@icici"], transactionHistory: generateHistory("BIZ-003", { amount: 6500, cities: ["Hyderabad", "Bangalore", "Chennai"], upiIds: ["phonepe.merchant@ybl", "amazon@apl", "uber@icici"] }, 28), accountAgeDays: 2000, deviceFingerprints: ["dev-b03a"], historicalFraudCount: 0, profileType: "business" },
  { userId: "BIZ-004", name: "Lakshmi Narayan", monthlySalary: 250000, avgTransactionAmount: 12000, avgMonthlySpend: 180000, avgWeeklyFrequency: 22, usualCities: ["Chennai", "Coimbatore", "Madurai", "Bangalore"], usualUpiIds: ["flipkart@axl", "amazon@apl", "phonepe.merchant@ybl", "tataneu@icici"], transactionHistory: generateHistory("BIZ-004", { amount: 12000, cities: ["Chennai", "Coimbatore", "Madurai", "Bangalore"], upiIds: ["flipkart@axl", "amazon@apl", "phonepe.merchant@ybl", "tataneu@icici"] }, 40), accountAgeDays: 2200, deviceFingerprints: ["dev-b04a", "dev-b04b"], historicalFraudCount: 0, profileType: "business" },
  { userId: "BIZ-005", name: "Ajay Devgan", monthlySalary: 500000, avgTransactionAmount: 25000, avgMonthlySpend: 380000, avgWeeklyFrequency: 25, usualCities: ["Mumbai", "Delhi", "Goa", "Bangalore"], usualUpiIds: ["amazon@apl", "flipkart@axl", "bookmyshow@hdfcbank", "uber@icici", "irctc@sbi"], transactionHistory: generateHistory("BIZ-005", { amount: 25000, cities: ["Mumbai", "Delhi", "Goa", "Bangalore"], upiIds: ["amazon@apl", "flipkart@axl", "bookmyshow@hdfcbank", "uber@icici"] }, 45), accountAgeDays: 3000, deviceFingerprints: ["dev-b05a", "dev-b05b", "dev-b05c"], historicalFraudCount: 0, profileType: "business" },
  { userId: "BIZ-006", name: "Geeta Krishnan", monthlySalary: 160000, avgTransactionAmount: 5500, avgMonthlySpend: 110000, avgWeeklyFrequency: 15, usualCities: ["Trivandrum", "Kochi", "Bangalore"], usualUpiIds: ["flipkart@axl", "amazon@apl", "swiggy@paytm"], transactionHistory: generateHistory("BIZ-006", { amount: 5500, cities: ["Trivandrum", "Kochi", "Bangalore"], upiIds: ["flipkart@axl", "amazon@apl", "swiggy@paytm"] }, 25), accountAgeDays: 1600, deviceFingerprints: ["dev-b06a"], historicalFraudCount: 0, profileType: "business" },
  { userId: "BIZ-007", name: "Harpreet Kaur", monthlySalary: 220000, avgTransactionAmount: 9500, avgMonthlySpend: 165000, avgWeeklyFrequency: 19, usualCities: ["Chandigarh", "Delhi", "Amritsar", "Ludhiana"], usualUpiIds: ["amazon@apl", "flipkart@axl", "jiomart@sbi", "phonepe.merchant@ybl"], transactionHistory: generateHistory("BIZ-007", { amount: 9500, cities: ["Chandigarh", "Delhi", "Amritsar", "Ludhiana"], upiIds: ["amazon@apl", "flipkart@axl", "jiomart@sbi", "phonepe.merchant@ybl"] }, 32), accountAgeDays: 1900, deviceFingerprints: ["dev-b07a", "dev-b07b"], historicalFraudCount: 0, profileType: "business" },
  { userId: "BIZ-008", name: "Prakash Raj", monthlySalary: 280000, avgTransactionAmount: 11000, avgMonthlySpend: 200000, avgWeeklyFrequency: 21, usualCities: ["Bangalore", "Chennai", "Hyderabad"], usualUpiIds: ["phonepe.merchant@ybl", "amazon@apl", "uber@icici", "flipkart@axl"], transactionHistory: generateHistory("BIZ-008", { amount: 11000, cities: ["Bangalore", "Chennai", "Hyderabad"], upiIds: ["phonepe.merchant@ybl", "amazon@apl", "uber@icici", "flipkart@axl"] }, 38), accountAgeDays: 2400, deviceFingerprints: ["dev-b08a"], historicalFraudCount: 0, profileType: "business" },
  { userId: "BIZ-009", name: "Fatima Shaikh", monthlySalary: 140000, avgTransactionAmount: 4800, avgMonthlySpend: 95000, avgWeeklyFrequency: 14, usualCities: ["Mumbai", "Pune", "Goa"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl", "myntra@ybl"], transactionHistory: generateHistory("BIZ-009", { amount: 4800, cities: ["Mumbai", "Pune", "Goa"], upiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl", "myntra@ybl"] }, 24), accountAgeDays: 1400, deviceFingerprints: ["dev-b09a", "dev-b09b"], historicalFraudCount: 0, profileType: "business" },
  { userId: "BIZ-010", name: "Karthik Subramanian", monthlySalary: 350000, avgTransactionAmount: 18000, avgMonthlySpend: 260000, avgWeeklyFrequency: 23, usualCities: ["Chennai", "Bangalore", "Mumbai", "Delhi"], usualUpiIds: ["flipkart@axl", "amazon@apl", "phonepe.merchant@ybl", "irctc@sbi", "tataneu@icici"], transactionHistory: generateHistory("BIZ-010", { amount: 18000, cities: ["Chennai", "Bangalore", "Mumbai", "Delhi"], upiIds: ["flipkart@axl", "amazon@apl", "phonepe.merchant@ybl", "irctc@sbi"] }, 42), accountAgeDays: 2800, deviceFingerprints: ["dev-b10a", "dev-b10b", "dev-b10c"], historicalFraudCount: 0, profileType: "business" },
  // --- Students (10) ---
  { userId: "STU-001", name: "Aarav Mishra", monthlySalary: 8000, avgTransactionAmount: 200, avgMonthlySpend: 6000, avgWeeklyFrequency: 18, usualCities: ["Delhi", "Noida"], usualUpiIds: ["swiggy@paytm", "zomato@ybl"], transactionHistory: generateHistory("STU-001", { amount: 200, cities: ["Delhi", "Noida"], upiIds: ["swiggy@paytm", "zomato@ybl"] }, 35), accountAgeDays: 180, deviceFingerprints: ["dev-s01a"], historicalFraudCount: 0, profileType: "student" },
  { userId: "STU-002", name: "Ishita Kapoor", monthlySalary: 10000, avgTransactionAmount: 280, avgMonthlySpend: 8000, avgWeeklyFrequency: 20, usualCities: ["Mumbai", "Pune"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl"], transactionHistory: generateHistory("STU-002", { amount: 280, cities: ["Mumbai", "Pune"], upiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl"] }, 40), accountAgeDays: 220, deviceFingerprints: ["dev-s02a"], historicalFraudCount: 0, profileType: "student" },
  { userId: "STU-003", name: "Rohan Bhat", monthlySalary: 6000, avgTransactionAmount: 150, avgMonthlySpend: 4500, avgWeeklyFrequency: 22, usualCities: ["Bangalore", "Mysore"], usualUpiIds: ["swiggy@paytm", "zomato@ybl"], transactionHistory: generateHistory("STU-003", { amount: 150, cities: ["Bangalore", "Mysore"], upiIds: ["swiggy@paytm", "zomato@ybl"] }, 45), accountAgeDays: 90, deviceFingerprints: ["dev-s03a"], historicalFraudCount: 0, profileType: "student" },
  { userId: "STU-004", name: "Tanvi Deshpande", monthlySalary: 12000, avgTransactionAmount: 350, avgMonthlySpend: 9500, avgWeeklyFrequency: 16, usualCities: ["Pune", "Mumbai"], usualUpiIds: ["swiggy@paytm", "myntra@ybl", "amazon@apl"], transactionHistory: generateHistory("STU-004", { amount: 350, cities: ["Pune", "Mumbai"], upiIds: ["swiggy@paytm", "myntra@ybl", "amazon@apl"] }, 30), accountAgeDays: 300, deviceFingerprints: ["dev-s04a"], historicalFraudCount: 0, profileType: "student" },
  { userId: "STU-005", name: "Varun Nambiar", monthlySalary: 7000, avgTransactionAmount: 180, avgMonthlySpend: 5200, avgWeeklyFrequency: 19, usualCities: ["Kochi", "Trivandrum"], usualUpiIds: ["swiggy@paytm", "zomato@ybl"], transactionHistory: generateHistory("STU-005", { amount: 180, cities: ["Kochi", "Trivandrum"], upiIds: ["swiggy@paytm", "zomato@ybl"] }, 38), accountAgeDays: 150, deviceFingerprints: ["dev-s05a"], historicalFraudCount: 0, profileType: "student" },
  { userId: "STU-006", name: "Sneha Pandey", monthlySalary: 9000, avgTransactionAmount: 220, avgMonthlySpend: 7000, avgWeeklyFrequency: 17, usualCities: ["Lucknow", "Kanpur"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl"], transactionHistory: generateHistory("STU-006", { amount: 220, cities: ["Lucknow", "Kanpur"], upiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl"] }, 34), accountAgeDays: 200, deviceFingerprints: ["dev-s06a"], historicalFraudCount: 0, profileType: "student" },
  { userId: "STU-007", name: "Aditya Saxena", monthlySalary: 11000, avgTransactionAmount: 300, avgMonthlySpend: 8500, avgWeeklyFrequency: 21, usualCities: ["Delhi", "Gurgaon"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "uber@icici"], transactionHistory: generateHistory("STU-007", { amount: 300, cities: ["Delhi", "Gurgaon"], upiIds: ["swiggy@paytm", "zomato@ybl", "uber@icici"] }, 42), accountAgeDays: 250, deviceFingerprints: ["dev-s07a"], historicalFraudCount: 0, profileType: "student" },
  { userId: "STU-008", name: "Ritu Sharma", monthlySalary: 5000, avgTransactionAmount: 120, avgMonthlySpend: 3800, avgWeeklyFrequency: 24, usualCities: ["Jaipur", "Ajmer"], usualUpiIds: ["swiggy@paytm", "zomato@ybl"], transactionHistory: generateHistory("STU-008", { amount: 120, cities: ["Jaipur", "Ajmer"], upiIds: ["swiggy@paytm", "zomato@ybl"] }, 48), accountAgeDays: 60, deviceFingerprints: ["dev-s08a"], historicalFraudCount: 0, profileType: "student" },
  { userId: "STU-009", name: "Nikhil Rao", monthlySalary: 8500, avgTransactionAmount: 230, avgMonthlySpend: 6500, avgWeeklyFrequency: 18, usualCities: ["Hyderabad", "Secunderabad"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "bookmyshow@hdfcbank"], transactionHistory: generateHistory("STU-009", { amount: 230, cities: ["Hyderabad", "Secunderabad"], upiIds: ["swiggy@paytm", "zomato@ybl", "bookmyshow@hdfcbank"] }, 36), accountAgeDays: 170, deviceFingerprints: ["dev-s09a"], historicalFraudCount: 0, profileType: "student" },
  { userId: "STU-010", name: "Pallavi Ghosh", monthlySalary: 7500, avgTransactionAmount: 190, avgMonthlySpend: 5800, avgWeeklyFrequency: 20, usualCities: ["Kolkata", "Howrah"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "bigbasket@razorpay"], transactionHistory: generateHistory("STU-010", { amount: 190, cities: ["Kolkata", "Howrah"], upiIds: ["swiggy@paytm", "zomato@ybl", "bigbasket@razorpay"] }, 40), accountAgeDays: 130, deviceFingerprints: ["dev-s10a"], historicalFraudCount: 0, profileType: "student" },
  // --- High Spenders (8) ---
  { userId: "HIG-001", name: "Arun Ambani", monthlySalary: 800000, avgTransactionAmount: 45000, avgMonthlySpend: 600000, avgWeeklyFrequency: 15, usualCities: ["Mumbai", "Delhi", "London", "Dubai"], usualUpiIds: ["amazon@apl", "flipkart@axl", "bookmyshow@hdfcbank", "uber@icici"], transactionHistory: generateHistory("HIG-001", { amount: 45000, cities: ["Mumbai", "Delhi"], upiIds: ["amazon@apl", "flipkart@axl", "bookmyshow@hdfcbank", "uber@icici"] }, 30), accountAgeDays: 3500, deviceFingerprints: ["dev-h01a", "dev-h01b", "dev-h01c"], historicalFraudCount: 0, profileType: "high_spender" },
  { userId: "HIG-002", name: "Nita Kapadia", monthlySalary: 600000, avgTransactionAmount: 35000, avgMonthlySpend: 450000, avgWeeklyFrequency: 12, usualCities: ["Mumbai", "Bangalore", "Goa"], usualUpiIds: ["amazon@apl", "flipkart@axl", "myntra@ybl", "tataneu@icici"], transactionHistory: generateHistory("HIG-002", { amount: 35000, cities: ["Mumbai", "Bangalore", "Goa"], upiIds: ["amazon@apl", "flipkart@axl", "myntra@ybl", "tataneu@icici"] }, 24), accountAgeDays: 2800, deviceFingerprints: ["dev-h02a", "dev-h02b"], historicalFraudCount: 0, profileType: "high_spender" },
  { userId: "HIG-003", name: "Rohit Singhania", monthlySalary: 450000, avgTransactionAmount: 22000, avgMonthlySpend: 320000, avgWeeklyFrequency: 14, usualCities: ["Delhi", "Gurgaon", "Chandigarh"], usualUpiIds: ["flipkart@axl", "amazon@apl", "irctc@sbi", "bookmyshow@hdfcbank"], transactionHistory: generateHistory("HIG-003", { amount: 22000, cities: ["Delhi", "Gurgaon", "Chandigarh"], upiIds: ["flipkart@axl", "amazon@apl", "irctc@sbi", "bookmyshow@hdfcbank"] }, 28), accountAgeDays: 2600, deviceFingerprints: ["dev-h03a"], historicalFraudCount: 0, profileType: "high_spender" },
  { userId: "HIG-004", name: "Tara Devi", monthlySalary: 550000, avgTransactionAmount: 28000, avgMonthlySpend: 400000, avgWeeklyFrequency: 11, usualCities: ["Chennai", "Bangalore", "Mumbai"], usualUpiIds: ["amazon@apl", "myntra@ybl", "tataneu@icici"], transactionHistory: generateHistory("HIG-004", { amount: 28000, cities: ["Chennai", "Bangalore", "Mumbai"], upiIds: ["amazon@apl", "myntra@ybl", "tataneu@icici"] }, 22), accountAgeDays: 3200, deviceFingerprints: ["dev-h04a", "dev-h04b"], historicalFraudCount: 0, profileType: "high_spender" },
  { userId: "HIG-005", name: "Vijay Mallya Jr", monthlySalary: 700000, avgTransactionAmount: 40000, avgMonthlySpend: 520000, avgWeeklyFrequency: 16, usualCities: ["Bangalore", "Mumbai", "Goa", "Delhi"], usualUpiIds: ["amazon@apl", "flipkart@axl", "uber@icici", "bookmyshow@hdfcbank", "irctc@sbi"], transactionHistory: generateHistory("HIG-005", { amount: 40000, cities: ["Bangalore", "Mumbai", "Goa", "Delhi"], upiIds: ["amazon@apl", "flipkart@axl", "uber@icici", "bookmyshow@hdfcbank"] }, 32), accountAgeDays: 2900, deviceFingerprints: ["dev-h05a", "dev-h05b"], historicalFraudCount: 0, profileType: "high_spender" },
  { userId: "HIG-006", name: "Zara Khan", monthlySalary: 400000, avgTransactionAmount: 20000, avgMonthlySpend: 300000, avgWeeklyFrequency: 13, usualCities: ["Mumbai", "Delhi", "Hyderabad"], usualUpiIds: ["myntra@ybl", "amazon@apl", "flipkart@axl", "tataneu@icici"], transactionHistory: generateHistory("HIG-006", { amount: 20000, cities: ["Mumbai", "Delhi", "Hyderabad"], upiIds: ["myntra@ybl", "amazon@apl", "flipkart@axl", "tataneu@icici"] }, 26), accountAgeDays: 2400, deviceFingerprints: ["dev-h06a"], historicalFraudCount: 0, profileType: "high_spender" },
  { userId: "HIG-007", name: "Manish Tiwari", monthlySalary: 350000, avgTransactionAmount: 18000, avgMonthlySpend: 250000, avgWeeklyFrequency: 10, usualCities: ["Delhi", "Noida", "Gurgaon"], usualUpiIds: ["flipkart@axl", "amazon@apl", "irctc@sbi"], transactionHistory: generateHistory("HIG-007", { amount: 18000, cities: ["Delhi", "Noida", "Gurgaon"], upiIds: ["flipkart@axl", "amazon@apl", "irctc@sbi"] }, 20), accountAgeDays: 2100, deviceFingerprints: ["dev-h07a", "dev-h07b"], historicalFraudCount: 0, profileType: "high_spender" },
  { userId: "HIG-008", name: "Isha Ambani", monthlySalary: 900000, avgTransactionAmount: 50000, avgMonthlySpend: 700000, avgWeeklyFrequency: 18, usualCities: ["Mumbai", "Delhi", "Bangalore", "Goa", "Chennai"], usualUpiIds: ["amazon@apl", "flipkart@axl", "tataneu@icici", "bookmyshow@hdfcbank", "uber@icici"], transactionHistory: generateHistory("HIG-008", { amount: 50000, cities: ["Mumbai", "Delhi", "Bangalore", "Goa"], upiIds: ["amazon@apl", "flipkart@axl", "tataneu@icici", "bookmyshow@hdfcbank"] }, 36), accountAgeDays: 3800, deviceFingerprints: ["dev-h08a", "dev-h08b", "dev-h08c"], historicalFraudCount: 0, profileType: "high_spender" },
  // --- Low Spenders (7) ---
  { userId: "LOW-001", name: "Kamala Devi", monthlySalary: 15000, avgTransactionAmount: 150, avgMonthlySpend: 9000, avgWeeklyFrequency: 8, usualCities: ["Varanasi", "Lucknow"], usualUpiIds: ["swiggy@paytm", "bigbasket@razorpay"], transactionHistory: generateHistory("LOW-001", { amount: 150, cities: ["Varanasi", "Lucknow"], upiIds: ["swiggy@paytm", "bigbasket@razorpay"] }, 16), accountAgeDays: 400, deviceFingerprints: ["dev-l01a"], historicalFraudCount: 0, profileType: "low_spender" },
  { userId: "LOW-002", name: "Ram Prasad", monthlySalary: 18000, avgTransactionAmount: 200, avgMonthlySpend: 11000, avgWeeklyFrequency: 7, usualCities: ["Patna", "Ranchi"], usualUpiIds: ["swiggy@paytm", "electricity.tneb@paytm"], transactionHistory: generateHistory("LOW-002", { amount: 200, cities: ["Patna", "Ranchi"], upiIds: ["swiggy@paytm", "electricity.tneb@paytm"] }, 14), accountAgeDays: 350, deviceFingerprints: ["dev-l02a"], historicalFraudCount: 0, profileType: "low_spender" },
  { userId: "LOW-003", name: "Lakshmi Bai", monthlySalary: 12000, avgTransactionAmount: 100, avgMonthlySpend: 7500, avgWeeklyFrequency: 10, usualCities: ["Bhopal", "Indore"], usualUpiIds: ["bigbasket@razorpay", "electricity.tneb@paytm"], transactionHistory: generateHistory("LOW-003", { amount: 100, cities: ["Bhopal", "Indore"], upiIds: ["bigbasket@razorpay", "electricity.tneb@paytm"] }, 20), accountAgeDays: 280, deviceFingerprints: ["dev-l03a"], historicalFraudCount: 0, profileType: "low_spender" },
  { userId: "LOW-004", name: "Shankar Das", monthlySalary: 20000, avgTransactionAmount: 250, avgMonthlySpend: 13000, avgWeeklyFrequency: 9, usualCities: ["Kolkata", "Howrah"], usualUpiIds: ["swiggy@paytm", "bigbasket@razorpay", "zomato@ybl"], transactionHistory: generateHistory("LOW-004", { amount: 250, cities: ["Kolkata", "Howrah"], upiIds: ["swiggy@paytm", "bigbasket@razorpay", "zomato@ybl"] }, 18), accountAgeDays: 450, deviceFingerprints: ["dev-l04a"], historicalFraudCount: 0, profileType: "low_spender" },
  { userId: "LOW-005", name: "Parvathi Amma", monthlySalary: 10000, avgTransactionAmount: 80, avgMonthlySpend: 6000, avgWeeklyFrequency: 6, usualCities: ["Trivandrum", "Kochi"], usualUpiIds: ["bigbasket@razorpay", "electricity.tneb@paytm"], transactionHistory: generateHistory("LOW-005", { amount: 80, cities: ["Trivandrum", "Kochi"], upiIds: ["bigbasket@razorpay", "electricity.tneb@paytm"] }, 12), accountAgeDays: 500, deviceFingerprints: ["dev-l05a"], historicalFraudCount: 0, profileType: "low_spender" },
  { userId: "LOW-006", name: "Gopal Singh", monthlySalary: 16000, avgTransactionAmount: 180, avgMonthlySpend: 10000, avgWeeklyFrequency: 8, usualCities: ["Jaipur", "Jodhpur"], usualUpiIds: ["swiggy@paytm", "bigbasket@razorpay"], transactionHistory: generateHistory("LOW-006", { amount: 180, cities: ["Jaipur", "Jodhpur"], upiIds: ["swiggy@paytm", "bigbasket@razorpay"] }, 16), accountAgeDays: 380, deviceFingerprints: ["dev-l06a"], historicalFraudCount: 0, profileType: "low_spender" },
  { userId: "LOW-007", name: "Savitri Kumari", monthlySalary: 14000, avgTransactionAmount: 130, avgMonthlySpend: 8500, avgWeeklyFrequency: 7, usualCities: ["Siliguri", "Kolkata"], usualUpiIds: ["swiggy@paytm", "electricity.tneb@paytm"], transactionHistory: generateHistory("LOW-007", { amount: 130, cities: ["Siliguri", "Kolkata"], upiIds: ["swiggy@paytm", "electricity.tneb@paytm"] }, 14), accountAgeDays: 320, deviceFingerprints: ["dev-l07a"], historicalFraudCount: 1, profileType: "low_spender" },

  // --- Freelancers / Gig Workers (8) ---
  { userId: "FRL-001", name: "Karan Malhotra", monthlySalary: 45000, avgTransactionAmount: 1800, avgMonthlySpend: 32000, avgWeeklyFrequency: 10, usualCities: ["Delhi", "Gurgaon", "Noida", "Mumbai"], usualUpiIds: ["amazon@apl", "swiggy@paytm", "uber@icici", "phonepe.merchant@ybl"], transactionHistory: generateHistory("FRL-001", { amount: 1800, cities: ["Delhi", "Gurgaon", "Noida", "Mumbai"], upiIds: ["amazon@apl", "swiggy@paytm", "uber@icici", "phonepe.merchant@ybl"] }, 55), accountAgeDays: 820, deviceFingerprints: ["dev-f01a", "dev-f01b"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "FRL-002", name: "Preethi Balaji", monthlySalary: 38000, avgTransactionAmount: 1400, avgMonthlySpend: 27000, avgWeeklyFrequency: 12, usualCities: ["Chennai", "Bangalore", "Pondicherry"], usualUpiIds: ["flipkart@axl", "swiggy@paytm", "zomato@ybl", "amazon@apl"], transactionHistory: generateHistory("FRL-002", { amount: 1400, cities: ["Chennai", "Bangalore", "Pondicherry"], upiIds: ["flipkart@axl", "swiggy@paytm", "zomato@ybl", "amazon@apl"] }, 60), accountAgeDays: 650, deviceFingerprints: ["dev-f02a"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "FRL-003", name: "Saurabh Tiwari", monthlySalary: 55000, avgTransactionAmount: 2200, avgMonthlySpend: 40000, avgWeeklyFrequency: 9, usualCities: ["Pune", "Mumbai", "Nashik"], usualUpiIds: ["amazon@apl", "flipkart@axl", "ola@paytm", "bookmyshow@hdfcbank"], transactionHistory: generateHistory("FRL-003", { amount: 2200, cities: ["Pune", "Mumbai", "Nashik"], upiIds: ["amazon@apl", "flipkart@axl", "ola@paytm", "bookmyshow@hdfcbank"] }, 50), accountAgeDays: 940, deviceFingerprints: ["dev-f03a", "dev-f03b"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "FRL-004", name: "Aditi Sharma", monthlySalary: 62000, avgTransactionAmount: 2500, avgMonthlySpend: 46000, avgWeeklyFrequency: 11, usualCities: ["Bangalore", "Hyderabad", "Chennai"], usualUpiIds: ["myntra@ybl", "amazon@apl", "swiggy@paytm", "tataneu@icici"], transactionHistory: generateHistory("FRL-004", { amount: 2500, cities: ["Bangalore", "Hyderabad", "Chennai"], upiIds: ["myntra@ybl", "amazon@apl", "swiggy@paytm", "tataneu@icici"] }, 65), accountAgeDays: 710, deviceFingerprints: ["dev-f04a"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "FRL-005", name: "Vinod Chandrasekhar", monthlySalary: 30000, avgTransactionAmount: 900, avgMonthlySpend: 21000, avgWeeklyFrequency: 14, usualCities: ["Hyderabad", "Warangal", "Vizag"], usualUpiIds: ["swiggy@paytm", "bigbasket@razorpay", "zomato@ybl", "jiomart@sbi"], transactionHistory: generateHistory("FRL-005", { amount: 900, cities: ["Hyderabad", "Warangal", "Vizag"], upiIds: ["swiggy@paytm", "bigbasket@razorpay", "zomato@ybl", "jiomart@sbi"] }, 52), accountAgeDays: 530, deviceFingerprints: ["dev-f05a"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "FRL-006", name: "Megha Pillai", monthlySalary: 42000, avgTransactionAmount: 1600, avgMonthlySpend: 30000, avgWeeklyFrequency: 13, usualCities: ["Kochi", "Trivandrum", "Bangalore"], usualUpiIds: ["amazon@apl", "flipkart@axl", "swiggy@paytm", "myntra@ybl"], transactionHistory: generateHistory("FRL-006", { amount: 1600, cities: ["Kochi", "Trivandrum", "Bangalore"], upiIds: ["amazon@apl", "flipkart@axl", "swiggy@paytm", "myntra@ybl"] }, 58), accountAgeDays: 760, deviceFingerprints: ["dev-f06a", "dev-f06b"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "FRL-007", name: "Sachin Dwivedi", monthlySalary: 50000, avgTransactionAmount: 2000, avgMonthlySpend: 36000, avgWeeklyFrequency: 8, usualCities: ["Lucknow", "Delhi", "Kanpur"], usualUpiIds: ["flipkart@axl", "amazon@apl", "irctc@sbi", "swiggy@paytm"], transactionHistory: generateHistory("FRL-007", { amount: 2000, cities: ["Lucknow", "Delhi", "Kanpur"], upiIds: ["flipkart@axl", "amazon@apl", "irctc@sbi", "swiggy@paytm"] }, 56), accountAgeDays: 880, deviceFingerprints: ["dev-f07a"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "FRL-008", name: "Nandita Roy", monthlySalary: 35000, avgTransactionAmount: 1200, avgMonthlySpend: 25000, avgWeeklyFrequency: 15, usualCities: ["Kolkata", "Siliguri", "Bhubaneswar"], usualUpiIds: ["swiggy@paytm", "bigbasket@razorpay", "amazon@apl", "jiomart@sbi"], transactionHistory: generateHistory("FRL-008", { amount: 1200, cities: ["Kolkata", "Siliguri", "Bhubaneswar"], upiIds: ["swiggy@paytm", "bigbasket@razorpay", "amazon@apl", "jiomart@sbi"] }, 62), accountAgeDays: 590, deviceFingerprints: ["dev-f08a"], historicalFraudCount: 1, profileType: "salaried" },

  // --- Retirees / Senior Citizens (6) ---
  { userId: "RET-001", name: "Mohan Lal Gupta", monthlySalary: 25000, avgTransactionAmount: 400, avgMonthlySpend: 18000, avgWeeklyFrequency: 5, usualCities: ["Delhi", "Agra"], usualUpiIds: ["bigbasket@razorpay", "apollo247@hdfcbank", "electricity.tneb@paytm"], transactionHistory: generateHistory("RET-001", { amount: 400, cities: ["Delhi", "Agra"], upiIds: ["bigbasket@razorpay", "apollo247@hdfcbank", "electricity.tneb@paytm"] }, 14), accountAgeDays: 1900, deviceFingerprints: ["dev-r01a"], historicalFraudCount: 0, profileType: "low_spender" },
  { userId: "RET-002", name: "Sarla Bhatt", monthlySalary: 20000, avgTransactionAmount: 300, avgMonthlySpend: 14000, avgWeeklyFrequency: 4, usualCities: ["Ahmedabad", "Surat"], usualUpiIds: ["bigbasket@razorpay", "apollo247@hdfcbank", "jiomart@sbi"], transactionHistory: generateHistory("RET-002", { amount: 300, cities: ["Ahmedabad", "Surat"], upiIds: ["bigbasket@razorpay", "apollo247@hdfcbank", "jiomart@sbi"] }, 12), accountAgeDays: 2100, deviceFingerprints: ["dev-r02a"], historicalFraudCount: 0, profileType: "low_spender" },
  { userId: "RET-003", name: "Krishnaswamy Iyengar", monthlySalary: 30000, avgTransactionAmount: 500, avgMonthlySpend: 20000, avgWeeklyFrequency: 6, usualCities: ["Chennai", "Madurai"], usualUpiIds: ["bigbasket@razorpay", "apollo247@hdfcbank", "electricity.tneb@paytm", "swiggy@paytm"], transactionHistory: generateHistory("RET-003", { amount: 500, cities: ["Chennai", "Madurai"], upiIds: ["bigbasket@razorpay", "apollo247@hdfcbank", "electricity.tneb@paytm", "swiggy@paytm"] }, 18), accountAgeDays: 2800, deviceFingerprints: ["dev-r03a"], historicalFraudCount: 0, profileType: "low_spender" },
  { userId: "RET-004", name: "Bhavana Desai", monthlySalary: 18000, avgTransactionAmount: 250, avgMonthlySpend: 12000, avgWeeklyFrequency: 5, usualCities: ["Pune", "Nashik"], usualUpiIds: ["bigbasket@razorpay", "jiomart@sbi", "apollo247@hdfcbank"], transactionHistory: generateHistory("RET-004", { amount: 250, cities: ["Pune", "Nashik"], upiIds: ["bigbasket@razorpay", "jiomart@sbi", "apollo247@hdfcbank"] }, 10), accountAgeDays: 1600, deviceFingerprints: ["dev-r04a"], historicalFraudCount: 0, profileType: "low_spender" },
  { userId: "RET-005", name: "Abdul Karim", monthlySalary: 22000, avgTransactionAmount: 350, avgMonthlySpend: 15000, avgWeeklyFrequency: 5, usualCities: ["Hyderabad", "Secunderabad"], usualUpiIds: ["bigbasket@razorpay", "electricity.tneb@paytm", "apollo247@hdfcbank"], transactionHistory: generateHistory("RET-005", { amount: 350, cities: ["Hyderabad", "Secunderabad"], upiIds: ["bigbasket@razorpay", "electricity.tneb@paytm", "apollo247@hdfcbank"] }, 14), accountAgeDays: 2400, deviceFingerprints: ["dev-r05a"], historicalFraudCount: 0, profileType: "low_spender" },
  { userId: "RET-006", name: "Usha Narayanan", monthlySalary: 28000, avgTransactionAmount: 450, avgMonthlySpend: 19000, avgWeeklyFrequency: 6, usualCities: ["Bangalore", "Mysore"], usualUpiIds: ["bigbasket@razorpay", "apollo247@hdfcbank", "electricity.tneb@paytm", "amazon@apl"], transactionHistory: generateHistory("RET-006", { amount: 450, cities: ["Bangalore", "Mysore"], upiIds: ["bigbasket@razorpay", "apollo247@hdfcbank", "electricity.tneb@paytm", "amazon@apl"] }, 16), accountAgeDays: 3100, deviceFingerprints: ["dev-r06a"], historicalFraudCount: 0, profileType: "low_spender" },

  // --- High-Risk / Fraud-Exposed Profiles (6) ---
  { userId: "HRK-001", name: "Ramesh Fraud", monthlySalary: 28000, avgTransactionAmount: 600, avgMonthlySpend: 20000, avgWeeklyFrequency: 20, usualCities: ["Delhi", "Agra", "Meerut"], usualUpiIds: ["swiggy@paytm", "bigbasket@razorpay", "zomato@ybl"], transactionHistory: generateHistory("HRK-001", { amount: 600, cities: ["Delhi", "Agra", "Meerut"], upiIds: ["swiggy@paytm", "bigbasket@razorpay", "zomato@ybl"] }, 50), accountAgeDays: 300, deviceFingerprints: ["dev-hrk1a"], historicalFraudCount: 3, profileType: "salaried" },
  { userId: "HRK-002", name: "Seema Dubey", monthlySalary: 22000, avgTransactionAmount: 400, avgMonthlySpend: 16000, avgWeeklyFrequency: 18, usualCities: ["Mumbai", "Thane", "Navi Mumbai"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "electricity.tneb@paytm"], transactionHistory: generateHistory("HRK-002", { amount: 400, cities: ["Mumbai", "Thane", "Navi Mumbai"], upiIds: ["swiggy@paytm", "zomato@ybl", "electricity.tneb@paytm"] }, 45), accountAgeDays: 180, deviceFingerprints: ["dev-hrk2a", "dev-hrk2b"], historicalFraudCount: 2, profileType: "salaried" },
  { userId: "HRK-003", name: "Dilip Chandra", monthlySalary: 35000, avgTransactionAmount: 800, avgMonthlySpend: 25000, avgWeeklyFrequency: 22, usualCities: ["Kolkata", "Howrah"], usualUpiIds: ["swiggy@paytm", "bigbasket@razorpay", "amazon@apl"], transactionHistory: generateHistory("HRK-003", { amount: 800, cities: ["Kolkata", "Howrah"], upiIds: ["swiggy@paytm", "bigbasket@razorpay", "amazon@apl"] }, 55), accountAgeDays: 420, deviceFingerprints: ["dev-hrk3a"], historicalFraudCount: 4, profileType: "salaried" },
  { userId: "HRK-004", name: "Tanu Mathur", monthlySalary: 18000, avgTransactionAmount: 350, avgMonthlySpend: 13000, avgWeeklyFrequency: 25, usualCities: ["Jaipur", "Ajmer", "Jodhpur"], usualUpiIds: ["swiggy@paytm", "zomato@ybl"], transactionHistory: generateHistory("HRK-004", { amount: 350, cities: ["Jaipur", "Ajmer", "Jodhpur"], upiIds: ["swiggy@paytm", "zomato@ybl"] }, 60), accountAgeDays: 90, deviceFingerprints: ["dev-hrk4a", "dev-hrk4b", "dev-hrk4c"], historicalFraudCount: 5, profileType: "student" },
  { userId: "HRK-005", name: "Atul Sharma", monthlySalary: 40000, avgTransactionAmount: 1100, avgMonthlySpend: 28000, avgWeeklyFrequency: 16, usualCities: ["Bhopal", "Indore", "Gwalior"], usualUpiIds: ["swiggy@paytm", "flipkart@axl", "bigbasket@razorpay"], transactionHistory: generateHistory("HRK-005", { amount: 1100, cities: ["Bhopal", "Indore", "Gwalior"], upiIds: ["swiggy@paytm", "flipkart@axl", "bigbasket@razorpay"] }, 48), accountAgeDays: 210, deviceFingerprints: ["dev-hrk5a"], historicalFraudCount: 2, profileType: "salaried" },
  { userId: "HRK-006", name: "Poonam Yadav", monthlySalary: 25000, avgTransactionAmount: 500, avgMonthlySpend: 17000, avgWeeklyFrequency: 19, usualCities: ["Lucknow", "Varanasi", "Allahabad"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl"], transactionHistory: generateHistory("HRK-006", { amount: 500, cities: ["Lucknow", "Varanasi", "Allahabad"], upiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl"] }, 52), accountAgeDays: 150, deviceFingerprints: ["dev-hrk6a"], historicalFraudCount: 3, profileType: "salaried" },

  // --- New Account Users (5) ---
  { userId: "NEW-001", name: "Aryan Kapoor", monthlySalary: 30000, avgTransactionAmount: 700, avgMonthlySpend: 22000, avgWeeklyFrequency: 12, usualCities: ["Mumbai", "Pune"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl"], transactionHistory: generateHistory("NEW-001", { amount: 700, cities: ["Mumbai", "Pune"], upiIds: ["swiggy@paytm", "zomato@ybl", "amazon@apl"] }, 8), accountAgeDays: 25, deviceFingerprints: ["dev-n01a"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "NEW-002", name: "Siya Rastogi", monthlySalary: 26000, avgTransactionAmount: 550, avgMonthlySpend: 18000, avgWeeklyFrequency: 10, usualCities: ["Delhi", "Noida"], usualUpiIds: ["swiggy@paytm", "myntra@ybl", "bigbasket@razorpay"], transactionHistory: generateHistory("NEW-002", { amount: 550, cities: ["Delhi", "Noida"], upiIds: ["swiggy@paytm", "myntra@ybl", "bigbasket@razorpay"] }, 6), accountAgeDays: 18, deviceFingerprints: ["dev-n02a"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "NEW-003", name: "Kunal Verma", monthlySalary: 50000, avgTransactionAmount: 1500, avgMonthlySpend: 35000, avgWeeklyFrequency: 8, usualCities: ["Hyderabad", "Bangalore"], usualUpiIds: ["amazon@apl", "flipkart@axl", "uber@icici"], transactionHistory: generateHistory("NEW-003", { amount: 1500, cities: ["Hyderabad", "Bangalore"], upiIds: ["amazon@apl", "flipkart@axl", "uber@icici"] }, 10), accountAgeDays: 30, deviceFingerprints: ["dev-n03a"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "NEW-004", name: "Prerna Singh", monthlySalary: 20000, avgTransactionAmount: 400, avgMonthlySpend: 14000, avgWeeklyFrequency: 14, usualCities: ["Chennai", "Coimbatore"], usualUpiIds: ["swiggy@paytm", "zomato@ybl", "jiomart@sbi"], transactionHistory: generateHistory("NEW-004", { amount: 400, cities: ["Chennai", "Coimbatore"], upiIds: ["swiggy@paytm", "zomato@ybl", "jiomart@sbi"] }, 7), accountAgeDays: 12, deviceFingerprints: ["dev-n04a"], historicalFraudCount: 0, profileType: "student" },
  { userId: "NEW-005", name: "Ritesh Jain", monthlySalary: 80000, avgTransactionAmount: 3000, avgMonthlySpend: 55000, avgWeeklyFrequency: 6, usualCities: ["Jaipur", "Delhi", "Mumbai"], usualUpiIds: ["amazon@apl", "flipkart@axl", "irctc@sbi", "bookmyshow@hdfcbank"], transactionHistory: generateHistory("NEW-005", { amount: 3000, cities: ["Jaipur", "Delhi", "Mumbai"], upiIds: ["amazon@apl", "flipkart@axl", "irctc@sbi", "bookmyshow@hdfcbank"] }, 10), accountAgeDays: 20, deviceFingerprints: ["dev-n05a"], historicalFraudCount: 0, profileType: "salaried" },

  // --- Travel-Heavy Users (4) ---
  { userId: "TRV-001", name: "Aakash Trivedi", monthlySalary: 120000, avgTransactionAmount: 5000, avgMonthlySpend: 90000, avgWeeklyFrequency: 12, usualCities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Goa", "Jaipur"], usualUpiIds: ["irctc@sbi", "uber@icici", "ola@paytm", "amazon@apl", "bookmyshow@hdfcbank"], transactionHistory: generateHistory("TRV-001", { amount: 5000, cities: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai", "Hyderabad", "Goa", "Jaipur"], upiIds: ["irctc@sbi", "uber@icici", "ola@paytm", "amazon@apl", "bookmyshow@hdfcbank"] }, 70), accountAgeDays: 2200, deviceFingerprints: ["dev-t01a", "dev-t01b"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "TRV-002", name: "Rhea Nambiar", monthlySalary: 95000, avgTransactionAmount: 4000, avgMonthlySpend: 72000, avgWeeklyFrequency: 10, usualCities: ["Kochi", "Bangalore", "Delhi", "Mumbai", "Goa", "Trivandrum", "Mangalore"], usualUpiIds: ["irctc@sbi", "uber@icici", "amazon@apl", "swiggy@paytm", "bookmyshow@hdfcbank"], transactionHistory: generateHistory("TRV-002", { amount: 4000, cities: ["Kochi", "Bangalore", "Delhi", "Mumbai", "Goa"], upiIds: ["irctc@sbi", "uber@icici", "amazon@apl", "swiggy@paytm", "bookmyshow@hdfcbank"] }, 65), accountAgeDays: 1850, deviceFingerprints: ["dev-t02a", "dev-t02b"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "TRV-003", name: "Mayank Srivastava", monthlySalary: 75000, avgTransactionAmount: 3500, avgMonthlySpend: 58000, avgWeeklyFrequency: 8, usualCities: ["Lucknow", "Delhi", "Agra", "Varanasi", "Mumbai", "Goa", "Jaipur"], usualUpiIds: ["irctc@sbi", "ola@paytm", "uber@icici", "amazon@apl", "flipkart@axl"], transactionHistory: generateHistory("TRV-003", { amount: 3500, cities: ["Lucknow", "Delhi", "Agra", "Varanasi", "Mumbai", "Goa"], upiIds: ["irctc@sbi", "ola@paytm", "uber@icici", "amazon@apl", "flipkart@axl"] }, 60), accountAgeDays: 1400, deviceFingerprints: ["dev-t03a"], historicalFraudCount: 0, profileType: "salaried" },
  { userId: "TRV-004", name: "Deepika Chatterjee", monthlySalary: 110000, avgTransactionAmount: 6000, avgMonthlySpend: 85000, avgWeeklyFrequency: 14, usualCities: ["Kolkata", "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Bhubaneswar"], usualUpiIds: ["irctc@sbi", "uber@icici", "amazon@apl", "flipkart@axl", "tataneu@icici", "bookmyshow@hdfcbank"], transactionHistory: generateHistory("TRV-004", { amount: 6000, cities: ["Kolkata", "Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai"], upiIds: ["irctc@sbi", "uber@icici", "amazon@apl", "flipkart@axl", "tataneu@icici"] }, 75), accountAgeDays: 2000, deviceFingerprints: ["dev-t04a", "dev-t04b"], historicalFraudCount: 0, profileType: "salaried" },
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

/**
 * Generate a dataset transaction with controlled anomaly probability.
 * ~35% anomaly rate when no injection provided, producing mixed SAFE/WARNING/HIGH_RISK.
 */
export function generateDatasetTransaction(
  injection?: SimulationInjection
): HistoricalTransaction & { _userRef: DatasetUser; _upiInfo: UpiIdInfo } {
  const user = userDataset[Math.floor(Math.random() * userDataset.length)];
  const hasInjection = injection && Object.values(injection).some(Boolean);
  txnCounter++;

  let amount: number;
  let city: string;
  let upiId: string;
  let paymentLink: string | undefined;
  let timestamp = new Date().toISOString();

  if (hasInjection) {
    // Manual injection from simulation controls
    amount = injection.highAmount
      ? Math.round(user.avgTransactionAmount * (5 + Math.random() * 3))
      : Math.round(user.avgTransactionAmount * (0.5 + Math.random() * 1));

    city = user.usualCities[Math.floor(Math.random() * user.usualCities.length)];

    if (injection.firstTimeBeneficiary || injection.newUpiId) {
      upiId = suspiciousUpiIds[Math.floor(Math.random() * suspiciousUpiIds.length)];
    } else {
      upiId = user.usualUpiIds[Math.floor(Math.random() * user.usualUpiIds.length)];
    }

    if (injection.paymentLink) {
      paymentLink = suspiciousPaymentLinks[Math.floor(Math.random() * suspiciousPaymentLinks.length)];
    }

    if (injection.nightTransaction) {
      const d = new Date();
      d.setUTCHours(21 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60));
      timestamp = d.toISOString();
    }
  } else {
    // Probabilistic anomaly generation — 35% chance
    const roll = Math.random();

    if (roll < 0.20) {
      // HIGH_RISK: multiple anomaly signals combined (~20%)
      const highRiskType = Math.random();

      if (highRiskType < 0.35) {
        // Extreme amount + suspicious UPI + new city
        amount = Math.round(user.avgTransactionAmount * (8 + Math.random() * 12));
        city = anomalousCities[Math.floor(Math.random() * anomalousCities.length)];
        upiId = suspiciousUpiIds[Math.floor(Math.random() * suspiciousUpiIds.length)];
        paymentLink = suspiciousPaymentLinks[Math.floor(Math.random() * suspiciousPaymentLinks.length)];
      } else if (highRiskType < 0.6) {
        // High amount + night + suspicious UPI
        amount = Math.round(user.avgTransactionAmount * (6 + Math.random() * 8));
        city = anomalousCities[Math.floor(Math.random() * anomalousCities.length)];
        upiId = suspiciousUpiIds[Math.floor(Math.random() * suspiciousUpiIds.length)];
        const d = new Date();
        d.setUTCHours(21 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60));
        timestamp = d.toISOString();
      } else {
        // Very high amount + new city + payment link
        amount = Math.round(user.avgTransactionAmount * (10 + Math.random() * 15));
        city = anomalousCities[Math.floor(Math.random() * anomalousCities.length)];
        upiId = suspiciousUpiIds[Math.floor(Math.random() * suspiciousUpiIds.length)];
        paymentLink = suspiciousPaymentLinks[Math.floor(Math.random() * suspiciousPaymentLinks.length)];
      }
    } else if (roll < 0.50) {
      // WARNING: single or double anomaly signals (~30%)
      const warnType = Math.random();

      if (warnType < 0.3) {
        // Moderate amount spike + suspicious UPI
        amount = Math.round(user.avgTransactionAmount * (3.5 + Math.random() * 3));
        city = user.usualCities[Math.floor(Math.random() * user.usualCities.length)];
        upiId = suspiciousUpiIds[Math.floor(Math.random() * suspiciousUpiIds.length)];
      } else if (warnType < 0.55) {
        // New city + moderate amount
        amount = Math.round(user.avgTransactionAmount * (2 + Math.random() * 2));
        city = anomalousCities[Math.floor(Math.random() * anomalousCities.length)];
        upiId = normalUpiIds[Math.floor(Math.random() * normalUpiIds.length)];
      } else if (warnType < 0.75) {
        // Payment link with moderate amount
        amount = Math.round(user.avgTransactionAmount * (2 + Math.random() * 3));
        city = user.usualCities[Math.floor(Math.random() * user.usualCities.length)];
        upiId = normalUpiIds[Math.floor(Math.random() * normalUpiIds.length)];
        paymentLink = suspiciousPaymentLinks[Math.floor(Math.random() * suspiciousPaymentLinks.length)];
      } else {
        // Night transaction + slightly elevated amount
        amount = Math.round(user.avgTransactionAmount * (2.5 + Math.random() * 2));
        city = user.usualCities[Math.floor(Math.random() * user.usualCities.length)];
        upiId = suspiciousUpiIds[Math.floor(Math.random() * suspiciousUpiIds.length)];
        const d = new Date();
        d.setUTCHours(21 + Math.floor(Math.random() * 3), Math.floor(Math.random() * 60));
        timestamp = d.toISOString();
      }
    } else {
      // SAFE: normal transaction (~50%)
      const variance = 0.3 + Math.random() * 1.4;
      amount = Math.round(user.avgTransactionAmount * variance * 100) / 100;
      city = user.usualCities[Math.floor(Math.random() * user.usualCities.length)];
      upiId = user.usualUpiIds[Math.floor(Math.random() * user.usualUpiIds.length)];
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
