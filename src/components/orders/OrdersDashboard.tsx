"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { AnimatePresence } from "framer-motion";
import { Inbox } from "lucide-react";
import { markOrderAsRead } from "@/app/orders/actions";
import { OrderCard } from "@/components/orders/OrderCard";
import { OrderHistorySection } from "@/components/orders/OrderHistorySection";
import { OrdersHeader } from "@/components/orders/OrdersHeader";
import {
  OrdersToastStack,
  type OrdersToastItem,
} from "@/components/orders/OrdersToastStack";
import { useOrderNotificationSound } from "@/components/orders/useOrderNotificationSound";
import { useOrdersRealtime } from "@/components/orders/useOrdersRealtime";
import {
  sortOrdersNewestFirst,
  type StaffOrder,
} from "@/lib/orders/map-order";

interface OrdersDashboardProps {
  restaurantName: string;
  logoUrl: string;
  initialNewOrders: StaffOrder[];
  initialHistoryOrders: StaffOrder[];
  initialHistoryHasMore: boolean;
  initialHistoryTotalCount: number;
}

export function OrdersDashboard({
  restaurantName,
  logoUrl,
  initialNewOrders,
  initialHistoryOrders,
  initialHistoryHasMore,
  initialHistoryTotalCount,
}: OrdersDashboardProps) {
  const [newOrders, setNewOrders] = useState(() =>
    sortOrdersNewestFirst(initialNewOrders)
  );
  const [toasts, setToasts] = useState<OrdersToastItem[]>([]);
  const [successIds, setSuccessIds] = useState<Set<string>>(new Set());
  const [historyPrepend, setHistoryPrepend] = useState<StaffOrder | null>(
    null
  );
  const [, startTransition] = useTransition();
  const { play } = useOrderNotificationSound();

  const initialOrderIds = useMemo(
    () => initialNewOrders.map((order) => order.id),
    [initialNewOrders]
  );

  const pushToast = useCallback((order: StaffOrder) => {
    const id = `toast-${order.id}-${Date.now()}`;
    setToasts((current) => [
      {
        id,
        title: "New order received",
        message: `#${order.orderNumber} · ${order.customerName}`,
      },
      ...current.slice(0, 4),
    ]);
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 5000);
  }, []);

  const handleRealtimeInsert = useCallback(
    (order: StaffOrder) => {
      setNewOrders((current) => {
        if (current.some((item) => item.id === order.id)) return current;
        return sortOrdersNewestFirst([order, ...current]);
      });
      play();
      pushToast(order);
    },
    [play, pushToast]
  );

  const handleRealtimeMarkRead = useCallback((orderId: string) => {
    setNewOrders((current) => current.filter((order) => order.id !== orderId));
  }, []);

  useOrdersRealtime({
    initialOrderIds,
    onInsert: handleRealtimeInsert,
    onMarkRead: handleRealtimeMarkRead,
  });

  function dismissToast(id: string) {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }

  function handleMarkAsRead(orderId: string) {
    startTransition(async () => {
      const result = await markOrderAsRead(orderId);
      if (!result.success || !result.order) return;

      setSuccessIds((current) => new Set(current).add(orderId));

      window.setTimeout(() => {
        setNewOrders((current) =>
          current.filter((order) => order.id !== orderId)
        );
        setHistoryPrepend(result.order!);
        setSuccessIds((current) => {
          const next = new Set(current);
          next.delete(orderId);
          return next;
        });
      }, 650);
    });
  }

  return (
    <div className="min-h-screen bg-ink">
      <div className="pointer-events-none fixed inset-0 bg-hero-radial opacity-70" />

      <OrdersHeader
        restaurantName={restaurantName}
        logoUrl={logoUrl}
        newOrderCount={newOrders.length}
      />

      <OrdersToastStack toasts={toasts} onDismiss={dismissToast} />

      <main className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <section>
          <div className="mb-6">
            <h2 className="font-display text-3xl tracking-wide text-cream">
              New Orders
            </h2>
            <p className="mt-1 text-sm text-muted">
              Incoming orders appear instantly — no refresh needed.
            </p>
          </div>

          {newOrders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-surface-raised/60 px-6 py-16 text-center shadow-card">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.03] ring-1 ring-white/10">
                <Inbox className="h-7 w-7 text-muted" />
              </div>
              <p className="font-medium text-cream">All caught up</p>
              <p className="mt-1 text-sm text-muted">
                New orders will appear here with a sound alert.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence mode="popLayout" initial={false}>
                {newOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    variant="new"
                    isNew
                    onMarkAsRead={handleMarkAsRead}
                    markReadSuccess={successIds.has(order.id)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        <OrderHistorySection
          initialOrders={initialHistoryOrders}
          initialHasMore={initialHistoryHasMore}
          initialTotalCount={initialHistoryTotalCount}
          prependOrder={historyPrepend}
          onPrependConsumed={() => setHistoryPrepend(null)}
        />
      </main>
    </div>
  );
}
