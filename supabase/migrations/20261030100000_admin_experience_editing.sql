-- Step 4b: replace an experience's itinerary or weekly schedule in one transaction.
-- (The old admin deleted then re-inserted rows separately and ignored errors.)

begin;

create or replace function public.admin_replace_itinerary(p_experience_id uuid, p_steps jsonb)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  if not public.is_admin() then
    raise exception 'not_admin' using errcode = '42501';
  end if;
  if jsonb_typeof(p_steps) <> 'array' or jsonb_array_length(p_steps) > 50 then
    raise exception 'invalid_steps' using errcode = 'P0001';
  end if;

  delete from public.experience_itineraries where experience_id = p_experience_id;

  insert into public.experience_itineraries (experience_id, time, activity, order_index)
  select p_experience_id,
         nullif(btrim(step ->> 'time'), ''),
         btrim(step ->> 'activity'),
         ordinality::integer
  from jsonb_array_elements(p_steps) with ordinality as steps (step, ordinality)
  where length(btrim(coalesce(step ->> 'activity', ''))) between 1 and 500;

  get diagnostics v_count = row_count;
  return v_count;
end
$$;

create or replace function public.admin_replace_schedule(p_experience_id uuid, p_slots jsonb)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  if not public.is_admin() then
    raise exception 'not_admin' using errcode = '42501';
  end if;
  if jsonb_typeof(p_slots) <> 'array' or jsonb_array_length(p_slots) > 200 then
    raise exception 'invalid_slots' using errcode = 'P0001';
  end if;

  delete from public.experience_schedules where experience_id = p_experience_id;

  insert into public.experience_schedules (experience_id, weekday, start_time, capacity)
  select distinct on ((slot ->> 'weekday')::smallint, (slot ->> 'time')::time)
         p_experience_id,
         (slot ->> 'weekday')::smallint,
         (slot ->> 'time')::time,
         (slot ->> 'capacity')::integer
  from jsonb_array_elements(p_slots) as slot
  where (slot ->> 'weekday') ~ '^[0-6]$'
    and (slot ->> 'time') ~ '^\d{2}:\d{2}$'
    and (slot ->> 'capacity') ~ '^\d{1,3}$'
    and (slot ->> 'capacity')::integer between 1 and 500;

  get diagnostics v_count = row_count;
  return v_count;
end
$$;

revoke all on function public.admin_replace_itinerary(uuid, jsonb) from public, anon;
revoke all on function public.admin_replace_schedule(uuid, jsonb) from public, anon;
grant execute on function public.admin_replace_itinerary(uuid, jsonb) to authenticated;
grant execute on function public.admin_replace_schedule(uuid, jsonb) to authenticated;

commit;

select
  has_function_privilege('anon', 'public.admin_replace_schedule(uuid, jsonb)', 'execute') as anon_can_edit;
