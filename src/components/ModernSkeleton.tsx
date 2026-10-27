'use client';

import React from 'react';
import GlassPanel from './GlassPanel';
import { Sparkles, Utensils, Truck, Building2 } from 'lucide-react';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-r from-stone-200/50 via-stone-100/80 to-stone-200/50 ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />
    </div>
  );
}

// 1. Food Surplus Listing Card Skeleton
export function ListingCardSkeleton() {
  return (
    <GlassPanel variant="standard" className="overflow-hidden flex flex-col justify-between border border-white/80 p-0 animate-pulse-subtle">
      {/* Top Image Thumbnail Skeleton */}
      <div className="relative aspect-video w-full bg-stone-200/60 overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
        {/* Safe shelf-life tag skeleton */}
        <div className="absolute top-2.5 right-2.5">
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
        {/* Category tag skeleton */}
        <div className="absolute top-2.5 left-2.5">
          <Skeleton className="w-16 h-6 rounded-full" />
        </div>
      </div>

      {/* Card Content Skeleton */}
      <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <Skeleton className="w-24 h-5 rounded-full" />
            <Skeleton className="w-16 h-4 rounded-md" />
          </div>
          <Skeleton className="w-4/5 h-5 rounded-lg" />
          <div className="space-y-1.5 pt-1">
            <Skeleton className="w-full h-3.5 rounded-md" />
            <Skeleton className="w-2/3 h-3.5 rounded-md" />
          </div>
        </div>

        {/* Portion Bar & Action */}
        <div className="pt-3 border-t border-stone-200/60 space-y-2.5">
          <div className="flex items-center justify-between">
            <Skeleton className="w-28 h-4 rounded-md" />
            <Skeleton className="w-16 h-4 rounded-md font-bold" />
          </div>
          <Skeleton className="w-full h-2 rounded-full" />
          <Skeleton className="w-full h-9 rounded-xl mt-2" />
        </div>
      </div>
    </GlassPanel>
  );
}

// 2. Metrics & Environmental Impact Skeleton
export function MetricsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <GlassPanel key={i} variant="standard" className="p-5 space-y-3 border border-white/80">
          <div className="flex items-center justify-between">
            <Skeleton className="w-9 h-9 rounded-xl" />
            <Skeleton className="w-14 h-5 rounded-full" />
          </div>
          <Skeleton className="w-24 h-8 rounded-lg" />
          <Skeleton className="w-32 h-3.5 rounded-md" />
        </GlassPanel>
      ))}
    </div>
  );
}

// 3. Proximity Map Skeleton with Radar Ping
export function MapSkeleton() {
  return (
    <GlassPanel variant="standard" className="relative w-full h-[480px] rounded-3xl overflow-hidden border border-white/80 flex items-center justify-center">
      <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
      {/* Radar Ping Animation in Center */}
      <div className="relative flex flex-col items-center gap-3 z-10 text-center">
        <div className="relative flex items-center justify-center">
          <span className="absolute w-24 h-24 rounded-full bg-accent-primary/20 animate-ping" />
          <span className="absolute w-16 h-16 rounded-full bg-accent-trust/30 animate-pulse" />
          <div className="relative w-12 h-12 rounded-2xl bg-white shadow-lg flex items-center justify-center text-accent-primary">
            <Truck className="w-6 h-6 animate-bounce" />
          </div>
        </div>
        <div className="space-y-1">
          <span className="text-xs font-bold text-ink flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
            Plotting Live Food Rescue Map Nodes...
          </span>
          <p className="text-[11px] text-ink-muted">Aligning real-time distance and safe consumption windows</p>
        </div>
      </div>
    </GlassPanel>
  );
}

// 4. Transport Tracking & Timeline Skeleton
export function TransportTimelineSkeleton() {
  return (
    <GlassPanel variant="standard" className="p-6 space-y-6 border border-white/80">
      <div className="flex items-center justify-between pb-4 border-b border-stone-200/60">
        <div className="space-y-2">
          <Skeleton className="w-32 h-4 rounded-md" />
          <Skeleton className="w-48 h-6 rounded-lg" />
        </div>
        <Skeleton className="w-28 h-8 rounded-xl" />
      </div>

      {/* 4 Checkpoint Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="p-3.5 rounded-2xl bg-white/50 border border-stone-200/50 space-y-2">
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-20 h-4 rounded-md" />
            </div>
            <Skeleton className="w-16 h-3 rounded-md" />
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

// 5. Full Engaging Page Skeleton (for initial router loading transitions)
export default function CatchyPageSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Skeleton */}
      <GlassPanel variant="prominent" className="p-8 sm:p-10 space-y-6 border border-white/90 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-accent-primary animate-ping" />
              <Skeleton className="w-36 h-5 rounded-full" />
            </div>
            <Skeleton className="w-64 sm:w-80 h-9 rounded-xl" />
            <Skeleton className="w-96 max-w-full h-4 rounded-md" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-32 h-11 rounded-2xl" />
            <Skeleton className="w-28 h-11 rounded-2xl" />
          </div>
        </div>

        {/* Shimmer Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-stone-200/50">
          {[1, 2, 3, 4].map((k) => (
            <div key={k} className="p-3 rounded-xl bg-white/40 space-y-1.5">
              <Skeleton className="w-16 h-3 rounded-md" />
              <Skeleton className="w-24 h-6 rounded-lg font-bold" />
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Grid of Listings Skeletons */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-48 h-6 rounded-lg" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-20 h-8 rounded-xl" />
            <Skeleton className="w-20 h-8 rounded-xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <ListingCardSkeleton />
          <ListingCardSkeleton />
          <ListingCardSkeleton />
        </div>
      </div>
    </div>
  );
}
