export type NearbyPlace = {
  id: string;
  name: string;
  address: string;
  rating: number | null;
  userRatingCount: number | null;
  googleMapsUri: string | null;
  primaryType: string | null;
};