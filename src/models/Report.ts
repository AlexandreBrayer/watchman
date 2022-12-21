import { Schema, model } from "mongoose";

const ReportModel = new Schema<IReport>({
  process: {
    type: Schema.Types.ObjectId || null,
    required: true,
    ref: "Process",
  },
  error: {
    type: Object,
    required: false,
  },
  executionTime: {
    type: Number,
    required: false,
  },
  productsFound: {
    type: Number,
    required: false,
  },
}).set("timestamps", true);

export default model("Report", ReportModel);
