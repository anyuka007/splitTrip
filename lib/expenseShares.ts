import { ID } from "react-native-appwrite";
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