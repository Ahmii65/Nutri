export interface UserProfile {
  uid: string;
  email: string | null;
  firstName?: string;
  lastName?: string;
  gender?: string;
  age?: string | number;
  height?: string | number;
  weight?: string | number;
  createdAt?: any;
  username?: string;
  bio?: string;
  goals?: string[];
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  time: string;
}

export interface ChatContextType {
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  isTyping: boolean;
}

export type RootStackParamList = {
  index: undefined;
  Login: undefined;
  Registration: undefined;
  Register2: {
    firstName: string;
    lastName: string;
    email?: string;
    password?: string;
  };
  ForgotPassword: undefined;
  "(tabs)": undefined;
  BMICalculator: undefined;
  CaloriesScreen: undefined;
  WaterScreen: undefined;
  MealLogScreen: undefined;
  NotificationScreen: undefined;
  RecipeSuggestionScreen: undefined;
  AiAssistant: undefined;
  // Add other screens here
};

export interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<any>;
  saveUserProfile: (uid: string, data: Partial<UserProfile>) => Promise<void>;
  register: (
    email: string,
    password: string,
    additionalData: any,
  ) => Promise<any>;
  logout: () => Promise<void>;
}

export interface MealItem {
  id: number;
  name: string;
  calories: string;
  time: string;
  icon: string;
  color: string;
}

export interface MealLogEntry {
  name: string;
  calories: number;
}

export interface MealLogState {
  Breakfast: MealLogEntry[];
  Lunch: MealLogEntry[];
  Dinner: MealLogEntry[];
  Snacks: MealLogEntry[];
}

export interface NotificationItem {
  id: number;
  title: string;
  date: string;
  color: string;
}

import { KeyboardTypeOptions } from "react-native";

export interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  multiline?: boolean;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: string;
}

export interface OptionItem {
  label: string;
  value: string;
}

export interface CustomPickerProps {
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: OptionItem[];
  placeholder: string;
}

export interface Nutritionist {
  id: number;
  name: string;
  role: string;
  online: boolean;
}

export interface ProfileState {
  fullName: string;
  username: string;
  bio: string;
  heightFeet: string;
  heightInches: string;
  weight: string;
  age: string;
  gender: string;
  goals: string[];
}
