import { create } from 'zustand';
import { TripWithParticipants } from '@/type';
import { getTripsWithParticipants, } from '@/lib/trips';


interface TripsState {
  // State
  trips: TripWithParticipants[];
  loading: boolean;
  error: string | null;
  
  // Trip Actions
  fetchTrips: (userId: string) => Promise<void>;
}

const useTripsStore = create<TripsState>((set, get) => ({
  // Initial State
  trips: [],
  loading: false,
  error: null,

  // Trip Actions
  fetchTrips: async (userId: string) => {
    try {
      set({ loading: true, error: null });
      const trips = await getTripsWithParticipants(userId);
      set({ trips, loading: false });
    } catch (error) {
      console.error('Error fetching trips:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch trips',
        loading: false 
      });
    }
  },

  
}));

export default useTripsStore;