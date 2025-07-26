import * as fs from 'fs';
import * as path from 'path';
import * as csv from 'csv-parser';
import { Product } from '../types/product.interface';

/**
 * Searches relevant products from the CSV based on a text query.
 * Matches against title and description.
 * @param query - User input (e.g. "phone", "gift for dad")
 * @returns Top 2 matching products
 */
export async function searchProducts(query: string): Promise<Product[]> {
  const results: Product[] = [];
  const lowerQuery = query.toLowerCase();

  const filePath = path.join(__dirname, '..', '..', '..', 'data', 'products_list.csv');

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const title = row.displayTitle?.toLowerCase() || '';
        const description = row.embeddingText?.toLowerCase() || '';

        if (title.includes(lowerQuery) || description.includes(lowerQuery)) {
          results.push({
            title: row.displayTitle,
            description: row.embeddingText,
            price: row.price,
            url: row.url,
            imageUrl: row.imageUrl,
            category: row.productType,
          });
        }
      })
      .on('end', () => {
        resolve(results.slice(0, 2));
      })
      .on('error', reject);
  });
}
