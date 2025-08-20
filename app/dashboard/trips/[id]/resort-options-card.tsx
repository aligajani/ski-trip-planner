import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import Link from "next/link";
import { VoteButton } from "./vote-button";

interface Destination {
  id: number;
  destination_name: string;
  destination_country?: string;
}

interface ResortOptionsCardProps {
  destinations: Destination[] | null;
  voteCounts: { [key: number]: number };
  winningDestinationId: string;
  hasMajority: boolean;
  tripDestinationId: number | null;
  tripId: string;
}

export function ResortOptionsCard({
  destinations,
  voteCounts,
  winningDestinationId,
  hasMajority,
  tripDestinationId,
  tripId
}: ResortOptionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Resort Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        {destinations && destinations.length > 0 ? (
          <div className="space-y-3">
            {destinations.map((destination) => {
              const voteCount = voteCounts[destination.id] || 0;
              const isWinning = parseInt(winningDestinationId) === destination.id && hasMajority;
              
              return (
                <div key={destination.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{destination.destination_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {destination.destination_country || 'No country specified'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Votes: {voteCount}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isWinning && (
                      <>
                        <Badge variant="default" className="bg-green-600">
                          Selected
                        </Badge>
                        <Link href={`/dashboard/trips/${tripId}/hotels`}>
                          <Button size="sm" variant="outline">
                            Book Hotel
                          </Button>
                        </Link>
                      </>
                    )}
                    {!tripDestinationId && (
                      <VoteButton 
                        destinationId={destination.id} 
                        tripId={tripId}
                        disabled={hasMajority}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No destinations available</p>
            <Button className="mt-4" size="sm">
              Add Destination
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
