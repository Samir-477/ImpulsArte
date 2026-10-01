-- Reset only tables and policies created by this repository.
-- Supabase Auth users, Storage system tables, and other public tables remain.
-- Apply 20260930000000_init.sql immediately afterward to rebuild the app.
begin;

drop trigger if exists on_auth_user_created on auth.users;
drop policy if exists brief_storage_insert on storage.objects;
drop policy if exists brief_storage_read on storage.objects;

drop table if exists
  public.audit_events,
  public.email_outbox,
  public.notifications,
  public.milestones,
  public.projects,
  public.quotes,
  public.messages,
  public.enquiry_attachments,
  public.assignments,
  public.enquiries,
  public.developer_invitations,
  public.service_localizations,
  public.services,
  public.legal_acceptances,
  public.legal_documents,
  public.profiles
cascade;

drop function if exists public.on_enquiry_created();
drop function if exists public.on_message_created();
drop function if exists public.on_quote_sent();
drop function if exists public.on_assignment_created();
drop function if exists public.on_invitation_created();
drop function if exists public.on_milestone_changed();
drop function if exists public.decide_quote(uuid,text);
drop function if exists public.claim_developer_invitation(text,text,text[],text,text);
drop function if exists public.assign_developer(uuid,uuid);
drop function if exists public.send_quote(uuid,text,numeric);
drop function if exists public.start_project(uuid);
drop function if exists public.review_developer(uuid,boolean);
drop function if exists public.claim_email_outbox(integer);
drop function if exists public.is_enquiry_party(uuid);
drop function if exists public.queue_notification(uuid,text,text,text);
drop function if exists public.is_admin();
drop function if exists public.create_profile_for_new_user();

commit;
