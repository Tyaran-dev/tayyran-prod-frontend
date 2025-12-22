"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { User, Mail, Phone, Calendar, CreditCard, Settings, Receipt, Globe, Languages, Edit2, LogIn } from "lucide-react";
import EditProfileDialog from "@/app/components/website/profile/edit-profile-dialog";
import EditContactDialog from "@/app/components/website/profile/edit-contact-dialog";
import EditPassportDialog from "@/app/components/website/profile/edit-passport-dialog";
import EditDateOfBirthDialog from "@/app/components/website/profile/edit-dateofbirth-dialog";
import { UserData } from "@/types/user";
import { useAuthContext } from "@/context//AuthContext";
import Link from "next/link";

import api from "@/utils/axios";
import { toast } from "react-hot-toast";


export default function ProfilePage() {
    const t = useTranslations("ProfilePage");
    const locale = useLocale();
    const isRTL = locale === "ar";
    const { user, logout } = useAuthContext();
    const [userData, setUserData] = useState<UserData | null>(user);
    const [loading, setLoading] = useState(true);
    const { setUser } = useAuthContext();
    const [saving, setSaving] = useState(false);

    const handleSaveChanges = async () => {
        if (!userData) return;

        try {
            setSaving(true);

            // Prepare the data to match backend expectations
            const updateData = {
                first_name: userData.first_name,
                last_name: userData.last_name,
                personalInfo: userData.personalInfo
            };

            // Remove any fields that shouldn't be updated (like email)
            delete updateData.personalInfo?.contact?.email; // Remove email from contact since it's handled separately

            const response = await api.put("/users/updateUser", updateData);
            const updatedUser = response.data.user; // Note: backend returns { success, message, user }

            setUser(updatedUser);
            setUserData(updatedUser);

            toast.success(t("profileUpdated") || "Profile updated successfully");
        } catch (error: any) {
            console.error("Update error:", error);
            toast.error(
                error?.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (user) {
            setUserData(user);
        }
        setLoading(false);
    }, [user]);

    console.log(userData, "user data")

    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [editContactOpen, setEditContactOpen] = useState(false);
    const [editPassportOpen, setEditPassportOpen] = useState(false);
    const [editDateOfBirthOpen, setEditDateOfBirthOpen] = useState(false);

    const getInitials = () => {
        if (!userData) return "";
        return `${userData?.first_name?.charAt(0) || ""}${userData?.last_name?.charAt(0) || ""}`.toUpperCase();
    };

    const getFullName = () => {
        if (!userData) return "";
        return `${userData?.first_name || ""} ${userData?.last_name || ""}`;
    };

    const updateUserData = (updates: Partial<UserData>) => {
        setUserData((prev) => {
            if (!prev) return null;

            // Deep merge for personalInfo
            if (updates.personalInfo) {
                return {
                    ...prev,
                    ...updates,
                    personalInfo: {
                        ...prev.personalInfo,
                        ...updates.personalInfo,
                        // Deep merge for nested objects
                        contact: {
                            ...prev.personalInfo?.contact,
                            ...updates.personalInfo?.contact
                        },
                        passport: {
                            ...prev.personalInfo?.passport,
                            ...updates.personalInfo?.passport
                        },
                        dateOfBirth: {
                            ...prev.personalInfo?.dateOfBirth,
                            ...updates.personalInfo?.dateOfBirth
                        }
                    }
                };
            }

            return { ...prev, ...updates };
        });
    };

    const getMembershipStatusTranslation = (status: string) => {
        return status === "active" ? t("status.active") : t("status.pending");
    };

    const getAcountStatusTranslation = (status: boolean | undefined) => {
        return status === true ? t("status.active") : t("status.pending");
    };

    // Show loading state
    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">{t("loading") || "Loading..."}</p>
                </div>
            </div>
        );
    }

    // Show login prompt if no user
    if (!userData) {
        return (
            <div className={` ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="container mx-auto px-4 py-8 ">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <div className="text-center py-12">
                            <div className="bg-emerald-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                                <User className="h-12 w-12 text-emerald-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">
                                {t("notLoggedInTitle") || "Welcome to Your Profile"}
                            </h2>
                            <p className="text-slate-600 mb-8 max-w-md mx-auto">
                                {t("notLoggedInMessage") || "Please log in to view and manage your profile information."}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/login"
                                    className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors inline-flex items-center justify-center gap-2"
                                >
                                    <LogIn className="h-5 w-5" />
                                    {t("loginButton") || "Log In"}
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
                                >
                                    {t("registerButton") || "Create Account"}
                                </Link>
                            </div>
                            <p className="text-sm text-slate-500 mt-8">
                                {t("loginHint") || "Don't have an account yet? Sign up to get started!"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={` ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="container mx-auto px-4 py-8 ">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex flex-col items-center text-center space-y-4">
                                <div className="h-24 w-24 rounded-full bg-greenGradient flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">
                                        {getInitials()}
                                    </span>
                                </div>

                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800">
                                        {getFullName()}
                                    </h2>
                                    <p className="text-slate-600 mt-1">
                                        {userData?.personalInfo?.contact?.phoneCode || ""}
                                        {userData?.personalInfo?.contact?.phoneNumber || ""}
                                    </p>
                                </div>

                                <span className={`text-sm px-4 py-1 rounded-full ${userData?.emailVerified === true ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                    {getAcountStatusTranslation(userData?.emailVerified)}
                                </span>
                            </div>

                            <hr className="my-6 border-slate-200" />

                            <div className="space-y-4">
                                {/* Membership Card */}
                                <div className="bg-emerald-50 rounded-xl p-6">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-emerald-500 p-2 rounded-lg">
                                            <CreditCard className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800">{t("membership")}</h3>
                                            <p className="text-sm text-slate-600">{t("priorityAccess")}</p>
                                        </div>
                                    </div>
                                    <button className="w-full bg-greenGradient hover:bg-emerald-700 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                                        {t("joinMembership")}
                                    </button>
                                    <p className="text-xs text-slate-600 mt-3">
                                        {t("saveOnBookings", { discountPercentage: userData?.discountPercentage || 0 })}
                                    </p>
                                </div>

                                {/* Points Card */}
                                <div className="bg-emerald-50 rounded-xl p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-emerald-500 p-2 rounded-lg">
                                                <Receipt className="h-5 w-5 text-white" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-slate-800">{t("points")}</h3>
                                                <p className="text-2xl font-bold text-emerald-600">{userData?.points || 0}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={logout}
                                    className="w-full mt-6 px-4 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                                >
                                    {t("logout") || "Log Out"}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Profile Section */}
                        <div className="bg-white rounded-xl shadow-lg">
                            <div className="px-6 py-4 bg-emerald-50 rounded-t-xl">
                                <h2 className="flex items-center gap-2 text-slate-800 text-xl font-semibold">
                                    <User className="h-5 w-5" />
                                    {t("profile")}
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="space-y-3">
                                    {/* Full Name */}
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">{t("fullName")}</p>
                                            <p className="text-base font-semibold text-slate-800 mt-1">
                                                {getFullName()}
                                            </p>
                                        </div>
                                        <button
                                            className="p-2 hover:bg-white rounded-md transition-colors"
                                            onClick={() => setEditProfileOpen(true)}
                                        >
                                            <Edit2 className="h-4 w-4 text-slate-400 hover:text-emerald-500" />
                                        </button>
                                    </div>

                                    {/* Email */}
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">{t("emailAddress")}</p>
                                            <p className="text-base font-semibold text-slate-800 mt-1">
                                                {userData?.email}
                                            </p>
                                        </div>
                                        {/* Email is not editable in this flow */}
                                    </div>

                                    {/* Mobile Number */}
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">{t("mobileNumber")}</p>
                                            <p className="text-base font-semibold text-slate-800 mt-1">
                                                {userData?.personalInfo?.contact?.phoneCode || ""}
                                                {userData?.personalInfo?.contact?.phoneNumber || t("notProvided")}
                                            </p>
                                        </div>
                                        <button
                                            className="p-2 hover:bg-white rounded-md transition-colors"
                                            onClick={() => setEditContactOpen(true)}
                                        >
                                            <Edit2 className="h-4 w-4 text-slate-400 hover:text-emerald-500" />
                                        </button>
                                    </div>

                                    {/* Nationality */}
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">{t("nationality")}</p>
                                            <p className="text-base font-semibold text-slate-800 mt-1">
                                                {userData?.personalInfo?.nationality || t("notProvided")}
                                            </p>
                                        </div>
                                        <button
                                            className="p-2 hover:bg-white rounded-md transition-colors"
                                            onClick={() => setEditProfileOpen(true)}
                                        >
                                            <Edit2 className="h-4 w-4 text-slate-400 hover:text-emerald-500" />
                                        </button>
                                    </div>

                                    {/* Date of Birth */}
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                        <div>
                                            <p className="text-sm font-medium text-slate-500">Date of Birth</p>
                                            <p className="text-base font-semibold text-slate-800 mt-1">
                                                {userData?.personalInfo?.dateOfBirth?.day &&
                                                    userData?.personalInfo?.dateOfBirth?.month &&
                                                    userData?.personalInfo?.dateOfBirth?.year
                                                    ? `${userData.personalInfo.dateOfBirth.day}/${userData.personalInfo.dateOfBirth.month}/${userData.personalInfo.dateOfBirth.year}`
                                                    : t("notProvided") || "Not provided"
                                                }
                                            </p>
                                        </div>
                                        <button
                                            className="p-2 hover:bg-white rounded-md transition-colors"
                                            onClick={() => setEditDateOfBirthOpen(true)} // You'll need to create this state
                                        >
                                            <Edit2 className="h-4 w-4 text-slate-400 hover:text-emerald-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Travel Documents */}
                        <div className="bg-white rounded-xl shadow-lg">
                            <div className="px-6 py-4 bg-emerald-50 rounded-t-xl">
                                <h2 className="flex items-center gap-2 text-slate-800 text-xl font-semibold">
                                    <CreditCard className="h-5 w-5" />
                                    {t("travelDocuments")}
                                </h2>
                            </div>
                            <div className="p-6">
                                {userData?.personalInfo?.passport?.number ? (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500">{t("passportNumber")}</p>
                                                <p className="text-base font-semibold text-slate-800 mt-1">
                                                    {userData.personalInfo.passport.number}
                                                </p>
                                            </div>
                                            <button
                                                className="p-2 hover:bg-white rounded-md transition-colors"
                                                onClick={() => setEditPassportOpen(true)}
                                            >
                                                <Edit2 className="h-4 w-4 text-slate-400 hover:text-emerald-500" />
                                            </button>
                                        </div>

                                        {userData?.personalInfo?.passport?.issuingCountry && (
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500">{t("issuingCountry")}</p>
                                                    <p className="text-base font-semibold text-slate-800 mt-1">
                                                        {userData.personalInfo.passport.issuingCountry}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {userData?.personalInfo?.passport?.expiryDate && (
                                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                                <div>
                                                    <p className="text-sm font-medium text-slate-500">Passport Expiry Date</p>
                                                    <p className="text-base font-semibold text-slate-800 mt-1">
                                                        {`${userData.personalInfo.passport.expiryDate.day || ''}/${userData.personalInfo.passport.expiryDate.month || ''
                                                            }/${userData.personalInfo.passport.expiryDate.year || ''}`}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <CreditCard className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                                        <p className="text-slate-500 mb-4">{t("noPassportInfo")}</p>
                                        <button
                                            onClick={() => setEditPassportOpen(true)}
                                            className="bg-greenGradient text-white py-2 px-4 rounded-lg font-medium transition-colors"
                                        >
                                            {t("addPassportDetails")}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Save Changes Button */}
                        <div className="flex justify-end">
                            <button
                                onClick={handleSaveChanges}
                                disabled={saving}
                                className="px-6 py-3 bg-greenGradient text-white rounded-lg font-medium
               hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? t("saving") || "Saving..." : t("saveChanges") || "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {userData && (
                <>
                    <EditProfileDialog
                        open={editProfileOpen}
                        onOpenChange={setEditProfileOpen}
                        userData={userData}
                        onUpdate={updateUserData}
                    />

                    <EditContactDialog
                        open={editContactOpen}
                        onOpenChange={setEditContactOpen}
                        userData={userData}
                        onUpdate={updateUserData}
                    />

                    <EditPassportDialog
                        open={editPassportOpen}
                        onOpenChange={setEditPassportOpen}
                        userData={userData}
                        onUpdate={updateUserData}
                    />

                    <EditDateOfBirthDialog
                        open={editDateOfBirthOpen}
                        onOpenChange={setEditDateOfBirthOpen}
                        userData={userData}
                        onUpdate={updateUserData}
                    />
                </>
            )}
        </div>
    );
}