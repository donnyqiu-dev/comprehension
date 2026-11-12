/* Reward content: ranks, pet stages, shop items, badges, and daily quest templates. */
window.App = window.App || {};

App.RANKS = [
  { xp: 0, name: 'Word Sprout', icon: '🌱' },
  { xp: 150, name: 'Page Turner', icon: '📄' },
  { xp: 400, name: 'Story Seeker', icon: '🔎' },
  { xp: 800, name: 'Book Explorer', icon: '🧭' },
  { xp: 1400, name: 'Idea Hunter', icon: '🏹' },
  { xp: 2200, name: 'Word Wizard', icon: '🪄' },
  { xp: 3200, name: 'Reading Knight', icon: '🛡️' },
  { xp: 4500, name: 'Library Legend', icon: '🏛️' },
  { xp: 6000, name: 'Comprehension Master', icon: '👑' }
];

App.PET_STAGES = [
  { xp: 0, face: '🥚', name: 'Mystery Egg', say: 'Something is moving inside…' },
  { xp: 100, face: '🐣', name: 'Baby Lumo', say: 'Cheep! Read with me!' },
  { xp: 500, face: '🐥', name: 'Little Lumo', say: 'I love new words!' },
  { xp: 1500, face: '🦉', name: 'Wise Lumo', say: 'Hoo! Let\'s read something hard!' },
  { xp: 3500, face: '🦚', name: 'Royal Lumo', say: 'We are unstoppable readers!' }
];

App.SHOP = [
  { id: 'freeze', type: 'power', name: 'Streak Shield', icon: '🧊', price: 40, desc: 'Protects your streak if you miss one day. / Melindungi streak jika bolos 1 hari.' },
  { id: 'food-berry', type: 'food', name: 'Berry Snack', icon: '🫐', price: 5, desc: 'Lumo +15 happiness' },
  { id: 'food-cake', type: 'food', name: 'Honey Cake', icon: '🍰', price: 12, desc: 'Lumo +40 happiness' },
  { id: 'hat-cap', type: 'hat', name: 'Cool Cap', icon: '🧢', price: 30 },
  { id: 'hat-grad', type: 'hat', name: 'Graduation Hat', icon: '🎓', price: 60 },
  { id: 'hat-crown', type: 'hat', name: 'Golden Crown', icon: '👑', price: 150 },
  { id: 'hat-wizard', type: 'hat', name: 'Wizard Hat', icon: '🧙', price: 90 },
  { id: 'glasses-cool', type: 'glasses', name: 'Sunglasses', icon: '🕶️', price: 35 },
  { id: 'glasses-read', type: 'glasses', name: 'Reading Glasses', icon: '👓', price: 25 },
  { id: 'bg-space', type: 'bg', name: 'Space Room', icon: '🌌', price: 80, css: 'linear-gradient(135deg,#1e1b4b,#4c1d95)' },
  { id: 'bg-ocean', type: 'bg', name: 'Ocean Room', icon: '🐠', price: 60, css: 'linear-gradient(135deg,#0ea5e9,#14b8a6)' },
  { id: 'bg-jungle', type: 'bg', name: 'Jungle Room', icon: '🌴', price: 60, css: 'linear-gradient(135deg,#15803d,#84cc16)' },
  { id: 'bg-candy', type: 'bg', name: 'Candy Room', icon: '🍭', price: 70, css: 'linear-gradient(135deg,#f472b6,#fbbf24)' }
];

/* Badge checks receive the profile and return true when earned. */
App.BADGES = [
  { id: 'first-read', icon: '📘', name: 'First Page', desc: 'Finish your first reading', check: function (p) { return Object.keys(p.readings).length >= 1; } },
  { id: 'five-reads', icon: '📚', name: 'Bookworm', desc: 'Finish 5 different readings', check: function (p) { return Object.keys(p.readings).length >= 5; } },
  { id: 'all-reads', icon: '🏆', name: 'Library Hero', desc: 'Finish 12 different readings', check: function (p) { return Object.keys(p.readings).length >= 12; } },
  { id: 'first-video', icon: '🎬', name: 'Movie Detective', desc: 'Finish your first video lesson', check: function (p) { return Object.keys(p.videos).length >= 1; } },
  { id: 'five-videos', icon: '🍿', name: 'Super Viewer', desc: 'Finish 5 video lessons', check: function (p) { return Object.keys(p.videos).length >= 5; } },
  { id: 'perfect', icon: '💯', name: 'Perfect Score', desc: 'Get 100% on a quiz', check: function (p) { return p.stats.perfect >= 1; } },
  { id: 'perfect5', icon: '🌟', name: 'Sharp Mind', desc: 'Get 100% five times', check: function (p) { return p.stats.perfect >= 5; } },
  { id: 'streak3', icon: '🔥', name: 'On Fire', desc: '3-day streak', check: function (p) { return p.streak.best >= 3; } },
  { id: 'streak7', icon: '🚀', name: 'One Week Strong', desc: '7-day streak', check: function (p) { return p.streak.best >= 7; } },
  { id: 'streak30', icon: '🌋', name: 'Unstoppable', desc: '30-day streak', check: function (p) { return p.streak.best >= 30; } },
  { id: 'words25', icon: '🌼', name: 'Word Gardener', desc: 'Collect 25 words', check: function (p) { return Object.keys(p.words).length >= 25; } },
  { id: 'mastered10', icon: '🌳', name: 'Word Tree', desc: 'Master 10 words', check: function (p) { return App.srs.masteredCount(p) >= 10; } },
  { id: 'speaker', icon: '🎤', name: 'Brave Speaker', desc: 'Complete 5 speaking tasks', check: function (p) { return p.stats.speaking >= 5; } },
  { id: 'writer', icon: '✏️', name: 'Young Author', desc: 'Complete 5 writing tasks', check: function (p) { return p.stats.writing >= 5; } },
  { id: 'level-up', icon: '⬆️', name: 'Level Up!', desc: 'Move up a reading level', check: function (p) { return p.levelHistory.some(function (h) { return h.to > h.from; }); } },
  { id: 'chest5', icon: '🎁', name: 'Treasure Hunter', desc: 'Open 5 daily chests', check: function (p) { return p.stats.chests >= 5; } },
  { id: 'inference', icon: '🧠', name: 'Deep Thinker', desc: 'Answer 20 inference questions correctly', check: function (p) { return (p.skills.infer && p.skills.infer.c >= 20); } }
];

/* Daily quest templates. `event` is matched in App.rewards.track(). */
App.QUEST_POOL = [
  { id: 'read1', text: 'Finish 1 reading', textId: 'Selesaikan 1 bacaan', event: 'reading', target: 1, coins: 10 },
  { id: 'video1', text: 'Finish 1 video lesson', textId: 'Selesaikan 1 video', event: 'video', target: 1, coins: 10 },
  { id: 'review8', text: 'Review 8 words', textId: 'Ulangi 8 kata', event: 'review', target: 8, coins: 8 },
  { id: 'correct8', text: 'Answer 8 questions correctly', textId: 'Jawab benar 8 soal', event: 'correct', target: 8, coins: 10 },
  { id: 'speak1', text: 'Do 1 speaking task', textId: 'Latihan bicara 1 kali', event: 'speak', target: 1, coins: 8 },
  { id: 'write1', text: 'Do 1 writing task', textId: 'Latihan menulis 1 kali', event: 'write', target: 1, coins: 8 },
  { id: 'newword3', text: 'Save 3 new words', textId: 'Simpan 3 kata baru', event: 'newword', target: 3, coins: 6 },
  { id: 'game1', text: 'Play 1 word game', textId: 'Main 1 game kata', event: 'game', target: 1, coins: 8 },
  { id: 'xp60', text: 'Earn 60 XP today', textId: 'Kumpulkan 60 XP hari ini', event: 'xp', target: 60, coins: 10 }
];
