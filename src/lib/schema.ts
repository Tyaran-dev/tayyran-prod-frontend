const BASE_URL = "https://tayyran.com";
const SITE_NAME = "Tayyran";
const SITE_DESCRIPTION =
    "Tayyran is a trusted online travel agency offering flight booking, hotel reservations, holiday packages, and travel services across Saudi Arabia and Kuwait.";

export const organizationSchema = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "Organization",
            "@id": `${BASE_URL}/#organization`,
            legalName: "Tayyran Travel",
            name: SITE_NAME,
            alternateName: "Tayyran Travel",
            url: BASE_URL,
            logo: {
                "@type": "ImageObject",
                "@id": `${BASE_URL}/#logo`,
                url: `${BASE_URL}/logo.png`,
                contentUrl: `${BASE_URL}/logo.png`,
                caption: SITE_NAME,
            },
            image: {
                "@id": `${BASE_URL}/#logo`,
            },
            description: SITE_DESCRIPTION,
            slogan: "Book smarter, travel better",
            keywords: [
                "flights",
                "hotels",
                "holiday packages",
                "travel booking",
                "Saudi Arabia",
                "Kuwait",
            ],
            email: "info@tayyran.com",
            telephone: "+966920032065",
            address: {
                "@type": "PostalAddress",
                streetAddress: "شارع سودة بنت زمعة",
                addressLocality: "الرياض",
                addressRegion: "حي الملك فيصل",
                addressCountry: "SA",
            },
            areaServed: [
                {
                    "@type": "Country",
                    name: "Saudi Arabia",
                },
                {
                    "@type": "Country",
                    name: "Kuwait",
                },
            ],
            currenciesAccepted: ["SAR", "KWD", "USD"],
            paymentAccepted: ["Cash", "Credit Card", "Debit Card", "Bank Transfer"],
            priceRange: "$$",
            sameAs: [
                "https://www.tiktok.com/@tayyran?_r=1&_t=ZS-98BlSXqaHHb",
                "https://www.instagram.com/tayyran?igsh=ZzY5dzR4c3Z3MDl3",
                "https://x.com/tayyran?s=21",
                "https://www.linkedin.com/company/tayyran/posts/?feedView=all",
            ],
            contactPoint: {
                "@id": `${BASE_URL}/#contact`,
            },
            brand: {
                "@id": `${BASE_URL}/#brand`,
            },
        },
        {
            "@type": "ContactPoint",
            "@id": `${BASE_URL}/#contact`,
            telephone: "+966920032065",
            email: "info@tayyran.com",
            contactType: "customer support",
            areaServed: ["SA", "KW"],
            availableLanguage: ["Arabic", "English"],
        },
        {
            "@type": "Person",
            "@id": `${BASE_URL}/#founder`,
            name: "Tayyran Leadership Team",
            jobTitle: "Leadership",
            description: "Leadership team behind Tayyran Travel services.",
        },
        {
            "@type": "Brand",
            "@id": `${BASE_URL}/#brand`,
            name: SITE_NAME,
            url: BASE_URL,
            logo: `${BASE_URL}/logo.png`,
            slogan: "Book smarter, travel better",
        },
        {
            "@type": "TravelAgency",
            "@id": `${BASE_URL}/#travelagency`,
            name: SITE_NAME,
            url: BASE_URL,
            logo: `${BASE_URL}/logo.png`,
            telephone: "+966920032065",
            description: SITE_DESCRIPTION,
            address: {
                "@id": `${BASE_URL}/#organization`,
            },
            parentOrganization: {
                "@id": `${BASE_URL}/#organization`,
            },
        },
        {
            "@type": "WebSite",
            "@id": `${BASE_URL}/#website`,
            url: BASE_URL,
            name: SITE_NAME,
            alternateName: "Tayyran Travel",
            description: SITE_DESCRIPTION,
            inLanguage: ["ar", "en"],
            publisher: {
                "@id": `${BASE_URL}/#organization`,
            },
            mainEntity: {
                "@id": `${BASE_URL}/#organization`,
            },
            potentialAction: {
                "@type": "SearchAction",
                target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
            },
        },
    ],
};