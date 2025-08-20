"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function resetToTestMode() {
  try {
    const supabase = await createClient();

    // Reset trips table - clear destination_id
    const { error: tripsError } = await supabase
      .from('trips')
      .update({ destination_id: null })
      .neq('id', 0); // Update all trips

    if (tripsError) {
      console.error('Error resetting trips:', tripsError);
      return { success: false, error: "Failed to reset trips" };
    }

    // Reset participants table - clear voted_destination_id, hotel_selected_slug, and room_selected_slug
    const { error: participantsError } = await supabase
      .from('participants')
      .update({ 
        voted_destination_id: null,
        hotel_selected_slug: null,
        room_selected_slug: null
      })
      .neq('id', 0); // Update all participants

    if (participantsError) {
      console.error('Error resetting participants:', participantsError);
      return { success: false, error: "Failed to reset participants" };
    }

    // Revalidate the dashboard page to show updated state
    revalidatePath('/dashboard');

    return { success: true, message: "Database reset to test mode successfully!" };
  } catch (error) {
    console.error("Reset error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}
