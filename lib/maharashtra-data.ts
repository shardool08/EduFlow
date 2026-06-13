// Maharashtra administrative data used across registration and profile screens.

export const maharashtraDistricts = [
  "Ahmednagar", "Akola", "Amravati", "Chhatrapati Sambhajinagar",
  "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli",
  "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur",
  "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar",
  "Nashik", "Dharashiv", "Palghar", "Parbhani", "Pune", "Raigad",
  "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane",
  "Wardha", "Washim", "Yavatmal",
] as const;

export const zillaParishads = [
  "Ahmednagar ZP", "Akola ZP", "Amravati ZP", "Chhatrapati Sambhajinagar ZP",
  "Beed ZP", "Bhandara ZP", "Buldhana ZP", "Chandrapur ZP", "Dhule ZP",
  "Gadchiroli ZP", "Gondia ZP", "Hingoli ZP", "Jalgaon ZP", "Jalna ZP",
  "Kolhapur ZP", "Latur ZP", "Nagpur ZP", "Nanded ZP", "Nandurbar ZP",
  "Nashik ZP", "Dharashiv ZP", "Palghar ZP", "Parbhani ZP", "Pune ZP",
  "Raigad ZP", "Ratnagiri ZP", "Sangli ZP", "Satara ZP", "Sindhudurg ZP",
  "Solapur ZP", "Thane ZP", "Wardha ZP", "Washim ZP", "Yavatmal ZP",
] as const;

export const municipalCorporations = [
  "Brihanmumbai MC (BMC)", "Pune MC (PMC)", "Pimpri-Chinchwad MC (PCMC)",
  "Nashik MC", "Nagpur MC", "Chhatrapati Sambhajinagar MC",
  "Solapur MC", "Kolhapur MC", "Amravati MC", "Nanded-Waghala MC",
  "Sangli-Miraj-Kupwad MC", "Malegaon MC", "Akola MC", "Latur MC",
  "Dhule MC", "Jalgaon MC", "Chandrapur MC",
  "Kalyan-Dombivli MC", "Thane MC", "Navi Mumbai MC",
  "Ulhasnagar MC", "Vasai-Virar MC", "Bhiwandi-Nizampur MC",
  "Mira-Bhayander MC",
] as const;

export const administrationTypes = [
  { value: "zp", label: "Zilla Parishad (ZP)" },
  { value: "corp", label: "Municipal Corporation" },
  { value: "council", label: "Municipal Council" },
  { value: "cantonment", label: "Cantonment" },
  { value: "private_aided", label: "Private (Aided)" },
  { value: "private_unaided", label: "Private (Unaided)" },
] as const;

export const mediums = [
  { value: "marathi", label: "Marathi / मराठी" },
  { value: "hindi", label: "Hindi / हिंदी" },
  { value: "english", label: "English" },
  { value: "urdu", label: "Urdu / اردو" },
  { value: "gujarati", label: "Gujarati / ગુજરાતી" },
  { value: "kannada", label: "Kannada / ಕನ್ನಡ" },
  { value: "sindhi", label: "Sindhi / سنڌي" },
  { value: "telugu", label: "Telugu / తెలుగు" },
  { value: "tamil", label: "Tamil / தமிழ்" },
  { value: "bengali", label: "Bengali / বাংলা" },
  { value: "semi_english", label: "Semi-English" },
] as const;

export const schoolTypes = [
  { value: "zp", label: "Zilla Parishad" },
  { value: "municipal", label: "Municipal" },
  { value: "ashram", label: "Govt. Ashram" },
  { value: "private_aided", label: "Private Aided" },
  { value: "private_unaided", label: "Private Unaided" },
] as const;

export const locationTypes = [
  { value: "urban", label: "Urban" },
  { value: "semi_urban", label: "Semi-urban" },
  { value: "rural", label: "Rural" },
] as const;

export const seatingTypes = [
  { value: "rows", label: "Rows" },
  { value: "horseshoe", label: "U-Shape" },
  { value: "groups", label: "Groups" },
  { value: "floor", label: "Floor" },
] as const;

export const classroomSizes = [
  { value: "small", label: "Small (<30)" },
  { value: "medium", label: "Medium (30–50)" },
  { value: "large", label: "Large (>50)" },
] as const;

export const socioEconomicLevels = [
  { value: "bpl", label: "Mostly BPL" },
  { value: "bpl_lower", label: "BPL + Lower-middle" },
  { value: "lower_middle", label: "Lower-middle" },
  { value: "mixed", label: "Mixed" },
  { value: "middle", label: "Middle class" },
] as const;

export const firstGenLearners = [
  { value: "almost_all", label: "Almost all (>75%)" },
  { value: "majority", label: "Majority (50–75%)" },
  { value: "some", label: "Some (25–50%)" },
  { value: "few", label: "Few (<25%)" },
] as const;

export const parentalInvolvement = [
  { value: "very_active", label: "Very active" },
  { value: "moderate", label: "Moderate" },
  { value: "low", label: "Low" },
  { value: "very_low", label: "Very low" },
] as const;

export const internetAccess = [
  { value: "always", label: "Always" },
  { value: "sometimes", label: "Sometimes" },
  { value: "rarely", label: "Rarely" },
  { value: "none", label: "Not available" },
] as const;

export const printingAccess = [
  { value: "school", label: "School printer" },
  { value: "nearby_1km", label: "Nearby (<1 km)" },
  { value: "nearby_5km", label: "Nearby (1–5 km)" },
  { value: "none", label: "No printing" },
] as const;
