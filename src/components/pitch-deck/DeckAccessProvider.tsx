"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { DeckAccess } from "@/config/pitch-decks";
import { DEFAULT_PREVIEW_SLIDES } from "@/config/pitch-decks";
import type { User } from "@supabase/supabase-js";

// ─── Types ────────────────────────────────────────────────────────────────────
export type UserTier = "anon" | "user" | "admin";

export interface DeckAccessCtx {
  /** Current effective user tier */
  userTier: UserTier;
  /** The access level required by this deck */
  access: DeckAccess;
  /** Number of preview (free) slides */
  previewSlides: number;
  /** Total number of slides in the deck */
  totalSlides: number;
  /** Whether the user can view a given slide index (0-based) */
  canView: (idx: number) => boolean;
  /** Whether the login-gate overlay is visible */
  gateOpen: boolean;
  /** Show the login gate */
  showGate: () => void;
  /** Hide the login gate */
  hideGate: () => void;
  /** True while the initial auth check is in progress */
  loading: boolean;
  /** The supabase user object (null if anonymous) */
  user: User | null;
}

const Ctx = createContext<DeckAccessCtx | null>(null);

export function useDeckAccess() {
  const ctx = useContext(Ctx);
  if (!ctx)
    throw new Error("useDeckAccess must be used within <DeckAccessProvider>");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────
interface Props {
  children: ReactNode;
  /** Access level from meta.json — defaults to "admin" */
  access?: DeckAccess;
  /** Preview slide count — defaults to DEFAULT_PREVIEW_SLIDES (3) */
  previewSlides?: number;
  /** Total slides in this deck */
  totalSlides: number;
  /** Server-side pre-check (optional optimistic hint) */
  serverAuth?: { isAuthenticated: boolean; role?: string };
}

export function DeckAccessProvider({
  children,
  access = "admin",
  previewSlides = DEFAULT_PREVIEW_SLIDES,
  totalSlides,
  serverAuth,
}: Props) {
  // ── Auth state ──────────────────────────────────────────
  const [user, setUser] = useState<User | null>(null);
  const [userTier, setUserTier] = useState<UserTier>(() => {
    // Optimistic init from server hint
    if (serverAuth?.isAuthenticated) {
      return serverAuth.role === "admin" || serverAuth.role === "staff"
        ? "admin"
        : "user";
    }
    return "anon";
  });
  const [loading, setLoading] = useState(!serverAuth);
  const [gateOpen, setGateOpen] = useState(false);

  // Fetch user + role on mount and subscribe to auth changes
  useEffect(() => {
    const supabase = createClient();

    const resolve = async (sbUser: User | null) => {
      if (!sbUser) {
        setUser(null);
        setUserTier("anon");
        return;
      }
      setUser(sbUser);

      // Fetch role from profiles
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", sbUser.id)
        .single();

      const role = profile?.role;
      if (role === "admin" || role === "staff") {
        setUserTier("admin");
      } else {
        setUserTier("user");
      }
    };

    // Initial check
    supabase.auth
      .getUser()
      .then(({ data: { user: u } }) => resolve(u))
      .finally(() => setLoading(false));

    // Subscribe
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      resolve(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  // ── Access logic ────────────────────────────────────────
  // For public decks, previewSlides is irrelevant — all slides are visible
  const effectivePreview = access === "public" ? totalSlides : previewSlides;

  const canView = useCallback(
    (idx: number): boolean => {
      // Public decks — everyone can view all slides (ignore previewSlides)
      if (access === "public") return true;
      // User-level decks — logged-in users can view all
      if (access === "user" && (userTier === "user" || userTier === "admin"))
        return true;
      // Admin-level decks — only admin/staff
      if (access === "admin" && userTier === "admin") return true;
      // Otherwise only preview slides are accessible
      return idx < effectivePreview;
    },
    [access, userTier, effectivePreview],
  );

  const showGate = useCallback(() => setGateOpen(true), []);
  const hideGate = useCallback(() => setGateOpen(false), []);

  const value = useMemo<DeckAccessCtx>(
    () => ({
      userTier,
      access,
      previewSlides: effectivePreview,
      totalSlides,
      canView,
      gateOpen,
      showGate,
      hideGate,
      loading,
      user,
    }),
    [
      userTier,
      access,
      effectivePreview,
      totalSlides,
      canView,
      gateOpen,
      showGate,
      hideGate,
      loading,
      user,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
