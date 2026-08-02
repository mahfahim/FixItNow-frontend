// "use client";

// import React, { createContext, useContext } from "react";
// import { useAuth } from "@/hooks/useAuth";
// import { IUser, Role } from "@/types";

// interface AuthContextType {
//   user: IUser | null;
//   isLoading: boolean;
//   isAuthenticated: boolean;
//   role: Role | null;
//   isAdmin: boolean;
//   isTechnician: boolean;
//   isCustomer: boolean;
//   refreshProfile: () => Promise<void>;
//   logout: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const auth = useAuth();

//   return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
// }

// export function useAuthContext() {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuthContext must be used within an AuthProvider");
//   }
//   return context;
// }