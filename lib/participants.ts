import { CreateParticipantData, CreateParticipantParams, Participant } from "@/type";
import { deleteDocument, getDocument } from "@/utils/generics";
import { ID, Query } from "react-native-appwrite";
import { appwriteConfig, databases } from "./appwrite";

export const createParticipant = async ({ name, tripId }: CreateParticipantParams): Promise<Participant> => {
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
        //console.log("New participant created:", JSON.stringify(newParticipant, null, 2));
        return newParticipant;
    } catch (error) {
        console.error("Error creating participant:", error);
        throw error;
    }
}

export const getParticipantsByTripIds = async (tripIds: string[]): Promise<Participant[]> => {
    try {
        const response = await databases.listDocuments<Participant>(
            appwriteConfig.databaseId!,
            appwriteConfig.participantsCollectionId!,
            [Query.select(["*"]), Query.equal("tripId", tripIds)]
        );
        //console.log("bbbbb Participants for trips:", JSON.stringify(response.documents, null, 2));
        return response.documents;
    } catch (error) {
        console.error("Error fetching participants by trip IDs:", error);
        throw error;
    }
}

export const deleteParticipant = async (participantId: string): Promise<void> => {
    return await deleteDocument(participantId, appwriteConfig.participantsCollectionId!);
}


export const getParticipant = async (participantId: string): Promise<Participant> => {
    return await getDocument(participantId, appwriteConfig.participantsCollectionId!);
}

export const updateParticipant = async (participantId: string, newName: string): Promise<Participant> => {
    try {
        const updatedParticipant = await databases.updateDocument<Participant>(
            appwriteConfig.databaseId!,
            appwriteConfig.participantsCollectionId!,
            participantId,
            { name: newName }
        );
        //console.log("Participant updated successfully:", JSON.stringify(updatedParticipant, null, 2));
        return updatedParticipant;

    } catch (error) {
        console.error("Error updating participant:", error);
        throw error;
    }
}

