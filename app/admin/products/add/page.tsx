"use client"

import { useState,useEffect,useRef } from "react"
import { useRouter } from "next/navigation"

export default function AddProduct(){

const router = useRouter()

const dropdownRef = useRef<any>(null)

const [categories,setCategories] = useState<any[]>([])
const [categorySearch,setCategorySearch] = useState("")
const [showCategory,setShowCategory] = useState(false)


const [dragIndex,setDragIndex] = useState<number|null>(null)

const [popup,setPopup] = useState({
show:false,
message:""
})

const [form,setForm] = useState({
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
flashSale:false,
womenSection: false,
flashPrice:"",
gender: "men"
})

/* ================= LOAD CATEGORIES ================= */

useEffect(()=>{
fetch("/api/categories")
.then(res=>res.json())
.then(data=>setCategories(data))
},[])

/* ================= CLOSE DROPDOWN ================= */

useEffect(()=>{
function handleClick(e:any){
if(dropdownRef.current && !dropdownRef.current.contains(e.target)){
setShowCategory(false)
}
}
document.addEventListener("mousedown",handleClick)
return ()=>document.removeEventListener("mousedown",handleClick)
},[])

/* ================= INPUT ================= */

const handleChange=(e:any)=>{
const {name,value,type,checked}=e.target
setForm({
...form,
[name]: type==="checkbox"?checked:value
})
}

/* ================= IMAGE UPLOAD WITH PROGRESS ================= */

const uploadImage = async (file:any,index?:number)=>{

  if(!file) return;

  /* INSTANT PREVIEW */

  const preview = URL.createObjectURL(file);

  if(index === undefined){

    setForm(prev=>({
      ...prev,
      image: preview
    }));

  }else{

    setForm(prev=>{

      const updated = [...prev.images];
      updated[index] = preview;

      return {
        ...prev,
        images: updated
      };

    });

  }

  try{

    /* COMPRESS IMAGE */

    const compressed = await compressImage(file);

    const formData = new FormData();

    formData.append(
      "file",
      compressed as Blob,
      "image.webp"
    );

    const res = await fetch("/api/upload",{
      method:"POST",
      body:formData
    });

    const data = await res.json();

    if(index === undefined){

      setForm(prev=>({
        ...prev,
        image:data.url
      }));

    }else{

      setForm(prev=>{

        const updated=[...prev.images];

        updated[index]=data.url;

        return {
          ...prev,
          images:updated
        };

      });

    }

  }catch(err){

    console.log(err);
    alert("Upload failed");

  }

};


const compressImage = (file:any) => {

  return new Promise((resolve)=>{

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e:any)=>{
      img.src = e.target.result;
    };

    img.onload = ()=>{

      const canvas = document.createElement("canvas");

      const maxWidth = 1200;

      const scale = maxWidth / img.width;

      canvas.width = maxWidth;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext("2d");

      ctx?.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
      );

      canvas.toBlob(
        (blob:any)=>resolve(blob),
        "image/webp",
        0.8
      );

    };

    reader.readAsDataURL(file);

  });

};
/* ================= REMOVE IMAGE ================= */

const removeImage=(index:number)=>{
setForm(prev=>{
const updated=[...prev.images]
updated[index]=""
return {...prev,images:updated}
})
}

/* ================= DRAG ================= */

const handleDrop=(index:number)=>{
if(dragIndex===null) return

setForm(prev=>{
const updated=[...prev.images]
const temp=updated[dragIndex]
updated[dragIndex]=updated[index]
updated[index]=temp
return {...prev,images:updated}
})
setDragIndex(null)

}

/* ================= ADD PRODUCT ================= */

const addProduct = async()=>{

if(!form.name) return setPopup({show:true,message:"Product name required"})
if(!form.description) return setPopup({show:true,message:"Description required"})
// if(!form.category) return setPopup({show:true,message:"Category required"})
if(!form.mrp) return setPopup({show:true,message:"MRP required"})
if(!form.price) return setPopup({show:true,message:"Price required"})
if(!form.image) return setPopup({show:true,message:"Main image required"})

const galleryCount = form.images.filter(img=>img!=="").length
if(galleryCount<3){
return setPopup({show:true,message:"Minimum 3 gallery images required"})
}

if(!form.sizes){
return setPopup({show:true,message:"Stock sizes required"})
}

if(!form.stock){
return setPopup({show:true,message:"Total stock required"})
}

if(!form.sizeStock){
return setPopup({show:true,message:"Stock per size required"})
}

if(form.flashSale && !form.flashPrice){
return setPopup({show:true,message:"Flash price required"})
}

/* CONVERT SIZES */
const sizesArray = form.sizes.split(",").map((s:any)=>s.trim())

/* CONVERT STOCK */
const sizeStockObject:any = {}
form.sizeStock.split(",").forEach((pair:any)=>{
const [size,qty] = pair.split(":")
if(size && qty){
sizeStockObject[size.trim()] = Number(qty)
}
})

/* FINAL PAYLOAD */
const payload = {
...form,
sizes: sizesArray,
sizeStock: sizeStockObject
}

await fetch("/api/products",{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify(payload)
})

setPopup({show:true,message:"Product added successfully"})

setTimeout(()=>{
router.push("/admin/products")
},1000)

}

/* ================= UI ================= */

return(

<main className="container">

<h1 className="title">Add Product</h1>

{/* MAIN IMAGE */}
<div className="card">
<h2>Main Image</h2>

<label className="mainUpload">
{form.image ? <img src={form.image}/> : <p>Upload Main Image</p>}
<input type="file" hidden onChange={(e)=>uploadImage(e.target.files?.[0])}/>
</label>
</div>

{/* GALLERY */}
<div className="card">
<h2>Gallery Images</h2>

<div className="gallery">
{form.images.map((img,index)=>(
<div
key={index}
className="slot"
draggable
onDragStart={()=>setDragIndex(index)}
onDragOver={(e)=>e.preventDefault()}
onDrop={()=>handleDrop(index)}
>

<label>
{img ? <img src={img}/> : <span>Image {index+1}</span>}
<input type="file" hidden onChange={(e)=>uploadImage(e.target.files?.[0],index)}/>
</label>

{img && (
<button className="remove" onClick={()=>removeImage(index)}>✕</button>
)}

</div>
))}
</div>



</div>

{/* BASIC */}
<div className="card">
<h2>Basic Information</h2>

<input name="name" placeholder="Product Name" onChange={handleChange}/>
<textarea name="description" placeholder="Description" onChange={handleChange}/>

<div ref={dropdownRef} className="categoryBox">
<input
placeholder="Search category"
value={categorySearch}
onChange={(e)=>{
setCategorySearch(e.target.value)
setShowCategory(true)
}}
onFocus={()=>setShowCategory(true)}
/>

{showCategory && (
<div className="dropdown">
{categories
.filter((c:any)=>c.name.toLowerCase().includes(categorySearch.toLowerCase()))
.map((c:any)=>(
<div
key={c._id}
className="dropdownItem"
onClick={()=>{
setForm(prev=>({...prev,category:c.name}))
setCategorySearch(c.name)
setShowCategory(false)
}}
>
{c.name}
</div>
))}
</div>
)}
</div>
</div>

<label className="block mt-4 font-medium">
  Product For
</label>

<select
  name="gender"
  value={form.gender}
  onChange={handleChange}
  className="w-full border rounded-lg p-3 mt-2"
>
  <option value="men">Men</option>
  <option value="women">Women</option>
</select>

{/* PRICE */}
<div className="card">
<h2>Pricing</h2>
<input name="mrp" placeholder="MRP" onChange={handleChange}/>
<input name="price" placeholder="Selling Price" onChange={handleChange}/>
</div>

{/* INVENTORY */}
<div className="card">
<h2>Inventory</h2>
<input name="sizes" placeholder="M,L,XL" onChange={handleChange}/>
<input name="stock" placeholder="Total Stock" onChange={handleChange}/>
<input name="sizeStock" placeholder="M:5,L:3" onChange={handleChange}/>
</div>

{/* FEATURES */}
<div className="card">

  <h2>Store Features</h2>

  <label className="feature">
    <input
      type="checkbox"
      name="featured"
      checked={form.featured}
      onChange={handleChange}
    />
    Featured Products
  </label>

  <label className="feature">
    <input
      type="checkbox"
      name="flashSale"
      checked={form.flashSale}
      onChange={handleChange}
    />
    Flash Sale
  </label>

  <label className="feature">
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
      placeholder="Flash Price"
      onChange={handleChange}
    />
  )}

</div>

<button className="submit" onClick={addProduct}>
  Add Product
</button>
{/* POPUP */}
{popup.show && (
<div className="popupOverlay">
<div className="popup">
<p>{popup.message}</p>
<button onClick={()=>setPopup({show:false,message:""})}>OK</button>
</div>
</div>
)}


<style jsx>{`

.container{
max-width:900px;
margin:auto;
padding:40px 20px;
}

.title{
font-size:28px;
margin-bottom:30px;
}

.card{
background:white;
border:1px solid #eee;
border-radius:12px;
padding:24px;
margin-bottom:20px;
box-shadow:0 5px 20px rgba(0,0,0,0.05);
}

.mainUpload{
border:2px dashed #ddd;
height:260px;
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
}

.mainUpload img{
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
height:90px;
display:flex;
align-items:center;
justify-content:center;
position:relative;
cursor:grab;
}

.slot img{
width:100%;
height:100%;
object-fit:cover;
}

.remove{
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

.categoryBox{
position:relative;
}

.dropdown{
position:absolute;
top:45px;
left:0;
right:0;
background:white;
border:1px solid #ddd;
border-radius:6px;
max-height:200px;
overflow:auto;
z-index:20;
}

.dropdownItem{
padding:10px;
cursor:pointer;
}

.dropdownItem:hover{
background:#f5f5f5;
}

.feature{
display:flex;
gap:10px;
margin-top:10px;
align-items:center;
}

.submit{
background:black;
color:white;
padding:14px;
border-radius:8px;
width:100%;
margin-top:20px;
cursor:pointer;
}

.popupOverlay{
position:fixed;
inset:0;
background:rgba(0,0,0,0.4);
display:flex;
align-items:center;
justify-content:center;
}

.popup{
background:white;
padding:25px;
border-radius:10px;
text-align:center;
width:300px;
}

.popup button{
margin-top:15px;
background:black;
color:white;
padding:8px 20px;
border-radius:6px;
}

`}</style>

</main>

)

}