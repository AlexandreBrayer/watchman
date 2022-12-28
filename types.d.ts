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

type filters = {
  name?: {
    value: Array<string>;
    strict: boolean;
  };
  ref?: {
    value: Array<string>;
    strict: boolean;
  };
  brand?: {
    value: Array<string>;
    strict: boolean;
  };
  url?: {
    value: Array<string>;
    strict: boolean;
  };
};

type dateBarrier = {
  after: boolean;
  value: string;
};

type mongoFilters = {
  name?: {
    $in?: Array<string>;
    $nin?: Array<string>;
  };
  ref?: {
    $in?: Array<string>;
    $nin?: Array<string>;
  };
  brand?: {
    $in?: Array<string>;
    $nin?: Array<string>;
  };
  url?: {
    $in?: Array<string>;
    $nin?: Array<string>;
  };
  createdAt?: {
    $gte?: string;
    $lte?: string;
  };
};
