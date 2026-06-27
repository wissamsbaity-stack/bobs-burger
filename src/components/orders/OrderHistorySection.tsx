"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Search, Calendar, Trash2, Loader2 } from "lucide-react";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrdersConfirmDialog } from "@/components/orders/OrdersConfirmDialog";
import {
  clearOrderHistory,
  deleteHistoryOrder,
  fetchOrderHistory,
} from "@/app/orders/actions";
import { HISTORY_PAGE_SIZE } from "@/lib/orders/constants";
import type { StaffOrder } from "@/lib/orders/map-order";
import { sortOrdersNewestFirst } from "@/lib/orders/map-order";

interface OrderHistorySectionProps {
  initialOrders: StaffOrder[];
  initialHasMore: boolean;
  initialTotalCount: number;
  prependOrder?: StaffOrder | null;
  onPrependConsumed?: () => void;
}

export function OrderHistorySection({
  initialOrders,
  initialHasMore,
  initialTotalCount,
  prependOrder,
  onPrependConsumed,
}: OrderHistorySectionProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const reloadHistory = useCallback(
    (nextPage: number, nextSearch: string, nextDate: string) => {
      startTransition(async () => {
        try {
          const result = await fetchOrderHistory({
            page: nextPage,
            search: nextSearch,
            date: nextDate || undefined,
          });
          setOrders(result.orders);
          setHasMore(result.hasMore);
          setTotalCount(result.totalCount);
          setPage(nextPage);
        } catch {
          // Keep existing list on failure.
        }
      });
    },
    []
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      reloadHistory(0, search, dateFilter);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [search, dateFilter, reloadHistory]);

  useEffect(() => {
    if (!prependOrder) return;
    if (search || dateFilter) {
      onPrependConsumed?.();
      return;
    }
    setOrders((current) => {
      if (current.some((item) => item.id === prependOrder.id)) return current;
      return sortOrdersNewestFirst([prependOrder, ...current]).slice(
        0,
        (page + 1) * HISTORY_PAGE_SIZE
      );
    });
    setTotalCount((count) => count + 1);
    onPrependConsumed?.();
  }, [prependOrder, search, dateFilter, page, onPrependConsumed]);

  function removeFromHistory(orderId: string) {
    setOrders((current) => current.filter((order) => order.id !== orderId));
    setTotalCount((count) => Math.max(0, count - 1));
  }

  async function handleLoadMore() {
    const nextPage = page + 1;
    setIsLoadingMore(true);
    try {
      const result = await fetchOrderHistory({
        page: nextPage,
        search,
        date: dateFilter || undefined,
      });
      setOrders((current) => {
        const merged = [...current];
        for (const order of result.orders) {
          if (!merged.some((item) => item.id === order.id)) {
            merged.push(order);
          }
        }
        return merged;
      });
      setHasMore(result.hasMore);
      setPage(nextPage);
    } finally {
      setIsLoadingMore(false);
    }
  }

  function handleDelete(orderId: string) {
    startTransition(async () => {
      const result = await deleteHistoryOrder(orderId);
      if (result.success) {
        removeFromHistory(orderId);
        if (expandedId === orderId) setExpandedId(null);
      }
    });
  }

  function handleClearHistory() {
    startTransition(async () => {
      const result = await clearOrderHistory();
      if (result.success) {
        setOrders([]);
        setHasMore(false);
        setTotalCount(0);
        setPage(0);
        setExpandedId(null);
        setShowClearConfirm(false);
      }
    });
  }

  return (
    <section className="mt-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-3xl tracking-wide text-cream">
            Order History
          </h2>
          <p className="mt-1 text-sm text-muted">
            {totalCount} archived order{totalCount === 1 ? "" : "s"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowClearConfirm(true)}
          disabled={totalCount === 0 || isPending}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-red-500/25 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 className="h-4 w-4" />
          Clear Entire History
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, name, or phone…"
            className="w-full rounded-xl border border-white/10 bg-surface-overlay py-3 pl-10 pr-4 text-sm text-cream outline-none transition placeholder:text-muted focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
          />
        </label>

        <label className="relative block sm:w-48">
          <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-surface-overlay py-3 pl-10 pr-3 text-sm text-cream outline-none transition focus:border-accent/40 focus:ring-2 focus:ring-accent/20"
          />
        </label>
      </div>

      <div className="relative mt-6 space-y-3">
        {isPending && orders.length > 0 ? (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-surface-overlay px-3 py-1 text-xs text-muted ring-1 ring-white/10">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Updating…
            </span>
          </div>
        ) : null}

        {orders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-surface-raised/50 px-6 py-12 text-center">
            <p className="text-sm text-muted">
              {search || dateFilter
                ? "No orders match your search."
                : "No archived orders yet."}
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              variant="history"
              isExpanded={expandedId === order.id}
              onToggleExpand={() =>
                setExpandedId((current) =>
                  current === order.id ? null : order.id
                )
              }
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {hasMore ? (
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-white/[0.06] disabled:opacity-50"
          >
            {isLoadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading…
              </>
            ) : (
              "Load More"
            )}
          </button>
        </div>
      ) : null}

      <OrdersConfirmDialog
        open={showClearConfirm}
        title="Clear entire history?"
        description="This permanently deletes all archived orders. New orders will not be affected."
        confirmLabel="Clear History"
        tone="danger"
        isLoading={isPending}
        onConfirm={handleClearHistory}
        onCancel={() => setShowClearConfirm(false)}
      />
    </section>
  );
}

export { type OrderHistorySectionProps };
