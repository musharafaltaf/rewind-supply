"use client"

import { useEffect,useState } from "react"
import { useParams,useRouter } from "next/navigation"

export default function EditProduct(){

const router = useRouter()
const params = useParams()

const [loading,setLoading] = useState(true)

const [form,setForm] = useState<any>({
name:"",
mrp:"",
price:"",
image:"",
images:["","","","",""],
description:"",
category:"",
stock:"",
sizes:"",
sizeStock:"",
featured:false,
womenSection: false,
flashSale:false,
flashPrice:"",
gender: "men"
})

/* ================= LOAD PRODUCT ================= */

useEffect(()=>{

async function load(){

const res = await fetch(`/api/products/${params.id}`)
const data = await res.json()

setForm({
  ...data,

  gender: data.gender || "men",

  images: data.images || ["", "", "", "", ""],

/* ✅ FIX SIZES */
sizes: Array.isArray(data.sizes)
? data.sizes.join(",")
: "",

/* ✅ FIX SIZE STOCK */
sizeStock: data.sizeStock
? Object.entries(data.sizeStock)
.map(([k,v])=>`${k}:${v}`)
.join(",")
: ""
})

setLoading(false)

}

load()

},[params.id])

/* ================= CHANGE INPUT ================= */

const handleChange=(e:any)=>{

const {name,value,type,checked}=e.target

setForm({
...form,
[name]: type==="checkbox"?checked:value
})

}

/* ================= UPDATE PRODUCT ================= */

const updateProduct = async()=>{

/* ✅ CONVERT SIZES */
const sizesArray = form.sizes
.split(",")
.map((s:any)=>s.trim())
.filter(Boolean)

/* ✅ CONVERT SIZE STOCK */
const sizeStockObject:any = {}

form.sizeStock.split(",").forEach((pair:any)=>{
const [size,qty] = pair.split(":")
if(size && qty){
sizeStockObject[size.trim()] = Number(qty)
}
})

await fetch(`/api/products/${params.id}`,{
method:"PUT",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
...form,
sizes: sizesArray,
sizeStock: sizeStockObject
})
})

alert("Product updated")

router.push("/admin/products")

}

/* ================= IMAGE UPLOAD ================= */

const uploadImage = async(file:any,index?:number)=>{

if(!file) return

const formData=new FormData()
formData.append("file",file)

const res=await fetch("/api/upload",{method:"POST",body:formData})
const data=await res.json()

if(index===undefined){

setForm(prev=>({...prev,image:data.url}))

}else{

const updated=[...form.images]
updated[index]=data.url

setForm(prev=>({...prev,images:updated}))

}

}

/* ================= REMOVE IMAGE ================= */

const removeImage=(index:number)=>{

const updated=[...form.images]
updated[index]=""

setForm(prev=>({...prev,images:updated}))

}

if(loading){
return <p style={{padding:"40px"}}>Loading product...</p>
}

return(

<main className="container">

<h1>Edit Product</h1>

{/* MAIN IMAGE */}

<div className="card">

<h2>Main Image</h2>

<label className="upload">

{form.image ? (
<img src={form.image}/>
):(
<p>Upload Image</p>
)}

<input
type="file"
hidden
onChange={(e)=>uploadImage(e.target.files?.[0])}
/>

</label>

</div>

{/* GALLERY */}

<div className="card">

<h2>Gallery Images</h2>

<div className="gallery">

{form.images.map((img:any,index:number)=>(

<div key={index} className="slot">

<label>

{img ? (
<img src={img}/>
):(
<span>Image {index+1}</span>
)}

<input
type="file"
hidden
onChange={(e)=>uploadImage(e.target.files?.[0],index)}
/>

</label>

{img && (
<button onClick={()=>removeImage(index)}>
✕
</button>
)}

</div>

))}

</div>

</div>

{/* BASIC INFO */}

<div className="card">

<input
name="name"
value={form.name}
placeholder="Product name"
onChange={handleChange}
/>

<textarea
name="description"
value={form.description}
placeholder="Description"
onChange={handleChange}
/>

<input
name="category"
value={form.category}
placeholder="Category"
onChange={handleChange}
/>
<select
  name="gender"
  value={form.gender}
  onChange={handleChange}
>
  <option value="men">Men</option>
  <option value="women">Women</option>
</select>

</div>

{/* PRICE */}

<div className="card">

<input
name="mrp"
value={form.mrp}
placeholder="MRP"
onChange={handleChange}
/>

<input
name="price"
value={form.price}
placeholder="Price"
onChange={handleChange}
/>

</div>

{/* INVENTORY */}

<div className="card">

<input
name="sizes"
value={form.sizes}
placeholder="Sizes (M,L,XL)"
onChange={handleChange}
/>

<input
name="stock"
value={form.stock}
placeholder="Total stock"
onChange={handleChange}
/>

<input
name="sizeStock"
value={form.sizeStock}
placeholder="Stock per size (M:5,L:3)"
onChange={handleChange}
/>

</div>

{/* FEATURES */}
<div className="card">

  <h2>Store Features</h2>

  <label>
    <input
      type="checkbox"
      name="featured"
      checked={form.featured}
      onChange={handleChange}
    />
    Featured Product
  </label>

  <label>
    <input
      type="checkbox"
      name="flashSale"
      checked={form.flashSale}
      onChange={handleChange}
    />
    Flash Sale
  </label>

  <label>
    <input
      type="checkbox"
      name="womenSection"
      checked={form.womenSection}
      onChange={handleChange}
    />
    Show in Women's Section
  </label>

  {form.flashSale && (
    <input
      name="flashPrice"
      value={form.flashPrice}
      placeholder="Flash price"
      onChange={handleChange}
    />
  )}

</div>

<button className="save" onClick={updateProduct}>
  Update Product
</button>

<style jsx>{`

.container{
max-width:900px;
margin:auto;
padding:40px 20px;
}

.card{
background:white;
border:1px solid #eee;
padding:20px;
border-radius:10px;
margin-bottom:20px;
}

.upload{
border:2px dashed #ddd;
height:240px;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
}

.upload img{
width:100%;
height:100%;
object-fit:contain;
}

.gallery{
display:grid;
grid-template-columns:repeat(5,1fr);
gap:10px;
}

.slot{
border:2px dashed #ddd;
height:80px;
display:flex;
align-items:center;
justify-content:center;
position:relative;
}

.slot img{
width:100%;
height:100%;
object-fit:cover;
}

.slot button{
position:absolute;
top:4px;
right:4px;
background:red;
color:white;
border:none;
width:20px;
height:20px;
border-radius:50%;
}

input,textarea{
border:1px solid #ddd;
padding:10px;
border-radius:6px;
width:100%;
margin-top:10px;
}

.save{
background:black;
color:white;
padding:14px;
border-radius:8px;
width:100%;
cursor:pointer;
}

`}</style>

</main>

)

}