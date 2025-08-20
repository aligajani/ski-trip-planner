import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { HotelCard } from "@/app/dashboard/trips/[id]/hotels/hotel-card";
import { getHotelsForDestination } from "@/lib/hotel-service";

interface HotelsPageProps {
  params: {
    id: string;
  };
}

export default async function HotelsPage({ params }: HotelsPageProps) {
  const supabase = await createClient();
  const { id } = await params;

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

  // Fetch hotels for the selected destination using the API service
  const hotels = await getHotelsForDestination(destinations.destination_name);

  if (!hotels || hotels.length === 0) {
    return <div>No hotels found for this destination</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/trips/${id}`}>
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Trip
          </Button>
        </Link>
      </div>

      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Hotel Options</h1>
          <div className="flex items-center gap-2 mt-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              {destinations.destination_name}, {destinations.destination_country}
            </span>
          </div>
        </div>
        <Badge variant="secondary">Ski Trip</Badge>
      </div>

      {/* Hotels Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {hotels.map((hotel, index) => (
          <HotelCard key={index} hotel={hotel} index={index} tripId={id} />
        ))}
      </div>

      {/* No hotels fallback */}
      {hotels.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No hotels available for this destination</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
