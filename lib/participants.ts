import { ID, Query } from "react-native-appwrite";
import { appwriteConfig, databases } from "./appwrite";
import { CreateParticipantData, CreateParticipantParams, Participant } from "@/type";

export const createParticipant = async ({name, tripId}: CreateParticipantParams): Promise<Participant> => {
    try {
        const participantData: CreateParticipantData = {
            name,
            tripId
        };
        const newParticipant = await databases.createDocument<Participant>(
            appwriteConfig.databaseId!,
            appwriteConfig.participantsCollectionId!,
            ID.unique(),
            participantData
        );
        console.log("New participant created:", JSON.stringify(newParticipant, null, 2));
        return newParticipant;
    } catch (error) {
        console.error("Error creating participant:", error);
        throw error;
    }
}

export const getParticipantsByTripId = async (tripId: string): Promise<Participant[]> => {
    try {
        const response = await databases.listDocuments<Participant>(
            appwriteConfig.databaseId!,
            appwriteConfig.participantsCollectionId!,
            [Query.equal("tripId", tripId)]
        );
        console.log("Participants for trip:", JSON.stringify(response.documents, null, 2));
        return response.documents;
    } catch (error) {
        console.error("Error fetching participants by trip ID:", error);
        throw error;
    }
}