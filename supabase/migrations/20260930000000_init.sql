create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'client' check (role in ('client','developer','admin')),
  developer_status text check (developer_status in ('pending','approved','rejected')),
  country_code text,
  developer_city text,
  developer_skills text[] not null default '{}',
  developer_portfolio_url text,
  developer_bio text,
  created_at timestamptz not null default now()
);

create or replace function public.create_profile_for_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
for each row execute function public.create_profile_for_new_user();

-- A public-schema reset keeps Supabase Auth users. Restore their client profiles.
insert into public.profiles(id, full_name)
select id, raw_user_meta_data ->> 'full_name' from auth.users
on conflict (id) do nothing;

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.profiles where id = auth.uid() and role = 'admin')
$$;

create table public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('terms','privacy')),
  locale text not null check (locale in ('es','en')),
  version integer not null check (version > 0),
  body text not null,
  published_at timestamptz,
  unique(kind,locale,version)
);
create table public.legal_acceptances (
  user_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind = 'terms'),
  version integer not null,
  accepted_at timestamptz not null default now(),
  primary key(user_id,kind,version)
);

create table public.services (
  key text primary key check (key in ('websites','web-apps','maintenance')),
  starting_price_ars numeric(14,2) check (starting_price_ars >= 0),
  published boolean not null default true,
  updated_at timestamptz not null default now()
);
create table public.service_localizations (
  service_key text not null references public.services(key) on delete cascade,
  locale text not null check (locale in ('es','en')),
  name text not null,
  eyebrow text not null,
  summary text not null,
  description text not null,
  features text[] not null default '{}',
  primary key(service_key,locale)
);

create table public.developer_invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  invited_by uuid not null references public.profiles(id),
  expires_at timestamptz not null,
  status text not null default 'invited' check (status in ('invited','pending_review','approved','rejected')),
  user_id uuid references public.profiles(id),
  reviewed_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);
create unique index developer_invitation_active_email on public.developer_invitations(lower(email)) where status in ('invited','pending_review');

create table public.enquiries (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles(id),
  service_key text not null references public.services(key),
  title text not null check (char_length(title) between 5 and 140),
  summary text not null check (char_length(summary) between 30 and 5000),
  timeline text,
  status text not null default 'submitted' check (status in ('submitted','reviewing','quoted','approved','active','closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index enquiries_client_created on public.enquiries(client_id, created_at desc);

create table public.assignments (
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  developer_id uuid not null references public.profiles(id),
  assigned_by uuid not null references public.profiles(id),
  assigned_at timestamptz not null default now(),
  primary key(enquiry_id,developer_id)
);

create or replace function public.is_enquiry_party(enquiry uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select public.is_admin() or exists(select 1 from public.enquiries where id = enquiry and client_id = auth.uid())
    or exists(select 1 from public.assignments a join public.profiles p on p.id = a.developer_id
      where a.enquiry_id = enquiry and a.developer_id = auth.uid() and p.role = 'developer' and p.developer_status = 'approved')
$$;

create table public.enquiry_attachments (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  object_path text not null unique,
  file_name text not null,
  content_type text not null,
  size_bytes bigint not null check (size_bytes between 1 and 10485760),
  uploaded_by uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null check (char_length(body) between 1 and 4000),
  created_at timestamptz not null default now()
);
create index messages_enquiry_created on public.messages(enquiry_id, created_at);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references public.enquiries(id) on delete cascade,
  revision integer not null check (revision > 0),
  scope text not null,
  amount_ars numeric(14,2) not null check (amount_ars > 0),
  status text not null default 'draft' check (status in ('draft','sent','client_approved','declined','withdrawn','superseded')),
  created_by uuid not null references public.profiles(id),
  sent_at timestamptz,
  decided_at timestamptz,
  created_at timestamptz not null default now(),
  unique(enquiry_id,revision)
);
create unique index quotes_one_live on public.quotes(enquiry_id) where status in ('sent','client_approved');

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null unique references public.enquiries(id),
  quote_id uuid not null unique references public.quotes(id),
  status text not null default 'active' check (status in ('active','on_hold','completed','cancelled')),
  started_by uuid not null references public.profiles(id),
  started_at timestamptz not null default now()
);
create table public.milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  status text not null default 'pending' check (status in ('pending','active','done')),
  position integer not null default 0,
  updated_at timestamptz not null default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null,
  title text not null,
  href text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create table public.email_outbox (
  id uuid primary key default gen_random_uuid(),
  recipient text not null,
  template text not null,
  payload jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending','processing','sent','failed')),
  attempts integer not null default 0,
  next_attempt_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);
create table public.audit_events (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.legal_documents enable row level security;
alter table public.legal_acceptances enable row level security;
alter table public.services enable row level security;
alter table public.service_localizations enable row level security;
alter table public.developer_invitations enable row level security;
alter table public.enquiries enable row level security;
alter table public.assignments enable row level security;
alter table public.enquiry_attachments enable row level security;
alter table public.messages enable row level security;
alter table public.quotes enable row level security;
alter table public.projects enable row level security;
alter table public.milestones enable row level security;
alter table public.notifications enable row level security;
alter table public.email_outbox enable row level security;
alter table public.audit_events enable row level security;

create policy profiles_read on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());
create policy profiles_admin_update on public.profiles for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy legal_read on public.legal_documents for select to anon,authenticated using (published_at is not null or public.is_admin());
create policy legal_admin_write on public.legal_documents for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy acceptance_read on public.legal_acceptances for select to authenticated using (user_id = auth.uid() or public.is_admin());
create policy acceptance_insert on public.legal_acceptances for insert to authenticated with check (user_id = auth.uid() and exists(select 1 from public.legal_documents where kind = 'terms' and version = legal_acceptances.version and published_at is not null));
create policy services_read on public.services for select to anon,authenticated using (published or public.is_admin());
create policy services_admin_write on public.services for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy localizations_read on public.service_localizations for select to anon,authenticated using (exists(select 1 from public.services where key = service_key and published) or public.is_admin());
create policy localizations_admin_write on public.service_localizations for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy invites_admin on public.developer_invitations for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy invites_read_self on public.developer_invitations for select to authenticated using (user_id = auth.uid());
create policy enquiries_read on public.enquiries for select to authenticated using (public.is_enquiry_party(id));
create policy enquiries_client_insert on public.enquiries for insert to authenticated with check (client_id = auth.uid() and status = 'submitted' and exists(select 1 from public.profiles where id = auth.uid() and role = 'client') and exists(select 1 from public.services where key = service_key and published) and exists(select 1 from public.legal_acceptances where user_id = auth.uid() and kind = 'terms' and version = (select max(version) from public.legal_documents where kind = 'terms' and published_at is not null)));
create policy enquiries_admin_update on public.enquiries for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy assignments_read on public.assignments for select to authenticated using (public.is_enquiry_party(enquiry_id));
create policy assignments_admin_write on public.assignments for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy attachments_read on public.enquiry_attachments for select to authenticated using (public.is_enquiry_party(enquiry_id));
create policy attachments_client_insert on public.enquiry_attachments for insert to authenticated with check (uploaded_by = auth.uid() and exists(select 1 from public.enquiries where id = enquiry_id and client_id = auth.uid()) and object_path like auth.uid()::text || '/' || enquiry_id::text || '/%');
create policy messages_read on public.messages for select to authenticated using (public.is_enquiry_party(enquiry_id));
create policy messages_insert on public.messages for insert to authenticated with check (sender_id = auth.uid() and public.is_enquiry_party(enquiry_id));
create policy quotes_read on public.quotes for select to authenticated using (public.is_enquiry_party(enquiry_id) and (status <> 'draft' or public.is_admin()));
create policy quotes_admin_write on public.quotes for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy projects_read on public.projects for select to authenticated using (public.is_enquiry_party(enquiry_id));
create policy projects_admin_write on public.projects for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy milestones_read on public.milestones for select to authenticated using (exists(select 1 from public.projects where id = project_id and public.is_enquiry_party(enquiry_id)));
create policy milestones_admin_write on public.milestones for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy notifications_read on public.notifications for select to authenticated using (user_id = auth.uid());
create policy notifications_update on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke update on public.notifications from authenticated;
grant update(read_at) on public.notifications to authenticated;
create policy outbox_admin_read on public.email_outbox for select to authenticated using (public.is_admin());
create policy audit_admin_read on public.audit_events for select to authenticated using (public.is_admin());

grant select on public.services,public.service_localizations,public.legal_documents to anon;
grant select on public.profiles,public.legal_acceptances,public.developer_invitations,public.enquiries,public.assignments,public.enquiry_attachments,public.messages,public.quotes,public.projects,public.milestones,public.notifications,public.service_localizations to authenticated;
grant insert on public.legal_acceptances,public.enquiries,public.enquiry_attachments,public.messages,public.developer_invitations,public.milestones,public.service_localizations to authenticated;
grant select,insert,update on public.services,public.quotes,public.projects,public.assignments,public.legal_documents to authenticated;
grant update on public.profiles,public.enquiries,public.milestones,public.service_localizations,public.developer_invitations to authenticated;

insert into public.services(key) values ('websites'),('web-apps'),('maintenance');
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('brief-attachments','brief-attachments',false,10485760,array['application/pdf','image/png','image/jpeg','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;
create policy brief_storage_insert on storage.objects for insert to authenticated
with check (bucket_id = 'brief-attachments' and (storage.foldername(name))[1] = auth.uid()::text
  and exists(select 1 from public.enquiries where id = case when (storage.foldername(name))[2] ~ '^[0-9a-fA-F-]{36}$' then ((storage.foldername(name))[2])::uuid else null end and client_id = auth.uid()));
create policy brief_storage_read on storage.objects for select to authenticated
using (bucket_id = 'brief-attachments' and public.is_enquiry_party(case when (storage.foldername(name))[2] ~ '^[0-9a-fA-F-]{36}$' then ((storage.foldername(name))[2])::uuid else null end));

create or replace function public.decide_quote(quote uuid, decision text) returns void
language plpgsql security definer set search_path = public as $$
declare q public.quotes%rowtype;
begin
  if decision not in ('client_approved','declined') then raise exception 'Invalid decision'; end if;
  select * into q from public.quotes where id = quote for update;
  if not found or q.status <> 'sent' then raise exception 'Quote unavailable'; end if;
  if not exists(select 1 from public.enquiries where id = q.enquiry_id and client_id = auth.uid()) then raise exception 'Forbidden'; end if;
  update public.quotes set status = decision, decided_at = now() where id = quote;
  update public.enquiries set status = case when decision = 'client_approved' then 'approved' else 'reviewing' end, updated_at = now() where id = q.enquiry_id;
  insert into public.audit_events(actor_id,action,entity_type,entity_id) values(auth.uid(),decision,'quote',quote);
  perform public.queue_notification(id,'quote_decision','Client responded to a proposal','/admin/enquiries/' || q.enquiry_id)
    from public.profiles where role = 'admin';
end $$;
revoke all on function public.decide_quote(uuid,text) from public;
grant execute on function public.decide_quote(uuid,text) to authenticated;

create or replace function public.claim_developer_invitation(developer_name text, city text, skills text[], portfolio_url text, bio text) returns void
language plpgsql security definer set search_path = public as $$
declare invite public.developer_invitations%rowtype;
begin
  if auth.uid() is null or auth.jwt() ->> 'email' is null then raise exception 'Sign in required'; end if;
  if char_length(trim(developer_name)) < 2 or char_length(trim(city)) < 2 or cardinality(skills) < 1 or char_length(trim(bio)) < 30 then raise exception 'Complete your developer profile'; end if;
  if portfolio_url is not null and portfolio_url <> '' and portfolio_url !~ '^https://' then raise exception 'Portfolio URL must use HTTPS'; end if;
  select * into invite from public.developer_invitations
    where lower(email) = lower(auth.jwt() ->> 'email') and status = 'invited' and expires_at > now()
    order by created_at desc limit 1 for update;
  if not found then raise exception 'No active invitation for this email'; end if;
  update public.developer_invitations set status = 'pending_review', user_id = auth.uid() where id = invite.id;
  update public.profiles set role = 'developer', developer_status = 'pending', country_code = 'IN', full_name = trim(developer_name),
    developer_city = trim(city), developer_skills = skills, developer_portfolio_url = nullif(portfolio_url,''), developer_bio = trim(bio) where id = auth.uid();
end $$;
revoke all on function public.claim_developer_invitation(text,text,text[],text,text) from public;
grant execute on function public.claim_developer_invitation(text,text,text[],text,text) to authenticated;

create or replace function public.assign_developer(enquiry uuid, developer uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if not public.is_admin() then raise exception 'Forbidden'; end if;
  if not exists(select 1 from public.profiles where id = developer and role = 'developer' and developer_status = 'approved' and country_code = 'IN') then raise exception 'Developer is not approved'; end if;
  insert into public.assignments(enquiry_id,developer_id,assigned_by) values(enquiry,developer,auth.uid()) on conflict do nothing;
  update public.enquiries set status = 'reviewing', updated_at = now() where id = enquiry and status = 'submitted';
  insert into public.audit_events(actor_id,action,entity_type,entity_id) values(auth.uid(),'assigned_developer','enquiry',enquiry);
end $$;
revoke all on function public.assign_developer(uuid,uuid) from public;
grant execute on function public.assign_developer(uuid,uuid) to authenticated;

create or replace function public.send_quote(enquiry uuid, quote_scope text, amount numeric) returns uuid
language plpgsql security definer set search_path = public as $$
declare next_revision integer; new_id uuid;
begin
  if not public.is_admin() then raise exception 'Forbidden'; end if;
  if amount <= 0 or char_length(quote_scope) < 20 then raise exception 'Invalid quote'; end if;
  perform 1 from public.enquiries where id = enquiry for update;
  if not found then raise exception 'Enquiry not found'; end if;
  if exists(select 1 from public.enquiries where id = enquiry and status in ('active','closed')) then raise exception 'Enquiry is already active or closed'; end if;
  update public.quotes set status = 'superseded' where enquiry_id = enquiry and status in ('sent','client_approved');
  select coalesce(max(revision),0) + 1 into next_revision from public.quotes where enquiry_id = enquiry;
  insert into public.quotes(enquiry_id,revision,scope,amount_ars,status,created_by,sent_at)
    values(enquiry,next_revision,quote_scope,amount,'sent',auth.uid(),now()) returning id into new_id;
  update public.enquiries set status = 'quoted', updated_at = now() where id = enquiry;
  insert into public.audit_events(actor_id,action,entity_type,entity_id) values(auth.uid(),'sent_quote','quote',new_id);
  return new_id;
end $$;
revoke all on function public.send_quote(uuid,text,numeric) from public;
grant execute on function public.send_quote(uuid,text,numeric) to authenticated;

create or replace function public.start_project(quote uuid) returns uuid
language plpgsql security definer set search_path = public as $$
declare q public.quotes%rowtype; project_id uuid;
begin
  if not public.is_admin() then raise exception 'Forbidden'; end if;
  select * into q from public.quotes where id = quote and status = 'client_approved' for update;
  if not found then raise exception 'Approved quote not found'; end if;
  insert into public.projects(enquiry_id,quote_id,started_by) values(q.enquiry_id,q.id,auth.uid())
    on conflict(enquiry_id) do update set enquiry_id = excluded.enquiry_id returning id into project_id;
  update public.enquiries set status = 'active', updated_at = now() where id = q.enquiry_id;
  insert into public.audit_events(actor_id,action,entity_type,entity_id) values(auth.uid(),'started_project','project',project_id);
  perform public.queue_notification(client_id,'project_start','Your project has started','/dashboard/briefs/' || q.enquiry_id)
    from public.enquiries where id = q.enquiry_id;
  return project_id;
end $$;
revoke all on function public.start_project(uuid) from public;
grant execute on function public.start_project(uuid) to authenticated;

create or replace function public.review_developer(invitation uuid, approval boolean) returns void
language plpgsql security definer set search_path = public as $$
declare invite public.developer_invitations%rowtype;
begin
  if not public.is_admin() then raise exception 'Forbidden'; end if;
  select * into invite from public.developer_invitations where id = invitation and status = 'pending_review' for update;
  if not found or invite.user_id is null then raise exception 'Pending invitation not found'; end if;
  if not exists(select 1 from public.profiles where id = invite.user_id and country_code = 'IN') then raise exception 'India eligibility not confirmed'; end if;
  update public.developer_invitations set status = case when approval then 'approved' else 'rejected' end, reviewed_by = auth.uid() where id = invitation;
  update public.profiles set developer_status = case when approval then 'approved' else 'rejected' end where id = invite.user_id;
  insert into public.audit_events(actor_id,action,entity_type,entity_id) values(auth.uid(),case when approval then 'approved_developer' else 'rejected_developer' end,'developer_invitation',invitation);
  perform public.queue_notification(invite.user_id,'developer_review',case when approval then 'Your developer account is approved' else 'Your developer application was not approved' end,'/developer');
end $$;
revoke all on function public.review_developer(uuid,boolean) from public;
grant execute on function public.review_developer(uuid,boolean) to authenticated;

create or replace function public.queue_notification(recipient uuid, event_type text, event_title text, event_href text) returns void
language plpgsql security definer set search_path = public as $$
declare recipient_email text;
begin
  insert into public.notifications(user_id,type,title,href) values(recipient,event_type,event_title,event_href);
  select email into recipient_email from auth.users where id = recipient;
  if recipient_email is not null then
    insert into public.email_outbox(recipient,template,payload)
    values(recipient_email,'event',jsonb_build_object('title',event_title,'href',event_href));
  end if;
end $$;
revoke all on function public.queue_notification(uuid,text,text,text) from public;

create or replace function public.on_enquiry_created() returns trigger
language plpgsql security definer set search_path = public as $$
declare admin_id uuid;
begin
  for admin_id in select id from public.profiles where role = 'admin' loop
    perform public.queue_notification(admin_id,'new_enquiry','New project brief: ' || new.title,'/admin/enquiries/' || new.id);
  end loop;
  return new;
end $$;
create trigger enquiry_created_notice after insert on public.enquiries for each row execute function public.on_enquiry_created();

create or replace function public.on_message_created() returns trigger
language plpgsql security definer set search_path = public as $$
declare recipient_id uuid;
begin
  for recipient_id in
    select distinct id from (
      select client_id as id from public.enquiries where id = new.enquiry_id
      union select developer_id from public.assignments where enquiry_id = new.enquiry_id
      union select id from public.profiles where role = 'admin'
    ) parties where id <> new.sender_id
  loop
    perform public.queue_notification(recipient_id,'message','New message about your project','/dashboard/briefs/' || new.enquiry_id);
  end loop;
  return new;
end $$;
create trigger message_created_notice after insert on public.messages for each row execute function public.on_message_created();

create or replace function public.on_quote_sent() returns trigger
language plpgsql security definer set search_path = public as $$
declare recipient_id uuid;
begin
  if new.status = 'sent' then
    select client_id into recipient_id from public.enquiries where id = new.enquiry_id;
    perform public.queue_notification(recipient_id,'quote','Your project proposal is ready','/dashboard/briefs/' || new.enquiry_id);
  end if;
  return new;
end $$;
create trigger quote_sent_notice after insert on public.quotes for each row execute function public.on_quote_sent();

create or replace function public.on_assignment_created() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  perform public.queue_notification(new.developer_id,'assignment','You have a new assignment','/developer/assignments/' || new.enquiry_id);
  return new;
end $$;
create trigger assignment_created_notice after insert on public.assignments for each row execute function public.on_assignment_created();

create or replace function public.on_invitation_created() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.email_outbox(recipient,template,payload)
    values(new.email,'developer_invite',jsonb_build_object('href','/developer/onboarding'));
  return new;
end $$;
create trigger invitation_created_notice after insert on public.developer_invitations for each row execute function public.on_invitation_created();

create or replace function public.claim_email_outbox(batch_size integer default 20)
returns setof public.email_outbox language sql security definer set search_path = public as $$
  with due as (
    select id from public.email_outbox
    where status in ('pending','failed','processing') and attempts < 5 and next_attempt_at <= now()
    order by created_at limit least(greatest(batch_size,1),50) for update skip locked
  )
  update public.email_outbox e set status = 'processing', attempts = attempts + 1,
    next_attempt_at = now() + interval '5 minutes'
  from due where e.id = due.id returning e.*
$$;
revoke all on function public.claim_email_outbox(integer) from public;
grant execute on function public.claim_email_outbox(integer) to service_role;

create or replace function public.on_milestone_changed() returns trigger
language plpgsql security definer set search_path = public as $$
declare owner_id uuid; enquiry_id uuid;
begin
  if tg_op = 'UPDATE' then
    if new.status = old.status then return new; end if;
  end if;
  select e.client_id,e.id into owner_id,enquiry_id from public.projects p join public.enquiries e on e.id = p.enquiry_id where p.id = new.project_id;
  if owner_id is not null then
    perform public.queue_notification(owner_id,'milestone','A project milestone was updated','/dashboard/briefs/' || enquiry_id);
  end if;
  return new;
end $$;
create trigger milestone_notice after insert or update on public.milestones for each row execute function public.on_milestone_changed();
