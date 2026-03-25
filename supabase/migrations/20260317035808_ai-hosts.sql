revoke delete on table "public"."ai_host_tokens" from "anon";

revoke insert on table "public"."ai_host_tokens" from "anon";

revoke references on table "public"."ai_host_tokens" from "anon";

revoke select on table "public"."ai_host_tokens" from "anon";

revoke trigger on table "public"."ai_host_tokens" from "anon";

revoke truncate on table "public"."ai_host_tokens" from "anon";

revoke update on table "public"."ai_host_tokens" from "anon";

revoke delete on table "public"."ai_host_tokens" from "authenticated";

revoke insert on table "public"."ai_host_tokens" from "authenticated";

revoke references on table "public"."ai_host_tokens" from "authenticated";

revoke select on table "public"."ai_host_tokens" from "authenticated";

revoke trigger on table "public"."ai_host_tokens" from "authenticated";

revoke truncate on table "public"."ai_host_tokens" from "authenticated";

revoke update on table "public"."ai_host_tokens" from "authenticated";

revoke delete on table "public"."ai_hosts" from "anon";

revoke insert on table "public"."ai_hosts" from "anon";

revoke references on table "public"."ai_hosts" from "anon";

revoke select on table "public"."ai_hosts" from "anon";

revoke trigger on table "public"."ai_hosts" from "anon";

revoke truncate on table "public"."ai_hosts" from "anon";

revoke update on table "public"."ai_hosts" from "anon";

revoke delete on table "public"."ai_hosts" from "authenticated";

revoke insert on table "public"."ai_hosts" from "authenticated";

revoke references on table "public"."ai_hosts" from "authenticated";

revoke select on table "public"."ai_hosts" from "authenticated";

revoke trigger on table "public"."ai_hosts" from "authenticated";

revoke truncate on table "public"."ai_hosts" from "authenticated";

revoke update on table "public"."ai_hosts" from "authenticated";

drop view if exists "public"."logistics_order_view";

drop view if exists "public"."order_details_view";

drop view if exists "public"."pending_crypto_payments";


  create table "public"."activity_logs" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "action" character varying(100) not null,
    "entity_type" character varying(50) not null,
    "entity_id" uuid not null,
    "details" jsonb,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."activity_logs" enable row level security;


  create table "public"."buildings" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" character varying(300) not null,
    "address" text not null,
    "city" character varying(100) not null,
    "total_units" integer not null default 0,
    "floors" integer not null default 1,
    "year_built" integer,
    "description" text,
    "status" character varying(20) default 'active'::character varying,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."buildings" enable row level security;


  create table "public"."collections" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "contract_id" uuid not null,
    "payment_id" uuid,
    "total_overdue" numeric(12,2) not null,
    "days_overdue" integer not null default 0,
    "stage" character varying(20) default 'reminder'::character varying,
    "legal_case_number" character varying(100),
    "assigned_to" uuid,
    "notes" text,
    "resolved_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."collections" enable row level security;


  create table "public"."contracts" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "unit_id" uuid not null,
    "tenant_id" uuid not null,
    "contract_number" character varying(100) not null,
    "start_date" date not null,
    "end_date" date not null,
    "monthly_rent" numeric(12,2) not null,
    "deposit_amount" numeric(12,2) not null default 0,
    "deposit_paid" boolean default false,
    "renovation_deadline" date,
    "status" character varying(20) default 'draft'::character varying,
    "signed_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."contracts" enable row level security;


  create table "public"."departments" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" character varying(200) not null,
    "description" text,
    "parent_id" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."departments" enable row level security;


  create table "public"."emergencies" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "building_id" uuid not null,
    "unit_id" uuid,
    "reported_by" uuid not null,
    "type" character varying(20) not null,
    "title" character varying(300) not null,
    "description" text not null,
    "severity" character varying(10) default 'medium'::character varying,
    "status" character varying(20) default 'reported'::character varying,
    "assigned_to" uuid,
    "resolved_at" timestamp with time zone,
    "resolution_notes" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."emergencies" enable row level security;


  create table "public"."iot_devices" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "building_id" uuid not null,
    "unit_id" uuid,
    "device_type" character varying(20) not null,
    "name" character varying(200) not null,
    "status" character varying(10) default 'online'::character varying,
    "last_reading" jsonb,
    "last_ping" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."iot_devices" enable row level security;


  create table "public"."maintenance_requests" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "unit_id" uuid not null,
    "reported_by" uuid not null,
    "title" character varying(300) not null,
    "description" text not null,
    "priority" character varying(10) default 'medium'::character varying,
    "category" character varying(100) not null,
    "status" character varying(20) default 'open'::character varying,
    "assigned_to" uuid,
    "estimated_cost" numeric(12,2),
    "actual_cost" numeric(12,2),
    "scheduled_date" date,
    "completed_date" date,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."maintenance_requests" enable row level security;


  create table "public"."move_outs" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "contract_id" uuid not null,
    "request_date" date not null,
    "planned_date" date not null,
    "actual_date" date,
    "inspection_status" character varying(20) default 'pending'::character varying,
    "inspection_notes" text,
    "deposit_deduction" numeric(12,2) default 0,
    "deposit_refund" numeric(12,2) default 0,
    "approval_status" character varying(20) default 'pending'::character varying,
    "approved_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."move_outs" enable row level security;


  create table "public"."murao_activity_logs" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "user_id" uuid,
    "action" character varying(100) not null,
    "entity_type" character varying(50) not null,
    "entity_id" uuid not null,
    "details" jsonb,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."murao_activity_logs" enable row level security;


  create table "public"."murao_buildings" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" character varying(300) not null,
    "address" text not null,
    "city" character varying(100) not null,
    "total_units" integer not null default 0,
    "floors" integer not null default 1,
    "year_built" integer,
    "description" text,
    "status" character varying(20) default 'active'::character varying,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "latitude" numeric(10,7),
    "longitude" numeric(11,7)
      );


alter table "public"."murao_buildings" enable row level security;


  create table "public"."murao_chat_sessions" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "title" text default 'New Chat'::text,
    "messages" jsonb default '[]'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );



  create table "public"."murao_collections" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "contract_id" uuid not null,
    "payment_id" uuid,
    "total_overdue" numeric(12,2) not null,
    "days_overdue" integer not null default 0,
    "stage" character varying(20) default 'reminder'::character varying,
    "legal_case_number" character varying(100),
    "assigned_to" uuid,
    "notes" text,
    "resolved_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."murao_collections" enable row level security;


  create table "public"."murao_contracts" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "unit_id" uuid not null,
    "tenant_id" uuid not null,
    "contract_number" character varying(100) not null,
    "start_date" date not null,
    "end_date" date not null,
    "monthly_rent" numeric(12,2) not null,
    "deposit_amount" numeric(12,2) not null default 0,
    "deposit_paid" boolean default false,
    "renovation_deadline" date,
    "status" character varying(20) default 'draft'::character varying,
    "signed_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."murao_contracts" enable row level security;


  create table "public"."murao_departments" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" character varying(200) not null,
    "description" text,
    "parent_id" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."murao_departments" enable row level security;


  create table "public"."murao_embeddings" (
    "id" uuid not null default gen_random_uuid(),
    "content" text not null,
    "metadata" jsonb default '{}'::jsonb,
    "entity_type" text not null,
    "entity_id" uuid,
    "embedding" extensions.vector(768),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );



  create table "public"."murao_emergencies" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "building_id" uuid not null,
    "unit_id" uuid,
    "reported_by" uuid not null,
    "type" character varying(20) not null,
    "title" character varying(300) not null,
    "description" text not null,
    "severity" character varying(10) default 'medium'::character varying,
    "status" character varying(20) default 'reported'::character varying,
    "assigned_to" uuid,
    "resolved_at" timestamp with time zone,
    "resolution_notes" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."murao_emergencies" enable row level security;


  create table "public"."murao_iot_devices" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "building_id" uuid not null,
    "unit_id" uuid,
    "device_type" character varying(20) not null,
    "name" character varying(200) not null,
    "status" character varying(10) default 'online'::character varying,
    "last_reading" jsonb,
    "last_ping" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."murao_iot_devices" enable row level security;


  create table "public"."murao_maintenance_requests" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "unit_id" uuid not null,
    "reported_by" uuid not null,
    "title" character varying(300) not null,
    "description" text not null,
    "priority" character varying(10) default 'medium'::character varying,
    "category" character varying(100) not null,
    "status" character varying(20) default 'open'::character varying,
    "assigned_to" uuid,
    "estimated_cost" numeric(12,2),
    "actual_cost" numeric(12,2),
    "scheduled_date" date,
    "completed_date" date,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."murao_maintenance_requests" enable row level security;


  create table "public"."murao_move_outs" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "contract_id" uuid not null,
    "request_date" date not null,
    "planned_date" date not null,
    "actual_date" date,
    "inspection_status" character varying(20) default 'pending'::character varying,
    "inspection_notes" text,
    "deposit_deduction" numeric(12,2) default 0,
    "deposit_refund" numeric(12,2) default 0,
    "approval_status" character varying(20) default 'pending'::character varying,
    "approved_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."murao_move_outs" enable row level security;


  create table "public"."murao_payments" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "contract_id" uuid not null,
    "amount" numeric(12,2) not null,
    "due_date" date not null,
    "paid_date" date,
    "payment_method" character varying(20),
    "status" character varying(20) default 'pending'::character varying,
    "reference_number" character varying(100),
    "notes" text,
    "recorded_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."murao_payments" enable row level security;


  create table "public"."murao_roles" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" character varying(100) not null,
    "description" text,
    "permissions" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."murao_roles" enable row level security;


  create table "public"."murao_tasks" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "parent_id" uuid,
    "title" character varying(300) not null,
    "description" text,
    "status" character varying(20) default 'planned'::character varying,
    "priority" character varying(10) default 'medium'::character varying,
    "assigned_to" uuid,
    "created_by" uuid not null,
    "due_date" date,
    "completed_at" timestamp with time zone,
    "related_type" character varying(50),
    "related_id" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."murao_tasks" enable row level security;


  create table "public"."murao_tenants" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "full_name" character varying(200) not null,
    "email" character varying(255),
    "phone" character varying(50) not null,
    "id_number" character varying(100),
    "company_name" character varying(300),
    "emergency_contact" character varying(200),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."murao_tenants" enable row level security;


  create table "public"."murao_units" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "building_id" uuid not null,
    "unit_number" character varying(50) not null,
    "floor" integer not null,
    "area_sqm" numeric(10,2) not null,
    "rooms" integer not null default 1,
    "rent_amount" numeric(12,2) not null,
    "status" character varying(20) default 'vacant'::character varying,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."murao_units" enable row level security;


  create table "public"."murao_users" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "auth_id" uuid not null,
    "email" character varying(255) not null,
    "full_name" character varying(200) not null,
    "phone" character varying(50),
    "avatar_url" text,
    "role_id" uuid not null,
    "department_id" uuid,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."murao_users" enable row level security;


  create table "public"."payments" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "contract_id" uuid not null,
    "amount" numeric(12,2) not null,
    "due_date" date not null,
    "paid_date" date,
    "payment_method" character varying(20),
    "status" character varying(20) default 'pending'::character varying,
    "reference_number" character varying(100),
    "notes" text,
    "recorded_by" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."payments" enable row level security;


  create table "public"."roles" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "name" character varying(100) not null,
    "description" text,
    "permissions" jsonb default '{}'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."roles" enable row level security;


  create table "public"."tasks" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "parent_id" uuid,
    "title" character varying(300) not null,
    "description" text,
    "status" character varying(20) default 'planned'::character varying,
    "priority" character varying(10) default 'medium'::character varying,
    "assigned_to" uuid,
    "created_by" uuid not null,
    "due_date" date,
    "completed_at" timestamp with time zone,
    "related_type" character varying(50),
    "related_id" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."tasks" enable row level security;


  create table "public"."tenants" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "full_name" character varying(200) not null,
    "email" character varying(255),
    "phone" character varying(50) not null,
    "id_number" character varying(100),
    "company_name" character varying(300),
    "emergency_contact" character varying(200),
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."tenants" enable row level security;


  create table "public"."units" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "building_id" uuid not null,
    "unit_number" character varying(50) not null,
    "floor" integer not null,
    "area_sqm" numeric(10,2) not null,
    "rooms" integer not null default 1,
    "rent_amount" numeric(12,2) not null,
    "status" character varying(20) default 'vacant'::character varying,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."units" enable row level security;


  create table "public"."users" (
    "id" uuid not null default extensions.uuid_generate_v4(),
    "auth_id" uuid not null,
    "email" character varying(255) not null,
    "full_name" character varying(200) not null,
    "phone" character varying(50),
    "avatar_url" text,
    "role_id" uuid not null,
    "department_id" uuid,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."users" enable row level security;

CREATE UNIQUE INDEX activity_logs_pkey ON public.activity_logs USING btree (id);

CREATE UNIQUE INDEX buildings_pkey ON public.buildings USING btree (id);

CREATE UNIQUE INDEX collections_pkey ON public.collections USING btree (id);

CREATE UNIQUE INDEX contracts_contract_number_key ON public.contracts USING btree (contract_number);

CREATE UNIQUE INDEX contracts_pkey ON public.contracts USING btree (id);

CREATE UNIQUE INDEX departments_pkey ON public.departments USING btree (id);

CREATE UNIQUE INDEX emergencies_pkey ON public.emergencies USING btree (id);

CREATE INDEX idx_activity_entity ON public.activity_logs USING btree (entity_type, entity_id);

CREATE INDEX idx_activity_user ON public.activity_logs USING btree (user_id);

CREATE INDEX idx_collections_contract ON public.collections USING btree (contract_id);

CREATE INDEX idx_collections_stage ON public.collections USING btree (stage);

CREATE INDEX idx_contracts_status ON public.contracts USING btree (status);

CREATE INDEX idx_contracts_tenant ON public.contracts USING btree (tenant_id);

CREATE INDEX idx_contracts_unit ON public.contracts USING btree (unit_id);

CREATE INDEX idx_emergencies_building ON public.emergencies USING btree (building_id);

CREATE INDEX idx_emergencies_severity ON public.emergencies USING btree (severity);

CREATE INDEX idx_emergencies_status ON public.emergencies USING btree (status);

CREATE INDEX idx_iot_building ON public.iot_devices USING btree (building_id);

CREATE INDEX idx_maintenance_status ON public.maintenance_requests USING btree (status);

CREATE INDEX idx_maintenance_unit ON public.maintenance_requests USING btree (unit_id);

CREATE INDEX idx_move_outs_contract ON public.move_outs USING btree (contract_id);

CREATE INDEX idx_murao_activity_entity ON public.murao_activity_logs USING btree (entity_type, entity_id);

CREATE INDEX idx_murao_activity_user ON public.murao_activity_logs USING btree (user_id);

CREATE INDEX idx_murao_collections_contract ON public.murao_collections USING btree (contract_id);

CREATE INDEX idx_murao_collections_stage ON public.murao_collections USING btree (stage);

CREATE INDEX idx_murao_contracts_status ON public.murao_contracts USING btree (status);

CREATE INDEX idx_murao_contracts_tenant ON public.murao_contracts USING btree (tenant_id);

CREATE INDEX idx_murao_contracts_unit ON public.murao_contracts USING btree (unit_id);

CREATE INDEX idx_murao_embeddings_entity ON public.murao_embeddings USING btree (entity_type, entity_id);

CREATE INDEX idx_murao_embeddings_vector ON public.murao_embeddings USING ivfflat (embedding extensions.vector_cosine_ops) WITH (lists='100');

CREATE INDEX idx_murao_emergencies_building ON public.murao_emergencies USING btree (building_id);

CREATE INDEX idx_murao_emergencies_severity ON public.murao_emergencies USING btree (severity);

CREATE INDEX idx_murao_emergencies_status ON public.murao_emergencies USING btree (status);

CREATE INDEX idx_murao_iot_building ON public.murao_iot_devices USING btree (building_id);

CREATE INDEX idx_murao_maintenance_status ON public.murao_maintenance_requests USING btree (status);

CREATE INDEX idx_murao_maintenance_unit ON public.murao_maintenance_requests USING btree (unit_id);

CREATE INDEX idx_murao_move_outs_contract ON public.murao_move_outs USING btree (contract_id);

CREATE INDEX idx_murao_payments_contract ON public.murao_payments USING btree (contract_id);

CREATE INDEX idx_murao_payments_due ON public.murao_payments USING btree (due_date);

CREATE INDEX idx_murao_payments_status ON public.murao_payments USING btree (status);

CREATE INDEX idx_murao_tasks_assigned ON public.murao_tasks USING btree (assigned_to);

CREATE INDEX idx_murao_tasks_parent ON public.murao_tasks USING btree (parent_id);

CREATE INDEX idx_murao_tasks_status ON public.murao_tasks USING btree (status);

CREATE INDEX idx_murao_units_building ON public.murao_units USING btree (building_id);

CREATE INDEX idx_murao_units_status ON public.murao_units USING btree (status);

CREATE INDEX idx_murao_users_department ON public.murao_users USING btree (department_id);

CREATE INDEX idx_murao_users_role ON public.murao_users USING btree (role_id);

CREATE INDEX idx_payments_contract ON public.payments USING btree (contract_id);

CREATE INDEX idx_payments_due_date ON public.payments USING btree (due_date);

CREATE INDEX idx_payments_status ON public.payments USING btree (status);

CREATE INDEX idx_tasks_assigned ON public.tasks USING btree (assigned_to);

CREATE INDEX idx_tasks_parent ON public.tasks USING btree (parent_id);

CREATE INDEX idx_tasks_status ON public.tasks USING btree (status);

CREATE INDEX idx_units_building ON public.units USING btree (building_id);

CREATE INDEX idx_units_status ON public.units USING btree (status);

CREATE INDEX idx_users_department ON public.users USING btree (department_id);

CREATE INDEX idx_users_role ON public.users USING btree (role_id);

CREATE UNIQUE INDEX iot_devices_pkey ON public.iot_devices USING btree (id);

CREATE UNIQUE INDEX maintenance_requests_pkey ON public.maintenance_requests USING btree (id);

CREATE UNIQUE INDEX move_outs_pkey ON public.move_outs USING btree (id);

CREATE UNIQUE INDEX murao_activity_logs_pkey ON public.murao_activity_logs USING btree (id);

CREATE UNIQUE INDEX murao_buildings_pkey ON public.murao_buildings USING btree (id);

CREATE UNIQUE INDEX murao_chat_sessions_pkey ON public.murao_chat_sessions USING btree (id);

CREATE UNIQUE INDEX murao_collections_pkey ON public.murao_collections USING btree (id);

CREATE UNIQUE INDEX murao_contracts_contract_number_key ON public.murao_contracts USING btree (contract_number);

CREATE UNIQUE INDEX murao_contracts_pkey ON public.murao_contracts USING btree (id);

CREATE UNIQUE INDEX murao_departments_pkey ON public.murao_departments USING btree (id);

CREATE UNIQUE INDEX murao_embeddings_pkey ON public.murao_embeddings USING btree (id);

CREATE UNIQUE INDEX murao_emergencies_pkey ON public.murao_emergencies USING btree (id);

CREATE UNIQUE INDEX murao_iot_devices_pkey ON public.murao_iot_devices USING btree (id);

CREATE UNIQUE INDEX murao_maintenance_requests_pkey ON public.murao_maintenance_requests USING btree (id);

CREATE UNIQUE INDEX murao_move_outs_pkey ON public.murao_move_outs USING btree (id);

CREATE UNIQUE INDEX murao_payments_pkey ON public.murao_payments USING btree (id);

CREATE UNIQUE INDEX murao_roles_name_key ON public.murao_roles USING btree (name);

CREATE UNIQUE INDEX murao_roles_pkey ON public.murao_roles USING btree (id);

CREATE UNIQUE INDEX murao_tasks_pkey ON public.murao_tasks USING btree (id);

CREATE UNIQUE INDEX murao_tenants_pkey ON public.murao_tenants USING btree (id);

CREATE UNIQUE INDEX murao_units_building_id_unit_number_key ON public.murao_units USING btree (building_id, unit_number);

CREATE UNIQUE INDEX murao_units_pkey ON public.murao_units USING btree (id);

CREATE UNIQUE INDEX murao_users_auth_id_key ON public.murao_users USING btree (auth_id);

CREATE UNIQUE INDEX murao_users_email_key ON public.murao_users USING btree (email);

CREATE UNIQUE INDEX murao_users_pkey ON public.murao_users USING btree (id);

CREATE UNIQUE INDEX payments_pkey ON public.payments USING btree (id);

CREATE UNIQUE INDEX roles_name_key ON public.roles USING btree (name);

CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (id);

CREATE UNIQUE INDEX tasks_pkey ON public.tasks USING btree (id);

CREATE UNIQUE INDEX tenants_pkey ON public.tenants USING btree (id);

CREATE UNIQUE INDEX units_building_id_unit_number_key ON public.units USING btree (building_id, unit_number);

CREATE UNIQUE INDEX units_pkey ON public.units USING btree (id);

CREATE UNIQUE INDEX users_auth_id_key ON public.users USING btree (auth_id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

CREATE UNIQUE INDEX users_pkey ON public.users USING btree (id);

alter table "public"."activity_logs" add constraint "activity_logs_pkey" PRIMARY KEY using index "activity_logs_pkey";

alter table "public"."buildings" add constraint "buildings_pkey" PRIMARY KEY using index "buildings_pkey";

alter table "public"."collections" add constraint "collections_pkey" PRIMARY KEY using index "collections_pkey";

alter table "public"."contracts" add constraint "contracts_pkey" PRIMARY KEY using index "contracts_pkey";

alter table "public"."departments" add constraint "departments_pkey" PRIMARY KEY using index "departments_pkey";

alter table "public"."emergencies" add constraint "emergencies_pkey" PRIMARY KEY using index "emergencies_pkey";

alter table "public"."iot_devices" add constraint "iot_devices_pkey" PRIMARY KEY using index "iot_devices_pkey";

alter table "public"."maintenance_requests" add constraint "maintenance_requests_pkey" PRIMARY KEY using index "maintenance_requests_pkey";

alter table "public"."move_outs" add constraint "move_outs_pkey" PRIMARY KEY using index "move_outs_pkey";

alter table "public"."murao_activity_logs" add constraint "murao_activity_logs_pkey" PRIMARY KEY using index "murao_activity_logs_pkey";

alter table "public"."murao_buildings" add constraint "murao_buildings_pkey" PRIMARY KEY using index "murao_buildings_pkey";

alter table "public"."murao_chat_sessions" add constraint "murao_chat_sessions_pkey" PRIMARY KEY using index "murao_chat_sessions_pkey";

alter table "public"."murao_collections" add constraint "murao_collections_pkey" PRIMARY KEY using index "murao_collections_pkey";

alter table "public"."murao_contracts" add constraint "murao_contracts_pkey" PRIMARY KEY using index "murao_contracts_pkey";

alter table "public"."murao_departments" add constraint "murao_departments_pkey" PRIMARY KEY using index "murao_departments_pkey";

alter table "public"."murao_embeddings" add constraint "murao_embeddings_pkey" PRIMARY KEY using index "murao_embeddings_pkey";

alter table "public"."murao_emergencies" add constraint "murao_emergencies_pkey" PRIMARY KEY using index "murao_emergencies_pkey";

alter table "public"."murao_iot_devices" add constraint "murao_iot_devices_pkey" PRIMARY KEY using index "murao_iot_devices_pkey";

alter table "public"."murao_maintenance_requests" add constraint "murao_maintenance_requests_pkey" PRIMARY KEY using index "murao_maintenance_requests_pkey";

alter table "public"."murao_move_outs" add constraint "murao_move_outs_pkey" PRIMARY KEY using index "murao_move_outs_pkey";

alter table "public"."murao_payments" add constraint "murao_payments_pkey" PRIMARY KEY using index "murao_payments_pkey";

alter table "public"."murao_roles" add constraint "murao_roles_pkey" PRIMARY KEY using index "murao_roles_pkey";

alter table "public"."murao_tasks" add constraint "murao_tasks_pkey" PRIMARY KEY using index "murao_tasks_pkey";

alter table "public"."murao_tenants" add constraint "murao_tenants_pkey" PRIMARY KEY using index "murao_tenants_pkey";

alter table "public"."murao_units" add constraint "murao_units_pkey" PRIMARY KEY using index "murao_units_pkey";

alter table "public"."murao_users" add constraint "murao_users_pkey" PRIMARY KEY using index "murao_users_pkey";

alter table "public"."payments" add constraint "payments_pkey" PRIMARY KEY using index "payments_pkey";

alter table "public"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."tasks" add constraint "tasks_pkey" PRIMARY KEY using index "tasks_pkey";

alter table "public"."tenants" add constraint "tenants_pkey" PRIMARY KEY using index "tenants_pkey";

alter table "public"."units" add constraint "units_pkey" PRIMARY KEY using index "units_pkey";

alter table "public"."users" add constraint "users_pkey" PRIMARY KEY using index "users_pkey";

alter table "public"."activity_logs" add constraint "activity_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL not valid;

alter table "public"."activity_logs" validate constraint "activity_logs_user_id_fkey";

alter table "public"."buildings" add constraint "buildings_status_check" CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'maintenance'::character varying])::text[]))) not valid;

alter table "public"."buildings" validate constraint "buildings_status_check";

alter table "public"."collections" add constraint "collections_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON DELETE SET NULL not valid;

alter table "public"."collections" validate constraint "collections_assigned_to_fkey";

alter table "public"."collections" add constraint "collections_contract_id_fkey" FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE not valid;

alter table "public"."collections" validate constraint "collections_contract_id_fkey";

alter table "public"."collections" add constraint "collections_payment_id_fkey" FOREIGN KEY (payment_id) REFERENCES public.payments(id) ON DELETE SET NULL not valid;

alter table "public"."collections" validate constraint "collections_payment_id_fkey";

alter table "public"."collections" add constraint "collections_stage_check" CHECK (((stage)::text = ANY ((ARRAY['reminder'::character varying, 'warning'::character varying, 'final_notice'::character varying, 'legal'::character varying])::text[]))) not valid;

alter table "public"."collections" validate constraint "collections_stage_check";

alter table "public"."contracts" add constraint "contracts_contract_number_key" UNIQUE using index "contracts_contract_number_key";

alter table "public"."contracts" add constraint "contracts_signed_by_fkey" FOREIGN KEY (signed_by) REFERENCES public.users(id) ON DELETE SET NULL not valid;

alter table "public"."contracts" validate constraint "contracts_signed_by_fkey";

alter table "public"."contracts" add constraint "contracts_status_check" CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'active'::character varying, 'expiring'::character varying, 'terminated'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."contracts" validate constraint "contracts_status_check";

alter table "public"."contracts" add constraint "contracts_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE RESTRICT not valid;

alter table "public"."contracts" validate constraint "contracts_tenant_id_fkey";

alter table "public"."contracts" add constraint "contracts_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE RESTRICT not valid;

alter table "public"."contracts" validate constraint "contracts_unit_id_fkey";

alter table "public"."departments" add constraint "departments_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.departments(id) ON DELETE SET NULL not valid;

alter table "public"."departments" validate constraint "departments_parent_id_fkey";

alter table "public"."emergencies" add constraint "emergencies_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON DELETE SET NULL not valid;

alter table "public"."emergencies" validate constraint "emergencies_assigned_to_fkey";

alter table "public"."emergencies" add constraint "emergencies_building_id_fkey" FOREIGN KEY (building_id) REFERENCES public.buildings(id) ON DELETE CASCADE not valid;

alter table "public"."emergencies" validate constraint "emergencies_building_id_fkey";

alter table "public"."emergencies" add constraint "emergencies_reported_by_fkey" FOREIGN KEY (reported_by) REFERENCES public.users(id) ON DELETE RESTRICT not valid;

alter table "public"."emergencies" validate constraint "emergencies_reported_by_fkey";

alter table "public"."emergencies" add constraint "emergencies_severity_check" CHECK (((severity)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'critical'::character varying])::text[]))) not valid;

alter table "public"."emergencies" validate constraint "emergencies_severity_check";

alter table "public"."emergencies" add constraint "emergencies_status_check" CHECK (((status)::text = ANY ((ARRAY['reported'::character varying, 'responding'::character varying, 'resolved'::character varying, 'closed'::character varying])::text[]))) not valid;

alter table "public"."emergencies" validate constraint "emergencies_status_check";

alter table "public"."emergencies" add constraint "emergencies_type_check" CHECK (((type)::text = ANY ((ARRAY['power_outage'::character varying, 'water_leak'::character varying, 'theft'::character varying, 'fire'::character varying, 'elevator'::character varying, 'other'::character varying])::text[]))) not valid;

alter table "public"."emergencies" validate constraint "emergencies_type_check";

alter table "public"."emergencies" add constraint "emergencies_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE SET NULL not valid;

alter table "public"."emergencies" validate constraint "emergencies_unit_id_fkey";

alter table "public"."iot_devices" add constraint "iot_devices_building_id_fkey" FOREIGN KEY (building_id) REFERENCES public.buildings(id) ON DELETE CASCADE not valid;

alter table "public"."iot_devices" validate constraint "iot_devices_building_id_fkey";

alter table "public"."iot_devices" add constraint "iot_devices_device_type_check" CHECK (((device_type)::text = ANY ((ARRAY['camera'::character varying, 'water_meter'::character varying, 'power_meter'::character varying, 'elevator'::character varying, 'sensor'::character varying])::text[]))) not valid;

alter table "public"."iot_devices" validate constraint "iot_devices_device_type_check";

alter table "public"."iot_devices" add constraint "iot_devices_status_check" CHECK (((status)::text = ANY ((ARRAY['online'::character varying, 'offline'::character varying, 'warning'::character varying, 'error'::character varying])::text[]))) not valid;

alter table "public"."iot_devices" validate constraint "iot_devices_status_check";

alter table "public"."iot_devices" add constraint "iot_devices_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE SET NULL not valid;

alter table "public"."iot_devices" validate constraint "iot_devices_unit_id_fkey";

alter table "public"."maintenance_requests" add constraint "maintenance_requests_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON DELETE SET NULL not valid;

alter table "public"."maintenance_requests" validate constraint "maintenance_requests_assigned_to_fkey";

alter table "public"."maintenance_requests" add constraint "maintenance_requests_priority_check" CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))) not valid;

alter table "public"."maintenance_requests" validate constraint "maintenance_requests_priority_check";

alter table "public"."maintenance_requests" add constraint "maintenance_requests_reported_by_fkey" FOREIGN KEY (reported_by) REFERENCES public.users(id) ON DELETE RESTRICT not valid;

alter table "public"."maintenance_requests" validate constraint "maintenance_requests_reported_by_fkey";

alter table "public"."maintenance_requests" add constraint "maintenance_requests_status_check" CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'assigned'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."maintenance_requests" validate constraint "maintenance_requests_status_check";

alter table "public"."maintenance_requests" add constraint "maintenance_requests_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE CASCADE not valid;

alter table "public"."maintenance_requests" validate constraint "maintenance_requests_unit_id_fkey";

alter table "public"."move_outs" add constraint "move_outs_approval_status_check" CHECK (((approval_status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))) not valid;

alter table "public"."move_outs" validate constraint "move_outs_approval_status_check";

alter table "public"."move_outs" add constraint "move_outs_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES public.users(id) ON DELETE SET NULL not valid;

alter table "public"."move_outs" validate constraint "move_outs_approved_by_fkey";

alter table "public"."move_outs" add constraint "move_outs_contract_id_fkey" FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE not valid;

alter table "public"."move_outs" validate constraint "move_outs_contract_id_fkey";

alter table "public"."move_outs" add constraint "move_outs_inspection_status_check" CHECK (((inspection_status)::text = ANY ((ARRAY['pending'::character varying, 'scheduled'::character varying, 'completed'::character varying, 'failed'::character varying])::text[]))) not valid;

alter table "public"."move_outs" validate constraint "move_outs_inspection_status_check";

alter table "public"."murao_activity_logs" add constraint "murao_activity_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.murao_users(id) ON DELETE SET NULL not valid;

alter table "public"."murao_activity_logs" validate constraint "murao_activity_logs_user_id_fkey";

alter table "public"."murao_buildings" add constraint "murao_buildings_status_check" CHECK (((status)::text = ANY ((ARRAY['active'::character varying, 'inactive'::character varying, 'maintenance'::character varying])::text[]))) not valid;

alter table "public"."murao_buildings" validate constraint "murao_buildings_status_check";

alter table "public"."murao_chat_sessions" add constraint "murao_chat_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.murao_users(id) not valid;

alter table "public"."murao_chat_sessions" validate constraint "murao_chat_sessions_user_id_fkey";

alter table "public"."murao_collections" add constraint "murao_collections_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public.murao_users(id) ON DELETE SET NULL not valid;

alter table "public"."murao_collections" validate constraint "murao_collections_assigned_to_fkey";

alter table "public"."murao_collections" add constraint "murao_collections_contract_id_fkey" FOREIGN KEY (contract_id) REFERENCES public.murao_contracts(id) ON DELETE CASCADE not valid;

alter table "public"."murao_collections" validate constraint "murao_collections_contract_id_fkey";

alter table "public"."murao_collections" add constraint "murao_collections_payment_id_fkey" FOREIGN KEY (payment_id) REFERENCES public.murao_payments(id) ON DELETE SET NULL not valid;

alter table "public"."murao_collections" validate constraint "murao_collections_payment_id_fkey";

alter table "public"."murao_collections" add constraint "murao_collections_stage_check" CHECK (((stage)::text = ANY ((ARRAY['reminder'::character varying, 'warning'::character varying, 'final_notice'::character varying, 'legal'::character varying])::text[]))) not valid;

alter table "public"."murao_collections" validate constraint "murao_collections_stage_check";

alter table "public"."murao_contracts" add constraint "murao_contracts_contract_number_key" UNIQUE using index "murao_contracts_contract_number_key";

alter table "public"."murao_contracts" add constraint "murao_contracts_signed_by_fkey" FOREIGN KEY (signed_by) REFERENCES public.murao_users(id) ON DELETE SET NULL not valid;

alter table "public"."murao_contracts" validate constraint "murao_contracts_signed_by_fkey";

alter table "public"."murao_contracts" add constraint "murao_contracts_status_check" CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'active'::character varying, 'expiring'::character varying, 'terminated'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."murao_contracts" validate constraint "murao_contracts_status_check";

alter table "public"."murao_contracts" add constraint "murao_contracts_tenant_id_fkey" FOREIGN KEY (tenant_id) REFERENCES public.murao_tenants(id) ON DELETE RESTRICT not valid;

alter table "public"."murao_contracts" validate constraint "murao_contracts_tenant_id_fkey";

alter table "public"."murao_contracts" add constraint "murao_contracts_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES public.murao_units(id) ON DELETE RESTRICT not valid;

alter table "public"."murao_contracts" validate constraint "murao_contracts_unit_id_fkey";

alter table "public"."murao_departments" add constraint "murao_departments_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.murao_departments(id) ON DELETE SET NULL not valid;

alter table "public"."murao_departments" validate constraint "murao_departments_parent_id_fkey";

alter table "public"."murao_emergencies" add constraint "murao_emergencies_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public.murao_users(id) ON DELETE SET NULL not valid;

alter table "public"."murao_emergencies" validate constraint "murao_emergencies_assigned_to_fkey";

alter table "public"."murao_emergencies" add constraint "murao_emergencies_building_id_fkey" FOREIGN KEY (building_id) REFERENCES public.murao_buildings(id) ON DELETE CASCADE not valid;

alter table "public"."murao_emergencies" validate constraint "murao_emergencies_building_id_fkey";

alter table "public"."murao_emergencies" add constraint "murao_emergencies_reported_by_fkey" FOREIGN KEY (reported_by) REFERENCES public.murao_users(id) ON DELETE RESTRICT not valid;

alter table "public"."murao_emergencies" validate constraint "murao_emergencies_reported_by_fkey";

alter table "public"."murao_emergencies" add constraint "murao_emergencies_severity_check" CHECK (((severity)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'critical'::character varying])::text[]))) not valid;

alter table "public"."murao_emergencies" validate constraint "murao_emergencies_severity_check";

alter table "public"."murao_emergencies" add constraint "murao_emergencies_status_check" CHECK (((status)::text = ANY ((ARRAY['reported'::character varying, 'responding'::character varying, 'resolved'::character varying, 'closed'::character varying])::text[]))) not valid;

alter table "public"."murao_emergencies" validate constraint "murao_emergencies_status_check";

alter table "public"."murao_emergencies" add constraint "murao_emergencies_type_check" CHECK (((type)::text = ANY ((ARRAY['power_outage'::character varying, 'water_leak'::character varying, 'theft'::character varying, 'fire'::character varying, 'elevator'::character varying, 'other'::character varying])::text[]))) not valid;

alter table "public"."murao_emergencies" validate constraint "murao_emergencies_type_check";

alter table "public"."murao_emergencies" add constraint "murao_emergencies_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES public.murao_units(id) ON DELETE SET NULL not valid;

alter table "public"."murao_emergencies" validate constraint "murao_emergencies_unit_id_fkey";

alter table "public"."murao_iot_devices" add constraint "murao_iot_devices_building_id_fkey" FOREIGN KEY (building_id) REFERENCES public.murao_buildings(id) ON DELETE CASCADE not valid;

alter table "public"."murao_iot_devices" validate constraint "murao_iot_devices_building_id_fkey";

alter table "public"."murao_iot_devices" add constraint "murao_iot_devices_device_type_check" CHECK (((device_type)::text = ANY ((ARRAY['camera'::character varying, 'water_meter'::character varying, 'power_meter'::character varying, 'elevator'::character varying, 'sensor'::character varying])::text[]))) not valid;

alter table "public"."murao_iot_devices" validate constraint "murao_iot_devices_device_type_check";

alter table "public"."murao_iot_devices" add constraint "murao_iot_devices_status_check" CHECK (((status)::text = ANY ((ARRAY['online'::character varying, 'offline'::character varying, 'warning'::character varying, 'error'::character varying])::text[]))) not valid;

alter table "public"."murao_iot_devices" validate constraint "murao_iot_devices_status_check";

alter table "public"."murao_iot_devices" add constraint "murao_iot_devices_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES public.murao_units(id) ON DELETE SET NULL not valid;

alter table "public"."murao_iot_devices" validate constraint "murao_iot_devices_unit_id_fkey";

alter table "public"."murao_maintenance_requests" add constraint "murao_maintenance_requests_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public.murao_users(id) ON DELETE SET NULL not valid;

alter table "public"."murao_maintenance_requests" validate constraint "murao_maintenance_requests_assigned_to_fkey";

alter table "public"."murao_maintenance_requests" add constraint "murao_maintenance_requests_priority_check" CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))) not valid;

alter table "public"."murao_maintenance_requests" validate constraint "murao_maintenance_requests_priority_check";

alter table "public"."murao_maintenance_requests" add constraint "murao_maintenance_requests_reported_by_fkey" FOREIGN KEY (reported_by) REFERENCES public.murao_users(id) ON DELETE RESTRICT not valid;

alter table "public"."murao_maintenance_requests" validate constraint "murao_maintenance_requests_reported_by_fkey";

alter table "public"."murao_maintenance_requests" add constraint "murao_maintenance_requests_status_check" CHECK (((status)::text = ANY ((ARRAY['open'::character varying, 'assigned'::character varying, 'in_progress'::character varying, 'completed'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."murao_maintenance_requests" validate constraint "murao_maintenance_requests_status_check";

alter table "public"."murao_maintenance_requests" add constraint "murao_maintenance_requests_unit_id_fkey" FOREIGN KEY (unit_id) REFERENCES public.murao_units(id) ON DELETE CASCADE not valid;

alter table "public"."murao_maintenance_requests" validate constraint "murao_maintenance_requests_unit_id_fkey";

alter table "public"."murao_move_outs" add constraint "murao_move_outs_approval_status_check" CHECK (((approval_status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying])::text[]))) not valid;

alter table "public"."murao_move_outs" validate constraint "murao_move_outs_approval_status_check";

alter table "public"."murao_move_outs" add constraint "murao_move_outs_approved_by_fkey" FOREIGN KEY (approved_by) REFERENCES public.murao_users(id) ON DELETE SET NULL not valid;

alter table "public"."murao_move_outs" validate constraint "murao_move_outs_approved_by_fkey";

alter table "public"."murao_move_outs" add constraint "murao_move_outs_contract_id_fkey" FOREIGN KEY (contract_id) REFERENCES public.murao_contracts(id) ON DELETE CASCADE not valid;

alter table "public"."murao_move_outs" validate constraint "murao_move_outs_contract_id_fkey";

alter table "public"."murao_move_outs" add constraint "murao_move_outs_inspection_status_check" CHECK (((inspection_status)::text = ANY ((ARRAY['pending'::character varying, 'scheduled'::character varying, 'completed'::character varying, 'failed'::character varying])::text[]))) not valid;

alter table "public"."murao_move_outs" validate constraint "murao_move_outs_inspection_status_check";

alter table "public"."murao_payments" add constraint "murao_payments_contract_id_fkey" FOREIGN KEY (contract_id) REFERENCES public.murao_contracts(id) ON DELETE CASCADE not valid;

alter table "public"."murao_payments" validate constraint "murao_payments_contract_id_fkey";

alter table "public"."murao_payments" add constraint "murao_payments_payment_method_check" CHECK (((payment_method)::text = ANY ((ARRAY['cash'::character varying, 'bank_transfer'::character varying, 'credit_card'::character varying])::text[]))) not valid;

alter table "public"."murao_payments" validate constraint "murao_payments_payment_method_check";

alter table "public"."murao_payments" add constraint "murao_payments_recorded_by_fkey" FOREIGN KEY (recorded_by) REFERENCES public.murao_users(id) ON DELETE SET NULL not valid;

alter table "public"."murao_payments" validate constraint "murao_payments_recorded_by_fkey";

alter table "public"."murao_payments" add constraint "murao_payments_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'overdue'::character varying, 'partial'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."murao_payments" validate constraint "murao_payments_status_check";

alter table "public"."murao_roles" add constraint "murao_roles_name_key" UNIQUE using index "murao_roles_name_key";

alter table "public"."murao_tasks" add constraint "murao_tasks_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public.murao_users(id) ON DELETE SET NULL not valid;

alter table "public"."murao_tasks" validate constraint "murao_tasks_assigned_to_fkey";

alter table "public"."murao_tasks" add constraint "murao_tasks_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.murao_users(id) ON DELETE RESTRICT not valid;

alter table "public"."murao_tasks" validate constraint "murao_tasks_created_by_fkey";

alter table "public"."murao_tasks" add constraint "murao_tasks_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.murao_tasks(id) ON DELETE SET NULL not valid;

alter table "public"."murao_tasks" validate constraint "murao_tasks_parent_id_fkey";

alter table "public"."murao_tasks" add constraint "murao_tasks_priority_check" CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))) not valid;

alter table "public"."murao_tasks" validate constraint "murao_tasks_priority_check";

alter table "public"."murao_tasks" add constraint "murao_tasks_status_check" CHECK (((status)::text = ANY ((ARRAY['planned'::character varying, 'scheduled'::character varying, 'in_progress'::character varying, 'blocked'::character varying, 'paused'::character varying, 'cancelled'::character varying, 'completed'::character varying, 'confirmed'::character varying])::text[]))) not valid;

alter table "public"."murao_tasks" validate constraint "murao_tasks_status_check";

alter table "public"."murao_units" add constraint "murao_units_building_id_fkey" FOREIGN KEY (building_id) REFERENCES public.murao_buildings(id) ON DELETE CASCADE not valid;

alter table "public"."murao_units" validate constraint "murao_units_building_id_fkey";

alter table "public"."murao_units" add constraint "murao_units_building_id_unit_number_key" UNIQUE using index "murao_units_building_id_unit_number_key";

alter table "public"."murao_units" add constraint "murao_units_status_check" CHECK (((status)::text = ANY ((ARRAY['vacant'::character varying, 'occupied'::character varying, 'maintenance'::character varying, 'reserved'::character varying])::text[]))) not valid;

alter table "public"."murao_units" validate constraint "murao_units_status_check";

alter table "public"."murao_users" add constraint "murao_users_auth_id_key" UNIQUE using index "murao_users_auth_id_key";

alter table "public"."murao_users" add constraint "murao_users_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public.murao_departments(id) ON DELETE SET NULL not valid;

alter table "public"."murao_users" validate constraint "murao_users_department_id_fkey";

alter table "public"."murao_users" add constraint "murao_users_email_key" UNIQUE using index "murao_users_email_key";

alter table "public"."murao_users" add constraint "murao_users_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.murao_roles(id) ON DELETE RESTRICT not valid;

alter table "public"."murao_users" validate constraint "murao_users_role_id_fkey";

alter table "public"."payments" add constraint "payments_contract_id_fkey" FOREIGN KEY (contract_id) REFERENCES public.contracts(id) ON DELETE CASCADE not valid;

alter table "public"."payments" validate constraint "payments_contract_id_fkey";

alter table "public"."payments" add constraint "payments_payment_method_check" CHECK (((payment_method)::text = ANY ((ARRAY['cash'::character varying, 'bank_transfer'::character varying, 'credit_card'::character varying])::text[]))) not valid;

alter table "public"."payments" validate constraint "payments_payment_method_check";

alter table "public"."payments" add constraint "payments_recorded_by_fkey" FOREIGN KEY (recorded_by) REFERENCES public.users(id) ON DELETE SET NULL not valid;

alter table "public"."payments" validate constraint "payments_recorded_by_fkey";

alter table "public"."payments" add constraint "payments_status_check" CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'paid'::character varying, 'overdue'::character varying, 'partial'::character varying, 'cancelled'::character varying])::text[]))) not valid;

alter table "public"."payments" validate constraint "payments_status_check";

alter table "public"."roles" add constraint "roles_name_key" UNIQUE using index "roles_name_key";

alter table "public"."tasks" add constraint "tasks_assigned_to_fkey" FOREIGN KEY (assigned_to) REFERENCES public.users(id) ON DELETE SET NULL not valid;

alter table "public"."tasks" validate constraint "tasks_assigned_to_fkey";

alter table "public"."tasks" add constraint "tasks_created_by_fkey" FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE RESTRICT not valid;

alter table "public"."tasks" validate constraint "tasks_created_by_fkey";

alter table "public"."tasks" add constraint "tasks_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.tasks(id) ON DELETE SET NULL not valid;

alter table "public"."tasks" validate constraint "tasks_parent_id_fkey";

alter table "public"."tasks" add constraint "tasks_priority_check" CHECK (((priority)::text = ANY ((ARRAY['low'::character varying, 'medium'::character varying, 'high'::character varying, 'urgent'::character varying])::text[]))) not valid;

alter table "public"."tasks" validate constraint "tasks_priority_check";

alter table "public"."tasks" add constraint "tasks_status_check" CHECK (((status)::text = ANY ((ARRAY['planned'::character varying, 'scheduled'::character varying, 'in_progress'::character varying, 'blocked'::character varying, 'paused'::character varying, 'cancelled'::character varying, 'completed'::character varying, 'confirmed'::character varying])::text[]))) not valid;

alter table "public"."tasks" validate constraint "tasks_status_check";

alter table "public"."units" add constraint "units_building_id_fkey" FOREIGN KEY (building_id) REFERENCES public.buildings(id) ON DELETE CASCADE not valid;

alter table "public"."units" validate constraint "units_building_id_fkey";

alter table "public"."units" add constraint "units_building_id_unit_number_key" UNIQUE using index "units_building_id_unit_number_key";

alter table "public"."units" add constraint "units_status_check" CHECK (((status)::text = ANY ((ARRAY['vacant'::character varying, 'occupied'::character varying, 'maintenance'::character varying, 'reserved'::character varying])::text[]))) not valid;

alter table "public"."units" validate constraint "units_status_check";

alter table "public"."users" add constraint "users_auth_id_key" UNIQUE using index "users_auth_id_key";

alter table "public"."users" add constraint "users_department_id_fkey" FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL not valid;

alter table "public"."users" validate constraint "users_department_id_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

alter table "public"."users" add constraint "users_role_id_fkey" FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE RESTRICT not valid;

alter table "public"."users" validate constraint "users_role_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.build_entity_content(p_entity_type text, p_record jsonb)
 RETURNS text
 LANGUAGE plpgsql
AS $function$
DECLARE
  content TEXT;
BEGIN
  CASE p_entity_type
    WHEN 'buildings' THEN
      content := format('Building: %s. Address: %s, %s. Units: %s, Floors: %s. Status: %s. %s',
        p_record->>'name', p_record->>'address', p_record->>'city',
        p_record->>'total_units', p_record->>'floors', p_record->>'status',
        COALESCE(p_record->>'description', ''));
    WHEN 'units' THEN
      content := format('Unit %s in building %s. Floor %s, %s sqm, %s rooms. Rent: ¥%s. Status: %s.',
        p_record->>'unit_number', p_record->>'building_id',
        p_record->>'floor', p_record->>'area_sqm', p_record->>'rooms',
        p_record->>'rent_amount', p_record->>'status');
    WHEN 'tenants' THEN
      content := format('Tenant: %s. Phone: %s. Email: %s. Company: %s.',
        p_record->>'full_name', p_record->>'phone',
        COALESCE(p_record->>'email', 'N/A'),
        COALESCE(p_record->>'company_name', 'N/A'));
    WHEN 'contracts' THEN
      content := format('Contract %s: tenant %s, unit %s. Period: %s to %s. Monthly rent: ¥%s. Deposit: ¥%s. Status: %s.',
        p_record->>'contract_number', p_record->>'tenant_id', p_record->>'unit_id',
        p_record->>'start_date', p_record->>'end_date',
        p_record->>'monthly_rent', p_record->>'deposit_amount', p_record->>'status');
    WHEN 'payments' THEN
      content := format('Payment ¥%s for contract %s. Due: %s. Paid: %s. Method: %s. Status: %s. Ref: %s. Notes: %s',
        p_record->>'amount', p_record->>'contract_id',
        p_record->>'due_date', COALESCE(p_record->>'paid_date', 'unpaid'),
        COALESCE(p_record->>'payment_method', 'N/A'), p_record->>'status',
        COALESCE(p_record->>'reference_number', 'N/A'),
        COALESCE(p_record->>'notes', ''));
    WHEN 'collections' THEN
      content := format('Collection for contract %s. Overdue: ¥%s, %s days. Stage: %s. Notes: %s',
        p_record->>'contract_id', p_record->>'total_overdue',
        p_record->>'days_overdue', p_record->>'stage',
        COALESCE(p_record->>'notes', ''));
    WHEN 'maintenance_requests' THEN
      content := format('Maintenance: %s. %s. Unit: %s. Priority: %s. Category: %s. Status: %s.',
        p_record->>'title', p_record->>'description', p_record->>'unit_id',
        p_record->>'priority', p_record->>'category', p_record->>'status');
    WHEN 'emergencies' THEN
      content := format('Emergency [%s]: %s. %s. Building: %s. Severity: %s. Status: %s.',
        p_record->>'type', p_record->>'title', p_record->>'description',
        p_record->>'building_id', p_record->>'severity', p_record->>'status');
    ELSE
      content := p_record::TEXT;
  END CASE;

  RETURN content;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.match_embeddings(query_embedding extensions.vector, match_threshold double precision DEFAULT 0.7, match_count integer DEFAULT 5, filter_entity_type text DEFAULT NULL::text)
 RETURNS TABLE(id uuid, content text, metadata jsonb, entity_type text, entity_id uuid, similarity double precision)
 LANGUAGE plpgsql
AS $function$
    BEGIN
      RETURN QUERY
      SELECT e.id, e.content, e.metadata, e.entity_type, e.entity_id,
        1 - (e.embedding <=> query_embedding) AS similarity
      FROM murao_embeddings e
      WHERE (filter_entity_type IS NULL OR e.entity_type = filter_entity_type)
        AND 1 - (e.embedding <=> query_embedding) > match_threshold
      ORDER BY e.embedding <=> query_embedding
      LIMIT match_count;
    END; $function$
;

CREATE OR REPLACE FUNCTION public.murao_handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.trigger_embed_webhook()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  entity_type TEXT;
  record_data JSONB;
  content TEXT;
  webhook_url TEXT;
  service_key TEXT;
  payload JSONB;
BEGIN
  -- Derive entity_type from table name (strip 'murao_' prefix)
  entity_type := regexp_replace(TG_TABLE_NAME, '^murao_', '');

  -- Get the app URL and service key from settings (set via ALTER DATABASE ... SET)
  webhook_url := current_setting('app.webhook_base_url', true);
  service_key := current_setting('app.service_role_key', true);

  -- Fallback defaults for local development
  IF webhook_url IS NULL OR webhook_url = '' THEN
    webhook_url := 'http://host.docker.internal:3001';
  END IF;

  IF TG_OP = 'DELETE' THEN
    -- For deletes, just send the entity info
    payload := jsonb_build_object(
      'entity_type', entity_type,
      'entity_id', OLD.id,
      'operation', 'DELETE'
    );
  ELSE
    -- For inserts and updates, build content
    record_data := to_jsonb(NEW);
    content := build_entity_content(entity_type, record_data);

    payload := jsonb_build_object(
      'entity_type', entity_type,
      'entity_id', NEW.id,
      'content', content,
      'metadata', record_data,
      'operation', TG_OP
    );
  END IF;

  -- Fire async HTTP POST via pg_net
  PERFORM net.http_post(
    url := webhook_url || '/api/ai/embed',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || COALESCE(service_key, '')
    ),
    body := payload
  );

  -- Always return the appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$function$
;

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


grant delete on table "public"."activity_logs" to "anon";

grant insert on table "public"."activity_logs" to "anon";

grant references on table "public"."activity_logs" to "anon";

grant select on table "public"."activity_logs" to "anon";

grant trigger on table "public"."activity_logs" to "anon";

grant truncate on table "public"."activity_logs" to "anon";

grant update on table "public"."activity_logs" to "anon";

grant delete on table "public"."activity_logs" to "authenticated";

grant insert on table "public"."activity_logs" to "authenticated";

grant references on table "public"."activity_logs" to "authenticated";

grant select on table "public"."activity_logs" to "authenticated";

grant trigger on table "public"."activity_logs" to "authenticated";

grant truncate on table "public"."activity_logs" to "authenticated";

grant update on table "public"."activity_logs" to "authenticated";

grant delete on table "public"."activity_logs" to "service_role";

grant insert on table "public"."activity_logs" to "service_role";

grant references on table "public"."activity_logs" to "service_role";

grant select on table "public"."activity_logs" to "service_role";

grant trigger on table "public"."activity_logs" to "service_role";

grant truncate on table "public"."activity_logs" to "service_role";

grant update on table "public"."activity_logs" to "service_role";

grant delete on table "public"."buildings" to "anon";

grant insert on table "public"."buildings" to "anon";

grant references on table "public"."buildings" to "anon";

grant select on table "public"."buildings" to "anon";

grant trigger on table "public"."buildings" to "anon";

grant truncate on table "public"."buildings" to "anon";

grant update on table "public"."buildings" to "anon";

grant delete on table "public"."buildings" to "authenticated";

grant insert on table "public"."buildings" to "authenticated";

grant references on table "public"."buildings" to "authenticated";

grant select on table "public"."buildings" to "authenticated";

grant trigger on table "public"."buildings" to "authenticated";

grant truncate on table "public"."buildings" to "authenticated";

grant update on table "public"."buildings" to "authenticated";

grant delete on table "public"."buildings" to "service_role";

grant insert on table "public"."buildings" to "service_role";

grant references on table "public"."buildings" to "service_role";

grant select on table "public"."buildings" to "service_role";

grant trigger on table "public"."buildings" to "service_role";

grant truncate on table "public"."buildings" to "service_role";

grant update on table "public"."buildings" to "service_role";

grant delete on table "public"."collections" to "anon";

grant insert on table "public"."collections" to "anon";

grant references on table "public"."collections" to "anon";

grant select on table "public"."collections" to "anon";

grant trigger on table "public"."collections" to "anon";

grant truncate on table "public"."collections" to "anon";

grant update on table "public"."collections" to "anon";

grant delete on table "public"."collections" to "authenticated";

grant insert on table "public"."collections" to "authenticated";

grant references on table "public"."collections" to "authenticated";

grant select on table "public"."collections" to "authenticated";

grant trigger on table "public"."collections" to "authenticated";

grant truncate on table "public"."collections" to "authenticated";

grant update on table "public"."collections" to "authenticated";

grant delete on table "public"."collections" to "service_role";

grant insert on table "public"."collections" to "service_role";

grant references on table "public"."collections" to "service_role";

grant select on table "public"."collections" to "service_role";

grant trigger on table "public"."collections" to "service_role";

grant truncate on table "public"."collections" to "service_role";

grant update on table "public"."collections" to "service_role";

grant delete on table "public"."contracts" to "anon";

grant insert on table "public"."contracts" to "anon";

grant references on table "public"."contracts" to "anon";

grant select on table "public"."contracts" to "anon";

grant trigger on table "public"."contracts" to "anon";

grant truncate on table "public"."contracts" to "anon";

grant update on table "public"."contracts" to "anon";

grant delete on table "public"."contracts" to "authenticated";

grant insert on table "public"."contracts" to "authenticated";

grant references on table "public"."contracts" to "authenticated";

grant select on table "public"."contracts" to "authenticated";

grant trigger on table "public"."contracts" to "authenticated";

grant truncate on table "public"."contracts" to "authenticated";

grant update on table "public"."contracts" to "authenticated";

grant delete on table "public"."contracts" to "service_role";

grant insert on table "public"."contracts" to "service_role";

grant references on table "public"."contracts" to "service_role";

grant select on table "public"."contracts" to "service_role";

grant trigger on table "public"."contracts" to "service_role";

grant truncate on table "public"."contracts" to "service_role";

grant update on table "public"."contracts" to "service_role";

grant delete on table "public"."departments" to "anon";

grant insert on table "public"."departments" to "anon";

grant references on table "public"."departments" to "anon";

grant select on table "public"."departments" to "anon";

grant trigger on table "public"."departments" to "anon";

grant truncate on table "public"."departments" to "anon";

grant update on table "public"."departments" to "anon";

grant delete on table "public"."departments" to "authenticated";

grant insert on table "public"."departments" to "authenticated";

grant references on table "public"."departments" to "authenticated";

grant select on table "public"."departments" to "authenticated";

grant trigger on table "public"."departments" to "authenticated";

grant truncate on table "public"."departments" to "authenticated";

grant update on table "public"."departments" to "authenticated";

grant delete on table "public"."departments" to "service_role";

grant insert on table "public"."departments" to "service_role";

grant references on table "public"."departments" to "service_role";

grant select on table "public"."departments" to "service_role";

grant trigger on table "public"."departments" to "service_role";

grant truncate on table "public"."departments" to "service_role";

grant update on table "public"."departments" to "service_role";

grant delete on table "public"."emergencies" to "anon";

grant insert on table "public"."emergencies" to "anon";

grant references on table "public"."emergencies" to "anon";

grant select on table "public"."emergencies" to "anon";

grant trigger on table "public"."emergencies" to "anon";

grant truncate on table "public"."emergencies" to "anon";

grant update on table "public"."emergencies" to "anon";

grant delete on table "public"."emergencies" to "authenticated";

grant insert on table "public"."emergencies" to "authenticated";

grant references on table "public"."emergencies" to "authenticated";

grant select on table "public"."emergencies" to "authenticated";

grant trigger on table "public"."emergencies" to "authenticated";

grant truncate on table "public"."emergencies" to "authenticated";

grant update on table "public"."emergencies" to "authenticated";

grant delete on table "public"."emergencies" to "service_role";

grant insert on table "public"."emergencies" to "service_role";

grant references on table "public"."emergencies" to "service_role";

grant select on table "public"."emergencies" to "service_role";

grant trigger on table "public"."emergencies" to "service_role";

grant truncate on table "public"."emergencies" to "service_role";

grant update on table "public"."emergencies" to "service_role";

grant delete on table "public"."iot_devices" to "anon";

grant insert on table "public"."iot_devices" to "anon";

grant references on table "public"."iot_devices" to "anon";

grant select on table "public"."iot_devices" to "anon";

grant trigger on table "public"."iot_devices" to "anon";

grant truncate on table "public"."iot_devices" to "anon";

grant update on table "public"."iot_devices" to "anon";

grant delete on table "public"."iot_devices" to "authenticated";

grant insert on table "public"."iot_devices" to "authenticated";

grant references on table "public"."iot_devices" to "authenticated";

grant select on table "public"."iot_devices" to "authenticated";

grant trigger on table "public"."iot_devices" to "authenticated";

grant truncate on table "public"."iot_devices" to "authenticated";

grant update on table "public"."iot_devices" to "authenticated";

grant delete on table "public"."iot_devices" to "service_role";

grant insert on table "public"."iot_devices" to "service_role";

grant references on table "public"."iot_devices" to "service_role";

grant select on table "public"."iot_devices" to "service_role";

grant trigger on table "public"."iot_devices" to "service_role";

grant truncate on table "public"."iot_devices" to "service_role";

grant update on table "public"."iot_devices" to "service_role";

grant delete on table "public"."maintenance_requests" to "anon";

grant insert on table "public"."maintenance_requests" to "anon";

grant references on table "public"."maintenance_requests" to "anon";

grant select on table "public"."maintenance_requests" to "anon";

grant trigger on table "public"."maintenance_requests" to "anon";

grant truncate on table "public"."maintenance_requests" to "anon";

grant update on table "public"."maintenance_requests" to "anon";

grant delete on table "public"."maintenance_requests" to "authenticated";

grant insert on table "public"."maintenance_requests" to "authenticated";

grant references on table "public"."maintenance_requests" to "authenticated";

grant select on table "public"."maintenance_requests" to "authenticated";

grant trigger on table "public"."maintenance_requests" to "authenticated";

grant truncate on table "public"."maintenance_requests" to "authenticated";

grant update on table "public"."maintenance_requests" to "authenticated";

grant delete on table "public"."maintenance_requests" to "service_role";

grant insert on table "public"."maintenance_requests" to "service_role";

grant references on table "public"."maintenance_requests" to "service_role";

grant select on table "public"."maintenance_requests" to "service_role";

grant trigger on table "public"."maintenance_requests" to "service_role";

grant truncate on table "public"."maintenance_requests" to "service_role";

grant update on table "public"."maintenance_requests" to "service_role";

grant delete on table "public"."move_outs" to "anon";

grant insert on table "public"."move_outs" to "anon";

grant references on table "public"."move_outs" to "anon";

grant select on table "public"."move_outs" to "anon";

grant trigger on table "public"."move_outs" to "anon";

grant truncate on table "public"."move_outs" to "anon";

grant update on table "public"."move_outs" to "anon";

grant delete on table "public"."move_outs" to "authenticated";

grant insert on table "public"."move_outs" to "authenticated";

grant references on table "public"."move_outs" to "authenticated";

grant select on table "public"."move_outs" to "authenticated";

grant trigger on table "public"."move_outs" to "authenticated";

grant truncate on table "public"."move_outs" to "authenticated";

grant update on table "public"."move_outs" to "authenticated";

grant delete on table "public"."move_outs" to "service_role";

grant insert on table "public"."move_outs" to "service_role";

grant references on table "public"."move_outs" to "service_role";

grant select on table "public"."move_outs" to "service_role";

grant trigger on table "public"."move_outs" to "service_role";

grant truncate on table "public"."move_outs" to "service_role";

grant update on table "public"."move_outs" to "service_role";

grant delete on table "public"."murao_activity_logs" to "anon";

grant insert on table "public"."murao_activity_logs" to "anon";

grant references on table "public"."murao_activity_logs" to "anon";

grant select on table "public"."murao_activity_logs" to "anon";

grant trigger on table "public"."murao_activity_logs" to "anon";

grant truncate on table "public"."murao_activity_logs" to "anon";

grant update on table "public"."murao_activity_logs" to "anon";

grant delete on table "public"."murao_activity_logs" to "authenticated";

grant insert on table "public"."murao_activity_logs" to "authenticated";

grant references on table "public"."murao_activity_logs" to "authenticated";

grant select on table "public"."murao_activity_logs" to "authenticated";

grant trigger on table "public"."murao_activity_logs" to "authenticated";

grant truncate on table "public"."murao_activity_logs" to "authenticated";

grant update on table "public"."murao_activity_logs" to "authenticated";

grant delete on table "public"."murao_activity_logs" to "service_role";

grant insert on table "public"."murao_activity_logs" to "service_role";

grant references on table "public"."murao_activity_logs" to "service_role";

grant select on table "public"."murao_activity_logs" to "service_role";

grant trigger on table "public"."murao_activity_logs" to "service_role";

grant truncate on table "public"."murao_activity_logs" to "service_role";

grant update on table "public"."murao_activity_logs" to "service_role";

grant delete on table "public"."murao_buildings" to "anon";

grant insert on table "public"."murao_buildings" to "anon";

grant references on table "public"."murao_buildings" to "anon";

grant select on table "public"."murao_buildings" to "anon";

grant trigger on table "public"."murao_buildings" to "anon";

grant truncate on table "public"."murao_buildings" to "anon";

grant update on table "public"."murao_buildings" to "anon";

grant delete on table "public"."murao_buildings" to "authenticated";

grant insert on table "public"."murao_buildings" to "authenticated";

grant references on table "public"."murao_buildings" to "authenticated";

grant select on table "public"."murao_buildings" to "authenticated";

grant trigger on table "public"."murao_buildings" to "authenticated";

grant truncate on table "public"."murao_buildings" to "authenticated";

grant update on table "public"."murao_buildings" to "authenticated";

grant delete on table "public"."murao_buildings" to "service_role";

grant insert on table "public"."murao_buildings" to "service_role";

grant references on table "public"."murao_buildings" to "service_role";

grant select on table "public"."murao_buildings" to "service_role";

grant trigger on table "public"."murao_buildings" to "service_role";

grant truncate on table "public"."murao_buildings" to "service_role";

grant update on table "public"."murao_buildings" to "service_role";

grant delete on table "public"."murao_chat_sessions" to "anon";

grant insert on table "public"."murao_chat_sessions" to "anon";

grant references on table "public"."murao_chat_sessions" to "anon";

grant select on table "public"."murao_chat_sessions" to "anon";

grant trigger on table "public"."murao_chat_sessions" to "anon";

grant truncate on table "public"."murao_chat_sessions" to "anon";

grant update on table "public"."murao_chat_sessions" to "anon";

grant delete on table "public"."murao_chat_sessions" to "authenticated";

grant insert on table "public"."murao_chat_sessions" to "authenticated";

grant references on table "public"."murao_chat_sessions" to "authenticated";

grant select on table "public"."murao_chat_sessions" to "authenticated";

grant trigger on table "public"."murao_chat_sessions" to "authenticated";

grant truncate on table "public"."murao_chat_sessions" to "authenticated";

grant update on table "public"."murao_chat_sessions" to "authenticated";

grant delete on table "public"."murao_chat_sessions" to "service_role";

grant insert on table "public"."murao_chat_sessions" to "service_role";

grant references on table "public"."murao_chat_sessions" to "service_role";

grant select on table "public"."murao_chat_sessions" to "service_role";

grant trigger on table "public"."murao_chat_sessions" to "service_role";

grant truncate on table "public"."murao_chat_sessions" to "service_role";

grant update on table "public"."murao_chat_sessions" to "service_role";

grant delete on table "public"."murao_collections" to "anon";

grant insert on table "public"."murao_collections" to "anon";

grant references on table "public"."murao_collections" to "anon";

grant select on table "public"."murao_collections" to "anon";

grant trigger on table "public"."murao_collections" to "anon";

grant truncate on table "public"."murao_collections" to "anon";

grant update on table "public"."murao_collections" to "anon";

grant delete on table "public"."murao_collections" to "authenticated";

grant insert on table "public"."murao_collections" to "authenticated";

grant references on table "public"."murao_collections" to "authenticated";

grant select on table "public"."murao_collections" to "authenticated";

grant trigger on table "public"."murao_collections" to "authenticated";

grant truncate on table "public"."murao_collections" to "authenticated";

grant update on table "public"."murao_collections" to "authenticated";

grant delete on table "public"."murao_collections" to "service_role";

grant insert on table "public"."murao_collections" to "service_role";

grant references on table "public"."murao_collections" to "service_role";

grant select on table "public"."murao_collections" to "service_role";

grant trigger on table "public"."murao_collections" to "service_role";

grant truncate on table "public"."murao_collections" to "service_role";

grant update on table "public"."murao_collections" to "service_role";

grant delete on table "public"."murao_contracts" to "anon";

grant insert on table "public"."murao_contracts" to "anon";

grant references on table "public"."murao_contracts" to "anon";

grant select on table "public"."murao_contracts" to "anon";

grant trigger on table "public"."murao_contracts" to "anon";

grant truncate on table "public"."murao_contracts" to "anon";

grant update on table "public"."murao_contracts" to "anon";

grant delete on table "public"."murao_contracts" to "authenticated";

grant insert on table "public"."murao_contracts" to "authenticated";

grant references on table "public"."murao_contracts" to "authenticated";

grant select on table "public"."murao_contracts" to "authenticated";

grant trigger on table "public"."murao_contracts" to "authenticated";

grant truncate on table "public"."murao_contracts" to "authenticated";

grant update on table "public"."murao_contracts" to "authenticated";

grant delete on table "public"."murao_contracts" to "service_role";

grant insert on table "public"."murao_contracts" to "service_role";

grant references on table "public"."murao_contracts" to "service_role";

grant select on table "public"."murao_contracts" to "service_role";

grant trigger on table "public"."murao_contracts" to "service_role";

grant truncate on table "public"."murao_contracts" to "service_role";

grant update on table "public"."murao_contracts" to "service_role";

grant delete on table "public"."murao_departments" to "anon";

grant insert on table "public"."murao_departments" to "anon";

grant references on table "public"."murao_departments" to "anon";

grant select on table "public"."murao_departments" to "anon";

grant trigger on table "public"."murao_departments" to "anon";

grant truncate on table "public"."murao_departments" to "anon";

grant update on table "public"."murao_departments" to "anon";

grant delete on table "public"."murao_departments" to "authenticated";

grant insert on table "public"."murao_departments" to "authenticated";

grant references on table "public"."murao_departments" to "authenticated";

grant select on table "public"."murao_departments" to "authenticated";

grant trigger on table "public"."murao_departments" to "authenticated";

grant truncate on table "public"."murao_departments" to "authenticated";

grant update on table "public"."murao_departments" to "authenticated";

grant delete on table "public"."murao_departments" to "service_role";

grant insert on table "public"."murao_departments" to "service_role";

grant references on table "public"."murao_departments" to "service_role";

grant select on table "public"."murao_departments" to "service_role";

grant trigger on table "public"."murao_departments" to "service_role";

grant truncate on table "public"."murao_departments" to "service_role";

grant update on table "public"."murao_departments" to "service_role";

grant delete on table "public"."murao_embeddings" to "anon";

grant insert on table "public"."murao_embeddings" to "anon";

grant references on table "public"."murao_embeddings" to "anon";

grant select on table "public"."murao_embeddings" to "anon";

grant trigger on table "public"."murao_embeddings" to "anon";

grant truncate on table "public"."murao_embeddings" to "anon";

grant update on table "public"."murao_embeddings" to "anon";

grant delete on table "public"."murao_embeddings" to "authenticated";

grant insert on table "public"."murao_embeddings" to "authenticated";

grant references on table "public"."murao_embeddings" to "authenticated";

grant select on table "public"."murao_embeddings" to "authenticated";

grant trigger on table "public"."murao_embeddings" to "authenticated";

grant truncate on table "public"."murao_embeddings" to "authenticated";

grant update on table "public"."murao_embeddings" to "authenticated";

grant delete on table "public"."murao_embeddings" to "service_role";

grant insert on table "public"."murao_embeddings" to "service_role";

grant references on table "public"."murao_embeddings" to "service_role";

grant select on table "public"."murao_embeddings" to "service_role";

grant trigger on table "public"."murao_embeddings" to "service_role";

grant truncate on table "public"."murao_embeddings" to "service_role";

grant update on table "public"."murao_embeddings" to "service_role";

grant delete on table "public"."murao_emergencies" to "anon";

grant insert on table "public"."murao_emergencies" to "anon";

grant references on table "public"."murao_emergencies" to "anon";

grant select on table "public"."murao_emergencies" to "anon";

grant trigger on table "public"."murao_emergencies" to "anon";

grant truncate on table "public"."murao_emergencies" to "anon";

grant update on table "public"."murao_emergencies" to "anon";

grant delete on table "public"."murao_emergencies" to "authenticated";

grant insert on table "public"."murao_emergencies" to "authenticated";

grant references on table "public"."murao_emergencies" to "authenticated";

grant select on table "public"."murao_emergencies" to "authenticated";

grant trigger on table "public"."murao_emergencies" to "authenticated";

grant truncate on table "public"."murao_emergencies" to "authenticated";

grant update on table "public"."murao_emergencies" to "authenticated";

grant delete on table "public"."murao_emergencies" to "service_role";

grant insert on table "public"."murao_emergencies" to "service_role";

grant references on table "public"."murao_emergencies" to "service_role";

grant select on table "public"."murao_emergencies" to "service_role";

grant trigger on table "public"."murao_emergencies" to "service_role";

grant truncate on table "public"."murao_emergencies" to "service_role";

grant update on table "public"."murao_emergencies" to "service_role";

grant delete on table "public"."murao_iot_devices" to "anon";

grant insert on table "public"."murao_iot_devices" to "anon";

grant references on table "public"."murao_iot_devices" to "anon";

grant select on table "public"."murao_iot_devices" to "anon";

grant trigger on table "public"."murao_iot_devices" to "anon";

grant truncate on table "public"."murao_iot_devices" to "anon";

grant update on table "public"."murao_iot_devices" to "anon";

grant delete on table "public"."murao_iot_devices" to "authenticated";

grant insert on table "public"."murao_iot_devices" to "authenticated";

grant references on table "public"."murao_iot_devices" to "authenticated";

grant select on table "public"."murao_iot_devices" to "authenticated";

grant trigger on table "public"."murao_iot_devices" to "authenticated";

grant truncate on table "public"."murao_iot_devices" to "authenticated";

grant update on table "public"."murao_iot_devices" to "authenticated";

grant delete on table "public"."murao_iot_devices" to "service_role";

grant insert on table "public"."murao_iot_devices" to "service_role";

grant references on table "public"."murao_iot_devices" to "service_role";

grant select on table "public"."murao_iot_devices" to "service_role";

grant trigger on table "public"."murao_iot_devices" to "service_role";

grant truncate on table "public"."murao_iot_devices" to "service_role";

grant update on table "public"."murao_iot_devices" to "service_role";

grant delete on table "public"."murao_maintenance_requests" to "anon";

grant insert on table "public"."murao_maintenance_requests" to "anon";

grant references on table "public"."murao_maintenance_requests" to "anon";

grant select on table "public"."murao_maintenance_requests" to "anon";

grant trigger on table "public"."murao_maintenance_requests" to "anon";

grant truncate on table "public"."murao_maintenance_requests" to "anon";

grant update on table "public"."murao_maintenance_requests" to "anon";

grant delete on table "public"."murao_maintenance_requests" to "authenticated";

grant insert on table "public"."murao_maintenance_requests" to "authenticated";

grant references on table "public"."murao_maintenance_requests" to "authenticated";

grant select on table "public"."murao_maintenance_requests" to "authenticated";

grant trigger on table "public"."murao_maintenance_requests" to "authenticated";

grant truncate on table "public"."murao_maintenance_requests" to "authenticated";

grant update on table "public"."murao_maintenance_requests" to "authenticated";

grant delete on table "public"."murao_maintenance_requests" to "service_role";

grant insert on table "public"."murao_maintenance_requests" to "service_role";

grant references on table "public"."murao_maintenance_requests" to "service_role";

grant select on table "public"."murao_maintenance_requests" to "service_role";

grant trigger on table "public"."murao_maintenance_requests" to "service_role";

grant truncate on table "public"."murao_maintenance_requests" to "service_role";

grant update on table "public"."murao_maintenance_requests" to "service_role";

grant delete on table "public"."murao_move_outs" to "anon";

grant insert on table "public"."murao_move_outs" to "anon";

grant references on table "public"."murao_move_outs" to "anon";

grant select on table "public"."murao_move_outs" to "anon";

grant trigger on table "public"."murao_move_outs" to "anon";

grant truncate on table "public"."murao_move_outs" to "anon";

grant update on table "public"."murao_move_outs" to "anon";

grant delete on table "public"."murao_move_outs" to "authenticated";

grant insert on table "public"."murao_move_outs" to "authenticated";

grant references on table "public"."murao_move_outs" to "authenticated";

grant select on table "public"."murao_move_outs" to "authenticated";

grant trigger on table "public"."murao_move_outs" to "authenticated";

grant truncate on table "public"."murao_move_outs" to "authenticated";

grant update on table "public"."murao_move_outs" to "authenticated";

grant delete on table "public"."murao_move_outs" to "service_role";

grant insert on table "public"."murao_move_outs" to "service_role";

grant references on table "public"."murao_move_outs" to "service_role";

grant select on table "public"."murao_move_outs" to "service_role";

grant trigger on table "public"."murao_move_outs" to "service_role";

grant truncate on table "public"."murao_move_outs" to "service_role";

grant update on table "public"."murao_move_outs" to "service_role";

grant delete on table "public"."murao_payments" to "anon";

grant insert on table "public"."murao_payments" to "anon";

grant references on table "public"."murao_payments" to "anon";

grant select on table "public"."murao_payments" to "anon";

grant trigger on table "public"."murao_payments" to "anon";

grant truncate on table "public"."murao_payments" to "anon";

grant update on table "public"."murao_payments" to "anon";

grant delete on table "public"."murao_payments" to "authenticated";

grant insert on table "public"."murao_payments" to "authenticated";

grant references on table "public"."murao_payments" to "authenticated";

grant select on table "public"."murao_payments" to "authenticated";

grant trigger on table "public"."murao_payments" to "authenticated";

grant truncate on table "public"."murao_payments" to "authenticated";

grant update on table "public"."murao_payments" to "authenticated";

grant delete on table "public"."murao_payments" to "service_role";

grant insert on table "public"."murao_payments" to "service_role";

grant references on table "public"."murao_payments" to "service_role";

grant select on table "public"."murao_payments" to "service_role";

grant trigger on table "public"."murao_payments" to "service_role";

grant truncate on table "public"."murao_payments" to "service_role";

grant update on table "public"."murao_payments" to "service_role";

grant delete on table "public"."murao_roles" to "anon";

grant insert on table "public"."murao_roles" to "anon";

grant references on table "public"."murao_roles" to "anon";

grant select on table "public"."murao_roles" to "anon";

grant trigger on table "public"."murao_roles" to "anon";

grant truncate on table "public"."murao_roles" to "anon";

grant update on table "public"."murao_roles" to "anon";

grant delete on table "public"."murao_roles" to "authenticated";

grant insert on table "public"."murao_roles" to "authenticated";

grant references on table "public"."murao_roles" to "authenticated";

grant select on table "public"."murao_roles" to "authenticated";

grant trigger on table "public"."murao_roles" to "authenticated";

grant truncate on table "public"."murao_roles" to "authenticated";

grant update on table "public"."murao_roles" to "authenticated";

grant delete on table "public"."murao_roles" to "service_role";

grant insert on table "public"."murao_roles" to "service_role";

grant references on table "public"."murao_roles" to "service_role";

grant select on table "public"."murao_roles" to "service_role";

grant trigger on table "public"."murao_roles" to "service_role";

grant truncate on table "public"."murao_roles" to "service_role";

grant update on table "public"."murao_roles" to "service_role";

grant delete on table "public"."murao_tasks" to "anon";

grant insert on table "public"."murao_tasks" to "anon";

grant references on table "public"."murao_tasks" to "anon";

grant select on table "public"."murao_tasks" to "anon";

grant trigger on table "public"."murao_tasks" to "anon";

grant truncate on table "public"."murao_tasks" to "anon";

grant update on table "public"."murao_tasks" to "anon";

grant delete on table "public"."murao_tasks" to "authenticated";

grant insert on table "public"."murao_tasks" to "authenticated";

grant references on table "public"."murao_tasks" to "authenticated";

grant select on table "public"."murao_tasks" to "authenticated";

grant trigger on table "public"."murao_tasks" to "authenticated";

grant truncate on table "public"."murao_tasks" to "authenticated";

grant update on table "public"."murao_tasks" to "authenticated";

grant delete on table "public"."murao_tasks" to "service_role";

grant insert on table "public"."murao_tasks" to "service_role";

grant references on table "public"."murao_tasks" to "service_role";

grant select on table "public"."murao_tasks" to "service_role";

grant trigger on table "public"."murao_tasks" to "service_role";

grant truncate on table "public"."murao_tasks" to "service_role";

grant update on table "public"."murao_tasks" to "service_role";

grant delete on table "public"."murao_tenants" to "anon";

grant insert on table "public"."murao_tenants" to "anon";

grant references on table "public"."murao_tenants" to "anon";

grant select on table "public"."murao_tenants" to "anon";

grant trigger on table "public"."murao_tenants" to "anon";

grant truncate on table "public"."murao_tenants" to "anon";

grant update on table "public"."murao_tenants" to "anon";

grant delete on table "public"."murao_tenants" to "authenticated";

grant insert on table "public"."murao_tenants" to "authenticated";

grant references on table "public"."murao_tenants" to "authenticated";

grant select on table "public"."murao_tenants" to "authenticated";

grant trigger on table "public"."murao_tenants" to "authenticated";

grant truncate on table "public"."murao_tenants" to "authenticated";

grant update on table "public"."murao_tenants" to "authenticated";

grant delete on table "public"."murao_tenants" to "service_role";

grant insert on table "public"."murao_tenants" to "service_role";

grant references on table "public"."murao_tenants" to "service_role";

grant select on table "public"."murao_tenants" to "service_role";

grant trigger on table "public"."murao_tenants" to "service_role";

grant truncate on table "public"."murao_tenants" to "service_role";

grant update on table "public"."murao_tenants" to "service_role";

grant delete on table "public"."murao_units" to "anon";

grant insert on table "public"."murao_units" to "anon";

grant references on table "public"."murao_units" to "anon";

grant select on table "public"."murao_units" to "anon";

grant trigger on table "public"."murao_units" to "anon";

grant truncate on table "public"."murao_units" to "anon";

grant update on table "public"."murao_units" to "anon";

grant delete on table "public"."murao_units" to "authenticated";

grant insert on table "public"."murao_units" to "authenticated";

grant references on table "public"."murao_units" to "authenticated";

grant select on table "public"."murao_units" to "authenticated";

grant trigger on table "public"."murao_units" to "authenticated";

grant truncate on table "public"."murao_units" to "authenticated";

grant update on table "public"."murao_units" to "authenticated";

grant delete on table "public"."murao_units" to "service_role";

grant insert on table "public"."murao_units" to "service_role";

grant references on table "public"."murao_units" to "service_role";

grant select on table "public"."murao_units" to "service_role";

grant trigger on table "public"."murao_units" to "service_role";

grant truncate on table "public"."murao_units" to "service_role";

grant update on table "public"."murao_units" to "service_role";

grant delete on table "public"."murao_users" to "anon";

grant insert on table "public"."murao_users" to "anon";

grant references on table "public"."murao_users" to "anon";

grant select on table "public"."murao_users" to "anon";

grant trigger on table "public"."murao_users" to "anon";

grant truncate on table "public"."murao_users" to "anon";

grant update on table "public"."murao_users" to "anon";

grant delete on table "public"."murao_users" to "authenticated";

grant insert on table "public"."murao_users" to "authenticated";

grant references on table "public"."murao_users" to "authenticated";

grant select on table "public"."murao_users" to "authenticated";

grant trigger on table "public"."murao_users" to "authenticated";

grant truncate on table "public"."murao_users" to "authenticated";

grant update on table "public"."murao_users" to "authenticated";

grant delete on table "public"."murao_users" to "service_role";

grant insert on table "public"."murao_users" to "service_role";

grant references on table "public"."murao_users" to "service_role";

grant select on table "public"."murao_users" to "service_role";

grant trigger on table "public"."murao_users" to "service_role";

grant truncate on table "public"."murao_users" to "service_role";

grant update on table "public"."murao_users" to "service_role";

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

grant delete on table "public"."payments" to "anon";

grant insert on table "public"."payments" to "anon";

grant references on table "public"."payments" to "anon";

grant select on table "public"."payments" to "anon";

grant trigger on table "public"."payments" to "anon";

grant truncate on table "public"."payments" to "anon";

grant update on table "public"."payments" to "anon";

grant delete on table "public"."payments" to "authenticated";

grant insert on table "public"."payments" to "authenticated";

grant references on table "public"."payments" to "authenticated";

grant select on table "public"."payments" to "authenticated";

grant trigger on table "public"."payments" to "authenticated";

grant truncate on table "public"."payments" to "authenticated";

grant update on table "public"."payments" to "authenticated";

grant delete on table "public"."payments" to "service_role";

grant insert on table "public"."payments" to "service_role";

grant references on table "public"."payments" to "service_role";

grant select on table "public"."payments" to "service_role";

grant trigger on table "public"."payments" to "service_role";

grant truncate on table "public"."payments" to "service_role";

grant update on table "public"."payments" to "service_role";

grant delete on table "public"."profiles" to "postgres";

grant insert on table "public"."profiles" to "postgres";

grant references on table "public"."profiles" to "postgres";

grant select on table "public"."profiles" to "postgres";

grant trigger on table "public"."profiles" to "postgres";

grant truncate on table "public"."profiles" to "postgres";

grant update on table "public"."profiles" to "postgres";

grant delete on table "public"."roles" to "anon";

grant insert on table "public"."roles" to "anon";

grant references on table "public"."roles" to "anon";

grant select on table "public"."roles" to "anon";

grant trigger on table "public"."roles" to "anon";

grant truncate on table "public"."roles" to "anon";

grant update on table "public"."roles" to "anon";

grant delete on table "public"."roles" to "authenticated";

grant insert on table "public"."roles" to "authenticated";

grant references on table "public"."roles" to "authenticated";

grant select on table "public"."roles" to "authenticated";

grant trigger on table "public"."roles" to "authenticated";

grant truncate on table "public"."roles" to "authenticated";

grant update on table "public"."roles" to "authenticated";

grant delete on table "public"."roles" to "service_role";

grant insert on table "public"."roles" to "service_role";

grant references on table "public"."roles" to "service_role";

grant select on table "public"."roles" to "service_role";

grant trigger on table "public"."roles" to "service_role";

grant truncate on table "public"."roles" to "service_role";

grant update on table "public"."roles" to "service_role";

grant delete on table "public"."subscriptions" to "postgres";

grant insert on table "public"."subscriptions" to "postgres";

grant references on table "public"."subscriptions" to "postgres";

grant select on table "public"."subscriptions" to "postgres";

grant trigger on table "public"."subscriptions" to "postgres";

grant truncate on table "public"."subscriptions" to "postgres";

grant update on table "public"."subscriptions" to "postgres";

grant delete on table "public"."tasks" to "anon";

grant insert on table "public"."tasks" to "anon";

grant references on table "public"."tasks" to "anon";

grant select on table "public"."tasks" to "anon";

grant trigger on table "public"."tasks" to "anon";

grant truncate on table "public"."tasks" to "anon";

grant update on table "public"."tasks" to "anon";

grant delete on table "public"."tasks" to "authenticated";

grant insert on table "public"."tasks" to "authenticated";

grant references on table "public"."tasks" to "authenticated";

grant select on table "public"."tasks" to "authenticated";

grant trigger on table "public"."tasks" to "authenticated";

grant truncate on table "public"."tasks" to "authenticated";

grant update on table "public"."tasks" to "authenticated";

grant delete on table "public"."tasks" to "service_role";

grant insert on table "public"."tasks" to "service_role";

grant references on table "public"."tasks" to "service_role";

grant select on table "public"."tasks" to "service_role";

grant trigger on table "public"."tasks" to "service_role";

grant truncate on table "public"."tasks" to "service_role";

grant update on table "public"."tasks" to "service_role";

grant delete on table "public"."tenants" to "anon";

grant insert on table "public"."tenants" to "anon";

grant references on table "public"."tenants" to "anon";

grant select on table "public"."tenants" to "anon";

grant trigger on table "public"."tenants" to "anon";

grant truncate on table "public"."tenants" to "anon";

grant update on table "public"."tenants" to "anon";

grant delete on table "public"."tenants" to "authenticated";

grant insert on table "public"."tenants" to "authenticated";

grant references on table "public"."tenants" to "authenticated";

grant select on table "public"."tenants" to "authenticated";

grant trigger on table "public"."tenants" to "authenticated";

grant truncate on table "public"."tenants" to "authenticated";

grant update on table "public"."tenants" to "authenticated";

grant delete on table "public"."tenants" to "service_role";

grant insert on table "public"."tenants" to "service_role";

grant references on table "public"."tenants" to "service_role";

grant select on table "public"."tenants" to "service_role";

grant trigger on table "public"."tenants" to "service_role";

grant truncate on table "public"."tenants" to "service_role";

grant update on table "public"."tenants" to "service_role";

grant delete on table "public"."units" to "anon";

grant insert on table "public"."units" to "anon";

grant references on table "public"."units" to "anon";

grant select on table "public"."units" to "anon";

grant trigger on table "public"."units" to "anon";

grant truncate on table "public"."units" to "anon";

grant update on table "public"."units" to "anon";

grant delete on table "public"."units" to "authenticated";

grant insert on table "public"."units" to "authenticated";

grant references on table "public"."units" to "authenticated";

grant select on table "public"."units" to "authenticated";

grant trigger on table "public"."units" to "authenticated";

grant truncate on table "public"."units" to "authenticated";

grant update on table "public"."units" to "authenticated";

grant delete on table "public"."units" to "service_role";

grant insert on table "public"."units" to "service_role";

grant references on table "public"."units" to "service_role";

grant select on table "public"."units" to "service_role";

grant trigger on table "public"."units" to "service_role";

grant truncate on table "public"."units" to "service_role";

grant update on table "public"."units" to "service_role";

grant delete on table "public"."users" to "anon";

grant insert on table "public"."users" to "anon";

grant references on table "public"."users" to "anon";

grant select on table "public"."users" to "anon";

grant trigger on table "public"."users" to "anon";

grant truncate on table "public"."users" to "anon";

grant update on table "public"."users" to "anon";

grant delete on table "public"."users" to "authenticated";

grant insert on table "public"."users" to "authenticated";

grant references on table "public"."users" to "authenticated";

grant select on table "public"."users" to "authenticated";

grant trigger on table "public"."users" to "authenticated";

grant truncate on table "public"."users" to "authenticated";

grant update on table "public"."users" to "authenticated";

grant delete on table "public"."users" to "service_role";

grant insert on table "public"."users" to "service_role";

grant references on table "public"."users" to "service_role";

grant select on table "public"."users" to "service_role";

grant trigger on table "public"."users" to "service_role";

grant truncate on table "public"."users" to "service_role";

grant update on table "public"."users" to "service_role";

grant delete on table "public"."x402_payments" to "postgres";

grant insert on table "public"."x402_payments" to "postgres";

grant references on table "public"."x402_payments" to "postgres";

grant select on table "public"."x402_payments" to "postgres";

grant trigger on table "public"."x402_payments" to "postgres";

grant truncate on table "public"."x402_payments" to "postgres";

grant update on table "public"."x402_payments" to "postgres";


  create policy "Allow authenticated insert"
  on "public"."activity_logs"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated read"
  on "public"."activity_logs"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated read"
  on "public"."buildings"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated read"
  on "public"."collections"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated read"
  on "public"."contracts"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated read"
  on "public"."departments"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated insert"
  on "public"."emergencies"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated read"
  on "public"."emergencies"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated read"
  on "public"."iot_devices"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated insert"
  on "public"."maintenance_requests"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated read"
  on "public"."maintenance_requests"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated read"
  on "public"."move_outs"
  as permissive
  for select
  to authenticated
using (true);



  create policy "murao_allow_insert"
  on "public"."murao_activity_logs"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "murao_allow_read"
  on "public"."murao_activity_logs"
  as permissive
  for select
  to authenticated
using (true);



  create policy "murao_allow_read"
  on "public"."murao_buildings"
  as permissive
  for select
  to authenticated
using (true);



  create policy "murao_allow_read"
  on "public"."murao_collections"
  as permissive
  for select
  to authenticated
using (true);



  create policy "murao_allow_read"
  on "public"."murao_contracts"
  as permissive
  for select
  to authenticated
using (true);



  create policy "murao_allow_read"
  on "public"."murao_departments"
  as permissive
  for select
  to authenticated
using (true);



  create policy "murao_allow_insert"
  on "public"."murao_emergencies"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "murao_allow_read"
  on "public"."murao_emergencies"
  as permissive
  for select
  to authenticated
using (true);



  create policy "murao_allow_read"
  on "public"."murao_iot_devices"
  as permissive
  for select
  to authenticated
using (true);



  create policy "murao_allow_insert"
  on "public"."murao_maintenance_requests"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "murao_allow_read"
  on "public"."murao_maintenance_requests"
  as permissive
  for select
  to authenticated
using (true);



  create policy "murao_allow_read"
  on "public"."murao_move_outs"
  as permissive
  for select
  to authenticated
using (true);



  create policy "murao_allow_insert"
  on "public"."murao_payments"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "murao_allow_read"
  on "public"."murao_payments"
  as permissive
  for select
  to authenticated
using (true);



  create policy "murao_allow_read"
  on "public"."murao_roles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "murao_allow_insert"
  on "public"."murao_tasks"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "murao_allow_read"
  on "public"."murao_tasks"
  as permissive
  for select
  to authenticated
using (true);



  create policy "murao_allow_read"
  on "public"."murao_tenants"
  as permissive
  for select
  to authenticated
using (true);



  create policy "murao_allow_read"
  on "public"."murao_units"
  as permissive
  for select
  to authenticated
using (true);



  create policy "murao_allow_read"
  on "public"."murao_users"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated insert"
  on "public"."payments"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated read"
  on "public"."payments"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated read"
  on "public"."roles"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated insert"
  on "public"."tasks"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Allow authenticated read"
  on "public"."tasks"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated read"
  on "public"."tenants"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated read"
  on "public"."units"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Allow authenticated read"
  on "public"."users"
  as permissive
  for select
  to authenticated
using (true);


CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.buildings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.collections FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.departments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.emergencies FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.iot_devices FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.maintenance_requests FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.move_outs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER murao_set_updated_at BEFORE UPDATE ON public.murao_buildings FOR EACH ROW EXECUTE FUNCTION public.murao_handle_updated_at();

CREATE TRIGGER trg_embed_buildings AFTER INSERT OR DELETE OR UPDATE ON public.murao_buildings FOR EACH ROW EXECUTE FUNCTION public.trigger_embed_webhook();

CREATE TRIGGER murao_set_updated_at BEFORE UPDATE ON public.murao_collections FOR EACH ROW EXECUTE FUNCTION public.murao_handle_updated_at();

CREATE TRIGGER trg_embed_collections AFTER INSERT OR DELETE OR UPDATE ON public.murao_collections FOR EACH ROW EXECUTE FUNCTION public.trigger_embed_webhook();

CREATE TRIGGER murao_set_updated_at BEFORE UPDATE ON public.murao_contracts FOR EACH ROW EXECUTE FUNCTION public.murao_handle_updated_at();

CREATE TRIGGER trg_embed_contracts AFTER INSERT OR DELETE OR UPDATE ON public.murao_contracts FOR EACH ROW EXECUTE FUNCTION public.trigger_embed_webhook();

CREATE TRIGGER murao_set_updated_at BEFORE UPDATE ON public.murao_departments FOR EACH ROW EXECUTE FUNCTION public.murao_handle_updated_at();

CREATE TRIGGER murao_set_updated_at BEFORE UPDATE ON public.murao_emergencies FOR EACH ROW EXECUTE FUNCTION public.murao_handle_updated_at();

CREATE TRIGGER trg_embed_emergencies AFTER INSERT OR DELETE OR UPDATE ON public.murao_emergencies FOR EACH ROW EXECUTE FUNCTION public.trigger_embed_webhook();

CREATE TRIGGER murao_set_updated_at BEFORE UPDATE ON public.murao_iot_devices FOR EACH ROW EXECUTE FUNCTION public.murao_handle_updated_at();

CREATE TRIGGER murao_set_updated_at BEFORE UPDATE ON public.murao_maintenance_requests FOR EACH ROW EXECUTE FUNCTION public.murao_handle_updated_at();

CREATE TRIGGER trg_embed_maintenance AFTER INSERT OR DELETE OR UPDATE ON public.murao_maintenance_requests FOR EACH ROW EXECUTE FUNCTION public.trigger_embed_webhook();

CREATE TRIGGER murao_set_updated_at BEFORE UPDATE ON public.murao_move_outs FOR EACH ROW EXECUTE FUNCTION public.murao_handle_updated_at();

CREATE TRIGGER murao_set_updated_at BEFORE UPDATE ON public.murao_payments FOR EACH ROW EXECUTE FUNCTION public.murao_handle_updated_at();

CREATE TRIGGER trg_embed_payments AFTER INSERT OR DELETE OR UPDATE ON public.murao_payments FOR EACH ROW EXECUTE FUNCTION public.trigger_embed_webhook();

CREATE TRIGGER murao_set_updated_at BEFORE UPDATE ON public.murao_roles FOR EACH ROW EXECUTE FUNCTION public.murao_handle_updated_at();

CREATE TRIGGER murao_set_updated_at BEFORE UPDATE ON public.murao_tasks FOR EACH ROW EXECUTE FUNCTION public.murao_handle_updated_at();

CREATE TRIGGER murao_set_updated_at BEFORE UPDATE ON public.murao_tenants FOR EACH ROW EXECUTE FUNCTION public.murao_handle_updated_at();

CREATE TRIGGER trg_embed_tenants AFTER INSERT OR DELETE OR UPDATE ON public.murao_tenants FOR EACH ROW EXECUTE FUNCTION public.trigger_embed_webhook();

CREATE TRIGGER murao_set_updated_at BEFORE UPDATE ON public.murao_units FOR EACH ROW EXECUTE FUNCTION public.murao_handle_updated_at();

CREATE TRIGGER trg_embed_units AFTER INSERT OR DELETE OR UPDATE ON public.murao_units FOR EACH ROW EXECUTE FUNCTION public.trigger_embed_webhook();

CREATE TRIGGER murao_set_updated_at BEFORE UPDATE ON public.murao_users FOR EACH ROW EXECUTE FUNCTION public.murao_handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.tenants FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


