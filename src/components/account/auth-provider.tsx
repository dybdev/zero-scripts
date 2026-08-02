"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { SignInModal } from "./sign-in-modal";
import { SessionTimeout } from "./session-timeout";

interface AuthContextValue {
  authenticated: boolean;
  discordVerified: boolean;
  requestSignIn: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  authenticated,
  discordVerified,
  children,
}: {
  authenticated: boolean;
  discordVerified: boolean;
  children: React.ReactNode;
}) {
  const [signInOpen, setSignInOpen] = useState(false);
  const requestSignIn = useCallback(() => setSignInOpen(true), []);
  const value = useMemo(
    () => ({ authenticated, discordVerified, requestSignIn }),
    [authenticated, discordVerified, requestSignIn],
  );

  return (
    <AuthContext.Provider value={value}>
      <SessionTimeout />
      {children}
      <SignInModal open={signInOpen} onClose={() => setSignInOpen(false)} />
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
