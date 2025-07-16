import SignIn from '@/app/(auth)/sign-in';
import { Account, Client, Databases, ID } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
    platform: "com.ap.splittrip",
    projectId : process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
    databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID,
    userCollectionId: process.env.EXPO_PUBLIC_APPWRITE_USER_COLLECTION_ID,

}

export const client = new Client() // Initialize the Appwrite client

client
    .setEndpoint(appwriteConfig.endpoint!) 
    .setProject(appwriteConfig.projectId!)
    .setPlatform(appwriteConfig.platform) 
    
    
export const account = new Account(client); // Use this only for development, not recommended for production
export const databases = new Databases(client); // Use this only for development, not recommended for production

interface CreateUserParams {
    email: string;
    password: string;
    name: string;
}

export const createUser = async ({email, password, name }: CreateUserParams ) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name);

        if(!newAccount) {
            throw new Error("User creation failed");
        }

        await signIn({ email, password });

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId!,
            appwriteConfig.userCollectionId!,
            ID.unique(),
            {accountId: newAccount.$id, email, name}
        );

        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        throw error;
    }

}
interface SignInParams {
    email: string;
    password: string;
}

export const signIn = async ({ email, password }: SignInParams) => {

    try {
        const session = await account.createEmailPasswordSession(email, password);
        
    } catch (error) {
        console.error("Error signing in:", error);
        throw error;
        
    }
}