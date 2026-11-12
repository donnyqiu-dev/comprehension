/* Level 6 readings modelled on UK Year 6 (KS2) targeted comprehension books:
   an intro box, a ~400-word text, a glossary, a warm up question, mixed question kinds worth
   8 marks in total, and a "Now Try This" reflection. All texts are original. */
window.App = window.App || {};

App.LEVELS[6] = { name: 'Level 6 · Year 6 (UK)', grade: '≈ standar Year 6 Inggris (KS2)' };

App.READINGS.push(
  {
    id: 'y6-lantern',
    title: 'The Lantern of Pulau Awan',
    level: 6, ks2: true,
    genre: 'Fantasy', topic: 'Story',
    emoji: '🏮',
    intro: 'This is an extract from an original fantasy story. Laila lives with her grandmother on Pulau Awan, one of many islands that float high above the sea. Every night, her family lights a great lantern to guide the sky-boats home.',
    source: 'An original story written for ReadQuest.',
    text: [
      'The storm arrived the way storms always arrived on Pulau Awan: suddenly, and without any manners. One moment the sky was a calm sheet of blue silk; the next, it was a bruise of purple and grey, and the wind was rattling our shutters like an impatient visitor.',
      '"The lantern, Laila!" Nenek called from the kitchen. "Before the clouds swallow it!"',
      'I groaned, but I grabbed my oilskin coat anyway. Looking after the lantern was the most important job on our island, and the most exhausting. Every evening I had to climb the ninety-nine steps of the tower, polish the thick glass until my arms ached, and feed the flame with starlight oil, one careful drop at a time. If I spilled even a little, Nenek would know. Nenek always knew.',
      'Our family had kept the lantern burning for six generations. My great-great-grandfather had carved his initials into the bottom step, and every keeper since had added theirs underneath. There was an empty space at the end of the row. I tried not to look at it too often.',
      'Outside, the rain stung my face like a swarm of tiny bees. I climbed reluctantly, gripping the cold rail, while below me the whole island rocked gently on its anchor-roots, like a ship that had forgotten it was meant to be on the water. When I finally reached the top, my heart dropped. The flame had shrunk to a nervous blue flicker.',
      'Somewhere out in the darkness, a sky-boat was trying to find its way home. Without the lantern, it would never see the island. I uncorked the oil, held my breath and tipped in one drop, then another. The flame shivered, stretched, and roared back to life, throwing golden light across the clouds.',
      'I was halfway down the steps, soaked and proud, when I heard it: three slow knocks on the door at the foot of the tower. Nobody ever visited Pulau Awan in the rainy season. Nobody.'
    ],
    glossary: [
      { w: 'Nenek', def: 'grandmother (Indonesian)' },
      { w: 'oilskin', def: 'a waterproof coat' },
      { w: 'anchor-roots', def: 'giant roots that hold a floating island in place' },
      { w: 'sky-boat', def: 'a flying boat that travels between the islands' }
    ],
    vocab: [
      { w: 'shutters', forms: ['shutters'], pos: 'noun', def: 'wooden covers on the outside of a window', id: 'daun jendela', ex: 'We closed the shutters before the storm.' },
      { w: 'exhausting', forms: ['exhausting'], pos: 'adjective', def: 'making you very tired', id: 'sangat melelahkan', ex: 'Carrying the boxes upstairs was exhausting.' },
      { w: 'generations', forms: ['generations'], pos: 'noun', def: 'all the people in a family born at about the same time; grandparents, parents and children are three generations', id: 'generasi, keturunan', ex: 'The house has belonged to our family for four generations.' },
      { w: 'initials', forms: ['initials'], pos: 'noun', def: 'the first letters of a person\'s names', id: 'inisial', ex: 'He wrote his initials, A.R., on the book.' },
      { w: 'reluctantly', forms: ['reluctantly'], pos: 'adverb', def: 'without really wanting to', id: 'dengan enggan', ex: 'She reluctantly turned off the TV.' },
      { w: 'flicker', forms: ['flicker'], pos: 'noun', def: 'a small light that keeps shaking and nearly going out', id: 'kerlip, nyala kecil', ex: 'We saw the flicker of a candle in the window.' }
    ],
    questions: [
      { warm: true, type: 'genre', marks: 1, q: 'Read the introduction. Which detail shows that this is a fantasy story?', choices: ['Laila lives with her grandmother', 'The islands float high above the sea', 'It is the rainy season', 'Her family lights a lantern'], a: 1, why: 'Islands cannot really float in the sky, so this detail tells us the story is a fantasy.' },
      { kind: 'open', type: 'language', marks: 2, min: 12, q: 'Read paragraph 3. How does the author show that looking after the lantern is tiring? Give two examples.', sample: 'E.g. Laila has to climb ninety-nine steps every evening and polish the glass "until my arms ached". She also has to feed the flame "one careful drop at a time", which takes a long time and needs great care.' },
      { kind: 'copy', type: 'language', marks: 1, para: [5, 5], q: 'Find and copy one simile from paragraph 5.', accept: ['like a swarm of tiny bees', 'like a ship that had forgotten it was meant to be on the water'], why: 'A simile compares two things using "like" or "as". Paragraph 5 has two similes.' },
      { type: 'vocab', marks: 1, q: '"I climbed reluctantly" (paragraph 5). What does "reluctantly" mean?', choices: ['quickly and happily', 'without really wanting to', 'very carefully', 'in the dark'], a: 1, why: 'Laila groaned before she went, so she climbed without really wanting to.' },
      { kind: 'open', type: 'infer', marks: 1, min: 8, q: 'Has Laila\'s family looked after the lantern for a long time? How can you tell?', sample: 'E.g. Yes. The family has kept the lantern burning for six generations, and every keeper has carved their initials on the bottom step.' },
      { type: 'language', marks: 1, q: '"the sky was … a bruise of purple and grey" (paragraph 1). This is an example of:', choices: ['a simile', 'a metaphor', 'onomatopoeia', 'alliteration'], a: 1, why: 'It says the sky WAS a bruise (without "like" or "as"), so it is a metaphor.' },
      { kind: 'open', type: 'structure', marks: 1, min: 8, q: 'Why do you think the author ends the extract with the three knocks on the door?', sample: 'E.g. To create suspense. Nobody ever visits in the rainy season, so the reader wants to keep reading to find out who is knocking.' }
    ],
    speak: 'The flame shivered, stretched, and roared back to life.',
    write: { prompt: 'Now Try This: Would you like to be the keeper of the lantern? Explain your answer.', minWords: 30, hint: 'Give at least one reason from the text, for example the steps or the storms.' }
  },
  {
    id: 'y6-stammer',
    title: 'Words That Got Stuck',
    level: 6, ks2: true,
    genre: 'Memoir', topic: 'Life',
    emoji: '🎤',
    intro: 'This is an original piece of memoir-style writing. The writer, now grown up, remembers what it was like to have a stammer: a condition that makes some sounds "stick" or repeat when a person speaks.',
    source: 'An original memoir-style text written for ReadQuest.',
    text: [
      'When I was eleven, words were like stubborn cats. Some came when I called them; others sat on the doorstep of my mouth and refused to come in, no matter how sweetly I asked. The worst were the ones that started with "b" and "p". My own name, Bima, was a door that often stayed locked.',
      'At school, I had a hundred clever tricks. If a word got stuck, I swapped it for another one. "Big" became "large"; "please" became "could you". I always sat near the back, hoping Bu Ratna would forget I existed. I knew all the answers, but I kept them hidden in my pocket like sweets I was not allowed to eat.',
      'Then, one Monday in March, Bu Ratna announced the speech competition. Every student in Year 6 would speak for two minutes about a person they admired. My stomach turned into a washing machine. Two whole minutes. Hundreds of words, all waiting to ambush me.',
      'That evening I told my grandfather I was ill. He looked at me over his glasses for a long time, the kind of look that reads you like a newspaper. Then he put down his tea. "When I was your age," he said slowly, "I was afraid of the river. So every day I put one foot in. Just one. By the end of the year, I could swim across."',
      'So I practised, one foot at a time. I spoke to the mirror, then to my little sister, then to our chickens, who were an excellent audience because they never laughed. Some days the words flowed; some days they crashed and tumbled like plates falling from a shelf. I kept going anyway.',
      'On the day of the competition, I chose to talk about my grandfather. I got stuck on the very first word. The silence in the hall felt as heavy as a wet blanket. But I breathed, the way I had practised, and tried again. "B-B-Bima," I said. "My name is Bima, and I want to tell you about the bravest person I know."',
      'I did not win a prize. But when I walked back to my seat, my legs were shaking and my face was burning, and I was smiling so widely that it hurt.'
    ],
    glossary: [
      { w: 'stammer', def: 'a condition that makes it hard to say some words smoothly' },
      { w: 'Bu', def: 'short for "Ibu"; used to speak to a female teacher' },
      { w: 'ambush', def: 'to attack suddenly from a hiding place' }
    ],
    vocab: [
      { w: 'stubborn', forms: ['stubborn'], pos: 'adjective', def: 'not willing to change or do what others want', id: 'keras kepala', ex: 'The stubborn goat would not move.' },
      { w: 'swapped', forms: ['swapped', 'swap'], pos: 'verb', def: 'changed one thing for another', id: 'menukar', ex: 'I swapped my apple for her banana.' },
      { w: 'admired', forms: ['admired', 'admire'], pos: 'verb', def: 'respected someone and thought they were very good', id: 'mengagumi', ex: 'She admired her brave aunt.' },
      { w: 'ambush', forms: ['ambush'], pos: 'verb', def: 'to attack suddenly from a hiding place', id: 'menyergap', ex: 'The cat waited to ambush the mouse.' },
      { w: 'practised', forms: ['practised', 'practise'], pos: 'verb', def: 'did something again and again to get better at it', id: 'berlatih', ex: 'He practised the piano every day.' },
      { w: 'audience', forms: ['audience'], pos: 'noun', def: 'the people who watch or listen to a show or speech', id: 'penonton, hadirin', ex: 'The audience clapped loudly.' }
    ],
    questions: [
      { warm: true, type: 'detail', marks: 1, q: 'Read the introduction. What did the writer find difficult when he was eleven?', choices: ['Swimming across a river', 'Saying some words smoothly', 'Remembering the answers', 'Making friends'], a: 1, why: 'The introduction explains that a stammer makes some sounds stick or repeat when a person speaks.' },
      { kind: 'open', type: 'detail', marks: 2, min: 12, q: 'Describe two "clever tricks" that Bima used at school (paragraph 2).', sample: 'E.g. When a word got stuck, he swapped it for another word, such as "large" instead of "big". He also sat near the back so that the teacher would not ask him to speak.' },
      { kind: 'copy', type: 'language', marks: 1, para: [3, 3], q: 'Find and copy a phrase from paragraph 3 which shows that Bima felt very nervous.', accept: ['my stomach turned into a washing machine', 'turned into a washing machine'], why: 'The metaphor shows that his stomach was churning with nerves.' },
      { type: 'language', marks: 1, q: '"words were like stubborn cats" (paragraph 1). This is an example of:', choices: ['a metaphor', 'a simile', 'onomatopoeia', 'a question'], a: 1, why: 'It compares words to cats using "like", so it is a simile.' },
      { type: 'vocab', marks: 1, q: '"Hundreds of words, all waiting to ambush me" (paragraph 3). What does "ambush" mean here?', choices: ['to help someone', 'to attack suddenly from a hiding place', 'to make someone laugh', 'to arrive late'], a: 1, why: 'Bima imagines the words hiding and then attacking him while he speaks.' },
      { kind: 'open', type: 'infer', marks: 1, min: 8, q: 'What do you think Grandfather\'s story about the river teaches Bima?', sample: 'E.g. That he can beat his fear a little at a time, if he practises every day.' },
      { kind: 'open', type: 'infer', marks: 1, min: 8, q: 'Bima did not win a prize. Why was he still smiling at the end?', sample: 'E.g. Because he was proud. He faced his fear and gave the speech, even though he got stuck at the beginning.' }
    ],
    speak: 'My name is Bima, and I want to tell you about the bravest person I know.',
    write: { prompt: 'Now Try This: Think of something you were once afraid of. How did you (or how could you) face it "one foot at a time"?', minWords: 30, hint: 'Try using "practised" and "admired".' }
  },
  {
    id: 'y6-rain',
    title: 'Rain on a Tin Roof',
    level: 6, ks2: true, poem: true,
    genre: 'Poetry', topic: 'Nature',
    emoji: '🌧️',
    intro: 'This is an original free-verse poem. Free verse does not have to rhyme or follow a regular rhythm. The poet describes a heavy rainstorm heard from inside a house with a tin roof.',
    source: 'An original poem written for ReadQuest.',
    text: [
      'It starts with one.\nA single tap,\nlike a finger on a window\nasking, Are you home?',
      'Then two, then ten,\nthen a hundred thousand fingers\ndrumming, drumming, drumming\nuntil the whole roof\nis a marching band\nthat forgot to stop.',
      'Plink. Plonk. Patter.\nThe gutters gargle and gulp.\nThe mango tree bows its head\nand lets the water run\ndown the back of its neck.',
      'Inside, Mother lights the lamp.\nMy little brother counts the thunder,\none, two, three, BOOM,\nand hides his laugh\nbehind a cushion.',
      'I lie on the cool floor\nand listen.\nThe rain is telling a story\nit has told a million times before,\nand I still want to hear\nhow it ends.'
    ],
    glossary: [
      { w: 'gutters', def: 'channels along the edge of a roof that carry rainwater away' },
      { w: 'gargle', def: 'to make a bubbling sound with water in your throat' }
    ],
    vocab: [
      { w: 'single', forms: ['single'], pos: 'adjective', def: 'only one', id: 'tunggal, satu', ex: 'There was a single cloud in the sky.' },
      { w: 'drumming', forms: ['drumming'], pos: 'verb', def: 'making a repeated beating sound', id: 'menabuh, mengetuk-ngetuk', ex: 'The rain was drumming on the car.' },
      { w: 'gutters', forms: ['gutters'], pos: 'noun', def: 'channels along a roof that carry rainwater away', id: 'talang air', ex: 'Leaves blocked the gutters.' },
      { w: 'gargle', forms: ['gargle'], pos: 'verb', def: 'to make a bubbling sound with water', id: 'berkumur, menggelegak', ex: 'Gargle with salt water.' },
      { w: 'cushion', forms: ['cushion'], pos: 'noun', def: 'a soft pillow for a chair or sofa', id: 'bantal kursi', ex: 'She sat on a red cushion.' }
    ],
    questions: [
      { warm: true, type: 'genre', marks: 1, q: 'Read the introduction. Free verse is poetry that…', choices: ['always rhymes', 'does not need to rhyme or have a regular rhythm', 'is always funny', 'has exactly five lines'], a: 1, why: 'The introduction says free verse does not have to rhyme or follow a regular rhythm.' },
      { kind: 'copy', type: 'language', marks: 1, para: [3, 3], q: 'Find and copy one example of onomatopoeia from stanza 3.', accept: ['plink', 'plonk', 'patter', 'gargle', 'gulp'], why: 'Onomatopoeia is a word that sounds like the noise it describes, such as "plink" or "gulp".' },
      { kind: 'open', type: 'language', marks: 2, min: 12, q: 'Why do you think the poet repeats the word "drumming" in stanza 2?', sample: 'E.g. To copy the sound of the rain hitting the roof again and again. It also shows that the rain is getting heavier and does not stop.' },
      { type: 'language', marks: 1, q: '"The mango tree bows its head" (stanza 3) is an example of:', choices: ['personification', 'a simile', 'alliteration', 'rhyme'], a: 0, why: 'The tree is described as if it were a person bowing its head, so it is personification.' },
      { kind: 'open', type: 'infer', marks: 1, min: 8, q: 'How does the little brother feel about the thunder? How can you tell?', sample: 'E.g. He is excited, not scared. He counts the thunder like a game and hides his laugh behind a cushion.' },
      { type: 'structure', marks: 1, q: 'Why is "BOOM" written in capital letters?', choices: ['Because it is a name', 'To show the thunder is very loud', 'Because it starts a new line', 'To show it is a question'], a: 1, why: 'Capital letters make the word stand out, so we read it loudly, like thunder.' },
      { kind: 'open', type: 'infer', marks: 1, min: 10, q: 'What do you think the poet means by "The rain is telling a story / it has told a million times before" (stanza 5)?', sample: 'E.g. Rain has fallen in the same way for a very long time, but the poet still enjoys listening to it, like a favourite story.' }
    ],
    speak: 'The rain is telling a story it has told a million times before.',
    write: { prompt: 'Now Try This: Do you like rainy days? Describe rain where you live in 3–4 sentences. Use at least one sound word.', minWords: 30, hint: 'Sound words: patter, splash, drip, rumble, gurgle…' }
  },
  {
    id: 'y6-rafflesia',
    title: 'The Giant Flower That Smells Terrible',
    level: 6, ks2: true,
    genre: 'Feature article', topic: 'Science',
    emoji: '🌺',
    heading: 'Meet the Rafflesia: Enormous, Rare and Very Smelly',
    intro: 'This is an original feature article written for young readers. It describes Rafflesia arnoldii, a remarkable flower that grows in the rainforests of Sumatra and Borneo.',
    source: 'An original article written for ReadQuest.',
    text: [
      'Imagine walking through a steamy rainforest in Sumatra when suddenly you notice a terrible smell, like a dustbin that has been left in the sun for a week. Follow your nose, and you might discover one of the most extraordinary plants on Earth: Rafflesia arnoldii, the largest single flower in the world.',
      'A fully opened Rafflesia can measure about one metre across and weigh around 11 kilograms. Its five thick, leathery petals are reddish-brown and covered in pale spots, which makes it look rather like a giant pizza sitting on the forest floor.',
      'Surprisingly, this gigantic flower has no leaves, no stem and no roots of its own. It is a parasite: it lives inside a jungle vine and takes all the water and food it needs from its host. For most of its life, it is completely invisible. Then, one day, a small bud pushes out through the vine\'s bark. The bud swells slowly for many months, until it looks like a dark red cabbage, before it finally opens.',
      'Why does it smell so awful? The answer is clever. The rotting-meat smell attracts flies, which crawl inside looking for food. As they move from flower to flower, they carry pollen with them, which helps new seeds to form.',
      'Seeing a Rafflesia in bloom is a matter of luck. Each flower lasts only about a week before it turns black and collapses. Some visitors travel for days to reach a flower, only to arrive a little too late.',
      'Sadly, Rafflesia is in danger. Because it depends on its host vine, it can only survive where the rainforest is left undisturbed. When forests are cleared for farms and roads, the flowers disappear too. In Indonesia, Rafflesia arnoldii has been named one of the country\'s national flowers, and many people are working hard to protect the places where it grows. It may smell terrible, but the world would be a poorer place without it.'
    ],
    glossary: [
      { w: 'parasite', def: 'a living thing that lives on or in another one and takes its food' },
      { w: 'host', def: 'the plant or animal that a parasite lives on' },
      { w: 'pollen', def: 'a fine powder that flowers need to make seeds' },
      { w: 'undisturbed', def: 'left alone, not changed or damaged' }
    ],
    vocab: [
      { w: 'extraordinary', forms: ['extraordinary'], pos: 'adjective', def: 'very unusual and surprising', id: 'luar biasa', ex: 'It was an extraordinary sight.' },
      { w: 'leathery', forms: ['leathery'], pos: 'adjective', def: 'thick and tough, like leather', id: 'seperti kulit, alot', ex: 'The plant has leathery leaves.' },
      { w: 'parasite', forms: ['parasite'], pos: 'noun', def: 'a living thing that takes its food from another living thing', id: 'parasit', ex: 'A tick is a parasite.' },
      { w: 'host', forms: ['host'], pos: 'noun', def: 'the plant or animal that a parasite lives on', id: 'inang', ex: 'The vine is the host of the flower.' },
      { w: 'collapses', forms: ['collapses', 'collapse'], pos: 'verb', def: 'falls down suddenly because it is weak', id: 'roboh, layu', ex: 'The tent collapses in the wind.' },
      { w: 'undisturbed', forms: ['undisturbed'], pos: 'adjective', def: 'left alone, not changed or damaged', id: 'tidak terganggu', ex: 'The bird nested in an undisturbed corner.' }
    ],
    questions: [
      { warm: true, type: 'detail', marks: 1, q: 'Read the introduction. Where does Rafflesia arnoldii grow?', choices: ['In deserts in Australia', 'In the rainforests of Sumatra and Borneo', 'On mountains in Java', 'In gardens all over the world'], a: 1, why: 'The introduction says it grows in the rainforests of Sumatra and Borneo.' },
      { kind: 'copy', type: 'language', marks: 1, para: [1, 1], q: 'Find and copy a phrase from paragraph 1 that helps the reader imagine the smell.', accept: ['like a dustbin that has been left in the sun for a week'], why: 'The simile compares the smell to rubbish left in the hot sun.' },
      { kind: 'open', type: 'detail', marks: 2, min: 12, q: 'Give two ways in which Rafflesia is different from most other plants (paragraph 3).', sample: 'E.g. It has no leaves, stem or roots of its own. It is a parasite that takes its food and water from a vine. It is invisible for most of its life.' },
      { kind: 'factop', type: 'fact', marks: 2, q: 'Decide whether each statement is a fact or an opinion.', items: [
        { s: 'Rafflesia arnoldii is the largest single flower in the world.', fact: true },
        { s: 'The world would be a poorer place without Rafflesia.', fact: false },
        { s: 'Each flower lasts only about a week.', fact: true }
      ], why: 'A fact can be checked and proved (size, how long it lasts). "The world would be a poorer place" is what the writer thinks, so it is an opinion.' },
      { kind: 'open', type: 'cause', marks: 1, min: 8, q: 'Why is the terrible smell useful to the Rafflesia?', sample: 'E.g. It attracts flies, which carry pollen from flower to flower so that new seeds can form.' },
      { kind: 'open', type: 'purpose', marks: 1, min: 8, q: 'Why do you think the author compares the flower to "a giant pizza" and "a dark red cabbage"?', sample: 'E.g. To help readers picture something they have never seen, by comparing it to everyday things they already know.' }
    ],
    speak: 'It may smell terrible, but the world would be a poorer place without it.',
    write: { prompt: 'Now Try This: Did this article make you want to see a Rafflesia in real life? Explain why or why not.', minWords: 30, hint: 'Use at least one fact from the article in your answer.' }
  },
  {
    id: 'y6-diary1945',
    title: 'Sri\'s Diary: 17 August 1945',
    level: 6, ks2: true,
    genre: 'Diary', topic: 'History',
    emoji: '🇮🇩',
    intro: 'This is an imagined diary entry, based on real events. On Friday 17 August 1945, Sukarno and Mohammad Hatta proclaimed Indonesia\'s independence in Jakarta. The writer imagines how a 12-year-old girl might have recorded that day.',
    heading: 'Friday, 17 August 1945',
    source: 'An imagined diary written for ReadQuest. The characters are fictional; the event is real.',
    text: [
      'Dear Diary,\nI am writing this by the light of our oil lamp, and my hand is still trembling. Today something happened that I think people will remember for a hundred years.',
      'It began like any other day in Ramadan. Mother woke us before dawn for sahur, and afterwards I tried to go back to sleep, but Kak Hasan was already pulling on his shirt. He said he had to go to Pegangsaan Timur and that it was "very important", but he would not tell me why. His eyes were shining the way they do before a football match.',
      'He came home before noon, out of breath and grinning. "It\'s done," he said. "Bung Karno has read the proclamation. We are free." Father stood up so fast that his chair fell over. Mother pressed her hand against her mouth. For a moment nobody said anything at all, and I could hear the clock on the wall, ticking as if nothing had changed.',
      'Kak Hasan told us everything, again and again, until we could almost see it: the small crowd in front of the house, the few short sentences that Bung Karno read from a sheet of paper, the red and white flag climbing slowly up a bamboo pole while everyone sang Indonesia Raya. He said some of the men were crying and pretending they were not.',
      'Father warned us to be careful. Japanese soldiers are still in the city, and nobody knows what they will do. He says the news will be hard to share, because the Japanese still control the newspapers and the radio. So it is travelling from mouth to mouth, from kampung to kampung, like a fire jumping from roof to roof.',
      'I asked Father what "merdeka" will mean for me. He thought for a long time and then said, "It means that one day, you will decide." I am not sure I understand yet. But I have decided one thing already: I will keep this page safe forever.'
    ],
    glossary: [
      { w: 'sahur', def: 'a meal eaten before dawn during Ramadan' },
      { w: 'Kak', def: 'a word for an older brother or sister' },
      { w: 'Bung Karno', def: 'a friendly name people used for Sukarno' },
      { w: 'proclamation', def: 'an official public announcement' },
      { w: 'merdeka', def: 'free; independent' }
    ],
    vocab: [
      { w: 'trembling', forms: ['trembling', 'tremble'], pos: 'verb', def: 'shaking a little, because of fear, cold or excitement', id: 'gemetar', ex: 'His voice was trembling.' },
      { w: 'grinning', forms: ['grinning', 'grin'], pos: 'verb', def: 'smiling widely', id: 'menyeringai, tersenyum lebar', ex: 'She came in grinning.' },
      { w: 'proclamation', forms: ['proclamation'], pos: 'noun', def: 'an official public announcement', id: 'proklamasi', ex: 'The king made a proclamation.' },
      { w: 'pretending', forms: ['pretending', 'pretend'], pos: 'verb', def: 'acting as if something is true when it is not', id: 'berpura-pura', ex: 'He was pretending to be asleep.' },
      { w: 'warned', forms: ['warned', 'warn'], pos: 'verb', def: 'told someone about a possible danger', id: 'memperingatkan', ex: 'Mum warned us about the hot pan.' }
    ],
    questions: [
      { warm: true, kind: 'open', type: 'genre', marks: 1, min: 4, q: 'Write down one feature of the text which shows that it is a diary entry.', sample: 'E.g. It begins with the date and "Dear Diary". OR It is written in the first person ("I"), about the writer\'s own day.' },
      { type: 'vocab', marks: 1, q: '"my hand is still trembling" (paragraph 1). Which word means the same as "trembling"?', choices: ['shaking', 'writing', 'sleeping', 'hurting'], a: 0, why: 'Trembling means shaking a little, here because Sri is so excited.' },
      { kind: 'open', type: 'infer', marks: 1, min: 8, q: 'Why do you think Kak Hasan would not tell Sri where he was going (paragraph 2)?', sample: 'E.g. Because it was secret and could be dangerous, and he did not want her to worry or to tell other people.' },
      { kind: 'open', type: 'language', marks: 2, min: 12, q: 'How does the writer show the family\'s reaction to the news in paragraph 3? Give two examples.', sample: 'E.g. Father stood up so fast that his chair fell over, which shows shock and excitement. Mother pressed her hand against her mouth, which shows she was amazed.' },
      { kind: 'copy', type: 'language', marks: 1, para: [5, 5], q: 'Find and copy a simile from paragraph 5.', accept: ['like a fire jumping from roof to roof'], why: 'The news spreads quickly from place to place, the way a fire jumps between roofs.' },
      { type: 'language', marks: 1, q: '"ticking as if nothing had changed" (paragraph 3) suggests that…', choices: ['the clock was broken', 'ordinary life seemed to carry on, even though something huge had happened', 'the family was late for school', 'Sri did not care about the news'], a: 1, why: 'The clock keeps ticking normally, which contrasts with the enormous news the family has just heard.' },
      { kind: 'open', type: 'infer', marks: 1, min: 8, q: 'What do you think Father means when he says, "It means that one day, you will decide"?', sample: 'E.g. That in a free, independent country, the people (including Sri) will be able to choose their own leaders and their own future.' }
    ],
    speak: 'It means that one day, you will decide.',
    write: { prompt: 'Now Try This: How do you think Sri felt when she heard the news? Explain your answer using evidence from the text.', minWords: 30, hint: 'Look at paragraph 1 and paragraph 6.' }
  },
  {
    id: 'y6-play',
    title: 'The Case of the Vanishing Kue',
    level: 6, ks2: true,
    genre: 'Playscript', topic: 'Culture',
    emoji: '🎭',
    intro: 'This is an original playscript. A playscript is written to be performed by actors. It shows what each character says, and it uses stage directions (in brackets) to tell the actors what to do. This scene takes place on the morning of Eid al-Fitr.',
    source: 'An original playscript written for ReadQuest.',
    text: [
      '(A kitchen in Nenek\'s house on the morning of Eid. A plate stands on the table, covered with a cloth. NENEK is humming as she stirs a pot. ADI and PUTRI rush in.)',
      'ADI: Nenek! We\'re starving! Is the kue lapis ready?',
      'NENEK: (without turning round) Ready, cooled and waiting under that cloth. Forty pieces, one for every guest. Not one for hungry grandchildren. Not yet.',
      'PUTRI: (lifting the corner of the cloth, then freezing) Um… Nenek? How many did you say?',
      'NENEK: Forty. I counted them twice.',
      'PUTRI: (in a very small voice) There are… thirty-one.',
      '(NENEK stops stirring. Slowly, she puts down her spoon and turns to face the children. The kitchen is so quiet that they can hear the clock.)',
      'NENEK: Thirty-one.',
      'ADI: (holding up both hands) It wasn\'t me! I\'ve been outside all morning, helping Pak Udin with the lamps. Ask him!',
      'PUTRI: And I was sweeping the front room. You can see the broom! (She points dramatically at the door.)',
      'NENEK: (narrowing her eyes) Then we have a mystery. A thief with a sweet tooth. (She bends down and peers at the floor.) Aha. Crumbs. And… what is this?',
      '(She picks up something small and orange from under the table and holds it up to the light. It is a tuft of fur.)',
      'ADI and PUTRI: (together) OYEN!',
      '(At that exact moment, a fat orange cat strolls into the kitchen, licks its lips and sits down in a patch of sunlight. Nobody speaks.)',
      'NENEK: (sighing, then smiling) Well. I suppose that makes thirty-one guests and one very satisfied cat.'
    ],
    glossary: [
      { w: 'kue lapis', def: 'a colourful Indonesian cake made in thin layers' },
      { w: 'Eid al-Fitr', def: 'the celebration at the end of Ramadan' },
      { w: 'Pak', def: 'a polite word used before a man\'s name' },
      { w: 'tuft', def: 'a small bunch of hair, fur or grass' }
    ],
    vocab: [
      { w: 'humming', forms: ['humming', 'hum'], pos: 'verb', def: 'singing with your lips closed', id: 'bersenandung', ex: 'She was humming a happy song.' },
      { w: 'starving', forms: ['starving'], pos: 'adjective', def: 'very hungry', id: 'kelaparan sekali', ex: 'After football I was starving.' },
      { w: 'dramatically', forms: ['dramatically'], pos: 'adverb', def: 'in a very noticeable, theatrical way', id: 'secara dramatis', ex: 'He fell dramatically onto the sofa.' },
      { w: 'peers', forms: ['peers', 'peer'], pos: 'verb', def: 'looks very carefully, because something is hard to see', id: 'mengintip, mengamati', ex: 'She peers into the dark box.' },
      { w: 'strolls', forms: ['strolls', 'stroll'], pos: 'verb', def: 'walks slowly and calmly', id: 'berjalan santai', ex: 'Grandpa strolls in the park.' },
      { w: 'satisfied', forms: ['satisfied'], pos: 'adjective', def: 'pleased because you have what you wanted', id: 'puas', ex: 'After lunch I felt satisfied.' }
    ],
    questions: [
      { warm: true, type: 'genre', marks: 1, q: 'In this playscript, what are the words in brackets called?', choices: ['speech marks', 'stage directions', 'a glossary', 'a chorus'], a: 1, why: 'Stage directions tell the actors what to do and how to speak.' },
      { kind: 'open', type: 'structure', marks: 1, min: 8, q: 'Give one way in which the layout of a playscript is different from a story.', sample: 'E.g. The name of each character is written before the words they say, and there are no speech marks. OR It uses stage directions in brackets.' },
      { kind: 'open', type: 'language', marks: 2, min: 12, q: 'Read paragraph 7. How does the playwright build tension at this moment?', sample: 'E.g. Nenek stops stirring and turns round "slowly", and the kitchen is so quiet that they can hear the clock. The audience waits to see how she will react to the missing cakes.' },
      { type: 'infer', marks: 1, q: 'Why do Adi and Putri explain where they have been (paragraphs 9–10)?', choices: ['To show Nenek that they could not have taken the cakes', 'Because they are bored', 'Because they want more jobs to do', 'To tell Nenek about the guests'], a: 0, why: 'They are worried Nenek thinks they ate the cakes, so they explain that they were busy somewhere else.' },
      { kind: 'copy', type: 'language', marks: 1, para: [11, 11], q: 'Find and copy the phrase from paragraph 11 that Nenek uses to describe the thief.', accept: ['a thief with a sweet tooth'], why: 'Someone with a "sweet tooth" loves eating sweet things.' },
      { kind: 'open', type: 'infer', marks: 1, min: 8, q: 'How should the actor playing Putri say the line in paragraph 6? Why?', sample: 'E.g. Quietly and nervously, because the stage direction says "in a very small voice" and she is worried about telling Nenek that cakes are missing.' },
      { type: 'vocab', marks: 1, q: '"one very satisfied cat" (paragraph 15). "Satisfied" means…', choices: ['hungry', 'pleased and full', 'frightened', 'sleepy'], a: 1, why: 'The cat has eaten nine cakes and licks its lips, so it is pleased and full.' }
    ],
    speak: 'Then we have a mystery. A thief with a sweet tooth.',
    write: { prompt: 'Now Try This: Write the next two lines of the play. What does Adi or Putri say next? Include at least one stage direction in brackets.', minWords: 20, hint: 'Example layout: ADI: (laughing) …' }
  }
);
