import { Models } from 'react-native-appwrite';

export interface User extends Models.Document {
    name: string;
    email: string;
    avatar: string;
}
