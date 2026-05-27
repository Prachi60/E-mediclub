import { createSlice } from '@reduxjs/toolkit';

// Realistic dummy data representing premium healthcare catalogs
const initialMedicines = [
  {
    id: 'med-1',
    name: 'Revital H Capsule',
    category: 'Wellness',
    brand: 'Sun Pharmaceutical Industries Ltd',
    price: 310,
    discountPrice: 263,
    discountPercent: 15,
    rating: 4.6,
    reviewsCount: 342,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
    packSize: 'Bottle of 30 capsules',
    composition: 'Ginseng, 10 Vitamins, 9 Minerals & Amino Acids',
    benefits: 'Improves physical strength, mental alertness, boosts immunity, and fights fatigue.',
    warnings: 'Keep out of reach of children. Do not exceed the recommended daily dose.',
    dosage: 'One capsule daily with a glass of water after meals.',
    inStock: true
  },
  {
    id: 'med-2',
    name: 'Dolo 650 Tablet',
    category: 'Medicines',
    brand: 'Micro Labs Ltd',
    price: 34,
    discountPrice: 28,
    discountPercent: 18,
    rating: 4.8,
    reviewsCount: 1582,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    packSize: 'Strip of 15 tablets',
    composition: 'Paracetamol 650mg',
    benefits: 'Used to relieve pain and reduce fever. Highly prescribed for head, joint, and body aches.',
    warnings: 'Consuming more than 4g paracetamol daily can lead to severe liver damage or allergic reactions.',
    dosage: '1 tablet 3-4 times a day or as directed by a healthcare professional.',
    inStock: true
  },
  {
    id: 'med-3',
    name: 'Chyawanprash Awaleha',
    category: 'Ayurveda',
    brand: 'Dabur India Ltd',
    price: 495,
    discountPrice: 420,
    discountPercent: 15,
    rating: 4.7,
    reviewsCount: 890,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
    packSize: 'Tub of 1 kg',
    composition: 'Amla, Giloy, Ashwagandha, Pippali, Honey, and 40+ Herbs',
    benefits: 'Boosts respiratory wellness, strengthens overall immunity, and stimulates digestive system vigor.',
    warnings: 'Diabetic patients should consult a physician prior to intake.',
    dosage: '1-2 teaspoons twice a day with warm milk or water.',
    inStock: true
  },
  {
    id: 'med-4',
    name: 'Volini Pain Relief Spray',
    category: 'Medicines',
    brand: 'Sun Pharmaceutical Industries Ltd',
    price: 160,
    discountPrice: 136,
    discountPercent: 15,
    rating: 4.5,
    reviewsCount: 220,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=400&q=80',
    packSize: 'Can of 55 g',
    composition: 'Diclofenac Diethylamine, Methyl Salicylate, Menthol, and Linseed Oil',
    benefits: 'Instant relief from back pain, joint stiffness, neck strain, and athletic muscle pulls.',
    warnings: 'Do not spray on open cuts. Avoid contact with eyes.',
    dosage: 'Shake well. Spray from 5-8cm distance 3-4 times daily on affected muscles.',
    inStock: true
  },
  {
    id: 'med-5',
    name: 'Accu-Chek Active Test Strips',
    category: 'Health Devices',
    brand: 'Roche Diabetes Care',
    price: 975,
    discountPrice: 875,
    discountPercent: 10,
    rating: 4.6,
    reviewsCount: 710,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=400&q=80',
    packSize: 'Box of 50 strips',
    composition: 'Glucose Dehydrogenase biosensor technology',
    benefits: 'Enables quick, precise, and user-friendly monitoring of blood glucose levels from home.',
    warnings: 'Store in dry vial. Do not use expired strips.',
    dosage: 'Apply drop of blood to testing zone as illustrated on monitor manual.',
    inStock: true
  },
  {
    id: 'med-6',
    name: 'Celin 500 Vitamin C Tablet',
    category: 'Wellness',
    brand: 'Koye Pharmaceuticals Pvt Ltd',
    price: 45,
    discountPrice: 38,
    discountPercent: 15,
    rating: 4.8,
    reviewsCount: 2310,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a792747f14?auto=format&fit=crop&w=400&q=80',
    packSize: 'Strip of 15 tablets',
    composition: 'Ascorbic Acid (Vitamin C) 500mg',
    benefits: 'Supplements Vitamin C deficiency, heals tissues, enhances collagen, and protects body cells.',
    warnings: 'Avoid high dosages if prone to kidney stones.',
    dosage: '1 chewable tablet daily or as advised by your GP.',
    inStock: true
  },
  {
    id: 'med-7',
    name: 'Purifying Neem Face Wash',
    category: 'Wellness',
    brand: 'The Himalaya Drug Company',
    price: 198,
    discountPrice: 168,
    discountPercent: 15,
    rating: 4.4,
    reviewsCount: 450,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    packSize: 'Squeeze tube of 150 ml',
    composition: 'Neem Extract and Turmeric',
    benefits: 'Removes excessive oils, clears impurities, and naturally fights acne and skin infections.',
    warnings: 'For external use only. Discontinue if redness occurs.',
    dosage: 'Apply gently on wet skin. Foam up, rinse clean, and pat dry twice daily.',
    inStock: true
  },
  {
    id: 'med-8',
    name: 'Zandu Pancharishta Digestive Tonic',
    category: 'Ayurveda',
    brand: 'Emami Ltd',
    price: 240,
    discountPrice: 199,
    discountPercent: 17,
    rating: 4.5,
    reviewsCount: 390,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=400&q=80',
    packSize: 'Bottle of 450 ml',
    composition: 'Draksha, Kumari, Dashmoola, Ashwagandha, and Shatavari',
    benefits: 'Cures recurring indigestion, improves appetite, relieves flatulence, and strengthens digestion roots.',
    warnings: 'Shake bottle before use.',
    dosage: 'Mix 30ml with equal volume of water, take after meals twice daily.',
    inStock: true
  },
  {
    id: 'med-9',
    name: 'Becosules B-Complex Capsules',
    category: 'Wellness',
    brand: 'Pfizer Limited India',
    price: 52,
    discountPrice: 44,
    discountPercent: 15,
    rating: 4.8,
    reviewsCount: 3120,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
    packSize: 'Strip of 20 capsules',
    composition: 'Vitamin B-Complex (B1, B2, B3, B5, B6, B9, B12) & Vitamin C',
    benefits: 'Supplements nutritional losses, treats mouth ulcers, cures fatigue, and promotes healthy skin and hair.',
    warnings: 'Keep in dry dark storage. Discontinue if gastrointestinal distress occurs.',
    dosage: 'One capsule daily with water after breakfast.',
    inStock: true
  },
  {
    id: 'med-10',
    name: 'Crocin Pain Relief Extra',
    category: 'Medicines',
    brand: 'GSK Consumer Healthcare',
    price: 68,
    discountPrice: 58,
    discountPercent: 15,
    rating: 4.7,
    reviewsCount: 940,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    packSize: 'Strip of 15 tablets',
    composition: 'Paracetamol 650mg & Caffeine 50mg',
    benefits: 'Double action extra pain reliever for chronic migraines, tension headaches, and severe muscular aches.',
    warnings: 'Avoid coffee/tea intake during dosage. Not for cardiac patients without prescription.',
    dosage: '1 tablet 3 times a day or as recommended by clinical staff.',
    inStock: true
  },
  {
    id: 'med-11',
    name: 'Organic Ashvagandha Tablets',
    category: 'Ayurveda',
    brand: 'The Himalaya Drug Company',
    price: 185,
    discountPrice: 157,
    discountPercent: 15,
    rating: 4.6,
    reviewsCount: 760,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=400&q=80',
    packSize: 'Bottle of 60 tablets',
    composition: 'Pure Ashvagandha (Withania somnifera) root extract 250mg',
    benefits: 'Relieves stress and anxiety, boosts memory focus, improves physical stamina, and supports immune vigor.',
    warnings: 'Consult a Vaidya if pregnant or planning to conceive.',
    dosage: 'One tablet twice daily with warm milk or water.',
    inStock: true
  },
  {
    id: 'med-12',
    name: 'BP Monitor HEM-7120 Auto',
    category: 'Health Devices',
    brand: 'Omron Healthcare India',
    price: 2440,
    discountPrice: 1980,
    discountPercent: 18,
    rating: 4.7,
    reviewsCount: 1460,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=400&q=80',
    packSize: 'Box of 1 unit monitor',
    composition: 'Oscillometric digital blood pressure measurement tech',
    benefits: 'Comfortable, automated, and extremely precise blood pressure checks at home. Detects irregular heartbeats.',
    warnings: 'Ensure arm is steady and cuff is tied at level with heart during check.',
    dosage: 'Wear cuff above elbow crease, rest arm on table, and trigger Start button.',
    inStock: true
  },
  {
    id: 'med-13',
    name: 'Otrivin Oxy Fast Relief Spray',
    category: 'Medicines',
    brand: 'GlaxoSmithKline Healthcare',
    price: 112,
    discountPrice: 95,
    discountPercent: 15,
    rating: 4.5,
    reviewsCount: 680,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=400&q=80',
    packSize: 'Nasal spray of 10 ml',
    composition: 'Xylometazoline Hydrochloride 0.1%',
    benefits: 'Clears nose blocks, reduces nasal swelling, and opens airway congestion in under 25 seconds.',
    warnings: 'Do not use for more than 5 consecutive days to avoid rebound congestion.',
    dosage: '1 spray in each nostril up to 3 times a day.',
    inStock: true
  },
  {
    id: 'med-14',
    name: 'Dabur Honey 100% Pure',
    category: 'Wellness',
    brand: 'Dabur India Limited',
    price: 215,
    discountPrice: 182,
    discountPercent: 15,
    rating: 4.7,
    reviewsCount: 1250,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    packSize: 'Squeeze bottle of 400 g',
    composition: '100% pure multifloral forest honey',
    benefits: 'Rich in active antioxidants, supports daily weight management, treats throat tickles, and sweetens naturally.',
    warnings: 'Not safe for children under 1 year of age.',
    dosage: '1 tablespoon with warm lemon water every morning.',
    inStock: true
  },
  {
    id: 'med-15',
    name: 'Koflet Ayurvedic Cough Syrup',
    category: 'Ayurveda',
    brand: 'The Himalaya Drug Company',
    price: 120,
    discountPrice: 102,
    discountPercent: 15,
    rating: 4.6,
    reviewsCount: 520,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=400&q=80',
    packSize: 'Bottle of 100 ml',
    composition: 'Madhu (Honey), Tulasi, and Yashtimadhu',
    benefits: 'Soothes throat inflammation, loosens chest congestion, and treats both dry and productive bronchial cough.',
    warnings: 'Store in a cool dry cabinet away from direct sunlight.',
    dosage: '1-2 teaspoons three times daily after meals.',
    inStock: true
  },
  {
    id: 'med-16',
    name: 'OneTouch Verio Sugar Strips',
    category: 'Health Devices',
    brand: 'LifeScan Inc',
    price: 1145,
    discountPrice: 999,
    discountPercent: 12,
    rating: 4.6,
    reviewsCount: 880,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=400&q=80',
    packSize: 'Box of 50 test strips',
    composition: 'Verio biosensor electrochemical biosensing technology',
    benefits: 'Requires only 0.4µl of blood sample to deliver extremely accurate sugar metrics inside 5 seconds.',
    warnings: 'Close vial immediately after picking a strip. Do not refrigerate.',
    dosage: 'Insert strip in OneTouch Verio monitor, touch blood drop to edge of strip.',
    inStock: true
  },
  {
    id: 'med-17',
    name: 'Shelcal 500 Calcium Tablet',
    category: 'Wellness',
    brand: 'Torrent Pharmaceuticals Ltd',
    price: 130,
    discountPrice: 110,
    discountPercent: 15,
    rating: 4.8,
    reviewsCount: 1980,
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=400&q=80',
    packSize: 'Strip of 15 tablets',
    composition: 'Calcium 500mg & Vitamin D3 250 IU',
    benefits: 'Strengthens bones, supports joint health, and supplements daily calcium deficiency.',
    warnings: 'Consult a physician if you have a history of kidney stones.',
    dosage: 'One tablet daily after a major meal or as directed.',
    inStock: true
  },
  {
    id: 'med-18',
    name: 'Saridon Headache Relief',
    category: 'Medicines',
    brand: 'Bayer India Limited',
    price: 42,
    discountPrice: 35,
    discountPercent: 16,
    rating: 4.7,
    reviewsCount: 3120,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    packSize: 'Strip of 10 tablets',
    composition: 'Paracetamol 250mg, Propyphenazone 150mg & Caffeine 50mg',
    benefits: 'Triple action formula for fast relief from severe tension headaches and toothaches.',
    warnings: 'Do not consume more than 3 tablets daily. Keep out of reach of children.',
    dosage: '1 tablet on onset of pain. Repeat after 4 hours if necessary.',
    inStock: true
  },
  {
    id: 'med-19',
    name: 'Vicks Vaporub Cold Relief',
    category: 'Medicines',
    brand: 'Procter & Gamble India',
    price: 155,
    discountPrice: 131,
    discountPercent: 15,
    rating: 4.6,
    reviewsCount: 880,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=400&q=80',
    packSize: 'Jar of 50 g',
    composition: 'Menthol, Camphor, and Eucalyptus Oil',
    benefits: 'Provides 8 hours of multi-symptom relief from nasal block, chest cough, and muscle aches.',
    warnings: 'For external applications only. Do not swallow or apply inside nostrils.',
    dosage: 'Apply gently on chest, throat, and back up to 3 times daily.',
    inStock: true
  },
  {
    id: 'med-20',
    name: 'Himalaya Liv 52 DS Protect',
    category: 'Ayurveda',
    brand: 'The Himalaya Drug Company',
    price: 175,
    discountPrice: 148,
    discountPercent: 15,
    rating: 4.8,
    reviewsCount: 1420,
    image: 'https://images.unsplash.com/photo-1611070973770-b1a672610042?auto=format&fit=crop&w=400&q=80',
    packSize: 'Bottle of 60 tablets',
    composition: 'Himsra and Kasani natural clinical extracts',
    benefits: 'Double-strength hepatoprotective formula that detoxifies liver cells and stimulates overall appetite.',
    warnings: 'Store in dry place away from moisture.',
    dosage: '1-2 tablets twice daily after meals.',
    inStock: true
  },
  {
    id: 'med-21',
    name: 'Centrum Adult Multivitamin',
    category: 'Wellness',
    brand: 'GSK Consumer Healthcare',
    price: 450,
    discountPrice: 382,
    discountPercent: 15,
    rating: 4.7,
    reviewsCount: 520,
    image: 'https://images.unsplash.com/photo-1626645738196-c2a792747f14?auto=format&fit=crop&w=400&q=80',
    packSize: 'Bottle of 30 tablets',
    composition: '24 essential vitamins and mineral nutrients with Zinc',
    benefits: 'Complete daily nutritional backup that boosts cellular energy, muscle function, and ocular health.',
    warnings: 'Do not exceed the recommended daily allowance.',
    dosage: 'One tablet daily with water after breakfast.',
    inStock: true
  },
  {
    id: 'med-22',
    name: 'Accu-Chek Instant Monitor',
    category: 'Health Devices',
    brand: 'Roche Diabetes Care',
    price: 1599,
    discountPrice: 1299,
    discountPercent: 18,
    rating: 4.7,
    reviewsCount: 2130,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=400&q=80',
    packSize: 'Box of 1 unit monitor',
    composition: 'Instant bluetooth-enabled blood sugar biosensing tech',
    benefits: 'Provides effortless, highly accurate, and wireless glucose tracking inside 4 seconds.',
    warnings: 'Store blood glucose meter in the protective carry case provided.',
    dosage: 'Insert test strip, touch blood drop to the yellow edge.',
    inStock: true
  },
  {
    id: 'med-23',
    name: 'Pure Psyllium Isabgol Husk',
    category: 'Ayurveda',
    brand: 'Telephone Brand Isabgol',
    price: 220,
    discountPrice: 187,
    discountPercent: 15,
    rating: 4.5,
    reviewsCount: 640,
    image: 'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&w=400&q=80',
    packSize: 'Tub of 200 g',
    composition: '100% pure Psyllium (Plantago ovata) husk',
    benefits: 'Natural soluble dietary fiber that regulates bowel movements, relieves constipation, and supports gut wellness.',
    warnings: 'Always mix well with fluid before drinking to avoid throat blocking.',
    dosage: '1-2 tablespoons mixed with warm water or milk at bedtime.',
    inStock: true
  },
  {
    id: 'med-24',
    name: 'Dettol Liquid Antiseptic',
    category: 'Wellness',
    brand: 'Reckitt Benckiser India',
    price: 236,
    discountPrice: 198,
    discountPercent: 16,
    rating: 4.9,
    reviewsCount: 4320,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80',
    packSize: 'Bottle of 500 ml',
    composition: 'Chloroxylenol clinical antiseptic formula',
    benefits: 'Antiseptic first-aid liquid that sanitizes cuts, prevents wound infections, and disinfection for household hygiene.',
    warnings: 'For external use only. Keep away from eyes. Dilute strictly before skin contact.',
    dosage: 'Mix 1 tablespoon in 250ml water for clinical cleaning.',
    inStock: true
  }
];

const initialLabTests = [
  {
    id: 'lab-1',
    name: 'Comprehensive Gold Full Body Checkup',
    tag: 'Popular',
    parameters: '82 Parameters Checked',
    timeframe: 'Report in 12 Hrs',
    price: 2999,
    discountPrice: 1299,
    discountPercent: 57,
    homeCollection: true,
    fastingRequired: '10-12 hours fasting required',
    testsIncluded: 'Thyroid Profile, Complete Blood Count, Liver Function, Kidney Function, Lipid Profile (Cholesterol), Blood Sugar Fasting, Vitamin D, Vitamin B12'
  },
  {
    id: 'lab-2',
    name: 'Active Joint & Bone Health Package',
    tag: 'Senior Special',
    parameters: '12 Parameters Checked',
    timeframe: 'Report in 24 Hrs',
    price: 1800,
    discountPrice: 899,
    discountPercent: 50,
    homeCollection: true,
    fastingRequired: 'Fasting not strictly required',
    testsIncluded: 'Calcium, Vitamin D3, Rheumatoid Factor (RA), Uric Acid, Phosphorus, Alkaline Phosphatase'
  },
  {
    id: 'lab-3',
    name: 'Diabetes Screening Core Panel',
    tag: 'Top Booking',
    parameters: '4 Parameters Checked',
    timeframe: 'Report in 8 Hrs',
    price: 799,
    discountPrice: 399,
    discountPercent: 50,
    homeCollection: true,
    fastingRequired: '12 hours fasting mandatory',
    testsIncluded: 'HbA1c (Average Blood Sugar), Blood Sugar Fasting, Blood Sugar Post-Prandial, Urine Glucose'
  },
  {
    id: 'lab-4',
    name: 'Vitamin D & B12 Advanced Combo',
    tag: 'Fatique Relief',
    parameters: '2 Parameters Checked',
    timeframe: 'Report in 12 Hrs',
    price: 1400,
    discountPrice: 699,
    discountPercent: 50,
    homeCollection: true,
    fastingRequired: 'No fasting required',
    testsIncluded: 'Vitamin D (25-Hydroxy), Vitamin B12 (Active)'
  },
  {
    id: 'lab-5',
    name: 'Complete Thyroid Care Profile (T3, T4, TSH)',
    tag: 'Hormone Check',
    parameters: '3 Parameters Checked',
    timeframe: 'Report in 8 Hrs',
    price: 800,
    discountPrice: 449,
    discountPercent: 43,
    homeCollection: true,
    fastingRequired: 'Morning fasting sample recommended',
    testsIncluded: 'Total Triiodothyronine (T3), Total Thyroxine (T4), Thyroid Stimulating Hormone (TSH)'
  },
  {
    id: 'lab-6',
    name: 'Healthy Heart Advanced Core Profile',
    tag: 'Cardiac Special',
    parameters: '16 Parameters Checked',
    timeframe: 'Report in 12 Hrs',
    price: 2200,
    discountPrice: 1199,
    discountPercent: 45,
    homeCollection: true,
    fastingRequired: '12 hours fasting mandatory',
    testsIncluded: 'Lipid Profile (Cholesterol, HDL, LDL, VLDL, Triglycerides), Apolipoproteins A1 & B, High-Sensitivity CRP, Homocysteine'
  },
  {
    id: 'lab-7',
    name: 'Complete Allergy Screening (Food & Dust Panel)',
    tag: 'Specialized',
    parameters: '36 Parameters Checked',
    timeframe: 'Report in 48 Hrs',
    price: 3500,
    discountPrice: 1999,
    discountPercent: 42,
    homeCollection: true,
    fastingRequired: 'Fasting not required',
    testsIncluded: 'Food Allergens Panel, Inhalant (Dust, Pollen) Allergens Panel, Total IgE Antibodies'
  },
  {
    id: 'lab-8',
    name: 'Fever Profile (Malaria, Dengue, CBC)',
    tag: 'Acute Care',
    parameters: '18 Parameters Checked',
    timeframe: 'Report in 6 Hrs',
    price: 1500,
    discountPrice: 799,
    discountPercent: 46,
    homeCollection: true,
    fastingRequired: 'Fasting not required',
    testsIncluded: 'Typhidot IgM/IgG, Dengue NS1 Antigen, Malaria Smear, Complete Blood Count (CBC), ESR'
  },
  {
    id: 'lab-9',
    name: 'Kidney Function Advanced Panel (KFT)',
    tag: 'Organ Care',
    parameters: '8 Parameters Checked',
    timeframe: 'Report in 8 Hrs',
    price: 900,
    discountPrice: 449,
    discountPercent: 50,
    homeCollection: true,
    fastingRequired: '10 hours fasting recommended',
    testsIncluded: 'Urea, Creatinine, Uric Acid, Calcium, Phosphorus, Bun/Creatinine Ratio, Total Proteins'
  },
  {
    id: 'lab-10',
    name: 'Liver Function Advanced Profile (LFT)',
    tag: 'Organ Care',
    parameters: '11 Parameters Checked',
    timeframe: 'Report in 8 Hrs',
    price: 990,
    discountPrice: 499,
    discountPercent: 49,
    homeCollection: true,
    fastingRequired: '12 hours fasting mandatory',
    testsIncluded: 'Bilirubin Total/Direct/Indirect, SGOT (AST), SGPT (ALT), Alkaline Phosphatase, Albumin, Globulin'
  }
];

const initialDoctors = [
  {
    id: 'doc-1',
    name: 'Dr. Rajesh Sharma',
    specialty: 'Cardiologist',
    experience: '15 Years Experience',
    fee: 800,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&h=200&q=80',
    qualification: 'MD, DM (Cardiology) - AIIMS',
    languages: 'English, Hindi',
    availability: 'Available Today (4:00 PM - 7:00 PM)'
  },
  {
    id: 'doc-2',
    name: 'Dr. Sunita Rao',
    specialty: 'Pediatrician',
    experience: '12 Years Experience',
    fee: 600,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=200&h=200&q=80',
    qualification: 'MD (Pediatrics), DCH - Mumbai University',
    languages: 'English, Marathi, Hindi',
    availability: 'Available Tomorrow (10:00 AM - 1:00 PM)'
  },
  {
    id: 'doc-3',
    name: 'Dr. Amit Patel',
    specialty: 'Dermatologist',
    experience: '10 Years Experience',
    fee: 700,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&h=200&q=80',
    qualification: 'MD (Dermatology, Venereology) - JIPMER',
    languages: 'English, Gujarati, Hindi',
    availability: 'Available Today (6:00 PM - 8:00 PM)'
  },
  {
    id: 'doc-4',
    name: 'Dr. Priya Verma',
    specialty: 'Gynecologist',
    experience: '9 Years Experience',
    fee: 650,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&h=200&q=80',
    qualification: 'MS, DNB (Obstetrics & Gynecology)',
    languages: 'English, Punjabi, Hindi',
    availability: 'Available Today (11:00 AM - 2:00 PM)'
  },
  {
    id: 'doc-5',
    name: 'Dr. Sanjay Gupta',
    specialty: 'Dentist',
    experience: '14 Years Experience',
    fee: 500,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&h=200&q=80',
    qualification: 'BDS, MDS (Prosthodontics) - KGMU Lucknow',
    languages: 'English, Hindi',
    availability: 'Available Today (2:00 PM - 5:00 PM)'
  },
  {
    id: 'doc-6',
    name: 'Dr. Shalini Kapoor',
    specialty: 'Neurologist',
    experience: '16 Years Experience',
    fee: 950,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=200&h=200&q=80',
    qualification: 'DM (Neurology) - NIMHANS, MD General Medicine',
    languages: 'English, Hindi, Kannada',
    availability: 'Available Tomorrow (4:30 PM - 7:30 PM)'
  },
  {
    id: 'doc-7',
    name: 'Dr. Vikram Seth',
    specialty: 'Orthopedic',
    experience: '18 Years Experience',
    fee: 800,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&h=200&q=80',
    qualification: 'MS (Orthopedics), M.Ch (Ortho) - UK',
    languages: 'English, Hindi, Punjabi',
    availability: 'Available Today (5:00 PM - 8:00 PM)'
  },
  {
    id: 'doc-8',
    name: 'Dr. Anjali Mehta',
    specialty: 'Ophthalmologist',
    experience: '11 Years Experience',
    fee: 550,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&h=200&q=80',
    qualification: 'MS (Ophthalmology) - M&J Eye Institute',
    languages: 'English, Gujarati, Hindi',
    availability: 'Available Tomorrow (11:00 AM - 1:30 PM)'
  },
  {
    id: 'doc-9',
    name: 'Dr. Rohan Sen',
    specialty: 'Psychiatrist',
    experience: '13 Years Experience',
    fee: 900,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=200&h=200&q=80',
    qualification: 'MD (Psychiatry) - NIMHANS',
    languages: 'English, Bengali, Hindi',
    availability: 'Available Today (6:30 PM - 9:00 PM)'
  },
  {
    id: 'doc-10',
    name: 'Dr. Meera Nair',
    specialty: 'Endocrinologist',
    experience: '14 Years Experience',
    fee: 850,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&w=200&h=200&q=80',
    qualification: 'MD, DM (Endocrinology) - CMC Vellore',
    languages: 'English, Malayalam, Hindi',
    availability: 'Available Tomorrow (3:00 PM - 6:00 PM)'
  }
];

const storedOrders = localStorage.getItem('em_orders') 
  ? JSON.parse(localStorage.getItem('em_orders')) 
  : [
      {
        id: 'ORD-89472',
        date: '2026-05-20',
        items: [
          { name: 'Revital H Capsule', qty: 1, price: 263, type: 'medicine' },
          { name: 'Dolo 650 Tablet', qty: 2, price: 28, type: 'medicine' }
        ],
        total: 319,
        status: 'Delivered',
        deliveryAddress: 'Home (Mumbai)'
      }
    ];

const storedAppointments = localStorage.getItem('em_appointments')
  ? JSON.parse(localStorage.getItem('em_appointments'))
  : [
      {
        id: 'APT-10492',
        doctorName: 'Dr. Rajesh Sharma',
        specialty: 'Cardiologist',
        date: '2026-05-28',
        timeSlot: '05:30 PM - 06:00 PM',
        type: 'Online Consultation',
        status: 'Confirmed'
      }
    ];

const storedLabBookings = localStorage.getItem('em_lab_bookings')
  ? JSON.parse(localStorage.getItem('em_lab_bookings'))
  : [
      {
        id: 'LBB-29381',
        packageName: 'Diabetes Screening Core Panel',
        date: '2026-05-29',
        timeSlot: '08:00 AM - 10:00 AM',
        status: 'Scheduled',
        address: 'Home (Mumbai)'
      }
    ];

const initialState = {
  medicines: initialMedicines,
  labTests: initialLabTests,
  doctors: initialDoctors,
  orders: storedOrders,
  appointments: storedAppointments,
  labBookings: storedLabBookings,
  searchTerm: '',
  selectedCategory: 'All',
  selectedLocation: 'Mumbai, Maharashtra',
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedLocation: (state, action) => {
      state.selectedLocation = action.payload;
    },
    placeOrder: (state, action) => {
      state.orders.unshift(action.payload);
      localStorage.setItem('em_orders', JSON.stringify(state.orders));
    },
    bookDoctorAppointment: (state, action) => {
      state.appointments.unshift(action.payload);
      localStorage.setItem('em_appointments', JSON.stringify(state.appointments));
    },
    bookLabPackage: (state, action) => {
      state.labBookings.unshift(action.payload);
      localStorage.setItem('em_lab_bookings', JSON.stringify(state.labBookings));
    }
  }
});

export const {
  setSearchTerm,
  setSelectedCategory,
  setSelectedLocation,
  placeOrder,
  bookDoctorAppointment,
  bookLabPackage
} = productSlice.actions;

export default productSlice.reducer;
export { initialMedicines, initialLabTests, initialDoctors };
