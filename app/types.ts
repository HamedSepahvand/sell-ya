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

export type ItemProps = {
  id: string;
  title: string;
  dateTime: string;
  category: string;
  isUrgent: boolean;
  price: number;
  images: string[];
  specificData: {
    areaSqm?: number;
    listingType?: string;
    mileageKm?: number;
    gender?: string;
    storageGB?: number;
    brand?: string;
  };
};

export type MobileProps = {
  id: string;
  title: string;
  description: string;
  dateTime: string;
  category: "mobile";
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
    brand:
      | "Samsung"
      | "Apple"
      | "Xiaomi"
      | "Google"
      | "OnePlus"
      | "Huawei"
      | "Other";

    storageGB: number;
    ramGB: number;
    color: string;
    batteryHealth: string;
    warranty: string;
  };
};
