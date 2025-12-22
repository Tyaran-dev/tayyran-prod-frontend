import React from "react";
import TayyranTicketEmail from "@/app/components/shared/FlightEmailTemplte";

export interface FlightData {
  _id: {
    $oid: string;
  };
  invoiceId: string;
  paymentId: string;
  status: string;
  InvoiceValue: number;
  bookingType: string;
  orderData: {
    meta: {
      count: number;
      links: {
        self: string;
      };
    };
    data: {
      type: string;
      id: string;
      queuingOfficeId: string;
      associatedRecords: {
        reference: string;
        originSystemCode: string;
        flightOfferId: string;
        creationDate?: string;
      }[];
      flightOffers: {
        type: string;
        id: string;
        source: string;
        nonHomogeneous: boolean;
        instantTicketingRequired?: boolean;
        paymentCardRequired?: boolean;
        lastTicketingDate: string;
        itineraries: {
          segments: {
            id: string;
            departure: {
              iataCode: string;
              terminal?: string;
              at: string;
            };
            arrival: {
              iataCode: string;
              terminal?: string;
              at: string;
            };
            carrierCode: string;
            number: string;
            aircraft: {
              code: string;
            };
            operating?: {
              carrierCode: string;
            };
            duration: string;
            bookingStatus?: string;
            segmentType?: string;
            isFlown?: boolean;
            numberOfStops: number;
            co2Emissions: {
              weight: number;
              weightUnit: string;
              cabin: string;
            }[];
          }[];
        }[];
        price: {
          currency: string;
          total: string;
          base: string;
          grandTotal?: string;
          billingCurrency?: string;
          fees?: {
            amount: string;
            type: string;
          }[];
        };
        pricingOptions: {
          fareType: string[];
          includedCheckedBagsOnly?: boolean;
        };
        validatingAirlineCodes: string[];
        travelerPricings: {
          travelerId: string;
          fareOption: string;
          travelerType: string;
          price: {
            currency: string;
            total: string;
            base: string;
            taxes?: {
              amount: string;
              code: string;
            }[];
          };
          fareDetailsBySegment: {
            segmentId: string;
            cabin: string;
            fareBasis: string;
            brandedFare?: string;
            class: string;
            includedCheckedBags: {
              quantity?: number;
            };
            mealServices?: {
              label: string;
            }[];
          }[];
        }[];
      }[];
      travelers: {
        id: string;
        dateOfBirth: string;
        gender: string;
        name: {
          firstName: string;
          lastName: string;
        };
        documents: {
          number: string;
          expiryDate: string;
          issuanceCountry: string;
          nationality: string;
          documentType: string;
          holder: boolean;
        }[];
        contact: {
          purpose: string;
          phones: {
            deviceType: string;
            countryCallingCode: string;
            number: string;
          }[];
          emailAddress: string;
        };
      }[];
      remarks: {
        general: {
          subType: string;
          text: string;
          flightOfferIds: string[];
        }[];
      };
      ticketingAgreement: {
        option: string;
      };
      contacts: {
        addresseeName: {
          firstName: string;
        };
        address: {
          lines: string[];
          countryCode: string;
          cityName: string;
          stateName: string;
        };
        purpose: string;
        phones?: {
          deviceType: string;
          number: string;
        }[];
        emailAddress?: string;
      }[];
      tickets: {
        documentType: string;
        documentNumber: string;
        documentStatus: string;
        travelerId: string;
        segmentIds: string[];
      }[];
      commissions: {
        controls: string[];
        values: {
          commissionType: string;
          percentage: number;
        }[];
      }[];
    };
    dictionaries: {
      locations: Record<
        string,
        {
          cityCode: string;
          countryCode: string;
        }
      >;
    };
    airlines: Record<
      string,
      {
        id: {
          $oid: string;
        };
        code: string;
        name: {
          en: string;
          ar: string;
        };
        image: string;
      }
    >;
    airports: Record<
      string,
      {
        id: {
          $oid: string;
        };
        code: string;
        name: {
          en: string;
          ar: string;
        };
        city: {
          en: string;
          ar: string;
        };
      }
    >;
  };
  bookingPayload: {
    flightOffer: {
      type: string;
      id: string;
      source: string;
      instantTicketingRequired: boolean;
      nonHomogeneous: boolean;
      paymentCardRequired: boolean;
      lastTicketingDate: string;
      itineraries: {
        segments: {
          departure: {
            iataCode: string;
            terminal?: string;
            at: string;
          };
          arrival: {
            iataCode: string;
            terminal?: string;
            at: string;
          };
          carrierCode: string;
          number: string;
          aircraft: {
            code: string;
          };
          operating: {
            carrierCode: string;
          };
          duration: string;
          id: string;
          numberOfStops: number;
          co2Emissions: {
            weight: number;
            weightUnit: string;
            cabin: string;
          }[];
        }[];
      }[];
      price: {
        currency: string;
        total: string;
        base: string;
        grandTotal: string;
        billingCurrency: string;
        fees: {
          amount: string;
          type: string;
        }[];
      };
      pricingOptions: {
        fareType: string[];
        includedCheckedBagsOnly: boolean;
      };
      validatingAirlineCodes: string[];
      travelerPricings: {
        travelerId: string;
        fareOption: string;
        travelerType: string;
        price: {
          currency: string;
          total: string;
          base: string;
          taxes: {
            amount: string;
            code: string;
          }[];
        };
        fareDetailsBySegment: {
          segmentId: string;
          cabin: string;
          fareBasis: string;
          brandedFare: string;
          class: string;
          includedCheckedBags: {
            quantity: number;
          };
        }[];
      }[];
    };
    travelers: {
      travelerId: number;
      title: string;
      firstName: string;
      middleName: string;
      lastName: string;
      dateOfBirth: {
        day: string;
        month: string;
        year: string;
      };
      nationality: string;
      documentType: string;
      passportNumber: string;
      issuanceCountry: string;
      passportExpiry: {
        day: string;
        month: string;
        year: string;
      };
      email: string;
      phoneCode: string;
      phoneNumber: string;
      isCompleted: boolean;
      travelerType: string;
    }[];
    bookingType: string;
  };
  createdAt: {
    $date: string;
  };
  __v: number;
}

const flightData: FlightData = {
  _id: {
    $oid: "68e6989f503d0505415363ac",
  },
  invoiceId: "58744540",
  paymentId: "0808587445405724508083",
  status: "CONFIRMED",
  InvoiceValue: 380.65,
  bookingType: "flight",
  orderData: {
    meta: {
      count: 1,
      links: {
        self: "https://travel.api.amadeus.com/v1/booking/flight-orders/eJzTd9e3MAmI9PQFAAqvAlE%3D/issuance",
      },
    },
    data: {
      type: "flight-order",
      id: "eJzTd9e3MAmI9PQFAAqvAlE%3D",
      queuingOfficeId: "RUHS228Z3",
      associatedRecords: [
        {
          reference: "84PYIM",
          originSystemCode: "SV",
          flightOfferId: "1",
        },
        {
          reference: "84PYIM",
          creationDate: "2025-10-08T17:00:00",
          originSystemCode: "GDS",
          flightOfferId: "1",
        },
      ],
      flightOffers: [
        {
          type: "flight-offer",
          id: "1",
          source: "GDS",
          nonHomogeneous: false,
          lastTicketingDate: "2025-10-25",
          itineraries: [
            {
              segments: [
                {
                  departure: {
                    iataCode: "RUH",
                    terminal: "5",
                    at: "2025-10-25T04:00:00",
                  },
                  arrival: {
                    iataCode: "JED",
                    terminal: "1",
                    at: "2025-10-25T05:50:00",
                  },
                  carrierCode: "SV",
                  number: "1015",
                  aircraft: {
                    code: "320",
                  },
                  duration: "PT1H50M",
                  bookingStatus: "CONFIRMED",
                  segmentType: "ACTIVE",
                  isFlown: false,
                  id: "1",
                  numberOfStops: 0,
                  co2Emissions: [
                    {
                      weight: 85,
                      weightUnit: "KG",
                      cabin: "ECONOMY",
                    },
                  ],
                },
              ],
            },
          ],
          price: {
            currency: "SAR",
            total: "359.95",
            base: "248.00",
            grandTotal: "359.95",
          },
          pricingOptions: {
            fareType: ["PUBLISHED"],
          },
          validatingAirlineCodes: ["SV"],
          travelerPricings: [
            {
              travelerId: "1",
              fareOption: "STANDARD",
              travelerType: "ADULT",
              price: {
                currency: "SAR",
                total: "359.95",
                base: "248.00",
                taxes: [
                  {
                    amount: "25.00",
                    code: "IO",
                  },
                  {
                    amount: "46.95",
                    code: "K7",
                  },
                  {
                    amount: "5.00",
                    code: "T2",
                  },
                  {
                    amount: "35.00",
                    code: "YR",
                  },
                ],
              },
              fareDetailsBySegment: [
                {
                  segmentId: "1",
                  cabin: "ECONOMY",
                  fareBasis: "VAODSAB4",
                  class: "V",
                  includedCheckedBags: {
                    quantity: 1,
                  },
                  mealServices: [
                    {
                      label: "Meal",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      travelers: [
        {
          id: "1",
          dateOfBirth: "1980-01-01",
          gender: "MALE",
          name: {
            firstName: "HESHAM",
            lastName: "ABOASHOUR",
          },
          documents: [
            {
              number: "A29565183",
              expiryDate: "2028-12-16",
              issuanceCountry: "EG",
              nationality: "EG",
              documentType: "PASSPORT",
              holder: true,
            },
          ],
          contact: {
            purpose: "STANDARD",
            phones: [
              {
                deviceType: "MOBILE",
                countryCallingCode: "966",
                number: "533322921",
              },
            ],
            emailAddress: "HESHAMCONSULTANT0@GMAIL.COM",
          },
        },
      ],
      remarks: {
        general: [
          {
            subType: "GENERAL_MISCELLANEOUS",
            text: "PRICING ENTRY FXP/SBF/FF-NBASICE/R,P,VC-SV,FC-SAR/P1",
            flightOfferIds: ["1"],
          },
        ],
      },
      ticketingAgreement: {
        option: "CONFIRM",
      },
      contacts: [
        {
          addresseeName: {
            firstName: "QESSA TRAVEL & TOURISM",
          },
          address: {
            lines: ["ANAS IBN MALEK ST", "ALMALQA"],
            countryCode: "SA",
            cityName: "RIYADH",
            stateName: "SAUDI ARABIA",
          },
          purpose: "STANDARD",
          phones: [
            {
              deviceType: "LANDLINE",
              number: "(00966)533322921",
            },
          ],
          emailAddress: "INFO@MOVEJEJE.COM",
        },
        {
          addresseeName: {
            firstName: "QESSA TRAVEL & TOURISM",
          },
          address: {
            lines: ["ANAS IBN MALEK ST", "ALMALQA"],
            countryCode: "SA",
            cityName: "RIYADH",
            stateName: "SAUDI ARABIA",
          },
          purpose: "INVOICE",
        },
      ],
      tickets: [
        {
          documentType: "ETICKET",
          documentNumber: "065-5065404407",
          documentStatus: "ISSUED",
          travelerId: "1",
          segmentIds: ["1"],
        },
      ],
      commissions: [
        {
          controls: ["MANUAL"],
          values: [
            {
              commissionType: "NEW",
              percentage: 0,
            },
          ],
        },
      ],
    },
    dictionaries: {
      locations: {
        RUH: {
          cityCode: "RUH",
          countryCode: "SA",
        },
        JED: {
          cityCode: "JED",
          countryCode: "SA",
        },
      },
    },
    airlines: {
      SV: {
        id: {
          $oid: "686f88bc7ce3837a4826bf68",
        },
        code: "SV",
        name: {
          en: "Saudia",
          ar: "السعودية",
        },
        image:
          "https://assets.wego.com/image/upload/h_240,c_fill,f_auto,fl_lossy,q_auto:best,g_auto/v20240602/flights/airlines_square/SV.png",
      },
    },
    airports: {
      JED: {
        id: {
          $oid: "686f9d23b8d2c4109e88fef2",
        },
        code: "JED",
        name: {
          en: "King Abdulaziz International Airport",
          ar: "الملك عبد العزيز الدولي - جده",
        },
        city: {
          en: "Jeddah - SAUDI ARABIA",
          ar: "جدة",
        },
      },
      RUH: {
        id: {
          $oid: "686f9d23b8d2c4109e8909d1",
        },
        code: "RUH",
        name: {
          en: "King Khaled International Airport",
          ar: "مطار الملك خالد الدولي",
        },
        city: {
          en: "Riyadh - SAUDI ARABIA",
          ar: "الرياض",
        },
      },
    },
  },
  bookingPayload: {
    flightOffer: {
      type: "flight-offer",
      id: "1",
      source: "GDS",
      instantTicketingRequired: false,
      nonHomogeneous: false,
      paymentCardRequired: false,
      lastTicketingDate: "2025-10-25",
      itineraries: [
        {
          segments: [
            {
              departure: {
                iataCode: "RUH",
                terminal: "5",
                at: "2025-10-25T04:00:00",
              },
              arrival: {
                iataCode: "JED",
                terminal: "1",
                at: "2025-10-25T05:50:00",
              },
              carrierCode: "SV",
              number: "1015",
              aircraft: {
                code: "320",
              },
              operating: {
                carrierCode: "SV",
              },
              duration: "PT1H50M",
              id: "137",
              numberOfStops: 0,
              co2Emissions: [
                {
                  weight: 85,
                  weightUnit: "KG",
                  cabin: "ECONOMY",
                },
              ],
            },
          ],
        },
      ],
      price: {
        currency: "SAR",
        total: "359.95",
        base: "248.00",
        fees: [
          {
            amount: "0.00",
            type: "SUPPLIER",
          },
          {
            amount: "0.00",
            type: "TICKETING",
          },
          {
            amount: "0.00",
            type: "FORM_OF_PAYMENT",
          },
        ],
        grandTotal: "359.95",
        billingCurrency: "SAR",
      },
      pricingOptions: {
        fareType: ["PUBLISHED"],
        includedCheckedBagsOnly: true,
      },
      validatingAirlineCodes: ["SV"],
      travelerPricings: [
        {
          travelerId: "1",
          fareOption: "STANDARD",
          travelerType: "ADULT",
          price: {
            currency: "SAR",
            total: "359.95",
            base: "248.00",
            taxes: [
              {
                amount: "25.00",
                code: "IO",
              },
              {
                amount: "35.00",
                code: "YR",
              },
              {
                amount: "46.95",
                code: "K7",
              },
              {
                amount: "5.00",
                code: "T2",
              },
            ],
          },
          fareDetailsBySegment: [
            {
              segmentId: "137",
              cabin: "ECONOMY",
              fareBasis: "VAODSAB4",
              brandedFare: "NBASICE",
              class: "V",
              includedCheckedBags: {
                quantity: 1,
              },
            },
          ],
        },
      ],
    },
    travelers: [
      {
        travelerId: 1,
        title: "Mr",
        firstName: "Hesham",
        middleName: "",
        lastName: "aboAshour",
        dateOfBirth: {
          day: "1",
          month: "1",
          year: "1980",
        },
        nationality: "EG",
        documentType: "PASSPORT",
        passportNumber: "a29565183",
        issuanceCountry: "EG",
        passportExpiry: {
          day: "16",
          month: "12",
          year: "2028",
        },
        email: "heshamconsultant0@gmail.com",
        phoneCode: "+966",
        phoneNumber: "533322921",
        isCompleted: true,
        travelerType: "ADULT",
      },
    ],
    bookingType: "flight",
  },
  createdAt: {
    $date: "2025-10-08T17:00:15.739Z",
  },
  __v: 0,
};

const page = () => {
  return <TayyranTicketEmail flightData={flightData} />;
};

export default page;
