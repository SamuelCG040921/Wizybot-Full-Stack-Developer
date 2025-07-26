import { convertCurrencies } from './convert-currencies';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('convertCurrencies', () => {
  it('should convert currencies correctly', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rates: {
          USD: 1.0,
          EUR: 0.9,
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        url: 'https://openexchangerates.org/api/latest.json?app_id=test_key',
      },
    });

    const result = await convertCurrencies(100, 'USD', 'EUR');

    expect(result).toEqual({
      result: 90.0,
      rate: 0.9,
    });
  });

  it('should throw error for unsupported currencies', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        rates: {
          USD: 1.0,
          EUR: 0.9,
        },
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        url: 'https://openexchangerates.org/api/latest.json?app_id=test_key',
      },
    });

    await expect(convertCurrencies(100, 'USD', 'XYZ')).rejects.toThrow(
      'Unsupported currency: USD or XYZ',
    );
  });
});
