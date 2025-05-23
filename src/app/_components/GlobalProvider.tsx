"use client";
import React, { type Dispatch, type SetStateAction, useState } from "react";
import { type DateRange } from "react-day-picker";

type ContextProps = {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
  markers: Marker[];
  setMarkers: Dispatch<SetStateAction<Marker[]>>;
};

type Marker = {
  id: string;
  position: google.maps.LatLngLiteral;
  timestamp: Date;
};

const GlobalConext = React.createContext<ContextProps>({} as ContextProps);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [date, setDate] = React.useState<DateRange>();
  const [markers, setMarkers] = useState<Marker[]>([]);

  return (
    <GlobalConext.Provider value={{ date, setDate, markers, setMarkers }}>
      {children}
    </GlobalConext.Provider>
  );
};

export const useGlobalProvider = () => {
  const context = React.useContext(GlobalConext);
  if (!context) throw new Error("Must be used with GlobalProvider component");
  return context;
};
