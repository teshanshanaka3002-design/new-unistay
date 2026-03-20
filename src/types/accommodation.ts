export interface Accommodation {
  id: string;
  name: string;
  description: string;
  price: number;
  location: string;
  city: string;
  university: string;
  rating: number;
  image: string;
  images: string[];
  roomTypes: string[];
  facilities: string[];
  ownerName: string;
  ownerPhone: string;
  reviews: Review[];
}

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface BookingRequest {
  accommodationId: string;
  roomType: string;
  duration: number;
  totalPrice: number;
  paymentProof: string; // base64 or URL
}
