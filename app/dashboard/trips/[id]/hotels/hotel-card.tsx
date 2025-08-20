import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Euro, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Hotel {
  name: string;
  stars: number;
  rating: number;
  description: string;
  price: number;
  startingPrice?: number;
  isFromLiteApi?: boolean;
}

interface HotelCardProps {
  hotel: Hotel;
  index: number;
  tripId: string;
}

export function HotelCard({ hotel, index, tripId }: HotelCardProps) {
  return (
    <Card key={index} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{hotel.name}</CardTitle>
          <div className="flex items-center gap-1">
            {[...Array(hotel.stars)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>★ {hotel.rating}</span>
          <span>•</span>
          <span>{hotel.stars} stars</span>
          {hotel.isFromLiteApi && (
            <>
              <span>•</span>
              <Badge variant="secondary" className="text-xs">
                <Globe className="w-3 h-3 mr-1" />
                Live Data
              </Badge>
            </>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {hotel.description}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Euro className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Starting from</span>
            <span className="text-xl font-bold">€{hotel.startingPrice || hotel.price}</span>
            <span className="text-sm text-muted-foreground">/night</span>
          </div>
          <Link href={`/dashboard/trips/${tripId}/hotels/rooms?hotel=${encodeURIComponent(hotel.name)}`}>
            <Button size="sm">
              Book Now
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
