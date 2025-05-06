// Type definitions for Google Maps JavaScript API
declare global {
  interface Window {
    google: typeof google;
  }

  namespace google.maps.places {
    class AutocompleteService {
      getPlacePredictions(
        request: {
          input: string;
          componentRestrictions?: { country: string | string[] };
          bounds?: google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral;
          location?: google.maps.LatLng;
          offset?: number;
          radius?: number;
          types?: string[];
        },
        callback: (
          predictions: Array<{
            description: string;
            place_id: string;
            structured_formatting?: {
              main_text: string;
              secondary_text: string;
              main_text_matched_substrings?: Array<{
                offset: number;
                length: number;
              }>;
            };
            matched_substrings?: Array<{
              offset: number;
              length: number;
            }>;
            terms?: Array<{
              offset: number;
              value: string;
            }>;
            types?: string[];
          }> | null,
          status: google.maps.places.PlacesServiceStatus,
        ) => void,
      ): void;
    }

    class PlacesService {
      constructor(attrContainer: HTMLDivElement | google.maps.Map);
      getDetails(
        request: {
          placeId: string;
          fields?: string[];
        },
        callback: (
          result: {
            geometry?: {
              location: google.maps.LatLng;
            };
            formatted_address?: string;
            name?: string;
          } | null,
          status: google.maps.places.PlacesServiceStatus,
        ) => void,
      ): void;
    }

    enum PlacesServiceStatus {
      OK = "OK",
      ZERO_RESULTS = "ZERO_RESULTS",
      OVER_QUERY_LIMIT = "OVER_QUERY_LIMIT",
      REQUEST_DENIED = "REQUEST_DENIED",
      INVALID_REQUEST = "INVALID_REQUEST",
      UNKNOWN_ERROR = "UNKNOWN_ERROR",
      NOT_FOUND = "NOT_FOUND",
    }
  }
}
