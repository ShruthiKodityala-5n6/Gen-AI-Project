
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isTravel: boolean;
}

export interface TravelContext {
  destination?: string;
  duration?: string;
  budget?: string;
  interests?: string[];
  travelDates?: string;
  groupSize?: string;
}
