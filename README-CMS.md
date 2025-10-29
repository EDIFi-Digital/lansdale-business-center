# Lansdale Business Center - Decap CMS Setup

This project integrates Decap CMS (formerly Netlify CMS) with a static site exported from Webflow to enable dynamic content management for property listings.

## 🏗️ Project Structure

```
├── admin/                    # Decap CMS admin interface
│   ├── index.html           # CMS admin page
│   └── config.yml           # CMS configuration
├── api/                     # Generated JSON API endpoints
│   ├── listings.json        # All listings data
│   └── {slug}.json         # Individual property data
├── content/listings/        # Markdown files for property listings
├── data/                    # CSV data for seeding content
│   └── export.csv          # Property data export
├── images/uploads/          # CMS uploaded images
├── js/                      # JavaScript files
│   ├── cms-loader.js       # Loads CMS content into pages
│   ├── property-data.js    # Generated property data
│   └── property-detail-loader.js # Loads individual property details
├── scripts/                 # Build scripts
│   ├── seed-content.js     # CSV to markdown converter
│   └── build-api.js        # Generates API endpoints from content
├── templates/              # HTML templates
│   └── listing-template.html # Property listing templates
├── detail_properties.html  # Dynamic property detail page
├── spaces.html             # Property listings page
└── package.json            # Dependencies and scripts
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Seed Initial Content

```bash
npm run seed
```

This will:
- Read data from `/data/export.csv`
- Generate markdown files in `/content/listings/`
- Create up to 6 property listings

### 3. Set up Netlify Identity

1. Deploy your site to Netlify
2. Go to Site Settings > Identity
3. Enable Identity
4. Set registration preferences (invite only recommended)
5. Enable Git Gateway in Identity settings

### 4. Access the CMS

1. Go to `https://yoursite.netlify.app/admin/`
2. Sign up/log in with Netlify Identity
3. Manage your property listings

## 📊 CSV Data Format

Your `/data/export.csv` should have these columns:

```csv
Name,Price,Overview,Main Image,Thumb Image,Gallery Images
Platform,$775,Spacious platform area...,/images/main.jpg,/images/thumb.jpg,"/images/gallery1.jpg,/images/gallery2.jpg"
```

**Column Details:**
- **Name**: Property name (used for slug generation)
- **Price**: Rental price (e.g., "$775", "$1,335/mo")
- **Overview**: Property description (supports markdown)
- **Main Image**: Primary image path
- **Thumb Image**: Thumbnail image path  
- **Gallery Images**: Comma-separated list of gallery image paths

## 🎨 Template Integration

The CMS generates markdown files with frontmatter. You'll need to integrate these into your build process:

### Option 1: Build-time Integration
Use a static site generator (Eleventy, Hugo, etc.) to process the markdown files during build.

### Option 2: Client-side Integration
Load and parse the markdown files with JavaScript at runtime.

### Option 3: API Integration
Create an API endpoint that serves the processed listing data.

## 📝 CMS Fields

Each property listing has these fields:

- **Name** (string): Property name
- **Price** (string): Rental price
- **Overview** (markdown): Property description
- **Main Image** (image): Primary property image
- **Thumbnail Image** (image): Card thumbnail
- **Gallery Images** (list): Additional property photos
- **Status** (select): "available" or "leased"
- **Date Created** (datetime): Auto-generated timestamp

## 🔧 Build Process

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

The build script:
1. Runs `seed-content.js` to process CSV updates
2. Runs `build-api.js` to generate JSON API endpoints
3. Creates `/js/property-data.js` for client-side access

### Individual Scripts
```bash
npm run seed        # Process CSV and generate markdown
npm run build-api   # Generate API endpoints from markdown
```

## 📁 File Management

### Images
- Upload images through the CMS to `/images/uploads/`
- Existing images in `/images/` can be referenced directly
- Use relative paths (e.g., `/images/uploads/photo.jpg`)

### Content Limits
- Maximum 6 property listings (configurable in seed script)
- Listings beyond 6 will be ignored during seeding

## 🎯 Customization

### Dynamic Detail Page
The `detail_properties.html` page automatically loads property data based on URL parameters:

- **URL Format**: `detail_properties.html?property={slug}`
- **Data Loading**: Uses generated `/js/property-data.js` or `/api/{slug}.json`
- **Fallback**: Hardcoded data for development

**Example URLs**:
- `detail_properties.html?property=platform`
- `detail_properties.html?property=pb-a-ground-level-shop-studio`

### Property Cards
Property cards in `spaces.html` automatically link to the detail page:
```html
<a href="detail_properties.html?property=platform">Platform</a>
```

### Adding Fields
1. Update `/admin/config.yml` collections section
2. Modify `/scripts/seed-content.js` to handle new fields
3. Update your templates to display new fields

### Changing Collection Name
1. Update `name` and `label` in `config.yml`
2. Update folder path in `config.yml`
3. Update references in build scripts

### Styling
Property cards inherit existing Webflow classes:
- `.property-card`
- `.property-card-top`
- `.property-card-bottom`
- `.cover-image`
- `.text-block-4`
- `.body-small`

## 🚨 Important Notes

1. **Git Gateway**: Requires Netlify Identity and Git Gateway to be enabled
2. **Branch**: CMS commits to the `main` branch by default
3. **Images**: Use the CMS image widget for new uploads
4. **Markdown**: Overview field supports full markdown syntax
5. **Slugs**: Generated automatically from property names

## 🔍 Troubleshooting

### CMS Won't Load
- Check Netlify Identity is enabled
- Verify Git Gateway is configured
- Ensure you're accessing `/admin/` not `/admin/index.html`

### Images Not Showing
- Verify image paths are correct (start with `/`)
- Check images exist in the specified location
- Ensure proper permissions for uploads folder

### Content Not Updating
- Check if changes are committed to Git
- Verify build process is running
- Check console for JavaScript errors

## 📞 Support

For issues with:
- **Decap CMS**: [Decap CMS Documentation](https://decapcms.org/docs/)
- **Netlify Identity**: [Netlify Identity Docs](https://docs.netlify.com/visitor-access/identity/)
- **This Setup**: Contact the development team

---

Built with ❤️ by EDIFi Digital
