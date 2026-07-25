import { MenuItem } from '../types';

export const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/1c1cmm5F8TIEDsflLGUXDkUS5k9XjB80qZVDVdexGXl8/gviz/tq?tqx=out:csv';
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

export async function fetchCatalogFromSheet(): Promise<MenuItem[]> {
  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet CSV: ${response.statusText}`);
    }
    const dataText = await response.text();
    const lines = dataText.split(/\r?\n/);
    const items: MenuItem[] = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;

      const row = parseCSVRow(lines[i]);
      if (row.length < 2) continue;

      const category = row[0] ? row[0].replace(/"/g, '').trim() : 'General';
      const productName = row[1] ? row[1].replace(/"/g, '').trim() : '';
      const brandDetails = row[2] ? row[2].replace(/"/g, '').trim() : '';
      const packaging = row[3] ? row[3].replace(/"/g, '').trim() : '';
      const rawPrice = row[4] ? row[4].replace(/"/g, '').trim() : '';
      const imageName = row[5] ? row[5].replace(/"/g, '').trim() : '';

      if (!productName) continue;

      const numPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 150;
      let imageUrl = 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=500&auto=format&fit=crop&q=60';

      if (imageName) {
        if (imageName.startsWith('http://') || imageName.startsWith('https://')) {
          imageUrl = imageName;
        } else {
          const cleanImageSqId = imageName.trim();
          const hasExtension = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(cleanImageSqId);
          const finalFilename = hasExtension ? cleanImageSqId : `${cleanImageSqId}.jpg`;
          imageUrl = `${GITHUB_IMAGE_BASE_URL}${finalFilename}`;
        }
      }

      const isRestaurantType = 
        category.toLowerCase().includes('restaurant') ||
        category.toLowerCase().includes('fast food') ||
        category.toLowerCase().includes('snack');

      items.push({
        id: `sheet-${i}-${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
        name: productName,
        description: [brandDetails, packaging].filter(Boolean).join(' • ') || 'Quality store item',
        price: numPrice,
        category: category || 'Catalog',
        image: imageUrl,
        type: isRestaurantType ? 'restaurant' : 'sweet',
        isVeg: true,
        rating: 4.8,
        popular: i <= 10
      });
    }

    return items;
  } catch (err) {
    console.error('Error loading Google Sheet catalog:', err);
    return [];
  }
}
