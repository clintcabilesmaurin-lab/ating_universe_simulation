export type MusicTrack = {
  id: string;
  youtubeId: string;
  fallbackYoutubeIds?: string[];
  coverImage: string;
  title: string;
  artist: string;
  tags: string[];
  roomIds: string[];
  genre: "pop" | "soft-rock" | "indie" | "jazz" | "cinematic" | "opm" | "emo";
  year: number;
  isFeatured: boolean;
  addedAt: string;
  metadataSource: string;
  description: string;
};

export const musicLibrary: MusicTrack[] = [
  // =========================================================================
  // 1. 🌤️ POP / CONTEMPORARY POP (14 tracks)
  // =========================================================================
  {
    id: 'track-pop-01',
    youtubeId: 'AJtDXIazrMo',
    coverImage: 'https://img.youtube.com/vi/AJtDXIazrMo/hqdefault.jpg',
    title: 'Love Me Like You Do',
    artist: 'Ellie Goulding',
    tags: ['pop', 'contemporary', 'romantic', 'golden-hour', 'synth-pop'],
    roomIds: ['pop', 'listening-lounge'],
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
    id: 'track-pop-02',
    youtubeId: 'LjhCEhWiKXk',
    coverImage: 'https://img.youtube.com/vi/LjhCEhWiKXk/hqdefault.jpg',
    title: 'Just The Way You Are',
    artist: 'Bruno Mars',
    tags: ['pop', 'classic', 'sweet', 'contemporary', 'romantic'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2010,
    isFeatured: true,
    addedAt: '2026-01-02T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
This is classic Bruno Mars. Pure, unfiltered praise without any second-guessing. Simple, sincere, and makes whoever is listening feel genuinely valued.

**Maica:**
Every girl knows this song by heart. It reminds you that true love doesn't ask you to change anything — it loves you exactly as you are.`,
  },
  {
    id: 'track-pop-03',
    youtubeId: '450p7goxZqg',
    coverImage: 'https://img.youtube.com/vi/450p7goxZqg/hqdefault.jpg',
    title: 'All of Me',
    artist: 'John Legend',
    tags: ['pop', 'piano', 'ballad', 'soulful', 'devotion'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2013,
    isFeatured: true,
    addedAt: '2026-01-03T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Piano-driven, vulnerable, and completely grounded. Loving someone with all their curves and edges, all perfect imperfections.

**Maica:**
Kanang kanta nga makapahilom nimo kay every lyric speaks truth. 'You're my end and my beginning.' Very touching. 🤍`,
  },
  {
    id: 'track-pop-04',
    youtubeId: '8xg3vE8Ie_E',
    coverImage: 'https://img.youtube.com/vi/8xg3vE8Ie_E/hqdefault.jpg',
    title: 'Love Story',
    artist: 'Taylor Swift',
    tags: ['pop', 'country-pop', 'classic', 'nostalgic', 'storytelling'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2008,
    isFeatured: true,
    addedAt: '2026-01-04T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
The narrative arc in this song is timeless. It captures youthful optimism and the courage to choose each other against all odds.

**Maica:**
The balcony scene and the key change! This brings back so many childhood daydreams. It's pure fairy tale magic. ✨`,
  },
  {
    id: 'track-pop-05',
    youtubeId: 'rtOvBOTyX00',
    coverImage: 'https://img.youtube.com/vi/rtOvBOTyX00/hqdefault.jpg',
    title: 'A Thousand Years',
    artist: 'Christina Perri',
    tags: ['pop', 'ballad', 'timeless', 'covenant', 'gentle'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2011,
    isFeatured: true,
    addedAt: '2026-01-05T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
An anthem of steady patience. It represents standing by someone across time, through every season, quiet and unbroken.

**Maica:**
Gusto nako mag-ukulele ani pirmi samtang nagpahuway sa hapon. It feels like a promise that doesn't rush. 🌿`,
  },
  {
    id: 'track-pop-06',
    youtubeId: 'Lo4_K4relMg',
    coverImage: 'https://img.youtube.com/vi/Lo4_K4relMg/hqdefault.jpg',
    title: 'Snap',
    artist: 'Rosa Linn',
    tags: ['pop', 'indie-pop', 'folk-pop', 'catchy', 'acoustic'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2022,
    isFeatured: true,
    addedAt: '2026-01-06T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
The finger snaps and driving acoustic strumming give this an undeniable momentum. Honest about how hard it is to let thoughts settle.

**Maica:**
Makahilom ug makasayaw at the same time. Very catchy pero naay emotional weight ang chorus. 🌸`,
  },
  {
    id: 'track-pop-07',
    youtubeId: 'W8a4sUabCUo',
    coverImage: 'https://img.youtube.com/vi/W8a4sUabCUo/hqdefault.jpg',
    title: 'Dandelions',
    artist: 'Ruth B.',
    tags: ['pop', 'piano-pop', 'whimsical', 'warm', 'daydream'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2017,
    isFeatured: true,
    addedAt: '2026-01-07T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Gentle piano chords and an innocent wish for permanence. It feels like watching seed heads blow across a grassy afternoon field.

**Maica:**
Murag kanang naglakaw-lakaw sa bukid nya naghandom sa kaugmaon. Very sweet and warm melody. 🌼`,
  },
  {
    id: 'track-pop-08',
    youtubeId: 'JHG3Wl0dCQo',
    coverImage: 'https://img.youtube.com/vi/JHG3Wl0dCQo/hqdefault.jpg',
    title: 'Ehu Girl',
    artist: 'Kolohe Kai',
    tags: ['pop', 'reggae-pop', 'island-vibes', 'sunny', 'acoustic'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2009,
    isFeatured: true,
    addedAt: '2026-01-08T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Pure island sunshine and easygoing groove. Instantly lifts any heavy room mood with breezy ukulele rhythms.

**Maica:**
Ka-cheerful ani oy! Murag kanang naa ta sa dagat nya presko kaayo ang hangin. Makapahiyom jud dayon. 🌺🌊`,
  },
  {
    id: 'track-pop-09',
    youtubeId: 'PtyNOgNqilg',
    coverImage: 'https://img.youtube.com/vi/PtyNOgNqilg/hqdefault.jpg',
    title: '12:51',
    artist: 'Krissy & Ericka',
    tags: ['pop', 'acoustic', 'late-night', 'nostalgic', 'filipino-pop'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2012,
    isFeatured: true,
    addedAt: '2026-01-09T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Quiet late-night nostalgia. The exact minute when the world is asleep and thoughts about the one you care about become loud and crystal clear.

**Maica:**
High school midnight anthem! Kana ganing magtan-aw kas orasan unya maghuna-huna ka niya. Very tender. 🌙`,
  },
  {
    id: 'track-pop-10',
    youtubeId: '2ljKgfeDi-c',
    coverImage: 'https://img.youtube.com/vi/2ljKgfeDi-c/hqdefault.jpg',
    title: 'The One That Got Away',
    artist: 'Katy Perry',
    tags: ['pop', 'nostalgia', 'bittersweet', 'acoustic-pop', 'story'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2011,
    isFeatured: true,
    addedAt: '2026-01-10T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Bittersweet and powerful. A reminder to cherish every present moment so nothing genuine ever slips into a 'what if'.

**Maica:**
Makadala ug nostalgic luha usahay. It reminds us to fight for the people who truly matter every single day. 🤍`,
  },
  {
    id: 'track-pop-11',
    youtubeId: 'v920vOfntyQ',
    coverImage: 'https://img.youtube.com/vi/v920vOfntyQ/hqdefault.jpg',
    title: 'Dream Girl',
    artist: 'Kolohe Kai',
    tags: ['pop', 'island-pop', 'reggae-pop', 'sweet', 'feel-good'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2011,
    isFeatured: true,
    addedAt: '2026-01-11T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Sun-kissed island strums and pure gratitude. That exact realization that your actual prayer walked into real life.

**Maica:**
Hehe makalingaw kaayo ang beat! Kanang upbeat nga gugma nga walay stress, puro pasalamat ug kalipay. ☀️🌻`,
  },
  {
    id: 'track-pop-12',
    youtubeId: '0nUvr_5iRHk',
    coverImage: 'https://img.youtube.com/vi/0nUvr_5iRHk/hqdefault.jpg',
    title: 'Back To December',
    artist: 'Taylor Swift',
    tags: ['pop', 'country-pop', 'reflective', 'emotional', 'orchestral'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2010,
    isFeatured: true,
    addedAt: '2026-01-12T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
One of Taylor Swift's most mature ballads. Owning mistakes with complete humility and honoring someone who gave pure loyalty.

**Maica:**
Grabe ka dramatic ang strings and drums. Very heartfelt apology and deep appreciation for someone's genuine care. ❄️`,
  },
  {
    id: 'track-pop-13',
    youtubeId: 'un60RISzE-A',
    coverImage: 'https://img.youtube.com/vi/un60RISzE-A/hqdefault.jpg',
    title: 'Terrified',
    artist: 'Katharine McPhee ft. Zachary Levi',
    tags: ['pop', 'acoustic', 'duet', 'tender', 'vulnerable'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2010,
    isFeatured: true,
    addedAt: '2026-01-13T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
The acoustic interplay here is pristine. That tender nervousness when something is so good and so true that it scares you in the best way.

**Maica:**
Duet goals kaayo! Kanang feeling nga 'you give me butterflies' pero at the same time peaceful kaayo imong kasingkasing. 🦋✨`,
  },
  {
    id: 'track-pop-14',
    youtubeId: 'Trjrj_fQnIM',
    coverImage: 'https://img.youtube.com/vi/Trjrj_fQnIM/hqdefault.jpg',
    title: 'Beautiful in White',
    artist: 'Shane Filan (Westlife)',
    tags: ['pop', 'wedding-ballad', 'covenant', 'reverent', 'acoustic-pop'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2017,
    isFeatured: true,
    addedAt: '2026-01-14T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Shane Filan's voice carrying Canon in D harmonic roots. Reverent, sacred, and picturing that lifelong covenant under God's grace.

**Maica:**
Puhon lovey! Grabe ka prayerful ug solemn ani nga kanta. Kanang makahilak kas kalipay sa altar. 🤍🕊️`,
  },
  {
    id: 'track-pop-15',
    youtubeId: '0d1ftnH-644',
    coverImage: 'https://img.youtube.com/vi/0d1ftnH-644/hqdefault.jpg',
    title: 'Perfect',
    artist: 'Ed Sheeran',
    tags: ['pop', 'contemporary', 'romantic', 'slow-dance', 'barefoot-in-grass'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2017,
    isFeatured: true,
    addedAt: '2026-02-27T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
An absolute modern romantic classic. Dancing barefoot in the grass under the stars, feeling like you found your person against all odds.

**Maica:**
Ka-sweet jud sa Perfect lovey! Kanang slow dance sa kilid sa balay samtang bugnaw ang simoy sa hangin. 🤍✨`,
  },
  {
    id: 'track-pop-16',
    youtubeId: 'HuSqN_jxYEg',
    coverImage: 'https://img.youtube.com/vi/HuSqN_jxYEg/hqdefault.jpg',
    title: "Say You Won't Let Go",
    artist: 'James Arthur',
    tags: ['pop', 'acoustic', 'devotion', 'heartfelt', 'lifelong'],
    roomIds: ['pop', 'listening-lounge'],
    genre: 'pop',
    year: 2016,
    isFeatured: true,
    addedAt: '2026-02-28T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Fingerpicked acoustic guitar and a promise that looks 50 years into the future. Loving someone until you're both old and grey.

**Maica:**
Makatandog jud sa kasingkasing! 'I wanna stay with you until we're grey and old.' Unongay hangtod sa katapusan. 🕊️🌿`,
  },

  // =========================================================================
  // 2. 💿 SOFT ROCK / ADULT CONTEMPORARY (6 tracks)
  // =========================================================================
  {
    id: 'track-softrock-01',
    youtubeId: 'ZnOAK04tJhc',
    coverImage: 'https://img.youtube.com/vi/ZnOAK04tJhc/hqdefault.jpg',
    title: 'I Lay My Love on You',
    artist: 'Westlife',
    tags: ['soft-rock', 'boyband', 'nostalgic', 'classic', 'acoustic-pop'],
    roomIds: ['soft-rock', 'listening-lounge'],
    genre: 'soft-rock',
    year: 2000,
    isFeatured: true,
    addedAt: '2026-01-15T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
The golden era of pop harmonies. Clean acoustic strumming, upbeat percussion, and that simple, honest commitment to trust someone fully.

**Maica:**
Classic Westlife jud! Bisan kinsa makanta sa chorus ani. Very nostalgic and feel-good ang vibe pirmi. 💿✨`,
  },
  {
    id: 'track-softrock-02',
    youtubeId: '_mlWHMHQ8f0',
    coverImage: 'https://img.youtube.com/vi/_mlWHMHQ8f0/hqdefault.jpg',
    title: 'My Love',
    artist: 'Westlife',
    tags: ['soft-rock', 'ballad', 'nostalgia', 'longing', 'harmony'],
    roomIds: ['soft-rock', 'listening-lounge'],
    genre: 'soft-rock',
    year: 2000,
    isFeatured: true,
    addedAt: '2026-01-16T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
That classic key change in the final chorus is iconic. Speaking of crossing oceans and mountains just to be home beside the one you love.

**Maica:**
'Where the skies are blue to see you once again...' Makabalik jud kas mga karaan nga hapon uban sa pamilya. Unforgettable. ☁️`,
  },
  {
    id: 'track-softrock-03',
    youtubeId: 'xK4ZqrLys_k',
    coverImage: 'https://img.youtube.com/vi/xK4ZqrLys_k/hqdefault.jpg',
    title: 'Iris',
    artist: 'Goo Goo Dolls',
    tags: ['soft-rock', 'alt-rock', 'mandolin', 'passionate', '90s-classic'],
    roomIds: ['soft-rock', 'listening-lounge'],
    genre: 'soft-rock',
    year: 1998,
    isFeatured: true,
    addedAt: '2026-01-17T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
The alternate guitar tuning, the swelling mandolins, and John Rzeznik's gravelly conviction. Wanting just one person to truly know you.

**Maica:**
Ang passion sa pagkanta makakilabot! 'I just want you to know who I am.' Very powerful and emotional anthem. 🎸`,
  },
  {
    id: 'track-softrock-04',
    youtubeId: 'Jtauh8GcxBY',
    coverImage: 'https://img.youtube.com/vi/Jtauh8GcxBY/hqdefault.jpg',
    title: 'Before You Go',
    artist: 'Lewis Capaldi',
    tags: ['soft-rock', 'ballad', 'raw-vocals', 'emotional', 'contemporary'],
    roomIds: ['soft-rock', 'listening-lounge'],
    genre: 'soft-rock',
    year: 2019,
    isFeatured: true,
    addedAt: '2026-01-18T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Lewis Capaldi's raw vocal rasp hits deep. Emphasizing how crucial it is to listen, reach out, and never leave words unsaid.

**Maica:**
Grabe ka heavy ang emotion. It reminds us nga mag-care jud ta pirmi sa usag usa, especially when things get quiet or overwhelming. 🤎`,
  },
  {
    id: 'track-softrock-05',
    youtubeId: 'qHD61OR15r0',
    coverImage: 'https://img.youtube.com/vi/qHD61OR15r0/hqdefault.jpg',
    title: 'Passenger Seat',
    artist: 'Stephen Speaks',
    tags: ['soft-rock', 'acoustic', 'late-night-drive', 'peaceful', 'classic'],
    roomIds: ['soft-rock', 'listening-lounge'],
    genre: 'soft-rock',
    year: 2001,
    isFeatured: true,
    addedAt: '2026-01-19T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
The definitive late-night road trip song. Looking over at someone sleeping peacefully in the passenger seat and knowing you're completely content.

**Maica:**
Mao ni akong paborito paminawon sa byahe lovey. Kanang nighttime motorcycle or car ride nga bugnaw ang hangin ug hilom ang dalan. 🚗✨`,
  },
  {
    id: 'track-softrock-06',
    youtubeId: 'kPa7bsKwL-c',
    coverImage: 'https://img.youtube.com/vi/kPa7bsKwL-c/hqdefault.jpg',
    title: 'Die With A Smile',
    artist: 'Lady Gaga, Bruno Mars',
    tags: ['soft-rock', 'soul-rock', 'duet', 'vintage', 'epic-ballad'],
    roomIds: ['soft-rock', 'listening-lounge'],
    genre: 'soft-rock',
    year: 2024,
    isFeatured: true,
    addedAt: '2026-01-20T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
70s vintage soul-rock revival at its finest. Huge vocal dynamics, analog organs, and making sure that the final chapter is filled with grace.

**Maica:**
Grabe nga collaboration! Ang harmony ni Lady Gaga ug Bruno Mars kay world-class kaayo. Pure heartfelt dedication. 🌹`,
  },

  // =========================================================================
  // 3. 🌿 INDIE / ALTERNATIVE / INDIE POP (5 tracks)
  // =========================================================================
  {
    id: 'track-indie-01',
    youtubeId: 'GhQxrCrVSyw',
    coverImage: 'https://img.youtube.com/vi/GhQxrCrVSyw/hqdefault.jpg',
    title: 'Until I Found You',
    artist: 'Stephen Sanchez',
    tags: ['indie', 'retro-pop', '50s-vibe', 'doo-wop', 'vintage-romance'],
    roomIds: ['indie', 'listening-lounge'],
    genre: 'indie',
    year: 2021,
    isFeatured: true,
    addedAt: '2026-01-21T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Classic 1950s doo-wop guitar reverb and crooner vocals. Finding someone who makes every previous heartbreak make complete sense.

**Maica:**
Murag karaan nga vintage vinyl player ba! Very dreamy and charming. 'I would never fall in love until I found her.' 🌿🕊️`,
  },
  {
    id: 'track-indie-02',
    youtubeId: 'z0aD0J8Gk7U',
    coverImage: 'https://img.youtube.com/vi/z0aD0J8Gk7U/hqdefault.jpg',
    title: 'To the Bone',
    artist: 'Pamungkas',
    tags: ['indie', 'indie-rock', 'southeast-asia', 'soulful', 'passionate'],
    roomIds: ['indie', 'listening-lounge'],
    genre: 'indie',
    year: 2019,
    isFeatured: true,
    addedAt: '2026-01-22T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
That raw bassline and earnest chorus. Pamungkas captures the intensity of loving someone down to the very bone marrow.

**Maica:**
Sikat kaayo ni pero dili jud makapuol. Kanang passionate kaayo ang pagkanta sa 'Take me to the bone!' Gikan sa kasingkasing. 🎸`,
  },
  {
    id: 'track-indie-03',
    youtubeId: 'gVAy3IZiL0s',
    coverImage: 'https://img.youtube.com/vi/gVAy3IZiL0s/hqdefault.jpg',
    title: 'Atlantis',
    artist: 'Seafret',
    tags: ['indie', 'indie-folk', 'atmospheric', 'building', 'emotional'],
    roomIds: ['indie', 'listening-lounge'],
    genre: 'indie',
    year: 2016,
    isFeatured: true,
    addedAt: '2026-01-23T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Atmospheric indie folk that starts quiet as a whisper and explodes into a tidal wave of acoustic emotion.

**Maica:**
Mao ni ang kanta nga makapahinuklog jud nimo pag-ayo. Beautiful and haunting acoustic dynamics. 🌊✨`,
  },
  {
    id: 'track-indie-04',
    youtubeId: 'dstuitW8PWM',
    coverImage: 'https://img.youtube.com/vi/dstuitW8PWM/hqdefault.jpg',
    title: 'Happiness',
    artist: 'Rex Orange County',
    tags: ['indie', 'bedroom-pop', 'charming', 'honest', 'cozy'],
    roomIds: ['indie', 'listening-lounge'],
    genre: 'indie',
    year: 2017,
    isFeatured: true,
    addedAt: '2026-01-24T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Lo-fi jazz chords, quirky horn lines, and total sincerity. Asking someone to still love you when you're old, frail, and clumsy.

**Maica:**
So cozy and adorable! Kana bitawng magkauban ta hangtod sa pagkatigulang sa bukid homestead. Perfect vibe. 🏡🌻`,
  },
  {
    id: 'track-indie-05',
    youtubeId: '6k8cpUkKK4c',
    coverImage: 'https://img.youtube.com/vi/6k8cpUkKK4c/hqdefault.jpg',
    title: 'Count on Me',
    artist: 'Bruno Mars',
    tags: ['indie', 'acoustic-folk', 'friendship', 'loyalty', 'wholesome'],
    roomIds: ['indie', 'listening-lounge'],
    genre: 'indie',
    year: 2010,
    isFeatured: true,
    addedAt: '2026-01-25T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Simple campfire folk strumming about loyalty. Being that Narra tree shelter that always picks up the phone no matter the hour.

**Maica:**
Unongay jud pirmi! Kanang kahibaw ka nga whatever happens, naa kay kasandigan ug kasaligan. Very comforting. 🤍🌲`,
  },

  // =========================================================================
  // 4. ☕ JAZZ / JAZZ-POP / BOSSA-INSPIRED (9 tracks)
  // =========================================================================
  {
    id: 'track-jazz-01',
    youtubeId: 'Ip6cw8gfHHI',
    coverImage: 'https://img.youtube.com/vi/Ip6cw8gfHHI/hqdefault.jpg',
    title: 'Here With Me',
    artist: 'd4vd',
    tags: ['jazz', 'indie-jazz', 'romantic', 'slow-dance', 'dreamy'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2022,
    isFeatured: true,
    addedAt: '2026-01-26T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Warm analog guitars, nostalgic tape hiss, and slow-dancing under twilight stars. Simple and deeply grounding.

**Maica:**
Murag naghinay-hinay ug sayaw sa balcony samtang nagtaligsik sa gawas. So peaceful and gentle. ☕✨`,
  },
  {
    id: 'track-jazz-02',
    youtubeId: 'Zu2Spp4nrTM',
    coverImage: 'https://img.youtube.com/vi/Zu2Spp4nrTM/hqdefault.jpg',
    title: 'Promise',
    artist: 'Laufey',
    tags: ['jazz', 'modern-jazz', 'orchestral', 'piano', 'cinematic'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2023,
    isFeatured: true,
    addedAt: '2026-01-27T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Laufey's classical cello background and jazz piano chords shine here. A masterclass in modern acoustic storytelling and quiet restraint.

**Maica:**
Grabe ka elegant sa tingog ni Laufey! Murag naa kas old jazz lounge sa Paris nga nag-ulan sa gawas. 🌧️🎻`,
  },
  {
    id: 'track-jazz-03',
    youtubeId: 'NLphEFOyoqM',
    coverImage: 'https://img.youtube.com/vi/NLphEFOyoqM/hqdefault.jpg',
    title: 'Let You Break My Heart Again',
    artist: 'Laufey & Philharmonia Orchestra',
    tags: ['jazz', 'orchestral-jazz', 'bossa', 'golden-age', 'lush'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2021,
    isFeatured: true,
    addedAt: '2026-01-28T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
The Philharmonia Orchestra strings wrapped around jazz voicings recreate the 1940s Hollywood cinema sound effortlessly.

**Maica:**
Mao ni kanang makapahandom sa daang sine. The strings are so lush, murag naglutaw kas panganod. ☁️🎷`,
  },
  {
    id: 'track-jazz-04',
    youtubeId: 'lSD_L-xic9o',
    coverImage: 'https://img.youtube.com/vi/lSD_L-xic9o/hqdefault.jpg',
    title: 'From The Start',
    artist: 'Laufey',
    tags: ['jazz', 'bossa-nova', 'upbeat', 'playful', 'scatting'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2023,
    isFeatured: true,
    addedAt: '2026-01-29T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Bossa nova rhythm with rapid-fire acoustic guitar comping. Playful, witty, and brings an infectious bounce to the room.

**Maica:**
Hahaha 'Cupid's being mean!' Makasayaw jud ka sa bossa nova beat samtang naglung-ag or nag-atiman sa tanom. 🌸☕`,
  },
  {
    id: 'track-jazz-05',
    youtubeId: '9JSn36U7d4w',
    coverImage: 'https://img.youtube.com/vi/9JSn36U7d4w/hqdefault.jpg',
    title: 'So Easy (To Fall In Love)',
    artist: 'Olivia Dean',
    tags: ['jazz', 'soul-jazz', 'contemporary', 'warm', 'smooth'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2023,
    isFeatured: true,
    addedAt: '2026-01-30T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Smooth brass lines, lazy Sunday drum brushes, and a voice like warm caramel. It celebrates how effortless true love feels when it's right.

**Maica:**
So smooth and comforting! Murag kanang mainit nga kape sa sayong buntag samtang presko pa ang adlaw. ☕🤎`,
  },
  {
    id: 'track-jazz-06',
    youtubeId: 'm2htQJuFrnY',
    coverImage: 'https://img.youtube.com/vi/m2htQJuFrnY/hqdefault.jpg',
    title: 'At My Worst',
    artist: 'Pink Sweat$',
    tags: ['jazz', 'rnb-jazz', 'sweet', 'wholesome', 'acoustic-groove'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2020,
    isFeatured: true,
    addedAt: '2026-01-31T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Clean guitar plucks and falsetto soul. The promise that real devotion doesn't vanish during bad days or tough seasons.

**Maica:**
'Don't you worry, I'll be there, whenever you want me.' Unconditional care and reassurance jud. 🤍`,
  },
  {
    id: 'track-jazz-07',
    youtubeId: 'emm0uGDGg2o',
    coverImage: 'https://img.youtube.com/vi/emm0uGDGg2o/hqdefault.jpg',
    title: 'Dancing With Your Ghost',
    artist: 'Sasha Alex Sloan',
    tags: ['jazz', 'indie-ballad', 'acoustic', 'late-night', 'tender'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2019,
    isFeatured: true,
    addedAt: '2026-02-01T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Intimate piano chords and a hushed vocal performance. Reflects on sacred memories that linger like gentle echoes in a quiet room.

**Maica:**
Mao ni kanang paminawon kung ngitngit na ang balay unya naghunahuna kas tanang kaagi ug milestones. Tender kaayo. 🕯️`,
  },
  {
    id: 'track-jazz-08',
    youtubeId: 'ALStsZoNRJM',
    coverImage: 'https://img.youtube.com/vi/ALStsZoNRJM/hqdefault.jpg',
    title: 'I See The Light (Cover)',
    artist: 'Arthur Miguel',
    tags: ['jazz', 'acoustic-cover', 'filipino', 'intimate', 'lanterns'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2022,
    isFeatured: true,
    addedAt: '2026-02-02T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Arthur Miguel's gentle acoustic interpretation of Tangled's lantern scene. The fog clearing to reveal what was always meant to be.

**Maica:**
The lantern scene! Murag naglutaw ang mga suga sa langit. Grabe ka peaceful ani nga Filipino acoustic cover. 🏮✨`,
  },
  {
    id: 'track-jazz-09',
    youtubeId: '2dTQGWc8T3k',
    coverImage: 'https://img.youtube.com/vi/2dTQGWc8T3k/hqdefault.jpg',
    title: 'I Need You (Cover)',
    artist: 'Arthur Miguel',
    tags: ['jazz', 'acoustic-cover', 'soulful', 'lofi-acoustic', 'serene'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2022,
    isFeatured: true,
    addedAt: '2026-02-03T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Stripped-down nylon string acoustic cover. Pure warmth and vulnerability, like sitting across from someone in the kitchen at midnight.

**Maica:**
Ka-relaxing paminawon. Simple ra ang guitar pero directly moigo sa dughan. Perfect pampatulog o pamparelax. 🍵🤍`,
  },
  {
    id: 'track-jazz-10',
    youtubeId: 'kk5fYZgagA4',
    coverImage: 'https://img.youtube.com/vi/kk5fYZgagA4/hqdefault.jpg',
    title: 'Valentine',
    artist: 'Laufey',
    tags: ['jazz', 'bossa-nova', 'romantic', 'vintage', 'playful'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2022,
    isFeatured: true,
    addedAt: '2026-03-01T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Bossa nova comping with Laufey's warm, vintage vocal tone. That sudden realization that you've fallen hopelessly and delightfully for someone.

**Maica:**
Makapahiyom jud dayon! Bossa vibe nga murag nagtuyok-tuyok kas sala samtang naghandom sa imong hinigugma. 🌸☕`,
  },
  {
    id: 'track-jazz-11',
    youtubeId: 'KaN00VvgCco',
    coverImage: 'https://img.youtube.com/vi/KaN00VvgCco/hqdefault.jpg',
    title: 'Fly Me to the Moon',
    artist: 'Frank Sinatra',
    tags: ['jazz', 'standard', 'swing', 'timeless', 'space-romance'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 1964,
    isFeatured: true,
    addedAt: '2026-03-02T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
The gold standard of swing and jazz romance. Count Basie arrangement, effortless swagger, and reaching out into the stars together.

**Maica:**
Timeless classic! 'Fill my heart with song and let me sing forever more.' Kanang kanunayng abtik ug presko paminawon. 🌙⭐`,
  },
  {
    id: 'track-jazz-12',
    youtubeId: 'UVevH51EYo0',
    coverImage: 'https://img.youtube.com/vi/UVevH51EYo0/hqdefault.jpg',
    title: 'Goddess',
    artist: 'Laufey',
    tags: ['jazz', 'cinematic-jazz', 'orchestral', 'piano', 'dramatic'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2024,
    isFeatured: true,
    addedAt: '2026-03-03T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
The monumental piano crescendo and full symphonic fury in the second half. Wanting to be seen as a real, human soul rather than an idealized illusion.

**Maica:**
Grabe ang power and vulnerability ni Laufey diri! The orchestral buildup makahatag jud ug tinuod nga goosebumps. 🎻✨`,
  },
  {
    id: 'track-jazz-13',
    youtubeId: 'pftT6MhrtLE',
    coverImage: 'https://img.youtube.com/vi/pftT6MhrtLE/hqdefault.jpg',
    title: 'anything',
    artist: 'Adrianne Lenker',
    tags: ['jazz', 'acoustic-intimate', 'indie-folk', 'whisper', 'raw-honesty'],
    roomIds: ['jazz', 'listening-lounge'],
    genre: 'jazz',
    year: 2020,
    isFeatured: true,
    addedAt: '2026-03-04T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Delicate fingerstyle acoustic intimacy. Recorded directly to analog tape with tape flutter and room creaks. Pure honesty without a shred of pretense.

**Maica:**
Hilom kaayo, murag gihunghong diretso sa dunggan. Very raw and delicate, perfect for late night reflection in the cabin. 🕯️🍃`,
  },

  // =========================================================================
  // 5. 🎬 MUSICAL / CINEMATIC ROMANCE (2 tracks)
  // =========================================================================
  {
    id: 'track-cinematic-01',
    youtubeId: 'RI-HOQ27QEM',
    coverImage: 'https://img.youtube.com/vi/RI-HOQ27QEM/hqdefault.jpg',
    title: 'Rewrite The Stars',
    artist: 'Zac Efron & Zendaya',
    tags: ['cinematic', 'musical', 'duet', 'aerial', 'grand'],
    roomIds: ['cinematic', 'listening-lounge'],
    genre: 'cinematic',
    year: 2017,
    isFeatured: true,
    addedAt: '2026-02-04T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
The cinematic aerial trapeze duet from The Greatest Showman. Defying societal expectations and choosing to build your own destiny together.

**Maica:**
'What if we rewrite the stars?' Grabe ang energy ug paglaum ani nga kanta lovey! Walay imposible kung magkahiusa. 🎪⭐`,
  },
  {
    id: 'track-cinematic-02',
    youtubeId: 'V1Pl8CzNzCw',
    coverImage: 'https://img.youtube.com/vi/V1Pl8CzNzCw/hqdefault.jpg',
    title: 'lovely',
    artist: 'Billie Eilish & Khalid',
    tags: ['cinematic', 'cello', 'haunting', 'duet', 'atmospheric'],
    roomIds: ['cinematic', 'listening-lounge'],
    genre: 'cinematic',
    year: 2018,
    isFeatured: true,
    addedAt: '2026-02-05T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Haunting cello melodies paired with glass-shattering vocal harmonies. Finding shelter and camaraderie when overcoming inner winters.

**Maica:**
Ang cello sa intro makahatag dayon ug bugnaw nga hangin. Very deep, artistic, ug solemn kaayo paminawon. 🌧️🎻`,
  },
  {
    id: 'track-cinematic-03',
    youtubeId: 'RkozLmiLBc0',
    coverImage: 'https://img.youtube.com/vi/RkozLmiLBc0/hqdefault.jpg',
    title: 'A Million Dreams',
    artist: 'Ziv Zaifman, Hugh Jackman, & Michelle Williams',
    tags: ['cinematic', 'musical', 'dreams', 'hopeful', 'orchestral'],
    roomIds: ['cinematic', 'listening-lounge'],
    genre: 'cinematic',
    year: 2017,
    isFeatured: true,
    addedAt: '2026-03-05T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
A dream of building a world from scratch together. Every visionary project starts with a spark that two people guard and cultivate.

**Maica:**
Makahilak sa paglaum lovey! Kanang magdamgo ta sa atong kaugalingong balay ug kaugmaon. 'A million dreams for the world we're gonna make.' 🎪✨`,
  },
  {
    id: 'track-cinematic-04',
    youtubeId: 'LmwcJ3UsX48',
    coverImage: 'https://img.youtube.com/vi/LmwcJ3UsX48/hqdefault.jpg',
    title: 'Never Enough',
    artist: 'Loren Allred',
    tags: ['cinematic', 'musical', 'power-ballad', 'showstopper', 'orchestral'],
    roomIds: ['cinematic', 'listening-lounge'],
    genre: 'cinematic',
    year: 2017,
    isFeatured: true,
    addedAt: '2026-03-06T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
A vocal showstopper of soaring heights. All the towers of gold and applause in the universe mean nothing without the one you love holding your hand.

**Maica:**
Grabe ka dako sa tingog ni Loren Allred! 'Without you, all the shine of a thousand spotlights is never enough.' So powerful! 🌟🎤`,
  },

  // =========================================================================
  // 6. 🇵🇭 FILIPINO / OPM (10 tracks)
  // =========================================================================
  {
    id: 'track-opm-01',
    youtubeId: 'BHpDOlgisNE',
    coverImage: 'https://img.youtube.com/vi/BHpDOlgisNE/hqdefault.jpg',
    title: '14',
    artist: 'Silent Sanctuary',
    tags: ['opm', 'cello-rock', 'nostalgic', 'acoustic-rock', 'pinoy-classic'],
    roomIds: ['opm', 'listening-lounge'],
    genre: 'opm',
    year: 2007,
    isFeatured: true,
    addedAt: '2026-02-06T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Silent Sanctuary's signature cello and violin intertwining with rock guitar. A defining high school anthem of earnest Philippine rock.

**Maica:**
Kinsa may di makahinumdom sa 14! The cello and the emotional chorus are etched in every Filipino heart. 🎻🖤`,
  },
  {
    id: 'track-opm-02',
    youtubeId: 'PeZ-rJqTwkw',
    coverImage: 'https://img.youtube.com/vi/PeZ-rJqTwkw/hqdefault.jpg',
    title: 'Ikaw At Ako',
    artist: 'Moira Dela Torre & Jason Marvin',
    tags: ['opm', 'acoustic', 'wedding-song', 'gentle', 'balcony'],
    roomIds: ['opm', 'listening-lounge'],
    genre: 'opm',
    year: 2019,
    isFeatured: true,
    addedAt: '2026-02-07T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
An acoustic covenant song cherished for its sincere vows and gentle acoustic guitar. It feels peaceful, like sitting under the afternoon sky with someone you care about.

**Maica:**
Grabe ka sweet ani nga kanta lovey. Very gentle and prayerful ang vibe. Kanang calm assurance nga everything will be okay. 🤍`,
  },
  {
    id: 'track-opm-03',
    youtubeId: '2affmiWhHh4',
    coverImage: 'https://img.youtube.com/vi/2affmiWhHh4/hqdefault.jpg',
    title: 'Kay Tagal Kitang Hinintay',
    artist: 'Sponge Cola',
    tags: ['opm', 'opm-rock', 'passionate', 'patient-love', 'anthem'],
    roomIds: ['opm', 'listening-lounge'],
    genre: 'opm',
    year: 2011,
    isFeatured: true,
    addedAt: '2026-02-08T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Classic OPM rock anthem. The feeling of patient endurance, knowing that the wait was completely worth it because you found the right person.

**Maica:**
Nakatatak jud ni sa kasingkasing! Ang energy sa Sponge Cola, grabe ka nostalgic ug makakanta jud ka sa chorus. 🤍🎸`,
  },
  {
    id: 'track-opm-04',
    youtubeId: '2oNq-n6E5oI',
    coverImage: 'https://img.youtube.com/vi/2oNq-n6E5oI/hqdefault.jpg',
    title: 'Honey My Love (So Sweet)',
    artist: 'April Boys',
    tags: ['opm', 'jukebox', 'retro-opm', 'sweet', 'feel-good'],
    roomIds: ['opm', 'listening-lounge'],
    genre: 'opm',
    year: 1995,
    isFeatured: true,
    addedAt: '2026-02-09T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Classic Pinoy jukebox sweetness. Playful, unapologetically cheesy, and guaranteed to bring an instant smile to our faces.

**Maica:**
Hahahaha makapahiyom jud dayon! Kanang kanta nga makasayaw ug makapatawa ba lovey, lingaw kaayo paminawon. 😂🍯`,
  },
  {
    id: 'track-opm-05',
    youtubeId: 'PnV2EyGQ0wY',
    coverImage: 'https://img.youtube.com/vi/PnV2EyGQ0wY/hqdefault.jpg',
    title: 'Your Love',
    artist: 'Juris',
    tags: ['opm', 'acoustic', 'comforting', 'gentle-vocals', 'peace'],
    roomIds: ['opm', 'listening-lounge'],
    genre: 'opm',
    year: 2010,
    isFeatured: true,
    addedAt: '2026-02-10T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Juris has one of the purest, most comforting acoustic voices in OPM. This song feels like a shelter after a long day of work and study.

**Maica:**
Ka-gentle sa tingog ni Juris mylabs. Murag gakos sa hapon samtang nagpahulay. So soothing and peaceful. ✨🕊️`,
  },
  {
    id: 'track-opm-06',
    youtubeId: 'ZsgX-G0NXu4',
    coverImage: 'https://img.youtube.com/vi/ZsgX-G0NXu4/hqdefault.jpg',
    title: 'Dying Inside To Hold You',
    artist: 'Darren Espanto',
    tags: ['opm', 'ballad', 'vocal-showcase', 'intense', 'heartfelt'],
    roomIds: ['opm', 'listening-lounge'],
    genre: 'opm',
    year: 2017,
    isFeatured: true,
    addedAt: '2026-02-11T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Darren's vocal control and resonance here are exceptional. Capturing that intense longing and restraint when someone is right beside you.

**Maica:**
Grabe ang vocals! Makahilak kadiyot sa ka-heartfelt. Beautiful interpretation jud nga puno ug emosyon. 🤎🎤`,
  },
  {
    id: 'track-opm-07',
    youtubeId: 'fu9yk7gCTbc',
    coverImage: 'https://img.youtube.com/vi/fu9yk7gCTbc/hqdefault.jpg',
    title: 'Palagi (Live Sessions)',
    artist: 'TJ Monterde x KZ Tandingan',
    tags: ['opm', 'acoustic-duet', 'live', 'covenant', 'visayan-soul'],
    roomIds: ['opm', 'listening-lounge'],
    genre: 'opm',
    year: 2024,
    isFeatured: true,
    addedAt: '2026-02-12T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
TJ and KZ singing together is the definition of quiet covenant. 'Palagi' — choosing each other consistently every single sunrise, no matter what.

**Maica:**
Mao jud ni akong paborito lovey! 'Ikaw gihapon sa adlaw-adlaw.' Grabe ka sweet ug unongay jud ta kanunay. 💍🤍`,
  },
  {
    id: 'track-opm-08',
    youtubeId: '5L_nJrCpOCQ',
    coverImage: 'https://img.youtube.com/vi/5L_nJrCpOCQ/hqdefault.jpg',
    title: 'Pagdating ng Panahon (Acoustic Cover)',
    artist: 'Dave Carlos, Jenzen Guino & Carl Dela Cruz',
    tags: ['opm', 'acoustic-cover', 'trio', 'nostalgic', 'providential'],
    roomIds: ['opm', 'listening-lounge'],
    genre: 'opm',
    year: 2023,
    isFeatured: true,
    addedAt: '2026-02-13T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Raw acoustic guitars and three-part harmonies. The reassurance that God orchestrates timing and seasons in His own perfect schedule.

**Maica:**
Sobrang nostalgic ug peaceful. Perfect pang-afternoon kape ug stargazing sa bukid puhon lovey. 🌿☕`,
  },
  {
    id: 'track-opm-09',
    youtubeId: 'fMzKnVPD5bQ',
    coverImage: 'https://img.youtube.com/vi/fMzKnVPD5bQ/hqdefault.jpg',
    title: 'Biyahe (Acoustic Cover)',
    artist: 'Jenzen Guino x Jr Navarro',
    tags: ['opm', 'acoustic', 'road-trip', 'chill', 'motorcycle-ride'],
    roomIds: ['opm', 'listening-lounge'],
    genre: 'opm',
    year: 2023,
    isFeatured: true,
    addedAt: '2026-02-14T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Feels like cruising down the coastal highway at twilight on the motorcycle, feeling the cool evening breeze and shared silence.

**Maica:**
Kanang biyahe nga wa kay gidali kay kuyog nimo imong safe space. Love this acoustic chill vibe so much! 🛵💨`,
  },
  {
    id: 'track-opm-10',
    youtubeId: 'B4HD6aC4Wos',
    coverImage: 'https://img.youtube.com/vi/B4HD6aC4Wos/hqdefault.jpg',
    title: 'Make It With You',
    artist: 'Ben&Ben',
    tags: ['opm', 'folk-pop', 'warm', 'intimate', 'acoustic-cover'],
    roomIds: ['opm', 'listening-lounge'],
    genre: 'opm',
    year: 2020,
    isFeatured: true,
    addedAt: '2026-02-15T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Ben&Ben's acoustic arrangement turns Bread's classic into an intimate declaration of standing by someone through everything life throws.

**Maica:**
Grabe ka cozy ani nga cover lovey. Very warm, like morning coffee together sa balcony uban ang mga tanom. ☕🌸`,
  },
  {
    id: 'track-opm-11',
    youtubeId: 'LTBe9eUQpz8',
    coverImage: 'https://img.youtube.com/vi/LTBe9eUQpz8/hqdefault.jpg',
    title: 'Titibo-Tibo',
    artist: 'Moira Dela Torre',
    tags: ['opm', 'playful', 'acoustic-pop', 'sweet', 'himig-handog'],
    roomIds: ['opm', 'listening-lounge'],
    genre: 'opm',
    year: 2017,
    isFeatured: true,
    addedAt: '2026-03-07T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Moira's sunny, playful acoustic delivery. The unexpected charm of how true connection can soften and brighten up even the toughest demeanor.

**Maica:**
Hahahaha lingaw jud kaayo ni! Makasayaw ka sa ka-cute sa storya ug sa upbeat nga ukulele vibes. 🌸💃`,
  },
  {
    id: 'track-opm-12',
    youtubeId: 'VwRqWqDlgoE',
    coverImage: 'https://img.youtube.com/vi/VwRqWqDlgoE/hqdefault.jpg',
    title: 'Sana',
    artist: 'I Belong to the Zoo',
    tags: ['opm', 'indie-opm', 'acoustic-rock', 'heartbreak', 'emotional'],
    roomIds: ['opm', 'listening-lounge'],
    genre: 'opm',
    year: 2018,
    isFeatured: true,
    addedAt: '2026-03-08T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Raw acoustic emotion that defined the late-2010s Filipino indie scene. Sincere, aching, and delivered with gut-level authenticity.

**Maica:**
Kanang kanta nga makapahilak jud sa tanang nakasuway ug longing. Makatandog kaayo ang acoustic strums. 🌧️🎸`,
  },
  {
    id: 'track-opm-13',
    youtubeId: 'VTyChXSHPVM',
    coverImage: 'https://img.youtube.com/vi/VTyChXSHPVM/hqdefault.jpg',
    title: 'Nang Dumating Ka',
    artist: 'Bandang Lapis',
    tags: ['opm', 'opm-rock', 'gratitude', 'turnaround', 'passionate'],
    roomIds: ['opm', 'listening-lounge'],
    genre: 'opm',
    year: 2021,
    isFeatured: true,
    addedAt: '2026-03-09T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Bandang Lapis brings that earnest pinoy rock passion. Thanking God that someone's arrival turned darkness and aimlessness into meaning and light.

**Maica:**
'Nang dumating ka sa buhay ko, nagbago ang lahat.' Grabe ka tinuod lovey, tinuod jud nga gi-bless ta sa usag-usa. 🤍🎶`,
  },
  {
    id: 'track-opm-14',
    youtubeId: 'ju35otUTaSc',
    coverImage: 'https://img.youtube.com/vi/ju35otUTaSc/hqdefault.jpg',
    title: 'Paubaya',
    artist: 'Moira Dela Torre',
    tags: ['opm', 'piano-ballad', 'grace', 'forgiveness', 'peace'],
    roomIds: ['opm', 'listening-lounge'],
    genre: 'opm',
    year: 2020,
    isFeatured: true,
    addedAt: '2026-03-10T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
The pinnacle of forgiveness and grace. Surrendering control and choosing peace, trusting in higher providence above all bitterness.

**Maica:**
Sobra ka hilom ug bug-at pero puno sa grasya. Kanang paghatag ug kagawasan ug pagpasaylo gikan sa kasingkasing. 🕊️🤍`,
  },

  // =========================================================================
  // 7. 🌧️ EMO / POP-PUNK / ALTERNATIVE EMO (11 tracks)
  // =========================================================================
  {
    id: 'track-emo-01',
    youtubeId: 'CAfNjdcgp4E',
    coverImage: 'https://img.youtube.com/vi/CAfNjdcgp4E/hqdefault.jpg',
    title: 'Stay',
    artist: 'Mayday Parade',
    tags: ['emo', 'pop-punk', 'piano-emo', 'raw', 'passionate'],
    roomIds: ['emo', 'listening-lounge'],
    genre: 'emo',
    year: 2011,
    isFeatured: true,
    addedAt: '2026-02-16T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Mayday Parade's emotional peak. Piano-driven emo ballad about wanting someone to stay through the darkest nights and coldest seasons.

**Maica:**
Mao jud ni ang kanta nga makahilak sa high school emo phase hahaha. Grabe ka raw and passionate ang bridge. 🖤🎹`,
  },
  {
    id: 'track-emo-02',
    youtubeId: 'dNDiJZ1bvZ4',
    coverImage: 'https://img.youtube.com/vi/dNDiJZ1bvZ4/hqdefault.jpg',
    title: 'Sad Song',
    artist: 'We the Kings ft. Elena Coats',
    tags: ['emo', 'pop-punk', 'duet', 'devotion', 'piano-ballad'],
    roomIds: ['emo', 'listening-lounge'],
    genre: 'emo',
    year: 2013,
    isFeatured: true,
    addedAt: '2026-02-17T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Dual vocals that hit right in the heart. 'Without you, I feel broke like I'm half of a whole.' Pure devotion playlist staple.

**Maica:**
Kani jud! Sige kog paminaw ani sauna. So sweet when two voices harmonize so perfectly about needing each other. 🎧🤍`,
  },
  {
    id: 'track-emo-03',
    youtubeId: 'c1qUs0ipz2M',
    coverImage: 'https://img.youtube.com/vi/c1qUs0ipz2M/hqdefault.jpg',
    title: 'Stranger',
    artist: 'Second Hand Serenade',
    tags: ['emo', 'acoustic-emo', 'nostalgic', '2000s', 'raw'],
    roomIds: ['emo', 'listening-lounge'],
    genre: 'emo',
    year: 2008,
    isFeatured: true,
    addedAt: '2026-02-18T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
John Vesely's layered acoustic guitars and earnest vocals. Reminds me of late nights working on coding systems and deep reflection.

**Maica:**
Secondhand Serenade never misses. Sincere acoustic emo that stays in your head forever. 🌧️🎸`,
  },
  {
    id: 'track-emo-04',
    youtubeId: '_BjQI017Mjs',
    coverImage: 'https://img.youtube.com/vi/_BjQI017Mjs/hqdefault.jpg',
    title: 'Tonight',
    artist: 'FM Static',
    tags: ['emo', 'pop-punk', 'acoustic', 'late-night', '2000s-classic'],
    roomIds: ['emo', 'listening-lounge'],
    genre: 'emo',
    year: 2006,
    isFeatured: true,
    addedAt: '2026-02-19T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
The acoustic guitar picking and bittersweet lyrics. One of the definitive mid-2000s acoustic anthems of longing and gratitude.

**Maica:**
Makalingi jud dayon sa kagahapon. Classic kaayo ni lovey, makapahinumdom sa kanang simpleng panahon sa eskwela. 🌙`,
  },
  {
    id: 'track-emo-05',
    youtubeId: 'WMnLqb_EPv0',
    coverImage: 'https://img.youtube.com/vi/WMnLqb_EPv0/hqdefault.jpg',
    title: 'Tongue Tied',
    artist: 'Faber Drive',
    tags: ['emo', 'pop-rock', 'upbeat', 'playful-emo', 'catchy'],
    roomIds: ['emo', 'listening-lounge'],
    genre: 'emo',
    year: 2007,
    isFeatured: true,
    addedAt: '2026-02-20T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
When words fail because someone's presence takes your breath away. Playful yet deeply honest pop-rock.

**Maica:**
Haha cute kaayo ang lyrics! Very relatable when Clint gets flustered and just says 'basta!' 😂🌸`,
  },
  {
    id: 'track-emo-06',
    youtubeId: 'lTNmec6sOPc',
    coverImage: 'https://img.youtube.com/vi/lTNmec6sOPc/hqdefault.jpg',
    title: 'Therapy',
    artist: 'All Time Low',
    tags: ['emo', 'pop-punk', 'acoustic-ballad', 'comforting', 'shelter'],
    roomIds: ['emo', 'listening-lounge'],
    genre: 'emo',
    year: 2009,
    isFeatured: true,
    addedAt: '2026-02-21T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Alex Gaskarth's acoustic masterpiece about finding healing and someone who understands you without judging.

**Maica:**
Very deep and reassuring. It reminds me how we listen and offer Narra shelter whenever kapoy ang world. 🤍🌲`,
  },
  {
    id: 'track-emo-07',
    youtubeId: 'qAJ0Ty1MZz4',
    coverImage: 'https://img.youtube.com/vi/qAJ0Ty1MZz4/hqdefault.jpg',
    title: 'Fall For You',
    artist: 'Secondhand Serenade',
    tags: ['emo', 'acoustic-rock', 'alt-rock', 'nostalgic', '2000s-emo'],
    roomIds: ['emo', 'listening-lounge'],
    genre: 'emo',
    year: 2008,
    isFeatured: true,
    addedAt: '2026-02-22T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
“Because a girl like you is impossible to find... you're impossible to find.” The definitive acoustic emo anthem. Pure devotion.

**Maica:**
Grabe ka classic! Ang chorus pa lang makabalik dayon sa high school days. Kinahiladman sa kasingkasing. 🖤`,
  },
  {
    id: 'track-emo-08',
    youtubeId: 'WzKhxdDnJV0',
    coverImage: 'https://img.youtube.com/vi/WzKhxdDnJV0/hqdefault.jpg',
    title: 'By Your Side',
    artist: 'Faber Drive',
    tags: ['emo', 'pop-rock', 'steady', 'loyalty', 'rainy-day'],
    roomIds: ['emo', 'listening-lounge'],
    genre: 'emo',
    year: 2009,
    isFeatured: true,
    addedAt: '2026-02-23T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
A vow to stand by someone through the rain and storms. Steady rhythm and comforting guitar chords.

**Maica:**
Unongay jud sa kalipay ug kasakit. That's our promise always lovey. 🌧️🤝`,
  },
  {
    id: 'track-emo-09',
    youtubeId: 'RRKJiM9Njr8',
    coverImage: 'https://img.youtube.com/vi/RRKJiM9Njr8/hqdefault.jpg',
    title: 'Welcome to the Black Parade',
    artist: 'My Chemical Romance',
    tags: ['emo', 'rock-opera', 'anthemic', 'legendary', 'triumphant'],
    roomIds: ['emo', 'listening-lounge'],
    genre: 'emo',
    year: 2006,
    isFeatured: true,
    addedAt: '2026-02-24T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
The greatest emo-rock theatrical march ever written. Resilience, carrying memories forward, and defying fear.

**Maica:**
The iconic G note! Energy through the roof. Unforgettable classic! ⚡🖤`,
  },
  {
    id: 'track-emo-10',
    youtubeId: 'x9v8aNl6Aps',
    coverImage: 'https://img.youtube.com/vi/x9v8aNl6Aps/hqdefault.jpg',
    title: 'Heartache (Studio Jam Session)',
    artist: 'ONE OK ROCK',
    tags: ['emo', 'j-rock', 'acoustic-live', 'passionate', 'vocal-power'],
    roomIds: ['emo', 'listening-lounge'],
    genre: 'emo',
    year: 2015,
    isFeatured: true,
    addedAt: '2026-02-25T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Taka's acoustic live vocals are otherworldly. Soulful acoustic version recorded live in the studio with pure passion.

**Maica:**
Grabe ka powerful sa voice ni Taka! Goosebumps every time that chorus lands. 🎸✨`,
  },
  {
    id: 'track-emo-11',
    youtubeId: '6C9Un8Xd6-8',
    coverImage: 'https://img.youtube.com/vi/6C9Un8Xd6-8/hqdefault.jpg',
    title: 'Wake Up',
    artist: 'Coheed and Cambria',
    tags: ['emo', 'prog-emo', 'acoustic-lullaby', 'peaceful', 'poetic'],
    roomIds: ['emo', 'listening-lounge'],
    genre: 'emo',
    year: 2005,
    isFeatured: true,
    addedAt: '2026-02-26T00:00:00Z',
    metadataSource: 'youtube',
    description: `**Clint:**
Claudio Sanchez's gentle, tender acoustic plea. Sincere acoustic lullaby of devotion and peaceful slumber.

**Maica:**
Very soft and gentle, murag lullaby sa gabii. So peaceful paminawon before matulog. 🌙🤍`,
  },
];
