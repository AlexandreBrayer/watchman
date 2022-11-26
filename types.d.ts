declare module "cors";

interface IFlux {
    name: string;
    active: boolean;
}

interface IProcess {
    name: string;
    baseUrl: string;
    flux:ObjectId | null;
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