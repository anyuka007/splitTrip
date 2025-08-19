import { getDocument } from "@/utils/generics";
import { appwriteConfig, databases } from "./appwrite";
import { Expense, ExpenseData } from "@/type";
import { ID, Query } from "react-native-appwrite";

export const getExpensesByTripId = async (tripId: string): Promise<Expense[]> => {
    try {
        const response = await databases.listDocuments<Expense>(
            appwriteConfig.databaseId!,
            appwriteConfig.expensesCollectionId!,
            [Query.select(["*"]), Query.equal("tripId", tripId), Query.orderDesc("date"), Query.limit(500)]
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
        //console.log("New expense created:", JSON.stringify(response, null, 2));
        return response;
    } catch (error) {
        console.error("Error creating expense:", error);
        throw error;
    }
};

export const getExpense = async (expenseId: string): Promise<Expense> => {
    try {
        const expense = await getDocument<Expense>(expenseId, appwriteConfig.expensesCollectionId!);
        return expense;
    } catch (error) {
        console.error("Error fetching expense:", error);
        throw error;
    }
}

export const updateExpense = async (expenseId: string, expenseData: Partial<ExpenseData>): Promise<Expense> => {
    try {
        const response = await databases.updateDocument<Expense>(
            appwriteConfig.databaseId!,
            appwriteConfig.expensesCollectionId!,
            expenseId,
            expenseData
        );
        //console.log("Expense updated:", JSON.stringify(response, null, 2));
        return response;
    } catch (error) {
        console.error("Error updating expense:", error);
        throw error;
    }
};


export const deleteExpense = async (expenseId: string): Promise<void> => {
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId!,
            appwriteConfig.expensesCollectionId!,
            expenseId
        );
        //console.log("Expense deleted successfully");
    } catch (error) {
        console.error("Error deleting expense:", error);
        throw error;
    }
};