-- Apply to a dedicated Crestlane Supabase project, never the Command Center or DMV DB.
begin;
create table public.crestlane_accounts(id uuid primary key references auth.users(id) on delete cascade, name text not null default '', role text not null default 'client' check(role in ('client','staff')));
create function public.crestlane_staff() returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from crestlane_accounts where id = auth.uid() and role = 'staff') $$;
create table public.crestlane_leads(id uuid primary key default gen_random_uuid(), kind text not null check(kind in ('quote','consultation','chat')), name text not null, email text not null, details jsonb not null, status text not null default 'new' check(status in ('new','reviewing','approved','closed')), scheduled_at timestamptz, meeting_url text, notification_status text not null default 'pending', created_at timestamptz not null default now());
create table public.crestlane_conversations(id uuid primary key default gen_random_uuid(), lead_id uuid references crestlane_leads(id), token_hash text not null unique, name text not null, email text not null, staff_read_at timestamptz not null default '1970-01-01', created_at timestamptz not null default now());
create table public.crestlane_chat_messages(id uuid primary key default gen_random_uuid(), conversation_id uuid not null references crestlane_conversations(id) on delete cascade, sender text not null check(sender in ('visitor','staff')), body text not null check(length(body) between 1 and 4000), created_at timestamptz not null default now());
create table public.crestlane_presence(user_id uuid primary key references crestlane_accounts(id) on delete cascade, available boolean not null default false, updated_at timestamptz not null default now());
create table public.crestlane_projects(id uuid primary key default gen_random_uuid(), client_id uuid not null references crestlane_accounts(id), title text not null, status text not null default 'Planning', description text not null default '', created_at timestamptz not null default now());
create table public.crestlane_milestones(id uuid primary key default gen_random_uuid(), project_id uuid not null references crestlane_projects(id) on delete cascade, title text not null, status text not null default 'Planned' check(status in ('Planned','In progress','Ready for approval','Approved','Changes requested')), due_date date, client_feedback text, created_at timestamptz not null default now());
create table public.crestlane_project_messages(id uuid primary key default gen_random_uuid(), project_id uuid not null references crestlane_projects(id) on delete cascade, sender_id uuid not null references crestlane_accounts(id), body text not null check(length(body) between 1 and 4000), created_at timestamptz not null default now());
create table public.crestlane_files(id uuid primary key default gen_random_uuid(), project_id uuid not null references crestlane_projects(id) on delete cascade, uploaded_by uuid not null references crestlane_accounts(id), path text not null unique, name text not null, size integer not null check(size between 1 and 4194304), created_at timestamptz not null default now());
create table public.crestlane_invoices(id uuid primary key default gen_random_uuid(), project_id uuid not null references crestlane_projects(id) on delete cascade, label text not null, amount_minor bigint not null check(amount_minor >= 0), currency text not null check(currency ~ '^[A-Z]{3}$'), status text not null default 'Unpaid' check(status in ('Unpaid','Paid','Void')), created_at timestamptz not null default now());
create table public.crestlane_faqs(id uuid primary key default gen_random_uuid(), question text not null, answer text not null, published boolean not null default false);
insert into crestlane_faqs(question,answer,published) values
('What does Crestlane build?', 'Business websites, custom software and portals, automation, website security, and ongoing support. We agree on the scope with you before starting.',true),
('How much will my project cost?', 'Pricing depends on your requirements. Share your goals and budget in the quote builder, and our team will prepare a proposal. No fixed price or delivery date is promised here.',true),
('What is the development process?', 'We learn about your work, agree on scope, design the experience, then build, launch, and improve with your input.',true);
create table public.crestlane_rate_limits(key text primary key, started_at timestamptz not null default now(), hits integer not null default 1);
create function public.crestlane_take_limit(p_key text, p_limit integer, p_window integer) returns boolean language plpgsql security definer set search_path = public as $$
declare n integer; begin
insert into crestlane_rate_limits(key) values(p_key) on conflict(key) do update set hits=case when crestlane_rate_limits.started_at < now()-make_interval(secs=>p_window) then 1 else crestlane_rate_limits.hits+1 end, started_at=case when crestlane_rate_limits.started_at < now()-make_interval(secs=>p_window) then now() else crestlane_rate_limits.started_at end returning hits into n;
-- Opportunistically remove stale entries without growing an unbounded IP history.
delete from crestlane_rate_limits where started_at < now()-interval '2 days';
return n <= p_limit; end $$;
create function public.crestlane_project_access(p_id uuid) returns boolean language sql stable security definer set search_path = public as $$ select exists(select 1 from crestlane_projects where id=p_id and (client_id=auth.uid() or crestlane_staff())) $$;
create function public.crestlane_approve(p_id uuid,p_status text,p_feedback text) returns void language plpgsql security definer set search_path=public as $$ begin
if p_status not in ('Approved','Changes requested') or length(coalesce(p_feedback,''))>1800 then raise exception 'Invalid approval'; end if;
update crestlane_milestones m set status=p_status,client_feedback=p_feedback where m.id=p_id and m.status='Ready for approval' and exists(select 1 from crestlane_projects p where p.id=m.project_id and p.client_id=auth.uid());
if not found then raise exception 'Approval unavailable'; end if;
end $$;
-- One transaction creates the lead, capability and initial chat message.
create function public.crestlane_start_chat(p_hash text,p_name text,p_email text,p_body text) returns uuid language plpgsql security definer set search_path=public as $$
declare lead_id uuid; conversation_id uuid; begin
if p_hash !~ '^[a-f0-9]{64}$' or length(p_name) not between 1 and 100 or length(p_email) not between 3 and 254 or length(p_body) not between 1 and 4000 then raise exception 'Invalid conversation'; end if;
insert into crestlane_leads(kind,name,email,details) values('chat',p_name,p_email,jsonb_build_object('description',p_body)) returning id into lead_id;
insert into crestlane_conversations(lead_id,token_hash,name,email) values(lead_id,p_hash,p_name,p_email) returning id into conversation_id;
insert into crestlane_chat_messages(conversation_id,sender,body) values(conversation_id,'visitor',p_body);
return conversation_id; end $$;
revoke all on function crestlane_start_chat(text,text,text,text) from public,anon,authenticated;
grant execute on function crestlane_start_chat(text,text,text,text) to service_role;
-- No anonymous table access. Staff roles can only be assigned administratively.
do $$ declare t text; begin foreach t in array array['accounts','leads','conversations','chat_messages','presence','projects','milestones','project_messages','files','invoices','faqs','rate_limits'] loop
execute format('alter table public.%I enable row level security','crestlane_'||t);
execute format('revoke all on public.%I from anon,authenticated','crestlane_'||t);
execute format('grant all on public.%I to service_role','crestlane_'||t);
end loop; end $$;
grant select on crestlane_accounts to authenticated;
create policy accounts_read on crestlane_accounts for select to authenticated using(id=auth.uid() or crestlane_staff());
-- Staff writes are explicit; clients cannot change ownership, roles, invoices, milestones or projects.
do $$ declare t text; begin foreach t in array array['leads','conversations','chat_messages','presence','projects','milestones','project_messages','files','invoices','faqs'] loop
execute format('grant select,insert,update,delete on public.%I to authenticated','crestlane_'||t);
execute format('create policy staff_all on public.%I for all to authenticated using(public.crestlane_staff()) with check(public.crestlane_staff())','crestlane_'||t);
end loop; end $$;
create policy projects_read on crestlane_projects for select to authenticated using(client_id=auth.uid());
create policy milestones_read on crestlane_milestones for select to authenticated using(crestlane_project_access(project_id));
create policy invoices_read on crestlane_invoices for select to authenticated using(crestlane_project_access(project_id));
create policy files_read on crestlane_files for select to authenticated using(crestlane_project_access(project_id));
create policy files_insert on crestlane_files for insert to authenticated with check(crestlane_project_access(project_id) and uploaded_by=auth.uid() and split_part(path,'/',1)=project_id::text);
create policy messages_read on crestlane_project_messages for select to authenticated using(crestlane_project_access(project_id));
create policy messages_insert on crestlane_project_messages for insert to authenticated with check(crestlane_project_access(project_id) and sender_id=auth.uid());
revoke all on function crestlane_take_limit(text,integer,integer) from public,anon,authenticated;
grant execute on function crestlane_take_limit(text,integer,integer) to service_role;
revoke all on function crestlane_staff(),crestlane_project_access(uuid),crestlane_approve(uuid,text,text) from public,anon;
grant execute on function crestlane_staff(),crestlane_project_access(uuid),crestlane_approve(uuid,text,text) to authenticated;
-- Private project files, max 4 MiB, passive formats only. No executable HTML/SVG.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values('crestlane-projects','crestlane-projects',false,4194304,array['application/pdf','image/png','image/jpeg','image/webp','text/plain']);
create policy crestlane_file_read on storage.objects for select to authenticated using(bucket_id='crestlane-projects' and exists(select 1 from crestlane_projects p where p.id::text=split_part(name,'/',1) and (p.client_id=auth.uid() or crestlane_staff())));
create policy crestlane_file_write on storage.objects for insert to authenticated with check(bucket_id='crestlane-projects' and exists(select 1 from crestlane_projects p where p.id::text=split_part(name,'/',1) and (p.client_id=auth.uid() or crestlane_staff())));
commit;
