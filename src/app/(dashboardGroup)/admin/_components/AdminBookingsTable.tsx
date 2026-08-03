// src/app/(dashboardGroup)/admin/_components/AdminBookingsTable.tsx

"use client";

import { IBooking, BookingStatus, PaymentStatus } from "@/types";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useToast } from "@/providers/toast-provider";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Wrench,
  Clock,
} from "lucide-react";

interface AdminBookingsTableProps {
  bookings: IBooking[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export default function AdminBookingsTable({
  bookings,
  meta,
}: AdminBookingsTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { info } = useToast();

  const totalPages = Math.ceil((meta.total || 0) / (meta.limit || 10));

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    info("Page Navigation", `Navigated to page ${newPage}`);
  };

  const getBookingStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.COMPLETED:
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-200">
            COMPLETED
          </Badge>
        );
      case BookingStatus.CANCELLED:
      case BookingStatus.DECLINED:
        return (
          <Badge className="bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 border-rose-200">
            {status}
          </Badge>
        );
      case BookingStatus.IN_PROGRESS:
        return (
          <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-amber-200">
            IN PROGRESS
          </Badge>
        );
      case BookingStatus.ACCEPTED:
        return (
          <Badge className="bg-blue-500/15 text-blue-700 hover:bg-blue-500/25 border-blue-200">
            ACCEPTED
          </Badge>
        );
      case BookingStatus.PAID:
        return (
          <Badge className="bg-teal-500/15 text-teal-700 hover:bg-teal-500/25 border-teal-200">
            PAID
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status || "REQUESTED"}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case PaymentStatus.COMPLETED:
        return (
          <Badge className="bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border-emerald-200">
            PAID
          </Badge>
        );
      case PaymentStatus.FAILED:
        return (
          <Badge className="bg-rose-500/15 text-rose-700 hover:bg-rose-500/25 border-rose-200">
            FAILED
          </Badge>
        );
      case PaymentStatus.REFUNDED:
        return (
          <Badge className="bg-purple-500/15 text-purple-700 hover:bg-purple-500/25 border-purple-200">
            REFUNDED
          </Badge>
        );
      default:
        return (
          <Badge className="bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border-amber-200">
            UNPAID
          </Badge>
        );
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* ShadCN Table Component Wrapper */}
      <div className="rounded-lg border border-slate-200 bg-white shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700">Service Info</TableHead>
              <TableHead className="font-semibold text-slate-700">Customer</TableHead>
              <TableHead className="font-semibold text-slate-700">Technician</TableHead>
              <TableHead className="font-semibold text-slate-700">Schedule</TableHead>
              <TableHead className="font-semibold text-slate-700">Amount</TableHead>
              <TableHead className="font-semibold text-slate-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.length > 0 ? (
              bookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-slate-50/80 transition-colors">
                  {/* Service Info */}
                  <TableCell>
                    <div className="font-medium text-slate-900 flex items-center gap-1.5">
                      <Wrench className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {booking.service?.title || "Unknown Service"}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      ID: {booking.id.slice(0, 8)}...
                    </div>
                  </TableCell>

                  {/* Customer */}
                  <TableCell>
                    <div className="font-medium text-slate-800 flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {booking.customer?.name || "N/A"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {booking.customer?.email || ""}
                    </div>
                  </TableCell>

                  {/* Technician */}
                  <TableCell>
                    <div className="font-medium text-slate-800">
                      {booking.technician?.user?.name || (
                        <span className="text-slate-400 italic">Unassigned</span>
                      )}
                    </div>
                  </TableCell>

                  {/* Schedule */}
                  <TableCell>
                    <div className="text-slate-800 flex items-center gap-1 text-xs font-medium">
                      <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3 text-slate-400 shrink-0" />
                      {booking.scheduledTime}
                    </div>
                  </TableCell>

                  {/* Amount */}
                  <TableCell className="font-semibold text-slate-900">
                    ৳{booking.price}
                  </TableCell>

                  {/* Statuses */}
                  <TableCell>
                    <div className="flex flex-col gap-1.5 items-start">
                      {getBookingStatusBadge(booking.status)}
                      {getPaymentStatusBadge(booking.paymentStatus)}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-2">
          <p className="text-sm text-slate-500">
            Showing page <span className="font-medium text-slate-800">{meta.page}</span> of{" "}
            <span className="font-medium text-slate-800">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="gap-1 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(meta.page + 1)}
              disabled={meta.page >= totalPages}
              className="gap-1 cursor-pointer"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}