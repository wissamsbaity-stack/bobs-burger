"use client";

import { useEffect, useRef } from "react";
import { createBrowserClient } from "@/lib/supabase/client";
import { mapOrderRow } from "@/lib/orders/map-order";
import type { StaffOrder } from "@/lib/orders/map-order";
import type { Database } from "@/lib/supabase/types";

type OrderRow = Database["public"]["Tables"]["orders"]["Row"];

interface UseOrdersRealtimeOptions {
  initialOrderIds: string[];
  onInsert: (order: StaffOrder) => void;
  onMarkRead: (orderId: string) => void;
}

export function useOrdersRealtime({
  initialOrderIds,
  onInsert,
  onMarkRead,
}: UseOrdersRealtimeOptions) {
  const seenIdsRef = useRef(new Set(initialOrderIds));
  const readyRef = useRef(false);
  const onInsertRef = useRef(onInsert);
  const onMarkReadRef = useRef(onMarkRead);

  useEffect(() => {
    seenIdsRef.current = new Set(initialOrderIds);
  }, [initialOrderIds]);

  useEffect(() => {
    onInsertRef.current = onInsert;
  }, [onInsert]);

  useEffect(() => {
    onMarkReadRef.current = onMarkRead;
  }, [onMarkRead]);

  useEffect(() => {
    const supabase = createBrowserClient();
    if (!supabase) return;

    const readyTimer = window.setTimeout(() => {
      readyRef.current = true;
    }, 800);

    const channel = supabase
      .channel("orders-dashboard")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const row = payload.new as OrderRow;
          if (row.is_read) return;
          if (seenIdsRef.current.has(row.id)) return;

          seenIdsRef.current.add(row.id);
          if (!readyRef.current) return;

          onInsertRef.current(mapOrderRow(row));
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const row = payload.new as OrderRow;
          if (row.is_read) {
            onMarkReadRef.current(row.id);
          }
        }
      )
      .subscribe();

    return () => {
      window.clearTimeout(readyTimer);
      void supabase.removeChannel(channel);
    };
  }, []);
}
