import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Hotel, Bed, Edit } from "lucide-react";
import { getHotelsForDestination } from "@/lib/hotel-service";
import Link from "next/link";

interface Participant {
  id: number;
  participant_name?: string;
  voted_destination_id: number | null;
  hotel_selected_slug?: string | null;
  room_selected_slug?: string | null;
}

interface ParticipantsCardProps {
  participants: Participant[] | null;
  destinationName?: string;
  tripId: string;
}

export async function ParticipantsCard({ participants, destinationName, tripId }: ParticipantsCardProps) {
  // Helper function to get hotel and room names from slugs
  const getBookingDetails = async (hotelSlug: string, roomSlug: string) => {
    if (!destinationName) {
      return { hotelName: hotelSlug, roomName: roomSlug };
    }
    
    try {
      const hotels = await getHotelsForDestination(destinationName);
      const hotel = hotels.find((h: any) => h.id === hotelSlug);
      
      if (hotel) {
        const room = hotel.rooms?.find((r: any) => r.id === roomSlug);
        return {
          hotelName: hotel.name,
          roomName: room?.name || roomSlug
        };
      }
    } catch (error) {
      console.error('Error fetching hotel details:', error);
    }
    
    // Fallback to formatted slug
    const formatSlug = (slug: string) => {
      return slug
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };
    
    return { 
      hotelName: formatSlug(hotelSlug), 
      roomName: formatSlug(roomSlug) 
    };
  };

  // Get booking details for all participants
  const participantsWithBookings = await Promise.all(
    (participants || []).map(async (participant) => {
      const bookingDetails = participant.hotel_selected_slug && participant.room_selected_slug 
        ? await getBookingDetails(participant.hotel_selected_slug, participant.room_selected_slug)
        : null;
      
      return { ...participant, bookingDetails };
    })
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Participants ({participants?.length || 0})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {participantsWithBookings && participantsWithBookings.length > 0 ? (
          <div className="space-y-3">
            {participantsWithBookings.map((participant) => (
              <div key={participant.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-muted rounded-lg gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">
                    {participant.participant_name || 'Unknown User'}
                  </p>
                  {participant.bookingDetails && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Hotel className="w-3 h-3 flex-shrink-0" />
                        <span className="font-medium text-foreground truncate">{participant.bookingDetails.hotelName}</span>
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center gap-1">
                        <Bed className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{participant.bookingDetails.roomName}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {participant.hotel_selected_slug && (
                    <>
                      <Badge variant="default" className="bg-green-600 whitespace-nowrap">
                        <Hotel className="w-3 h-3 mr-1" />
                        Booked
                      </Badge>
                      <Link href={`/dashboard/trips/${tripId}/hotels`}>
                        <Button size="sm" variant="outline" className="whitespace-nowrap">
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                      </Link>
                    </>
                  )}
                  <Badge variant={participant.voted_destination_id ? "default" : "secondary"} className="whitespace-nowrap">
                    {participant.voted_destination_id ? "Voted" : "Not Voted"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No participants yet</p>
            <Button className="mt-4" size="sm">
              Invite Participants
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
