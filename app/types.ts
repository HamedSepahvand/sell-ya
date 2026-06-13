export type ClotheProps = {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  category: string;
  featured: boolean;
  isUrgent: boolean;
  price: number;
  isNew: boolean;
  contact: {
    phone: string;
    email: string;
  };

  showPhone: string;
  showEmail: string;
  images: string;
  specificData: {
    gender: string;
    ageGroup: string;
    fabricMaterial: string;
    size: string;
  };
};

export type CarProps = {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  category: string;
  featured: boolean;
  isUrgent: boolean;
  price: number;
  isNew: boolean;
  contact: {
    phone: string;
    email: string;
  };

  showPhone: string;
  showEmail: string;
  images: Array<string>;
  specificData: {
    mileageKm: number;
    year: number;
    chassisCondition: string;
    bodyCondition: string;
    color: string;
    transmission: string;
    fuelType: string;
    engineCapacity: string;
  };
};

export type HouseProps = {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  category: string;
  featured: boolean;
  isUrgent: boolean;
  price: number;
  isNew: boolean;
  contact: {
    phone: string;
    email: string;
  };
  showPhone: boolean;
  showEmail: boolean;
  images: string[];

  specificData: {
    listingType: "forRent" | "forSale";
    areaSqm: number;
    monthlyRent?: number;
    pricePerSqm?: number;
    yearBuilt: number;
    bedrooms: number;
    bathrooms: number;
    totalFloors: number;
    floorNumber: number;
    hasParking: boolean;
    hasElevator: boolean;
  };
};
