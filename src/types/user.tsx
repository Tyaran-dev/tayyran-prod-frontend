export interface UserData {
  _id?: string;
  first_name: string;
  last_name: string;
  email: string;
  role?: string;
  emailVerified?: boolean;
  personalInfo: {
    dateOfBirth: any;
    passport: {
      expiryDate: any;
      number: string | null;
      issuingCountry: string | null;
    };
    contact: {
      phoneCode: string | null;
      phoneNumber: string | null;
      email: string | null;
    };
    title: string | null;
    middle_name: string;
    nationality: string | null;
  };
  membershipStatus?: string;
  discountPercentage?: number;
  points?: number;
}
