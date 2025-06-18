
import { Question } from "@/types/onboarding";

export const questions: Question[] = [
  { step: 2, field: "email", question: "Nice to meet you, {name}! 😊 Now, what's your email address? This will help me keep you updated on all the amazing opportunities coming your way!" },
  { step: 3, field: "actorType", question: "Perfect! Now, what type of acting are you most interested in? Are you more drawn to theatre, screen acting, or do you love both equally?" },
  { step: 4, field: "favoriteGenres", question: "Fantastic! What are your favorite genres to work in? You can select multiple options - whether it's drama, comedy, action, horror, or anything else that makes you passionate!" },
  { step: 5, field: "picture", question: "Amazing! One last thing - would you like to upload a profile picture? It really helps casting directors remember you, but don't worry if you'd prefer to skip this for now!" }
];
