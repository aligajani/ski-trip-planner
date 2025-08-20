import hotelsData from './hotels-data.json';

interface LiteApiHotelData {
  id: string;
  name: string;
  hotelDescription: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  address: string;
  zip: string;
}

interface LiteApiResponse {
  data: LiteApiHotelData;
  score: number;
}

interface HotelOption {
  name: string;
  price: number;
  startingPrice?: number;
  rating: number;
  stars: number;
  description: string;
  isFromLiteApi?: boolean;
  rooms?: Array<{
    id: string;
    name: string;
    size: string;
    occupancy: string;
    price: number;
    description: string;
  }>;
}

export async function getHotelsForDestination(destinationName: string): Promise<HotelOption[]> {
  const results: HotelOption[] = [];

  try {
    // Use LiteAPI hotel search endpoint to get a hotel
    const query = encodeURIComponent(destinationName);
    const response = await fetch(`https://api.liteapi.travel/v3.0/data/hotel/search?query=${query}`, {
      method: 'GET',
      headers: {
        'X-API-Key': process.env.LITE_API_KEY || '',
        'accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json() as LiteApiResponse;
    
    // Check if the response has data and validate the structure
    if (data && data.data && typeof data.data === 'object') {
      const hotelData = data.data;
      
      // Validate that we have the required fields
      if (hotelData.name && hotelData.hotelDescription) {
        // Transform API data to match our hotel format
        const transformedHotel: HotelOption = {
          name: hotelData.name,
          price: Math.floor(Math.random() * 200) + 150, // Generate random price since API doesn't provide it
          rating: parseInt((4.0 + (Math.random() * 0.5)).toFixed(1)), // Generate random rating between 4.0-4.5
          stars: Math.floor(Math.random() * 2) + 3, // Generate random stars between 3-4
          description: hotelData.hotelDescription.replace(/<[^>]*>/g, ''), // Remove HTML tags
          isFromLiteApi: true // Flag to identify this as from LiteAPI
        };
        
        results.push(transformedHotel);
      }
    }
  } catch (error) {
    console.warn('Failed to fetch from LiteAPI:', error);
  }

  // Always add JSON data as fallback
  const destinationHotels = hotelsData.destinations.find(
    dest => dest.destinationName === destinationName
  );

  if (destinationHotels?.hotelsOptions) {
    const processedHotels = destinationHotels.hotelsOptions.map(hotel => {
      // Calculate starting price from rooms
      const startingPrice = hotel.rooms ? Math.min(...hotel.rooms.map(room => room.price)) : 0;
      
      return {
        ...hotel,
        price: startingPrice, // Use starting price as the main price
        startingPrice: startingPrice
      };
    });
    
    results.push(...processedHotels);
  }

  return results.reverse();
}
