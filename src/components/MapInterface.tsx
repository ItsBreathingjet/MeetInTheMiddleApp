import React, { useState, useEffect, useRef } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import {
  MapPin,
  Navigation,
  Car,
  LocateFixed,
  Plus,
  Minus,
  Layers,
} from "lucide-react";

interface MapInterfaceProps {
  location1?: {
    name: string;
    coordinates: [number, number];
  };
  location2?: {
    name: string;
    coordinates: [number, number];
  };
  midpoint?: {
    coordinates: [number, number];
    address: string;
  };
  routes?: {
    main: {
      distance: string;
      duration: string;
      geometry?: [number, number][];
      routeMidpoint?: [number, number];
    };
    alternatives: Array<{
      distance: string;
      duration: string;
      geometry?: [number, number][];
      routeMidpoint?: [number, number];
    }>;
  };
  pois?: Array<{
    id: string;
    name: string;
    coordinates: [number, number];
    category: string;
  }>;
  onMapClick?: (lat: number, lng: number) => void;
}

const MapInterface = ({
  location1 = {
    name: "",
    coordinates: [0, 0],
  },
  location2 = {
    name: "",
    coordinates: [0, 0],
  },
  midpoint = {
    coordinates: [40.7128, -74.006], // Default to NYC if no midpoint
    address: "Loading location...",
  },
  routes = {
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
  },
  pois = [],
  onMapClick = () => {},
}: MapInterfaceProps) => {
  const [zoom, setZoom] = useState(12);
  const [activeRoute, setActiveRoute] = useState("main");
  const [mapType, setMapType] = useState("roadmap");
  const [isMapLoading, setIsMapLoading] = useState(false);
  const mapRef = useRef(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Check if locations are set
  const hasLocations = location1.name && location2.name;
  const hasMidpoint =
    midpoint.address && midpoint.address !== "Loading location...";

  // Get the current active route
  const getCurrentRoute = () => {
    if (activeRoute === "main") {
      return routes.main;
    } else {
      const altIndex = parseInt(activeRoute.replace("alt", "")) - 1;
      return routes.alternatives[altIndex] || routes.main;
    }
  };

  // Get the current route midpoint
  const getCurrentRouteMidpoint = () => {
    const currentRoute = getCurrentRoute();
    return currentRoute.routeMidpoint || midpoint.coordinates;
  };

  // Create fallback polylines for routes if geometry is not provided
  const mainRoutePath = routes.main.geometry || [
    location1.coordinates,
    midpoint.coordinates,
    location2.coordinates,
  ];

  // Create a slightly offset alternative route for visualization if geometry is not provided
  const getAltRoutePath = (index: number) => {
    if (routes.alternatives[index]?.geometry) {
      return routes.alternatives[index].geometry;
    }

    // Fallback to a simple offset route
    const offset = index === 0 ? 0.01 : -0.01;
    return [
      location1.coordinates,
      [midpoint.coordinates[0] + offset, midpoint.coordinates[1] + offset],
      location2.coordinates,
    ];
  };

  // Initialize map
  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const initializeMap = async () => {
      try {
        if (!mapContainerRef.current || mapRef.current) return;

        const L = await import("leaflet");
        await import("leaflet/dist/leaflet.css");

        // Fix Leaflet's default icon path issues
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
          iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        });

        // Create map instance
        const map = L.map(mapContainerRef.current, {
          center: midpoint.coordinates,
          zoom: zoom,
          zoomControl: false,
        });

        // Add tile layer based on map type
        const tileLayer =
          mapType === "roadmap"
            ? L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                  attribution: "&copy; OpenStreetMap contributors",
                },
              )
            : L.tileLayer(
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                {
                  attribution:
                    "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
                },
              );

        tileLayer.addTo(map);

        // Add click handler
        map.on("click", (e) => {
          onMapClick(e.latlng.lat, e.latlng.lng);
        });

        // Store map reference
        mapRef.current = map;
      } catch (error) {
        console.error("Error initializing map:", error);
        setIsMapLoading(false);
      }
    };

    initializeMap();

    // Clean up on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map when locations, midpoint, or POIs change
  useEffect(() => {
    const updateMap = async () => {
      if (!mapRef.current) return;

      try {
        const L = await import("leaflet");
        const map = mapRef.current;

        // Clear existing markers and routes
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker || layer instanceof L.Polyline) {
            map.removeLayer(layer);
          }
        });

        // Create custom icons
        const locationAIcon = new L.Icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        const locationBIcon = new L.Icon({
          iconUrl:
            "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
          shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        // POI icons based on category - smaller when midpoint is found
        const poiIconSize = hasLocations ? [18, 30] : [25, 41];
        const poiIconAnchor = hasLocations ? [9, 30] : [12, 41];

        const poiIcons = {
          restaurant: new L.Icon({
            iconUrl:
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: poiIconSize,
            iconAnchor: poiIconAnchor,
            popupAnchor: [1, -34],
            shadowSize: [30, 30],
          }),
          cafe: new L.Icon({
            iconUrl:
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: poiIconSize,
            iconAnchor: poiIconAnchor,
            popupAnchor: [1, -34],
            shadowSize: [30, 30],
          }),
          entertainment: new L.Icon({
            iconUrl:
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: poiIconSize,
            iconAnchor: poiIconAnchor,
            popupAnchor: [1, -34],
            shadowSize: [30, 30],
          }),
          other: new L.Icon({
            iconUrl:
              "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
            shadowUrl:
              "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
            iconSize: poiIconSize,
            iconAnchor: poiIconAnchor,
            popupAnchor: [1, -34],
            shadowSize: [30, 30],
          }),
        };

        // Add location markers if they are set
        if (hasLocations) {
          L.marker(location1.coordinates, { icon: locationAIcon })
            .bindPopup(`<b>Location A</b><br>${location1.name}`)
            .addTo(map);

          L.marker(location2.coordinates, { icon: locationBIcon })
            .bindPopup(`<b>Location B</b><br>${location2.name}`)
            .addTo(map);

          // Add route polyline based on active route
          let routePath;
          let routeColor;
          let routeStyle;

          if (activeRoute === "main") {
            routePath = mainRoutePath;
            routeColor = "#3b82f6";
            routeStyle = {};
          } else {
            // Get the alternative route index (alt1 -> 0, alt2 -> 1)
            const altIndex = parseInt(activeRoute.replace("alt", "")) - 1;
            routePath = getAltRoutePath(altIndex);
            routeColor = "#ef4444";
            routeStyle = { dashArray: "10, 10" };
          }

          L.polyline(routePath, {
            color: routeColor,
            weight: 4,
            opacity: 0.7,
            ...routeStyle,
          }).addTo(map);

          // Only add midpoint marker if we have a valid midpoint and locations are set
          if (hasMidpoint) {
            // Get the current route's midpoint
            const routeMidpoint = getCurrentRouteMidpoint();

            // Create a custom HTML icon for midpoint with a star or flag
            const midpointHtmlIcon = L.divIcon({
              html: `<div class="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full border-4 border-white shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M12 2v3m0 14v3M2 12h3m14 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1"></path>
                      </svg>
                    </div>`,
              className: "",
              iconSize: [48, 48],
              iconAnchor: [24, 24],
            });

            L.marker(routeMidpoint, {
              icon: midpointHtmlIcon,
              zIndexOffset: 1000, // Make sure midpoint is on top of other markers
            })
              .bindPopup(`<b>Midpoint</b><br>${midpoint.address}`)
              .addTo(map);
          }

          // Only add POI markers if locations are set
          pois.forEach((poi) => {
            const icon =
              poiIcons[poi.category as keyof typeof poiIcons] || poiIcons.other;
            L.marker(poi.coordinates, { icon })
              .bindPopup(`<b>${poi.name}</b><br>${poi.category}`)
              .addTo(map);
          });
        }

        // Collect all points to include in bounds
        const boundsPoints = [];

        // Add location coordinates to bounds if they exist
        if (hasLocations) {
          boundsPoints.push(location1.coordinates, location2.coordinates);

          // Only add midpoint to bounds if locations are set
          if (hasMidpoint) {
            boundsPoints.push(getCurrentRouteMidpoint());
          }

          // Add POIs to bounds only if locations are set
          if (pois.length > 0) {
            boundsPoints.push(...pois.map((poi) => poi.coordinates));
          }
        } else {
          // If no locations set, just center on the initial location
          boundsPoints.push(midpoint.coordinates);
        }

        // Fit bounds to include all markers
        if (boundsPoints.length > 1) {
          const bounds = L.latLngBounds(boundsPoints);
          map.fitBounds(bounds, { padding: [50, 50] });
        } else if (boundsPoints.length === 1) {
          // If only one point, center on it
          map.setView(boundsPoints[0], 12);
        }
      } catch (error) {
        console.error("Error updating map:", error);
      }
    };

    updateMap();
  }, [
    location1,
    location2,
    midpoint,
    pois,
    activeRoute,
    hasLocations,
    hasMidpoint,
  ]);

  // Update map type
  useEffect(() => {
    const updateMapType = async () => {
      if (!mapRef.current) return;

      try {
        const L = await import("leaflet");
        const map = mapRef.current;

        // Remove existing tile layers
        map.eachLayer((layer) => {
          if (layer instanceof L.TileLayer) {
            map.removeLayer(layer);
          }
        });

        // Add new tile layer based on map type
        if (mapType === "roadmap") {
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
          }).addTo(map);
        } else {
          L.tileLayer(
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            {
              attribution:
                "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
            },
          ).addTo(map);
        }
      } catch (error) {
        console.error("Error updating map type:", error);
      }
    };

    updateMapType();
  }, [mapType]);

  // Handle zoom changes
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() + 1);
    }
    setZoom((prevZoom) => Math.min(prevZoom + 1, 18));
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.setZoom(mapRef.current.getZoom() - 1);
    }
    setZoom((prevZoom) => Math.max(prevZoom - 1, 3));
  };

  // Handle map type changes
  const handleMapTypeChange = (type: string) => {
    setMapType(type);
  };

  // Handle getting current location
  const handleGetCurrentLocation = async () => {
    if (!mapRef.current || !navigator.geolocation) return;

    try {
      const L = await import("leaflet");
      const map = mapRef.current;

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setView([pos.lat, pos.lng], 14);

          // Add a marker for current location
          L.marker([pos.lat, pos.lng], {
            icon: new L.Icon({
              iconUrl:
                "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
              shadowUrl:
                "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            }),
          })
            .bindPopup("<b>Your Location</b>")
            .addTo(map);
        },
        () => {
          console.error("Error: The Geolocation service failed.");
        },
      );
    } catch (error) {
      console.error("Error getting current location:", error);
    }
  };

  return (
    <div className="w-full h-[600px] relative bg-gray-100 flex flex-col">
      {/* Map Container */}
      <div className="relative w-full h-full overflow-hidden bg-gray-200">
        {isMapLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-600">Loading map...</p>
            </div>
          </div>
        ) : (
          <div ref={mapContainerRef} className="w-full h-full" />
        )}

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-[1000]">
          <Card className="p-2 shadow-lg bg-white">
            <div className="flex flex-col gap-2">
              <Button size="icon" variant="outline" onClick={handleZoomIn}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="outline" onClick={handleZoomOut}>
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </Card>

          <Card className="p-2 shadow-lg bg-white mt-2">
            <div className="flex flex-col gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={mapType === "roadmap" ? "default" : "outline"}
                      onClick={() => handleMapTypeChange("roadmap")}
                    >
                      <Car className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Road Map</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant={mapType === "satellite" ? "default" : "outline"}
                      onClick={() => handleMapTypeChange("satellite")}
                    >
                      <Layers className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Satellite View</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </Card>
        </div>
      </div>

      {/* Route Information - Only show if locations are set */}
      {hasLocations && (
        <Card className="absolute bottom-4 left-4 w-64 shadow-lg bg-white z-[1000]">
          <Tabs
            defaultValue="main"
            value={activeRoute}
            onValueChange={(value) => setActiveRoute(value)}
          >
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="main">Main Route</TabsTrigger>
              <TabsTrigger value="alt1">Alternatives</TabsTrigger>
            </TabsList>
            <TabsContent value="main" className="p-4">
              <div className="flex items-center gap-2">
                <Navigation className="h-5 w-5 text-green-600" />
                <div>
                  <div className="font-medium">Main Route</div>
                  <div className="text-sm text-gray-500">
                    {routes.main.distance} • {routes.main.duration}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="alt1" className="p-4 space-y-3">
              {routes.alternatives.map((route, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded"
                  onClick={() => setActiveRoute(`alt${index + 1}`)}
                >
                  <Navigation className="h-5 w-5 text-gray-600" />
                  <div>
                    <div className="font-medium">Alternative {index + 1}</div>
                    <div className="text-sm text-gray-500">
                      {route.distance} • {route.duration}
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </Card>
      )}

      {/* Current Location Button */}
      <Button
        className="absolute bottom-4 right-4 z-[1000]"
        size="icon"
        variant="default"
        onClick={handleGetCurrentLocation}
      >
        <LocateFixed className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default MapInterface;
