import React, { useState, useEffect } from "react";
import Header from "./Header";
import MapInterface from "./MapInterface";
import LocationInputs from "./LocationInputs";
import PointsOfInterestPanel from "./PointsOfInterestPanel";
import {
  calculateMidpoint,
  reverseGeocode,
  searchNearbyPlaces,
  getRouteInfo,
  calculateDistance,
} from "@/lib/leafletUtils";

interface Location {
  name: string;
  coordinates: [number, number];
}

interface Midpoint {
  coordinates: [number, number];
  address: string;
}

interface Route {
  distance: string;
  duration: string;
  geometry?: [number, number][];
  routeMidpoint?: [number, number];
}

interface Routes {
  main: Route;
  alternatives: Route[];
}

interface POI {
  id: string;
  name: string;
  type: string;
  category: "restaurant" | "entertainment" | "cafe" | "other";
  rating: number;
  address: string;
  distance: string;
  imageUrl: string;
  openNow: boolean;
  phone: string;
  priceLevel: string;
  coordinates: [number, number];
}

const Home = () => {
  // State for locations
  const [location1, setLocation1] = useState<Location>({
    name: "",
    coordinates: [0, 0],
  });

  const [location2, setLocation2] = useState<Location>({
    name: "",
    coordinates: [0, 0],
  });

  // State for midpoint
  const [midpoint, setMidpoint] = useState<Midpoint>({
    coordinates: [0, 0],
    address: "",
  });

  // State for routes
  const [routes, setRoutes] = useState<Routes>({
    main: {
      distance: "0 km",
      duration: "0 mins",
    },
    alternatives: [
      {
        distance: "0 km",
        duration: "0 mins",
      },
      {
        distance: "0 km",
        duration: "0 mins",
      },
    ],
  });

  // State for POIs
  const [pois, setPois] = useState<POI[]>([]);

  // State for loading states
  const [isMapLoading, setIsMapLoading] = useState<boolean>(false);
  const [isPOILoading, setIsPOILoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize with user's location
  useEffect(() => {
    const initializeUserLocation = async () => {
      setIsMapLoading(true);

      try {
        // Try to get user's location from IP
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        if (data && data.latitude && data.longitude) {
          // Set initial map center to user's approximate location
          const userLocation: [number, number] = [
            data.latitude,
            data.longitude,
          ];
          const locationAddress = await reverseGeocode(
            userLocation[0],
            userLocation[1],
          );

          // Set midpoint to user's location initially
          setMidpoint({
            coordinates: userLocation,
            address: locationAddress || "Your approximate location",
          });

          setIsInitialized(true);
        } else {
          // Fallback to a default location (New York City)
          setMidpoint({
            coordinates: [40.7128, -74.006],
            address: "New York City, NY, USA",
          });
          setIsInitialized(true);
        }
      } catch (error) {
        console.error("Error initializing user location:", error);
        // Fallback to a default location
        setMidpoint({
          coordinates: [40.7128, -74.006],
          address: "New York City, NY, USA",
        });
        setIsInitialized(true);
      } finally {
        setIsMapLoading(false);
      }
    };

    initializeUserLocation();
  }, []);

  // Handler for location changes
  const handleLocationChange = (
    locationNumber: 1 | 2,
    newLocation: Location,
  ) => {
    if (locationNumber === 1) {
      setLocation1(newLocation);
    } else {
      setLocation2(newLocation);
    }
  };

  // Handler for selecting a POI
  const handleSelectPOI = (poi: POI) => {
    console.log("Selected POI:", poi);

    // Create a URL that will open in the user's default maps app
    // This works for both iOS (Apple Maps) and Android (Google Maps)
    const mapsUrl = `maps:?q=${encodeURIComponent(poi.name)}&ll=${poi.coordinates[0]},${poi.coordinates[1]}`;

    // For web fallback, use OpenStreetMap
    const webUrl = `https://www.openstreetmap.org/?mlat=${poi.coordinates[0]}&mlon=${poi.coordinates[1]}&zoom=16`;

    // Try to open the maps app first, then fall back to web
    try {
      window.open(mapsUrl, "_blank");
    } catch (e) {
      window.open(webUrl, "_blank");
    }
  };

  // Calculate distance between two locations in miles
  const calculateDistanceBetweenLocations = (
    loc1: [number, number],
    loc2: [number, number],
  ): number => {
    const R = 3958.8; // Earth's radius in miles
    const lat1 = (loc1[0] * Math.PI) / 180;
    const lon1 = (loc1[1] * Math.PI) / 180;
    const lat2 = (loc2[0] * Math.PI) / 180;
    const lon2 = (loc2[1] * Math.PI) / 180;

    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in miles
  };

  // Handler for finding midpoint
  const handleFindMidpoint = async () => {
    // Check if both locations are set
    if (!location1.name || !location2.name) {
      alert("Please enter both locations before finding the midpoint.");
      return;
    }

    setIsMapLoading(true);
    setIsPOILoading(true);

    try {
      // Calculate distance between locations to determine search radius
      const distanceMiles = calculateDistanceBetweenLocations(
        location1.coordinates,
        location2.coordinates,
      );

      // Set search radius based on distance (3 miles for short distances, 7 miles for longer)
      const searchRadius = distanceMiles > 50 ? 11265 : 4828; // 7 miles = 11265 meters, 3 miles = 4828 meters

      // Get route information first
      const routeInfo = await getRouteInfo(
        location1.coordinates,
        location2.coordinates,
      );

      if (routeInfo) {
        setRoutes(routeInfo);

        // Use the route midpoint instead of the straight-line midpoint
        const routeMidpoint =
          routeInfo.main.routeMidpoint ||
          calculateMidpoint(location1.coordinates, location2.coordinates);

        // Get the address of the midpoint
        const midpointAddress = await reverseGeocode(
          routeMidpoint[0],
          routeMidpoint[1],
        );

        // Update midpoint state
        setMidpoint({
          coordinates: routeMidpoint,
          address: midpointAddress || "Unknown location",
        });

        // Search for POIs near the route midpoint with dynamic radius
        const placesResult = await searchNearbyPlaces(
          routeMidpoint,
          searchRadius, // Dynamic radius based on distance
          "all", // Search for all types
        );

        if (placesResult && placesResult.length > 0) {
          setPois(placesResult);
        } else {
          setPois([]);
        }
      } else {
        // Fallback to straight-line midpoint if route calculation fails
        const midpointCoords = calculateMidpoint(
          location1.coordinates,
          location2.coordinates,
        );

        const midpointAddress = await reverseGeocode(
          midpointCoords[0],
          midpointCoords[1],
        );

        setMidpoint({
          coordinates: midpointCoords,
          address: midpointAddress || "Unknown location",
        });

        // Search for POIs near the midpoint with dynamic radius
        const placesResult = await searchNearbyPlaces(
          midpointCoords,
          searchRadius, // Dynamic radius based on distance
          "all",
        );

        if (placesResult && placesResult.length > 0) {
          setPois(placesResult);
        } else {
          setPois([]);
        }
      }
    } catch (error) {
      console.error("Error finding midpoint:", error);
    } finally {
      setIsMapLoading(false);
      setIsPOILoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <Header
        title="MeetInTheMiddle"
        subtitle="Find the perfect midpoint between two locations"
        onFindMidpointClick={handleFindMidpoint}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Map Interface */}
        <MapInterface
          location1={location1}
          location2={location2}
          midpoint={midpoint}
          routes={routes}
          pois={pois}
          onMapClick={(lat, lng) => console.log("Map clicked at:", lat, lng)}
        />

        {/* Location Inputs */}
        <LocationInputs
          location1={location1}
          location2={location2}
          onLocationChange={handleLocationChange}
          onFindMidpoint={handleFindMidpoint}
        />

        {/* Points of Interest Panel */}
        <PointsOfInterestPanel
          pois={pois}
          onSelectPOI={handleSelectPOI}
          isLoading={isPOILoading}
        />
      </main>
    </div>
  );
};

export default Home;
