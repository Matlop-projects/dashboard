export interface IOurClient {
  clientId: number;
  enName: string;
  arName: string;
  imageAr: string;
  imageEn: string;
}

export interface IOurClientCreate {
  enName: string;
  arName: string;
  imageAr: string;
  imageEn: string;
}

export interface IOurClientUpdate {
  clientId: number;
  enName: string;
  arName: string;
  imageAr: string;
  imageEn: string;
}