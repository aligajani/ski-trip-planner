'use client';

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

interface VoteButtonProps {
  destinationId: number;
  tripId: string;
  disabled?: boolean;
}

export function VoteButton({ destinationId, tripId, disabled }: VoteButtonProps) {
  const [isVoting, setIsVoting] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userVotedDestination, setUserVotedDestination] = useState<number | null>(null);
  const router = useRouter();
  const supabase = createClient();

  // Get current user on component mount
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setCurrentUser(session?.user || null);
      
      // Check if current user has already voted and for which destination
      if (session?.user) {
        const { data: participant } = await supabase
          .from('participants')
          .select('voted_destination_id')
          .eq('trip_id', tripId)
          .eq('participant_id', session.user.id)
          .single();
        
        setUserVotedDestination(participant?.voted_destination_id || null);
      }
    };

    getCurrentUser();
  }, [tripId, supabase]);

  const handleVote = async () => {
    if (disabled || isVoting || !currentUser || userVotedDestination !== null) return;
    
    setIsVoting(true);
    
    try {
      // Find the current user's participant record for this trip
      const { data: participant, error: participantError } = await supabase
        .from('participants')
        .select('*')
        .eq('trip_id', tripId)
        .eq('participant_id', currentUser.id)
        .single();

      if (participantError || !participant) {
        alert('You are not a participant in this trip');
        return;
      }

      // Check if user has already voted
      if (participant.voted_destination_id !== null) {
        alert('You have already voted in this trip');
        setUserVotedDestination(participant.voted_destination_id);
        return;
      }

      // Update the current user's vote
      const { error: voteError } = await supabase
        .from('participants')
        .update({ voted_destination_id: destinationId })
        .eq('id', participant.id);

      if (voteError) {
        throw voteError;
      }

      setUserVotedDestination(destinationId);

      // Check if majority has been reached
      const { data: allParticipants, error: allParticipantsError } = await supabase
        .from('participants')
        .select('*')
        .eq('trip_id', tripId);

      if (allParticipantsError) {
        throw allParticipantsError;
      }

      const totalParticipants = allParticipants.length;
      const votedParticipants = allParticipants.filter(p => p.voted_destination_id !== null);
      
      // Count votes for each destination
      const voteCounts: { [key: number]: number } = {};
      votedParticipants.forEach(p => {
        if (p.voted_destination_id) {
          voteCounts[p.voted_destination_id] = (voteCounts[p.voted_destination_id] || 0) + 1;
        }
      });

      // Find the destination with the most votes
      const winningDestinationId = Object.keys(voteCounts).reduce((a, b) => 
        voteCounts[parseInt(a)] > voteCounts[parseInt(b)] ? a : b, '0');

      const winningVoteCount = voteCounts[parseInt(winningDestinationId)] || 0;
      const majorityThreshold = Math.ceil(totalParticipants / 2);

      // If majority is reached, update the trip destination
      if (winningVoteCount >= majorityThreshold && totalParticipants > 0) {
        const { error: tripUpdateError } = await supabase
          .from('trips')
          .update({ destination_id: parseInt(winningDestinationId) })
          .eq('id', tripId);

        if (tripUpdateError) {
          throw tripUpdateError;
        }
      }

      // Refresh the page to show updated voting status
      router.refresh();
      
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to vote. Please try again.');
    } finally {
      setIsVoting(false);
    }
  };

  // Check if user has voted for this specific destination
  const hasVotedForThisDestination = userVotedDestination === destinationId;

  // Don't show vote button if user has already voted for this destination
  if (hasVotedForThisDestination) {
    return (
      <Button 
        size="sm" 
        variant="secondary"
        disabled
      >
        Voted
      </Button>
    );
  }

  return (
    <Button 
      size="sm" 
      onClick={handleVote}
      disabled={disabled || isVoting || !currentUser || userVotedDestination !== null}
    >
      {isVoting ? 'Voting...' : 'Vote'}
    </Button>
  );
}
