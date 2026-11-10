import { createContext, useContext, useState, type ReactNode } from "react";

type AppContextValue = { isSidebarOpen: boolean; setSidebarOpen: (open: boolean) => void };

const AppContext = createContext<AppContextValue>({ isSidebarOpen: true, setSidebarOpen: () => {} });

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    return <AppContext.Provider value={{ isSidebarOpen, setSidebarOpen }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
