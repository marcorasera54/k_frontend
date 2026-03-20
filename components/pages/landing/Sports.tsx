import Image from "next/image";

const SPORTS = [
  {
    name: "Calcio",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&auto=format&fit=crop",
  },
  {
    name: "Tennis",
    image:
      "https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&auto=format&fit=crop",
  },
  {
    name: "Padel",
    image:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&auto=format&fit=crop",
  },
  {
    name: "Basket",
    image:
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&auto=format&fit=crop",
  },
  {
    name: "Pallavolo",
    image:
      "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&auto=format&fit=crop",
  },
];

export default function SportsSection() {
  return (
    <section className="bg-slate-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-3">
            Sport disponibili
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Quale sport pratichi?
          </h2>
          <p className="text-slate-500 mt-4 max-w-xl mx-auto text-base sm:text-lg">
            Trova la struttura giusta per il tuo sport preferito.
          </p>
        </div>

        {/* Sports grid */}
        <div className="flex flex-wrap justify-center gap-4">
          {SPORTS.map(({ name, image }) => (
            <div
              key={name}
              className="group cursor-pointer rounded-xl overflow-hidden border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-300 w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={image}
                  alt={name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                {/* Text over image */}
                <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
                  <p className="font-semibold text-white text-base leading-tight">
                    {name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
