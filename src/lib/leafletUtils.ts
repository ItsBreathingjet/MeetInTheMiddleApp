// Leaflet utilities

// Function to geocode an address to coordinates using OpenStreetMap Nominatim API
export const geocodeAddress = async (
  address: string,
): Promise<{ lat: number; lng: number } | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": "MeetInTheMiddle/1.0",
        },
      },
    );
    const data = await response.json();

    if (data && data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
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
): Promise<string | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "Accept-Language": "en-US,en;q=0.9",
          "User-Agent": "MeetInTheMiddle/1.0",
        },
      },
    );
    const data = await response.json();

    if (data && data.display_name) {
      return data.display_name;
    }
    return null;
  } catch (error) {
    console.error("Error reverse geocoding:", error);
    return null;
  }
};

// Function to search for places near a location using Overpass API
export const searchNearbyPlaces = async (
  location: [number, number],
  radius: number,
  type: string,
): Promise<any[] | null> => {
  try {
    // Define amenity types based on the requested type
    let amenityTypes = [];
    if (type === "restaurant" || type === "all") {
      amenityTypes.push("restaurant", "fast_food", "bar", "pub");
    }
    if (type === "entertainment" || type === "all") {
      amenityTypes.push("cinema", "theatre", "arts_centre", "nightclub");
    }
    if (type === "cafe" || type === "all") {
      amenityTypes.push("cafe", "coffee_shop");
    }
    if (type === "other" || type === "all") {
      amenityTypes.push("library", "marketplace", "park", "museum");
    }

    // If no specific type, search for all
    if (amenityTypes.length === 0) {
      amenityTypes = [
        "restaurant",
        "cafe",
        "cinema",
        "theatre",
        "library",
        "park",
      ];
    }

    // Create Overpass query for multiple amenity types
    const amenityQuery = amenityTypes
      .map(
        (a) =>
          `node[amenity=${a}](around:${radius},${location[0]},${location[1]});`,
      )
      .join("");

    const query = `
      [out:json];
      (${amenityQuery});
      out body;
    `;

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: query,
    });

    const data = await response.json();

    if (data && data.elements) {
      return data.elements.map((element: any, index: number) => {
        const amenityType = element.tags.amenity || "place";
        return {
          id: element.id.toString(),
          name:
            element.tags.name ||
            `${amenityType.charAt(0).toUpperCase() + amenityType.slice(1)} ${index + 1}`,
          type: element.tags.cuisine || amenityType,
          category: getCategoryFromType(amenityType),
          rating: Math.floor(Math.random() * 5) + 1, // Random rating since Overpass doesn't provide ratings
          address: element.tags.address || element.tags["addr:street"] || "",
          distance: calculateDistance(location, [element.lat, element.lon]),
          imageUrl: getImageForCategory(
            getCategoryFromType(amenityType),
            index,
          ),
          openNow: Math.random() > 0.2, // Random open status
          phone: element.tags.phone || "",
          priceLevel: getPriceLevel(Math.floor(Math.random() * 4) + 1), // Random price level
          coordinates: [element.lat, element.lon] as [number, number],
        };
      });
    }
    return null;
  } catch (error) {
    console.error("Error searching nearby places:", error);
    return null;
  }
};

// Helper function to get image URL based on category
const getImageForCategory = (category: string, index: number): string => {
  const imageIndex = (1517248135467 + index * 10000) % 1000000000000;

  switch (category) {
    case "restaurant":
      return `https://images.unsplash.com/photo-${imageIndex}-4c7edcad34c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3`;
    case "cafe":
      return `https://images.unsplash.com/photo-${imageIndex + 1}-ac426a4a7cbb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3`;
    case "entertainment":
      return `https://images.unsplash.com/photo-${imageIndex + 2}-7a4b6ad7a6c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3`;
    default:
      return `https://images.unsplash.com/photo-${imageIndex + 3}-444d633d7365?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3`;
  }
};

// Helper function to determine category from place type
const getCategoryFromType = (
  type: string,
): "restaurant" | "entertainment" | "cafe" | "other" => {
  if (!type) return "other";

  if (
    type.includes("restaurant") ||
    type.includes("food") ||
    type.includes("bar") ||
    type.includes("pub")
  ) {
    return "restaurant";
  } else if (type.includes("cafe") || type.includes("coffee")) {
    return "cafe";
  } else if (
    type.includes("entertainment") ||
    type.includes("cinema") ||
    type.includes("theatre") ||
    type.includes("theater") ||
    type.includes("nightclub") ||
    type.includes("arts_centre") ||
    type.includes("museum")
  ) {
    return "entertainment";
  }
  return "other";
};

// Helper function to calculate distance between two points
export const calculateDistance = (
  point1: [number, number],
  point2: [number, number],
): string => {
  // Simple Haversine formula to calculate distance
  const R = 6371; // Radius of the Earth in km
  const dLat = (point2[0] - point1[0]) * (Math.PI / 180);
  const dLon = (point2[1] - point1[1]) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(point1[0] * (Math.PI / 180)) *
      Math.cos(point2[0] * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  // Format distance
  if (distance < 1) {
    return `${Math.round(distance * 1000)} meters`;
  }
  return `${distance.toFixed(1)} km`;
};

// Helper function to get price level string
const getPriceLevel = (level: number): string => {
  switch (level) {
    case 0:
      return "Free";
    case 1:
      return "$";
    case 2:
      return "$$";
    case 3:
      return "$$$";
    case 4:
      return "$$$$";
    default:
      return "$$";
  }
};

// Function to get route information between two points
export const getRouteInfo = async (
  start: [number, number],
  end: [number, number],
): Promise<any> => {
  try {
    // Get the route using OSRM API with full geometry
    const response = await fetch(
      `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`,
    );
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      const distance = (route.distance / 1000).toFixed(1) + " km";
      const duration = Math.round(route.duration / 60) + " mins";

      // Extract the route geometry
      const geometry = route.geometry.coordinates.map(
        (coord: [number, number]) => [coord[1], coord[0]],
      );

      // Find the midpoint along the route (approximately halfway)
      const routeMidpoint = findRouteMiddlePoint(geometry);

      // Create alternative routes with slight variations
      const alt1 = createAlternativeRoute(geometry, 0.001);
      const alt2 = createAlternativeRoute(geometry, -0.0015);

      return {
        main: {
          distance,
          duration,
          geometry: geometry,
          routeMidpoint: routeMidpoint,
        },
        alternatives: [
          {
            distance: ((route.distance * 1.2) / 1000).toFixed(1) + " km",
            duration: Math.round((route.duration * 1.1) / 60) + " mins",
            geometry: alt1,
            routeMidpoint: findRouteMiddlePoint(alt1),
          },
          {
            distance: ((route.distance * 1.3) / 1000).toFixed(1) + " km",
            duration: Math.round((route.duration * 1.2) / 60) + " mins",
            geometry: alt2,
            routeMidpoint: findRouteMiddlePoint(alt2),
          },
        ],
      };
    }

    return null;
  } catch (error) {
    console.error("Error getting route information:", error);
    return null;
  }
};

// Function to find the midpoint along a route
const findRouteMiddlePoint = (
  routeGeometry: [number, number][],
): [number, number] => {
  if (!routeGeometry || routeGeometry.length === 0) {
    return [0, 0];
  }

  if (routeGeometry.length === 1) {
    return routeGeometry[0];
  }

  // Calculate the total distance of the route
  let totalDistance = 0;
  const segmentDistances = [];

  for (let i = 0; i < routeGeometry.length - 1; i++) {
    const segmentDistance = calculateDistanceInMeters(
      routeGeometry[i],
      routeGeometry[i + 1],
    );
    segmentDistances.push(segmentDistance);
    totalDistance += segmentDistance;
  }

  // Find the midpoint (the point that's halfway along the route)
  const halfDistance = totalDistance / 2;
  let distanceSoFar = 0;

  for (let i = 0; i < segmentDistances.length; i++) {
    distanceSoFar += segmentDistances[i];

    if (distanceSoFar >= halfDistance) {
      // We've passed the halfway point on this segment
      // Calculate how far along this segment the midpoint is
      const previousDistance = distanceSoFar - segmentDistances[i];
      const segmentFraction =
        (halfDistance - previousDistance) / segmentDistances[i];

      // Interpolate between the two points
      const p1 = routeGeometry[i];
      const p2 = routeGeometry[i + 1];

      return [
        p1[0] + segmentFraction * (p2[0] - p1[0]),
        p1[1] + segmentFraction * (p2[1] - p1[1]),
      ];
    }
  }

  // Fallback to the last point if something goes wrong
  return routeGeometry[routeGeometry.length - 1];
};

// Helper function to calculate distance in meters between two points
const calculateDistanceInMeters = (
  point1: [number, number],
  point2: [number, number],
): number => {
  const R = 6371000; // Earth's radius in meters
  const lat1 = (point1[0] * Math.PI) / 180;
  const lat2 = (point2[0] * Math.PI) / 180;
  const dLat = ((point2[0] - point1[0]) * Math.PI) / 180;
  const dLon = ((point2[1] - point1[1]) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Helper function to create alternative routes by adding some variation
const createAlternativeRoute = (
  originalRoute: [number, number][],
  variation: number,
): [number, number][] => {
  // Only modify some points to create a realistic alternative
  return originalRoute.map((point, index) => {
    // Add more variation to the middle of the route
    const middleSection =
      index > originalRoute.length * 0.3 && index < originalRoute.length * 0.7;
    const variationFactor = middleSection ? variation : variation * 0.3;

    // Add some randomness to make it look more natural
    const randomFactor = (Math.random() - 0.5) * 0.001;

    return [
      point[0] + variationFactor + randomFactor,
      point[1] + variationFactor + randomFactor,
    ];
  });
};
