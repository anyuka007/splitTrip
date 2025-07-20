import { Models } from 'react-native-appwrite';

export interface User extends Models.Document {
    name: string;
    email: string;
    avatar: string;
}

export interface Trip extends Models.Document {
    name: string;
    dateStart: string; // ISO date string
    dateEnd: string; // ISO date string
    defaultCurrency: "EUR" | "USD" | "UAH" | "PLN";
    ownerId: string; // User ID of the trip owner
}

export interface Participant extends Models.Document {
    name: string;
    tripId: string; // ID of the trip this participant belongs to
}

export interface TabBarIconProps {
  name: string;
  title: string;
  focused: boolean;
  size?: number;
}

export interface CustomButtonProps {
    text: string;
    onPress?: () => void;
    classname?: string;
    disabled?: boolean
    isLoading?: boolean;
}
export interface CustomInputProps {
    placeholder?: string;
    value?: string;    
    label: string;
    secureTextEntry?: boolean;
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";onChangeText?: (text: string) => void;
}
export interface AvatarProps {
  name: string; 
}


export interface CreateUserParams {
    email: string;
    password: string;
    name: string;
}


export interface SignInParams {
    email: string;
    password: string;
}

export interface CreateTripParams {
    name: string;
    dateStart?: string; // ISO date string
    dateEnd: string;
    defaultCurrency?: "EUR" | "USD" | "UAH" | "PLN";
    //ownerId: string; 
    }
export interface CreateTripData {
    name: string;
    dateStart: string;
    dateEnd: string;
    defaultCurrency: "EUR" | "USD" | "UAH" | "PLN";
    ownerId: string;
}

export interface CreateParticipantParams {
    name: string;
    tripId: string; // ID of the trip this participant belongs to
}

export interface CreateParticipantData {
    name: string;
    tripId: string; 
}