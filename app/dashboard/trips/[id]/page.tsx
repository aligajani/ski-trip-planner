import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ResortOptionsCard } from "./resort-options-card";
import { ParticipantsCard } from "./participants-card";

interface TripDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function TripDetailPage({ params }: TripDetailPageProps) {
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
  }

  // Fetch participants for this trip
  const { data: participants, error: participantsError } = await supabase
    .from('participants')
    .select('id, participant_name, voted_destination_id, hotel_selected_slug, room_selected_slug')
    .eq('trip_id', id);

  if (participantsError) {
    console.error(participantsError);
  }

  // For now, use participants without user data until we set up proper user fetching
  const participantsWithUsers = participants || [];

  if (participantsError) {
    console.error(participantsError);
  }

  // Fetch destinations
  const { data: destinations, error: destinationsError } = await supabase
    .from('destinations')
    .select('*')
    .order('destination_name');

  if (destinationsError) {
    console.error(destinationsError);
  }

  // Calculate voting statistics
  const totalParticipants = participants?.length || 0;
  const votedParticipants = participants?.filter(p => p.voted_destination_id !== null).length || 0;
  const majorityThreshold = Math.ceil(totalParticipants / 2);

  // Count votes for each destination
  const voteCounts: { [key: number]: number } = {};
  participants?.forEach(participant => {
    if (participant.voted_destination_id) {
      voteCounts[participant.voted_destination_id] = (voteCounts[participant.voted_destination_id] || 0) + 1;
    }
  });

  // Find the destination with the most votes
  const winningDestinationId = Object.keys(voteCounts).reduce((a, b) => 
    voteCounts[parseInt(a)] > voteCounts[parseInt(b)] ? a : b, '0');

  const winningVoteCount = voteCounts[parseInt(winningDestinationId)] || 0;
  const hasMajority = winningVoteCount >= majorityThreshold && totalParticipants > 0;

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      {/* Header with back button */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Trips
          </Button>
        </Link>
      </div>

      {/* Trip Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{trip.trip_name}</h1>
          {trip.destination_id && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="default" className="bg-green-600">
                Destination Selected
              </Badge>
              <span className="text-muted-foreground">
                {destinations?.find(d => d.id === trip.destination_id)?.destination_name}
              </span>
            </div>
          )}
        </div>
        <Badge variant="secondary">Ski Trip</Badge>
      </div>

      {/* Voting Status */}
      {!trip.destination_id && (
        <Card>
          <CardHeader>
            <CardTitle>Voting Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Votes cast: {votedParticipants} / {totalParticipants}</span>
                <span>Majority needed: {majorityThreshold}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalParticipants > 0 ? (votedParticipants / totalParticipants) * 100 : 0}%` }}
                ></div>
              </div>
              {hasMajority && (
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="default" className="bg-green-600">
                    Majority Reached!
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {destinations?.find(d => d.id === parseInt(winningDestinationId))?.destination_name} has been selected
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trip Details Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <ResortOptionsCard
          destinations={destinations}
          voteCounts={voteCounts}
          winningDestinationId={winningDestinationId}
          hasMajority={hasMajority}
          tripDestinationId={trip.destination_id}
          tripId={id}
        />
        <ParticipantsCard 
          participants={participantsWithUsers} 
          destinationName={destinations?.find(d => d.id === trip.destination_id)?.destination_name}
          tripId={id}
        />
      </div>
    </div>
  );
}
