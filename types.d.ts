declare module "cors";

declare namespace Express {
  export interface Request {
    user?: IUser;
  }
}

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

interface IUser {
  username: string;
  password?: string;
  email: string;
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
    $in?: Array<string> | Array<RegExp>;
    $nin?: Array<string> | Array<RegExp>;
  };
  ref?: {
    $in?: Array<string> | Array<RegExp>;
    $nin?: Array<string> | Array<RegExp>;
  };
  brand?: {
    $in?: Array<string> | Array<RegExp>;
    $nin?: Array<string> | Array<RegExp>;
  };
  url?: {
    $in?: Array<string> | Array<RegExp>;
    $nin?: Array<string> | Array<RegExp>;
  };
  createdAt?: {
    $gte?: string;
    $lte?: string;
  };
};
