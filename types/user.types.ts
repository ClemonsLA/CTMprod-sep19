export interface UserMetadata {
    issuer: string;
    name: string;
    description: string;
    tag: number;
    walletAddress: string;
    walletType: string;
    coins?: number;
    email: string;
    nftOwned?: number[];
    nftRented?: number[];
    whenSignedUp?: string;
    website: string;
  }