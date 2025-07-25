import { create } from 'zustand';
import { Expense, TripWithParticipants } from '@/type';
import { getTripsWithParticipants, updateTrip, } from '@/lib/trips';
import { getExpensesByTripId } from '@/lib/expenses';


interface TripsState {
  // State
  trips: TripWithParticipants[];
  loading: boolean;
  error: string | null;
  expenses: Expense[];

  // Expenses State
  expensesByTrip: { [tripId: string]: Expense[] };
  expensesLoading: boolean;
  
  // Trip Actions
  fetchTrips: (userId: string) => Promise<void>;
  editTrip: (tripId: string, data: Partial<TripWithParticipants>) => Promise<void>;

// Expense Actions
  fetchExpenses: (tripId: string) => Promise<void>;

  //Selectors
  getExpensesForTrip: (tripId: string) => Expense[]
}

const useTripsStore = create<TripsState>((set, get) => ({
  // Initial State
  trips: [],
  loading: false,
  error: null,
  expenses: [],
  expensesByTrip: {},
  expensesLoading: false,

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


  editTrip: async (tripId: string, updateData: Partial<TripWithParticipants>) => {
    try {
      set({ loading: true, error: null });

      const editedTrip = await updateTrip(tripId, updateData);
      //console.log("Trip updated successfully:", JSON.stringify(editedTrip, null, 2));

      // Update Store - merge old trip with new data
      set((state) => ({
        trips: state.trips.map(trip =>
          trip.$id === tripId 
            ? { ...trip, ...updateData }
            : trip
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating trip:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update trip',
        loading: false 
      });
      throw error;
    }
  },

  fetchExpenses: async (tripId: string) => {
    try {
      set({ expensesLoading: true, error: null });
      const expenses = await getExpensesByTripId(tripId);
      //console.log("Expenses fetched successfully:", JSON.stringify(expenses, null, 2));

      set((state) => ({
        expensesByTrip: {
          ...state.expensesByTrip,
          [tripId]: expenses
        },
        expensesLoading: false
      }));
    } catch (error) {
      console.error('Error fetching expenses:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch expenses',
        expensesLoading: false 
      });
    }
  },

  // Selectors
  getExpensesForTrip: (tripId: string) => {
    return get().expensesByTrip[tripId] || [];
  }

}));

export default useTripsStore;