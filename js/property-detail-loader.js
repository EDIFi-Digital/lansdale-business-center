/**
 * Property Detail Page Loader
 * 
 * This script loads property data dynamically for the detail_properties.html page
 * based on the property slug passed in the URL query parameter.
 */

class PropertyDetailLoader {
  constructor() {
    this.currentProperty = null;
    this.baseUrl = window.location.origin;
    this.init();
  }

  /**
   * Initialize the loader
   */
  init() {
    const propertySlug = this.getPropertySlugFromURL();
    if (propertySlug) {
      this.loadPropertyDetails(propertySlug);
    } else {
      this.showError('No property specified');
    }
  }

  /**
   * Get property slug from URL query parameter
   */
  getPropertySlugFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('property');
  }

  /**
   * Load property details from the CMS data
   * In a real implementation, this would fetch from an API or processed markdown files
   */
  async loadPropertyDetails(slug) {
    try {
      // For now, we'll use the generated content data
      // In production, you'd fetch this from an API endpoint
      const property = await this.fetchPropertyData(slug);
      
      if (property) {
        this.currentProperty = property;
        this.renderPropertyDetails();
      } else {
        this.showError('Property not found');
      }
    } catch (error) {
      console.error('Failed to load property details:', error);
      this.showError('Failed to load property details');
    }
  }

  /**
   * Fetch property data - loads from generated property data
   */
  async fetchPropertyData(slug) {
    // Try to use the generated property data first
    if (window.PROPERTY_DATA && window.PROPERTY_DATA[slug]) {
      return window.PROPERTY_DATA[slug];
    }

    // Fallback to API endpoint if available
    try {
      const response = await fetch(`/api/${slug}.json`);
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.log('API endpoint not available, using fallback data');
    }

    // Final fallback to hardcoded data for development
    const fallbackProperties = {
      'platform': {
        slug: 'platform',
        name: 'Platform',
        price: '$775',
        main_image: '/images/Barn-Door-Slider-1-2025-p-1080.jpg',
        thumb_image: '/images/Barn-Door-Slider-1-2025-p-500.jpg',
        gallery_images: [
          '/images/Barn-Door-Slider-1-2025-p-1080.jpg',
          '/images/Barn-Door-Slider-1-2025-p-800.jpg',
          '/images/Barn-Door-Slider-1-2025-p-1600.jpg'
        ],
        overview: 'Spacious platform area perfect for creative work and storage. This flexible space offers excellent possibilities for various business needs and can be customized to fit your specific requirements.',
        status: 'available'
      },
      'pb-a-ground-level-shop-studio': {
        slug: 'pb-a-ground-level-shop-studio',
        name: 'PB-A Ground Level Shop Studio',
        price: '$1,335/mo',
        main_image: '/images/All-smiles---almost-p-1080.jpg',
        thumb_image: '/images/All-smiles---almost-p-500.jpg',
        gallery_images: [
          '/images/All-smiles---almost-p-1080.jpg',
          '/images/All-smiles---almost-p-800.jpg',
          '/images/All-smiles---almost-p-1600.jpg'
        ],
        overview: 'Ground level shop studio with excellent natural light and accessibility. Perfect for retail, creative work, or professional services with direct street access.',
        status: 'available'
      },
      '112-first-floor-office': {
        slug: '112-first-floor-office',
        name: '(#112) First Floor Office',
        price: '$485',
        main_image: '/images/023-p-1080.jpg',
        thumb_image: '/images/023-p-500.jpg',
        gallery_images: [
          '/images/023-p-1080.jpg',
          '/images/023-p-800.jpg',
          '/images/023-p-1600.jpg'
        ],
        overview: 'Professional first floor office space ideal for small businesses. This well-appointed office provides a professional environment for meetings and daily operations.',
        status: 'available'
      }
    };

    return fallbackProperties[slug] || null;
  }

  /**
   * Render property details on the page
   */
  renderPropertyDetails() {
    if (!this.currentProperty) return;

    const property = this.currentProperty;

    // Update page title
    this.updatePageTitle(property.name);
    
    // Update main content
    this.updateMainImage(property.main_image, property.name);
    this.updateOverview(property.overview);
    this.updatePrice(property.price);
    this.updateGallery(property.gallery_images);
    
    // Update meta tags for SEO
    this.updateMetaTags(property);
  }

  /**
   * Update page title
   */
  updatePageTitle(name) {
    // Update the h1 title
    const titleElement = document.querySelector('.page-title h1');
    if (titleElement) {
      titleElement.textContent = name;
      titleElement.classList.remove('w-dyn-bind-empty');
    }

    // Update document title
    document.title = `${name} - Lansdale Business Center`;
  }

  /**
   * Update main image
   */
  updateMainImage(imageSrc, altText) {
    const imageElement = document.querySelector('.information-image img');
    if (imageElement) {
      imageElement.src = imageSrc;
      imageElement.alt = altText;
      imageElement.classList.remove('w-dyn-bind-empty');
    }
  }

  /**
   * Update overview content
   */
  updateOverview(overview) {
    const overviewElement = document.querySelector('.overview-data .w-dyn-bind-empty');
    if (overviewElement) {
      overviewElement.innerHTML = `<p>${overview}</p>`;
      overviewElement.classList.remove('w-dyn-bind-empty');
    }
  }

  /**
   * Update price
   */
  updatePrice(price) {
    const priceElement = document.querySelector('.price-text');
    if (priceElement) {
      priceElement.textContent = price;
      priceElement.classList.remove('w-dyn-bind-empty');
    }
  }

  /**
   * Update gallery
   */
  updateGallery(galleryImages) {
    const galleryContainer = document.querySelector('.gallery-images-copy');
    if (!galleryContainer || !galleryImages.length) return;

    // Clear existing content
    galleryContainer.innerHTML = '';

    // Create gallery items
    galleryImages.forEach((imageSrc, index) => {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-inner w-dyn-item';
      galleryItem.setAttribute('role', 'listitem');
      
      galleryItem.innerHTML = `
        <a href="${imageSrc}" class="gallery-image w-inline-block w-lightbox">
          <img src="${imageSrc}" loading="lazy" alt="${this.currentProperty.name} - Gallery Image ${index + 1}" class="cover-image">
          <script type="application/json" class="w-json">{
            "items": [{"url": "${imageSrc}", "originalUrl": "${imageSrc}"}],
            "group": "Gallery"
          }</script>
        </a>
      `;
      
      galleryContainer.appendChild(galleryItem);
    });

    // Hide empty state
    const emptyState = document.querySelector('.gallery-wrap-copy .empty-state');
    if (emptyState) {
      emptyState.style.display = 'none';
    }
  }

  /**
   * Update meta tags for SEO
   */
  updateMetaTags(property) {
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = `${property.name} - ${property.overview.substring(0, 150)}...`;
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.content = `${property.name} - Lansdale Business Center`;
    }

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.content = property.overview;
    }

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) {
      ogImage.content = `${window.location.origin}${property.main_image}`;
    }
  }

  /**
   * Show error message
   */
  showError(message) {
    const titleElement = document.querySelector('.page-title h1');
    if (titleElement) {
      titleElement.textContent = 'Property Not Found';
    }

    const overviewElement = document.querySelector('.overview-data .w-dyn-bind-empty');
    if (overviewElement) {
      overviewElement.innerHTML = `<p>${message}</p>`;
      overviewElement.classList.remove('w-dyn-bind-empty');
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  new PropertyDetailLoader();
});

// Also export for manual initialization if needed
window.PropertyDetailLoader = PropertyDetailLoader;
