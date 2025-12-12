import Head from "next/head";
import Link from "next/link";

const faqs = [
  {
    question: "Where do I drop my car for Heathrow Terminal 5 meet and greet?",
    answer:
      "Meet your insured chauffeur at Terminal 5 short stay car park, Level 4, Row R by the lifts. We text you the forecourt drop-off reference 30 minutes before arrival.",
  },
  {
    question: "Are your Heathrow drivers insured and licensed?",
    answer:
      "Yes. All chauffeurs carry Heathrow forecourt permits, are fully insured to drive your vehicle, and complete ID checks with branded lanyards before collecting keys.",
  },
  {
    question: "Can I change or cancel my booking?",
    answer:
      "You can amend or cancel free of charge up to 24 hours before arrival. Same-day changes are supported via live chat or phone, subject to availability.",
  },
  {
    question: "Is your parking compound Park Mark accredited?",
    answer:
      "Our off-site compounds are Park Mark approved with 24/7 CCTV, gated entry, and ANPR. Keys are sealed and stored in monitored safes while you travel.",
  },
  {
    question: "Do you monitor flights and delays?",
    answer:
      "Yes. We monitor your flight number for delays and adjust the return handover time so your car is waiting when you land.",
  },
];

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://simpleparking.uk/",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Heathrow Meet and Greet Parking",
      item: "https://simpleparking.uk/heathrow-meet-and-greet-parking/",
    },
  ],
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "SimpleParking Heathrow Meet & Greet",
  url: "https://simpleparking.uk/heathrow-meet-and-greet-parking/",
  image: "https://simpleparking.uk/logo.svg",
  telephone: "+44 20 1234 5678",
  priceRange: "££",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Outer Court, Heathrow Airport",
    addressLocality: "London",
    postalCode: "TW6",
    addressCountry: "GB",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 51.47002,
    longitude: -0.454295,
  },
  areaServed: "Heathrow Airport",
  sameAs: [
    "https://g.page/simpleparking",
    "https://www.trustpilot.com/review/simpleparking.uk",
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "1247",
  },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Heathrow Meet and Greet Parking",
  serviceType: "Valet parking Heathrow",
  provider: {
    "@type": "Organization",
    name: "SimpleParking",
    url: "https://simpleparking.uk/",
  },
  areaServed: "Heathrow Airport",
  offers: {
    "@type": "Offer",
    priceCurrency: "GBP",
    price: "49.00",
    availability: "https://schema.org/InStock",
    url: "https://simpleparking.uk/heathrow-meet-and-greet-parking/",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

const reviewSchema = {
  "@context": "https://schema.org",
  "@type": "Review",
  itemReviewed: {
    "@type": "Service",
    name: "Heathrow Meet and Greet Parking",
  },
  reviewRating: {
    "@type": "Rating",
    ratingValue: "4.8",
    bestRating: "5",
  },
  author: {
    "@type": "Person",
    name: "Verified Traveller",
  },
  reviewBody:
    "Chauffeur met us at Heathrow T3 within minutes. Car was secure and waiting on return — far easier than official parking.",
};

const offerSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Heathrow Airport Meet and Greet Parking",
  description:
    "Secure valet parking at Heathrow Terminals 2, 3, 4 and 5 with insured chauffeurs and Park Mark compounds.",
  brand: {
    "@type": "Brand",
    name: "SimpleParking",
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "GBP",
    price: "49.00",
    url: "https://simpleparking.uk/heathrow-meet-and-greet-parking/",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "1247",
  },
};

export const metadata = {
  title: "Heathrow Meet and Greet Parking | Valet Parking Heathrow | SimpleParking",
  description:
    "Book Heathrow meet and greet parking with insured chauffeurs, Park Mark security and fast forecourt drop-off at T2, T3, T4 and T5. Instant quotes and free cancellations.",
  alternates: {
    canonical: "https://simpleparking.uk/heathrow-meet-and-greet-parking/",
    languages: {
      "en-GB": "https://simpleparking.uk/heathrow-meet-and-greet-parking/",
    },
  },
  openGraph: {
    title: "Heathrow Meet and Greet Parking | Valet Parking Heathrow",
    description:
      "Secure Heathrow valet parking with insured chauffeurs and Park Mark compounds. Quick forecourt drop-off at every terminal.",
    url: "https://simpleparking.uk/heathrow-meet-and-greet-parking/",
    siteName: "SimpleParking",
    locale: "en_GB",
    images: [
      {
        url: "https://simpleparking.uk/logo.svg",
        width: 1200,
        height: 630,
        alt: "SimpleParking Heathrow meet and greet parking",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Heathrow Meet and Greet Parking | SimpleParking",
    description:
      "Book Heathrow valet parking at T2–T5 with insured chauffeurs and Park Mark compounds. Free cancellations.",
    images: ["https://simpleparking.uk/logo.svg"],
  },
};

const terminalGuides = [
  {
    terminal: "Terminal 2",
    handover: "Short Stay Car Park, Level 4, Row B by the lifts. Look for SimpleParking blue lanyards.",
  },
  {
    terminal: "Terminal 3",
    handover: "Short Stay Car Park, Level 3, Row A. Your chauffeur confirms vehicle condition and seals your keys.",
  },
  {
    terminal: "Terminal 4",
    handover: "Short Stay Car Park Level 2, Row E. Forecourt drop-off is pre-booked with Heathrow for smooth access.",
  },
  {
    terminal: "Terminal 5",
    handover: "Short Stay Car Park Level 4, Row R. We monitor your flight and return your vehicle to the same point.",
  },
];

const comparisonRows = [
  {
    option: "SimpleParking Meet & Greet",
    distance: "On-forecourt",
    transfer: "No shuttle",
    security: "Park Mark, CCTV, insured chauffeurs",
    price: "From £49",
  },
  {
    option: "Official Short Stay",
    distance: "On-forecourt",
    transfer: "No shuttle",
    security: "On-site patrols",
    price: "From £65",
  },
  {
    option: "Park & Ride",
    distance: "5–15 mins",
    transfer: "Shuttle bus",
    security: "Varies",
    price: "From £40",
  },
];

export default function HeathrowMeetAndGreetPage() {
  return (
    <main className="bg-white text-gray-900">
      <Head>
        <link rel="canonical" href="https://simpleparking.uk/heathrow-meet-and-greet-parking/" />
        <link rel="alternate" hrefLang="en-GB" href="https://simpleparking.uk/heathrow-meet-and-greet-parking/" />
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </Head>

      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl space-y-6">
            <p className="text-sm uppercase tracking-[0.3em] text-blue-100">Valet Parking Heathrow</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Heathrow Meet and Greet Parking
            </h1>
            <p className="text-lg text-blue-100">
              Skip the shuttle and hand your keys to an insured chauffeur right on the Heathrow forecourt. Park Mark
              compounds, CCTV, and flight monitoring keep your car secure while you travel.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-blue-100">
              <span className="rounded-full bg-blue-600/70 px-3 py-1">Forecourt drop-off (T2–T5)</span>
              <span className="rounded-full bg-blue-600/70 px-3 py-1">Insured chauffeurs</span>
              <span className="rounded-full bg-blue-600/70 px-3 py-1">Park Mark security</span>
              <span className="rounded-full bg-blue-600/70 px-3 py-1">Free cancellations</span>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/parking-availability"
                className="rounded-md bg-white px-5 py-3 text-center text-lg font-semibold text-blue-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                Get instant quote
              </Link>
              <Link
                href="/heathrow-terminal-5-parking"
                className="rounded-md border border-white/60 px-5 py-3 text-center text-lg font-semibold text-white transition hover:bg-white/10"
              >
                Terminal guides
              </Link>
              <p className="text-sm text-blue-100">Average handover time: under 3 minutes.</p>
            </div>
          </div>
          <div className="grid w-full max-w-lg grid-cols-1 gap-4 rounded-xl bg-white/5 p-6 backdrop-blur lg:max-w-md">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-blue-100">
                <span>Today&apos;s meet &amp; greet rate</span>
                <span className="font-semibold text-white">From £49</span>
              </div>
              <div className="h-2 rounded-full bg-blue-900/60">
                <span className="block h-2 w-4/5 rounded-full bg-lime-400" aria-hidden />
              </div>
              <p className="text-xs text-blue-100">Includes forecourt permit and free delay cover.</p>
            </div>
            <div className="rounded-lg bg-white px-4 py-3 text-blue-900 shadow-md">
              <p className="text-sm font-semibold">Fast booking</p>
              <p className="text-xs text-gray-600">Enter dates to reserve your Heathrow meet and greet parking.</p>
              <form className="mt-3 grid grid-cols-1 gap-3 text-sm" action="/parking-availability" method="get">
                <label className="flex flex-col gap-1">
                  <span className="font-medium">Drop-off date &amp; time</span>
                  <input
                    type="datetime-local"
                    name="arrival"
                    required
                    className="w-full rounded border border-gray-200 px-3 py-2 text-gray-900 shadow-inner focus:border-blue-600 focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="font-medium">Return date &amp; time</span>
                  <input
                    type="datetime-local"
                    name="return"
                    required
                    className="w-full rounded border border-gray-200 px-3 py-2 text-gray-900 shadow-inner focus:border-blue-600 focus:outline-none"
                  />
                </label>
                <button
                  type="submit"
                  className="mt-2 inline-flex items-center justify-center rounded-md bg-blue-900 px-4 py-3 font-semibold text-white transition hover:bg-blue-800"
                >
                  Check availability
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Why Choose Meet &amp; Greet at Heathrow</h2>
            <p className="text-lg text-gray-700">
              Heathrow meet and greet parking removes the shuttle bus and queues. You drive straight to the terminal, hand
              your keys to an insured chauffeur, and walk to check-in in under three minutes. Vehicles are photographed at
              handover, stored in Park Mark compounds with CCTV and ANPR, and returned to the same forecourt bay when you
              land.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {["Forecourt access with Heathrow permits", "Insured chauffeurs & ID checks", "Park Mark security compounds", "Free cancellations & delay cover", "Flight tracking for punctual returns", "No shuttle or bus transfers"].map((item) => (
                <div key={item} className="rounded-lg border border-gray-200 p-4 shadow-sm">
                  <p className="text-base font-semibold text-gray-900">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <aside className="rounded-xl bg-gray-50 p-6 shadow-inner">
            <h3 className="text-xl font-semibold text-gray-900">Trust &amp; safety</h3>
            <ul className="mt-4 space-y-3 text-sm text-gray-700">
              <li>Park Mark accredited compounds with 24/7 CCTV and gated access.</li>
              <li>Key bags sealed and stored in monitored safes.</li>
              <li>Forecourt drop-off compliant with Heathrow regulations.</li>
              <li>£50,000 vehicle movement insurance per booking.</li>
              <li>Live chat and phone support 24/7.</li>
            </ul>
          </aside>
        </div>
      </section>

      <section className="bg-gray-50" aria-labelledby="live-pricing">
        <div className="mx-auto max-w-6xl px-6 py-14 space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 id="live-pricing" className="text-2xl font-semibold text-gray-900">
              Live Pricing &amp; Booking (T2–T5)
            </h2>
            <Link href="/parking-availability" className="text-blue-700 font-semibold hover:underline">
              View availability
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Standard Meet &amp; Greet</h3>
              <p className="text-sm text-gray-700">Forecourt handover at any terminal with Park Mark compound storage.</p>
              <p className="mt-3 text-2xl font-bold text-blue-900">From £49</p>
              <p className="text-xs text-gray-600">Includes forecourt permit and 24/7 CCTV.</p>
              <Link href="/parking-availability" className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-900 px-4 py-2 text-white shadow hover:bg-blue-800">
                Book standard
              </Link>
            </div>
            <div className="rounded-lg border border-gray-200 p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">Business Meet &amp; Greet</h3>
              <p className="text-sm text-gray-700">Priority chauffeur dispatch, covered parking bay, and fast key handback.</p>
              <p className="mt-3 text-2xl font-bold text-blue-900">From £62</p>
              <p className="text-xs text-gray-600">Ideal for peak business hours and tight schedules.</p>
              <Link href="/parking-availability" className="mt-4 inline-flex items-center justify-center rounded-md bg-blue-900 px-4 py-2 text-white shadow hover:bg-blue-800">
                Book business
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 space-y-6" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="text-2xl font-semibold text-gray-900">
          How It Works
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {["Get instant quote", "Drive to forecourt", "Walk to check-in", "We secure your car", "Flight monitoring", "Return to the same bay"].map((step, index) => (
            <div key={step} className="rounded-lg border border-gray-200 p-5 shadow-sm">
              <p className="text-sm font-semibold text-blue-900">Step {index + 1}</p>
              <p className="mt-2 text-gray-800">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50" aria-labelledby="security-insurance">
        <div className="mx-auto max-w-6xl px-6 py-14 space-y-4">
          <h2 id="security-insurance" className="text-2xl font-semibold text-gray-900">
            Security &amp; Insurance
          </h2>
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4 text-gray-700">
              <p>
                All vehicles are stored in Park Mark accredited compounds with floodlighting, ANPR gates, and 24/7 CCTV.
                Chauffeurs carry full motor trade insurance and present ID on arrival. Keys are sealed and held in monitored
                safes; every movement is logged.
              </p>
              <p>
                We provide £50,000 vehicle movement insurance as standard. Flight monitoring is included so delays do not
                incur extra forecourt charges.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {["Park Mark compounds", "ANPR + gated entry", "24/7 CCTV coverage", "Key seal & tracking", "Insured chauffeurs", "Delay cover included"].map((item) => (
                <div key={item} className="rounded-lg bg-white p-4 shadow-sm">
                  <p className="font-semibold text-gray-900">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 space-y-6" aria-labelledby="terminal-guides">
        <h2 id="terminal-guides" className="text-2xl font-semibold text-gray-900">
          Terminal Guides
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {terminalGuides.map((guide) => (
            <div key={guide.terminal} className="rounded-lg border border-gray-200 p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900">{guide.terminal}</h3>
              <p className="mt-2 text-sm text-gray-700">{guide.handover}</p>
              <Link
                href={`/heathrow-${guide.terminal.split(" ")[1].toLowerCase()}-parking`}
                className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:underline"
              >
                View {guide.terminal} parking
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50" aria-labelledby="reviews-trust">
        <div className="mx-auto max-w-6xl px-6 py-14 space-y-6">
          <h2 id="reviews-trust" className="text-2xl font-semibold text-gray-900">
            Reviews &amp; Trust
          </h2>
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4 text-gray-700">
              <p>
                Travellers rate our Heathrow meet and greet parking 4.8/5 on Trustpilot and Google. Each handover includes
                vehicle photos, mileage checks, and sealed key storage for accountability.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {["4.8/5 Trustpilot (1,200+ reviews)", "100% Heathrow forecourt permit compliant", "Park Mark security compounds", "Live UK-based support team"].map((item) => (
                  <div key={item} className="rounded-lg bg-white p-4 shadow-sm">
                    <p className="font-semibold text-gray-900">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl bg-white p-5 shadow-lg">
              <p className="text-sm font-semibold text-gray-900">Sample review</p>
              <p className="mt-3 text-sm text-gray-700">
                “Met at Terminal 3 within minutes. Chauffeur was professional, car photographed and ready on return. Quicker
                and cheaper than official Heathrow valet.”
              </p>
              <p className="mt-3 text-sm font-semibold text-blue-900">— Verified Traveller</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14 space-y-6" aria-labelledby="price-comparison">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 id="price-comparison" className="text-2xl font-semibold text-gray-900">
            Price Comparison
          </h2>
          <Link href="/heathrow-parking-deals" className="text-blue-700 font-semibold hover:underline">
            See Heathrow parking deals
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-left">
            <thead className="bg-gray-50 text-sm uppercase tracking-wide text-gray-600">
              <tr>
                <th className="px-4 py-3">Option</th>
                <th className="px-4 py-3">Distance</th>
                <th className="px-4 py-3">Transfer</th>
                <th className="px-4 py-3">Security</th>
                <th className="px-4 py-3">Guide price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm text-gray-800">
              {comparisonRows.map((row) => (
                <tr key={row.option} className="bg-white">
                  <td className="px-4 py-3 font-semibold text-gray-900">{row.option}</td>
                  <td className="px-4 py-3">{row.distance}</td>
                  <td className="px-4 py-3">{row.transfer}</td>
                  <td className="px-4 py-3">{row.security}</td>
                  <td className="px-4 py-3">{row.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bg-gray-50" aria-labelledby="faqs">
        <div className="mx-auto max-w-6xl px-6 py-14 space-y-6">
          <h2 id="faqs" className="text-2xl font-semibold text-gray-900">
            FAQs
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-lg border border-gray-200 p-5 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900">{faq.question}</h3>
                <p className="mt-2 text-sm text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="rounded-xl bg-blue-900 p-6 text-white shadow-lg">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Ready to book Heathrow meet and greet parking?</h3>
              <p className="text-sm text-blue-100">Instant quotes for Terminals 2, 3, 4 and 5 with free cancellations.</p>
            </div>
            <Link
              href="/parking-availability"
              className="inline-flex items-center justify-center rounded-md bg-white px-5 py-3 text-base font-semibold text-blue-900 shadow-md transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              Get quote now
            </Link>
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([breadcrumbSchema, localBusinessSchema, serviceSchema, offerSchema, reviewSchema, faqSchema]),
        }}
      />
    </main>
  );
}
