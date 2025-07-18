import { ID, Query } from "react-native-appwrite";
import { appwriteConfig, databases, account, getCurrentUser } from "./appwrite";
import useAuthStore from "@/store/auth.store";


export interface CreateTripParams {
    name: string;
    dateStart?: string; // ISO date string
    dateEnd: string;
    defaultCurrency?: "EUR" | "USD" | "UAH" | "PLN";
    ownerId: string; 
    }


export const createTrip = async ({name, dateStart=new Date().toISOString(), dateEnd, defaultCurrency = "EUR",} : CreateTripParams) => {
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

        const tripData = {
            name,
            dateStart: startDate,
            dateEnd: endDate,
            defaultCurrency,
            ownerId 
        };
        const newTrip = await databases.createDocument(
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


export const getUsersTrips = async (userId: string) => {
    try {
        const response = await databases.listDocuments(
            appwriteConfig.databaseId!,
            appwriteConfig.tripsCollectionId!,
            [Query.equal("ownerId", userId)]
        );
        //console.log("User's trips:", JSON.stringify(response.documents, null, 2));
        return response.documents;
    } catch (error) {
        console.error("Error fetching user's trips:", error);
        throw error;
    }
}

export const getTrip = async (tripId: string) => {
    try {
        const trip = await databases.getDocument(
            appwriteConfig.databaseId!,
            appwriteConfig.tripsCollectionId!,
            tripId
        );
        console.log("Trip details:", JSON.stringify(trip, null, 2));
        return trip;
    } catch (error) {
        console.error("Error fetching trip by ID:", error);
        throw error;
    }
}

export const deleteTrip = async (tripId: string): Promise<void> => {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId!,
            appwriteConfig.tripsCollectionId!,
            tripId
        );
        console.log("Trip deleted successfully")
    } catch (error) {
        console.error("Error deleting trip:", error);
        throw error;
    }
}
