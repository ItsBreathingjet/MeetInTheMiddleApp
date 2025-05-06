import React, { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, MapPin } from "lucide-react";
import { geocodeAddress } from "@/lib/leafletUtils";

interface LocationInputsProps {
  location1: {
    name: string;
    coordinates: [number, number];
  };
  location2: {
    name: string;
    coordinates: [number, number];
  };
  onLocationChange: (
    locationNumber: 1 | 2,
    newLocation: { name: string; coordinates: [number, number] },
  ) => void;
  onFindMidpoint: () => void;
}

interface Prediction {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

const LocationInputs = ({
  location1,
  location2,
  onLocationChange,
  onFindMidpoint,
}: LocationInputsProps) => {
  const [location1Input, setLocation1Input] = useState(location1.name);
  const [location2Input, setLocation2Input] = useState(location2.name);
  const [isGeocoding1, setIsGeocoding1] = useState(false);
  const [isGeocoding2, setIsGeocoding2] = useState(false);
  const [error1, setError1] = useState("");
  const [error2, setError2] = useState("");
  const [predictions1, setPredictions1] = useState<Prediction[]>([]);
  const [predictions2, setPredictions2] = useState<Prediction[]>([]);
  const [showPredictions1, setShowPredictions1] = useState(false);
  const [showPredictions2, setShowPredictions2] = useState(false);

  // Debounce search to avoid too many API calls
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchAddressPredictions = async (
    query: string,
  ): Promise<Prediction[]> => {
    if (query.length < 3) return [];

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": "MeetInTheMiddle/1.0",
          },
        },
      );
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching address predictions:", error);
      return [];
    }
  };

  const handleLocation1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation1Input(value);
    setError1("");

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout for address predictions
    debounceTimeout.current = setTimeout(async () => {
      if (value.length >= 3) {
        const predictions = await fetchAddressPredictions(value);
        setPredictions1(predictions);
        setShowPredictions1(predictions.length > 0);
      } else {
        setPredictions1([]);
        setShowPredictions1(false);
      }
    }, 300);
  };

  const handleLocation2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation2Input(value);
    setError2("");

    // Clear previous timeout
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    // Set new timeout for address predictions
    debounceTimeout.current = setTimeout(async () => {
      if (value.length >= 3) {
        const predictions = await fetchAddressPredictions(value);
        setPredictions2(predictions);
        setShowPredictions2(predictions.length > 0);
      } else {
        setPredictions2([]);
        setShowPredictions2(false);
      }
    }, 300);
  };

  const handleSelectPrediction = (
    locationNumber: 1 | 2,
    prediction: Prediction,
  ) => {
    if (locationNumber === 1) {
      setLocation1Input(prediction.display_name);
      setShowPredictions1(false);
      onLocationChange(1, {
        name: prediction.display_name,
        coordinates: [parseFloat(prediction.lat), parseFloat(prediction.lon)],
      });
    } else {
      setLocation2Input(prediction.display_name);
      setShowPredictions2(false);
      onLocationChange(2, {
        name: prediction.display_name,
        coordinates: [parseFloat(prediction.lat), parseFloat(prediction.lon)],
      });
    }
  };

  const geocodeLocation1 = async () => {
    if (!location1Input.trim()) {
      setError1("Please enter a location");
      return;
    }

    setIsGeocoding1(true);
    setError1("");

    try {
      const result = await geocodeAddress(location1Input);
      if (result) {
        onLocationChange(1, {
          name: location1Input,
          coordinates: [result.lat, result.lng],
        });
      } else {
        setError1("Could not find this location. Please try again.");
      }
    } catch (error) {
      setError1("Error finding location. Please try again.");
      console.error("Error geocoding location 1:", error);
    } finally {
      setIsGeocoding1(false);
    }
  };

  const geocodeLocation2 = async () => {
    if (!location2Input.trim()) {
      setError2("Please enter a location");
      return;
    }

    setIsGeocoding2(true);
    setError2("");

    try {
      const result = await geocodeAddress(location2Input);
      if (result) {
        onLocationChange(2, {
          name: location2Input,
          coordinates: [result.lat, result.lng],
        });
      } else {
        setError2("Could not find this location. Please try again.");
      }
    } catch (error) {
      setError2("Error finding location. Please try again.");
      console.error("Error geocoding location 2:", error);
    } finally {
      setIsGeocoding2(false);
    }
  };

  const handleKeyDown1 = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      geocodeLocation1();
    }
  };

  const handleKeyDown2 = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      geocodeLocation2();
    }
  };

  // Click outside to close predictions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showPredictions1 || showPredictions2) {
        setShowPredictions1(false);
        setShowPredictions2(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPredictions1, showPredictions2]);

  return (
    <div className="w-full py-4 px-6 border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Enter Locations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Location 1</label>
            <div className="relative">
              <Input
                type="text"
                className={`w-full pl-10 pr-16 ${error1 ? "border-red-500" : ""}`}
                placeholder="Enter starting location"
                value={location1Input}
                onChange={handleLocation1Change}
                onKeyDown={handleKeyDown1}
                disabled={isGeocoding1}
                autoComplete="off"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Button
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7"
                onClick={geocodeLocation1}
                disabled={isGeocoding1}
              >
                {isGeocoding1 ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <MapPin className="h-4 w-4 mr-1" />
                )}
                Set
              </Button>

              {/* Predictions dropdown for location 1 */}
              {showPredictions1 && predictions1.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {predictions1.map((prediction) => (
                    <div
                      key={prediction.place_id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSelectPrediction(1, prediction)}
                    >
                      {prediction.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {error1 && <p className="text-red-500 text-sm">{error1}</p>}
            {location1.name && (
              <p className="text-xs text-gray-500">
                Current: {location1.name} ({location1.coordinates[0].toFixed(4)}
                , {location1.coordinates[1].toFixed(4)})
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location 2</label>
            <div className="relative">
              <Input
                type="text"
                className={`w-full pl-10 pr-16 ${error2 ? "border-red-500" : ""}`}
                placeholder="Enter destination"
                value={location2Input}
                onChange={handleLocation2Change}
                onKeyDown={handleKeyDown2}
                disabled={isGeocoding2}
                autoComplete="off"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Button
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7"
                onClick={geocodeLocation2}
                disabled={isGeocoding2}
              >
                {isGeocoding2 ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <MapPin className="h-4 w-4 mr-1" />
                )}
                Set
              </Button>

              {/* Predictions dropdown for location 2 */}
              {showPredictions2 && predictions2.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
                  {predictions2.map((prediction) => (
                    <div
                      key={prediction.place_id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      onClick={() => handleSelectPrediction(2, prediction)}
                    >
                      {prediction.display_name}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {error2 && <p className="text-red-500 text-sm">{error2}</p>}
            {location2.name && (
              <p className="text-xs text-gray-500">
                Current: {location2.name} ({location2.coordinates[0].toFixed(4)}
                , {location2.coordinates[1].toFixed(4)})
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            onClick={onFindMidpoint}
            className="px-6"
            disabled={isGeocoding1 || isGeocoding2}
          >
            <MapPin className="h-4 w-4 mr-2" />
            Find Midpoint
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LocationInputs;
