"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "@/utils/token";

export const useAuth = () => {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const token = getAccessToken();

        if (!token) {
            router.replace("/login"); 
        } else {
            setChecking(false);
        }
    }, []);

    return checking; // true = still checking, false = auth ok
};
