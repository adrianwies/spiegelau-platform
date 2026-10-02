import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";


import {
  getCurrentUser,
  login as loginRequest,
  logout as logoutRequest,
} from "../services/auth.service";


const AuthContext =
  createContext(null);


export function AuthProvider({
  children,
}) {
  const [user, setUser] =
    useState(null);


  const [loading, setLoading] =
    useState(true);


  useEffect(() => {
    async function loadUser() {
      try {
        const data =
          await getCurrentUser();


        setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }


    loadUser();
  }, []);


  async function login(
    username,
    password,
  ) {
    const data =
      await loginRequest(
        username,
        password,
      );


    setUser(data.user);


    return data.user;
  }


  async function logout() {
    await logoutRequest();


    setUser(null);
  }


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  return useContext(
    AuthContext,
  );
}