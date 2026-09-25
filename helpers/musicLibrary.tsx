export type MusicTrack = {
  id: string;
  youtubeId: string;
  fallbackYoutubeIds?: string[];
  coverImage: string;
  title: string;
  artist: string;
  tags: string[];
  roomIds: string[];
  genre: string;
  year: number;
  isFeatured: boolean;
  addedAt: string;
  metadataSource: string;
  description: string;
};

export const musicLibrary: MusicTrack[] = [
  // ==========================================
  // 1. POP / CONTEMPORARY POP (🌤️ Golden Hour)
  // ==========================================
  {
    id: 'track-001',
    youtubeId: 'AJtDXIazrMo',
    coverImage: 'https://img.youtube.com/vi/AJtDXIazrMo/hqdefault.jpg',
    title: 'Love Me Like You Do',
    artist: 'Ellie Goulding',
    tags: ['pop', 'contemporary', 'romantic', 'golden-hour', 'synth-pop'],
    roomIds: ['pop', 'cinematic', 'listening-lounge'],
    genre: 'pop',
    year: 2015,
    isFeatured: true,
    addedAt: '2026-01-01T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
This feels like sunlight breaking through the clouds. A big, cinematic pop anthem that carries that feeling of letting someone in completely without fear.

**Maica:**
Grabe ka romantic. Murag kanang feeling nga you're completely safe with someone, and everything feels bright and weightless. 🌤️`,
  },
  {
    id: 'track-004',
    youtubeId: 'LjhCEhWiKXk',
    coverImage: 'https://img.youtube.com/vi/LjhCEhWiKXk/hqdefault.jpg',
    title: 'Just The Way You Are',
    artist: 'Bruno Mars',
    tags: ['pop', 'classic', 'sweet', 'contemporary', 'romantic'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2010,
    isFeatured: true,
    addedAt: '2026-01-04T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
This is classic Bruno Mars. Pure, unfiltered praise without any second-guessing. Simple, sincere, and makes whoever is listening feel genuinely valued.

**Maica:**
Every girl knows this song by heart. It reminds you that true love doesn't ask you to change anything — it loves you exactly as you are.`,
  },
  {
    id: 'track-006',
    youtubeId: '450p7goxZqg',
    coverImage: 'https://img.youtube.com/vi/450p7goxZqg/hqdefault.jpg',
    title: 'All of Me',
    artist: 'John Legend',
    tags: ['piano', 'soul', 'pop', 'contemporary', 'ballad'],
    roomIds: ['pop', 'cinematic', 'listening-lounge'],
    genre: 'pop',
    year: 2013,
    isFeatured: true,
    addedAt: '2026-01-06T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
John Legend poured his entire soul into this piano. 'All your curves and all your edges, all your perfect imperfections.' The definition of complete acceptance.

**Maica:**
One of the most honest love songs ever written. It doesn't pretend love is easy; it promises devotion through all the highs and edges.`,
  },
  {
    id: 'track-taylor',
    youtubeId: '8xg3vE8Ie_E',
    coverImage: 'https://img.youtube.com/vi/8xg3vE8Ie_E/hqdefault.jpg',
    title: 'Love Story',
    artist: 'Taylor Swift',
    tags: ['pop', 'fairytale', 'romantic', 'contemporary', 'nostalgic'],
    roomIds: ['pop', 'cinematic', 'listening-lounge'],
    genre: 'pop',
    year: 2008,
    isFeatured: true,
    addedAt: '2026-01-07T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
That iconic key change in the final chorus is pure dopamine. A modern romantic classic about choosing love against every odd.

**Maica:**
Instant childhood nostalgia. Reminds you of believing in fairytales, balcony whispers, and love that finds a way no matter what.`,
  },
  {
    id: 'track-016',
    youtubeId: 'rtOvBOTyX00',
    coverImage: 'https://img.youtube.com/vi/rtOvBOTyX00/hqdefault.jpg',
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    tags: ['cinematic', 'piano', 'pop', 'contemporary', 'ballad'],
    roomIds: ['pop', 'cinematic', 'listening-lounge'],
    genre: 'pop',
    year: 2011,
    isFeatured: true,
    addedAt: '2026-01-16T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
This one feels timeless. Murag dili siya about one moment lang, but about staying through time. That's why grabe iyang emotional weight.

**Maica:**
Very gentle and very sincere. Kanang patience, waiting, and love nga dili dali mawala. Mao nang bagay kaayo sa memories nga gusto nimo balikan.`,
  },
  {
    id: 'track-018',
    youtubeId: 'Lo4_K4relMg',
    coverImage: 'https://img.youtube.com/vi/Lo4_K4relMg/hqdefault.jpg',
    title: 'Snap',
    artist: 'Rosa Linn',
    tags: ['indie-pop', 'folk', 'pop', 'contemporary', 'melodic'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2022,
    isFeatured: false,
    addedAt: '2026-01-18T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
This is one of those late-night songs. Kanang 4 AM na, hilom tanan, pero imong mind dili pa ready mo-stop. Memories keep replaying bisan gusto na nimo ug peace.

**Maica:**
Dili man always about heartbreak lang. Sometimes it's just about something you haven't fully let go of yet. Mao nang very human siya paminawon.`,
  },
  {
    id: 'track-dandelions',
    youtubeId: 'W8a4sUabCUo',
    coverImage: 'https://img.youtube.com/vi/W8a4sUabCUo/hqdefault.jpg',
    title: 'Dandelions',
    artist: 'Ruth B.',
    tags: ['pop', 'contemporary', 'romantic', 'golden-hour', 'piano', 'featured'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2017,
    isFeatured: true,
    addedAt: '2026-02-01T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Featured focus track! Wishing on every single dandelion in the field that someone stays in your life forever. Pure golden hour warmth and openhearted melody.

**Maica:**
Like a gentle afternoon breeze across blooming flowers. Dili complicated, purely sincere. Kanang gusto nimo ipabati sa usa ka tawo nga sila imong pinaka-paboritong wishing star. ✨`,
  },
  {
    id: 'track-019',
    youtubeId: 'JHG3Wl0dCQo',
    coverImage: 'https://img.youtube.com/vi/JHG3Wl0dCQo/hqdefault.jpg',
    title: 'Ehu Girl',
    artist: 'Kolohe Kai',
    tags: ['island', 'reggae-pop', 'warm', 'breezy', 'pop'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2009,
    isFeatured: false,
    addedAt: '2026-01-19T00:00:00Z',
    metadataSource: 'youtube',
    description: 'Sunny island reggae rhythms and breezy tropical harmonies full of joyful warmth.',
  },
  {
    id: 'track-pop-1251',
    youtubeId: 'PtyNOgNqilg',
    fallbackYoutubeIds: ['bBcxV-v9f_s', '2vjPBrBU-TM'],
    coverImage: 'https://img.youtube.com/vi/PtyNOgNqilg/hqdefault.jpg',
    title: '12:51',
    artist: 'Krissy & Ericka',
    tags: ['pop', 'acoustic', 'midnight', 'late-night', 'nostalgic', 'acoustic-guitar'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2012,
    isFeatured: true,
    addedAt: '2026-02-03T01:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
“It's 12:51 and I thought my feelings were all gone...” That acoustic guitar strum immediately transports you back to quiet midnight bedrooms and unspoken late-night thoughts.

**Maica:**
Grabe gyud ka nostalgic ning kantaha! Halos tanang girls sauna gina-kantakanta ni samtang nagtan-aw sa orasan. So simple, sweet, and comforting. 🌙`,
  },
  {
    id: 'track-pop-totga',
    youtubeId: '2ljKgfeDi-c',
    fallbackYoutubeIds: ['Ahha3Cqe_fk', 'm_s42v0cZ34'],
    coverImage: 'https://img.youtube.com/vi/2ljKgfeDi-c/hqdefault.jpg',
    title: 'The One That Got Away',
    artist: 'Katy Perry',
    tags: ['pop', 'contemporary', 'bittersweet', 'anthem', 'nostalgic', 'acoustic-heart'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2011,
    isFeatured: true,
    addedAt: '2026-02-03T01:30:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
“In another life, I would be your girl... we'd keep all our promises, be us against the world.” A massive pop ballad about the beauty and ache of parallel memories.

**Maica:**
Nindot kaayo ang storytelling. Even if it talks about what could have been, it celebrates the deep mark someone left on your life with total sincerity.`,
  },
  {
    id: 'track-pop-enchanted',
    youtubeId: 'igIfiqqVHtA',
    coverImage: 'https://img.youtube.com/vi/igIfiqqVHtA/hqdefault.jpg',
    title: "Enchanted (Taylor's Version)",
    artist: 'Taylor Swift',
    tags: ['pop', 'contemporary', 'romantic', 'fairytale', 'golden-hour'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2023,
    isFeatured: true,
    addedAt: '2026-02-04T01:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
That magical spark when you meet someone and can't stop replaying the conversation in your head. Sweeping acoustic build-up and Taylor's breathless romantic hope.

**Maica:**
“Please don't be in love with someone else...” So dreamy and nostalgic! Kanang kilig nga naay gamay kakulba pagkahuman ninyo nagkaila. 🌤️✨`,
  },
  {
    id: 'track-pop-im-yours',
    youtubeId: 'EkHTsc9PU2A',
    coverImage: 'https://img.youtube.com/vi/EkHTsc9PU2A/hqdefault.jpg',
    title: "I'm Yours",
    artist: 'Jason Mraz',
    tags: ['pop', 'acoustic', 'feel-good', 'sunny', 'golden-hour', 'wholesome'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2008,
    isFeatured: true,
    addedAt: '2026-02-04T01:10:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
An irresistible, sunny acoustic groove that reminds you to stop overthinking and just surrender to love. The ultimate feel-good anthem.

**Maica:**
Makapagaan dayon sa adlaw! Kanang rhythmic acoustic strumming and effortless vocals make you want to smile and hum along instantly.`,
  },
  {
    id: 'track-pop-dream-girl',
    youtubeId: 'v920vOfntyQ',
    coverImage: 'https://img.youtube.com/vi/v920vOfntyQ/hqdefault.jpg',
    title: 'Dream Girl',
    artist: 'Kolohe Kai',
    tags: ['pop', 'island-pop', 'reggae-pop', 'sweet', 'summer', 'golden-hour'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2014,
    isFeatured: true,
    addedAt: '2026-02-04T01:20:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Sweet island reggae-pop rhythms and warm Hawaiian breezes. That unmistakable acoustic bounce when you realize you've found the girl of your dreams.

**Maica:**
So infectious and joyful! Murag naglakaw sa baybayon samtang nagsalop ang adlaw. Pure lighthearted romance and happy vibes.`,
  },
  {
    id: 'track-pop-back-to-december',
    youtubeId: '0nUvr_5iRHk',
    coverImage: 'https://img.youtube.com/vi/0nUvr_5iRHk/hqdefault.jpg',
    title: 'Back To December',
    artist: 'Taylor Swift',
    tags: ['pop', 'ballad', 'nostalgic', 'apology', 'winter', 'contemporary'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2010,
    isFeatured: true,
    addedAt: '2026-02-04T01:30:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
A bittersweet apology wrapped in rich acoustic chords and strings. Looking back with gratitude and maturity at someone who treated you with nothing but love.

**Maica:**
One of Taylor's most mature and heartfelt ballads. Kanang paghinumdom sa mga higayon nga gi-take for granted nimo ang usa ka maayong tawo.`,
  },
  {
    id: 'track-pop-terrified',
    youtubeId: 'un60RISzE-A',
    coverImage: 'https://img.youtube.com/vi/un60RISzE-A/hqdefault.jpg',
    title: 'Terrified',
    artist: 'Katharine McPhee ft. Zachary Levi',
    tags: ['pop', 'duet', 'acoustic-pop', 'romantic', 'falling-in-love', 'golden-hour'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2010,
    isFeatured: true,
    addedAt: '2026-02-04T01:40:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
The honest vulnerability of falling in love. Katharine McPhee and Zachary Levi's vocal chemistry creates an intimate acoustic confession about being scared yet completely willing.

**Maica:**
Grabe ka sweet nga duet! “You'd think I'd have moved on by now...” It captures that tender shiver when you realize your heart is truly in someone else's hands.`,
  },
  {
    id: 'track-pop-nothing-holdin-me-back',
    youtubeId: 'dT2owtxkU8k',
    coverImage: 'https://img.youtube.com/vi/dT2owtxkU8k/hqdefault.jpg',
    title: "There's Nothing Holdin' Me Back",
    artist: 'Shawn Mendes',
    tags: ['pop', 'energetic', 'driving', 'guitar-pop', 'passionate', 'golden-hour'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2017,
    isFeatured: true,
    addedAt: '2026-02-04T01:50:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
High-octane acoustic guitar riffs and an unstoppable pulse. That electrifying feeling when someone drives you crazy and you don't want anything holding you back.

**Maica:**
Full of vibrant momentum and confidence! Makes you want to roll the car windows down on a sunny afternoon and sing at the top of your lungs.`,
  },
  {
    id: 'track-pop-beautiful-in-white',
    youtubeId: 'Trjrj_fQnIM',
    coverImage: 'https://img.youtube.com/vi/Trjrj_fQnIM/hqdefault.jpg',
    title: 'Beautiful in White',
    artist: 'Shane Filan (Westlife)',
    tags: ['pop', 'wedding', 'ballad', 'romantic', 'devotion', 'golden-hour'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2010,
    isFeatured: true,
    addedAt: '2026-02-04T02:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Shane Filan's timeless vocal devotion set against Canon in D chords. The iconic melody that plays when seeing the love of your life walk down the aisle.

**Maica:**
The ultimate wedding serenade. Sincere, tear-jerking, and filled with the promise of a lifetime together. 💍👰`,
  },

  // ===================================================
  // 2. SOFT ROCK / ADULT CONTEMPORARY (💿 Vintage Room)
  // ===================================================
  {
    id: 'track-002',
    youtubeId: 'fn_2Q6C1iOI',
    coverImage: 'https://img.youtube.com/vi/fn_2Q6C1iOI/hqdefault.jpg',
    title: "Nothing's Gonna Change My Love For You",
    artist: 'George Benson',
    tags: ['soft-rock', 'adult-contemporary', 'vintage', 'classic', '80s'],
    roomIds: ['soft-rock', 'listening-lounge'],
    genre: 'soft-rock',
    year: 1985,
    isFeatured: true,
    addedAt: '2026-01-02T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
The golden standard of timeless love songs. George Benson's guitar phrasing and smooth vocal tone give this an analog warmth that digital recordings can never replicate.

**Maica:**
Murag kanang kanta nga pirmi motukar sa radyo samtang nag-drive sa hapon. Unchanging, steadfast, and comforting.`,
  },
  {
    id: 'track-shania',
    youtubeId: 'KNZH-emehxA',
    coverImage: 'https://img.youtube.com/vi/KNZH-emehxA/hqdefault.jpg',
    title: "You're Still The One",
    artist: 'Shania Twain',
    tags: ['soft-rock', 'country-pop', 'vintage', 'classic', 'devotion'],
    roomIds: ['soft-rock', 'listening-lounge'],
    genre: 'soft-rock',
    year: 1997,
    isFeatured: true,
    addedAt: '2026-01-03T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
'They said I bet they'll never make it, but just look at us holding on.' The anthem of couples who proved everybody wrong with steady, daily loyalty.

**Maica:**
So nostalgic! Kanang acoustic strumming sa start pa lang, makahinumdom dayon ka sa mga tawo nga nag-uban sa tanang kalisod ug kalipay.`,
  },
  {
    id: 'track-011',
    youtubeId: 'ZnOAK04tJhc',
    coverImage: 'https://img.youtube.com/vi/ZnOAK04tJhc/hqdefault.jpg',
    title: 'I Lay My Love on You',
    artist: 'Westlife',
    tags: ['boyband', 'soft-rock', '2000s', 'nostalgic', 'pop'],
    roomIds: ['soft-rock', 'listening-lounge'],
    genre: 'soft-rock',
    year: 2000,
    isFeatured: false,
    addedAt: '2026-01-11T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
This is very old-school romantic in the best way. Simple confession, pero naa'y warmth nga murag handwritten letter.

**Maica:**
Very sincere. Kanang dili complicated ang message. “I love you, and I'm giving this love to you.” Mao ra. 🤍`,
  },
  {
    id: 'track-012',
    youtubeId: '_mlWHMHQ8f0',
    coverImage: 'https://img.youtube.com/vi/_mlWHMHQ8f0/hqdefault.jpg',
    title: 'My Love',
    artist: 'Westlife',
    tags: ['boyband', 'soft-rock', 'nostalgic', 'ballad', '2000s'],
    roomIds: ['soft-rock', 'listening-lounge'],
    genre: 'soft-rock',
    year: 2000,
    isFeatured: false,
    addedAt: '2026-01-12T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Westlife has this way of making love songs feel huge without making them feel cold. This one feels like longing plus devotion, pero very nostalgic gihapon.

**Maica:**
Kanang song nga murag dugay na nimo kaila. Familiar kaayo ang feeling. Murag old memory nga somehow still sounds nice every time.`,
  },
  {
    id: 'track-014',
    youtubeId: 'xK4ZqrLys_k',
    coverImage: 'https://img.youtube.com/vi/xK4ZqrLys_k/hqdefault.jpg',
    title: 'Iris',
    artist: 'Goo Goo Dolls',
    tags: ['emo', 'alt-rock', 'soft-rock', 'cinematic', 'anthem', 'nostalgic'],
    roomIds: ['emo', 'soft-rock', 'listening-lounge'],
    genre: 'emo',
    year: 1998,
    isFeatured: true,
    addedAt: '2026-01-14T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
This one is different. It feels rawer. Kanang gusto kaayo ka masabtan sa usa ka tawo, not just seen from the outside, but really known.

**Maica:**
Medyo bittersweet siya. Dili siya purely happy, pero beautiful gihapon. Murag naa'y emotions nga lisod i-explain, mao nang music nalang ang mubuhat.`,
  },
  {
    id: 'track-021',
    youtubeId: 'Jtauh8GcxBY',
    coverImage: 'https://img.youtube.com/vi/Jtauh8GcxBY/hqdefault.jpg',
    title: 'Before You Go',
    artist: 'Lewis Capaldi',
    tags: ['emo', 'soft-rock', 'ballad', 'powerful', 'emotional', 'acoustic'],
    roomIds: ['emo', 'soft-rock', 'listening-lounge'],
    genre: 'emo',
    year: 2019,
    isFeatured: false,
    addedAt: '2026-01-21T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Heavy ni. It carries that feeling of things you wish you had said earlier, questions that arrive too late, and moments nga mag-“what if” ka.

**Maica:**
Medyo painful siya paminawon. But that's also why it's beautiful. Sometimes songs don't comfort you by making things happy. They comfort you by putting a feeling into words.`,
  },
  {
    id: 'track-029',
    youtubeId: 'qHD61OR15r0',
    coverImage: 'https://img.youtube.com/vi/qHD61OR15r0/hqdefault.jpg',
    title: 'Passenger Seat',
    artist: 'Stephen Speaks',
    tags: ['soft-rock', 'acoustic', 'nostalgic', 'classic', 'late-night'],
    roomIds: ['soft-rock', 'listening-lounge'],
    genre: 'soft-rock',
    year: 2001,
    isFeatured: true,
    addedAt: '2026-01-29T00:00:00Z',
    metadataSource: 'youtube',
    description: 'The definitive late-night car ride anthem about watching someone fall asleep in the passenger seat.',
  },
  {
    id: 'track-softrock-die-with-a-smile',
    youtubeId: 'kPa7bsKwL-c',
    coverImage: 'https://img.youtube.com/vi/kPa7bsKwL-c/hqdefault.jpg',
    title: 'Die With A Smile',
    artist: 'Lady Gaga, Bruno Mars',
    tags: ['soft-rock', 'retro-soul', 'ballad', 'vintage-rock', 'duet', 'timeless'],
    roomIds: ['soft-rock', 'listening-lounge'],
    genre: 'soft-rock',
    year: 2024,
    isFeatured: true,
    addedAt: '2026-02-04T02:10:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
A masterclass in 70s-inspired vintage soft rock and soul. Soaring vocal trades between Lady Gaga and Bruno Mars with warm electric guitar and analog tape warmth.

**Maica:**
Grabe ka powerful nga duet! Feels like a classic record spinning on a mahogany turntable in a cozy vintage room under dim lamps. 💿`,
  },

  // ========================================================
  // 3. INDIE / ALTERNATIVE / INDIE POP (🌿 Twilight Garden)
  // ========================================================
  {
    id: 'track-003',
    youtubeId: 'GhQxrCrVSyw',
    fallbackYoutubeIds: ['GxldQ9GyXfY'],
    coverImage: 'https://img.youtube.com/vi/GhQxrCrVSyw/hqdefault.jpg',
    title: 'Until I Found You',
    artist: 'Stephen Sanchez',
    tags: ['indie', '50s-vibe', 'retro', 'romantic', 'alternative'],
    roomIds: ['indie', 'cinematic', 'listening-lounge'],
    genre: 'indie',
    year: 2021,
    isFeatured: true,
    addedAt: '2026-01-03T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Stephen Sanchez resurrected that dreamy 1950s prom ballad aesthetic with modern clarity. It feels like stepping into a vintage memory where everything was slower and more deliberate.

**Maica:**
One of the most tender songs on this whole record player. Perfect for slow dancing in the kitchen when the house is completely quiet.`,
  },
  {
    id: 'track-005',
    youtubeId: 'z0aD0J8Gk7U',
    fallbackYoutubeIds: ['z0aD0J8Gk7U', 'WneUq_TfWdg', '2q0mQfQY8_0'],
    coverImage: 'https://img.youtube.com/vi/z0aD0J8Gk7U/hqdefault.jpg',
    title: 'To the Bone',
    artist: 'Pamungkas',
    tags: ['indie', 'alternative', 'acoustic', 'late-night'],
    roomIds: ['indie', 'listening-lounge'],
    genre: 'indie',
    year: 2020,
    isFeatured: false,
    addedAt: '2026-01-05T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Pamungkas made Southeast Asian indie pop global with this track. Late-night guitar chords that resonate right into your ribcage.

**Maica:**
Intimate and atmospheric. Kanang kanta nga paminawon nimo sa kwarto nga naka-off ang suga samtang nag-scroll sa daan nga mga pictures.`,
  },
  {
    id: 'track-017',
    youtubeId: 'gVAy3IZiL0s',
    coverImage: 'https://img.youtube.com/vi/gVAy3IZiL0s/hqdefault.jpg',
    title: 'Atlantis',
    artist: 'Seafret',
    tags: ['atmospheric', 'indie-rock', 'haunting', 'emotional', 'indie'],
    roomIds: ['indie', 'listening-lounge'],
    genre: 'indie',
    year: 2015,
    isFeatured: false,
    addedAt: '2026-01-17T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
This one hurts differently. 😭 Murag beautiful thing nga kabalo ka nga slowly disappearing, pero somehow you're still holding onto what remains.

**Maica:**
Very bittersweet. Pretty siya paminawon, pero naa gyuy sadness underneath. Kanang memories nga ganahan pa ka ipabilin bisan kabalo ka nga time keeps moving.`,
  },
  {
    id: 'track-025',
    youtubeId: 'dstuitW8PWM',
    coverImage: 'https://img.youtube.com/vi/dstuitW8PWM/hqdefault.jpg',
    title: 'Happiness',
    artist: 'Rex Orange County',
    tags: ['indie-pop', 'soul', 'piano', 'honest', 'indie'],
    roomIds: ['indie', 'listening-lounge'],
    genre: 'indie',
    year: 2017,
    isFeatured: false,
    addedAt: '2026-01-25T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
This one feels like choosing happiness with someone, but not in a perfect-fairytale way. More like, “I want to grow old and still have this.”

**Maica:**
I like how personal it feels. Not just about romance, but about wanting to know someone deeply and still choosing them through different versions of life.`,
  },
  {
    id: 'track-indie-count-on-me',
    youtubeId: '6k8cpUkKK4c',
    coverImage: 'https://img.youtube.com/vi/6k8cpUkKK4c/hqdefault.jpg',
    title: 'Count on Me',
    artist: 'Bruno Mars',
    tags: ['indie', 'acoustic', 'friendship', 'ukulele', 'twilight-indie', 'wholesome'],
    roomIds: ['indie', 'listening-lounge'],
    genre: 'indie',
    year: 2010,
    isFeatured: true,
    addedAt: '2026-02-04T02:20:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Tender acoustic fingerpicking and ukulele chords that celebrate unwavering friendship and loyalty. “You can count on me like one, two, three, I'll be there.”

**Maica:**
Dili lang para sa lovers, apan para sa mga tawo nga kanunay anaa sa imong luyo. Gentle, comforting, and intimate like a twilight firefly circle. 🌿`,
  },

  // ===================================================
  // 4. JAZZ / JAZZ-POP / BOSSA-INSPIRED (☕ Rainy Café)
  // ===================================================
  {
    id: 'track-020',
    youtubeId: 'Ip6cw8gfHHI',
    fallbackYoutubeIds: ['8o4YlV4vI40', 'gH5O_fN6eew'],
    coverImage: 'https://img.youtube.com/vi/Ip6cw8gfHHI/hqdefault.jpg',
    title: 'Here With Me',
    artist: 'd4vd',
    tags: ['jazz', 'lofi', 'romantic', 'dreamy', 'cafe', 'intimate'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2022,
    isFeatured: true,
    addedAt: '2026-01-20T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
This is soft. Very, very soft. Murag watching the sunrise with someone and suddenly realizing nga nothing else really matters at that moment.

**Maica:**
Probably one of the easiest songs to just sit with. Dili kinahanglan i-analyze. Just being together already feels like enough.`,
  },
  {
    id: 'track-022',
    youtubeId: 'Zu2Spp4nrTM',
    coverImage: 'https://img.youtube.com/vi/Zu2Spp4nrTM/hqdefault.jpg',
    title: 'Promise',
    artist: 'Laufey',
    tags: ['jazz', 'bedroom-pop', 'intimate', 'gentle', 'cafe'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2023,
    isFeatured: true,
    addedAt: '2026-01-22T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Laufey makes softness feel almost physical. This song feels intimate kaayo, like a quiet conversation where nobody has to raise their voice.

**Maica:**
Very gentle. Kanang feeling nga you're hoping for something simple and real. No big drama, just closeness.`,
  },
  {
    id: 'track-023',
    youtubeId: 'NLphEFOyoqM',
    coverImage: 'https://img.youtube.com/vi/NLphEFOyoqM/hqdefault.jpg',
    title: 'Let You Break My Heart Again',
    artist: 'Laufey & Philharmonia Orchestra',
    tags: ['orchestral', 'jazz', 'timeless', 'romantic', 'cafe'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2021,
    isFeatured: false,
    addedAt: '2026-01-23T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
This is heartbreak wearing a pretty dress. 😂 Very beautiful, very elegant, pero sakit gihapon underneath. It's that kind of feeling nga you know better, but your heart still goes there.

**Maica:**
Murag “I know this might hurt me, but somehow I'm still here.” Very vulnerable siya. And the orchestra makes it feel even bigger.`,
  },
  {
    id: 'track-024',
    youtubeId: 'lSD_L-xic9o',
    coverImage: 'https://img.youtube.com/vi/lSD_L-xic9o/hqdefault.jpg',
    title: 'From The Start',
    artist: 'Laufey',
    tags: ['bossa-nova', 'jazz', 'playful', 'acoustic', 'cafe'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2023,
    isFeatured: true,
    addedAt: '2026-01-24T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
This one has a completely different energy. More playful, more cute. Murag someone trying to hide a crush while literally everyone already knows. 😂

**Maica:**
Kilig siya. Very light and charming. Kanang happy crush energy nga dili pa kaayo serious, pero sige na'g replay sa mind.`,
  },
  {
    id: 'track-013',
    youtubeId: '9JSn36U7d4w',
    coverImage: 'https://img.youtube.com/vi/9JSn36U7d4w/hqdefault.jpg',
    title: 'So Easy (To Fall In Love)',
    artist: 'Olivia Dean',
    tags: ['neo-soul', 'jazz', 'warm', 'intimate', 'cafe'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2023,
    isFeatured: true,
    addedAt: '2026-01-13T00:00:00Z',
    metadataSource: 'youtube',
    description: 'Silky modern soul and breezy horns conveying the effortless beauty of mutual attraction.',
  },
  {
    id: 'track-jazz-at-my-worst',
    youtubeId: 'm2htQJuFrnY',
    coverImage: 'https://img.youtube.com/vi/m2htQJuFrnY/hqdefault.jpg',
    title: 'At My Worst',
    artist: 'Pink Sweat$',
    tags: ['jazz', 'soul-pop', 'cozy', 'warm', 'cafe', 'rainy-cafe', 'intimate'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2020,
    isFeatured: true,
    addedAt: '2026-02-04T02:30:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Silky smooth modern soul with cozy café warmth. “I need somebody who can love me at my worst.” Gentle finger-snaps and warm electric piano in a rainy café corner.

**Maica:**
So soft and comforting. Kanang samtang nag-inom ug mainit nga kape samtang nag-ulan sa gawas. Sincere and unconditional love. ☕`,
  },
  {
    id: 'track-jazz-dancing-with-your-ghost',
    youtubeId: 'emm0uGDGg2o',
    coverImage: 'https://img.youtube.com/vi/emm0uGDGg2o/hqdefault.jpg',
    title: 'Dancing With Your Ghost',
    artist: 'Sasha Alex Sloan',
    tags: ['emo', 'acoustic-piano', 'longing', 'melancholy', 'cafe'],
    roomIds: ['emo', 'jazz', 'listening-lounge'],
    genre: 'emo',
    year: 2019,
    isFeatured: true,
    addedAt: '2026-02-04T02:40:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Sparse acoustic piano chords and a tender, whispering voice. Sitting alone at a late-night candlelit table, holding on to sweet memories in the quiet dark.

**Maica:**
Very delicate and touching. The gentle raindrops on the window glass echo the quiet rhythm of someone you still miss so deeply.`,
  },
  {
    id: 'track-jazz-i-see-the-light',
    youtubeId: 'ALStsZoNRJM',
    coverImage: 'https://img.youtube.com/vi/ALStsZoNRJM/hqdefault.jpg',
    title: 'I See The Light (Cover)',
    artist: 'Arthur Miguel',
    tags: ['jazz', 'acoustic-cover', 'romantic', 'cafe', 'warmth', 'rainy-cafe', 'serenade'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2022,
    isFeatured: true,
    addedAt: '2026-02-04T02:50:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Arthur Miguel's acoustic serenade arrangement of the Tangled classic. Warm nylon strings and intimate, breathy vocals that fit right into a candlelit café ambience.

**Maica:**
Nindot kaayo iyang acoustic version! Mura'g gipangharana ka sa coffee shop samtang nagtan-aw sa mga suga sa gawas.`,
  },
  {
    id: 'track-jazz-i-need-you',
    youtubeId: '2dTQGWc8T3k',
    coverImage: 'https://img.youtube.com/vi/2dTQGWc8T3k/hqdefault.jpg',
    title: 'I Need You (Cover)',
    artist: 'Arthur Miguel',
    tags: ['jazz', 'acoustic-cover', 'heartfelt', 'cafe', 'rainy-cafe', 'serenade'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2022,
    isFeatured: true,
    addedAt: '2026-02-04T03:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
A soulful, stripped-back acoustic rendition of LeAnn Rimes' classic. Rich guitar resonance, soothing phrasing, and an intimate, late-night café atmosphere.

**Maica:**
Makahupay kaayo paminawon. Kanang acoustic simplicity that lets the pure emotion of the song shine through the rainy evening mist.`,
  },

  // ======================================================
  // 5. MUSICAL / CINEMATIC ROMANCE (🎬 Dream Theater)
  // ======================================================
  {
    id: 'track-015',
    youtubeId: 'RI-HOQ27QEM',
    coverImage: 'https://img.youtube.com/vi/RI-HOQ27QEM/hqdefault.jpg',
    title: 'Rewrite The Stars',
    artist: 'Zac Efron & Zendaya',
    tags: ['soundtrack', 'cinematic', 'duet', 'dramatic', 'theater'],
    roomIds: ['cinematic', 'listening-lounge'],
    genre: 'cinematic',
    year: 2017,
    isFeatured: true,
    addedAt: '2026-01-15T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
This is the “what if we could just choose us?” song. Very cinematic, very dramatic, pero underneath all that kay simple ra gyud ang thought: what if love was enough?

**Maica:**
I like the hope in it. Kanang bisan naay things nga murag against you, naa gihapon ang desire nga maybe there’s another way.`,
  },
  {
    id: 'track-cinematic-lovely',
    youtubeId: 'V1Pl8CzNzCw',
    coverImage: 'https://img.youtube.com/vi/V1Pl8CzNzCw/hqdefault.jpg',
    title: 'lovely',
    artist: 'Billie Eilish & Khalid',
    tags: ['cinematic', 'strings', 'emotional', 'haunting', 'dream-theater', 'soundtrack'],
    roomIds: ['cinematic', 'listening-lounge'],
    genre: 'cinematic',
    year: 2018,
    isFeatured: true,
    addedAt: '2026-02-04T03:10:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Haunting cello, sweeping violins, and intimate whispered harmonies. Feels like an emotional widescreen movie climax under projector dust and starlight.

**Maica:**
Chilling and deeply moving. The contrast between Billie's delicate falsetto and Khalid's warm baritone creates pure cinematic magic. 🎬✨`,
  },

  // ===========================================
  // 6. FILIPINO / OPM (🇵🇭 Home at Night)
  // ===========================================
  {
    id: 'track-030',
    youtubeId: 'BHpDOlgisNE',
    coverImage: 'https://img.youtube.com/vi/BHpDOlgisNE/hqdefault.jpg',
    title: '14',
    artist: 'Silent Sanctuary',
    tags: ['opm', 'emo', 'strings', 'rock-ballad', 'emotional', 'balcony'],
    roomIds: ['opm', 'emo', 'listening-lounge'],
    genre: 'opm',
    year: 2007,
    isFeatured: false,
    addedAt: '2026-01-30T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
This song feels very Filipino in the way emotions are carried quietly. Naa'y nostalgia, naa'y ache, pero dili kinahanglan i-shout.

**Maica:**
Kanang familiar nga Pinoy emotional sound. Very close to home ang feeling. Sometimes you don't need complicated words to understand exactly what the song is saying.`,
  },
  {
    id: 'track-031',
    youtubeId: 'I8fFjG9ch5Q',
    coverImage: 'https://img.youtube.com/vi/I8fFjG9ch5Q/hqdefault.jpg',
    title: "Sa'yo",
    artist: 'Silent Sanctuary',
    tags: ['opm', 'emo', 'cello-rock', 'romantic', 'classic-opm', 'balcony'],
    roomIds: ['opm', 'emo', 'listening-lounge'],
    genre: 'opm',
    year: 2013,
    isFeatured: true,
    addedAt: '2026-01-31T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
This one feels more local and personal. Murag less polished in an international-pop way, pero because of that, mas intimate siya. More grounded.

**Maica:**
It feels sincere. Kanang simple nga “para nimo ni” feeling. Very Filipino love-song heart. 🤍`,
  },
  {
    id: 'track-027',
    youtubeId: 'PeZ-rJqTwkw',
    coverImage: 'https://img.youtube.com/vi/PeZ-rJqTwkw/hqdefault.jpg',
    title: 'Ikaw At Ako',
    artist: 'Moira Dela Torre & Jason Marvin',
    tags: ['opm', 'acoustic', 'wedding-song', 'gentle', 'balcony'],
    roomIds: ['opm', 'listening-lounge'],
    genre: 'opm',
    year: 2019,
    isFeatured: true,
    addedAt: '2026-01-27T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
An acoustic covenant song cherished for its sincere vows and gentle acoustic guitar. It feels peaceful, like sitting under the afternoon sky with someone you care about.

**Maica:**
Grabe ka sweet ani nga kanta lovey. Very gentle and prayerful ang vibe. Kanang calm assurance nga everything will be okay. 🤍`,
  },
];