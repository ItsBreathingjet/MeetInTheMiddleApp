import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { MapPin, Star, ExternalLink, Clock, Phone } from "lucide-react";
import { Badge } from "../components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

interface POICardProps {
  name: string;
  type: string;
  rating: number;
  address: string;
  distance: string;
  imageUrl: string;
  openNow?: boolean;
  phone?: string;
  priceLevel?: string;
  onClick?: () => void;
}

const POICard = ({
  name = "Cafe Milano",
  type = "Restaurant",
  rating = 4.5,
  address = "123 Main Street, Anytown",
  distance = "0.3 miles",
  imageUrl = "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  openNow = true,
  phone = "(555) 123-4567",
  priceLevel = "$$",
  onClick = () => console.log("POI card clicked"),
}: POICardProps) => {
  // Generate stars based on rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`star-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half-star" className="relative">
          <Star className="h-4 w-4 text-yellow-400" />
          <div className="absolute inset-0 overflow-hidden w-[50%]">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>,
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-star-${i}`} className="h-4 w-4 text-yellow-400" />,
      );
    }

    return stars;
  };

  return (
    <Card className="w-full max-w-[300px] overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white">
      <div className="relative h-32 w-full overflow-hidden">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        <div className="absolute top-2 right-2">
          <Badge
            variant={openNow ? "default" : "destructive"}
            className="text-xs"
          >
            {openNow ? "Open Now" : "Closed"}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-3 pb-0">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold truncate">{name}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {priceLevel}
          </Badge>
        </div>
        <CardDescription className="flex items-center gap-1 text-sm">
          <span className="text-muted-foreground">{type}</span>
          <span className="mx-1">•</span>
          <span className="flex items-center">
            {renderStars()}
            <span className="ml-1 text-sm">{rating}</span>
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3 pt-2 space-y-2">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-600 line-clamp-2">{address}</span>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">
            {distance} from midpoint
          </span>
        </div>

        {phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{phone}</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-3 pt-0">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={onClick} className="w-full gap-2">
                <ExternalLink className="h-4 w-4" />
                Open in Maps
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View this location in your default maps app</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
};

export default POICard;
