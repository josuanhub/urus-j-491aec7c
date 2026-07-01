import React from 'react';

const LoadingSkeleton = ({ rows = 5, cols = 3, type = 'table' }) => {
  const baseSkeletonClass = "bg-[#1A1A2E] rounded animate-pulse";

  const TableSkeleton = () => (
    <div className="w-full overflow-x-auto rounded-xl border border-[#6C63FF]/20">
      {/* Table Header */}
      <div className="grid gap-3 p-4 border-b border-[#6C63FF]/10"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: cols }).map((_, colIdx) => (
          <div
            key={`header-${colIdx}`}
            className={`h-4 ${baseSkeletonClass} opacity-60`}
            style={{ width: colIdx === 0 ? '60%' : '80%' }}
          />
        ))}
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-[#6C63FF]/10">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={`row-${rowIdx}`}
            className="grid gap-3 p-4 items-center hover:bg-[#1A1A2E]/50 transition-colors"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: cols }).map((_, colIdx) => (
              <div key={`cell-${rowIdx}-${colIdx}`} className="flex items-center gap-2">
                {colIdx === 0 && (
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 ${baseSkeletonClass}`} />
                )}
                <div
                  className={`h-3 rounded ${baseSkeletonClass}`}
                  style={{
                    width: colIdx === 0 ? '70%' : `${50 + Math.random() * 40}%`,
                    animationDelay: `${(rowIdx * cols + colIdx) * 0.05}s`
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const CardsSkeleton = () => (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: `repeat(${Math.min(cols, 4)}, minmax(0, 1fr))`
      }}
    >
      {Array.from({ length: rows * cols }).map((_, idx) => (
        <div
          key={`card-${idx}`}
          className="bg-[#1A1A2E] rounded-xl border border-[#6C63FF]/20 p-5 flex flex-col gap-4"
          style={{ animationDelay: `${idx * 0.06}s` }}
        >
          {/* Card Image/Banner */}
          <div className={`w-full h-36 rounded-lg ${baseSkeletonClass}`}
            style={{ animationDelay: `${idx * 0.06}s` }}
          />

          {/* Card Avatar + Title */}
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex-shrink-0 ${baseSkeletonClass}`}
              style={{ animationDelay: `${idx * 0.06 + 0.05}s` }}
            />
            <div className="flex flex-col gap-2 flex-1">
              <div className={`h-3 w-3/4 rounded ${baseSkeletonClass}`}
                style={{ animationDelay: `${idx * 0.06 + 0.1}s` }}
              />
              <div className={`h-2 w-1/2 rounded ${baseSkeletonClass}`}
                style={{ animationDelay: `${idx * 0.06 + 0.15}s` }}
              />
            </div>
          </div>

          {/* Card Body Lines */}
          <div className="flex flex-col gap-2">
            {Array.from({ length: 3 }).map((_, lineIdx) => (
              <div
                key={`line-${idx}-${lineIdx}`}
                className={`h-2 rounded ${baseSkeletonClass}`}
                style={{
                  width: lineIdx === 2 ? '60%' : '100%',
                  animationDelay: `${idx * 0.06 + 0.2 + lineIdx * 0.05}s`
                }}
              />
            ))}
          </div>

          {/* Card Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-[#6C63FF]/10">
            <div className={`h-6 w-20 rounded-full ${baseSkeletonClass}`}
              style={{ animationDelay: `${idx * 0.06 + 0.35}s` }}
            />
            <div className={`h-6 w-16 rounded-lg ${baseSkeletonClass}`}
              style={{ animationDelay: `${idx * 0.06 + 0.4}s` }}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const ListSkeleton = () => (
    <div className="flex flex-col gap-2 w-full">
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={`list-${rowIdx}`}
          className="bg-[#1A1A2E] rounded-xl border border-[#6C63FF]/20 p-4 flex items-center gap-4"
        >
          {/* Left Icon/Avatar */}
          <div className={`w-12 h-12 rounded-xl flex-shrink-0 ${baseSkeletonClass}`}
            style={{ animationDelay: `${rowIdx * 0.07}s` }}
          />

          {/* Content */}
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`h-3 rounded ${baseSkeletonClass}`}
                style={{
                  width: `${30 + (rowIdx % 3) * 20}%`,
                  animationDelay: `${rowIdx * 0.07 + 0.05}s`
                }}
              />
              <div className={`h-4 w-12 rounded-full ${baseSkeletonClass}`}
                style={{ animationDelay: `${rowIdx * 0.07 + 0.08}s` }}
              />
            </div>
            <div
              className={`h-2 rounded ${baseSkeletonClass}`}
              style={{
                width: `${50 + (rowIdx % 4) * 12}%`,
                animationDelay: `${rowIdx * 0.07 + 0.1}s`
              }}
            />
          </div>

          {/* Right Meta */}
          <div className="flex flex-col items-end gap-2 flex-shrink-0">
            {Array.from({ length: Math.min(cols, 3) }).map((_, colIdx) => (
              <div
                key={`meta-${rowIdx}-${colIdx}`}
                className={`h-2 rounded ${baseSkeletonClass}`}
                style={{
                  width: `${40 + colIdx * 15}px`,
                  animationDelay: `${rowIdx * 0.07 + 0.15 + colIdx * 0.05}s`
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case 'cards':
        return <CardsSkeleton />;
      case 'list':
        return <ListSkeleton />;
      case 'table':
      default:
        return <TableSkeleton />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0A0F] p-4 md:p-6">
      {/* Header Skeleton */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className={`h-6 w-48 rounded-lg ${baseSkeletonClass}`} />
          <div className={`h-3 w-72 rounded ${baseSkeletonClass}`} />
        </div>
        <div className="flex items-center gap-3">
          <div className={`h-9 w-28 rounded-lg ${baseSkeletonClass}`} />
          <div className={`h-9 w-9 rounded-lg ${baseSkeletonClass}`} />
        </div>
      </div>

      {/* Stats Row (only for table/list) */}
      {type !== 'cards' && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={`stat-${idx}`}
              className="bg-[#1A1A2E] rounded-xl border border-[#6C63FF]/20 p-4 flex flex-col gap-2"
            >
              <div className={`h-2 w-20 rounded ${baseSkeletonClass}`}
                style={{ animationDelay: `${idx * 0.08}s` }}
              />
              <div className={`h-6 w-16 rounded ${baseSkeletonClass}`}
                style={{ animationDelay: `${idx * 0.08 + 0.05}s` }}
              />
              <div className={`h-2 w-24 rounded ${baseSkeletonClass}`}
                style={{ animationDelay: `${idx * 0.08 + 0.1}s` }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Filters Skeleton */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className={`h-9 w-48 rounded-lg ${baseSkeletonClass}`} />
        <div className={`h-9 w-32 rounded-lg ${baseSkeletonClass}`} />
        <div className={`h-9 w-28 rounded-lg ${baseSkeletonClass}`} />
        <div className="ml-auto flex gap-2">
          <div className={`h-9 w-9 rounded-lg ${baseSkeletonClass}`} />
          <div className={`h-9 w-9 rounded-lg ${baseSkeletonClass}`} />
        </div>
      </div>

      {/* Main Skeleton Content */}
      {renderSkeleton()}

      {/* Pagination Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className={`h-4 w-40 rounded ${baseSkeletonClass}`} />
        <div className="flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={`page-${idx}`}
              className={`h-9 w-9 rounded-lg ${baseSkeletonClass}`}
              style={{ animationDelay: `${idx * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;