"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function bookHotelRoom(
  tripId: string,
  hotelSlug: string,
  roomSlug: string
) {
  try {
    const supabase = await createClient();

    // Get the current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { success: false, error: "User not authenticated" };
    }

    // Check if the user is already a participant in this trip
    const { data: existingParticipant, error: participantError } = await supabase
      .from('participants')
      .select('*')
      .eq('trip_id', tripId)
      .eq('participant_id', user.id)
      .single();

    if (participantError) {
      return { success: false, error: "Error checking participant status" };
    }

    if (existingParticipant) {
      // Update existing participant with hotel and room selection
      const { error: updateError } = await supabase
        .from('participants')
        .update({
          hotel_selected_slug: hotelSlug,
          room_selected_slug: roomSlug,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingParticipant.id);

      if (updateError) {
        return { success: false, error: "Failed to update booking" };
      }
    } 

    // // Revalidate the page to show updated booking status
    revalidatePath(`/dashboard/trips/${tripId}/hotels`);
    revalidatePath(`/dashboard/trips/${tripId}/hotels/rooms`);

    return { success: true, message: "Room booked successfully!" };
  } catch (error) {
    console.error("Booking error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

export async function getParticipantBooking(tripId: string, userId: string) {
  try {
    const supabase = await createClient();

    const { data: participant, error } = await supabase
      .from('participants')
      .select('hotel_selected_slug, room_selected_slug')
      .eq('trip_id', tripId)
      .eq('participant_id', userId)
      .single();

    if (error) {
      return { success: false, error: "Error fetching participant booking" };
    }

    return participant;
  } catch (error) {
    console.error("Error fetching participant booking:", error);
    return null;
  }
}
