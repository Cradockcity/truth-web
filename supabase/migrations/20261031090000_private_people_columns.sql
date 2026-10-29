-- Step 4c: hide host emails and revenue shares from the public API, and let admins
-- replace a creator's recommended experiences in one transaction.
--
-- Column privileges only narrow access if the table-wide SELECT is revoked first,
-- so each table gets its public columns granted back one by one. Columns added later
-- stay private until granted. Admins read the private columns with the service role.
-- (The old app selects hosts(*), which now fails; the owner accepted this.)

begin;

revoke select on public.hosts from anon, authenticated;
grant select (
  id, name, avatar_url, bio, location, joined_date, languages, specialties,
  verification_badges, social_instagram, social_twitter, social_website, created_at, updated_at
) on public.hosts to anon, authenticated;

revoke select on public.creators from anon, authenticated;
grant select (
  id, name, slug, location, bio, signature_quote, avatar_url, cover_image_url, follower_count,
  personal_tags, featured_in, social_instagram, social_tiktok, social_youtube, social_website,
  created_at, updated_at
) on public.creators to anon, authenticated;

create or replace function public.admin_replace_creator_experiences(
  p_creator_id uuid,
  p_experience_ids uuid[]
)
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
  if coalesce(array_length(p_experience_ids, 1), 0) > 100 then
    raise exception 'too_many_experiences' using errcode = 'P0001';
  end if;

  delete from public.creator_experience_referrals where creator_id = p_creator_id;

  insert into public.creator_experience_referrals (creator_id, experience_id)
  select distinct p_creator_id, e.id
  from public.experiences e
  where e.id = any (coalesce(p_experience_ids, '{}'));

  get diagnostics v_count = row_count;
  return v_count;
end
$$;

revoke all on function public.admin_replace_creator_experiences(uuid, uuid[]) from public, anon;
grant execute on function public.admin_replace_creator_experiences(uuid, uuid[]) to authenticated;

commit;

select
  has_column_privilege('anon', 'public.hosts', 'email', 'select') as public_sees_host_email,
  has_column_privilege('anon', 'public.creators', 'revenue_share_percentage', 'select') as public_sees_creator_share,
  has_column_privilege('anon', 'public.hosts', 'name', 'select') as public_sees_host_name;
