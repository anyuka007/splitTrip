import { Models } from 'react-native-appwrite';

export interface User extends Models.Document {
    name: string;
    email: string;
    avatar: string;
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