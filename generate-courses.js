const fs = require('fs');
const path = require('path');

const curriculumDir = path.join(__dirname, 'curriculum');

const branches = {
  medicine: [
    'anatomy', 'physiology', 'pharmacology', 'pathology', 'immunology', 'genetics', 
    'neuroscience', 'epidemiology', 'surgery', 'anesthesiology', 'cardiology', 
    'dermatology', 'endocrinology', 'gastroenterology', 'hematology', 'infectious-diseases', 
    'nephrology', 'neurology', 'obstetrics-gynecology', 'oncology', 'ophthalmology', 
    'orthopedics', 'pediatrics', 'psychiatry', 'pulmonology', 'radiology', 'rheumatology', 
    'urology', 'public-health', 'dentistry', 'nursing', 'veterinary-medicine', 'physical-therapy'
  ],
  science: [
    'astronomy', 'geology', 'environmental-science', 'meteorology', 'oceanography', 
    'earth-science', 'astrophysics', 'biochemistry', 'biophysics', 'ecology', 
    'evolutionary-biology', 'microbiology', 'molecular-biology', 'zoology', 'botany', 
    'marine-biology', 'cognitive-science', 'statistics', 'applied-mathematics', 'materials-science'
  ],
  arts: [
    'art-history', 'fine-arts', 'music-theory', 'philosophy', 'literature', 'theater', 
    'creative-writing', 'cinematography', 'graphic-design', 'industrial-design', 
    'interior-design', 'fashion-design', 'photography', 'sculpture', 'ceramics', 
    'animation', 'game-design', 'dance', 'media-studies', 'cultural-studies'
  ],
  finance: [
    'corporate-finance', 'investment-banking', 'accounting', 'financial-markets', 
    'taxation', 'behavioral-finance', 'portfolio-management', 'financial-engineering', 
    'wealth-management', 'risk-management', 'actuarial-science', 'international-finance', 
    'real-estate-finance', 'quantitative-finance', 'audit', 'venture-capital', 
    'private-equity', 'derivatives', 'microeconomics', 'macroeconomics'
  ],
  engineering: [
    'mechanical', 'electrical', 'civil', 'aerospace', 'chemical', 'biomedical', 
    'industrial', 'robotics', 'software', 'computer', 'environmental', 'materials', 
    'nuclear', 'petroleum', 'agricultural', 'structural', 'systems', 'mining', 
    'marine', 'optical', 'geological', 'manufacturing'
  ],
  law: [
    'constitutional-law', 'criminal-law', 'contract-law', 'corporate-law', 
    'international-law', 'torts', 'property-law', 'intellectual-property', 
    'human-rights-law', 'environmental-law', 'tax-law', 'family-law', 'labor-law', 
    'immigration-law', 'health-law', 'sports-law', 'entertainment-law', 'cyber-law', 
    'maritime-law', 'space-law', 'legal-history', 'jurisprudence'
  ],
  languages: [
    'linguistics', 'spanish', 'french', 'mandarin', 'german', 'japanese', 'arabic', 
    'latin', 'ancient-greek', 'russian', 'italian', 'portuguese', 'korean', 'hindi', 
    'sanskrit', 'hebrew', 'swahili', 'dutch', 'swedish', 'turkish', 'vietnamese', 
    'american-sign-language', 'computational-linguistics', 'applied-linguistics', 
    'literature-in-translation'
  ],
  business: [
    'marketing', 'management', 'entrepreneurship', 'human-resources', 'supply-chain', 
    'international-business', 'business-ethics', 'strategic-management', 
    'organizational-behavior', 'operations-management', 'business-analytics', 
    'project-management', 'public-relations', 'sales', 'retail-management', 'e-commerce', 
    'hospitality-management', 'sports-management', 'nonprofit-management', 'leadership', 
    'negotiations'
  ]
};

const formatName = (slug) => {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};

let totalGenerated = 0;

for (const [branch, courses] of Object.entries(branches)) {
  const branchDir = path.join(curriculumDir, branch);
  
  if (!fs.existsSync(branchDir)) {
    fs.mkdirSync(branchDir, { recursive: true });
  }

  for (const courseSlug of courses) {
    const filePath = path.join(branchDir, `${courseSlug}.json`);
    const courseName = formatName(courseSlug);
    
    // Add branch to the name if it's generic in engineering, e.g. "Mechanical Engineering"
    const finalName = (branch === 'engineering' && !courseName.includes('Engineering')) 
      ? `${courseName} Engineering` 
      : courseName;
      
    const finalSlug = (branch === 'engineering' && !courseSlug.includes('engineering'))
      ? `${courseSlug}-engineering`
      : courseSlug;

    const data = {
      name: finalName,
      slug: finalSlug,
      description: `The study of ${finalName.toLowerCase()}.`,
      icon: "BookOpen", // A generic icon to be customized later
      color: "#2563EB", // A generic color
      levels: ["university"],
      topics: []
    };

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    totalGenerated++;
  }
}

console.log(`Successfully generated ${totalGenerated} course skeleton files across ${Object.keys(branches).length} branches.`);
