// Google Maps API utilities

// Function to geocode an address to coordinates
export const geocodeAddress = async (
  address: string,
  apiKey: string,
): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`,
    );
    const data = await response.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      const location = data.results[0].geometry.location;
      return { lat: location.lat, lng: location.lng };
    }
    return null;
  } catch (error) {
    console.error("Error geocoding address:", error);
    return null;
  }
};

// Function to calculate the midpoint between two coordinates
export const calculateMidpoint = (
  coord1: [number, number],
  coord2: [number, number],
): [number, number] => {
  const lat1 = (coord1[0] * Math.PI) / 180;
  const lon1 = (coord1[1] * Math.PI) / 180;
  const lat2 = (coord2[0] * Math.PI) / 180;
  const lon2 = (coord2[1] * Math.PI) / 180;

  // Convert to Cartesian coordinates
  const x1 = Math.cos(lat1) * Math.cos(lon1);
  const y1 = Math.cos(lat1) * Math.sin(lon1);
  const z1 = Math.sin(lat1);

  const x2 = Math.cos(lat2) * Math.cos(lon2);
  const y2 = Math.cos(lat2) * Math.sin(lon2);
  const z2 = Math.sin(lat2);

  // Calculate midpoint in Cartesian coordinates
  const x = (x1 + x2) / 2;
  const y = (y1 + y2) / 2;
  const z = (z1 + z2) / 2;

  // Convert back to latitude and longitude
  const lon = Math.atan2(y, x);
  const hyp = Math.sqrt(x * x + y * y);
  const lat = Math.atan2(z, hyp);

  return [(lat * 180) / Math.PI, (lon * 180) / Math.PI];
};

// Function to reverse geocode coordinates to an address
export const reverseGeocode = async (
  lat: number,
  lng: number,
  apiKey: string,
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
    );
    const data = await response.json();

    if (data.status === "OK" && data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return null;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null;
  }
};

// Function to get directions between two points
export const getDirections = async (
  origin: [number, number],
  destination: [number, number],
  apiKey: string,
): Promise<any | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin[0]},${origin[1]}&destination=${destination[0]},${destination[1]}&alternatives=true&key=${apiKey}`,
    );
    const data = await response.json();

    if (data.status === "OK" && data.routes && data.routes.length > 0) {
      return data.routes;
    }
    return null;
  } catch (error) {
    console.error("Error getting directions:", error);
    return null;
  }
};

// Function to search for places near a location
export const searchNearbyPlaces = async (
  location: [number, number],
  radius: number,
  type: string,
  apiKey: string,
): Promise<any[] | null> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location[0]},${location[1]}&radius=${radius}&type=${type}&key=${apiKey}`,
    );
    const data = await response.json();

    if (data.status === "OK" && data.results) {
      return data.results;
    }
    return null;
  } catch (error) {
    console.error("Error searching nearby places:", error);
    return null;
  }
};
