"use client";
import React from "react";
import { type DateRange } from "react-day-picker";

type ContextProps = {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
};

const GlobalConext = React.createContext<ContextProps>({} as ContextProps);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [date, setDate] = React.useState<DateRange>();

  return (
    <GlobalConext.Provider value={{ date, setDate }}>
      {children}
    </GlobalConext.Provider>
  );
};

export const useGlobalProvider = () => {
  const context = React.useContext(GlobalConext);
  if (!context) throw new Error("must be used with GlobalProvider component");
  return context;
};
