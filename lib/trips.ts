import { ID, Query } from "react-native-appwrite";
import { appwriteConfig, databases, getCurrentUser } from "./appwrite";
import { CreateTripData, CreateTripParams, Participant, Trip, TripWithParticipants } from "@/type";
import { deleteDocument, getDocument } from "@/utils/generics";
import { getParticipantsByTripIds } from "./participants";


export const createTrip = async ({ name, dateStart = new Date().toISOString(), dateEnd, defaultCurrency = "EUR", }: CreateTripParams): Promise<Trip> => {
    try {
        // get the current user
        const user = await getCurrentUser();
        if (!user) {
            throw new Error("User is not authenticated");
        }
        const ownerId = user.$id;
        //console.log("ownerID: ", ownerId); 

        // Convert Date to ISO string if necessary
        const startDate = new Date(dateStart).toISOString();
        const endDate = new Date(dateEnd).toISOString();

        const tripData: CreateTripData = {
            name,
            dateStart: startDate,
            dateEnd: endDate,
            defaultCurrency,
            ownerId
        };
        const newTrip = await databases.createDocument<Trip>(
            appwriteConfig.databaseId!,
            appwriteConfig.tripsCollectionId!,
            ID.unique(),
            tripData
        );
        //console.log("New trip created:", JSON.stringify(newTrip, null, 2));

        return newTrip;
    } catch (error) {
        console.error("Error creating trip:", error);
        throw error;
    }
}


export const getUsersTrips = async (userId: string): Promise<Trip[]> => {
    try {
        const response = await databases.listDocuments<Trip>(
            appwriteConfig.databaseId!,
            appwriteConfig.tripsCollectionId!,
            [Query.select(["*"]), Query.equal("ownerId", userId)]
        );
        //console.log("User's trips:", JSON.stringify(response.documents, null, 2));
        return response.documents;
    } catch (error) {
        console.error("Error fetching user's trips:", error);
        throw error;
    }
}

export const getTripsWithParticipants = async (userId: string): Promise<TripWithParticipants[]> => {
    try {
        const trips = await getUsersTrips(userId);

        const tripsIds = trips.map(trip => trip.$id);
        // Fetch participants for the trips
        const participants = await getParticipantsByTripIds(tripsIds);
        //console.log("aaaaa Fetched participants:", JSON.stringify(participants, null, 2));

        // Map trips to include participants
        const tripsWithParticipants: TripWithParticipants[] = trips.map(trip => {
            const tripParticipants = participants.filter(participant => participant.tripId === trip.$id);
            return {
                ...trip,
                participants: tripParticipants
            };
        });
        //console.log("Trips with participants:", JSON.stringify(tripsWithParticipants, null, 2));
        return tripsWithParticipants;
    } catch (error) {
        console.error("Error fetching trips with participants:", error);
        throw error;
    }
}

export const getTrip = async (tripId: string): Promise<Trip> => {
    return await getDocument<Trip>(tripId, appwriteConfig.tripsCollectionId!);
}
export const deleteTrip = async (tripId: string): Promise<void> => {
    return await deleteDocument(tripId, appwriteConfig.tripsCollectionId!);
}

/* export const getExpenses = async (expenseId: string): Promise<Expense> => {
    return await getDocument<Expense>(expenseId, appwriteConfig.expensesCollectionId!);
} */

export const updateTrip = async (tripId: string, updateData: Partial<CreateTripParams>): Promise<Trip> => {
    try {
        const updatedTrip = await databases.updateDocument<Trip>(
            appwriteConfig.databaseId!,
            appwriteConfig.tripsCollectionId!,
            tripId,
            updateData
        );
        //console.log("Trip updated successfully:", JSON.stringify(updatedTrip, null, 2));
        return updatedTrip;

    } catch (error) {
        console.error("Error updating trip:", error);
        throw error;
    }

}