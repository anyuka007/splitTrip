import { ID } from "react-native-appwrite";
import { appwriteConfig, databases, account, getCurrentUser } from "./appwrite";
import useAuthStore from "@/store/auth.store";


export interface CreateTripParams {
    name: string;
    dateStart: string; // ISO date string
    dateEnd: string;
    defaultCurrency?: "EUR" | "USD" | "UAH" | "PLN";
    ownerId: string; 
    }


export const createTrip = async ({name, dateStart, dateEnd, defaultCurrency = "EUR",} : CreateTripParams) => {
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

