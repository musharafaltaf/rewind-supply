export default function StoreBenefits() {
  const benefits = [
    {
      icon: "🚚",
      title: "Free Delivery",
      desc: "Free shipping on all orders",
    },
    {
      icon: "🔒",
      title: "Secure Payment",
      desc: "100% secure payment methods",
    },
    {
      icon: "↩️",
      title: "Easy Returns",
      desc: "7 day return policy",
    },
    {
      icon: "⭐",
      title: "Premium Quality",
      desc: "Best quality products",
    },
  ];

  return (
    <section
      aria-label="Why shop with Rewind Supply"
      className="bg-gray-50 py-10"
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white p-6 rounded-xl border hover:shadow-lg transition text-center"
            >
              {/* ICON */}
              <div
                className="text-3xl md:text-4xl"
                aria-hidden="true"
              >
                {benefit.icon}
              </div>

              {/* TITLE */}
              <h3 className="font-semibold mt-3 text-sm md:text-base">
                {benefit.title}
              </h3>

              {/* DESCRIPTION */}
              <p className="text-gray-500 text-xs md:text-sm mt-1">
                {benefit.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}