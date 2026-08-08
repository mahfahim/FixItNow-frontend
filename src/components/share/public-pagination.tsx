import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  searchParams: Record<string, string | undefined>;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  limit,
  searchParams,
}: PaginationProps) {
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });

    params.set("page", pageNumber.toString());
    params.set("limit", limit.toString());
    return `/technicians?${params.toString()}`;
  };

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm gap-4 mt-10">
      <p className="text-xs sm:text-sm text-slate-500">
        Showing <span className="font-bold text-slate-800">{totalItems > 0 ? startItem : 0}</span> to{" "}
        <span className="font-bold text-slate-800">{endItem}</span> of{" "}
        <span className="font-bold text-slate-800">{totalItems}</span> technicians
      </p>

      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <Link
          href={createPageUrl(currentPage - 1)}
          aria-disabled={currentPage <= 1}
          className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
            currentPage <= 1
              ? "border-slate-200 text-slate-300 pointer-events-none"
              : "border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </Link>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Link
              key={pageNum}
              href={createPageUrl(pageNum)}
              className={`w-8 h-8 flex items-center justify-center text-xs font-semibold rounded-xl border transition ${
                pageNum === currentPage
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {pageNum}
            </Link>
          ))}
        </div>

        {/* Next Button */}
        <Link
          href={createPageUrl(currentPage + 1)}
          aria-disabled={currentPage >= totalPages}
          className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold border transition ${
            currentPage >= totalPages
              ? "border-slate-200 text-slate-300 pointer-events-none"
              : "border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          Next <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}