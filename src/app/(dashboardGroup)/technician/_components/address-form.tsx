
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addAddress } from "@/actions/address.actions";
import { ICreateAddress } from "@/types";
import { useToast } from "@/providers/toast-provider";
import { Loader2, MapPin, Tag, Hash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AddressForm() {
    const router = useRouter();
    const { success, error } = useToast();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [formData, setFormData] = useState<ICreateAddress>({
        label: "HOME",
        addressLine: "",
        city: "",
        district: "",
        postalCode: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            label: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setLoading(true);

        try {
            const res = await addAddress(formData);

            if (!res?.success) {
                const msg = res?.message || "Failed to add address.";
                setErrorMsg(msg);
                error("Error", msg);
                return;
            }

            success("Address Added", "Your new address has been added successfully.");
            router.push("/technician/profile");
            router.refresh();
        } catch (err) {
            console.error("Error adding address:", err);
            const errMsg = "An unexpected error occurred. Please try again.";
            setErrorMsg(errMsg);
            error("Error", errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
            <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                    <Alert variant="destructive" className="bg-rose-50 border-rose-200 text-rose-700">
                        <AlertDescription>{errorMsg}</AlertDescription>
                    </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Address Label */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Tag className="w-4 h-4 text-slate-400" />
                            Address Label
                        </Label>
                        <Select
                            value={formData.label}
                            onValueChange={(val) => handleSelectChange(val ?? "")}
                        >
                            <SelectTrigger className="w-full rounded-xl border-slate-200 bg-white text-slate-900">
                                <SelectValue placeholder="Select Label" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="HOME">Home</SelectItem>
                                <SelectItem value="WORK">Work</SelectItem>
                                <SelectItem value="OFFICE">Office</SelectItem>
                                <SelectItem value="OTHER">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Postal Code */}
                    <div className="space-y-2">
                        <Label htmlFor="postalCode" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <Hash className="w-4 h-4 text-slate-400" />
                            Postal Code
                        </Label>
                        <Input
                            id="postalCode"
                            type="text"
                            name="postalCode"
                            value={formData.postalCode}
                            onChange={handleChange}
                            placeholder="e.g. 1207"
                            className="rounded-xl border-slate-200 text-slate-900"
                        />
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            City
                        </Label>
                        <Input
                            id="city"
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Dhaka"
                            className="rounded-xl border-slate-200 text-slate-900"
                        />
                    </div>

                    {/* District */}
                    <div className="space-y-2">
                        <Label htmlFor="district" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            District
                        </Label>
                        <Input
                            id="district"
                            type="text"
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Dhaka"
                            className="rounded-xl border-slate-200 text-slate-900"
                        />
                    </div>

                    {/* Address Line */}
                    <div className="md:col-span-2 space-y-2">
                        <Label htmlFor="addressLine" className="text-sm font-medium text-slate-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            Address Line
                        </Label>
                        <Input
                            id="addressLine"
                            type="text"
                            name="addressLine"
                            value={formData.addressLine}
                            onChange={handleChange}
                            required
                            placeholder="House 12, Road 5, Block B..."
                            className="rounded-xl border-slate-200 text-slate-900"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        className="rounded-xl text-slate-600 hover:bg-slate-100"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl gap-2"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        Add Address
                    </Button>
                </div>
            </form>
        </Card>
    );
}