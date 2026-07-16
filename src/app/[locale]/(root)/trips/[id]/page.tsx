import TripDetailClient from './TripDetailClient';

type Trip = {
  id: number;
  title: string;
  acf: {
    destination: Array<{ name: string }>;
    price: string;
    'old-price': string;
    duration: string;
    advantages: Array<{ text: string }>;
    disadvantages: Array<{ text: string }>;
    days: Array<{ day: { title: string; desc: string } }>;
    rate: string;
    gallery: string[];
    featured: string[];
    'trip-type': string;
    'suggested-hotels': Array<{ text: string }>;
    faq_code: string;
  };
};

async function getTrip(id: string): Promise<Trip | null> {
  const response = await fetch('https://qessatravel.com/wp-json/qessa/v1/trips', {
    cache: 'no-store',
  });

  if (!response.ok) {
    return null;
  }

  const data: Trip[] = await response.json();
  return data.find((trip) => String(trip.id) === id) ?? null;
}

export default async function TripDetailPage({ params }: { params: { locale: string; id: string } }) {
  const trip = await getTrip(params.id);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-16 bg-[#F8FAFC]">
        <div className="max-w-2xl rounded-3xl border border-gray-200 bg-white p-10 shadow-lg text-center">
          <h1 className="text-3xl font-bold text-[#016733] mb-4">الرحلة غير موجودة</h1>
          <p className="text-gray-600">لم نتمكن من العثور على تفاصيل هذه الرحلة. الرجاء العودة للمحاولة مرة أخرى.</p>
        </div>
      </div>
    );
  }

  return <TripDetailClient trip={trip} />;
}
