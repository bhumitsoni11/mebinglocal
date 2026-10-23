import { Injectable, Logger } from '@nestjs/common';

export interface GeoCountry {
  name: string;
  iso2: string;
  lat: number;
  long: number;
}

export interface GeoState {
  name: string;
  state_code: string;
}

@Injectable()
export class GeoService {
  private readonly logger = new Logger(GeoService.name);
  private countriesCache: GeoCountry[] | null = null;
  private statesCache: Map<string, GeoState[]> = new Map();
  private citiesCache: Map<string, string[]> = new Map();

  /**
   * Dynamically fetch all global countries with coordinates from public Geo API
   */
  async getCountries(): Promise<GeoCountry[]> {
    if (this.countriesCache) {
      return this.countriesCache;
    }

    try {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/positions');
      const json: any = await res.json();
      if (json && Array.isArray(json.data)) {
        this.countriesCache = json.data.map((c: any) => ({
          name: c.name,
          iso2: c.iso2,
          lat: c.lat,
          long: c.long,
        }));
        return this.countriesCache;
      }
    } catch (err: any) {
      this.logger.warn(`Failed to fetch countries from live API: ${err.message}`);
    }

    return [];
  }

  /**
   * Dynamically fetch all states/provinces for any country worldwide
   */
  async getStatesByCountry(country: string): Promise<GeoState[]> {
    const key = country.toLowerCase().trim();
    if (this.statesCache.has(key)) {
      return this.statesCache.get(key)!;
    }

    try {
      const res = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country }),
      });
      const json: any = await res.json();
      if (json && json.data && Array.isArray(json.data.states)) {
        const states: GeoState[] = json.data.states.map((s: any) => ({
          name: s.name,
          state_code: s.state_code,
        }));
        this.statesCache.set(key, states);
        return states;
      }
    } catch (err: any) {
      this.logger.warn(`Failed to fetch states for ${country}: ${err.message}`);
    }

    return [];
  }

  /**
   * Dynamically fetch all cities for a specific country and state/province
   */
  async getCitiesByState(country: string, state?: string): Promise<string[]> {
    const key = `${country.toLowerCase()}_${state?.toLowerCase() || 'all'}`;
    if (this.citiesCache.has(key)) {
      return this.citiesCache.get(key)!;
    }

    try {
      if (state) {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country, state }),
        });
        const json: any = await res.json();
        if (json && Array.isArray(json.data)) {
          this.citiesCache.set(key, json.data);
          return json.data;
        }
      } else {
        const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ country }),
        });
        const json: any = await res.json();
        if (json && Array.isArray(json.data)) {
          this.citiesCache.set(key, json.data);
          return json.data;
        }
      }
    } catch (err: any) {
      this.logger.warn(`Failed to fetch cities for ${country} / ${state}: ${err.message}`);
    }

    return [];
  }

  /**
   * Dynamic search across countries, states, and cities worldwide
   */
  async searchLocations(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return [];

    const countries = await this.getCountries();
    const matchedCountries = countries.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 10);

    return {
      countries: matchedCountries,
    };
  }
}
