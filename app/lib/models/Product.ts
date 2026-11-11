import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({

name:{
type:String,
required:true
},

description:{
type:String
},

category:{
type:String
},

/* ORIGINAL PRICE */

mrp:{
type:Number,
required:true
},

/* SELLING PRICE */

price:{
type:Number,
required:true
},

/* MAIN IMAGE */

image:{
type:String,
required:true
},

/* GALLERY IMAGES */

images:{
type:[String],
default:[]
},

/* SIZES */


/* STOCK */

sizes:{
type:[String],
default:[]
},

/* TOTAL STOCK */

stock:{
type:Number,
default:0
},

/* SIZE WISE STOCK */

sizeStock:{
type:Object,
default:{}
},


gender: {
  type: String,
  enum: ["men", "women"],
  default: "men",
},
womenSection: {
  type: Boolean,
  default: false,
},
/* FEATURED PRODUCT */

featured:{
type:Boolean,
default:false
},

/* FLASH SALE */

flashSale:{
type:Boolean,
default:false
},

flashPrice:{
type:Number,
default:0
}

},{timestamps:true});

export default mongoose.models.Product ||
mongoose.model("Product",ProductSchema);