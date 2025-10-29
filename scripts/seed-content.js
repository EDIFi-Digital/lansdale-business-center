const fs = require('fs-extra');
const path = require('path');
const csv = require('csv-parser');

// Ensure content/listings directory exists
const contentDir = path.join(__dirname, '..', 'content', 'listings');
fs.ensureDirSync(contentDir);

// Function to slugify a string
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

// Function to create markdown content
function createMarkdownContent(row) {
  const galleryImages = row['Gallery Images'] 
    ? row['Gallery Images'].split(',').map(img => `  - image: "${img.trim()}"`).join('\n')
    : '';

  return `---
name: "${row.Name}"
price: "${row.Price}"
main_image: "${row['Main Image']}"
thumb_image: "${row['Thumb Image']}"
gallery_images:
${galleryImages}
status: "available"
date: "${new Date().toISOString()}"
---

${row.Overview || ''}
`;
}

// Read CSV and generate markdown files
function seedContent() {
  const csvPath = path.join(__dirname, '..', 'data', 'export.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.log('CSV file not found at:', csvPath);
    console.log('Creating example CSV file...');
    
    // Create example CSV if it doesn't exist
    const exampleCSV = `Name,Price,Overview,Main Image,Thumb Image,Gallery Images
Platform,$775,Spacious platform area perfect for creative work and storage,/images/Barn-Door-Slider-1-2025-p-1080.jpg,/images/Barn-Door-Slider-1-2025-p-500.jpg,"/images/Barn-Door-Slider-1-2025-p-1080.jpg,/images/Barn-Door-Slider-1-2025-p-800.jpg"
PB-A Ground Level Shop Studio,$1335/mo,Ground level shop studio with excellent natural light and accessibility,/images/All-smiles---almost-p-1080.jpg,/images/All-smiles---almost-p-500.jpg,"/images/All-smiles---almost-p-1080.jpg,/images/All-smiles---almost-p-800.jpg"
"(#112) First Floor Office",$485,Professional first floor office space ideal for small businesses,/images/023-p-1080.jpg,/images/023-p-500.jpg,"/images/023-p-1080.jpg,/images/023-p-800.jpg"`;
    
    fs.writeFileSync(csvPath, exampleCSV);
    console.log('Example CSV created. Please update with your actual data.');
  }

  // Clear existing content
  fs.emptyDirSync(contentDir);
  
  const results = [];
  
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      console.log(`Processing ${results.length} listings...`);
      
      results.forEach((row, index) => {
        if (index >= 6) {
          console.log(`Skipping listing ${index + 1} (only processing first 6)`);
          return;
        }
        
        const slug = slugify(row.Name);
        const filename = `${slug}.md`;
        const filePath = path.join(contentDir, filename);
        const content = createMarkdownContent(row);
        
        fs.writeFileSync(filePath, content);
        console.log(`Created: ${filename}`);
      });
      
      console.log('Content seeding completed!');
    });
}

// Run the script
seedContent();
