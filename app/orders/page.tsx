







"use client";

import { useEffect,useState } from "react";
import Link from "next/link";

export default function OrdersPage(){

const [orders,setOrders] = useState<any[]>([]);
const [loading,setLoading] = useState(true);

/* REVIEW POPUP */

const [reviewOpen,setReviewOpen] = useState(false);
const [reviewProduct,setReviewProduct] = useState<any>(null);
const [reviewOrderId,setReviewOrderId] = useState("");
const [user, setUser] = useState<any>(null);

useEffect(() => {
  const stored = localStorage.getItem("user");
  if (stored) {
    setUser(JSON.parse(stored));
  }
}, []);

useEffect(()=>{

let interval:any;

const loadOrders = async()=>{

try{

const userData = localStorage.getItem("user");

if(!userData){
setOrders([]);
setLoading(false);
return;
}

const user = JSON.parse(userData);

if(!user?._id){
setOrders([]);
setLoading(false);
return;
}

const res = await fetch(`/api/orders?userId=${user._id}&t=${Date.now()}`);

if(res.ok){
const result = await res.json();
setOrders(Array.isArray(result) ? result : []);
}

}catch(err){
console.log("ORDER LOAD ERROR:",err);
}

setLoading(false);

};

loadOrders();

/* auto refresh every 5s */

interval = setInterval(loadOrders,5000);

/* refresh when tab focused */

const onFocus = ()=>loadOrders();
window.addEventListener("focus",onFocus);

return ()=>{
clearInterval(interval);
window.removeEventListener("focus",onFocus);
};

},[]);

if(loading){
return(

<main className="max-w-4xl mx-auto px-4 py-8">

<div className="h-6 w-40 bg-gray-200 rounded shimmer mb-6"></div>

{[1,2,3].map(i=>(
<div key={i} className="border rounded-xl p-4 mb-4 flex gap-4">

<div className="w-20 h-20 bg-gray-200 rounded shimmer"></div>

<div className="flex-1 space-y-2">

<div className="h-4 w-40 bg-gray-200 shimmer rounded"></div>
<div className="h-3 w-24 bg-gray-200 shimmer rounded"></div>
<div className="h-3 w-32 bg-gray-200 shimmer rounded"></div>

</div>

</div>
))}

<style jsx>{`
.shimmer{
position:relative;
overflow:hidden;
}
.shimmer::after{
content:"";
position:absolute;
top:0;
left:-100%;
width:100%;
height:100%;
background:linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent);
animation:shimmer 1.2s infinite;
}
@keyframes shimmer{
100%{left:100%;}
}
`}</style>

</main>

)
}

if(!orders || orders.length === 0){
return(

<main className="max-w-4xl mx-auto px-4 py-12 text-center">

<h1 className="text-2xl font-bold mb-6">
My Orders
</h1>

{/* ANIMATED ICON */}
<div className="text-7xl mb-4 animate-bounce-slow">
📦
</div>

{/* MAIN MESSAGE */}
<h2 className="text-lg font-semibold animate-fadeUp">
Ohh... nothing here yet 👀
</h2>

<p className="text-gray-500 mt-2 text-sm animate-fadeUp delay-100">
Looks like you haven’t ordered anything
</p>

<p className="text-gray-400 text-sm mt-1 animate-fadeUp delay-200">
Let’s fix that 😉
</p>

{/* CTA */}
<div className="mt-8 animate-fadeUp delay-300">

<Link href="/">
<button className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-medium shadow hover:scale-105 active:scale-95 transition">
Start Shopping 🚀
</button>
</Link>

</div>

{/* EXTRA */}
<div className="mt-6 text-sm text-gray-400 animate-fadeUp delay-500">

<p>🔥 Trending deals are waiting</p>
<p>💥 Flash sale ends soon</p>

</div>

<style jsx>{`

/* FADE UP */

@keyframes fadeUp{
from{
opacity:0;
transform:translateY(15px);
}
to{
opacity:1;
transform:translateY(0);
}
}

.animate-fadeUp{
animation:fadeUp .6s ease forwards;
opacity:0;
}

.delay-100{animation-delay:.1s}
.delay-200{animation-delay:.2s}
.delay-300{animation-delay:.3s}
.delay-500{animation-delay:.5s}

/* SLOW BOUNCE */

@keyframes bounceSlow{
0%,100%{transform:translateY(0)}
50%{transform:translateY(-10px)}
}

.animate-bounce-slow{
animation:bounceSlow 2s infinite;
}

`}</style>

</main>

)
}

return(

<main className="container">

<h1 className="title">My Orders</h1>

<div className="orders">

{orders.map((order:any)=>(

<div
key={order._id}
className="orderCard clickable"
onClick={()=>{
const item = order.items?.[0];
if(!item?._id) return;
window.location.href=`/product/${item._id}`;
}}
>

{/* HEADER */}

<div className="orderHeader">

<div>

<p className="orderId">
Order #{order._id.slice(-6)}
</p>

<p className="orderDate">
{new Date(order.createdAt).toDateString()}
</p>

</div>

<span className={`statusBadge ${
order.status==="cancelled"
? "red"
: order.status==="delivered"
? "green"
: "yellow"
}`}>
{order.status}
</span>

</div>

{/* PRODUCTS */}

<div className="items">

{order.items.map((item:any)=>(

<div
key={item._id}
className="itemRow"
onClick={(e)=>e.stopPropagation()}
>

<img
src={item.image}
loading="lazy"
className="itemImage"
/>

<div className="itemInfo">

<Link href={`/product/${item._id}`} onClick={(e)=>e.stopPropagation()}>
<p className="itemName">
{item.name}
</p>
</Link>

<p className="itemMeta">
Size: {item.size}
</p>

<p className="itemMeta">
Qty: {item.quantity}
</p>

</div>

<p className="itemPrice">
₹{item.price}
</p>

</div>

))}

</div>

{/* FOOTER */}

<div className="orderFooter">

{/* PRICE DETAILS */}
<div className="priceDetails">

  <p>
    Product Subtotal:
    <span>
      ₹{order.items.reduce(
        (sum: number, item: any) =>
          sum + Number(item.price) * Number(item.quantity || 1),
        0
      ).toFixed(2)}
    </span>
  </p>

  {Number(order.onlineDiscount || 0) > 0 && (
    <p className="prepaidDiscount">
      Prepaid Discount (5%):
      <span>-₹{Number(order.onlineDiscount).toFixed(2)}</span>
    </p>
  )}

  {Number(order.codFee || 0) > 0 && (
    <p>
      COD Handling Fee:
      <span>+₹{Number(order.codFee).toFixed(2)}</span>
    </p>
  )}

  <p className="finalTotal">
    Final Amount:
    <span>₹{Number(order.total).toFixed(2)}</span>
  </p>

  <p className="paymentMethod">
    Payment: {order.paymentMethod?.toUpperCase() || "COD"}
  </p>

</div>

<div className="actions">

{/* ================= EXCHANGE CANCELLED ================= */}

{order.exchangeRequest?.status === "cancelled" &&(

<div className="actions">

<button
disabled
className="btn gray"
onClick={(e)=>e.stopPropagation()}
>
Exchange Cancelled
</button>

<Link
href="/help"
className="btn outline"
onClick={(e)=>e.stopPropagation()}
>
Need Help
</Link>

</div>

)}

{/* ================= ACTIVE EXCHANGE ================= */}

{order.status !== "delivered" &&
order.exchangeRequest?.requested &&
order.exchangeRequest?.status !== "cancelled" &&
order.exchangeRequest?.status !== "completed" &&(

<Link
href={`/exchange/${order._id}`}
className="btn purple hoverGlow"
onClick={(e)=>e.stopPropagation()}
>
Track Exchange
</Link>

)}

{/* ================= ACTIVE RETURN ================= */}

{order.status !== "delivered" &&
order.returnRequest?.requested &&
order.returnRequest?.status !== "completed" &&(

<Link
href={`/returns/${order._id}`}
className="btn blue hoverGlow"
onClick={(e)=>e.stopPropagation()}
>
Track Return
</Link>

)}

{/* ================= REPLACEMENT ================= */}

{order.status !== "delivered" &&
order.exchangeRequest?.status === "replacement_shipped" &&(

<a
href={`/replacement/${order.exchangeRequest.replacementOrderId}`}
className="btn purple hoverGlow"
onClick={(e)=>e.stopPropagation()}
>
Track Replacement
</a>

)}

{/* ================= NORMAL ORDER ================= */}

{order.status !== "delivered" &&
!order.returnRequest?.requested &&
!order.exchangeRequest?.requested &&(

<Link
href={`/orders/${order._id}`}
className="btn outline"
onClick={(e)=>e.stopPropagation()}
>
View Order
</Link>

)}

{/* ================= AFTER DELIVERY ================= */}

{order.status==="delivered" &&(

<div className="actions">

<Link
href={`/orders/${order._id}`}
className="btn outline viewBtn"
onClick={(e)=>e.stopPropagation()}
>
<span>View Order</span>
</Link>

<a
href={`https://wa.me/917006134273?text=${encodeURIComponent(
`Hi, my name is ${user?.name}. I need help with my order.

Product: ${order.items?.[0]?.name}
Size: ${order.items?.[0]?.size}
Quantity: ${order.items?.[0]?.quantity}
Price: ₹${order.items?.[0]?.price}`
)}`}
target="_blank"
rel="noopener noreferrer"
className="btn helpBtn"
onClick={(e)=>e.stopPropagation()}
>
💬 Need Help
</a>

<Link
href="/"
className="btn shopBtn"
onClick={(e)=>e.stopPropagation()}
>
🛍 Continue Shopping
</Link>

<button
onClick={(e)=>{

e.stopPropagation();

const item = order.items?.[0];

if(!item?._id) return;

localStorage.setItem("reviewProduct", item._id);

window.location.href="/review";

}}
className="btn yellow"
>
⭐ Leave Review
</button>

</div>

)}

</div>

</div>

</div>

))}

</div>

<style jsx>{`

.container{
max-width:1100px;
margin:auto;
padding:20px;
}

.title{
font-size:26px;
font-weight:700;
margin-bottom:24px;
}
.priceDetails {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  margin-top: 12px;
  font-size: 13px;
}

.priceDetails p {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 8px;
}

.priceDetails .prepaidDiscount {
  color: #16a34a;
  font-weight: 600;
}

.priceDetails .finalTotal {
  border-top: 1px solid #e5e7eb;
  padding-top: 10px;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 700;
  color: #111827;
}

.priceDetails .paymentMethod {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 0;
}

.orders{
display:flex;
flex-direction:column;
gap:20px;
}

.orderCard{
border-radius:18px;
padding:18px;
background:linear-gradient(180deg,#ffffff,#fafafa);
border:1px solid #f1f5f9;
transition:all .25s ease;
box-shadow:0 2px 6px rgba(0,0,0,.03);
}

.clickable{
cursor:pointer;
}

.orderCard:hover{
transform:translateY(-4px);
box-shadow:0 16px 40px rgba(0,0,0,.08);
}

.orderCard:active{
transform:scale(.98);
}

.orderHeader{
display:flex;
flex-direction:column;
gap:6px;
margin-bottom:12px;
}

@media(min-width:640px){
.orderHeader{
flex-direction:row;
justify-content:space-between;
align-items:center;
}
}

.orderId{
font-weight:600;
}

.orderDate{
font-size:13px;
color:#6b7280;
}

.statusBadge{
display:inline-flex;
align-items:center;
padding:4px 10px;
border-radius:999px;
font-size:12px;
font-weight:600;
width:fit-content;
}

.green{
background:#dcfce7;
color:#15803d;
}

.red{
background:#fee2e2;
color:#b91c1c;
}

.yellow{
background:#fef9c3;
color:#92400e;
}

.items{
display:flex;
flex-direction:column;
gap:12px;
}

.itemRow{
display:flex;
gap:12px;
align-items:flex-start;
}

.itemImage{
width:60px;
height:60px;
object-fit:cover;
border-radius:10px;
}

.itemInfo{
flex:1;
}

.itemName{
font-weight:500;
}

.itemMeta{
font-size:13px;
color:#6b7280;
}

.itemPrice{
font-weight:600;
}

.orderFooter{
display:flex;
flex-direction:column;
gap:12px;
margin-top:14px;
}

@media(min-width:640px){
.orderFooter{
flex-direction:row;
justify-content:space-between;
align-items:center;
}
}

.actions{
display:flex;
flex-wrap:wrap;
gap:8px;
}

@media(max-width:640px){
.actions{
flex-direction:column;
width:100%;
}

.hoverGlow:hover{
box-shadow:0 0 14px rgba(59,130,246,.4);
}

.actions .btn{
width:100%;
justify-content:center;
}
}

.btn{
padding:10px 16px;
border-radius:14px;
font-size:13px;
font-weight:600;
display:inline-flex;
align-items:center;
justify-content:center;
gap:6px;
cursor:pointer;
border:none;
transition:all .25s ease;
position:relative;
overflow:hidden;
}

.btn:hover{
transform:translateY(-3px) scale(1.02);
box-shadow:0 12px 26px rgba(0,0,0,.12);
}

.btn:active{
transform:scale(.95);
}

.outline{
background:white;
border:1px solid #e5e7eb;
color:#111827;
}

.outline:hover{
background:#f9fafb;
}

.blue{
background:#2563eb;
color:white;
}

.blue:hover{
background:#1d4ed8;
}

.purple{
background:#7c3aed;
color:white;
}

.purple:hover{
background:#6d28d9;
}

.yellow{
background:#facc15;
color:black;
}

.yellow:hover{
background:#eab308;
}

.gray{
background:#e5e7eb;
color:#6b7280;
cursor:not-allowed;
}

.helpBtn{
background:#f9fafb;
border:1px solid #e5e7eb;
color:#374151;
}

.helpBtn:hover{
background:#f3f4f6;
}

.shopBtn{
background:linear-gradient(135deg,#16a34a,#22c55e);
color:white;
box-shadow:0 8px 20px rgba(34,197,94,.25);
}

.shopBtn:hover{
background:linear-gradient(135deg,#15803d,#16a34a);
box-shadow:0 10px 25px rgba(34,197,94,.35);
}

.viewBtn{
display:flex;
align-items:center;
justify-content:center;

width:100%;

background:linear-gradient(180deg,#ffffff,#f9fafb);

border:1px solid #e5e7eb;

box-shadow:0 6px 16px rgba(0,0,0,.06);

font-weight:600;
letter-spacing:.4px;

transition:all .25s ease;
}

.viewBtn:hover{

background:linear-gradient(180deg,#f9fafb,#f3f4f6);

border-color:#d1d5db;

transform:translateY(-2px);

box-shadow:0 14px 28px rgba(0,0,0,.12);

}

.viewBtn:active{
transform:scale(.96);
}

`}</style>

</main>

);
}