
import { Message, TravelContext } from '@/types/chat';

// Travel-related keywords for intent detection
const travelKeywords = [
  'trip', 'travel', 'vacation', 'holiday', 'visit', 'tour', 'itinerary',
  'plan', 'destination', 'flight', 'hotel', 'accommodation', 'restaurant',
  'attraction', 'activity', 'sightseeing', 'museum', 'beach', 'mountain',
  'city', 'country', 'passport', 'visa', 'budget', 'backpack', 'cruise',
  'resort', 'booking', 'reservation', 'guide', 'map', 'journey', 'adventure',
  // Location-specific keywords
  'places', 'locations', 'spots', 'areas', 'regions', 'districts', 'towns',
  'villages', 'landmarks', 'monuments', 'temples', 'churches', 'parks',
  'hills', 'lakes', 'rivers', 'forests', 'wildlife', 'national park',
  'heritage', 'cultural', 'historical', 'scenic', 'beautiful places',
  'tourist spots', 'must visit', 'recommend', 'suggestions', 'where to go',
  'what to see', 'best places', 'top places', 'famous places'
];

// Location-specific phrases for better detection
const locationPhrases = [
  'places in', 'locations in', 'spots in', 'areas in', 'visit in',
  'see in', 'go in', 'tourist places', 'famous places', 'best places',
  'top places', 'must visit', 'worth visiting', 'beautiful places',
  'scenic places', 'historical places', 'cultural places'
];

// Destination-specific data
const destinationData: { [key: string]: any } = {
  'kerala': {
    attractions: ['Backwaters of Alleppey', 'Munnar Hill Station', 'Kochi (Cochin)', 'Thekkady Wildlife Sanctuary', 'Varkala Beach', 'Wayanad', 'Kovalam Beach', 'Kumarakom'],
    activities: ['Houseboat cruise', 'Spice plantation tour', 'Ayurvedic massage', 'Tea garden visit', 'Wildlife safari', 'Kathakali dance show'],
    tips: 'Best time to visit is October to March. Try the local cuisine including appam, fish curry, and banana chips.'
  },
  'paris': {
    attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Arc de Triomphe', 'Champs-Élysées'],
    activities: ['Seine River cruise', 'Montmartre exploration', 'Versailles day trip', 'French cooking class'],
    tips: 'Best time to visit is April-June or September-October. Learn basic French phrases.'
  },
  'rome': {
    attractions: ['Colosseum', 'Vatican City', 'Trevi Fountain', 'Roman Forum', 'Pantheon'],
    activities: ['Food tour in Trastevere', 'Underground catacombs', 'Cooking class', 'Day trip to Tuscany'],
    tips: 'Book Vatican tickets in advance. Wear comfortable walking shoes.'
  },
  'tokyo': {
    attractions: ['Senso-ji Temple', 'Tokyo Skytree', 'Shibuya Crossing', 'Imperial Palace', 'Meiji Shrine'],
    activities: ['Sushi making class', 'Robot restaurant', 'Cherry blossom viewing', 'Day trip to Mt. Fuji'],
    tips: 'Get a JR Pass for train travel. Learn basic bow etiquette.'
  },
  'new york': {
    attractions: ['Statue of Liberty', 'Central Park', 'Times Square', 'Empire State Building', 'Brooklyn Bridge'],
    activities: ['Broadway show', 'Food tour', 'Museum hopping', 'High Line walk'],
    tips: 'Use subway for transportation. Tip 18-20% at restaurants.'
  },
  'goa': {
    attractions: ['Baga Beach', 'Calangute Beach', 'Old Goa Churches', 'Dudhsagar Falls', 'Anjuna Beach', 'Basilica of Bom Jesus'],
    activities: ['Water sports', 'Spice plantation tour', 'River cruise', 'Flea market shopping', 'Portuguese architecture tour'],
    tips: 'Best time to visit is November to February. Try local seafood and feni (local liquor).'
  },
  'rajasthan': {
    attractions: ['Jaipur (Pink City)', 'Udaipur (City of Lakes)', 'Jaisalmer (Golden City)', 'Jodhpur (Blue City)', 'Amber Fort', 'City Palace'],
    activities: ['Camel safari', 'Desert camping', 'Palace tours', 'Folk dance performances', 'Shopping for handicrafts'],
    tips: 'Best time to visit is October to March. Carry sunscreen and stay hydrated.'
  }
};

export const detectTravelIntent = (message: string): boolean => {
  const lowerMessage = message.toLowerCase();
  
  // Check for travel keywords
  const hasKeywords = travelKeywords.some(keyword => lowerMessage.includes(keyword));
  
  // Check for location-specific phrases
  const hasLocationPhrases = locationPhrases.some(phrase => lowerMessage.includes(phrase));
  
  // Check if asking about specific destinations
  const hasDestinations = Object.keys(destinationData).some(dest => lowerMessage.includes(dest));
  
  return hasKeywords || hasLocationPhrases || hasDestinations;
};

export const extractTravelContext = (message: string, previousMessages: Message[]): TravelContext => {
  const context: TravelContext = {};
  const lowerMessage = message.toLowerCase();

  // Extract destination
  Object.keys(destinationData).forEach(dest => {
    if (lowerMessage.includes(dest)) {
      context.destination = dest;
    }
  });

  // Extract duration
  const durationMatch = lowerMessage.match(/(\d+)\s*(day|week|month)/);
  if (durationMatch) {
    context.duration = `${durationMatch[1]} ${durationMatch[2]}${durationMatch[1] !== '1' ? 's' : ''}`;
  }

  // Extract budget hints
  if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('affordable')) {
    context.budget = 'budget-friendly';
  } else if (lowerMessage.includes('luxury') || lowerMessage.includes('expensive')) {
    context.budget = 'luxury';
  }

  return context;
};

export const generateTravelPlan = (context: TravelContext, originalMessage: string): string => {
  const destination = context.destination;
  const lowerMessage = originalMessage.toLowerCase();
  
  if (!destination || !destinationData[destination]) {
    // If no specific destination found but travel intent detected, provide general help
    if (lowerMessage.includes('places') || lowerMessage.includes('locations') || lowerMessage.includes('spots')) {
      return `I'd be happy to suggest some amazing places to visit! To give you the best recommendations, could you tell me:

🌍 **Which region or country are you interested in?**
🎯 **What type of places do you prefer?** (beaches, mountains, cities, historical sites, etc.)
📅 **How long is your trip?**
💰 **What's your budget range?**

I have detailed information about many destinations including Kerala, Goa, Rajasthan, Paris, Rome, Tokyo, New York, and many more!`;
    }
    
    return `I'd love to help you plan your trip! To create the perfect itinerary, could you tell me:

🌍 **Where would you like to go?**
📅 **How long is your trip?**
💰 **What's your budget range?**
🎯 **What interests you most?** (culture, food, nature, nightlife, etc.)

The more details you share, the better I can customize your travel plan!`;
  }

  const data = destinationData[destination];
  const capitalizedDest = destination.charAt(0).toUpperCase() + destination.slice(1);
  
  let plan = `🗺️ **Amazing ${capitalizedDest} Travel Guide**\n\n`;
  
  if (context.duration) {
    plan += `📅 **Duration:** ${context.duration}\n\n`;
  }

  plan += `🎯 **Must-Visit Places:**\n`;
  data.attractions.forEach((attraction: string, index: number) => {
    plan += `${index + 1}. ${attraction}\n`;
  });

  plan += `\n🎉 **Recommended Activities:**\n`;
  data.activities.forEach((activity: string, index: number) => {
    plan += `${index + 1}. ${activity}\n`;
  });

  plan += `\n💡 **Pro Tips:**\n${data.tips}\n\n`;

  if (context.duration && context.duration.includes('3')) {
    plan += `📋 **3-Day Itinerary Suggestion:**\n`;
    plan += `**Day 1:** ${data.attractions.slice(0, 2).join(' and ')}\n`;
    plan += `**Day 2:** ${data.activities.slice(0, 2).join(' and ')}\n`;
    plan += `**Day 3:** ${data.attractions.slice(2, 4).join(' and ')}\n\n`;
  }

  plan += `Need more specific recommendations for hotels, restaurants, or transportation? Just ask! 🚀`;

  return plan;
};

export const generateCasualResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  const responses = {
    greeting: [
      "Hello! Great to meet you! I'm here to help with travel planning or just chat. What's on your mind?",
      "Hi there! I'm your friendly AI assistant. Whether you want to plan your next adventure or just have a conversation, I'm here for you!",
      "Hey! Welcome! I love helping people with travel plans, but I'm also up for any kind of chat. What would you like to talk about?"
    ],
    how_are_you: [
      "I'm doing wonderfully, thank you for asking! I'm excited to help you today. What brings you here?",
      "I'm great! Always ready to help with travel advice or just have a friendly conversation. How are you doing?",
      "Fantastic! I love connecting with people and helping them plan amazing experiences. What's going on with you today?"
    ],
    weather: [
      "I don't have real-time weather data, but if you're planning to travel somewhere, I can give you general weather tips for different seasons and destinations!",
      "Weather can really make or break a trip! Are you thinking about the weather for a specific destination you'd like to visit?"
    ],
    default: [
      "That's interesting! I enjoy our conversation. Is there anything specific I can help you with today? I'm particularly good at travel planning!",
      "Thanks for sharing! I'm here if you need any help with travel plans or just want to continue chatting.",
      "I appreciate you telling me that. Feel free to ask me anything - whether it's about travel or just general questions!"
    ]
  };

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return responses.greeting[Math.floor(Math.random() * responses.greeting.length)];
  }
  
  if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you do')) {
    return responses.how_are_you[Math.floor(Math.random() * responses.how_are_you.length)];
  }
  
  if (lowerMessage.includes('weather')) {
    return responses.weather[Math.floor(Math.random() * responses.weather.length)];
  }
  
  return responses.default[Math.floor(Math.random() * responses.default.length)];
};

export const generateResponse = async (message: string, isTravel: boolean, previousMessages: Message[]): Promise<string> => {
  if (isTravel) {
    const context = extractTravelContext(message, previousMessages);
    return generateTravelPlan(context, message);
  } else {
    return generateCasualResponse(message);
  }
};
