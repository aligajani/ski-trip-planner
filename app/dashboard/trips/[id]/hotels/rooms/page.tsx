import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Hotel } from "lucide-react";
import Link from "next/link";
import { RoomCard } from "./room-card";
import { getHotelsForDestination } from "@/lib/hotel-service";

interface RoomsPageProps {
  params: {
    id: string;
  };
  searchParams: {
    hotel?: string;
  };
}

// Helper function to convert room data to our room card format
function convertRoomData(room: any) {
  return {
    id: room.id,
    name: room.name,
    type: room.name.split(' ')[0], // Extract room type from name
    capacity: parseInt(room.occupancy.split(' ')[0]), // Extract number from "X guests"
    price: room.price,
    amenities: ["Wifi", "Breakfast"], // Default amenities - could be enhanced
    description: room.description,
    available: true, // Assume available for now
  };
}

export default async function RoomsPage({ params, searchParams }: RoomsPageProps) {
  const supabase = await createClient();
  const { id } = await params;
  const hotelName = searchParams.hotel || "Hotel";

  // Fetch the specific trip
  const { data: trip, error } = await supabase
    .from('trips')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !trip) {
    console.error(error);
    return <div>Error loading trip</div>;
  }

  // Fetch destinations to get the selected destination name
  const { data: destinations, error: destinationsError } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', trip.destination_id)
    .single();

  if (destinationsError || !destinations) {
    console.error(destinationsError);
    return <div>Error loading destination</div>;
  }

  // Fetch hotels for the destination and find the specific hotel
  const hotels = await getHotelsForDestination(destinations.destination_name);
  const selectedHotel = hotels.find(hotel => hotel.name === hotelName);
  
  // Get rooms for the selected hotel
  const rooms = selectedHotel?.rooms ? selectedHotel.rooms.map(convertRoomData) : [];
  const hotelSlug = selectedHotel?.id || "";

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/trips/${id}/hotels`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Hotels
          </Button>
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Available Rooms</h1>
          <div className="flex items-center gap-2 mt-2">
            <Hotel className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">{hotelName}</span>
            <span className="text-muted-foreground">•</span>
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {destinations.destination_name}, {destinations.destination_country}
            </span>
          </div>
        </div>
        <Badge variant="secondary">Ski Trip</Badge>
      </div>

      {/* Rooms Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <RoomCard 
            key={room.id} 
            room={room} 
            hotelName={hotelName}
            tripId={id}
            hotelSlug={hotelSlug}
          />
        ))}
      </div>

      {/* No rooms fallback */}
      {rooms.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Hotel className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No rooms available for this hotel</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
