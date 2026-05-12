import { NextRequest, NextResponse } from "next/server";
import type { NearbyPlace } from "@/types/place";

export const dynamic = "force-dynamic";

const HUNTER_LOCATION = {
  latitude: 40.7685,
  longitude: -73.9647,
};

const DEFAULT_RADIUS_METERS = 1200;

type CategoryConfig = {
  query: string;
  enabled: boolean;
};

const categoryToConfig: Record<string, CategoryConfig> = {
  "study-spots": {
    query: "libraries cafes quiet study spots near Hunter College NYC",
    enabled: true,
  },
  food: {
    query: "affordable restaurants lunch near Hunter College NYC",
    enabled: true,
  },
  coffee: {
    query: "coffee shops near Hunter College NYC",
    enabled: true,
  },
  bookstores: {
    query: "bookstores near Hunter College NYC",
    enabled: true,
  },
  "school-resources": {
    query: "Hunter College student resources offices NYC",
    enabled: true,
  },
};

function parseCoordinate(value: string | null): number | null {
  if (!value) return null;

  const parsed = Number(value);

  if (Number.isNaN(parsed)) return null;

  return parsed;
}

function normalizePlace(place: any): NearbyPlace {
  return {
    id: String(place.id ?? ""),
    name: String(place.displayName?.text ?? "Unnamed place"),
    address: String(place.formattedAddress ?? "Address unavailable"),
    rating:
      typeof place.rating === "number"
        ? place.rating
        : null,
    userRatingCount:
      typeof place.userRatingCount === "number"
        ? place.userRatingCount
        : null,
    googleMapsUri:
      typeof place.googleMapsUri === "string"
        ? place.googleMapsUri
        : null,
    primaryType:
      typeof place.primaryType === "string"
        ? place.primaryType
        : null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Missing GOOGLE_PLACES_API_KEY. Add it to your .env.local file.",
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category") ?? "food";
    const userLatitude = parseCoordinate(searchParams.get("lat"));
    const userLongitude = parseCoordinate(searchParams.get("lng"));

    const config =
      categoryToConfig[category] ??
      ({
        query: "places near Hunter College NYC",
        enabled: true,
      } satisfies CategoryConfig);

    if (!config.enabled) {
      return NextResponse.json({
        places: [],
        source: "disabled",
      });
    }

    const latitude = userLatitude ?? HUNTER_LOCATION.latitude;
    const longitude = userLongitude ?? HUNTER_LOCATION.longitude;

    const response = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.primaryType",
        },
        body: JSON.stringify({
          textQuery: config.query,
          maxResultCount: 8,
          locationBias: {
            circle: {
              center: {
                latitude,
                longitude,
              },
              radius: DEFAULT_RADIUS_METERS,
            },
          },
        }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Google Places API error:", data);

      return NextResponse.json(
        {
          error: "Failed to fetch nearby places.",
          details: data?.error?.message ?? "Unknown Google Places error.",
        },
        { status: response.status }
      );
    }

    const places = Array.isArray(data.places)
      ? data.places.map(normalizePlace).filter((place: NearbyPlace) => place.id)
      : [];

    return NextResponse.json({
      places,
      source:
        userLatitude !== null && userLongitude !== null
          ? "user-location"
          : "hunter-location",
      center: {
        latitude,
        longitude,
      },
    });
  } catch (error) {
    console.error("Places route error:", error);

    return NextResponse.json(
      {
        error: "Unexpected server error while loading nearby places.",
      },
      { status: 500 }
    );
  }
}