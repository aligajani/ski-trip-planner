import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResetTestButton } from "@/components/reset-test-button";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Fetch trips in the database
  const { data: trips, error } = await supabase
    .from('trips')
    .select(`
      *
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching trips:', error);
    return (
      <div className="flex-1 w-full flex flex-col gap-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-destructive">Error loading trips. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Ski Trips</h1>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">{trips?.length || 0} trips</Badge>
          <ResetTestButton />
        </div>
      </div>

      {trips && trips.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Card key={trip.id} className="hover:shadow-md transition-shadow relative">
              <div className="absolute top-4 right-4">
                <Badge variant="outline">Ski Trip</Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{trip.trip_name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href={`/dashboard/trips/${trip.id}`}>
                  <Button className="w-full">
                    Plan Trip
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">No trips yet</h3>
          <p className="text-muted-foreground mb-4">
            Start planning your next ski adventure by creating your first trip.
          </p>
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
            Create Trip
          </button>
        </div>
      )}
    </div>
  );
}
