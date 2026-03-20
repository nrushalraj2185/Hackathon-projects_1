import { Router } from "express";

const router = Router();

const schemes = [
  {
    id: 1,
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "financial_assistance",
    description: "Direct income support of ₹6,000 per year to eligible farmer families, paid in three equal installments.",
    benefit: "₹6,000/year direct bank transfer (₹2,000 per installment, 3 times a year)",
    eligibility: ["Small and marginal farmer families", "Must own agricultural land", "Valid Aadhaar card required", "Active bank account required"],
    documents: ["Aadhaar card", "Land ownership documents", "Bank account passbook", "Mobile number linked to Aadhaar"],
    applicationProcess: "Register online at pmkisan.gov.in or visit nearest CSC (Common Service Centre) or Tehsil office",
    deadline: "Rolling enrollment - apply anytime",
    website: "https://pmkisan.gov.in",
    state: "All India",
    isActive: true
  },
  {
    id: 2,
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "insurance",
    description: "Comprehensive crop insurance scheme providing financial support to farmers suffering crop loss/damage due to unforeseen events.",
    benefit: "Crop insurance coverage for all stages of crop cycle. Premium as low as 1.5-5% for food crops.",
    eligibility: ["All farmers growing notified crops", "Both loanee and non-loanee farmers", "Sharecroppers and tenant farmers"],
    documents: ["Aadhaar card", "Land records (Khasra/Khatauni)", "Bank account details", "Sowing certificate from local authority"],
    applicationProcess: "Apply through nearest bank (for loanee farmers) or CSC/Agriculture Department office within cut-off dates",
    deadline: "Varies by crop season (Kharif: July 31, Rabi: December 31)",
    website: "https://pmfby.gov.in",
    state: "All India",
    isActive: true
  },
  {
    id: 3,
    name: "Kisan Credit Card (KCC)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "loan",
    description: "Short-term credit to farmers for cultivation expenses, post-harvest expenses, and maintenance of farm assets.",
    benefit: "Revolving credit up to ₹3 lakh at 4% interest p.a. (with interest subvention). No collateral up to ₹1.6 lakh.",
    eligibility: ["Farmers, fishermen, and animal husbandry farmers", "Minimum 1 acre agricultural land", "Good credit history"],
    documents: ["Land ownership/lease documents", "Aadhaar card", "Passport-size photos", "Recent bank statement"],
    applicationProcess: "Apply at any nationalized bank, cooperative bank, or regional rural bank. Fill KCC application form.",
    deadline: "No fixed deadline - apply anytime",
    website: "https://www.nabard.org",
    state: "All India",
    isActive: true
  },
  {
    id: 4,
    name: "Soil Health Card Scheme",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "advisory",
    description: "Free soil testing and personalized nutrient recommendations to improve soil health and reduce fertilizer costs.",
    benefit: "Free soil testing + Soil Health Card with crop-wise fertilizer recommendations",
    eligibility: ["All farmers with agricultural land", "No income limit"],
    documents: ["Aadhaar card", "Land details (village, survey number)"],
    applicationProcess: "Contact nearest Krishi Vigyan Kendra (KVK) or Agriculture Department office for soil sampling",
    deadline: "Ongoing scheme",
    website: "https://soilhealth.dac.gov.in",
    state: "All India",
    isActive: true
  },
  {
    id: 5,
    name: "National Agricultural Market (eNAM)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "market_access",
    description: "Pan-India electronic trading portal connecting APMC mandis for better price discovery and transparent trading.",
    benefit: "Access to pan-India buyers, better price discovery, online payment directly to bank account",
    eligibility: ["Any farmer with produce to sell", "Must have Aadhaar and bank account"],
    documents: ["Aadhaar card", "Bank account details", "Mobile number"],
    applicationProcess: "Register at enam.gov.in or at your nearest APMC/mandi",
    deadline: "Ongoing",
    website: "https://enam.gov.in",
    state: "All India",
    isActive: true
  },
  {
    id: 6,
    name: "Agriculture Infrastructure Fund (AIF)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    category: "loan",
    description: "Medium-long term debt financing for post-harvest management infrastructure like cold storage, warehouses, processing units.",
    benefit: "Loans up to ₹2 crore with 3% interest subvention. 2 years moratorium available.",
    eligibility: ["Individual farmers", "FPOs", "Agri-entrepreneurs", "Cooperatives"],
    documents: ["Business plan/project report", "Land documents", "Bank statements (3 years)", "PAN card", "Aadhaar"],
    applicationProcess: "Apply online at agriinfra.dac.gov.in or through NABARD/nationalized banks",
    deadline: "2025-2026 (extended)",
    website: "https://agriinfra.dac.gov.in",
    state: "All India",
    isActive: true
  },
  {
    id: 7,
    name: "PM Kusum Scheme (Solar Pump)",
    ministry: "Ministry of New and Renewable Energy",
    category: "subsidy",
    description: "Provide solar-powered irrigation pumps to farmers. 60% subsidy on solar pump installation.",
    benefit: "60% subsidy on solar pump (Central 30% + State 30%). Can also sell surplus power to DISCOM.",
    eligibility: ["Individual farmers with agricultural land", "Farmer Producer Organizations", "Cooperatives"],
    documents: ["Land ownership documents", "Aadhaar card", "Bank details", "Existing pump details (if replacing)"],
    applicationProcess: "Apply through State Nodal Agency (Renewable Energy Dept.) or DISCOM offices",
    deadline: "State-wise, check state renewable energy department",
    website: "https://mnre.gov.in",
    state: "All India",
    isActive: true
  },
];

router.get("/", (req, res) => {
  const { category, state } = req.query;
  let result = schemes;
  if (category) result = result.filter(s => s.category === category);
  if (state && state !== "All India") result = result.filter(s => s.state === state || s.state === "All India");
  res.json(result);
});

export default router;
