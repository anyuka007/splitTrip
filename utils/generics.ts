import { appwriteConfig, databases } from "@/lib/appwrite";
import { Models } from "react-native-appwrite";


// fetch a document by ID from a specific collection
// This is a generic function that can be used for any document type

export const getDocument = async<T extends Models.Document> (id: string, collectionId: string): Promise<T> => {
    try {
        const document = await databases.getDocument<T>(
            appwriteConfig.databaseId!,
            collectionId,
            id
        );
        console.log("Document details:", JSON.stringify(document, null, 2));
        return document;
    } catch (error) {
        console.error("Error fetching document by ID:", error);
        throw error;
    }
}