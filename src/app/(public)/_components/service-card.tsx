"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock, Tag, ArrowUpRight, Star } from "lucide-react";

import { IService } from "@/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  service: IService;
  onBookClick?: (service: IService) => void;
}

export function ServiceCard({ service, onBookClick }: ServiceCardProps) {
  const thumbnail = service.images?.[0] || "/placeholder-service.jpg";

  return (
    <Card className="group flex flex-col justify-between overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl">
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
        <Image
          src={thumbnail}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {service.category && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-slate-800 flex items-center gap-1 shadow-sm">
            <Tag className="h-3 w-3 text-indigo-600" />
            {service.category.name}
          </div>
        )}
      </div>

      <CardContent className="p-5 flex-1 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1 font-medium">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            <span>{service.duration} mins</span>
          </div>
          {service.technician?.averageRating && (
            <div className="flex items-center gap-1 font-semibold text-amber-600">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{Number(service.technician.averageRating).toFixed(1)}</span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
          {service.title}
        </h3>

        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {service.description}
        </p>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-auto">
        <div>
          <span className="text-xs text-slate-400 block font-medium">Starting at</span>
          <span className="text-xl font-extrabold text-slate-900">
            ৳{Number(service.price).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/services/${service.id}`}
            className="inline-flex items-center justify-center h-8 px-3 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Details
          </Link>

          <Button
            size="sm"
            onClick={() => onBookClick?.(service)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm"
          >
            Book
            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}