"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getUserData } from "@/utils/auth";
import { getAccessToken } from "@/utils/token";
import { useRouter } from "next/navigation";
import api from "@/utils/axios";
const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // null = loading, false = not logged in
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const token = getAccessToken();
            console.log(token, "ACCESS TOKEN");
            if (!token) {
                setUser(false); // not logged in
                return;
            }

            const userData = await getUserData();

            if (!userData) {
                setUser(false); // token invalid
            } else {
                setUser(userData); // user logged in
            }
        };

        fetchUser();
    }, []);

    const logout = async () => {
        try {
            await api.post("/auth/logout", {}, { withCredentials: true });
        } catch (error) {
            console.error("Logout API failed:", error);
            // even if it fails, we still clean frontend state
        } finally {
            // ✅ Clean frontend state
            localStorage.removeItem("accessToken");
            localStorage.removeItem("userData");
            setUser(false);
            router.replace("/");
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => useContext(AuthContext);
