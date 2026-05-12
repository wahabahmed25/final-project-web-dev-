"use client";

import { useEffect, useState } from "react";
import type { NearbyPlace } from "@/types/place";

type NearbyPlacesSectionProps = {
  category: string;
};

type PlacesApiResponse = {
  places?: NearbyPlace[];
  source?: "hunter-location" | "user-location" | "disabled";
  error?: string;
  details?: string;
};

export default function NearbyPlacesSection({
  category,
}: NearbyPlacesSectionProps) {
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [source, setSource] = useState<"hunter-location" | "user-location">(
    "hunter-location"
  );
  const [loading, setLoading] = useState(true);
  const [usingLocation, setUsingLocation] = useState(false);
  const [error, setError] = useState("");
  const [locationMessage, setLocationMessage] = useState("");

  async function fetchPlaces(options?: { lat?: number; lng?: number }) {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams({
        category,
      });

      if (typeof options?.lat === "number" && typeof options?.lng === "number") {
        params.set("lat", String(options.lat));
        params.set("lng", String(options.lng));
      }

      const response = await fetch(`/api/places?${params.toString()}`);
      const data = (await response.json()) as PlacesApiResponse;

      if (!response.ok) {
        setError(data.details || data.error || "Could not load nearby places.");
        setPlaces([]);
        return;
      }

      setPlaces(data.places ?? []);

      if (data.source === "user-location") {
        setSource("user-location");
      } else {
        setSource("hunter-location");
      }
    } catch (err) {
      console.error(err);
      setError("Could not load nearby places.");
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  }

  function handleUseMyLocation() {
    setLocationMessage("");
    setError("");

    if (!navigator.geolocation) {
      setLocationMessage("Your browser does not support location access.");
      return;
    }

    setUsingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setLocationMessage("Showing places near your current location.");
        fetchPlaces({ lat, lng });
        setUsingLocation(false);
      },
      () => {
        setLocationMessage(
          "Location access was not allowed. Showing places near Hunter instead."
        );
        setUsingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 1000 * 60 * 5,
      }
    );
  }

  useEffect(() => {
    fetchPlaces();
  }, [category]);

  return (
    <section className="mt-14">
      <div className="flex flex-col justify-between gap-4 border-t border-slate-200 pt-10 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Nearby Places
          </p>

          <h2 className="mt-2 text-2xl font-bold text-slate-950">
            Places near Hunter
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            These results come from Google Places. Student recommendations above
            are still the main source, but this helps you discover real nearby
            options faster.
          </p>

          <p className="mt-2 text-xs font-medium text-slate-500">
            Currently showing:{" "}
            {source === "user-location"
              ? "places near your location"
              : "places near Hunter College"}
          </p>
        </div>

        <button
          onClick={handleUseMyLocation}
          disabled={usingLocation}
          className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
        >
          {usingLocation ? "Checking location..." : "Use My Location"}
        </button>
      </div>

      {locationMessage && (
        <div className="mt-5 rounded-2xl bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
          {locationMessage}
        </div>
      )}

      {loading && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Loading nearby places...
        </div>
      )}

      {!loading && error && (
        <div className="mt-6 rounded-2xl bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && places.length === 0 && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No nearby places found for this category.
        </div>
      )}

      {!loading && !error && places.length > 0 && (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <article
              key={place.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Google Place
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-slate-950">
                    {place.name}
                  </h3>
                </div>

                {place.rating !== null && (
                  <div className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
                    ⭐ {place.rating}
                  </div>
                )}
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                📍 {place.address}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {place.primaryType && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {place.primaryType.replaceAll("_", " ")}
                  </span>
                )}

                {place.userRatingCount !== null && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {place.userRatingCount} Google reviews
                  </span>
                )}
              </div>

              {place.googleMapsUri && (
                <a
                  href={place.googleMapsUri}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Open in Google Maps →
                </a>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}