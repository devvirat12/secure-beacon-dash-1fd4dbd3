import React, { createContext, useContext, useState, ReactNode } from "react";

interface DemoContextType {
  demoMode: boolean;
  setDemoMode: (v: boolean) => void;
}

const DemoContext = createContext<DemoContextType>({ demoMode: true, setDemoMode: () => {} });

export const DemoProvider = ({ children }: { children: ReactNode }) => {
  const [demoMode, setDemoMode] = useState(true);
  return <DemoContext.Provider value={{ demoMode, setDemoMode }}>{children}</DemoContext.Provider>;
};

export const useDemo = () => useContext(DemoContext);
