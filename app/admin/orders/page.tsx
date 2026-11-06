"use client";
import { useEffect, useState, useRef } from "react";
import jsPDF from "jspdf";
import QRCode from "qrcode";

export default function AdminOrders(){

const [filter,setFilter] = useState("all")
const [loadingFilter,setLoadingFilter] = useState(false)
const [orders,setOrders] = useState<any[]>([]);
const [search,setSearch] = useState("");
const [buttonState,setButtonState] = useState<{[key:string]:string}>({});
const [activeOrder,setActiveOrder] = useState<string | null>(null);
const [openStatus,setOpenStatus] = useState<string | null>(null);
const dropdownRef = useRef(null);


/* ========================= */
/* LOAD ORDERS */
/* ========================= */

const loadOrders = async()=>{

try{

const user = JSON.parse(localStorage.getItem("user") || "null");

if(!user || user.role !== "admin"){
alert("Access denied");
return;
}

const res = await fetch(`/api/orders?userId=${user._id}&role=${user.role}`);

const data = await res.json();

setOrders(Array.isArray(data) ? data : []);

}catch(err){
console.log("ADMIN LOAD ERROR:",err);
setOrders([]);
}

};

/* AUTO REFRESH */

useEffect(()=>{
loadOrders();

const interval = setInterval(()=>{
loadOrders();
},15000);

return ()=>clearInterval(interval);

},[]);

/* CLOSE STATUS MENU WHEN CLICKING OUTSIDE */

useEffect(()=>{

const handleClickOutside = (event:any)=>{

if(dropdownRef.current && !dropdownRef.current.contains(event.target)){
setOpenStatus(null)
}

}

window.addEventListener("click",handleClickOutside)

return ()=>window.removeEventListener("click",handleClickOutside)

},[])

/* ========================= */
/* FILTER FUNCTION */
/* ========================= */

const applyFilter = async(status:string)=>{

setLoadingFilter(true);

setFilter(status);

setTimeout(()=>{
setLoadingFilter(false);
},400);

};

/* ========================= */
/* BUTTON ANIMATION */
/* ========================= */

const animateButton = async(key:string,action:Function)=>{

setButtonState(prev=>({...prev,[key]:"loading"}));

await action();

setButtonState(prev=>({...prev,[key]:"done"}));

setTimeout(()=>{
setButtonState(prev=>({...prev,[key]:"idle"}));
},1200);

};

/* ========================= */
/* UPDATE STATUS */
/* ========================= */

const updateStatus = async(id:any,status:any)=>{

const res = await fetch(`/api/orders/${id}`,{
method:"PATCH",
headers:{ "Content-Type":"application/json" },
body: JSON.stringify({status})
});

await res.json();

loadOrders();

};

/* ========================= */
/* WHATSAPP */
/* ========================= */

const sendWhatsApp = (phone:string, message:string) => {

let cleanPhone = phone.replace(/\D/g,""); // remove spaces + symbols

// remove leading zero if exists
if(cleanPhone.startsWith("0")){
cleanPhone = cleanPhone.substring(1);
}

// add India country code if missing
if(!cleanPhone.startsWith("91")){
cleanPhone = "91" + cleanPhone;
}

const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

window.location.href = url;

};
/* ========================= */
/* MESSAGE TEMPLATES */
/* ========================= */

const messageConfirmed = (order:any)=>`
Hello ${order.customer?.name} 👋

Thank you for shopping with *05Mart*.

Your order has been *CONFIRMED*.

Order ID: ${order._id}
Total: ₹${order.total}

Track order:
https://05mart.in/orders/${order._id}

Team Rewind Supply ❤️
`;

const messageShipped = (order:any)=>`
Hello ${order.customer?.name} 👋

Your order from *Rewind Supply* has been *SHIPPED* 🚚

Order ID: ${order._id}

Track order:
https://rewindsupply.online/orders/${order._id}
`;

const messageOut = (order:any)=>`
Hello ${order.customer?.name}

Your order is *OUT FOR DELIVERY* today.

Order ID: ${order._id}
`;

const messageDelivered = (order:any)=>`
Hello ${order.customer?.name}

Your order from *Rewind Supply* has been *DELIVERED*.

Thank you for shopping ❤️
`;

const messageCancelled = (order:any)=>`
Hello ${order.customer?.name}

Your order from *Rewind Supply* has been *CANCELLED*.

Order ID: ${order._id}
`;

/* ========================= */
/* SHIPPING LABEL */
/* ========================= */

const downloadLabel = (order:any)=>{

const doc = new jsPDF();

doc.setFontSize(18);
doc.text("Shipping Label",80,20);

doc.setFontSize(12);

doc.text(`Order: ${order._id}`,20,40);
doc.text(`Name: ${order.customer?.name}`,20,50);
doc.text(`Phone: ${order.customer?.phone}`,20,60);

doc.text(`${order.customer?.house} ${order.customer?.area}`,20,70);
doc.text(`${order.customer?.city}, ${order.customer?.state}`,20,80);
doc.text(`Pincode: ${order.customer?.pincode}`,20,90);

doc.save(`label_${order._id}.pdf`);

};

/* ========================= */
/* INVOICE */
/* ========================= */

const downloadInvoice = async(order:any)=>{

const doc = new jsPDF();

let y = 20;

doc.setFontSize(20);
doc.text("Rewind Supply Invoice",80,y);

y+=20;

doc.text(`Order: ${order._id}`,20,y);

y+=10;

doc.text(`Customer: ${order.customer?.name}`,20,y);

y+=10;

doc.text(`Phone: ${order.customer?.phone}`,20,y);

y+=10;

doc.text(`${order.customer?.house} ${order.customer?.area}`,20,y);

y+=10;

doc.text(`${order.customer?.city}, ${order.customer?.state}`,20,y);

y+=10;

doc.text(`Pincode: ${order.customer?.pincode}`,20,y);

y+=20;

order.items.forEach((item:any)=>{

doc.text(
`${item.name} | ${item.size} | Qty ${item.quantity} | ₹${item.price}`,
20,
y
);

y+=10;

});

y+=10;

const subtotal = order.items.reduce(
  (sum: number, item: any) =>
    sum + Number(item.price) * Number(item.quantity || 1),
  0
);

y += 5;

doc.text(`Subtotal: Rs. ${subtotal.toFixed(2)}`, 20, y);
y += 8;

if (Number(order.onlineDiscount || 0) > 0) {
  doc.text(
    `Prepaid Discount: -Rs. ${Number(order.onlineDiscount).toFixed(2)}`,
    20,
    y
  );
  y += 8;
}

if (Number(order.codFee || 0) > 0) {
  doc.text(
    `COD Handling Fee: +Rs. ${Number(order.codFee).toFixed(2)}`,
    20,
    y
  );
  y += 8;
}

doc.setFontSize(14);
doc.text(`Final Payable: Rs. ${Number(order.total).toFixed(2)}`, 20, y + 5);

const qr = await QRCode.toDataURL(order._id);

doc.addImage(qr,"PNG",150,20,40,40);

doc.save(`invoice_${order._id}.pdf`);

};

/* ========================= */
/* STATS */
/* ========================= */

const totalOrders = orders.length;
const pending = orders.filter(o=>o.status==="pending").length;
const shipped = orders.filter(o=>o.status==="shipped").length;
const delivered = orders.filter(o=>o.status==="delivered").length;
const returned = orders.filter(o=>o.status==="returned").length;
const refunded = orders.filter(o=>o.status==="refunded").length;
const exchanges = orders.filter(o=>o.status==="exchange").length;
const replacement = orders.filter(o=>o.status==="replacement").length;

/* ========================= */
/* FILTERED ORDERS */
/* ========================= */

const filteredOrders = orders.filter((o:any)=>{

const matchesSearch =
o._id?.toLowerCase().includes(search.toLowerCase());

const matchesStatus =
filter === "all" || o.status === filter;

return matchesSearch && matchesStatus;

});

/* ========================= */
/* STATUS COLORS */
/* ========================= */

const statusColor = (status:string)=>{

switch(status){

case "pending": return "bg-yellow-100 text-yellow-700"
case "confirmed": return "bg-blue-100 text-blue-700"
case "processing": return "bg-indigo-100 text-indigo-700"
case "shipped": return "bg-purple-100 text-purple-700"
case "out_for_delivery": return "bg-orange-100 text-orange-700"
case "delivered": return "bg-green-100 text-green-700"
case "returned": return "bg-red-100 text-red-700"
case "refunded": return "bg-gray-200 text-gray-700"
case "exchange": return "bg-pink-100 text-pink-700"
case "replacement": return "bg-teal-100 text-teal-700"
default: return "bg-gray-100 text-gray-600"

}

};

/* ========================= */
/* UI */
/* ========================= */

return(

<main className="max-w-7xl mx-auto px-4 py-6">

<h1 className="text-2xl font-bold mb-6">Admin Orders</h1>

{/* STATS */}

<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">

<button
onClick={()=>applyFilter("all")}
className="rounded-lg p-4 bg-gray-100 hover:bg-gray-300 transition-all duration-200"
>
<p className="text-sm text-gray-600">Total</p>
<p className="font-bold text-lg">
{loadingFilter && filter==="all" ? "..." : totalOrders}
</p>
</button>

<button
onClick={()=>applyFilter("pending")}
className="rounded-lg p-4 bg-yellow-100 hover:bg-yellow-400 transition-all duration-200"
>
<p className="text-sm text-yellow-700">Pending</p>
<p className="font-bold text-lg">
{loadingFilter && filter==="pending" ? "..." : pending}
</p>
</button>

<button
onClick={()=>applyFilter("shipped")}
className="rounded-lg p-4 bg-blue-100 hover:bg-blue-500 transition-all duration-200 text-blue-900 hover:text-white"
>
<p className="text-sm">Shipped</p>
<p className="font-bold text-lg">
{loadingFilter && filter==="shipped" ? "..." : shipped}
</p>
</button>

<button
onClick={()=>applyFilter("delivered")}
className="rounded-lg p-4 bg-green-100 hover:bg-green-500 transition-all duration-200 text-green-900 hover:text-white"
>
<p className="text-sm">Delivered</p>
<p className="font-bold text-lg">
{loadingFilter && filter==="delivered" ? "..." : delivered}
</p>
</button>

<button
onClick={()=>applyFilter("returned")}
className="rounded-lg p-4 bg-red-100 hover:bg-red-500 transition-all duration-200 text-red-900 hover:text-white"
>
<p className="text-sm">Returns</p>
<p className="font-bold text-lg">
{loadingFilter && filter==="returned" ? "..." : returned}
</p>
</button>

<button
onClick={()=>applyFilter("exchange")}
className="rounded-lg p-4 bg-pink-100 hover:bg-pink-500 transition-all duration-200 text-pink-900 hover:text-white"
>
<p className="text-sm">Exchange</p>
<p className="font-bold text-lg">
{loadingFilter && filter==="exchange" ? "..." : exchanges}
</p>
</button>

<button
onClick={()=>applyFilter("replacement")}
className="rounded-lg p-4 bg-teal-100 hover:bg-teal-500 transition-all duration-200 text-teal-900 hover:text-white"
>
<p className="text-sm">Replacement</p>
<p className="font-bold text-lg">
{loadingFilter && filter==="replacement" ? "..." : replacement}
</p>
</button>

<button
onClick={()=>applyFilter("refunded")}
className="rounded-lg p-4 bg-gray-200 hover:bg-gray-600 transition-all duration-200 text-gray-900 hover:text-white"
>
<p className="text-sm">Refunded</p>
<p className="font-bold text-lg">
{loadingFilter && filter==="refunded" ? "..." : refunded}
</p>
</button>

</div>
{/* SEARCH */}

<input
placeholder="Search Order ID..."
className="border p-2 rounded w-full mb-6"
value={search}
onChange={(e)=>setSearch(e.target.value)}
/>

{/* ORDERS */}

<div className="space-y-5 relative">

{filteredOrders.length === 0 && (
<p className="text-gray-500">No orders found</p>
)}

{filteredOrders.map((order:any)=>(

<div
key={order._id}
onClick={()=>setActiveOrder(order._id)}
className={`border p-4 md:p-6 rounded-lg bg-white shadow-sm relative transition-all ${
activeOrder === order._id ? "z-50" : "z-0"
}`}
>

<div className="flex justify-between items-center mb-2">

<p className="font-semibold text-sm break-all">
Order {order._id}
</p>

<span className={`px-3 py-1 text-xs rounded ${statusColor(order.status)}`}>
{order.status}
</span>

</div>

{/* STATUS DROPDOWN */}

<div className="relative w-full md:w-[200px] mb-4">

<button
onClick={()=>setOpenStatus(openStatus === order._id ? null : order._id)}
className="w-full border rounded-lg px-3 py-2 text-sm bg-white shadow flex justify-between items-center"
>

<span className="capitalize">{order.status.replaceAll("_"," ")}</span>

<span>▼</span>

</button>

{openStatus === order._id && (

<div className="absolute left-0 mt-1 w-full bg-white border rounded-lg shadow-lg z-50">

{[
"pending",
"confirmed",
"processing",
"shipped",
"out_for_delivery",
"delivered",
"returned",
"exchange",
"replacement",
"refunded",
"cancelled"
].map((status)=>(

<button
key={status}
onClick={()=>{
updateStatus(order._id,status)
setOpenStatus(null)
}}
className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100 capitalize"
>

{status.replaceAll("_"," ")}

</button>

))}

</div>

)}

</div>
{/* CUSTOMER */}

<div className="text-sm">

<p className="font-semibold mb-1">Customer</p>

<p>{order.customer?.name}</p>
<p>{order.customer?.phone}</p>

<p>{order.customer?.house} {order.customer?.area}</p>
<p>{order.customer?.city}, {order.customer?.state}</p>
<p>{order.customer?.pincode}</p>

<a
href={`tel:${order.customer?.phone}`}
className="bg-green-600 text-white px-3 py-1 rounded mt-2 inline-block text-sm"
>
Call Customer
</a>

</div>

{/* PRODUCTS */}

<div className="mt-4 space-y-3">

{order.items.map((item:any)=>(

<div key={item._id} className="flex gap-3 border p-2 rounded">

<img src={item.image} className="w-16 h-16 object-cover rounded"/>

<div className="text-sm">
<p className="font-medium">{item.name}</p>
<p>Size {item.size}</p>
<p>Qty {item.quantity}</p>
<p>₹{item.price}</p>
</div>

</div>

))}

</div>


{/* PRICE DETAILS */}
<div className="mt-4 border rounded-lg p-4 bg-gray-50">
  <h3 className="font-semibold mb-3">Price Details</h3>

  <div className="flex justify-between text-sm mb-2">
    <span>Product Subtotal</span>
    <span>
      ₹
      {order.items
        .reduce(
          (sum: number, item: any) =>
            sum + Number(item.price) * Number(item.quantity || 1),
          0
        )
        .toFixed(2)}
    </span>
  </div>

  {Number(order.onlineDiscount || 0) > 0 && (
    <div className="flex justify-between text-sm text-green-600 mb-2">
      <span>5% Prepaid Discount</span>
      <span>-₹{Number(order.onlineDiscount).toFixed(2)}</span>
    </div>
  )}

  {Number(order.codFee || 0) > 0 && (
    <div className="flex justify-between text-sm text-orange-600 mb-2">
      <span>COD Handling Fee</span>
      <span>+₹{Number(order.codFee).toFixed(2)}</span>
    </div>
  )}

  <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
    <span>Final Payable</span>
    <span>₹{Number(order.total || 0).toFixed(2)}</span>
  </div>

  <p className="text-xs text-gray-500 mt-2">
    Payment Method: {order.paymentMethod?.toUpperCase() || "COD"}
  </p>
</div>
{/* ACTION BUTTONS */}

<div className="flex flex-wrap gap-2 mt-4">

<button
onClick={()=>animateButton(`confirm-${order._id}`,()=>sendWhatsApp(order.customer?.phone,messageConfirmed(order)))}
className="bg-green-600 text-white px-3 py-2 rounded text-sm"
>
{buttonState[`confirm-${order._id}`]==="loading" ? "Sending..." :
buttonState[`confirm-${order._id}`]==="done" ? "✓ Sent" : "Confirm"}
</button>

<button
onClick={()=>animateButton(`ship-${order._id}`,()=>sendWhatsApp(order.customer?.phone,messageShipped(order)))}
className="bg-blue-600 text-white px-3 py-2 rounded text-sm"
>
{buttonState[`ship-${order._id}`]==="loading" ? "Sending..." :
buttonState[`ship-${order._id}`]==="done" ? "✓ Sent" : "Shipped"}
</button>

<button
onClick={()=>animateButton(`out-${order._id}`,()=>sendWhatsApp(order.customer?.phone,messageOut(order)))}
className="bg-yellow-500 text-white px-3 py-2 rounded text-sm"
>
{buttonState[`out-${order._id}`]==="loading" ? "Sending..." :
buttonState[`out-${order._id}`]==="done" ? "✓ Sent" : "Out for Delivery"}
</button>

<button
onClick={()=>animateButton(`deliver-${order._id}`,()=>sendWhatsApp(order.customer?.phone,messageDelivered(order)))}
className="bg-purple-600 text-white px-3 py-2 rounded text-sm"
>
{buttonState[`deliver-${order._id}`]==="loading" ? "Sending..." :
buttonState[`deliver-${order._id}`]==="done" ? "✓ Sent" : "Delivered"}
</button>

<button
onClick={()=>animateButton(`cancel-${order._id}`,()=>sendWhatsApp(order.customer?.phone,messageCancelled(order)))}
className="bg-red-600 text-white px-3 py-2 rounded text-sm"
>
{buttonState[`cancel-${order._id}`]==="loading" ? "Sending..." :
buttonState[`cancel-${order._id}`]==="done" ? "✓ Sent" : "Cancel"}
</button>

{order.status === "delivered" && (

<button
className="bg-indigo-600 text-white px-3 py-2 rounded text-sm"
onClick={() => {

const item = order.items?.[0]
if(!item) return

const phone = order.customer?.phone

const message = `Hello ${order.customer?.name},

Thank you for shopping with Rewind Supply ❤️

Your order for *${item.name}* has been successfully delivered.

We would love to hear your feedback!

Please leave your review here:
https://rewindsupply.online/orders

Once you open the page, click *Leave Review* on your delivered order.

Your feedback helps other customers and improves our service.

Thank you 🙏
— Team Rewind Supply`

const whatsappUrl =
`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`

window.open(whatsappUrl,"_blank")

}}
>
Send Review Request
</button>

)}

</div>

{/* PDF */}

<div className="flex flex-col sm:flex-row gap-3 mt-4">

<button onClick={()=>downloadInvoice(order)} className="bg-black text-white px-3 py-2 rounded text-sm">
Invoice
</button>

<button onClick={()=>downloadLabel(order)} className="bg-blue-600 text-white px-3 py-2 rounded text-sm">
Shipping Label
</button>

</div>

</div>

))}

</div>

</main>

);
}