import axios from 'axios';

/**
 * Converts an amount between currencies using Open Exchange Rates API.
 * @param amount Amount to convert
 * @param fromCurrency Currency code to convert from (e.g., 'EUR')
 * @param toCurrency Currency code to convert to (e.g., 'CAD')
 * @returns Converted value and rate info
 */
export async function convertCurrencies(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
): Promise<{ result: number; rate: number }> {
  const appId = process.env.OPEN_EXCHANGE_APP_ID;
  const url = `https://openexchangerates.org/api/latest.json?app_id=${appId}`;

  const response = await axios.get(url);
  const data = response.data as { rates: Record<string, number> };
  const rates = data.rates;

  const fromRate = rates[fromCurrency.toUpperCase()];
  const toRate = rates[toCurrency.toUpperCase()];

  if (!fromRate || !toRate) {
    throw new Error(`Unsupported currency: ${fromCurrency} or ${toCurrency}`);
  }

  const rate = toRate / fromRate;
  const result = amount * rate;

  return {
    result: parseFloat(result.toFixed(2)),
    rate: parseFloat(rate.toFixed(4)),
  };
}
