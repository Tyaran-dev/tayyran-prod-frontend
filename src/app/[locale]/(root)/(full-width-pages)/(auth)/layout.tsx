"use client";
import { FaPlane } from "react-icons/fa";
import bg from "/public/assets/hotels/bg1.png";
import { StaticImageData } from "next/image";
import { useTranslations } from 'next-intl';

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const t = useTranslations('SignUp');

    return (
        <div className=" flex items-center justify-center  relative overflow-hidden w-full max-w-[1800px]">

            <div className="w-full  gap-0  rounded-xl shadow-2xl overflow-hidden  animate-fade-in">
                <div className="  flex flex-col justify-center animate-fade-in-left  ">

                    {children}
                </div>

            </div>

        </div>
    );
}
