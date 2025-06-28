export interface ChatHistory {
  user_email: string;
  chat_history: Message[];
}

export interface Message {
  id: number;
  content: string;
  sender: "user" | "ai" | "onboard bot";
  timestamp: Date;
}

export interface OnboardingData {
  name: string;
  email: string;
  actorType: string;
  favoriteGenres: string[];
  picture: File | null;
}

export interface Question {
  step: number;
  field: keyof OnboardingData;
  question: string;
}
