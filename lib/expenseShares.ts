import { ID, Query } from "react-native-appwrite";
import { appwriteConfig, databases } from "./appwrite";
import { ExpenseShare, CreateExpenseShareData } from "@/type";

export const createExpenseShare = async (shareData: CreateExpenseShareData): Promise<ExpenseShare> => {
  try {
    const response = await databases.createDocument<ExpenseShare>(
      appwriteConfig.databaseId!,
      appwriteConfig.expenseSharesCollectionId!,
      ID.unique(),
      shareData
    );
    return response;
  } catch (error) {
    console.error("Error creating expense share:", error);
    throw error;
  }
};

export const getExpenseSharesByExpenseId = async (expenseId: string): Promise<ExpenseShare[]> => {
  try {
    const response = await databases.listDocuments<ExpenseShare>(
      appwriteConfig.databaseId!,
      appwriteConfig.expenseSharesCollectionId!,
      [Query.select(["*"]), Query.equal("expenseId", [expenseId])]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching expense shares:", error);
    throw error;
  }
}

export const getExpenseSharesByTripId = async (tripId: string): Promise<ExpenseShare[]> => {
  try {
    const response = await databases.listDocuments<ExpenseShare>(
      appwriteConfig.databaseId!,
      appwriteConfig.expenseSharesCollectionId!,
      [Query.select(["*"]), Query.equal("tripId", [tripId]), Query.limit(500)]
    );
    return response.documents;
  } catch (error) {
    console.error("Error fetching expense shares by trip:", error);
    throw error;
  }
};
