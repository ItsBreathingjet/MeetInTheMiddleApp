import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Utensils, Music, Coffee, Store, Search } from "lucide-react";
import POICard from "./POICard";
import { Input } from "./ui/input";

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
}

interface PointsOfInterestPanelProps {
  pois?: POI[];
  onSelectPOI?: (poi: POI) => void;
  isLoading?: boolean;
}

const PointsOfInterestPanel = ({
  pois = [
    {
      id: "1",
      name: "Cafe Milano",
      type: "Italian Restaurant",
      category: "restaurant",
      rating: 4.5,
      address: "123 Main Street, Anytown",
      distance: "0.3 miles",
      imageUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      openNow: true,
      phone: "(555) 123-4567",
      priceLevel: "$$",
    },
    {
      id: "2",
      name: "The Jazz Lounge",
      type: "Music Venue",
      category: "entertainment",
      rating: 4.8,
      address: "456 Broadway, Anytown",
      distance: "0.4 miles",
      imageUrl:
        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      openNow: true,
      phone: "(555) 987-6543",
      priceLevel: "$$$",
    },
    {
      id: "3",
      name: "Central Park Cafe",
      type: "Coffee Shop",
      category: "cafe",
      rating: 4.2,
      address: "789 Park Avenue, Anytown",
      distance: "0.2 miles",
      imageUrl:
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      openNow: true,
      phone: "(555) 456-7890",
      priceLevel: "$",
    },
    {
      id: "4",
      name: "City Bookstore",
      type: "Bookstore",
      category: "other",
      rating: 4.6,
      address: "101 Library Lane, Anytown",
      distance: "0.5 miles",
      imageUrl:
        "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      openNow: false,
      phone: "(555) 234-5678",
      priceLevel: "$$",
    },
    {
      id: "5",
      name: "Trattoria Roma",
      type: "Italian Restaurant",
      category: "restaurant",
      rating: 4.3,
      address: "202 Pasta Place, Anytown",
      distance: "0.6 miles",
      imageUrl:
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      openNow: true,
      phone: "(555) 345-6789",
      priceLevel: "$$$",
    },
  ],
  onSelectPOI = (poi) => console.log("Selected POI:", poi),
  isLoading = false,
}: PointsOfInterestPanelProps) => {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter POIs based on active tab and search query
  const filteredPOIs = pois.filter((poi) => {
    // Filter by category
    if (activeTab !== "all" && poi.category !== activeTab) {
      return false;
    }

    // Filter by search query
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      return (
        poi.name.toLowerCase().includes(query) ||
        poi.type.toLowerCase().includes(query) ||
        poi.address.toLowerCase().includes(query)
      );
    }

    return true;
  });

  // Count POIs by category
  const poiCounts = {
    all: pois.length,
    restaurant: pois.filter((poi) => poi.category === "restaurant").length,
    entertainment: pois.filter((poi) => poi.category === "entertainment")
      .length,
    cafe: pois.filter((poi) => poi.category === "cafe").length,
    other: pois.filter((poi) => poi.category === "other").length,
  };

  return (
    <div className="w-full bg-gray-50 border-t border-gray-200 p-2 sm:p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h2 className="text-xl font-semibold">Points of Interest</h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search places..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="flex flex-wrap mb-4 overflow-x-auto">
              <TabsTrigger
                value="all"
                className="flex items-center gap-1 px-2 py-1.5 text-xs sm:text-sm sm:gap-2 sm:px-3 sm:py-2"
              >
                <Store className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>All</span>
                <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                  {poiCounts.all}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="restaurant"
                className="flex items-center gap-1 px-2 py-1.5 text-xs sm:text-sm sm:gap-2 sm:px-3 sm:py-2"
              >
                <Utensils className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Restaurants</span>
                <span className="xs:hidden">Rest.</span>
                <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                  {poiCounts.restaurant}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="entertainment"
                className="flex items-center gap-1 px-2 py-1.5 text-xs sm:text-sm sm:gap-2 sm:px-3 sm:py-2"
              >
                <Music className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden xs:inline">Entertainment</span>
                <span className="xs:hidden">Ent.</span>
                <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                  {poiCounts.entertainment}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="cafe"
                className="flex items-center gap-1 px-2 py-1.5 text-xs sm:text-sm sm:gap-2 sm:px-3 sm:py-2"
              >
                <Coffee className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Cafes</span>
                <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                  {poiCounts.cafe}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="other"
                className="flex items-center gap-1 px-2 py-1.5 text-xs sm:text-sm sm:gap-2 sm:px-3 sm:py-2"
              >
                <Store className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Other</span>
                <span className="ml-1 text-xs bg-gray-200 px-1.5 py-0.5 rounded-full">
                  {poiCounts.other}
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-0">
              <POIList
                pois={filteredPOIs}
                onSelectPOI={onSelectPOI}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="restaurant" className="mt-0">
              <POIList
                pois={filteredPOIs}
                onSelectPOI={onSelectPOI}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="entertainment" className="mt-0">
              <POIList
                pois={filteredPOIs}
                onSelectPOI={onSelectPOI}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="cafe" className="mt-0">
              <POIList
                pois={filteredPOIs}
                onSelectPOI={onSelectPOI}
                isLoading={isLoading}
              />
            </TabsContent>
            <TabsContent value="other" className="mt-0">
              <POIList
                pois={filteredPOIs}
                onSelectPOI={onSelectPOI}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

interface POIListProps {
  pois: POI[];
  onSelectPOI: (poi: POI) => void;
  isLoading: boolean;
}

const POIList = ({ pois, onSelectPOI, isLoading }: POIListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (pois.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No points of interest found. Try adjusting your search or filters.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[300px]">
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-1">
        {pois.map((poi) => (
          <POICard
            key={poi.id}
            name={poi.name}
            type={poi.type}
            rating={poi.rating}
            address={poi.address}
            distance={poi.distance}
            imageUrl={poi.imageUrl}
            openNow={poi.openNow}
            phone={poi.phone}
            priceLevel={poi.priceLevel}
            onClick={() => onSelectPOI(poi)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

export default PointsOfInterestPanel;
