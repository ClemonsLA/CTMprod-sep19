export interface ListingItem{
    contractAddress: string;
    contractId: number;
    creatorWalletAddress: string;
    description: string;
    downloads: number;
    flagDescription: any;
    genre: number;
    highestRank: number;
    id: number;
    imageURL: string;
    isFlagged: boolean;
    isRentable: false;
    isSellable: false;
    labelWallet: string;
    moderatorPoints: number;
    musicURL: string;
    name: string;
    nftListTime: string | null;
    nftMintTime: string | null;
    numberOfCurrentRents: number;
    numberOfRents: number;
    price: number;
    quantity: number;
    rankingPoints: number;
    rentPrice: number;
    tokenStandard: string;
    tokensInStock: number;
    tokensListed: number;
    userDislikes: number;
    userLikes: number;
    usersWhoLiked: any[];
    usersWhoDisliked: any[];
    downloadable: boolean;
    views: number;
    creator: [{
      name: string;
    }]
  }