import axios from "axios";
import { ConvexError } from "convex/values";

const BASE_URL = "https://dataservice.accuweather.com";
const LOCATIONS_ENDPOINT = `${BASE_URL}/locations/v1/cities/search`;
const CURRENT_CONDITIONS_ENDPOINT = `${BASE_URL}/currentconditions/v1`;

const ACCUWEATHER_API_KEY = process.env.ACCUWEATHER_API_KEY;

export interface Region {
  ID: string;
  LocalizedName: string;
  EnglishName: string;
}

export interface Country {
  ID: string;
  LocalizedName: string;
  EnglishName: string;
}

export interface AdministrativeArea {
  ID: string;
  LocalizedName: string;
  EnglishName: string;
  Level: number;
  LocalizedType: string;
  EnglishType: string;
  CountryID: string;
}

export interface TimeZone {
  Code: string;
  Name: string;
  GmtOffset: number;
  IsDaylightSaving: boolean;
  NextOffsetChange: string | null;
}

export interface GeoPosition {
  Latitude: number;
  Longitude: number;
  Elevation: {
    Metric: {
      Value: number;
      Unit: string;
      UnitType: number;
    };
    Imperial: {
      Value: number;
      Unit: string;
      UnitType: number;
    };
  };
}

export interface SupplementalAdminArea {
  Level: number;
  LocalizedName: string;
  EnglishName: string;
}

export interface Location {
  Version: number;
  Key: string;
  Type: string;
  Rank: number;
  LocalizedName: string;
  EnglishName: string;
  PrimaryPostalCode: string;
  Region: Region;
  Country: Country;
  AdministrativeArea: AdministrativeArea;
  TimeZone: TimeZone;
  GeoPosition: GeoPosition;
  IsAlias: boolean;
  SupplementalAdminAreas: SupplementalAdminArea[];
  DataSets: string[];
}

export interface Forecast {
  LocalObservationDateTime: string;
  EpochTime: number;
  WeatherText: string;
  WeatherIcon: number;
  HasPrecipitation: boolean;
  PrecipitationType: string | null;
  IsDayTime: boolean;
  Temperature: {
    Metric: {
      Value: number;
      Unit: string;
      UnitType: number;
    };
    Imperial: {
      Value: number;
      Unit: string;
      UnitType: number;
    };
  };
  MobileLink: string;
  Link: string;
}

export async function getLocation(city: string): Promise<Location> {
  try {
    const response = await axios.get(LOCATIONS_ENDPOINT, {
      params: {
        apikey: ACCUWEATHER_API_KEY,
        q: city,
      },
    });
    const location: Location = response.data[0];
    return location;
  } catch (err) {
    console.error(err);
    throw new ConvexError({
      code: 500,
      message: `Failed to get location key for ${city}`,
    });
  }
}

export async function getCurrentCondition(
  locationKey: string
): Promise<Forecast> {
  try {
    const response = await axios.get(
      `${CURRENT_CONDITIONS_ENDPOINT}/${locationKey}`,
      {
        params: {
          apikey: ACCUWEATHER_API_KEY,
        },
      }
    );
    const forecast: Forecast = response.data[0];
    return forecast;
  } catch (err) {
    console.error(err);
    throw new ConvexError({
      code: 500,
      message: `Failed to get current condition for ${locationKey}`,
    });
  }
}
