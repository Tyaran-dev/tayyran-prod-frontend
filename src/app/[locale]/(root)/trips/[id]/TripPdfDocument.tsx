'use client';

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';


Font.register({
  family: 'Amiri',
  fonts: [
    { src: '/fonts/Tajawal-Regular.ttf', fontWeight: 'normal' },
    { src: '/fonts/Tajawal-Bold.ttf', fontWeight: 'bold' },
  ],
});

function SafeImage({ src, style }: { src?: string; style: any }) {
  if (!src || typeof src !== 'string' || !/^https?:\/\//.test(src) && !src.startsWith('/')) {
    return null;
  }
  try {
    return (
      /* eslint-disable-next-line jsx-a11y/alt-text */
      <Image src={src} style={style} />
    );
  } catch (err) {
    console.error('PDF image failed to render:', src, err);
    return null;
  }
}

Font.registerHyphenationCallback((word) => [word]);

type PdfImages = { logo: string; gallery: string[] };


const COLORS = {
  primary: '#016733',
  primaryLight: '#F0FFF7',
  navy: '#1c1466',
  text: '#2b2f33',
  muted: '#6b7280',
  border: '#E5E7EB',
  danger: '#dc2626',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Amiri',
    direction: 'rtl',
    fontSize: 10.5,
    lineHeight: 1.6,
    color: COLORS.text,
    paddingBottom: 56, // room for footer
  },

  // ---- Header bar (every page) ----
  headerBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.navy,
    paddingHorizontal: 28,
    paddingVertical: 12,
    marginBottom: 0,
  },
  logo: {
    width: 90,
    height: 32,
    objectFit: 'contain',
  },
  headerTagline: {
    color: '#ffffff',
    fontSize: 9,
    opacity: 0.85,
  },

  body: {
    paddingHorizontal: 28,
    paddingTop: 20,
  },

  // ---- Hero ----
  heroWrap: {
    position: 'relative',
    marginBottom: 18,
  },
  heroImage: {
    width: '100%',
    height: 210,
    objectFit: 'cover',
    borderRadius: 10,
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.navy,
    textAlign: 'right',
    marginBottom: 3,
  },
  destination: {
    fontSize: 10.5,
    color: COLORS.muted,
    textAlign: 'right',
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: 'row-reverse',
    marginBottom: 18,
  },
  statBadge: {
    backgroundColor: COLORS.primaryLight,
    color: COLORS.primary,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 14,
    fontSize: 9.5,
    fontWeight: 'bold',
    marginLeft: 8,
  },

  sectionTitle: {
    fontSize: 13.5,
    fontWeight: 'bold',
    color: COLORS.navy,
    textAlign: 'right',
    marginTop: 18,
    marginBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.border,
    paddingBottom: 6,
  },
  paragraph: {
    textAlign: 'right',
    marginBottom: 8,
  },

  // ---- Include / exclude two-column ----
  twoCol: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  colBox: {
    flex: 1,
    borderRadius: 8,
    padding: 10,
  },
  includeBox: {
    backgroundColor: COLORS.primaryLight,
  },
  excludeBox: {
    backgroundColor: '#FEF2F2',
  },
  colHeading: {
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 6,
    fontSize: 11,
  },
  listRow: {
    flexDirection: 'row-reverse',
    marginBottom: 4,
  },
  bulletGreen: {
    color: COLORS.primary,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  bulletRed: {
    color: COLORS.danger,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  listText: {
    textAlign: 'right',
    flex: 1,
  },

  // ---- Days ----
  dayBlock: {
    marginBottom: 10,
    backgroundColor: '#FAFAFA',
    borderRightWidth: 3,
    borderRightColor: COLORS.primary,
    borderRadius: 4,
    padding: 10,
  },
  dayTitleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 4,
  },
  dayNumberBadge: {
    backgroundColor: COLORS.primary,
    color: '#fff',
    width: 18,
    height: 18,
    borderRadius: 9,
    fontSize: 9,
    textAlign: 'center',
    paddingTop: 3,
    marginLeft: 6,
  },
  dayTitle: {
    fontWeight: 'bold',
    fontSize: 11,
  },
  dayDesc: {
    textAlign: 'right',
    color: '#3d3d3d',
  },

  // ---- Hotels ----
  hotelRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 5,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primary,
    marginLeft: 6,
  },

  // ---- Photo grid ----
  photoGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoItem: {
    width: '31.5%',
    height: 90,
    borderRadius: 6,
    objectFit: 'cover',
  },

  // ---- Footer ----
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 36,
    backgroundColor: COLORS.navy,
    paddingVertical: 10,
    paddingHorizontal: 28,
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    color: '#fff',
    fontSize: 8.5,
  },
  footerMuted: {
    color: '#ffffffaa',
    fontSize: 8,
  },
});

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, (m) => {
    const entities: Record<string, string> = {
      '&amp;': '&', '&lt;': '<', '&gt;': '>', '&nbsp;': ' ',
      '&#8211;': '–', '&#8212;': '—', '&#8216;': "'", '&#8217;': "'",
      '&#8220;': '"', '&#8221;': '"',
    };
    return entities[m] ?? m;
  });
}

type Trip = {
  title: string;
  description: string;
  acf: {
    destination: Array<{ name: string }>;
    price: string;
    duration: string;
    advantages: Array<{ text: string }>;
    disadvantages: Array<{ text: string }>;
    days: Array<{ day: { title: string; desc: string } }>;
    gallery: string[];
    'suggested-hotels': Array<{ text: string }>;
  };
};

// ---- Reusable header/footer so they repeat on every page ----
function PdfHeader({ logo }: { logo: string }) {
  return (
    <View style={styles.headerBar} fixed>
      {logo ? <Image src={logo} style={styles.logo} /> : null}
      <Text style={styles.headerTagline}>برنامج رحلتك التفصيلي</Text>
    </View>
  );
}

function PdfFooter() {
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>
        للاستفسار والحجز: 966920032065+ | tayyran.com
      </Text>
      <Text
        style={styles.footerMuted}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}

export default function TripPdfDocument({ trip, images }: {
  trip: Trip, images: PdfImages;
}) {
  const destination = trip.acf.destination?.[0]?.name || 'رحلة مميزة';
  const galleryImages = trip.acf.gallery?.filter(Boolean) ?? [];
  const heroImage = images.gallery[0] || '';
  const restImages = images.gallery.slice(1, 7).filter(Boolean);
  const price = Number(trip.acf.price || '0').toLocaleString();
  const duration = trip.acf.duration || '0';
  const description = stripHtml(trip.description || '');
  const includeItems = trip.acf.advantages ?? [];
  const excludeItems = trip.acf.disadvantages ?? [];
  const days = trip.acf.days ?? [];
  const hotels = trip.acf['suggested-hotels'] ?? [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <PdfHeader logo={images.logo} />

        <View style={styles.body}>
          <View style={styles.heroWrap}>
            {heroImage && (
              /* eslint-disable-next-line jsx-a11y/alt-text */
              <SafeImage src={heroImage} style={styles.heroImage} />
            )}
          </View>

          <Text style={styles.title}>{trip.title}</Text>
          <Text style={styles.destination}>{destination}</Text>

          <View style={styles.statsRow}>
            <Text style={styles.statBadge}>{price} ريال</Text>
            <Text style={styles.statBadge}>{duration} أيام</Text>
          </View>

          <Text style={styles.sectionTitle}>وصف البرنامج</Text>
          <Text style={styles.paragraph}>{description}</Text>

          <Text style={styles.sectionTitle}>تفاصيل البرنامج</Text>
          <View style={styles.twoCol}>
            <View style={[styles.colBox, styles.includeBox]}>
              <Text style={styles.colHeading}>البرنامج يشمل</Text>
              {includeItems.map((item, i) => (
                <View style={styles.listRow} key={`inc-${i}`}>
                  <Text style={styles.bulletGreen}>✓</Text>
                  <Text style={styles.listText}>{item.text}</Text>
                </View>
              ))}
            </View>
            <View style={[styles.colBox, styles.excludeBox]}>
              <Text style={styles.colHeading}>البرنامج لا يشمل</Text>
              {excludeItems.map((item, i) => (
                <View style={styles.listRow} key={`exc-${i}`}>
                  <Text style={styles.bulletRed}>✕</Text>
                  <Text style={styles.listText}>{item.text}</Text>
                </View>
              ))}
            </View>
          </View>

          {hotels.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>الفنادق المقترحة</Text>
              {hotels.map((h, i) => (
                <View style={styles.hotelRow} key={`hotel-${i}`}>
                  <View style={styles.dot} />
                  <Text>{h.text}</Text>
                </View>
              ))}
            </>
          )}

          <Text style={styles.sectionTitle} break>يوميات الرحلة</Text>
          {days.map((d, i) => (
            <View key={`day-${i}`} style={styles.dayBlock} wrap={false}>
              <View style={styles.dayTitleRow}>
                <Text style={styles.dayNumberBadge}>{i + 1}</Text>
                <Text style={styles.dayTitle}>{d.day.title}</Text>
              </View>
              <Text style={styles.dayDesc}>{d.day.desc}</Text>
            </View>
          ))}

          {restImages.length > 0 && (
            <>
              <Text style={styles.sectionTitle} break>صور من الرحلة</Text>
              <View style={styles.photoGrid}>
                {restImages.map((src, i) => (
                  /* eslint-disable-next-line jsx-a11y/alt-text */
                  <SafeImage key={`photo-${i}`} src={src} style={styles.photoItem} />
                ))}
              </View>
            </>
          )}
        </View>

        <PdfFooter />
      </Page>
    </Document>
  );
}