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

import { ImageSourcePropType, KeyboardTypeOptions } from "react-native";
import { SharedValue } from "react-native-reanimated";

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

export interface CustomPickerProps {
  selectedValue: string;
  onValueChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
}

export interface CalorieSummaryCardProps {
  totalCalories: number;
  dailyGoal: number;
  goalLabel: string;
}

export interface DailyChartProps {
  stats: {
    calories: number;
    calorieGoal: number;
    water: number;
    waterGoal: number;
  };
  onRefresh: () => void;
}

export interface HomeStatusCardProps {
  title: string;
  value?: string | number;
  label?: string;
  icon: any;
  iconColor: string;
  gradientColors: [string, string];
  onPress: () => void;
}

export interface MealCardProps {
  name: string;
  description: string;
  onPress: () => void;
}

export interface MealSectionProps {
  title: string;
  iconName: string;
  meals: MealLogEntry[];
  onAddPress: () => void;
}

export interface MenuItemProps {
  icon: any;
  label: string;
  onPress: () => void;
  color: string;
  isDestructive?: boolean;
  hideBorder?: boolean;
}

export interface OnboardingItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    image: ImageSourcePropType;
  };
}

export interface ProgressGridProps {
  calories: number;
  calorieGoal: number;
  water: number;
  waterGoal: number;
}

export interface RecipeCardProps {
  recipe: any;
  single?: boolean;
  onPress?: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export interface OnboardingPaginationProps {
  data: any[];
  scrollX: SharedValue<number>;
}

export interface RecipeDetailModalProps {
  recipe: any;
  visible: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onShare: (recipe: any) => void;
}

export interface StatTileProps {
  label: string;
  value: string;
  unit?: string;
  icon: any;
  color: string;
  bg: string;
}

export interface WaterBottleProps {
  intake: number;
  goal: number;
  glassSize: number;
}

export interface WaterControlsProps {
  onAdd: () => void;
  onRemove: () => void;
  customGoal: string;
  setCustomGoal: (val: string) => void;
  onSetNewGoal: () => void;
  onReset: () => void;
}
