/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export const SkeletonLoading: React.FC<{ itemsCount?: number }> = ({ itemsCount = 3 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 select-none">
      {Array.from({ length: itemsCount }).map((_, idx) => (
        <div key={idx} className="bg-white rounded-3xl border border-stone-200/60 overflow-hidden shadow-xs flex flex-col h-full">
          {/* Header */}
          <div className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full skeleton-shimmer shrink-0" />
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="h-3 w-1/2 rounded-full skeleton-shimmer" />
              <div className="h-2 w-1/4 rounded-full skeleton-shimmer" />
            </div>
          </div>

          {/* Core Image Frame */}
          <div className="aspect-square w-full skeleton-shimmer" />

          {/* Details Column */}
          <div className="p-4 flex-1 flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <div className="h-4 w-3/4 rounded-full skeleton-shimmer" />
              <div className="h-3 w-1/6 rounded-full skeleton-shimmer" />
            </div>
            
            <div className="h-3 w-full rounded-full skeleton-shimmer" />
            <div className="h-3 w-5/6 rounded-full skeleton-shimmer" />

            <div className="mt-auto pt-3 flex gap-2 justify-between items-center">
              <div className="h-8 w-2/5 rounded-full skeleton-shimmer" />
              <div className="h-8 w-1/2 rounded-full skeleton-shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-stone-200/50 skeleton-shimmer h-24" />
        ))}
      </div>
      <div className="h-64 bg-white rounded-2xl border border-stone-200/50 skeleton-shimmer" />
    </div>
  );
};
