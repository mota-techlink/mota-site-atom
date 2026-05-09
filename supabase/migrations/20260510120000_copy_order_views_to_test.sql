drop view if exists "test"."logistics_order_view";
drop view if exists "test"."order_details_view";
drop view if exists "test"."pending_crypto_payments";

create or replace view "test"."logistics_order_view" as  SELECT o.id,
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
   FROM (((test.orders o
     LEFT JOIN test.shipment_flights sf ON ((sf.order_id = o.id)))
     LEFT JOIN test.flights f ON ((f.id = sf.flight_id)))
     LEFT JOIN test.fleet fl ON ((fl.id = f.fleet_id)))
  WHERE (o.product_slug = 'freight-ehu'::text)
  ORDER BY o.created_at DESC, sf.leg_sequence;

create or replace view "test"."order_details_view" as  SELECT o.id,
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
   FROM ((test.orders o
     LEFT JOIN test.order_payment_details p ON ((p.order_id = o.id)))
     LEFT JOIN test.order_shipping s ON ((s.order_id = o.id)));

create or replace view "test"."pending_crypto_payments" as  SELECT id AS order_id,
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
   FROM test.orders o
  WHERE ((payment_provider = 'crypto'::public.payment_provider) AND (payment_confirmed_at IS NULL) AND (coinbase_charge_id IS NOT NULL) AND (payment_expires_at > CURRENT_TIMESTAMP))
  ORDER BY payment_expires_at;

grant select on table "test"."logistics_order_view" to anon;
grant select on table "test"."logistics_order_view" to authenticated;
grant select on table "test"."logistics_order_view" to service_role;

grant select on table "test"."order_details_view" to anon;
grant select on table "test"."order_details_view" to authenticated;
grant select on table "test"."order_details_view" to service_role;

grant select on table "test"."pending_crypto_payments" to anon;
grant select on table "test"."pending_crypto_payments" to authenticated;
grant select on table "test"."pending_crypto_payments" to service_role;