declare module "cors";

interface IFlux {
  name: string;
  active: boolean;
  state: string;
}

interface IProcess {
  name: string;
  baseUrl: string;
  flux: [ObjectId] | null;
}

interface IProduct {
  name: string;
  ref: string;
  desc: string;
  images: Array<String>;
  price: number;
  reducedPrice: number;
  currency: string;
  url: string;
  brand: string;
  from: ObjectId | null;
  meta: Object;
}

interface IReport {
  process: ObjectId;
  error: Object;
  executionTime: number;
  productsFound: number;
}