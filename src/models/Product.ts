import { Schema, model } from "mongoose";

const ProductModel = new Schema<IProduct>({
  name: {
    type: String,
    required: true,
  },
  ref: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: false,
  },
  images: {
    type: [String],
    required: false,
  },
  price: {
    type: Number,
    required: true,
  },
  reducedPrice: {
    type: Number,
    required: false,
  },
  currency: {
    type: String,
    required: false,
  },
  url: {
    type: String,
    required: false,
  },
  brand: {
    type: String,
    required: false,
  },
  from: {
    type: Schema.Types.ObjectId || null,
    ref: "Process",
  },
  meta: {
    type: Object,
    required: false,
  },
})
  .set("toJSON", {
    virtuals: true,
  })
  .set("timestamps", true);

export default model("Product", ProductModel);
