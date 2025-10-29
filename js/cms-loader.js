/**
 * CMS Content Loader
 * 
 * This script demonstrates how to load and render property listings
 * from the CMS-generated markdown files.
 * 
 * Note: This is a client-side example. For production, consider:
 * - Build-time processing with a static site generator
 * - Server-side API to serve processed content
 * - CDN caching for better performance
 */

class PropertyListingsLoader {
  constructor() {
    this.listings = [];
    this.baseUrl = window.location.origin;
  }

  /**
   * Load all property listings from the CMS
   */
  async loadListings() {
    try {
      // In a real implementation, you'd need an API endpoint or build process
      // that serves the processed markdown files as JSON
      // For now, this is a placeholder showing the expected data structure
      
      const response = await fetch('/api/listings.json'); // You'll need to implement this
      this.listings = await response.json();
      
      return this.listings;
    } catch (error) {
      console.error('Failed to load listings:', error);
      return [];
    }
  }

  /**
   * Get available listings
   */
  getAvailableListings() {
    return this.listings.filter(listing => listing.status === 'available');
  }

  /**
   * Get leased listings
   */
  getLeasedListings() {
    return this.listings.filter(listing => listing.status === 'leased');
  }

  /**
   * Render a property card
   */
  renderPropertyCard(listing, isLeased = false) {
    const cardClass = isLeased ? 'property-card leased' : 'property-card';
    const imageClass = isLeased ? 'cover-image spaces-leased' : 'cover-image on-spaces-page';
    
    return `
      <div id="listing-${listing.slug}" role="listitem" class="w-dyn-item ${isLeased ? 'for-leased-space' : ''}">
        <a data-w-id="${this.generateId()}" href="property-${listing.slug}.html" class="${cardClass} w-inline-block">
          <div class="property-card-top ${isLeased ? 'leased' : ''}">
            <img src="${listing.thumb_image}" loading="lazy" alt="${listing.name}" class="${imageClass}">
          </div>
          <div class="property-card-bottom">
            <div class="property-card-data">
              <div class="text-block-4">${listing.name}</div>
              <div class="body-small">${listing.price}</div>
            </div>
          </div>
        </a>
      </div>
    `;
  }

  /**
   * Render all available listings
   */
  renderAvailableListings(containerId = 'available-listings-container') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found`);
      return;
    }

    const availableListings = this.getAvailableListings();
    
    if (availableListings.length === 0) {
      container.innerHTML = '<div class="empty-state w-dyn-empty"><div>No available properties found.</div></div>';
      return;
    }

    const listingsHTML = availableListings
      .map(listing => this.renderPropertyCard(listing, false))
      .join('');

    container.innerHTML = `
      <div role="list" class="property-bottom w-dyn-items">
        ${listingsHTML}
      </div>
    `;
  }

  /**
   * Render leased listings
   */
  renderLeasedListings(containerId = 'leased-listings-container') {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`Container with ID ${containerId} not found`);
      return;
    }

    const leasedListings = this.getLeasedListings().slice(0, 3); // Limit to 3
    
    if (leasedListings.length === 0) {
      container.innerHTML = '<div class="empty-state w-dyn-empty"><div>No leased properties found.</div></div>';
      return;
    }

    const listingsHTML = leasedListings
      .map(listing => this.renderPropertyCard(listing, true))
      .join('');

    container.innerHTML = `
      <div role="list" class="property-bottom leased w-dyn-items">
        ${listingsHTML}
      </div>
    `;
  }

  /**
   * Generate a unique ID for animations
   */
  generateId() {
    return 'd83722f2-7e64-a9b7-9133-' + Math.random().toString(36).substr(2, 12);
  }

  /**
   * Initialize the loader and render all content
   */
  async init() {
    try {
      await this.loadListings();
      this.renderAvailableListings();
      this.renderLeasedListings();
      
      console.log(`Loaded ${this.listings.length} property listings`);
    } catch (error) {
      console.error('Failed to initialize property listings:', error);
    }
  }
}

// Example usage:
// const loader = new PropertyListingsLoader();
// loader.init();

// For immediate use without API, you can manually provide data:
/*
const exampleListings = [
  {
    slug: 'platform',
    name: 'Platform',
    price: '$775',
    thumb_image: '/images/Barn-Door-Slider-1-2025-p-500.jpg',
    main_image: '/images/Barn-Door-Slider-1-2025-p-1080.jpg',
    status: 'available',
    overview: 'Spacious platform area perfect for creative work and storage.'
  },
  {
    slug: 'pb-a-ground-level-shop-studio',
    name: 'PB-A Ground Level Shop Studio',
    price: '$1,335/mo',
    thumb_image: '/images/All-smiles---almost-p-500.jpg',
    main_image: '/images/All-smiles---almost-p-1080.jpg',
    status: 'available',
    overview: 'Ground level shop studio with excellent natural light.'
  }
];

const loader = new PropertyListingsLoader();
loader.listings = exampleListings;
loader.renderAvailableListings();
*/
