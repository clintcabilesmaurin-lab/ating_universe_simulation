-- ============================================================================
-- ATING UNIVERSE SIMULATION - SUPABASE DATABASE SCHEMA
-- Canonical persistent storage for Clint & Maica's Living Simulation Observatory
-- ============================================================================

-- 1. Simulation Sessions Table
-- Holds the persistent world, moods, activity, active music, and event state.
create table if not exists simulation_sessions (
  session_id text primary key,
  world text not null default 'living-room',
  clint_mood text not null default 'reflective',
  maica_mood text not null default 'warm',
  current_activity text not null default 'sitting together',
  active_music text,
  active_event text,
  event_expires_at timestamptz,
  event_cooldowns jsonb not null default '{}'::jsonb,
  clint_interaction_id text,
  maica_interaction_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Simulation Messages Table
-- Stores all conversational transmissions, ambient thoughts, and music reactions.
create table if not exists simulation_messages (
  message_id text primary key,
  session_id text not null references simulation_sessions(session_id) on delete cascade,
  speaker text not null check (speaker in ('clint', 'maica')),
  text text not null,
  source text not null default 'simulation',
  interaction_id text,
  created_at timestamptz not null default now()
);

-- Performance & Pagination index for messages
create index if not exists idx_sim_messages_session_created 
  on simulation_messages (session_id, created_at desc);

-- 3. Simulation Memories Table
-- Shared lore, inside jokes, milestones, and scriptural anchors for Clint & Maica.
create table if not exists simulation_memories (
  memory_id text primary key,
  memory_category text not null,
  title text not null,
  description text not null,
  keywords text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_sim_memories_category 
  on simulation_memories (memory_category);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
alter table simulation_sessions enable row level security;
alter table simulation_messages enable row level security;
alter table simulation_memories enable row level security;

-- Public observatory read/write policies (anon key + service role)
drop policy if exists "Public sessions select" on simulation_sessions;
create policy "Public sessions select" on simulation_sessions for select using (true);

drop policy if exists "Public sessions insert" on simulation_sessions;
create policy "Public sessions insert" on simulation_sessions for insert with check (true);

drop policy if exists "Public sessions update" on simulation_sessions;
create policy "Public sessions update" on simulation_sessions for update using (true);

-- Public messages policies: public users can read, and insert their own transmissions (source = 'user')
drop policy if exists "Public messages select" on simulation_messages;
create policy "Public messages select" on simulation_messages for select using (true);

drop policy if exists "Public messages insert" on simulation_messages;
create policy "Public messages insert" on simulation_messages for insert with check (source = 'user');

-- Public memories policies: read-only for public observatory. Mutated only by service role.
drop policy if exists "Public memories select" on simulation_memories;
create policy "Public memories select" on simulation_memories for select using (true);

drop policy if exists "Public memories insert" on simulation_memories;

-- ============================================================================
-- SEED DATA: SHARED MEMORIES & CANONICAL LORE
-- ============================================================================
insert into simulation_memories (memory_id, memory_category, title, description, keywords, created_at)
values
  (
    'mem_narra',
    'relational_concept',
    'NARRA ko diri',
    'The comfort phrase and shelter promise Clint gives when Maica needs someone steady to listen.',
    array['narra', 'shelter', 'listen', 'paminaw', 'steady', 'diri'],
    '2024-03-10T10:00:00Z'
  ),
  (
    'mem_2nay',
    'joke_riddle_banter',
    '2 Nay = Tunay',
    'The recurring playful wordplay between Clint and Maica that became their signature inside joke.',
    array['2 nay', 'tunay', 'basta', 'joke', 'banter', 'katawa'],
    '2024-04-12T14:30:00Z'
  ),
  (
    'mem_motorcycle',
    'foundational_milestone',
    'Motorcycle Ride Home After Rain',
    'Quiet ride home through the cool evening breeze after school hours.',
    array['motorcycle', 'motor', 'ride', 'hatod', 'byahe', 'rain', 'school'],
    '2024-05-18T17:45:00Z'
  ),
  (
    'mem_piano_river',
    'digital_landmark',
    'River Flows in You Piano Practice',
    'Clint playing piano pieces and worship tunes while Maica listens quietly.',
    array['piano', 'river flows', 'canon in d', 'music', 'tukar', 'practice'],
    '2024-06-01T16:00:00Z'
  ),
  (
    'mem_ukulele_thousand',
    'digital_landmark',
    'A Thousand Years on Ukulele',
    'Maica strumming chords in the afternoon breeze between garden chores.',
    array['ukulele', 'a thousand years', 'music', 'strum', 'garden'],
    '2024-06-15T15:20:00Z'
  ),
  (
    'mem_chess_board',
    'relational_concept',
    'Late Afternoon Chess & Tactics',
    'Clint explaining tactical ideas and playful moves while Maica smiles and teases.',
    array['chess', 'checkers', 'tactics', 'dula', 'tudlo'],
    '2024-07-02T16:30:00Z'
  ),
  (
    'mem_church_quiet',
    'scriptural_bedrock',
    'Quiet Sunday Service & Worship',
    'Shared moments of peace, worship music, and gratitude at church.',
    array['church', 'worship', 'faith', 'sunday', 'quiet', 'service'],
    '2024-08-11T11:00:00Z'
  ),
  (
    'mem_garden_balay',
    'family_personal_life',
    'Afternoon Watering Plants & Garden',
    'Maica checking on green plants and orchids at home, sending quick updates and skl.',
    array['garden', 'plants', 'balay', 'tanom', 'water', 'skl'],
    '2024-08-25T16:15:00Z'
  ),
  (
    'mem_coding_project',
    'foundational_milestone',
    'Grade 12 Tech Leadership & Coding',
    'Clint carrying technical projects, writing C and web systems with pride and dedication.',
    array['coding', 'c programming', 'systems', 'project', 'school', 'mathlete'],
    '2024-09-05T19:00:00Z'
  ),
  (
    'mem_basta_habit',
    'joke_riddle_banter',
    'Basta — The Unspoken Agreement',
    'Saying "Basta" whenever words run out but both know exactly what was meant.',
    array['basta', 'wakoy paki', 'wakoy labot', 'tease'],
    '2024-09-18T21:00:00Z'
  ),
  (
    'mem_julies_bakery',
    'foundational_milestone',
    'Julie''s Bakeshop Tungkop Meeting — May 31, 2026',
    'The post-church turning point where pity was distinguished from genuine love, affirming that what they had was worth fighting for, followed by kan-on ug gatas and matching profile pictures.',
    array['julie', 'tungkop', 'bakeshop', 'bakery', 'may 31', 'gatas', 'kan-on', 'pity', 'love', 'profile picture'],
    '2026-05-31T12:30:00Z'
  ),
  (
    'mem_dalaguete_run',
    'family_personal_life',
    '5:21 AM Dalaguete Vegetable Run with Papa',
    'Early morning father-and-son motorcycle journey through Osmeña Peak fog to purchase wholesale vegetables; learning resilience and discovering deep empathy for his father''s sacrifices.',
    array['dalaguete', 'osmena', 'fog', 'papa', 'utan', 'vegetables', 'motorcycle', 'ride', 'training'],
    '2024-10-04T05:21:00Z'
  ),
  (
    'mem_compound_interest',
    'relational_concept',
    'Compound Interest of Love and Memories',
    'Maica and Clint''s shared understanding that their love, trust, and memories grow exponentially each day like compound interest.',
    array['compound interest', 'growth', 'exponential', 'tiwala', 'pagmamahal', 'memories', 'future'],
    '2024-11-12T20:15:00Z'
  ),
  (
    'mem_t9_ciphers',
    'digital_landmark',
    'T9 Keypad Ciphers & Meta AI C Code',
    'Clint''s creative codes: 222-88-8-33 6-66 ("CUTE MO"), 555-666-888-33-999 ("I LOVE YOU"), and bool loveBaAkoniLovey Meta AI tests.',
    array['cipher', 'binary', 't9', 'nokia', 'cute mo', 'meta ai', 'c code', 'programming'],
    '2024-11-28T22:00:00Z'
  ),
  (
    'mem_maica_laundry_soup',
    'family_personal_life',
    'Eldest Sister Care & Kamunggay Chicken Soup',
    'Maica putting younger siblings to sleep in her arms, enduring Zonrox laundry mornings, and lovingly cooking chicken tinola with fresh kamunggay for her mother.',
    array['laundry', 'zonrox', 'kamunggay', 'tinola', 'ate', 'siblings', 'mama', 'caring', 'laba'],
    '2024-12-05T18:30:00Z'
  ),
  (
    'mem_romans_faith',
    'scriptural_bedrock',
    'Romans 8:1 Freedom & Ministry of God',
    'Clint reassuring Maica through Romans 8:1, dispelling superstitious gossip and standing firm in the one True God.',
    array['romans', 'romans 8:1', 'faith', 'gaba', 'superstition', 'god', 'minister', 'peace'],
    '2025-01-14T19:45:00Z'
  ),
  (
    'mem_homestead_vision',
    'future_homestead',
    'Countryside Homestead & Stargazing Telescope',
    'Their shared peaceful future: a cool mountain homestead with automated systems, telescope for stargazing, vegetable garden of tomatoes and eggplants, and domestic warmth.',
    array['homestead', 'countryside', 'telescope', 'stargazing', 'bukid', 'garden', 'future', 'solar'],
    '2025-02-20T21:10:00Z'
  ),
  (
    'mem_digital_vault',
    'digital_landmark',
    'Memory Case & The Digital Memory Vault',
    'Clint''s web projects including the Canva Mansion, Memory Case web game, 3D Memory Gallery Walk, and Secret Letter portal.',
    array['memory case', 'canva mansion', 'gallery walk', 'secret letter', 'great before', 'game', 'code'],
    '2025-03-01T20:00:00Z'
  )
on conflict (memory_id) do nothing;
