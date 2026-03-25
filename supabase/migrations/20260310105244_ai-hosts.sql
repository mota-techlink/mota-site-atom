drop view if exists "public"."logistics_order_view";

drop view if exists "public"."order_details_view";

drop view if exists "public"."pending_crypto_payments";


  create table "public"."ai_host_tokens" (
    "id" uuid not null default gen_random_uuid(),
    "ai_host_id" uuid not null,
    "token_hash" text not null,
    "scopes" text[] not null default '{}'::text[],
    "expires_at" timestamp with time zone not null,
    "revoked_at" timestamp with time zone,
    "last_used_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."ai_host_tokens" enable row level security;


  create table "public"."ai_hosts" (
    "id" uuid not null default gen_random_uuid(),
    "client_id" text not null,
    "display_name" text not null,
    "tenant_id" text not null,
    "auth_mode" text not null default 'client_credentials'::text,
    "status" text not null default 'active'::text,
    "allowed_tools" text[] not null default '{}'::text[],
    "allowed_roles" text[] not null default '{member,staff,admin}'::text[],
    "scopes" text[] not null default '{mcp:tools:list,mcp:tools:call}'::text[],
    "client_secret_hash" text,
    "metadata" jsonb,
    "last_used_at" timestamp with time zone,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."ai_hosts" enable row level security;

CREATE INDEX ai_host_tokens_expires_idx ON public.ai_host_tokens USING btree (expires_at);

CREATE INDEX ai_host_tokens_host_idx ON public.ai_host_tokens USING btree (ai_host_id);

CREATE UNIQUE INDEX ai_host_tokens_pkey ON public.ai_host_tokens USING btree (id);

CREATE UNIQUE INDEX ai_host_tokens_token_hash_key ON public.ai_host_tokens USING btree (token_hash);

CREATE UNIQUE INDEX ai_hosts_client_id_key ON public.ai_hosts USING btree (client_id);

CREATE UNIQUE INDEX ai_hosts_pkey ON public.ai_hosts USING btree (id);

CREATE INDEX ai_hosts_status_idx ON public.ai_hosts USING btree (status);

CREATE INDEX ai_hosts_tenant_idx ON public.ai_hosts USING btree (tenant_id);

alter table "public"."ai_host_tokens" add constraint "ai_host_tokens_pkey" PRIMARY KEY using index "ai_host_tokens_pkey";

alter table "public"."ai_hosts" add constraint "ai_hosts_pkey" PRIMARY KEY using index "ai_hosts_pkey";

alter table "public"."ai_host_tokens" add constraint "ai_host_tokens_ai_host_id_fkey" FOREIGN KEY (ai_host_id) REFERENCES public.ai_hosts(id) ON DELETE CASCADE not valid;

alter table "public"."ai_host_tokens" validate constraint "ai_host_tokens_ai_host_id_fkey";

alter table "public"."ai_host_tokens" add constraint "ai_host_tokens_token_hash_key" UNIQUE using index "ai_host_tokens_token_hash_key";

alter table "public"."ai_hosts" add constraint "ai_hosts_auth_mode_check" CHECK ((auth_mode = ANY (ARRAY['client_credentials'::text, 'bearer_jwt'::text]))) not valid;

alter table "public"."ai_hosts" validate constraint "ai_hosts_auth_mode_check";

alter table "public"."ai_hosts" add constraint "ai_hosts_client_id_key" UNIQUE using index "ai_hosts_client_id_key";

alter table "public"."ai_hosts" add constraint "ai_hosts_status_check" CHECK ((status = ANY (ARRAY['active'::text, 'disabled'::text]))) not valid;

alter table "public"."ai_hosts" validate constraint "ai_hosts_status_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_expired_payments()
 RETURNS TABLE(expired_order_count integer)
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_count INT;
BEGIN
  UPDATE orders
  SET status = 'payment_expired'
  WHERE payment_provider = 'crypto'
    AND status = 'pending_payment'
    AND payment_expires_at < CURRENT_TIMESTAMP;
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  
  RETURN QUERY SELECT v_count;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select role = 'admin' from public.profiles where id = uid;
$function$
;

CREATE OR REPLACE FUNCTION public.is_staff_or_admin(uid uuid)
 RETURNS boolean
 LANGUAGE sql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  select role in ('staff','admin') from public.profiles where id = uid;
$function$
;

create or replace view "public"."logistics_order_view" as  SELECT o.id,
    o.order_number,
    o.user_id,
    o.customer_email,
    o.product_name,
    o.amount_total,
    o.currency,
    o.status,
    o.payment_provider,
    o.tracking_number,
    o.created_at,
    sf.leg_sequence,
    sf.weight_kg,
    f.flight_no,
    f.origin_code,
    f.dest_code,
    f.std,
    f.sta,
    f.status AS flight_status,
    fl.model AS aircraft_model,
    fl.payload_capacity_ton
   FROM (((public.orders o
     LEFT JOIN public.shipment_flights sf ON ((sf.order_id = o.id)))
     LEFT JOIN public.flights f ON ((f.id = sf.flight_id)))
     LEFT JOIN public.fleet fl ON ((fl.id = f.fleet_id)))
  WHERE (o.product_slug = 'freight-ehu'::text)
  ORDER BY o.created_at DESC, sf.leg_sequence;


create or replace view "public"."order_details_view" as  SELECT o.id,
    o.created_at,
    o.updated_at,
    o.user_id,
    o.customer_email,
    o.customer_phone,
    o.order_number,
    o.product_name,
    o.tier_name,
    o.amount_total,
    o.currency,
    o.status,
    o.payment_provider,
    o.payment_method_details,
    o.shipping_method,
    o.actual_delivery_date,
    o.product_slug,
    o.coinbase_charge_id,
    o.crypto_address,
    o.crypto_type,
    o.crypto_amount,
    o.payment_expires_at,
    o.payment_confirmed_at,
    o.payment_metadata,
    p.provider AS payment_provider_detail,
    COALESCE(p.transaction_id, o.payment_transaction_id) AS payment_transaction_id,
    p.status AS payment_status,
    p.amount_paid,
    p.currency AS payment_currency,
    p.payment_method,
    p.paid_at,
    s.carrier AS shipping_carrier,
    COALESCE(s.tracking_number, o.tracking_number) AS tracking_number,
    COALESCE(s.shipping_address, o.shipping_address) AS shipping_address,
    s.shipped_at,
    s.delivered_at,
    COALESCE(s.estimated_delivery_date, o.expected_delivery_date) AS expected_delivery_date,
    s.notes AS shipping_notes
   FROM ((public.orders o
     LEFT JOIN public.order_payment_details p ON ((p.order_id = o.id)))
     LEFT JOIN public.order_shipping s ON ((s.order_id = o.id)));


create or replace view "public"."pending_crypto_payments" as  SELECT id AS order_id,
    user_id,
    coinbase_charge_id,
    crypto_type,
    crypto_amount,
    payment_expires_at,
    created_at,
    (payment_expires_at - CURRENT_TIMESTAMP) AS time_remaining,
        CASE
            WHEN (payment_expires_at < CURRENT_TIMESTAMP) THEN 'expired'::text
            WHEN (payment_expires_at < (CURRENT_TIMESTAMP + '00:05:00'::interval)) THEN 'expiring_soon'::text
            ELSE 'pending'::text
        END AS urgency
   FROM public.orders o
  WHERE ((payment_provider = 'crypto'::public.payment_provider) AND (payment_confirmed_at IS NULL) AND (coinbase_charge_id IS NOT NULL) AND (payment_expires_at > CURRENT_TIMESTAMP))
  ORDER BY payment_expires_at;


grant delete on table "public"."ai_host_tokens" to "service_role";

grant insert on table "public"."ai_host_tokens" to "service_role";

grant references on table "public"."ai_host_tokens" to "service_role";

grant select on table "public"."ai_host_tokens" to "service_role";

grant trigger on table "public"."ai_host_tokens" to "service_role";

grant truncate on table "public"."ai_host_tokens" to "service_role";

grant update on table "public"."ai_host_tokens" to "service_role";

grant delete on table "public"."ai_hosts" to "service_role";

grant insert on table "public"."ai_hosts" to "service_role";

grant references on table "public"."ai_hosts" to "service_role";

grant select on table "public"."ai_hosts" to "service_role";

grant trigger on table "public"."ai_hosts" to "service_role";

grant truncate on table "public"."ai_hosts" to "service_role";

grant update on table "public"."ai_hosts" to "service_role";

grant delete on table "public"."order_payment_details" to "postgres";

grant insert on table "public"."order_payment_details" to "postgres";

grant references on table "public"."order_payment_details" to "postgres";

grant select on table "public"."order_payment_details" to "postgres";

grant trigger on table "public"."order_payment_details" to "postgres";

grant truncate on table "public"."order_payment_details" to "postgres";

grant update on table "public"."order_payment_details" to "postgres";

grant delete on table "public"."order_shipping" to "postgres";

grant insert on table "public"."order_shipping" to "postgres";

grant references on table "public"."order_shipping" to "postgres";

grant select on table "public"."order_shipping" to "postgres";

grant trigger on table "public"."order_shipping" to "postgres";

grant truncate on table "public"."order_shipping" to "postgres";

grant update on table "public"."order_shipping" to "postgres";

grant delete on table "public"."orders" to "postgres";

grant insert on table "public"."orders" to "postgres";

grant references on table "public"."orders" to "postgres";

grant select on table "public"."orders" to "postgres";

grant trigger on table "public"."orders" to "postgres";

grant truncate on table "public"."orders" to "postgres";

grant update on table "public"."orders" to "postgres";

grant delete on table "public"."payment_history" to "postgres";

grant insert on table "public"."payment_history" to "postgres";

grant references on table "public"."payment_history" to "postgres";

grant select on table "public"."payment_history" to "postgres";

grant trigger on table "public"."payment_history" to "postgres";

grant truncate on table "public"."payment_history" to "postgres";

grant update on table "public"."payment_history" to "postgres";

grant delete on table "public"."profiles" to "postgres";

grant insert on table "public"."profiles" to "postgres";

grant references on table "public"."profiles" to "postgres";

grant select on table "public"."profiles" to "postgres";

grant trigger on table "public"."profiles" to "postgres";

grant truncate on table "public"."profiles" to "postgres";

grant update on table "public"."profiles" to "postgres";

grant delete on table "public"."subscriptions" to "postgres";

grant insert on table "public"."subscriptions" to "postgres";

grant references on table "public"."subscriptions" to "postgres";

grant select on table "public"."subscriptions" to "postgres";

grant trigger on table "public"."subscriptions" to "postgres";

grant truncate on table "public"."subscriptions" to "postgres";

grant update on table "public"."subscriptions" to "postgres";

grant delete on table "public"."x402_payments" to "postgres";

grant insert on table "public"."x402_payments" to "postgres";

grant references on table "public"."x402_payments" to "postgres";

grant select on table "public"."x402_payments" to "postgres";

grant trigger on table "public"."x402_payments" to "postgres";

grant truncate on table "public"."x402_payments" to "postgres";

grant update on table "public"."x402_payments" to "postgres";


