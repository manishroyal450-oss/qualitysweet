import { MenuItem } from '../types';

export const SWEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/1c1cmm5F8TIEDsflLGUXDkUS5k9XjB80qZVDVdexGXl8/gviz/tq?tqx=out:csv';
export const RESTAURANT_CSV_URL = 'https://docs.google.com/spreadsheets/d/1Bd9xQ2BTnxARhGstlfxJIYzMJCmgZbGUV5CVFs8CL64/gviz/tq?tqx=out:csv';
export const SHEET_CSV_URL = RESTAURANT_CSV_URL; // Backwards compatibility
export const GITHUB_IMAGE_BASE_URL = 'https://raw.githubusercontent.com/manishroyal450-oss/qualitysweet/main/';

export function parseCSVRow(str: string): string[] {
  const arr: string[] = [];
  let quote = false;
  let col = '';
  for (let c = 0; c < str.length; c++) {
    const cc = str[c];
    const nc = str[c + 1];
    if (cc === '"') {
      if (quote && nc === '"') {
        col += '"';
        c++;
      } else {
        quote = !quote;
      }
    } else if (cc === ',' && !quote) {
      arr.push(col.trim());
      col = '';
    } else {
      col += cc;
    }
  }
  arr.push(col.trim());
  return arr;
}

export function getCategoryFallbackImage(_category: string, _name: string): string {
  return '';
}

export async function fetchSheetItems(csvUrl: string, itemType: 'sweet' | 'restaurant'): Promise<MenuItem[]> {
  try {
    const response = await fetch(csvUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet CSV from ${csvUrl}: ${response.statusText}`);
    }
    const dataText = await response.text();
    const lines = dataText.split(/\r?\n/);
    if (lines.length < 2) return [];

    const items: MenuItem[] = [];

    // Header inspection to dynamically locate column indices
    const headerRow = parseCSVRow(lines[0]).map(h => h.toLowerCase().trim().replace(/_/g, ' '));
    
    let nameIdx = headerRow.findIndex(h => h.includes('item name') || h.includes('product name') || h === 'product' || h === 'name' || h.includes('item_name'));
    let categoryIdx = headerRow.findIndex(h => h.includes('category'));
    let descIdx = headerRow.findIndex(h => h.includes('description') || h.includes('portion') || h.includes('brand') || h.includes('details') || h.includes('packaging'));
    let halfPriceIdx = headerRow.findIndex(h => h.includes('half') || h.includes('single price'));
    let fullPriceIdx = headerRow.findIndex(h => h.includes('full') || h.includes('double price'));
    let priceIdx = headerRow.findIndex(h => h.includes('price') || h.includes('rate') || h.includes('cost') || h.includes('mrp'));
    let imageIdx = headerRow.findIndex(h => h.includes('image_url') || h.includes('image url') || h.includes('image sq id') || h.includes('image') || h.includes('img'));

    // Fallbacks if header names differ
    if (nameIdx === -1) nameIdx = 1;
    if (categoryIdx === -1) categoryIdx = 0;
    if (descIdx === -1) descIdx = 2;
    if (priceIdx === -1) priceIdx = 4;
    if (imageIdx === -1) imageIdx = 5;

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const row = parseCSVRow(lines[i]);
      if (row.length < 2) continue;

      const category = (categoryIdx >= 0 && row[categoryIdx]) ? row[categoryIdx].replace(/"/g, '').trim() : (itemType === 'sweet' ? 'Sweets' : 'Restaurant');
      const productName = (nameIdx >= 0 && row[nameIdx]) ? row[nameIdx].replace(/"/g, '').trim() : '';
      
      if (!productName || productName.toLowerCase() === 'item name' || productName.toLowerCase() === 'product name') continue;

      const descRaw = (descIdx >= 0 && row[descIdx]) ? row[descIdx].replace(/"/g, '').trim() : '';
      const halfPriceRaw = (halfPriceIdx >= 0 && row[halfPriceIdx]) ? row[halfPriceIdx].replace(/"/g, '').trim() : '';
      const fullPriceRaw = (fullPriceIdx >= 0 && row[fullPriceIdx]) ? row[fullPriceIdx].replace(/"/g, '').trim() : '';
      const singlePriceRaw = (priceIdx >= 0 && row[priceIdx]) ? row[priceIdx].replace(/"/g, '').trim() : '';
      const imageName = (imageIdx >= 0 && row[imageIdx]) ? row[imageIdx].replace(/"/g, '').trim() : '';

      // Extract numeric prices
      const parseNum = (val: string) => {
        const cleaned = val.replace(/[^0-9.]/g, '');
        return cleaned ? parseFloat(cleaned) : 0;
      };

      const halfNum = parseNum(halfPriceRaw);
      const fullNum = parseNum(fullPriceRaw);
      const singleNum = parseNum(singlePriceRaw);

      let finalPrice = fullNum || halfNum || singleNum || 100;
      let extraDescParts: string[] = [];

      if (descRaw && descRaw !== '-' && descRaw !== 'Half / Full') {
        extraDescParts.push(descRaw);
      }

      if (halfNum > 0 && fullNum > 0) {
        extraDescParts.push(`Half: ₹${halfNum} | Full: ₹${fullNum}`);
      } else if (fullPriceRaw.toUpperCase().includes('AS PER MRP') || halfPriceRaw.toUpperCase().includes('AS PER MRP')) {
        extraDescParts.push('Price: As per MRP');
        finalPrice = singleNum || 40;
      }

      const finalDescription = extraDescParts.join(' • ') || 'Quality store special item';

      let imageUrl = '';

      if (imageName && imageName !== '-' && imageName !== ' ' && imageName !== '0' && imageName.toLowerCase() !== 'null' && imageName.toLowerCase() !== 'undefined') {
        if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
          imageUrl = imageName;
        } else {
          const cleanImageSqId = imageName.trim();
          const hasExtension = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleanImageSqId);
          const finalFilename = hasExtension ? cleanImageSqId : `${cleanImageSqId}.jpg`;
          imageUrl = `${GITHUB_IMAGE_BASE_URL}${finalFilename}`;
        }
      }

      items.push({
        id: `sheet-${itemType}-${i}-${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: productName,
        description: finalDescription,
        price: finalPrice,
        category: category || (itemType === 'sweet' ? 'Sweets' : 'General'),
        image: imageUrl,
        type: itemType,
        isVeg: true,
        rating: 4.8,
        popular: i <= 15
      });
    }

    return items;
  } catch (err) {
    console.error(`Error loading Google Sheet (${itemType}):`, err);
    return [];
  }
}

export async function fetchSweetsFromSheet(): Promise<MenuItem[]> {
  return fetchSheetItems(SWEETS_CSV_URL, 'sweet');
}

export async function fetchRestaurantFromSheet(): Promise<MenuItem[]> {
  return fetchSheetItems(RESTAURANT_CSV_URL, 'restaurant');
}

export async function fetchCatalogFromSheet(): Promise<MenuItem[]> {
  const [sweets, restaurant] = await Promise.all([
    fetchSweetsFromSheet(),
    fetchRestaurantFromSheet()
  ]);
  return [...sweets, ...restaurant];
}


