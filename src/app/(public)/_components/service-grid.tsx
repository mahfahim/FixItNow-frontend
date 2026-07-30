"use client";

import React from "react";
import { IService } from "@/types";
import { ServiceCard } from "./service-card";
import { Wrench } from "lucide-react";

interface ServiceGridProps {
  services: IService[];
  isLoading?: boolean;
  onBookService?: (service: IService) => void;
}

export function ServiceGrid({
  services,
  isLoading = false,
  onBookService,
}: ServiceGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="h-85 rounded-2xl bg-slate-100 animate-pulse border border-slate-200/60"
          />
        ))}
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-16 px-4 bg-slate-50 border border-dashed border-slate-200 rounded-2xl my-6">
        <div className="inline-flex p-3 bg-slate-200/60 rounded-full text-slate-500 mb-3">
          <Wrench className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900">No Services Found</h3>
        <p className="text-slate-500 text-sm max-w-sm mx-auto mt-1">
          Try adjusting your search query or clear existing filters to explore more options.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          onBookClick={onBookService}
        />
      ))}
    </div>
  );
}