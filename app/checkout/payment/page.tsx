"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutSteps from "@/components/CheckoutSteps";
import { PAYMENT_CONFIG } from "@/app/lib/paymentConfig";

type PaymentMethod = "cod" | "upi" | "qr";

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", scheme: "tez://upi/pay" },
  { id: "phonepe", name: "PhonePe", scheme: "phonepe://pay" },
  { id: "paytm", name: "Paytm", scheme: "paytmmp://pay" },
];

export default function PaymentPage() {
  const router = useRouter();

  const [cart, setCart] = useState<any[]>([]);
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [loading, setLoading] = useState(false);
  const [app, setApp] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [utr, setUtr] = useState("");
  const [paymentFile, setPaymentFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [toast, setToast] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  const UPI_ID = PAYMENT_CONFIG.upiId;
  const merchant = PAYMENT_CONFIG.merchantName;

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (!user) {
      router.push("/login");
      return;
    }

    const loadCart = async () => {
      try {
        const buyNow = localStorage.getItem("buyNow");

        if (buyNow) {
          setCart([JSON.parse(buyNow)]);
          return;
        }

        const res = await fetch("/api/cart");
        const data = await res.json();
        setCart(data.items || []);
      } catch (error) {
        console.error(error);
      } finally {
        setPageLoading(false);
      }
    };

    loadCart();
  }, [router]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const total = cart.reduce(
  (sum, item) =>
    sum + Number(item.price) * Number(item.quantity || 1),
  0
);

const mrpTotal = cart.reduce(
  (sum, item) =>
    sum + Number(item.mrp || item.price) * Number(item.quantity || 1),
  0
);

const discount = mrpTotal - total;

const COD_FEE = 99;
const ONLINE_DISCOUNT_PERCENT = 5;

const onlineDiscount =
  payment === "upi" || payment === "qr"
    ? Math.round(total * ONLINE_DISCOUNT_PERCENT / 100)
    : 0;

const codFee = payment === "cod" ? COD_FEE : 0;

const finalTotal = total - onlineDiscount + codFee;

  const upiLink = (scheme = "upi://pay") => {
    const params = new URLSearchParams({
      pa: UPI_ID,
      pn: merchant,
      am: finalTotal.toFixed(2),
      cu: "INR",
      tn: "Rewind Supply Order",
    });

    return `${scheme}?${params.toString()}`;
  };

  const qrLink =
    "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=" +
    encodeURIComponent(upiLink());

  const showMessage = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(""), 3000);
  };

  const copyUPI = async () => {
    try {
      await navigator.clipboard.writeText(UPI_ID);
      showMessage("UPI ID copied!");
    } catch {
      showMessage("Unable to copy UPI ID");
    }
  };

  const handleScreenshotChange = (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showMessage("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showMessage("Screenshot must be smaller than 5 MB");
      return;
    }

    setPaymentFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const openUPIApp = (selectedApp: string) => {
    const selected = UPI_APPS.find((item) => item.id === selectedApp);
    if (!selected) return;

    setApp(selectedApp);
    setShowConfirm(true);
  };

  const launchUPI = () => {
    const selected = UPI_APPS.find((item) => item.id === app);
    if (!selected) return;

    setShowConfirm(false);
    window.location.href = upiLink(selected.scheme);
    showMessage("Complete your payment in your UPI app");
  };

  const placeOrder = async (
    method: string,
    reference = "",
    screenshotUrl = "",
    selectedApp = ""
  ) => {
    if (loading || cart.length === 0) return;

    setLoading(true);

    try {
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;

      const address = JSON.parse(
        localStorage.getItem("selectedAddress") || "{}"
      );

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  items: cart,
 total: finalTotal,
codFee: payment === "cod" ? COD_FEE : 0,
  customer: address,
  paymentMethod: payment,
          paymentProof: screenshotUrl || null,
          paymentScreenshot: screenshotUrl || null,
          upiTransactionId: reference || null,
          upiApp: selectedApp || null,
          userId: user?._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.error || "Order could not be placed");
        setLoading(false);
        return;
      }

      localStorage.removeItem("buyNow");

// Mark first order completed
localStorage.setItem("rewind_first_order_completed", "true");

if (payment === "cod") {
  router.push(`/success?orderId=${data._id}`);
} else {
  router.push(`/payment-pending?orderId=${data._id}`);
}
    } catch (error) {
      console.error(error);
      showMessage("Network error. Please try again.");
      setLoading(false);
    }
  };

  const submitOnlinePayment = async () => {
    if (!utr.trim()) {
      showMessage("Please enter your UTR / transaction ID");
      return;
    }

    if (!paymentFile) {
      showMessage("Please upload your payment screenshot");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      // Upload the selected photo to the existing Cloudinary upload API.
      const formData = new FormData();
      formData.append("file", paymentFile);

      // Assumes your upload route is app/api/upload/route.ts.
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok || !uploadData.url) {
        showMessage(uploadData.error || "Screenshot upload failed");
        setLoading(false);
        return;
      }

      // The customer selects a photo; its Cloudinary URL is saved automatically.
      await placeOrderAfterUpload(uploadData.url);
    } catch (error) {
      console.error("PAYMENT SCREENSHOT UPLOAD ERROR:", error);
      showMessage("Could not upload screenshot. Please try again.");
      setLoading(false);
    }
  };

  const placeOrderAfterUpload = async (screenshotUrl: string) => {
    try {
      const userData = localStorage.getItem("user");
      const user = userData ? JSON.parse(userData) : null;
      const address = JSON.parse(
        localStorage.getItem("selectedAddress") || "{}"
      );

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  items: cart,
  total: total,
  customer: address,
  paymentMethod: payment,
          paymentProof: screenshotUrl,
          paymentScreenshot: screenshotUrl,
          upiTransactionId: utr.trim(),
          upiApp: payment === "upi" ? app : "qr",
          userId: user?._id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showMessage(data.error || "Order could not be placed");
        setLoading(false);
        return;
      }

      localStorage.removeItem("buyNow");

// Mark first order completed
localStorage.setItem("rewind_first_order_completed", "true");

router.push(`/payment-pending?orderId=${data._id}`);
    } catch (error) {
      console.error(error);
      showMessage("Network error. Please try again.");
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <main className="max-w-6xl mx-auto p-5">
        <div className="animate-pulse h-8 bg-gray-200 rounded w-48" />
        <div className="animate-pulse h-48 bg-gray-100 rounded-xl mt-6" />
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <CheckoutSteps step={3} />

      <h1 className="text-2xl font-bold mt-8 mb-6">
        Choose Payment Method
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* PAYMENT OPTIONS */}
        <div className="space-y-4">
          <button
            onClick={() => setPayment("cod")}
            className={`w-full p-5 rounded-xl border-2 text-left ${
              payment === "cod"
                ? "border-[#b9e3f5] bg-[#eaf6fc]"
                : "border-gray-200"
            }`}
          >
            <div className="font-bold flex justify-between">
  <span>💵 Cash on Delivery</span>
  <span className="text-orange-600">+ ₹99</span>
</div>

<p className="text-sm text-gray-500 mt-1">
  Pay when your order arrives.
</p>

<p className="text-xs text-orange-600 mt-2 font-medium">
  ₹99 Cash on Delivery handling fee applies.
</p>
          </button>

          <button
            onClick={() => setPayment("upi")}
            className={`w-full p-5 rounded-xl border-2 text-left ${
              payment === "upi"
                ? "border-[#b9e3f5] bg-[#eaf6fc]"
                : "border-gray-200"
            }`}
          >
           <div className="font-bold flex justify-between">
  <span>📱 UPI Apps</span>
  <span className="text-green-600">5% OFF</span>
</div>

<p className="text-sm text-gray-500 mt-1">
  Google Pay, PhonePe and Paytm.
</p>

<p className="text-xs text-green-600 mt-2 font-medium">
  Get an additional 5% discount on prepaid orders.
</p>
          </button>

          <button
            onClick={() => setPayment("qr")}
            className={`w-full p-5 rounded-xl border-2 text-left ${
              payment === "qr"
                ? "border-[#b9e3f5] bg-[#eaf6fc]"
                : "border-gray-200"
            }`}
          >
            <div className="font-bold flex justify-between">
  <span>▦ Scan UPI QR Code</span>
  <span className="text-green-600">5% OFF</span>
</div>

<p className="text-sm text-gray-500 mt-1">
  Scan using any UPI application.
</p>

<p className="text-xs text-green-600 mt-2 font-medium">
  Get an additional 5% discount on prepaid orders.
</p>
          </button>

          {/* UPI APPS */}
          {payment === "upi" && (
            <div className="bg-white border rounded-xl p-5 space-y-3">
              <h3 className="font-semibold">Select your UPI app</h3>

              {UPI_APPS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => openUPIApp(item.id)}
                  className={`w-full border rounded-lg p-4 flex justify-between items-center hover:bg-[#eaf6fc] ${
                    app === item.id ? "border-[#b9e3f5] bg-[#eaf6fc]" : ""
                  }`}
                >
                  <span className="font-medium">{item.name}</span>
                  <span>→</span>
                </button>
              ))}
            </div>
          )}

          {/* QR PAYMENT */}
          {payment === "qr" && (
            <div className="bg-white border rounded-xl p-5 text-center">
              <h3 className="font-bold mb-2">Scan and Pay</h3>

              <img
                src={qrLink}
                alt="Rewind Supply UPI QR"
                className="w-56 h-56 mx-auto"
              />

              <p className="font-bold text-xl mt-3">
                ₹{finalTotal.toFixed(2)}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Rewind Supply
              </p>

              <p className="text-sm mt-3 break-all">{UPI_ID}</p>

              <button
                onClick={copyUPI}
                className="mt-3 border px-5 py-2 rounded-lg"
              >
                Copy UPI ID
              </button>
            </div>
          )}

          {/* PAYMENT PROOF UPLOAD */}
          {(payment === "upi" || payment === "qr") && (
            <div className="border rounded-xl p-5 space-y-3">
              <h3 className="font-bold">
                Submit your payment for verification
              </h3>

              <p className="text-sm text-gray-500">
                After paying, enter your UTR / transaction ID and upload the
                payment screenshot from your phone or computer.
              </p>

              <input
  type="text"
  inputMode="numeric"
  pattern="[0-9]{12}"
  maxLength={12}
  value={utr}
  onChange={(e) => setUtr(e.target.value.replace(/\D/g, ""))}
  placeholder="Enter 12-digit UTR number"
  className="w-full border rounded-lg p-3 outline-none focus:border-[#b9e3f5]"
/>

<p className="text-xs text-gray-500">
  Enter exactly 12 digits. Alphabets and special characters are not allowed.
</p>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Payment screenshot
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleScreenshotChange(e.target.files?.[0])}
                  className="w-full border rounded-lg p-3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Image files only. Maximum size: 5 MB.
                </p>
              </div>

              {previewUrl && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Screenshot preview</p>
                  <img
                    src={previewUrl}
                    alt="Payment screenshot preview"
                    className="max-h-64 max-w-full rounded-lg border object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentFile(null);
                      setPreviewUrl("");
                    }}
                    className="text-sm text-red-600"
                  >
                    Remove screenshot
                  </button>
                </div>
              )}

              <button
                disabled={utr.length !== 12 || !paymentFile || loading}
                onClick={submitOnlinePayment}
                className="w-full bg-[#b9e3f5] text-black font-semibold py-3 rounded-lg disabled:opacity-50"
              >
                {loading ? "Uploading and submitting..." : "I Have Paid — Submit"}
              </button>

              <p className="text-xs text-gray-500">
                Your payment will remain pending until an admin verifies the
                transaction in the bank account. Uploading a screenshot does
                not itself confirm payment.
              </p>
            </div>
          )}
        </div>

        {/* PRICE SUMMARY */}
        <div className="bg-white border rounded-xl p-5 h-fit md:sticky md:top-24">
          <h2 className="font-bold text-lg mb-5">Price Details</h2>

          <div className="flex justify-between mb-3">
            <span>MRP</span>
            <span className="line-through text-gray-400">
              ₹{mrpTotal}
            </span>
          </div>

         
<div className="flex justify-between text-green-600 mb-3">
  <span>Product Discount</span>
  <span>-₹{discount}</span>
</div>

{/* EXTRA 5% PREPAID DISCOUNT */}
{(payment === "upi" || payment === "qr") && (
  <div className="flex justify-between text-green-600 mb-3">
    <span>Extra 5% Prepaid Discount</span>
    <span>-₹{onlineDiscount.toFixed(2)}</span>
  </div>
)}

<hr className="my-4" />


          {payment === "cod" && (
  <div className="flex justify-between mb-3">
    <span>COD Handling Fee</span>
    <span>₹99</span>
  </div>
)}

<hr className="my-4" />

<div className="flex justify-between font-bold text-xl">
  <span>Total Amount</span>
  <span>₹{finalTotal.toFixed(2)}</span>
</div>

{payment === "cod" && (
  <p className="text-xs text-gray-500 mt-2">
    Includes ₹99 Cash on Delivery handling fee.
  </p>
)}

          {payment === "cod" && (
            <button
              disabled={loading || cart.length === 0}
              onClick={() => placeOrder("cod")}
              className="w-full mt-6 py-3 bg-black text-white rounded-xl font-semibold disabled:opacity-50"
            >
              {loading ? "Placing Order..." : "Confirm COD Order"}
            </button>
          )}
        </div>
      </div>

      {/* APP CONFIRMATION */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold">
              Continue to {UPI_APPS.find((a) => a.id === app)?.name}?
            </h2>

            <p className="text-gray-500 mt-3">
              You are going to pay ₹{finalTotal.toFixed(2)} to Rewind Supply.
            </p>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="border rounded-lg py-3 w-full"
              >
                Cancel
              </button>

              <button
                onClick={launchUPI}
                className="bg-[#b9e3f5] rounded-lg py-3 w-full font-semibold"
              >
                Yes, Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl text-center">
            <div className="w-9 h-9 border-4 border-[#b9e3f5] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="mt-3 font-semibold">Submitting order...</p>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white px-5 py-3 rounded-xl z-[70] text-sm">
          {toast}
        </div>
      )}
    </main>
  );
}
