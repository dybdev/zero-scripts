"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { SignInModal } from "./sign-in-modal";

interface AuthContextValue {
  authenticated: boolean;
  requestSignIn: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  authenticated,
  children,
}: {
  authenticated: boolean;
  children: React.ReactNode;
}) {
  const [signInOpen, setSignInOpen] = useState(false);
  const requestSignIn = useCallback(() => setSignInOpen(true), []);
  const value = useMemo(
    () => ({ authenticated, requestSignIn }),
    [authenticated, requestSignIn],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SignInModal
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
      />
    </AuthContext.Provider>
  );
}

export function useBuyerAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useBuyerAuth must be used within AuthProvider");
  }
  return context;
}
