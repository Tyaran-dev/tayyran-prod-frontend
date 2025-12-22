import { Resend } from "resend";
import TayyranTicketEmail from "../../components/shared/FlightEmailTemplte";
import * as React from "react";

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

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  // ✅ Parse JSON body first
  const body = await req.json();
  // Then access properties from body
  const { ticketInfo, to } = body;

  try {
    // ✅ `react:` expects a React element, so this is correct
    const { data, error } = await resend.emails.send({
      from: "Tayyran.com <info@primespa.site>",
      to: to,
      subject: `Tayyran.com - Booking Done - ${ticketInfo.orderData.data.associatedRecords[0].reference}`,
      react: React.createElement(TayyranTicketEmail, {
        flightData: ticketInfo,
      }), // ✅ FIX
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
