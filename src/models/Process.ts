import { Schema, model } from "mongoose";

const ProcessModel = new Schema<IProcess>({
    name: {
        type: String,
        required: true
    },
    baseUrl: {
        type: String,
        required: true
    },
    flux: {
        type: Schema.Types.ObjectId || null,
        ref: "Flux",
    }
})
  .set("toJSON", {
    virtuals: true,
  })
  .set("timestamps", true);

export default model("Process", ProcessModel);