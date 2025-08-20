"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bed, Users, Euro, Wifi, Car, Utensils, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { bookHotelRoom, getParticipantBooking } from "@/lib/booking-service";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { User } from "@supabase/supabase-js";

interface Room {
  id: string;
  name: string;
  type: string;
  capacity: number;
  price: number;
  amenities: string[];
  description: string;
  available: boolean;
}

interface RoomCardProps {
  room: Room;
  hotelName: string;
  tripId: string;
  hotelSlug: string;
}

export function RoomCard({ room, hotelName, tripId, hotelSlug }: RoomCardProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkBookingStatus = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setCurrentUser(user);
        const booking = await getParticipantBooking(tripId, user.id);
        if (booking && booking.hotel_selected_slug === hotelSlug && booking.room_selected_slug === room.id) {
          setIsBooked(true);
        }
      }
    };

    checkBookingStatus();
  }, [tripId, hotelSlug, room.id]);

  const handleBooking = async () => {
    if (!currentUser) {
      toast.error("Please log in to book a room");
      return;
    }

    setIsBooking(true);
    
    try {
      const result = await bookHotelRoom(tripId, hotelSlug, room.id);
      
      if (result.success) {
        setIsBooked(true);
        
        // Show success toast with timer
        toast.success("Room booked successfully!", {
          description: "Redirecting in 2 seconds...",
          duration: 3000,
          action: {
            label: "Go Now",
            onClick: () => router.push(`/dashboard/trips/${tripId}`)
          }
        });
        
        // Redirect after 3 seconds
        setTimeout(() => {
          router.push(`/dashboard/trips/${tripId}`);
        }, 2000);
      } else {
        toast.error(result.error || "Failed to book room");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsBooking(false);
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi':
        return <Wifi className="w-4 h-4" />;
      case 'parking':
        return <Car className="w-4 h-4" />;
      case 'breakfast':
        return <Utensils className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className={`overflow-hidden ${isBooked ? 'ring-2 ring-green-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg">{room.name}</CardTitle>
          <div className="flex items-center gap-2">
            {isBooked && (
              <Badge variant="default" className="bg-green-600">
                <CheckCircle className="w-3 h-3 mr-1" />
                Booked
              </Badge>
            )}
            <Badge variant={room.available ? "default" : "secondary"}>
              {room.available ? "Available" : "Unavailable"}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{room.type}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Up to {room.capacity} guests</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {room.description}
        </p>
        
        {/* Amenities */}
        {room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {room.amenities.map((amenity, index) => (
              <div key={index} className="flex items-center gap-1 text-xs text-muted-foreground">
                {getAmenityIcon(amenity)}
                <span>{amenity}</span>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Euro className="w-4 h-4 text-muted-foreground" />
            <span className="text-xl font-bold">€{room.price}</span>
            <span className="text-sm text-muted-foreground">/night</span>
          </div>
          <Button 
            size="sm" 
            disabled={!room.available || isBooking || isBooked}
            onClick={handleBooking}
            className={isBooked ? "bg-green-600 hover:bg-green-700" : ""}
          >
            {isBooking ? (
              "Booking..."
            ) : isBooked ? (
              <>
                <CheckCircle className="w-4 h-4 mr-1" />
                Booked
              </>
            ) : room.available ? (
              "Book Room"
            ) : (
              "Unavailable"
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
