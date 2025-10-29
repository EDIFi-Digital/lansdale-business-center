const fs = require('fs-extra');
const path = require('path');
const matter = require('front-matter');

/**
 * Build API endpoints from CMS content
 * This script processes markdown files and creates JSON API endpoints
 */

class APIBuilder {
  constructor() {
    this.contentDir = path.join(__dirname, '..', 'content', 'listings');
    this.apiDir = path.join(__dirname, '..', 'api');
    this.listings = [];
  }

  /**
   * Initialize the API builder
   */
  async init() {
    try {
      // Ensure API directory exists
      await fs.ensureDir(this.apiDir);
      
      // Process all markdown files
      await this.processMarkdownFiles();
      
      // Generate API endpoints
      await this.generateAPIEndpoints();
      
      console.log('API endpoints generated successfully!');
    } catch (error) {
      console.error('Failed to build API endpoints:', error);
    }
  }

  /**
   * Process all markdown files in the content directory
   */
  async processMarkdownFiles() {
    if (!await fs.pathExists(this.contentDir)) {
      console.log('Content directory not found, skipping API generation');
      return;
    }

    const files = await fs.readdir(this.contentDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    for (const file of markdownFiles) {
      const filePath = path.join(this.contentDir, file);
      const content = await fs.readFile(filePath, 'utf8');
      
      try {
        const parsed = matter(content);
        const slug = path.basename(file, '.md');
        
        const listing = {
          slug,
          ...parsed.attributes,
          overview: parsed.body.trim(),
          filename: file
        };

        this.listings.push(listing);
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }

    console.log(`Processed ${this.listings.length} listings`);
  }

  /**
   * Generate API endpoints
   */
  async generateAPIEndpoints() {
    // Generate main listings endpoint
    await this.generateListingsEndpoint();
    
    // Generate individual property endpoints
    await this.generateIndividualEndpoints();
    
    // Generate property data for the detail loader
    await this.generatePropertyDataFile();
  }

  /**
   * Generate main listings API endpoint
   */
  async generateListingsEndpoint() {
    const apiData = {
      listings: this.listings,
      total: this.listings.length,
      available: this.listings.filter(l => l.status === 'available'),
      leased: this.listings.filter(l => l.status === 'leased'),
      generated: new Date().toISOString()
    };

    await fs.writeFile(
      path.join(this.apiDir, 'listings.json'),
      JSON.stringify(apiData, null, 2)
    );

    console.log('Generated /api/listings.json');
  }

  /**
   * Generate individual property endpoints
   */
  async generateIndividualEndpoints() {
    for (const listing of this.listings) {
      const propertyData = {
        ...listing,
        related: this.listings
          .filter(l => l.slug !== listing.slug && l.status === 'available')
          .slice(0, 3)
      };

      await fs.writeFile(
        path.join(this.apiDir, `${listing.slug}.json`),
        JSON.stringify(propertyData, null, 2)
      );
    }

    console.log(`Generated ${this.listings.length} individual property endpoints`);
  }

  /**
   * Generate a JavaScript data file for the property detail loader
   */
  async generatePropertyDataFile() {
    const propertyData = {};
    
    this.listings.forEach(listing => {
      propertyData[listing.slug] = {
        slug: listing.slug,
        name: listing.name,
        price: listing.price,
        main_image: listing.main_image,
        thumb_image: listing.thumb_image,
        gallery_images: listing.gallery_images?.map(item => item.image) || [],
        overview: listing.overview,
        status: listing.status,
        date: listing.date
      };
    });

    const jsContent = `// Auto-generated property data from CMS
// Last updated: ${new Date().toISOString()}

window.PROPERTY_DATA = ${JSON.stringify(propertyData, null, 2)};
`;

    await fs.writeFile(
      path.join(__dirname, '..', 'js', 'property-data.js'),
      jsContent
    );

    console.log('Generated /js/property-data.js');
  }
}

// Run if called directly
if (require.main === module) {
  const builder = new APIBuilder();
  builder.init();
}

module.exports = APIBuilder;
