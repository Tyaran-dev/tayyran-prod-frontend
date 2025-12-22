"use client";
import React, { useEffect, useState } from "react";
import FlightFilter from "@/app/components/website/flight-search/flight-filter";
import FlightCard from "@/app/components/website/flight-details/flight-card";
import Section from "@/app/components/shared/section";
import FlightSearchForm from "@/app/components/website/flight-search/search-form";
import { useRouter, useSearchParams } from "next/navigation";
import CustomProgressBar from "@/app/components/shared/progress-bar";
import Image from "next/image";
import Heading from "@/app/components/shared/heading";
import { calculateTotalDurationShortNew } from "@/utils/airports-helper";
import { differenceInMinutes, parseISO } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { clearFlightData, removeFlightData, setSearchData } from "@/redux/flights/flightSlice";
import { useLocale } from "next-intl";
import { useTranslations } from "next-intl";
import FlightTicketSkeletonGrid from "@/app/components/shared/Feedback/FlightTicketSkeletonGrid";
import { getPersistedFlightData } from '@/utils/flightStorage';
import useSearchflights from "@/hooks/useSearchflights"
import Stepper from "@/app/components/shared/Feedback/Stepper";
import logo from "/public/assets/logo/ras.png";
import { FaChevronDown } from "react-icons/fa6";
import { FaChevronUp } from "react-icons/fa6";

interface FlightPrice {
  currency: string;
  total: number;
  base?: number;
  taxes?: number;
}

export interface Flight {
  id: string;
  price: FlightPrice;
  airLineName: string;
  itineraries: any[];
  segments: any[];
}

const Page: React.FC = () => {
  const {
    getFlights,
    carriers,
    flights,
    loading,
    flightClass,
    hasHydrated
  } = useSearchflights();

  const locale = useLocale();
  const t = useTranslations("filters");
  const tFlightCard = useTranslations("FlightCard");
  const tGeneral = useTranslations();
  const [currentStep, setCurrentStep] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchParamsData = useSelector((state: any) => state.flightData.searchParamsData);
  const searchParams = useSearchParams();
  const travelersParam = searchParams.get("adult") || "1";
  const [sortedFlights, setSortedFlights] = useState<any[]>([]);
  const [flightClasss, setFlightClass] = useState(flightClass || "ECONOMY");
  const [filters, setFilters] = useState<{ [key: string]: any }>({
    price: Infinity,
    stops: [],
    airlines: [],
    departureTime: "any",
  });

  // Update the departure time filter handler
  const onDepartureTimeChange = (newTime: string) => {
    setFilters({ ...filters, departureTime: newTime });
  };

  const [selectedSorts, setSelectedSorts] = useState<string[]>([]);
  const [returnFlights, setReturnFlights] = useState<any[]>([]);
  const [isFlightSelected, setIsFlightSelected] = useState(false);
  const slectedData = useSelector((state: any) => state.flightData.slectedFlight);
  const flightDataSlice = useSelector((state: any) => state.flightData.flights);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const presentageCommission = useSelector((state: any) => state.flightData.presentageCommission);
  const vat = useSelector((state: any) => state.flightData.presentageVat);

  const dispatch = useDispatch();
  const router = useRouter();

  console.log(slectedData, "slectedData")

  // Filter Flights Function
  const filteredFlights = flights?.filter((flight) => {
    if (!flight?.price || !flight?.itineraries) return false;

    const price = parseFloat(flight.basePrice);
    const isPriceValid = price <= filters.price;

    const isStopsValid =
      filters.stops.length === 0 ||
      filters.stops.includes("Any number of stops") ||
      flight.itineraries.some((itinerary: any) => {
        const totalStops = itinerary.segments.length - 1;

        if (filters.stops.includes("Direct flights only") && totalStops === 0) {
          return true;
        }
        if (filters.stops.includes("1 stop") && totalStops === 1) {
          return true;
        }
        if (filters.stops.includes("2 stops or more") && totalStops >= 2) {
          return true;
        }
        return false;
      });

    const isDepartureTimeValid =
      filters.departureTime === "any" ||
      flight.itineraries_formated.some((itinerary: any) =>
        itinerary.segments.some((segment: any) => {
          const departureDate = new Date(segment?.departure.at);
          const departureHour = departureDate.getHours();

          switch (filters.departureTime) {
            case "morning":
              return departureHour >= 6 && departureHour < 12;
            case "afternoon":
              return departureHour >= 12 && departureHour < 18;
            case "evening":
              return departureHour >= 18 && departureHour < 24;
            case "before_morning":
              return departureHour >= 0 && departureHour < 6;
            default:
              return true;
          }
        })
      );

    const airlineCode = flight.airline?.[0];
    const isAirlinesValid =
      filters.airlines.length === 0 ||
      filters.airlines.some((selectedAirline: string) => {
        const carrier = carriers.find((c) => c.airLineCode === flight.airline);
        return (
          flight.airline === selectedAirline ||
          (carrier &&
            (carrier.airLineCode === selectedAirline ||
              carrier.airLineName === selectedAirline))
        );
      });

    return (
      isPriceValid && isStopsValid && isDepartureTimeValid && isAirlinesValid
    );
  });

  const getCheapestFlight = (flights: any[]) => {
    if (!flights || flights.length === 0) return null;
    return flights.reduce((min, flight) =>
      flight.basePrice < min.basePrice ? flight : min
    );
  };

  const getMostExpensiveFlight = (flights: any[]) => {
    if (!flights || flights.length === 0) return null;
    return flights.reduce((max, flight) =>
      flight.basePrice > max.basePrice ? flight : max
    );
  };

  const parseDurationToMinutes = (duration: string): number => {
    const hoursMatch = duration.match(/(\d+)h/);
    const minutesMatch = duration.match(/(\d+)m/);

    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;

    return hours * 60 + minutes;
  };

  useEffect(() => {
    return () => {
      // Clear flight selection when component unmounts
      dispatch(clearFlightData());

      // Also close the side menu
      setIsSideMenuOpen(false);
    };
  }, [dispatch]);

  const getShortestFlight = (flights: any[]) => {
    if (!flights || flights.length === 0) return null;

    return flights.reduce((min, flight) => {
      const minDuration = parseDurationToMinutes(min.itineraries[0].duration);
      const currentDuration = parseDurationToMinutes(flight.itineraries[0].duration);

      return currentDuration < minDuration ? flight : min;
    });
  };

  const getEarliestTakeoff = (flights: any[]) => {
    if (!flights || flights.length === 0) return null;

    return flights.reduce((earliest, flight) => {
      const earliestDeparture = new Date(earliest.itineraries[0].segments[0].departure.at).getTime();
      const currentDeparture = new Date(flight.itineraries[0].segments[0].departure.at).getTime();

      return currentDeparture < earliestDeparture ? flight : earliest;
    });
  };

  const getEarliestArrival = (flights: any[]) => {
    if (!flights || flights.length === 0) return null;

    return flights.reduce((earliest, flight) => {
      const earliestSegments = earliest.itineraries[0].segments;
      const currentSegments = flight.itineraries[0].segments;
      const earliestArrival = new Date(
        earliestSegments[earliestSegments.length - 1].arrival.at
      ).getTime();

      const currentArrival = new Date(
        currentSegments[currentSegments.length - 1].arrival.at
      ).getTime();

      return currentArrival < earliestArrival ? flight : earliest;
    });
  };

  const cheapestFlight = getCheapestFlight(filteredFlights),
    mostExpensiveFlight = getMostExpensiveFlight(filteredFlights),
    shortestFlight = getShortestFlight(filteredFlights),
    earlistFlight = getEarliestTakeoff(filteredFlights),
    earlistArrival = getEarliestArrival(filteredFlights);

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], {
      hour: "2-digit", minute: "2-digit", hour12: true,
    });
  };

  useEffect(() => {
    if (!hasHydrated) return;

    const persistedData = getPersistedFlightData();
    if (persistedData?.searchParamsData) {
      dispatch(setSearchData({
        ...persistedData.searchParamsData,
        departure: new Date(persistedData.searchParamsData.departure).toISOString(),
      }));
    }
  }, [dispatch, hasHydrated]);

  useEffect(() => {
    const isOneWayOrRoundTrip = searchParamsData?.origin && searchParamsData?.destination;
    const isMultiCity = Array.isArray(searchParamsData?.segments) && searchParamsData.segments.length > 0;

    if (isOneWayOrRoundTrip || isMultiCity) {
      getFlights();
    }
  }, [searchParamsData]);

  const handleSortChange = (sortType: string) => {
    let updatedSorts = [...selectedSorts];
    const index = updatedSorts.indexOf(sortType);

    if (index === -1) {
      updatedSorts.push(sortType);
    } else {
      updatedSorts.splice(index, 1);
    }

    setSelectedSorts(updatedSorts);

    let sortedList = [...filteredFlights];

    if (updatedSorts.length > 0) {
      updatedSorts.forEach((type) => {
        switch (type) {
          case "cheapest":
            sortedList = sortedList.sort(
              (a, b) => a.basePrice - b.basePrice
            );
            break;

          case "descending-price":
            sortedList = sortedList.sort(
              (a, b) => b.basePrice - a.basePrice
            );
            break;

          case "latest-departure":
            sortedList = sortedList.sort((a, b) =>
              new Date(b.itineraries[0].segments[0].departure.at).getTime() -
              new Date(a.itineraries[0].segments[0].departure.at).getTime()
            );
            break;
          case "shortest":
            sortedList = sortedList.sort((a, b) => {
              const getDurationInMinutes = (flight: any) => {
                return flight.itineraries.reduce((total: number, itinerary: any) => {
                  const firstSegment = itinerary.segments[0];
                  const lastSegment = itinerary.segments[itinerary.segments.length - 1];
                  const departure = new Date(firstSegment.departure.at).getTime();
                  const arrival = new Date(lastSegment.arrival.at).getTime();
                  const diffMinutes = (arrival - departure) / (1000 * 60);
                  return total + diffMinutes;
                }, 0);
              };

              const durationA = getDurationInMinutes(a);
              const durationB = getDurationInMinutes(b);

              return durationA - durationB;
            });
            break;
          case "earliest-takeoff":
            sortedList = sortedList.sort((a, b) => {
              const departureTimeA = new Date(
                a.itineraries[0].segments[0].departure.at
              ).getTime();
              const departureTimeB = new Date(
                b.itineraries[0].segments[0].departure.at
              ).getTime();
              return departureTimeA - departureTimeB;
            });
            break;
          case "earliest-arrival":
            sortedList = sortedList.sort((a, b) => {
              const arrivalTimeA = new Date(
                a.itineraries[0].segments.slice(-1)[0].arrival.at
              ).getTime();
              const arrivalTimeB = new Date(
                b.itineraries[0].segments.slice(-1)[0].arrival.at
              ).getTime();
              return arrivalTimeA - arrivalTimeB;
            });
            break;
          default:
            break;
        }
      });
    }
    setSortedFlights(sortedList);
  };

  useEffect(() => {
    // Reset sorted flights when filters change
    setSortedFlights([]);
    setSelectedSorts([]);
  }, [filters]);


  const getButtonClass = (sortType: string) => {
    return selectedSorts.includes(sortType)
      ? "border-emerald-600"
      : "";
  };

  const calculateStops = (flightSegments: any[]) => {
    const numberOfStops =
      flightSegments?.length > 1 ? flightSegments?.length - 1 : 0;
    return numberOfStops;
  };

  const calculateStopDuration = (
    arrivalTime: string,
    nextDepartureTime: string
  ) => {
    const arrivalDate = parseISO(arrivalTime);
    const nextDepartureDate = parseISO(nextDepartureTime);
    const stopDurationInMinutes = differenceInMinutes(
      nextDepartureDate,
      arrivalDate
    );

    const hours = Math.floor(stopDurationInMinutes / 60);
    const minutes = stopDurationInMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const displayFlightDetails = (flightSegments: any[]) => {
    const numberOfStops = calculateStops(flightSegments);
    if (numberOfStops > 0) {
      for (let i = 0; i < flightSegments.length - 1; i++) {
        const currentSegment = flightSegments[i];
        const nextSegment = flightSegments[i + 1];

        const stopAirport = currentSegment.arrival.iataCode;
        const stopDuration = calculateStopDuration(
          currentSegment.arrival.at,
          nextSegment.departure.at
        );
      }
    }
  };

  return (
    <Section className="">
      <div className="py-5">
        {/* Stepper */}
        <div className="hidden md:block">
          <Stepper currentStep={currentStep} stepsType="flightSteps" />
        </div>
        <div className=" p-4">
          <FlightSearchForm />
        </div>
        <div className="flex items-center md:items-start flex-nowrap flex-col md:flex-row justify-center md:justify-between gap-2 py-10">
          {/* Filter Sidebar */}
          <div className="lg:w-1/4 w-[90%] border rounded-lg md:sticky md:top-20 md:h-[calc(100vh-5rem)] flex flex-col items-center">
            <div
              className="flex justify-between bg-greenGradient text-slate-200 rounded-lg flex-wrap px-3 py-2 w-full items-center gap-5 cursor-pointer lg:cursor-default border-b"
              onClick={() => {
                if (window.innerWidth < 1024) setIsFilterOpen(!isFilterOpen);
              }}
            >
              <h2 className="lg:text-xl font-semibold">{t("heading")}</h2>
              <div className="flex items-center gap-2">
                <h2 className="lg:text-xl font-semibold">
                  ({filteredFlights && filteredFlights.length})
                </h2>
                <span className="lg:hidden">
                  {isFilterOpen ? <FaChevronUp size={15} /> : <FaChevronDown size={15} />}
                </span>
              </div>
            </div>

            <div
              className={`transition-all flex justify-center w-full duration-300 lg:block flex-1 overflow-y-auto px-3 scrollbar-hide ${isFilterOpen
                ? "max-h-[1000px] opacity-100"
                : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"
                }`}
            >
              <FlightFilter
                filterPrice={filters.price}
                filterStops={filters.stops}
                airlines={Object.values(carriers)}
                filterDepartureTime={filters.departureTime}
                onPriceChange={(newPrice: any) =>
                  setFilters({ ...filters, price: newPrice })
                }
                onStopsChange={(newStops: any) =>
                  setFilters({ ...filters, stops: newStops })
                }
                onDepartureTimeChange={(newTime: any) =>
                  setFilters({ ...filters, departureTime: newTime })
                }
                onAirlinesChange={(newAirlines: any) =>
                  setFilters({ ...filters, airlines: newAirlines })
                }
                filterAirlines={filters.airlines}
                filterBaggage={[]}
                onBaggageChange={(baggage: string[]) => {
                  console.log("Baggage updated:", baggage);
                }}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className={`lg:w-[72%] w-full space-y-2`}>
            <div className="w-[90%] md:w-full mx-auto">
              {/* Sort Accordion Header */}
              <div
                className="flex mx-auto justify-between bg-greenGradient md:hidden text-slate-200 rounded-lg flex-wrap px-3 py-2 w-full items-center gap-5 cursor-pointer lg:cursor-default border-b"
                onClick={() => {
                  if (window.innerWidth < 1024) setIsSortOpen(!isSortOpen);
                }}
              >
                <h2 className="lg:text-xl font-semibold">{t("sortby")}</h2>
                <span className="lg:hidden">
                  {isSortOpen ? <FaChevronUp size={15} /> : <FaChevronDown size={15} />}
                </span>
              </div>

              {/* Sort Options */}
              <div
                className={`transition-all duration-300 ${isSortOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0 lg:max-h-none lg:opacity-100"
                  }`}
              >
                <div className="py-2 flex items-center whitespace-nowrap flex-wrap sm:flex-nowrap justify-center md:justify-between gap-2 w-full">
                  {/* asecnding */}
                  <button
                    className={`rounded-lg p-2 w-[40%] md:w-full h-20 border-2 ${getButtonClass("cheapest")}`}
                    onClick={() => handleSortChange("cheapest")}
                  >
                    <div className="flex flex-col items-center">
                      <span>{t("cheapest")}</span>
                      {cheapestFlight && (
                        <span className={`text-sm flex items-center text-gray-600 ${getButtonClass("cheapest")}`}>
                          {cheapestFlight.basePrice}{" "}
                          {cheapestFlight?.currency == "SAR" ? (
                            <Image src={logo} alt="sar" width={18} height={18} unoptimized className="m-1 object-contain" />
                          ) : (
                            cheapestFlight?.currency
                          )}{" "}
                          -- {cheapestFlight.itineraries[0].duration}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* descending */}
                  <button
                    className={`rounded-lg p-2 w-[40%] md:w-full h-20 border-2 ${getButtonClass("descending-price")}`}
                    onClick={() => {
                      handleSortChange("descending-price");
                      setIsDropdownOpen(false);
                    }}
                  >
                    <div className="flex flex-col items-center">
                      <span>{t("descendingprice")}</span>
                      {mostExpensiveFlight && (
                        <span className={`text-sm flex items-center text-gray-600 ${getButtonClass("descending-price")}`}>
                          {mostExpensiveFlight.basePrice}{" "}
                          {mostExpensiveFlight?.currency === "SAR" ? (
                            <Image
                              src={logo}
                              alt="sar"
                              width={18}
                              height={18}
                              unoptimized
                              className="m-1 object-contain"
                            />
                          ) : (
                            mostExpensiveFlight?.currency
                          )}{" "}
                          -- {mostExpensiveFlight.itineraries[0].duration}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Shortest */}
                  <button
                    className={`rounded-lg p-2 w-[40%] md:w-full h-20 border-2 ${getButtonClass("shortest")}`}
                    onClick={() => handleSortChange("shortest")}
                  >
                    <div className="flex flex-col items-center">
                      <span>{t("shortest")}</span>
                      {shortestFlight && (
                        <span className={`text-sm flex items-center text-gray-600 ${getButtonClass("cheapest")}`}>
                          {shortestFlight.basePrice}{" "}
                          {shortestFlight?.currency == "SAR" ? (
                            <Image src={logo} alt="sar" width={18} height={18} unoptimized className="m-1 object-contain" />
                          ) : (
                            shortestFlight?.currency
                          )}{" "}
                          -- {shortestFlight.itineraries[0].duration}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Earliest Takeoff */}
                  <button
                    className={`rounded-lg p-2 w-[40%] md:w-full h-20 border-2 ${getButtonClass("earliest-takeoff")}`}
                    onClick={() => handleSortChange("earliest-takeoff")}
                  >
                    <span>{t("earliesttakeoff")}</span>
                    {earlistFlight && (
                      <span className={`text-sm flex items-center justify-center text-gray-600 ${getButtonClass("earlistFlight")}`}>
                        {earlistFlight.basePrice}{" "}
                        {earlistFlight?.currency == "SAR" ? (
                          <Image src={logo} alt="sar" width={18} height={18} unoptimized className="m-1 object-contain" />
                        ) : (
                          earlistFlight?.currency
                        )}{" "}
                        -- {earlistFlight.itineraries[0].segments[0].departure_time}
                      </span>
                    )}
                  </button>



                  {/* Mobile-only buttons */}
                  <button
                    className={`md:hidden rounded-lg p-2 w-[40%] md:w-full h-20 border-2 ${getButtonClass("latest-departure")}`}
                    onClick={() => {
                      handleSortChange("latest-departure");
                      setIsDropdownOpen(false);
                    }}
                  >
                    {t("latestdeparture")}
                  </button>

                  {/* Earliest Arrival */}
                  <button
                    className={`md:hidden rounded-lg p-2 w-[40%] md:w-full h-20 border-2 ${getButtonClass("earliest-arrival")}`}
                    onClick={() => handleSortChange("earliest-arrival")}
                  >
                    <span>{t("earliestarrival")}</span>
                    {earlistArrival && (
                      <span className={`text-sm flex items-center justify-center text-gray-600 ${getButtonClass("cheapest")}`}>
                        {earlistArrival.basePrice}{" "}
                        {earlistArrival?.currency == "SAR" ? (
                          <Image src={logo} alt="sar" width={18} height={18} unoptimized className="m-1 object-contain" />
                        ) : (
                          earlistArrival?.currency
                        )}{" "}
                        --{" "}
                        {earlistArrival.itineraries[0].segments[
                          earlistArrival.itineraries[0].segments.length - 1
                        ].arrival_time}
                      </span>
                    )}
                  </button>



                  {/* Desktop dropdown */}
                  <div className="hidden md:block relative w-[40%] md:w-full">
                    <button
                      className="rounded-lg p-2 w-full h-20 border-2 flex items-center justify-center"
                      onClick={() => setIsDropdownOpen((prev) => !prev)}
                    >
                      <span>{t("moreoptions")}</span>
                      <svg
                        className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    {isDropdownOpen && (
                      <div className="absolute top-16 flex flex-col gap-2 p-2 items-center z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
                        <button
                          className={`block w-full text-center px-4 py-2 hover:bg-gray-100 border rounded-lg ${getButtonClass("latest-departure")}`}
                          onClick={() => {
                            handleSortChange("latest-departure");
                            setIsDropdownOpen(false);
                          }}
                        >
                          {t("latestdeparture")}
                        </button>

                        {/* Earliest Arrival */}
                        <button
                          className={`rounded-lg p-2 w-[40%] md:w-full h-20 border-2 ${getButtonClass("earliest-arrival")}`}
                          onClick={() => handleSortChange("earliest-arrival")}
                        >
                          <span>{t("earliestarrival")}</span>
                          {earlistArrival && (
                            <span className={`text-sm flex items-center justify-center text-gray-600 ${getButtonClass("cheapest")}`}>
                              {earlistArrival.basePrice}{" "}
                              {earlistArrival?.currency == "SAR" ? (
                                <Image src={logo} alt="sar" width={18} height={18} unoptimized className="m-1 object-contain" />
                              ) : (
                                earlistArrival?.currency
                              )}{" "}
                              --{" "}
                              {earlistArrival.itineraries[0].segments[
                                earlistArrival.itineraries[0].segments.length - 1
                              ].arrival_time}
                            </span>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <>
                <CustomProgressBar />
                <FlightTicketSkeletonGrid />
              </>
            )}

            {/* Flight Results */}
            {selectedSorts.length > 0 ? (
              <div className="w-full space-y-6">
                {sortedFlights?.length === 0 && !loading && (
                  <div className="min-h-screen w-full flex-col flex justify-center items-center">
                    <Heading>{tGeneral("flightsearch.noflight")}</Heading>
                    <Image
                      src={"/no-flight.svg"}
                      width={400}
                      height={400}
                      alt=""
                    />
                  </div>
                )}
                {!loading && sortedFlights?.map((flight) => (
                  <FlightCard
                    from="card"
                    key={flight.id}
                    flight={flight}
                    airlineName={carriers[flight.airLineName]}
                    isFlightSelected={isFlightSelected}
                    setIsFlightSelected={setIsFlightSelected}
                    setIsSideMenuOpen={setIsSideMenuOpen}
                  />
                ))}
              </div>
            ) : (
              <div className="w-full space-y-6">
                {filteredFlights?.length === 0 && !loading && (
                  <div className="min-h-screen w-full flex-col flex justify-center items-center">
                    <Heading>{tGeneral("flightsearch.noflight")}</Heading>
                    <Image
                      src={"/no-flight.svg"}
                      width={400}
                      height={400}
                      alt=""
                      className=""
                    />
                  </div>
                )}
                {!loading && filteredFlights?.map((flight) => (
                  <FlightCard
                    from={"card"}
                    key={flight.id}
                    isFlightSelected={isFlightSelected}
                    setIsFlightSelected={setIsFlightSelected}
                    flight={flight}
                    setIsSideMenuOpen={setIsSideMenuOpen}
                    airlineName={carriers[flight.airline]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Menu for Selected Flight */}
      {isSideMenuOpen &&
        slectedData.map((selectedFlight: Flight, index: number) => (
          <div key={index} className="fixed inset-0 flex items-center justify-start top-0 z-[99] bg-[#00000099] h-full">
            <div
              className={`flex flex-col p-5 justify-between h-full w-full md:w-[50%] bg-white shadow-lg transform ${isSideMenuOpen ? "translate-x-0" : "translate-x-full"
                } transition-transform duration-300 ease-in-out`}
            >
              <div className="flex justify-between items-center border-b border-b-slate-300 pb-2">
                <h2 className="text-xl text-primary font-semibold">
                  {tFlightCard("flightDetails")}
                </h2>
                <button
                  onClick={() => {
                    if (returnFlights.length === 0) {
                      dispatch(clearFlightData());
                    } else {
                      dispatch(removeFlightData(1));
                    }
                    setIsSideMenuOpen(false);
                  }}
                >
                  <AiOutlineClose className="text-xl text-gray-700" />
                </button>
              </div>
              <div className="overflow-y-auto flex flex-col items-center gap-5 my-5">
                {flightDataSlice?.map((flight: Flight) => (
                  <FlightCard
                    from={"selection"}
                    key={flight.id}
                    isFlightSelected={isFlightSelected}
                    setIsFlightSelected={setIsFlightSelected}
                    flight={flight}
                    setIsSideMenuOpen={setIsSideMenuOpen}
                    airlineName={flight?.airLineName}
                  />
                ))
                }
              </div>

              <div className="flex flex-col justify-between border-t border-t-slate-300 pt-5 mt-5">
                <div>
                  <h2 className="text-xl text-primary font-semibold">
                    {tGeneral("bookNow.payment.totalPrice")}
                  </h2>

                  <h2 className="flex items-center gap-2 border-b m-2 p-1 text-gray-600">
                    <span>{tGeneral("FlightBooking.basePrice")}:</span>
                    <span className="text-base">
                      <Image
                        src={logo}
                        alt="sar"
                        width={20}
                        height={20}
                        unoptimized
                        className="object-contain"
                      />
                    </span>
                    <span className="text-base">
                      {(
                        Number(selectedFlight?.price.base || 0)
                      ).toFixed(2)}
                    </span>
                  </h2>

                  <h2 className="flex items-center gap-2 border-b m-2 p-1 text-gray-600">
                    <span>{tGeneral("FlightBooking.taxesAndFees")}:</span>
                    <span className="text-base">
                      <Image
                        src={logo}
                        alt="sar"
                        width={20}
                        height={20}
                        unoptimized
                        className="object-contain"
                      />
                    </span>
                    <span className="text-base">
                      {(
                        Number(selectedFlight?.price.total - (selectedFlight?.price.base || 0))
                      ).toFixed(2)}
                    </span>
                  </h2>

                  <h2 className="flex items-center gap-2 border-b m-2 p-1 text-gray-600">
                    <span>{tGeneral("FlightBooking.administrationFees")}:</span>
                    <span className="text-base">
                      <Image
                        src={logo}
                        alt="sar"
                        width={20}
                        height={20}
                        unoptimized
                        className="object-contain"
                      />
                    </span>
                    <span className="text-base">
                      {(
                        Number(selectedFlight?.price.total * presentageCommission / 100)
                      ).toFixed(2)}
                    </span>
                  </h2>

                  <h2 className="flex items-center gap-2 border-b m-2 p-1 text-gray-600">
                    <span>{tGeneral("FlightBooking.vat")}:</span>
                    <span className="font-semibold text-lg">
                      <Image
                        src={logo}
                        alt="sar"
                        width={20}
                        height={20}
                        unoptimized
                        className="object-contain"
                      />
                    </span>
                    <span className="font-semibold text-lg">
                      {(
                        Number(((selectedFlight?.price.total || 0) * presentageCommission) / 100 || 0) * (vat / 100)).toFixed(2)}
                    </span>
                  </h2>

                  <h2 className="flex items-center gap-2 border-b m-2 p-1">
                    <span>{tGeneral("bookNow.payment.totalPrice")}:</span>
                    <span className="font-semibold text-lg">
                      <Image
                        src={logo}
                        alt="sar"
                        width={20}
                        height={20}
                        unoptimized
                        className="object-contain"
                      />
                    </span>
                    <span className="font-semibold text-lg">
                      {(
                        Number(selectedFlight?.price.total || 0) +
                        (Number(selectedFlight?.price.total || 0) * presentageCommission) / 100 + ((Number(selectedFlight?.price.total || 0) * presentageCommission) / 100 * (vat / 100))
                      ).toFixed(2)}
                    </span>
                  </h2>
                </div>
                <button
                  onClick={() => {
                    router.push(`/${locale}/book-now`);
                  }}
                  className="text-white rounded-md py-2 px-3 cursor-pointer bg-emerald-700"
                >
                  {tFlightCard("bookNow")}
                </button>
              </div>
            </div>
          </div>
        ))
      }
    </Section>
  );
};

export default Page;