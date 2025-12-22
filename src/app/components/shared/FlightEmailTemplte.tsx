import * as React from "react";
import { FlightData } from "@/app/[locale]/(root)/email-test/page";
import { Section, Row, Column } from "@react-email/components";

interface TayyranTicketEmailProps {
  flightData: FlightData;
}

export default function TayyranTicketEmail({
  flightData,
}: TayyranTicketEmailProps) {
  console.log(flightData);
  const orderData = flightData.orderData;
  const order = flightData?.orderData?.data;
  const flightOffer = order?.flightOffers?.[0];
  const traveler = order?.travelers?.[0];
  const tickets = order?.tickets;
  const reference = order?.associatedRecords?.[0]?.reference;
  const airLines = orderData.airlines;
  const airPorts = orderData.airports;
  const bookingDate = order?.associatedRecords?.[1]?.creationDate
    ? new Date(order.associatedRecords[1].creationDate).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      )
    : new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

  const formatTime = (datetime: string) =>
    new Date(datetime).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

  const formatDate = (datetime: string) =>
    new Date(datetime).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  const getCityName = (cityString: string) => {
    if (!cityString) return "";
    return cityString.split(" - ")[0];
  };

  const calculateFlightDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr.getTime() - dep.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const minutes = diffMins % 60;
    return `${hours}h ${minutes}m`;
  };

  return (
    <div
      style={{
        backgroundColor: "#f6f9fc",
        fontFamily: "Arial, sans-serif",
        padding: "0",
        margin: "0",
        lineHeight: "1.5",
        width: "100%",
      }}
    >
      <table
        width="100%"
        border={0}
        cellPadding={0}
        cellSpacing={0}
        bgcolor="#f6f9fc"
        style={{ maxWidth: "700px", margin: "0 auto" }}
      >
        <tr>
          <td align="center">
            <table
              width="100%"
              border={0}
              cellPadding={0}
              cellSpacing={0}
              bgcolor="#ffffff"
              style={{
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                maxWidth: "700px",
                width: "100%",
              }}
            >
              {/* Header */}
              <tr>
                <td
                  style={{
                    background:
                      "linear-gradient(90deg, #0c9e66 0%, #1c1e84 100%)",
                    color: "white",
                    padding: "20px",
                    fontSize: "14px",
                  }}
                >
                  <table
                    width="100%"
                    border={0}
                    cellPadding={0}
                    cellSpacing={0}
                  >
                    <tr>
                      <td align="left" style={{ width: "30%" }}>
                        <div
                          style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <img
                            src="https://qessatravel.com/wp-content/uploads/2025/10/5.png"
                            width="80"
                            height="80"
                            style={{ verticalAlign: "middle" }}
                            alt="Logo"
                          />
                        </div>
                        <div style={{ marginTop: "5px" }}>{bookingDate}</div>
                      </td>
                      <td
                        align="right"
                        style={{
                          width: "70%",
                          fontSize: "13px",
                        }}
                      >
                        <strong>Booking Reference:</strong> {reference}
                        <br />
                        For:{" "}
                        <strong>
                          {traveler?.name?.firstName} {traveler?.name?.lastName}
                        </strong>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              {/* Flight Info */}
              {flightOffer?.itineraries?.map((itinerary, i) => (
                <tr key={i}>
                  <td
                    style={{
                      padding: "15px",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <table
                      width="100%"
                      border={0}
                      cellPadding={12}
                      cellSpacing={0}
                      style={{
                        border: "1px solid #FF7300",
                        borderRadius: "12px",
                      }}
                    >
                      {itinerary.segments.map((seg, index) => (
                        <React.Fragment key={index}>
                          <tr>
                            <td
                              align="center"
                              style={{ paddingBottom: "10px" }}
                            >
                              <div
                                style={{
                                  display: "inline-block",
                                  backgroundColor: "#e6ebf2",
                                  color: "#444",
                                  fontSize: "13px",
                                  padding: "6px 12px",
                                  fontWeight: "bold",
                                  textAlign: "center",
                                  borderRadius: "10px",
                                }}
                              >
                                <table
                                  border={0}
                                  cellPadding={0}
                                  cellSpacing={0}
                                  align="center"
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style={{
                                          verticalAlign: "middle",
                                          paddingRight: "5px",
                                        }}
                                      >
                                        <img
                                          src={airLines[seg.carrierCode]?.image}
                                          width="20"
                                          height="20"
                                          style={{ display: "block" }}
                                          alt="Logo"
                                        />
                                      </td>
                                      <td
                                        style={{
                                          verticalAlign: "middle",
                                          fontSize: "13px",
                                          color: "#444",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {seg.carrierCode} {seg.number}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              {/* Desktop Layout - Table Design */}
                              <table
                                width="100%"
                                border={0}
                                cellPadding={0}
                                cellSpacing={0}
                                className="desktop-view"
                                style={{ display: "table" }}
                              >
                                <tr>
                                  <td
                                    width="45%"
                                    align="left"
                                    valign="top"
                                    style={{ padding: "0" }}
                                  >
                                    <div style={{ paddingRight: "10px" }}>
                                      <p
                                        style={{
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                          color: "#10763d",
                                          margin: "0 0 5px 0",
                                        }}
                                      >
                                        {getCityName(
                                          airPorts?.[seg.departure.iataCode]
                                            ?.city.en || seg.departure.iataCode
                                        ) || seg.arrival.iataCode}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: "12px",
                                          margin: "0 0 8px 0",
                                          color: "#666",
                                        }}
                                      >
                                        {airPorts?.[seg.departure.iataCode]
                                          ?.name.en || seg.departure.iataCode}
                                      </p>
                                      <div
                                        style={{
                                          fontSize: "13px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        <p
                                          style={{
                                            color: "#1c1e84",
                                            margin: "2px 0",
                                          }}
                                        >
                                          {formatDate(seg.departure.at)}
                                        </p>
                                        <span style={{ color: "#1c1e84" }}>
                                          {formatTime(seg.departure.at)}
                                        </span>
                                      </div>
                                    </div>
                                  </td>

                                  <td
                                    width="10%"
                                    align="center"
                                    valign="middle"
                                    style={{ padding: "0" }}
                                  >
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        color: "#555",
                                      }}
                                    >
                                      <p style={{ margin: "0 0 5px 0" }}>✈️</p>
                                      {calculateFlightDuration(
                                        seg.departure.at,
                                        seg.arrival.at
                                      )}
                                    </div>
                                  </td>

                                  <td
                                    width="45%"
                                    align="right"
                                    valign="top"
                                    style={{ padding: "0" }}
                                  >
                                    <div style={{ paddingLeft: "10px" }}>
                                      <p
                                        style={{
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                          color: "#10763d",
                                          margin: "0 0 5px 0",
                                        }}
                                      >
                                        {getCityName(
                                          airPorts?.[seg.arrival.iataCode]?.city
                                            .en ||
                                            seg.arrival.iataCode ||
                                            seg.departure.iataCode
                                        ) || seg.arrival.iataCode}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: "12px",
                                          margin: "0 0 8px 0",
                                          color: "#666",
                                        }}
                                      >
                                        {airPorts?.[seg.arrival.iataCode]?.name
                                          .en || seg.arrival.iataCode}
                                      </p>
                                      <div
                                        style={{
                                          fontSize: "13px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        <p
                                          style={{
                                            color: "#1c1e84",
                                            margin: "2px 0",
                                          }}
                                        >
                                          {formatDate(seg.arrival.at)}
                                        </p>
                                        <span style={{ color: "#1c1e84" }}>
                                          {formatTime(seg.arrival.at)}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </table>

                              {/* Mobile Layout - Stack Design */}
                              <table
                                width="100%"
                                border={0}
                                cellPadding={0}
                                cellSpacing={0}
                                className="mobile-view"
                                style={{ display: "none" }}
                              >
                                <tr>
                                  <td
                                    align="center"
                                    valign="top"
                                    style={{ paddingBottom: "15px" }}
                                  >
                                    <div>
                                      <p
                                        style={{
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                          color: "#10763d",
                                          margin: "0",
                                        }}
                                      >
                                        {getCityName(
                                          airPorts?.[seg.departure.iataCode]
                                            ?.city.en || seg.departure.iataCode
                                        ) || seg.departure.iataCode}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: "12px",
                                          margin: "2px 0",
                                        }}
                                      >
                                        {airPorts?.[seg.departure.iataCode]
                                          ?.name.en || seg.departure.iataCode}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: "13px",
                                          fontWeight: "bold",
                                          color: "#1c1e84",
                                          margin: "5px 0",
                                        }}
                                      >
                                        {formatDate(seg.departure.at)}{" "}
                                        {formatTime(seg.departure.at)}
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    align="center"
                                    valign="middle"
                                    style={{ padding: "10px 0" }}
                                  >
                                    <div
                                      style={{
                                        fontSize: "12px",
                                        color: "#555",
                                      }}
                                    >
                                      <p style={{ margin: "0" }}>✈️</p>
                                      {calculateFlightDuration(
                                        seg.departure.at,
                                        seg.arrival.at
                                      )}
                                    </div>
                                  </td>
                                </tr>
                                <tr>
                                  <td align="center" valign="top">
                                    <div>
                                      <p
                                        style={{
                                          fontSize: "18px",
                                          fontWeight: "bold",
                                          color: "#10763d",
                                          margin: "0",
                                        }}
                                      >
                                        {getCityName(
                                          airPorts?.[seg.arrival.iataCode]?.city
                                            .en || seg.arrival.iataCode
                                        ) || seg.arrival.iataCode}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: "12px",
                                          margin: "2px 0",
                                        }}
                                      >
                                        {airPorts?.[seg.arrival.iataCode]?.name
                                          .en || seg.arrival.iataCode}
                                      </p>
                                      <p
                                        style={{
                                          fontSize: "13px",
                                          fontWeight: "bold",
                                          color: "#1c1e84",
                                          margin: "5px 0",
                                        }}
                                      >
                                        {formatDate(seg.arrival.at)}{" "}
                                        {formatTime(seg.arrival.at)}
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </table>
                  </td>
                </tr>
              ))}

              {/* Passenger Info */}
              <tr>
                <td style={{ padding: "15px" }}>
                  <h3
                    style={{
                      fontSize: "16px",
                      color: "#1c1e84",
                      fontWeight: "bold",
                      marginBottom: "12px",
                    }}
                  >
                    👤 Passenger Info
                  </h3>

                  {/* Mobile Passenger Info (stacked cards) */}
                  <div
                    className="mobile-passenger-info"
                    style={{
                      display: "block",
                      width: "100%",
                    }}
                  >
                    {order?.travelers?.map((trav, i) => (
                      <div
                        key={i}
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                          border: "1px solid #eee",
                          padding: "15px",
                          marginBottom: "10px",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <div style={{ marginBottom: "10px" }}>
                          <strong style={{ color: "#10763d" }}>Name:</strong>{" "}
                          <span style={{ color: "#000", fontSize: "15px" }}>
                            {trav.name.firstName.toLowerCase()}{" "}
                            {trav.name.lastName.toLowerCase()}
                          </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                          <strong style={{ color: "#10763d" }}>Email:</strong>{" "}
                          <span style={{ color: "#000", fontSize: "15px" }}>
                            {trav.contact.emailAddress.toLowerCase()}
                          </span>
                        </div>
                        <div style={{ marginBottom: "10px" }}>
                          <strong style={{ color: "#10763d" }}>Phone:</strong>{" "}
                          <span style={{ color: "#000", fontSize: "15px" }}>
                            (+
                            {trav.contact?.phones?.[0]?.countryCallingCode ||
                              "—"}
                            ) {trav.contact?.phones?.[0]?.number || "—"}
                          </span>
                        </div>
                        <div>
                          <strong style={{ color: "#10763d" }}>Type:</strong>{" "}
                          <span
                            style={{
                              color: "#000",
                              textTransform: "capitalize",
                              fontSize: "15px",
                            }}
                          >
                            {trav.gender.toLowerCase() || "—"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Passenger Info - 2x2 Table */}
                  <table
                    width="100%"
                    border={0}
                    cellPadding={10}
                    cellSpacing={0}
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      border: "1px solid #eee",
                      display: "none", // hidden by default, shown only on desktop
                    }}
                    className="desktop-passenger-info"
                  >
                    <tbody>
                      {order?.travelers?.map((trav, i) => (
                        <React.Fragment key={i}>
                          <tr style={{ fontSize: "14px" }}>
                            <td
                              style={{
                                color: "#10763d",
                                fontWeight: "bold",
                                width: "15%",
                              }}
                            >
                              Name:
                            </td>
                            <td
                              style={{
                                width: "35%",
                                color: "#000",
                                fontSize: "15px",
                              }}
                            >
                              {trav.name.firstName.toLowerCase()}{" "}
                              {trav.name.lastName.toLowerCase()}
                            </td>

                            <td
                              style={{
                                color: "#10763d",
                                fontWeight: "bold",
                                width: "15%",
                              }}
                            >
                              Phone:
                            </td>
                            <td
                              style={{
                                width: "35%",
                                color: "#000",
                                fontSize: "15px",
                              }}
                            >
                              (+
                              {trav.contact?.phones?.[0]?.countryCallingCode ||
                                "—"}
                              ) {trav.contact?.phones?.[0]?.number || "—"}
                            </td>
                          </tr>

                          <tr style={{ fontSize: "14px" }}>
                            <td
                              style={{
                                color: "#10763d",
                                fontWeight: "bold",
                                width: "15%",
                              }}
                            >
                              Email:
                            </td>
                            <td
                              style={{
                                width: "35%",
                                color: "#000",
                                fontSize: "15px",
                              }}
                            >
                              {trav.contact.emailAddress.toLowerCase()}
                            </td>

                            <td
                              style={{
                                color: "#10763d",
                                fontWeight: "bold",
                                width: "15%",
                              }}
                            >
                              Type:
                            </td>
                            <td
                              style={{
                                width: "35%",
                                color: "#000",
                                textTransform: "capitalize",
                                fontSize: "15px",
                              }}
                            >
                              {trav.gender.toLowerCase() || "—"}
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>

                  {/* Responsive Display Styles */}
                  <style>
                    {`
        @media (min-width: 768px) {
          .mobile-passenger-info {
            display: none !important;
          }
          .desktop-passenger-info {
            display: table !important;
          }
        }
      `}
                  </style>
                </td>
              </tr>

              {/* E-Ticket Details */}
              <tr>
                <td style={{ padding: "15px" }}>
                  <h3
                    style={{
                      fontSize: "17px",
                      color: "#1c1e84",
                      fontWeight: "bold",
                      marginBottom: "12px",
                    }}
                  >
                    🎫 E-Ticket Details
                  </h3>

                  {/* Mobile E-Ticket Details - Stack */}
                  <div
                    className="mobile-ticket-details"
                    style={{
                      display: "block",
                      width: "100%",
                    }}
                  >
                    {tickets?.map((ticket, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundColor: "#f8f9fa",
                          borderRadius: "8px",
                          border: "1px solid #eee",
                          padding: "15px",
                          marginBottom: "10px",
                          width: "100%",
                          boxSizing: "border-box",
                        }}
                      >
                        <div style={{ marginBottom: "8px" }}>
                          <strong
                            style={{
                              color: "#10763d",
                              display: "inline-block",
                              fontSize: "15px",
                            }}
                          >
                            E-Ticket Number:
                          </strong>
                          <div
                            style={{
                              color: "#000",
                              margin: "8px",
                              display: "inline-block",
                              fontSize: "15px",
                            }}
                          >
                            {ticket.documentNumber || "—"}
                          </div>
                        </div>
                        <div>
                          <strong
                            style={{
                              color: "#10763d",
                              display: "inline-block",
                              fontSize: "15px",
                            }}
                          >
                            Ticket Status:
                          </strong>
                          <div
                            style={{
                              color: "#000",
                              margin: "8px",
                              display: "inline-block",
                              fontSize: "15px",
                            }}
                          >
                            {ticket.documentStatus}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop E-Ticket Details - Table - Hidden on mobile */}
                  <table
                    width="100%"
                    border={0}
                    cellPadding={10}
                    cellSpacing={0}
                    style={{
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      border: "1px solid #eee",
                      display: "none",
                      marginBottom: "8px",
                    }}
                    className="desktop-ticket-details"
                  >
                    {tickets?.map((ticket, index) => (
                      <tr key={index}>
                        <td
                          style={{
                            color: "#10763d",
                            padding: "8px",
                            width: "25%",
                            fontWeight: "bold",
                            fontSize: "15px",
                          }}
                        >
                          E-Ticket Number:
                        </td>
                        <td
                          style={{
                            padding: "8px",
                            width: "25%",
                            fontSize: "15px",
                          }}
                        >
                          {ticket.documentNumber || "—"}
                        </td>
                        <td
                          style={{
                            color: "#10763d",
                            padding: "8px",
                            width: "20%",
                            fontWeight: "bold",
                            fontSize: "15px",
                          }}
                        >
                          Tikcet Status:
                        </td>
                        <td
                          style={{
                            padding: "8px",
                            width: "30%",
                            fontSize: "15px",
                          }}
                        >
                          {ticket.documentStatus}
                        </td>
                      </tr>
                    ))}
                  </table>
                </td>
              </tr>

              {/* === Booking Summary Section === */}
              <tr>
                <td style={{ padding: "0 20px 30px 20px" }}>
                  <h3
                    style={{
                      fontSize: "18px",
                      color: "#1a237e",
                      fontWeight: "600",
                      marginBottom: "10px",
                    }}
                  >
                    💰 Booking Summary
                  </h3>

                  {(() => {
                    const basePrice = Number(flightOffer?.price?.base || 0);
                    const grandTotal = Number(
                      flightOffer?.price?.grandTotal || 0
                    );
                    const currency = flightOffer?.price?.currency || "SAR";

                    const taxesAndFees = grandTotal - basePrice;
                    const adminFees = grandTotal * 0.05;
                    const vat = adminFees * 0.15;
                    const finalTotal = grandTotal + adminFees + vat; // Admin fee included in grandTotal already (if not, use +adminFees+vat)

                    return (
                      <table
                        width="100%"
                        border={0}
                        cellPadding={0}
                        cellSpacing={0}
                        style={{
                          width: "100%",
                          backgroundColor: "#f9f9f9",
                          borderRadius: "10px",
                          borderCollapse: "collapse",
                          overflow: "hidden",
                        }}
                      >
                        {/* Base Price */}
                        <tr>
                          <td
                            style={{
                              padding: "12px 15px",
                              fontSize: "15px",
                              color: "#006400",
                              fontWeight: "600",
                            }}
                          >
                            Base Price:
                          </td>
                          <td
                            style={{
                              padding: "12px 15px",
                              fontSize: "15px",
                              textAlign: "right",
                              color: "#333",
                            }}
                          >
                            {basePrice.toFixed(2)} {currency}
                          </td>
                        </tr>

                        {/* Taxes & Fees */}
                        <tr>
                          <td
                            style={{
                              padding: "12px 15px",
                              fontSize: "15px",
                              color: "#006400",
                              fontWeight: "600",
                            }}
                          >
                            Taxes & Fees:
                          </td>
                          <td
                            style={{
                              padding: "12px 15px",
                              fontSize: "15px",
                              textAlign: "right",
                              color: "#333",
                            }}
                          >
                            {taxesAndFees.toFixed(2)} {currency}
                          </td>
                        </tr>

                        {/* Administration Fees (5%) */}
                        <tr>
                          <td
                            style={{
                              padding: "12px 15px",
                              fontSize: "15px",
                              color: "#006400",
                              fontWeight: "600",
                            }}
                          >
                            Administration Fees:
                          </td>
                          <td
                            style={{
                              padding: "12px 15px",
                              fontSize: "15px",
                              textAlign: "right",
                              color: "#333",
                            }}
                          >
                            {adminFees.toFixed(2)} {currency}
                          </td>
                        </tr>

                        {/* VAT (15% of admin fee) */}
                        <tr>
                          <td
                            style={{
                              padding: "12px 15px",
                              fontSize: "15px",
                              color: "#006400",
                              fontWeight: "600",
                            }}
                          >
                            VAT:
                          </td>
                          <td
                            style={{
                              padding: "12px 15px",
                              fontSize: "15px",
                              textAlign: "right",
                              color: "#333",
                            }}
                          >
                            {vat.toFixed(2)} {currency}
                          </td>
                        </tr>

                        {/* Total */}
                        <tr>
                          <td
                            style={{
                              padding: "12px 15px",
                              fontSize: "16px",
                              fontWeight: "700",
                              color: "#1a237e",
                              borderTop: "1px solid #ddd",
                            }}
                          >
                            Total:
                          </td>
                          <td
                            style={{
                              padding: "12px 15px",
                              fontSize: "16px",
                              fontWeight: "700",
                              color: "#1a237e",
                              textAlign: "right",
                              borderTop: "1px solid #ddd",
                            }}
                          >
                            {finalTotal.toFixed(2)} {currency}
                          </td>
                        </tr>
                      </table>
                    );
                  })()}
                </td>
              </tr>

              {/* === Footer Section === */}
              <tr>
                <td
                  align="center"
                  style={{
                    background:
                      "linear-gradient(90deg, #0c9e66 0%, #1c1e84 100%)",
                    color: "white",
                    padding: "20px",
                    fontSize: "14px",
                  }}
                >
                  <table
                    width="100%"
                    border={0}
                    cellPadding={0}
                    cellSpacing={0}
                    style={{
                      maxWidth: "700px",
                      margin: "0 auto",
                      textAlign: "center",
                    }}
                  >
                    <tr>
                      <td align="center" style={{ paddingBottom: "15px" }}>
                        <img
                          src="https://qessatravel.com/wp-content/uploads/2025/10/5.png"
                          width="80"
                          height="80"
                          alt="Tayyran Logo"
                          style={{ display: "block", margin: "0 auto" }}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td
                        align="center"
                        style={{
                          color: "#fff",
                          fontSize: "14px",
                          lineHeight: "22px",
                          paddingBottom: "15px",
                        }}
                      >
                        <strong>Download the app.</strong>
                        <br />
                        <span>On the palm of your hand.</span>
                      </td>
                    </tr>

                    <tr>
                      <td align="center" style={{ paddingBottom: "20px" }}>
                        <a
                          href="https://play.google.com"
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            display: "inline-block",
                            marginRight: "8px",
                          }}
                        >
                          <img
                            src="https://qessatravel.com/wp-content/uploads/2025/10/google-play.png"
                            width="130"
                            alt="Google Play"
                            style={{ display: "block" }}
                          />
                        </a>
                        <a
                          href="https://apps.apple.com"
                          target="_blank"
                          rel="noreferrer"
                          style={{ display: "inline-block" }}
                        >
                          <img
                            src="https://qessatravel.com/wp-content/uploads/2025/10/apple-store.png"
                            width="130"
                            alt="App Store"
                            style={{ display: "block" }}
                          />
                        </a>
                      </td>
                    </tr>

                    <tr>
                      <td
                        align="center"
                        style={{
                          color: "#fff",
                          fontSize: "14px",
                          paddingBottom: "15px",
                        }}
                      >
                        Think different
                      </td>
                    </tr>
                    {/* 
                    <tr>
                      <td align="center" style={{ paddingBottom: "20px" }}>
                        <a
                          href="https://facebook.com"
                          target="_blank"
                          rel="noreferrer"
                          style={{ margin: "0 5px" }}
                        >
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/145/145802.png"
                            width="24"
                            height="24"
                            alt="Facebook"
                          />
                        </a>
                        <a
                          href="https://twitter.com"
                          target="_blank"
                          rel="noreferrer"
                          style={{ margin: "0 5px" }}
                        >
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/733/733579.png"
                            width="24"
                            height="24"
                            alt="Twitter"
                          />
                        </a>
                        <a
                          href="https://instagram.com"
                          target="_blank"
                          rel="noreferrer"
                          style={{ margin: "0 5px" }}
                        >
                          <img
                            src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png"
                            width="24"
                            height="24"
                            alt="Instagram"
                          />
                        </a>
                      </td>
                    </tr> */}

                    <tr>
                      <td
                        align="center"
                        style={{
                          fontSize: "13px",
                          color: "#fff",
                          lineHeight: "20px",
                        }}
                      >
                        123 Main Street, Anytown, SA 12345
                        <br />
                        <a
                          href="mailto:support@tayyran.com"
                          style={{
                            color: "#fff",
                            textDecoration: "none",
                          }}
                        >
                          support@tayyran.com
                        </a>{" "}
                        | +966 533 322 921
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      {/* Gmail-compatible CSS using media queries that Gmail supports */}
      <style>
        {`
          /* Gmail mobile responsive styles */
          @media only screen and (min-width: 601px) {
            .mobile-view {
              display: none !important;
            }
            .desktop-view {
              display: table !important;
            }
            .mobile-passenger-info {
              display: none !important;
            }
            .desktop-passenger-info {
              display: table !important;
            }
            .mobile-ticket-details {
              display: none !important;
            }
            .desktop-ticket-details {
              display: table !important;
            }
            .mobile-booking-summary {
              display: none !important;
            }
            .desktop-booking-summary {
              display: table !important;
            }
          }
          
          /* Default mobile styles (applied on small screens) */
          @media only screen and (max-width: 600px) {
            .desktop-view {
              display: none !important;
            }
            .mobile-view {
              display: block !important;
            }
            .desktop-passenger-info {
              display: none !important;
            }
            .mobile-passenger-info {
              display: block !important;
            }
            .desktop-ticket-details {
              display: none !important;
            }
            .mobile-ticket-details {
              display: block !important;
            }
            .desktop-booking-summary {
              display: none !important;
            }
            .mobile-booking-summary {
              display: block !important;
            }
          }
        `}
      </style>
    </div>
  );
}
