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

      const params = new URLSearchParams({ category });

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
      setSource(data.source === "user-location" ? "user-location" : "hunter-location");
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
        setLocationMessage("Showing places near your current location.");
        fetchPlaces({ lat: position.coords.latitude, lng: position.coords.longitude });
        setUsingLocation(false);
      },
      () => {
        setLocationMessage("Location access was not allowed. Showing places near Hunter instead.");
        setUsingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 1000 * 60 * 5 }
    );
  }

  useEffect(() => {
    fetchPlaces();
  }, [category]);

  return (
    <section className="mt-14">
      {/* Section header */}
      <div
        className="flex flex-col justify-between gap-4 border-t pt-10 md:flex-row md:items-end"
        style={{ borderColor: "var(--border)" }}
      >
        <div>
          <p
            className="text-sm font-bold uppercase tracking-widest"
            style={{ color: "var(--purple)" }}
          >
            Nearby Places
          </p>

          <h2
            className="mt-2 text-2xl font-extrabold"
            style={{ color: "var(--fg-primary)" }}
          >
            Places near Hunter
          </h2>

          <p
            className="mt-2 max-w-2xl text-sm leading-6"
            style={{ color: "var(--fg-secondary)" }}
          >
            These results come from Google Places. Student recommendations above
            are still the main source, but this helps you discover real nearby
            options faster.
          </p>

          <p className="mt-2 text-xs font-medium" style={{ color: "var(--fg-muted)" }}>
            Currently showing:{" "}
            {source === "user-location"
              ? "places near your location"
              : "places near Hunter College"}
          </p>
        </div>

        <button
          onClick={handleUseMyLocation}
          disabled={usingLocation}
          className="btn-outline shrink-0"
        >
          {usingLocation ? "Checking location..." : "Use My Location"}
        </button>
      </div>

      {locationMessage && (
        <div
          className="sticky-note note-lavender mt-5 px-4 py-3 text-sm font-medium"
          style={{ color: "var(--fg-secondary)" }}
        >
          {locationMessage}
        </div>
      )}

      {loading && (
        <div
          className="sticky-note note-yellow mt-6 p-6 text-sm"
          style={{ color: "var(--fg-secondary)" }}
        >
          Loading nearby places...
        </div>
      )}

      {!loading && error && (
        <div
          className="sticky-note note-pink mt-6 p-6 text-sm"
          style={{ color: "var(--fg-primary)" }}
        >
          {error}
        </div>
      )}

      {!loading && !error && places.length === 0 && (
        <div
          className="sticky-note note-lavender mt-6 p-6 text-sm"
          style={{ color: "var(--fg-secondary)" }}
        >
          No nearby places found for this category.
        </div>
      )}

      {!loading && !error && places.length > 0 && (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {places.map((place) => (
            <article key={place.id} className="sticky-note p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: "var(--purple)" }}
                  >
                    Google Place
                  </p>
                  <h3
                    className="mt-1 text-base font-bold"
                    style={{ color: "var(--fg-primary)" }}
                  >
                    {place.name}
                  </h3>
                </div>

                {place.rating !== null && (
                  <div
                    className="shrink-0 rounded-full px-3 py-1 text-sm font-bold"
                    style={{
                      background: "var(--note-yellow)",
                      color: "var(--fg-primary)",
                    }}
                  >
                    ⭐ {place.rating}
                  </div>
                )}
              </div>

              <p
                className="mt-3 text-sm leading-6"
                style={{ color: "var(--fg-secondary)" }}
              >
                📍 {place.address}
              </p>

              <div className="mt-3 flex flex-wrap gap-2">
                {place.primaryType && (
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      background: "var(--purple-light)",
                      color: "var(--purple)",
                    }}
                  >
                    {place.primaryType.replaceAll("_", " ")}
                  </span>
                )}

                {place.userRatingCount !== null && (
                  <span
                    className="rounded-full px-3 py-1 text-xs font-medium"
                    style={{
                      background: "var(--purple-light)",
                      color: "var(--purple)",
                    }}
                  >
                    {place.userRatingCount} reviews
                  </span>
                )}
              </div>

              {place.googleMapsUri && (
                <a
                  href={place.googleMapsUri}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex text-sm font-bold transition-opacity hover:opacity-70"
                  style={{ color: "var(--purple)" }}
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
