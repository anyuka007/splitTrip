import { getDocument } from "@/utils/generics";
import { appwriteConfig, databases } from "./appwrite";
import { Expense } from "@/type";
import { ID, Query } from "react-native-appwrite";
import { ExpenseData } from "@/app/trip/[tripId]/expense/create";

export const getExpensesByTripId = async (tripId: string): Promise<Expense[]> => {
    try {
        const response = await databases.listDocuments<Expense>(
            appwriteConfig.databaseId!,
            appwriteConfig.expensesCollectionId!,
            [Query.select(["*"]), Query.equal("tripId", tripId), Query.orderDesc("$createdAt")]
        );
        return response.documents;
    } catch (error) {
        console.error("Error fetching expenses by trip ID:", error);
        throw error;
    }
}


export const createExpense = async (expenseData: ExpenseData): Promise<Expense> => {
    try {
        const response = await databases.createDocument<Expense>(
            appwriteConfig.databaseId!,
            appwriteConfig.expensesCollectionId!,
            ID.unique(),
            expenseData
        );
        console.log("New expense created:", JSON.stringify(response, null, 2));
        return response;
    } catch (error) {
        console.error("Error creating expense:", error);
        throw error;
    }
};

