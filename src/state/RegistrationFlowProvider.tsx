"use client";

import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  initialRegistrationFlowState,
  registrationFlowReducer,
} from "./registration-flow.reducer";
import type {
  RegistrationFlowAction,
  RegistrationFlowState,
} from "./registration-flow.types";

interface RegistrationFlowContextValue {
  state: RegistrationFlowState;
  dispatch: Dispatch<RegistrationFlowAction>;
}

const RegistrationFlowContext =
  createContext<RegistrationFlowContextValue | null>(null);

export function RegistrationFlowProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(
    registrationFlowReducer,
    initialRegistrationFlowState,
  );

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <RegistrationFlowContext.Provider value={value}>
      {children}
    </RegistrationFlowContext.Provider>
  );
}

export function useRegistrationFlow(): RegistrationFlowContextValue {
  const context = useContext(RegistrationFlowContext);

  if (!context) {
    throw new Error(
      "useRegistrationFlow must be used inside RegistrationFlowProvider.",
    );
  }

  return context;
}
