/* Video lessons (Edpuzzle style): the video pauses at `t` seconds and asks a question.
   t: -1 means "ask after the video ends".
   Timestamps are placed conservatively (a little after the topic is covered).
   A parent/teacher can adjust them or add new lessons in the Parent area. */
window.App = window.App || {};
App.VIDEOS = [
  {
    id: 'v-oceans',
    title: 'Oceans 101',
    channel: 'National Geographic',
    source: 'youtube',
    youtubeId: 'MfWyzrkFkg8',
    level: 3,
    emoji: '🌊',
    topic: 'Science',
    intro: 'Learn why the ocean is so important for our planet. Listen for numbers and big ideas!',
    vocab: [
      { t: 20, w: 'habitat', def: 'the natural home of an animal or plant', id: 'habitat, tempat hidup' },
      { t: 45, w: 'regulate', def: 'to control something so it stays steady', id: 'mengatur' },
      { t: 90, w: 'species', def: 'a group of living things of the same kind', id: 'spesies' }
    ],
    questions: [
      { t: 50, type: 'mc', q: 'About how much of Earth\'s surface is covered by the ocean?', choices: ['About 10 percent', 'About 30 percent', 'About 70 percent', 'About 99 percent'], a: 2, why: 'The ocean covers roughly 70 percent (about 71%) of Earth\'s surface.' },
      { t: -1, type: 'mc', q: 'Besides being a home for living things, the ocean also helps to regulate Earth\'s…', choices: ['Climate', 'Internet', 'Mountains', 'Traffic'], a: 0, why: 'The ocean absorbs heat and moves it around the planet, which helps regulate the climate.' },
      { t: -1, type: 'open', q: 'Name ONE problem or threat to the ocean that you heard in the video. What could people do about it?', sample: 'Pollution like plastic is a threat. People can use less plastic and recycle.' }
    ]
  },
  {
    id: 'v-tornado',
    title: 'How do tornadoes form?',
    channel: 'TED-Ed · James Spann',
    source: 'youtube',
    youtubeId: 'lmWh9jV_1ac',
    level: 4,
    emoji: '🌪️',
    topic: 'Science',
    intro: 'A meteorologist explains how a thunderstorm can create a spinning tornado.',
    vocab: [
      { t: 30, w: 'supercell', def: 'a huge, powerful thunderstorm that spins', id: 'badai supersel' },
      { t: 60, w: 'vortex', def: 'a mass of air or water that spins around fast', id: 'pusaran' },
      { t: 90, w: 'updraft', def: 'a current of air that moves upward', id: 'arus udara naik' }
    ],
    questions: [
      { t: 75, type: 'mc', q: 'Tornadoes usually begin in huge thunderstorms called…', choices: ['Rainbows', 'Supercells', 'Tsunamis', 'Monsoons'], a: 1, why: 'Most strong tornadoes grow out of supercell thunderstorms, which can rise about 50,000 feet high.' },
      { t: -1, type: 'mc', q: 'What turns the horizontal tube of spinning air so that it points up and down?', choices: ['Rising air (an updraft)', 'Ocean waves', 'Earthquakes', 'Snow'], a: 0, why: 'The storm\'s strong updraft tilts the spinning tube of air upward.' },
      { t: -1, type: 'mc', q: 'Tornado winds can be faster than…', choices: ['20 miles per hour', '50 miles per hour', '200 miles per hour', '2,000 miles per hour'], a: 2, why: 'The strongest tornadoes have winds of more than 200 miles (320 km) per hour.' },
      { t: -1, type: 'open', q: 'If you heard a tornado warning, what should you do to stay safe?', sample: 'Go inside to the lowest floor, stay away from windows, and cover your head.' }
    ]
  },
  {
    id: 'v-sleep',
    title: 'What would happen if you didn\'t sleep?',
    channel: 'TED-Ed · Claudia Aguirre',
    source: 'youtube',
    youtubeId: 'dqONk48l5vY',
    level: 4,
    emoji: '😴',
    topic: 'Health',
    intro: 'Pair this with the reading "Why Your Brain Needs Sleep". Listen for what sleep does for your brain.',
    vocab: [
      { t: 25, w: 'deprived', def: 'not having enough of something you need', id: 'kekurangan' },
      { t: 90, w: 'memory', def: 'the ability of the brain to keep and remember information', id: 'daya ingat' },
      { t: 150, w: 'toxic', def: 'harmful; poisonous', id: 'beracun' }
    ],
    questions: [
      { t: 45, type: 'mc', q: 'According to the video, which group is MOST often sleep-deprived?', choices: ['Babies', 'Adolescents (teenagers)', 'Grandparents', 'Cats'], a: 1, why: 'The video says about 30% of adults and 66% of adolescents are regularly sleep-deprived.' },
      { t: -1, type: 'mc', q: 'Which of these does sleep help your brain do?', choices: ['Forget everything', 'Store memories and clean out waste', 'Grow new teeth', 'Stop breathing'], a: 1, why: 'During sleep the brain stores memories and flushes out waste products.' },
      { t: -1, type: 'open', q: 'Write two things that can happen to a person who does not get enough sleep.', sample: 'They can have trouble remembering things and feel grumpy or sick.' }
    ]
  },
  {
    id: 'v-cats',
    title: 'Why do cats act so weird?',
    channel: 'TED-Ed · Tony Buffington',
    source: 'youtube',
    youtubeId: 'sI8NsYIyQ2A',
    level: 3,
    emoji: '🐱',
    topic: 'Animals',
    intro: 'Cats do funny things! Find out how their wild instincts explain their behavior.',
    vocab: [
      { t: 25, w: 'predator', def: 'an animal that hunts other animals', id: 'pemangsa' },
      { t: 40, w: 'prey', def: 'an animal hunted by another animal', id: 'mangsa' },
      { t: 70, w: 'instinct', def: 'a natural way of acting that an animal is born with', id: 'naluri' }
    ],
    questions: [
      { t: 60, type: 'mc', q: 'In the wild, cats were…', choices: ['Only predators', 'Only prey', 'Both predators and prey', 'Neither predators nor prey'], a: 2, why: 'Cats hunted smaller animals, but bigger animals also hunted them, so they were both.' },
      { t: -1, type: 'mc', q: 'Why do cats still do many "weird" things today?', choices: ['They are bored', 'They still have instincts from their wild ancestors', 'People teach them tricks', 'They are sick'], a: 1, why: 'Their behavior comes from instincts that helped wild cats survive.' },
      { t: -1, type: 'open', q: 'Describe ONE weird cat behavior from the video and explain the reason for it.', sample: 'Cats like to hide in boxes because hiding makes them feel safe from bigger animals.' }
    ]
  },
  {
    id: 'v-bilingual',
    title: 'The benefits of a bilingual brain',
    channel: 'TED-Ed · Mia Nacamulli',
    source: 'youtube',
    youtubeId: 'MMmOLN5zBLY',
    level: 5,
    emoji: '🧠',
    topic: 'Language',
    intro: 'You are learning English, so you are becoming bilingual! Find out what that does for your brain.',
    vocab: [
      { t: 20, w: 'bilingual', def: 'able to speak two languages', id: 'dwibahasa' },
      { t: 60, w: 'passive', def: 'receiving rather than producing (like listening and reading)', id: 'pasif' },
      { t: 180, w: 'hemisphere', def: 'one half of the brain', id: 'belahan otak' }
    ],
    questions: [
      { t: 90, type: 'mc', q: 'Listening and reading are called ___ language skills.', choices: ['Active', 'Passive', 'Silent', 'Secret'], a: 1, why: 'Speaking and writing are active skills; listening and reading are passive skills.' },
      { t: -1, type: 'mc', q: 'A child who learns two languages at the same time from early childhood is called a ___ bilingual.', choices: ['Compound', 'Subordinate', 'Coordinate', 'Double'], a: 0, why: 'Compound bilinguals develop two languages simultaneously, with one set of concepts.' },
      { t: -1, type: 'mc', q: 'One benefit of being bilingual mentioned in the video is that it can…', choices: ['Make you taller', 'Delay the start of diseases like Alzheimer\'s', 'Help you see in the dark', 'Stop you from getting colds'], a: 1, why: 'Studies suggest bilingual brains can delay dementia and Alzheimer\'s by several years.' },
      { t: -1, type: 'open', q: 'Which languages do you speak? How do you think learning English helps your brain?', sample: 'I speak Indonesian, Javanese, and some English. It helps my brain switch tasks and remember more.' }
    ]
  },
  {
    id: 'v-bbc-sleep',
    title: 'Why you need a good night\'s sleep',
    channel: 'BBC Learning English · 6 Minute English',
    source: 'youtube',
    youtubeId: 'j2PdEQpu5js',
    level: 5,
    emoji: '🎙️',
    topic: 'Listening Challenge',
    intro: 'A real BBC conversation! It is fast, so you may pause and replay. Listen for the quiz question at the start and its answer at the end.',
    vocab: [],
    questions: [
      { t: -1, type: 'open', q: 'At the start, the presenters ask a quiz question. What was the question, and what was the answer at the end?', sample: 'The question was about …; the answer was …' },
      { t: -1, type: 'open', q: 'Write 3 new words or phrases you heard. What do you think they mean?', sample: '1) ... means ... 2) ... 3) ...', vocabLog: true },
      { t: -1, type: 'open', q: 'Write one piece of advice about sleep from the programme.', sample: 'We should go to bed at the same time every night.' }
    ]
  },
  {
    id: 'v-bbc-chocolate',
    title: 'Chocolate: Meet a real Willy Wonka',
    channel: 'BBC Learning English · 6 Minute English',
    source: 'youtube',
    youtubeId: 'MmODCOXX_2c',
    level: 5,
    emoji: '🍫',
    topic: 'Listening Challenge',
    intro: 'Listen to a BBC programme about chocolate. Pause as often as you need!',
    vocab: [],
    questions: [
      { t: -1, type: 'open', q: 'What was the quiz question at the beginning, and what was the answer?', sample: 'The question was …; the answer was …' },
      { t: -1, type: 'open', q: 'Write 3 new words or phrases you heard. What do you think they mean?', sample: '1) ... means ... 2) ... 3) ...', vocabLog: true },
      { t: -1, type: 'open', q: 'Write 2–3 sentences: what is the programme about?', sample: 'The programme is about a person who makes chocolate…' }
    ]
  }
];
