import { Schema, model } from "mongoose";

const FluxModel = new Schema<IFlux>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  active: {
    type: Boolean,
    required: false,
    default: false,
  },
  state: {
    type: String,
    required: false,
    default: "ready",
  },
}).set("timestamps", true);

export default model("Flux", FluxModel);
