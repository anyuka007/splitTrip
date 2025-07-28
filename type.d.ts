import { Key } from 'react';
import { Models } from 'react-native-appwrite';
import { KeyboardTypeOptions } from 'react-native';

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

export interface TripWithParticipants extends Trip {
    participants: Participant[];
}


export interface Participant extends Models.Document {
    name: string;
    tripId: string; // ID of the trip this participant belongs to
}

export interface Expense extends Models.Document {
    description: string;
    amount: number;
    currency: "EUR" | "USD" | "UAH" | "PLN";
    date: Date; // ISO date string
    type: "shared" | "individual" | "sponsored";
    conversionRate?: number; // Optional
    convertedAmount?: number; // Optional
    tripId: string; // ID of the trip this expense belongs to
    payerId: string; // ID of the participant who paid for the expense
}

export type ExpenseLike = Pick<Expense, 'description' | 'amount' | 'currency' | 'date' | 'type' | 'conversionRate' | 'convertedAmount' | 'tripId' | 'payerId'>;

export interface ExpenseData {
  description: string;
  amount: number;
  currency: string;
  date: Date;
  type: ExpenseType;
  conversionRate?: number;
  convertedAmount?: number;
  tripId: string;
  payerId: string;
}

export interface Share {
  participantId: string;
  share: number;
}

export interface ExpenseShare extends Models.Document {
  tripId: string;
  expenseId: string;
  participantId: string;
  amount: number;
}

export interface CreateExpenseShareData {
  tripId: string;
  expenseId: string;
  participantId: string;
  amount: number;
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
    label?: string;
    labelClassName?: string;
    secureTextEntry?: boolean;
    keyboardType?: KeyboardTypeOptions;
    onChangeText?: (text: string) => void;
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
    dateStart: string; // ISO date string
    dateEnd: string;
    defaultCurrency: "EUR" | "USD" | "UAH" | "PLN";
    //ownerId: string; 
    }
export interface CreateTripData {
    name: string;
    dateStart: string;
    dateEnd: string;
    defaultCurrency: "EUR" | "USD" | "UAH" | "PLN";
    ownerId: string;
}

export interface UpdateTripParams {
    id: string;
    name?: string;
    dateStart?: string; // ISO date string
    dateEnd?: string; // ISO date string
    defaultCurrency?: "EUR" | "USD" | "UAH" | "PLN";
}

export interface UpdateTripData {
    name?: string;
    dateStart?: string; // ISO date string
    dateEnd?: string; // ISO date string
    defaultCurrency?: "EUR" | "USD" | "UAH" | "PLN";
}

export type Currency = "EUR" | "USD" | "UAH" | "PLN";

export type ExpenseType = "individual" | "shared" | "sponsored";

export interface TripFormData {
    name: string;
    startDate: Date;
    endDate: Date;
    defaultCurrency: Currency;
}

export interface CreateParticipantParams {
    name: string;
    tripId: string; // ID of the trip this participant belongs to
}

export interface CreateParticipantData {
    name: string;
    tripId: string; 
}

