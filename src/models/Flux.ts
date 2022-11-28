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
})
  .set("timestamps", true);

export default model("FLux", FluxModel);
