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