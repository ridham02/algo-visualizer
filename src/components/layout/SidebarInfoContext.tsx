import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type SidebarInfoItem = {
  label: string;
  value: string;
};

type SidebarInfoContextValue = {
  title: string;
  items: SidebarInfoItem[];
  setSidebarInfo: (
    source: string,
    title: string,
    items: SidebarInfoItem[]
  ) => void;
  clearSidebarInfo: (source: string) => void;
};

const SidebarInfoContext = createContext<SidebarInfoContextValue | null>(null);

export function SidebarInfoProvider({ children }: { children: ReactNode }) {
  const [sidebarState, setSidebarState] = useState<{
    source: string;
    title: string;
    items: SidebarInfoItem[];
  }>({
    source: "",
    title: "",
    items: [],
  });

  const value = useMemo(
    () => ({
      title: sidebarState.title,
      items: sidebarState.items,
      setSidebarInfo: (
        nextSource: string,
        nextTitle: string,
        nextItems: SidebarInfoItem[]
      ) => {
        setSidebarState({
          source: nextSource,
          title: nextTitle,
          items: nextItems,
        });
      },
      clearSidebarInfo: (nextSource: string) => {
        setSidebarState((currentState) => {
          if (currentState.source !== nextSource) {
            return currentState;
          }

          return {
            source: "",
            title: "",
            items: [],
          };
        });
      },
    }),
    [sidebarState]
  );

  return (
    <SidebarInfoContext.Provider value={value}>
      {children}
    </SidebarInfoContext.Provider>
  );
}

export function useSidebarInfo() {
  const context = useContext(SidebarInfoContext);

  if (!context) {
    throw new Error("useSidebarInfo must be used within SidebarInfoProvider");
  }

  return context;
}
