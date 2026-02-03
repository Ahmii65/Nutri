export const AI_SUGGESTIONS = [
  { id: "1", text: "Create a meal plan for weight loss", icon: "food-apple" },
  { id: "2", text: "How much protein do I need?", icon: "arm-flex" },
  { id: "3", text: "Healthy snack ideas", icon: "food-croissant" },
  { id: "4", text: "Explain macronutrients", icon: "chart-pie" },
];

export const FOOD_CALORIE_DATA = [
  { name: "Apple", calories: 95, icon: "nutrition" },
  { name: "Banana", calories: 105, icon: "nutrition" },
  { name: "Boiled Egg", calories: 78, icon: "egg" },
  { name: "Omelette", calories: 250, icon: "egg" },
  { name: "Grilled Chicken", calories: 450, icon: "restaurant" },
  { name: "Rice", calories: 200, icon: "leaf" },
  { name: "Chapati", calories: 120, icon: "leaf" },
  { name: "Burger", calories: 295, icon: "fast-food" },
  { name: "Pizza Slice", calories: 285, icon: "pizza" },
  { name: "Salad", calories: 150, icon: "leaf" },
];

export const WEEKLY_DATA = [
  { value: 1800, label: "Mon" },
  { value: 2100, label: "Tue" },
  { value: 1950, label: "Wed" },
  { value: 2200, label: "Thu" },
  { value: 2400, label: "Fri" },
  { value: 2100, label: "Sat" },
  { value: 1900, label: "Sun" },
];

export const MONTHLY_DATA = [
  {
    value: 14500,
    label: "Week 1",
    frontColor: "#4facfe",
    topLabelComponent: "14.5k",
  },
  {
    value: 15800,
    label: "Week 2",
    frontColor: "#4facfe",
    topLabelComponent: "15.8k",
  },
  {
    value: 14900,
    label: "Week 3",
    frontColor: "#4facfe",
    topLabelComponent: "14.9k",
  },
  {
    value: 16200,
    label: "Week 4",
    frontColor: "#4facfe",
    showGradient: false,
    topLabelComponent: "16.2k",
  },
];

export const MEAL_LOG_DATA = [
  {
    id: 1,
    name: "Breakfast",
    calories: "420",
    time: "08:30 AM",
    icon: "sunny-outline",
    color: "#ffbd2e",
  },
  {
    id: 2,
    name: "Lunch",
    calories: "650",
    time: "01:00 PM",
    icon: "restaurant-outline",
    color: "#ff5e57",
  },
  {
    id: 3,
    name: "Snack",
    calories: "150",
    time: "04:30 PM",
    icon: "cafe-outline",
    color: "#0fbcf9",
  },
  {
    id: 4,
    name: "Dinner",
    calories: "580",
    time: "07:45 PM",
    icon: "moon-outline",
  },
];

export const ONBOARDING_SLIDES = [
  {
    id: "1",
    title: "Track Your Goal",
    description:
      "Don't worry if you have trouble determining your goals. We can help you determine and track your goals.",
    image: require("../assets/images/TRACK2.png"),
  },
  {
    id: "2",
    title: "Eat Well",
    description:
      "Let's start a healthy lifestyle with us, we can determine your diet every day. Healthy eating is fun.",
    image: require("../assets/images/EAT2.png"),
  },
  {
    id: "3",
    title: "Stay Healthy",
    description:
      "Improve the quality of your sleep with us, good quality sleep can bring a good mood in the morning.",
    image: require("../assets/images/REACT2.png"),
  },
];
