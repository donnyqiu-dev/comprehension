/* Reading passages (original texts written for this app).
   Levels: 1 = easy (grade 4) ... 3 = grade 6 ... 5 = challenge (grade 7-8).
   Question types: main, detail, vocab, infer, seq, purpose, cause */
window.App = window.App || {};
App.READINGS = [
  {
    id: 'r-kite',
    title: 'The Kite Festival',
    level: 1,
    genre: 'Story',
    topic: 'Culture',
    emoji: '🪁',
    text: [
      'Every August, the beach near Sari\'s village holds a kite festival. Families come early in the morning to find a good spot on the sand. The sky slowly fills with kites of every shape: fish, birds, dragons, and even a giant octopus.',
      'This year, Sari wanted to make her own kite. Her grandfather showed her how to tie thin bamboo sticks into a cross. Then they covered the frame with colorful paper and glued a long tail to the bottom. It took them three whole afternoons.',
      'On the day of the festival, the wind was weak. Sari ran along the beach again and again, but her kite kept falling into the sand. She felt her eyes get hot with tears. "Be patient," her grandfather said. "The wind always comes back."',
      'Around noon, a strong breeze blew in from the sea. Sari lifted her kite, let out the string, and watched it climb higher and higher. It danced above the waves next to the big octopus. Sari laughed. She was proud that her kite was flying, and even prouder that she had made it herself.'
    ],
    vocab: [
      { w: 'festival', forms: ['festival'], pos: 'noun', def: 'a special event when people celebrate something together', id: 'festival, perayaan', ex: 'Our school has a music festival every year.' },
      { w: 'frame', forms: ['frame'], pos: 'noun', def: 'the strong shape that holds something together', id: 'kerangka', ex: 'The frame of the tent is made of metal.' },
      { w: 'patient', forms: ['patient'], pos: 'adjective', def: 'able to wait calmly without getting angry or upset', id: 'sabar', ex: 'Be patient; the bus will come soon.' },
      { w: 'breeze', forms: ['breeze'], pos: 'noun', def: 'a light, gentle wind', id: 'angin sepoi-sepoi', ex: 'A cool breeze came through the window.' },
      { w: 'proud', forms: ['proud', 'prouder'], pos: 'adjective', def: 'feeling happy about something good you did', id: 'bangga', ex: 'I was proud of my good test score.' }
    ],
    questions: [
      { type: 'main', q: 'What is this story mostly about?', choices: ['A girl who learns to swim at the beach', 'A girl who makes a kite and flies it at a festival', 'A grandfather who sells kites', 'A giant octopus that lives in the sea'], a: 1, why: 'The whole story follows Sari as she makes her kite and finally flies it at the festival.' },
      { type: 'detail', q: 'What did Sari and her grandfather use to make the kite\'s frame?', choices: ['Plastic straws', 'Metal wire', 'Thin bamboo sticks', 'Old newspapers'], a: 2, why: 'Paragraph 2 says they tied "thin bamboo sticks into a cross."' },
      { type: 'vocab', q: 'Her grandfather said, "Be patient." What does "patient" mean?', choices: ['Able to wait calmly', 'Very fast', 'Feeling sick', 'Very loud'], a: 0, why: 'Grandfather wants Sari to wait calmly because the wind will come back.' },
      { type: 'seq', q: 'What happened right AFTER the strong breeze blew in?', choices: ['Sari started to cry', 'Sari glued a tail on the kite', 'Sari\'s kite fell into the sand', 'Sari\'s kite climbed high into the sky'], a: 3, why: 'After the breeze came, Sari lifted her kite and it climbed "higher and higher."' },
      { type: 'infer', q: 'Why did Sari feel "even prouder" at the end?', choices: ['Her kite was the biggest one', 'She had made the kite herself', 'She won a prize', 'Her grandfather bought her a new kite'], a: 1, why: 'The last sentence says she was even prouder "that she had made it herself."' }
    ],
    speak: 'Be patient. The wind always comes back.',
    write: { prompt: 'Tell about a time you had to be patient. What happened in the end?', minWords: 20, hint: 'Try to use the words "patient" and "proud".' }
  },
  {
    id: 'r-orangutan',
    title: 'People of the Forest',
    level: 1,
    genre: 'Nonfiction',
    topic: 'Animals',
    emoji: '🦧',
    text: [
      'The name "orangutan" comes from the Malay words "orang" and "hutan." Together they mean "person of the forest." Orangutans are great apes, and they are very clever. Wild orangutans live on only two islands in the world: Borneo and Sumatra.',
      'Orangutans spend almost all of their time high up in the trees. They have very long arms that help them swing from branch to branch. They eat mostly fruit, but they also eat leaves, bark, flowers, and insects.',
      'Every evening, an orangutan builds a new nest to sleep in. It bends and weaves branches together and then adds soft leaves on top, like a pillow. Some orangutans even make a roof of leaves when it rains!',
      'A baby orangutan stays with its mother for about seven or eight years. The mother teaches it which foods are safe to eat and how to build nests. Sadly, orangutans are in danger because many forests are being cut down. Protecting the forests means protecting the orangutans, too.'
    ],
    vocab: [
      { w: 'clever', forms: ['clever'], pos: 'adjective', def: 'quick to learn and understand things; smart', id: 'pintar, cerdas', ex: 'The clever student solved the puzzle quickly.' },
      { w: 'swing', forms: ['swing'], pos: 'verb', def: 'to move back and forth or from one place to another while hanging', id: 'berayun', ex: 'Monkeys swing from tree to tree.' },
      { w: 'weaves', forms: ['weaves', 'weave'], pos: 'verb', def: 'to cross pieces over and under each other to make something', id: 'menganyam', ex: 'My aunt weaves baskets from palm leaves.' },
      { w: 'danger', forms: ['danger'], pos: 'noun', def: 'the chance of being hurt or destroyed', id: 'bahaya', ex: 'The sign warned us of danger.' },
      { w: 'protecting', forms: ['protecting', 'protect'], pos: 'verb', def: 'keeping someone or something safe', id: 'melindungi', ex: 'Helmets protect your head.' }
    ],
    questions: [
      { type: 'detail', q: 'What does the name "orangutan" mean?', choices: ['Orange monkey', 'Person of the forest', 'King of the trees', 'Clever ape'], a: 1, why: 'Paragraph 1: together the words mean "person of the forest."' },
      { type: 'detail', q: 'Where do wild orangutans live?', choices: ['Only on Borneo and Sumatra', 'All over Asia', 'In Africa', 'On Java and Bali'], a: 0, why: 'The text says they live on "only two islands": Borneo and Sumatra.' },
      { type: 'vocab', q: 'An orangutan "weaves" branches together. What does "weaves" mean here?', choices: ['Breaks them into small pieces', 'Throws them away', 'Crosses them over and under each other', 'Eats them'], a: 2, why: 'To build a nest, the orangutan crosses branches over and under each other.' },
      { type: 'cause', q: 'Why are orangutans in danger?', choices: ['They do not have enough water', 'Many forests are being cut down', 'They forget how to build nests', 'Their arms are too long'], a: 1, why: 'The last paragraph says they are in danger "because many forests are being cut down."' },
      { type: 'purpose', q: 'Why did the author write this text?', choices: ['To tell a funny story about a zoo', 'To teach readers facts about orangutans', 'To sell a trip to Borneo', 'To explain how to build a nest at home'], a: 1, why: 'The text gives many facts about orangutans: their name, home, food, nests, and babies.' }
    ],
    speak: 'Protecting the forests means protecting the orangutans, too.',
    write: { prompt: 'Name two things an orangutan mother teaches her baby. Why are these lessons important?', minWords: 20, hint: 'Use words from the text like "nest" and "safe".' }
  },
  {
    id: 'r-komodo',
    title: 'Dragons Are Real!',
    level: 2,
    genre: 'Nonfiction',
    topic: 'Animals',
    emoji: '🦎',
    text: [
      'Dragons are not only in stories. On a few islands in eastern Indonesia, including Komodo, Rinca, and Flores, you can find a real "dragon": the Komodo dragon. It is the largest lizard alive today. An adult can grow to about three meters long, which is longer than a small car is wide, and can weigh around 70 kilograms.',
      'Komodo dragons are powerful predators. They eat almost any meat they can find, from deer and wild pigs to dead animals. A Komodo dragon does not chase its prey for a long time. Instead, it hides and waits, then attacks suddenly. Its bite contains venom that makes the prey weak.',
      'A Komodo dragon uses its long, yellow, forked tongue to "smell" the air. The tongue collects tiny bits of scent and brings them back to the mouth. In this way, a dragon can find food that is several kilometers away.',
      'Because Komodo dragons live in such a small area, they are vulnerable. In 1980, Indonesia created Komodo National Park to protect them. Today, visitors from all over the world come to see these amazing reptiles, but they must always walk with a trained ranger. After all, it is not wise to get too close to a dragon!'
    ],
    vocab: [
      { w: 'predators', forms: ['predators', 'predator'], pos: 'noun', def: 'animals that hunt and eat other animals', id: 'pemangsa, predator', ex: 'Lions are predators.' },
      { w: 'prey', forms: ['prey'], pos: 'noun', def: 'an animal that is hunted and eaten by another animal', id: 'mangsa', ex: 'Mice are prey for owls.' },
      { w: 'venom', forms: ['venom'], pos: 'noun', def: 'poison that some animals put into a bite or sting', id: 'bisa, racun', ex: 'Some snakes have strong venom.' },
      { w: 'scent', forms: ['scent'], pos: 'noun', def: 'a smell', id: 'bau, aroma', ex: 'The dog followed the scent of the food.' },
      { w: 'vulnerable', forms: ['vulnerable'], pos: 'adjective', def: 'easy to hurt or harm', id: 'rentan', ex: 'Baby birds are vulnerable without their parents.' },
      { w: 'ranger', forms: ['ranger'], pos: 'noun', def: 'a person whose job is to take care of a park or forest', id: 'penjaga taman', ex: 'The ranger showed us the safe path.' }
    ],
    questions: [
      { type: 'main', q: 'What is the main idea of this text?', choices: ['Dragons in stories can breathe fire', 'The Komodo dragon is a real, powerful lizard that needs protection', 'Komodo Island is a good place to swim', 'Lizards make good pets'], a: 1, why: 'Each paragraph tells about the real Komodo dragon: its size, hunting, tongue, and protection.' },
      { type: 'detail', q: 'How does a Komodo dragon usually catch its prey?', choices: ['It chases the prey for many kilometers', 'It hides, waits, and then attacks suddenly', 'It climbs trees and jumps down', 'It swims after fish'], a: 1, why: 'Paragraph 2: "it hides and waits, then attacks suddenly."' },
      { type: 'vocab', q: 'The text says Komodo dragons are "vulnerable." Which word means the same?', choices: ['Easy to harm', 'Very fast', 'Very old', 'Colorful'], a: 0, why: 'They live in a small area, so they could easily be harmed. That is why a park was created.' },
      { type: 'detail', q: 'What does a Komodo dragon use its tongue for?', choices: ['To drink water', 'To make loud sounds', 'To "smell" the air and find food', 'To clean its eyes'], a: 2, why: 'Paragraph 3: the tongue collects scent from the air.' },
      { type: 'infer', q: 'Why must visitors walk with a trained ranger?', choices: ['Because Komodo dragons can be dangerous', 'Because the park is very dark', 'Because visitors might get lost in the city', 'Because rangers sell tickets'], a: 0, why: 'The text says "it is not wise to get too close to a dragon." A ranger keeps visitors safe.' },
      { type: 'cause', q: 'What happened in 1980?', choices: ['The Komodo dragon was discovered', 'Indonesia created Komodo National Park', 'The last Komodo dragon was born', 'Visitors were no longer allowed'], a: 1, why: 'Paragraph 4: "In 1980, Indonesia created Komodo National Park."' }
    ],
    speak: 'A Komodo dragon uses its forked tongue to smell the air.',
    write: { prompt: 'Would you like to visit Komodo National Park? Give two reasons.', minWords: 25, hint: 'Try using "predator", "ranger", or "vulnerable".' }
  },
  {
    id: 'r-batik',
    title: 'The Art of Batik',
    level: 2,
    genre: 'Nonfiction',
    topic: 'Culture',
    emoji: '🎨',
    text: [
      'If you look around at school on some days, you might see many students and teachers wearing batik. Batik is a way of decorating cloth with beautiful patterns. It is an important part of Indonesian culture, and it has been made on the island of Java for hundreds of years.',
      'To make batik by hand, an artist first draws a pattern on white cloth. Next, the artist uses a small tool called a canting to trace the pattern with hot, melted wax. The wax covers some parts of the cloth. Then the cloth is dipped into dye. The dye colors the cloth, but it cannot soak into the parts covered with wax. Finally, the wax is removed with hot water, and the pattern appears.',
      'For a design with many colors, the artist repeats these steps again and again. This is why hand-drawn batik, called batik tulis, can take weeks or even months to finish. Some makers use a copper stamp, called a cap, to print the wax faster.',
      'In 2009, UNESCO recognized Indonesian batik as an important part of the world\'s cultural heritage. Since then, Indonesians have celebrated National Batik Day every year on October 2nd. Each pattern tells a story, so wearing batik is like wearing a piece of history.'
    ],
    vocab: [
      { w: 'decorating', forms: ['decorating', 'decorate'], pos: 'verb', def: 'making something look more beautiful by adding things to it', id: 'menghias', ex: 'We are decorating the classroom for the party.' },
      { w: 'trace', forms: ['trace'], pos: 'verb', def: 'to follow the lines of a drawing carefully', id: 'menjiplak, menelusuri', ex: 'Trace the letters with your pencil.' },
      { w: 'dye', forms: ['dye'], pos: 'noun', def: 'a liquid used to change the color of cloth or hair', id: 'pewarna', ex: 'She used blue dye on her shirt.' },
      { w: 'soak', forms: ['soak'], pos: 'verb', def: 'to go into something and make it completely wet', id: 'meresap', ex: 'Let the rain soak into the soil.' },
      { w: 'heritage', forms: ['heritage'], pos: 'noun', def: 'traditions and history passed down from older generations', id: 'warisan budaya', ex: 'Traditional dance is part of our heritage.' }
    ],
    questions: [
      { type: 'seq', q: 'In making batik, what happens right after the pattern is traced with wax?', choices: ['The cloth is dipped into dye', 'The wax is removed with hot water', 'The artist draws the pattern', 'The cloth is sold'], a: 0, why: 'Paragraph 2: after tracing with wax, "the cloth is dipped into dye."' },
      { type: 'cause', q: 'Why does the dye NOT color some parts of the cloth?', choices: ['The artist paints them white later', 'Those parts are covered with wax', 'The cloth is too thick there', 'The dye is too cold'], a: 1, why: 'The dye "cannot soak into the parts covered with wax."' },
      { type: 'vocab', q: 'Which word from the text means "traditions passed down from older generations"?', choices: ['Canting', 'Pattern', 'Heritage', 'Stamp'], a: 2, why: '"Heritage" means the history and traditions we receive from people before us.' },
      { type: 'infer', q: 'Why might batik cap be cheaper than batik tulis?', choices: ['It uses no wax', 'It is made faster with a stamp', 'It has no patterns', 'It is made only in 2009'], a: 1, why: 'A copper stamp prints the wax faster, so it takes less time than drawing by hand.' },
      { type: 'detail', q: 'When is National Batik Day?', choices: ['August 17th', 'April 21st', 'October 2nd', 'May 2nd'], a: 2, why: 'Paragraph 4: "every year on October 2nd."' }
    ],
    speak: 'Wearing batik is like wearing a piece of history.',
    write: { prompt: 'Explain the steps of making batik in your own words. Use "first", "next", "then", and "finally".', minWords: 30, hint: 'Sequence words help the reader follow the steps.' }
  },
  {
    id: 'r-bees',
    title: 'The Dancing Bees',
    level: 2,
    genre: 'Nonfiction',
    topic: 'Science',
    emoji: '🐝',
    text: [
      'Honeybees cannot talk, but they can still share important information. When a worker bee finds a field full of flowers, she flies back to the hive and does a special dance. Scientists call it the "waggle dance."',
      'During the waggle dance, the bee walks in a straight line while shaking her body from side to side. Then she circles back and does it again. The direction of the straight line shows the other bees which way to fly, compared to the sun. The length of the waggle tells them how far away the flowers are. A longer waggle means the food is farther away.',
      'The other bees watch carefully, and they also smell the flowers on the dancer\'s body. Then they fly out and find the food themselves. This teamwork helps the whole colony survive.',
      'Honeybees work extremely hard. A single worker bee makes only about one-twelfth of a teaspoon of honey in her entire life. That means thousands of bees must work together to fill just one jar. The next time you taste honey, remember the tiny dancers who made it possible.'
    ],
    vocab: [
      { w: 'hive', forms: ['hive'], pos: 'noun', def: 'the home where a group of bees lives', id: 'sarang lebah', ex: 'The bees returned to their hive.' },
      { w: 'direction', forms: ['direction'], pos: 'noun', def: 'the way something is moving or pointing', id: 'arah', ex: 'Which direction is the school?' },
      { w: 'colony', forms: ['colony'], pos: 'noun', def: 'a large group of the same animals living together', id: 'koloni', ex: 'An ant colony can have millions of ants.' },
      { w: 'survive', forms: ['survive'], pos: 'verb', def: 'to stay alive', id: 'bertahan hidup', ex: 'Plants need water to survive.' },
      { w: 'entire', forms: ['entire'], pos: 'adjective', def: 'whole; complete', id: 'seluruh', ex: 'He ate the entire pizza!' }
    ],
    questions: [
      { type: 'main', q: 'What is the main idea of paragraph 2?', choices: ['Bees like the sun', 'The waggle dance shows where food is and how far away it is', 'Bees shake to stay warm', 'Bees dance to have fun'], a: 1, why: 'Paragraph 2 explains how the dance shows direction and distance.' },
      { type: 'detail', q: 'What does a LONGER waggle mean?', choices: ['The food is closer', 'The food is farther away', 'There is danger nearby', 'The flowers are red'], a: 1, why: '"A longer waggle means the food is farther away."' },
      { type: 'vocab', q: '"This teamwork helps the whole colony survive." What does "survive" mean?', choices: ['Stay alive', 'Go to sleep', 'Fly fast', 'Become sweet'], a: 0, why: 'To survive means to stay alive.' },
      { type: 'infer', q: 'Why do the other bees smell the dancer\'s body?', choices: ['To check if she is sick', 'To learn which flowers to look for', 'To make honey', 'To find the queen'], a: 1, why: 'The dancer carries the smell of the flowers, so the others know what kind of flower to find.' },
      { type: 'infer', q: 'Why does the author call bees "tiny dancers who made it possible"?', choices: ['Bees perform shows for people', 'The waggle dance helps bees find the flowers they use to make honey', 'Bees dance inside honey jars', 'Bees learn dancing from people'], a: 1, why: 'The dance leads bees to flowers, which they need to make honey.' }
    ],
    speak: 'A longer waggle means the food is farther away.',
    write: { prompt: 'How is the bees\' teamwork like teamwork in your class or family? Give one example.', minWords: 25, hint: 'Try using "colony" and "survive".' }
  },
  {
    id: 'r-borobudur',
    title: 'The Temple on the Hill',
    level: 3,
    genre: 'Nonfiction',
    topic: 'History',
    emoji: '🛕',
    text: [
      'In Central Java, surrounded by green hills and volcanoes, stands Borobudur, the largest Buddhist temple in the world. It was built more than 1,200 years ago, during the 8th and 9th centuries, by the Sailendra dynasty. Amazingly, the builders did not use any cement. They fitted about two million blocks of volcanic stone together like pieces of a giant puzzle.',
      'Borobudur is shaped like a huge stepped pyramid with nine levels. The walls of the lower levels are covered with 2,672 carved stone panels. Some panels show scenes from daily life long ago: farmers, ships, markets, and musicians. Others tell the teachings of the Buddha. Visitors traditionally walk around each level clockwise as they climb, "reading" the stories on the walls. On the top levels sit 72 bell-shaped stupas, and inside most of them is a statue of the Buddha.',
      'For hundreds of years, Borobudur was abandoned. Volcanic ash and jungle plants slowly covered it. In 1814, people working for the British governor Thomas Stamford Raffles heard about the hidden temple and began to uncover it. However, the monument was in poor condition, and rain water was damaging the stones.',
      'Between 1975 and 1982, the Indonesian government and UNESCO carried out a massive restoration project. Workers took apart parts of the temple, cleaned and repaired each stone, and rebuilt it with better drainage. In 1991, Borobudur became a UNESCO World Heritage Site. Today it is one of Indonesia\'s most visited places, and it reminds us of the skill and patience of people who lived long ago.'
    ],
    vocab: [
      { w: 'dynasty', forms: ['dynasty'], pos: 'noun', def: 'a family of rulers who rule a country for a long time', id: 'dinasti, wangsa', ex: 'The dynasty ruled for three hundred years.' },
      { w: 'carved', forms: ['carved', 'carve'], pos: 'adjective', def: 'cut into a shape or picture from wood or stone', id: 'berukir, dipahat', ex: 'We saw a carved wooden door.' },
      { w: 'abandoned', forms: ['abandoned'], pos: 'adjective', def: 'left alone and no longer used or cared for', id: 'ditinggalkan, terbengkalai', ex: 'The abandoned house was full of dust.' },
      { w: 'uncover', forms: ['uncover'], pos: 'verb', def: 'to remove what is covering something so it can be seen', id: 'menyingkap, menggali', ex: 'Scientists uncover old bones in the desert.' },
      { w: 'restoration', forms: ['restoration'], pos: 'noun', def: 'the work of repairing something old so it looks like it did before', id: 'pemugaran', ex: 'The restoration of the old bridge took two years.' },
      { w: 'drainage', forms: ['drainage'], pos: 'noun', def: 'a system that carries away extra water', id: 'saluran air, drainase', ex: 'Good drainage stops the road from flooding.' }
    ],
    questions: [
      { type: 'main', q: 'Which sentence best states the main idea of the whole text?', choices: ['Borobudur was built without cement', 'Borobudur is an ancient, amazing temple that was lost, found, and restored', 'Thomas Stamford Raffles was a British governor', 'Volcanoes are dangerous for temples'], a: 1, why: 'The text covers Borobudur\'s building, design, loss, discovery, and restoration.' },
      { type: 'detail', q: 'How did the builders hold the stones together?', choices: ['With cement', 'With iron nails', 'By fitting the blocks together like a puzzle', 'With wooden sticks'], a: 2, why: 'Paragraph 1: they "did not use any cement" and fitted the blocks "like pieces of a giant puzzle."' },
      { type: 'vocab', q: '"For hundreds of years, Borobudur was abandoned." What does "abandoned" mean?', choices: ['Crowded with visitors', 'Left alone and not cared for', 'Newly built', 'Painted in bright colors'], a: 1, why: 'Because it was left alone, ash and plants covered it.' },
      { type: 'cause', q: 'What was one reason the restoration was needed?', choices: ['Rain water was damaging the stones', 'The temple was too small', 'The Buddha statues were missing', 'Visitors wanted a new color'], a: 0, why: 'Paragraph 3: "rain water was damaging the stones," and the rebuild added better drainage.' },
      { type: 'infer', q: 'Why might the carved panels be important to historians today?', choices: ['They show what daily life looked like long ago', 'They explain how to build a car', 'They were made in 1991', 'They are made of gold'], a: 0, why: 'The panels show farmers, ships, markets, and musicians from long ago.' },
      { type: 'seq', q: 'Put these events in order: (A) became a World Heritage Site, (B) was built, (C) was uncovered in 1814, (D) restoration project.', choices: ['B, C, D, A', 'C, B, A, D', 'B, D, C, A', 'A, B, C, D'], a: 0, why: 'Built (8th–9th c.) → uncovered (1814) → restored (1975–1982) → World Heritage (1991).' }
    ],
    speak: 'Borobudur reminds us of the skill and patience of people who lived long ago.',
    write: { prompt: 'Imagine you are a tour guide at Borobudur. Write 3–4 sentences to welcome visitors and tell them one amazing fact.', minWords: 35, hint: 'Try "abandoned", "carved", or "restoration".' }
  },
  {
    id: 'r-robot',
    title: 'Rani and the Homework Robot',
    level: 3,
    genre: 'Story',
    topic: 'Technology',
    emoji: '🤖',
    text: [
      'Rani stared at her science homework and groaned. "Five questions about the water cycle," she muttered. "I wish a robot could just do it for me."',
      'Her older brother, Dimas, looked up from his laptop. He was studying computer science at university, and he loved a challenge. "I can build you a robot helper," he said with a grin. "But it will not give you answers. It will only ask you questions."',
      'Rani was skeptical. How could a robot that only asked questions be useful? Still, she agreed to try. That evening, a small speaker on her desk spoke in a cheerful voice. "Hello, Rani! What happens to a puddle on a hot, sunny day?"',
      '"It dries up," Rani said. "Where does the water go?" asked the robot. Rani frowned and thought. "It turns into water vapor and goes up into the air. That is evaporation!" "Excellent," said the robot. "And what happens when the vapor gets cold high in the sky?" Rani\'s eyes lit up. "It becomes tiny drops and makes clouds. That is condensation!"',
      'Question by question, Rani explained the whole water cycle herself. When she finished, she realized that her homework was done, and she actually understood it. The next morning, she confidently raised her hand in class to answer every question.',
      'After school, she hugged Dimas. "Your robot is terrible at doing homework," she said, laughing. "But it is great at helping me think."'
    ],
    vocab: [
      { w: 'muttered', forms: ['muttered', 'mutter'], pos: 'verb', def: 'said something quietly in a low voice, often when unhappy', id: 'bergumam', ex: '"This is hard," he muttered.' },
      { w: 'challenge', forms: ['challenge'], pos: 'noun', def: 'something difficult that tests your skill', id: 'tantangan', ex: 'Climbing the mountain was a big challenge.' },
      { w: 'skeptical', forms: ['skeptical'], pos: 'adjective', def: 'not easily believing that something is true or useful', id: 'ragu-ragu, skeptis', ex: 'I was skeptical about the magic trick.' },
      { w: 'evaporation', forms: ['evaporation'], pos: 'noun', def: 'when liquid water changes into a gas (water vapor)', id: 'penguapan', ex: 'Evaporation makes puddles disappear.' },
      { w: 'condensation', forms: ['condensation'], pos: 'noun', def: 'when water vapor cools and turns back into drops of water', id: 'pengembunan', ex: 'Condensation forms on a cold glass.' },
      { w: 'confidently', forms: ['confidently'], pos: 'adverb', def: 'in a way that shows you believe in yourself', id: 'dengan percaya diri', ex: 'She spoke confidently in front of the class.' }
    ],
    questions: [
      { type: 'main', q: 'What lesson does Rani learn in this story?', choices: ['Robots are always better than people', 'Thinking through questions helps you really understand', 'Homework is not important', 'Brothers should do their sisters\' homework'], a: 1, why: 'The robot\'s questions helped Rani think, and she understood the water cycle.' },
      { type: 'vocab', q: '"Rani was skeptical." What does this show about Rani?', choices: ['She was excited', 'She did not believe the robot would be useful', 'She was sleepy', 'She was angry at Dimas'], a: 1, why: 'The next sentence asks, "How could a robot that only asked questions be useful?"' },
      { type: 'detail', q: 'According to Rani, what is condensation?', choices: ['Water vapor cooling and becoming drops that make clouds', 'A puddle drying up', 'Rain falling on the ground', 'Water freezing into ice'], a: 0, why: 'Rani said vapor gets cold, becomes tiny drops, and makes clouds.' },
      { type: 'infer', q: 'Why did Dimas build a robot that only asks questions?', choices: ['He did not know the answers', 'He wanted Rani to learn by thinking for herself', 'He wanted to test the speaker', 'He was too busy to help'], a: 1, why: 'The robot guided Rani to explain the answers herself, so she learned.' },
      { type: 'infer', q: 'How did Rani feel in class the next morning?', choices: ['Nervous and confused', 'Bored', 'Confident', 'Angry'], a: 2, why: 'She "confidently raised her hand in class to answer every question."' },
      { type: 'purpose', q: 'Why does Rani say the robot is "terrible at doing homework"?', choices: ['The robot broke', 'She is joking: it never does the homework, but it helps her learn', 'The robot gave wrong answers', 'The robot was too slow'], a: 1, why: 'She is joking: the robot never does homework, but it helped her think.' }
    ],
    speak: 'It turns into water vapor and goes up into the air. That is evaporation!',
    write: { prompt: 'Would you like a robot helper like Rani\'s? Why or why not?', minWords: 35, hint: 'Try "challenge", "skeptical", or "confidently".' }
  },
  {
    id: 'r-coral',
    title: 'Rainforests of the Sea',
    level: 3,
    genre: 'Nonfiction',
    topic: 'Science',
    emoji: '🪸',
    text: [
      'Coral reefs are often called the "rainforests of the sea" because so many living things make their home there. Although they cover less than one percent of the ocean floor, coral reefs support about a quarter of all ocean species.',
      'Many people think coral is a rock or a plant, but it is actually an animal. A coral reef is built by millions of tiny animals called polyps. Each polyp builds a hard skeleton of limestone around its soft body. When polyps die, their skeletons remain, and new polyps grow on top. Over thousands of years, the reef grows larger and larger.',
      'Indonesia is part of an area called the Coral Triangle, along with countries such as the Philippines, Malaysia, and Papua New Guinea. The Coral Triangle has more kinds of coral than anywhere else on Earth. It is sometimes called the "Amazon of the seas."',
      'Unfortunately, coral reefs are fragile. When the ocean becomes too warm, corals push out the tiny algae that live inside them. The algae give the coral its color and much of its food. Without them, the coral turns white. This is called coral bleaching. If the water does not cool down, the coral may starve and die. Pollution, careless fishing, and people stepping on reefs can also cause damage.',
      'The good news is that everyone can help. We can use less plastic, never touch coral when snorkeling, and choose sunscreen that is safe for reefs. Healthy reefs mean healthy oceans for all of us.'
    ],
    vocab: [
      { w: 'species', forms: ['species'], pos: 'noun', def: 'a group of living things of the same kind', id: 'spesies, jenis', ex: 'There are many species of birds in the park.' },
      { w: 'skeleton', forms: ['skeleton'], pos: 'noun', def: 'the hard frame that supports a body', id: 'kerangka tubuh', ex: 'The museum has a dinosaur skeleton.' },
      { w: 'fragile', forms: ['fragile'], pos: 'adjective', def: 'easily broken or damaged', id: 'rapuh', ex: 'Be careful: the glass is fragile.' },
      { w: 'bleaching', forms: ['bleaching'], pos: 'noun', def: 'losing color and turning white', id: 'pemutihan', ex: 'Coral bleaching happens when the sea is too hot.' },
      { w: 'starve', forms: ['starve'], pos: 'verb', def: 'to become weak or die because of not having enough food', id: 'kelaparan', ex: 'Without food, animals will starve.' },
      { w: 'remain', forms: ['remain'], pos: 'verb', def: 'to stay in the same place', id: 'tetap tinggal, tersisa', ex: 'Please remain in your seats.' }
    ],
    questions: [
      { type: 'detail', q: 'What is coral?', choices: ['A rock', 'A plant', 'An animal', 'A kind of sand'], a: 2, why: 'Paragraph 2: "it is actually an animal."' },
      { type: 'infer', q: 'Why are coral reefs called the "rainforests of the sea"?', choices: ['It rains a lot on coral reefs', 'They have trees underwater', 'Many different living things live there, like in a rainforest', 'They are green'], a: 2, why: 'Like rainforests, reefs are home to a huge number of species.' },
      { type: 'cause', q: 'What causes coral bleaching?', choices: ['Water that is too warm', 'Too many fish', 'Cold winter storms', 'Too much sunlight on land'], a: 0, why: 'Paragraph 4: when the ocean becomes too warm, corals push out their algae and turn white.' },
      { type: 'vocab', q: '"Coral reefs are fragile." Which word is the OPPOSITE of "fragile"?', choices: ['Weak', 'Strong', 'Colorful', 'Tiny'], a: 1, why: 'Fragile means easily broken, so the opposite is strong.' },
      { type: 'detail', q: 'Which is NOT listed as a way to help coral reefs?', choices: ['Using less plastic', 'Not touching coral', 'Using reef-safe sunscreen', 'Feeding the fish bread'], a: 3, why: 'The last paragraph lists the other three, not feeding fish.' },
      { type: 'purpose', q: 'What is the author\'s purpose in the last paragraph?', choices: ['To entertain with a joke', 'To persuade readers to help protect reefs', 'To describe how polyps eat', 'To compare Indonesia and Malaysia'], a: 1, why: 'It tells readers what they can do to help.' }
    ],
    speak: 'Healthy reefs mean healthy oceans for all of us.',
    write: { prompt: 'Write a short poster message (3 sentences) asking people to protect coral reefs.', minWords: 25, hint: 'Use "fragile" and one reason why reefs matter.' }
  },
  {
    id: 'r-krakatoa',
    title: 'The Loudest Sound in History',
    level: 4,
    genre: 'Nonfiction',
    topic: 'History',
    emoji: '🌋',
    text: [
      'On the morning of August 27, 1883, the volcano Krakatoa, on an island between Java and Sumatra, exploded with incredible force. The sound was so loud that people heard it on Rodrigues Island, near Mauritius, almost 4,800 kilometers away. Many scientists believe it was the loudest sound in recorded history.',
      'Krakatoa had been rumbling for months before the huge explosion. Small eruptions sent ash into the sky, and ships nearby reported strange noises. However, few people understood the danger. At that time, there were no modern instruments to warn people that a massive eruption was coming.',
      'The eruption destroyed most of the island. Even worse, it caused enormous tsunamis. Waves up to 30 meters high crashed into the coasts of Java and Sumatra, sweeping away whole towns. More than 36,000 people lost their lives, most of them because of the waves rather than the volcano itself.',
      'The effects of the eruption were felt around the world. Huge amounts of ash and gas rose high into the atmosphere and spread around the planet. For months, sunsets in places as far away as Europe and North America glowed bright red and orange. The ash also blocked some sunlight, and global temperatures dropped slightly the following year.',
      'In 1927, a new volcano began to rise from the sea where Krakatoa had been. It was named Anak Krakatau, which means "Child of Krakatoa." It is still active today, and scientists watch it carefully. Thanks to what we learned from 1883, Indonesia now has monitoring systems to warn people about volcanoes and tsunamis.'
    ],
    vocab: [
      { w: 'incredible', forms: ['incredible'], pos: 'adjective', def: 'so great or surprising that it is hard to believe', id: 'luar biasa', ex: 'The view from the mountain was incredible.' },
      { w: 'rumbling', forms: ['rumbling', 'rumble'], pos: 'verb', def: 'making a long, low, deep sound', id: 'bergemuruh', ex: 'The thunder was rumbling in the distance.' },
      { w: 'massive', forms: ['massive'], pos: 'adjective', def: 'very large and heavy', id: 'sangat besar', ex: 'A massive rock blocked the road.' },
      { w: 'enormous', forms: ['enormous'], pos: 'adjective', def: 'extremely large', id: 'amat besar', ex: 'An elephant is an enormous animal.' },
      { w: 'atmosphere', forms: ['atmosphere'], pos: 'noun', def: 'the layer of air around the Earth', id: 'atmosfer', ex: 'Airplanes fly high in the atmosphere.' },
      { w: 'monitoring', forms: ['monitoring', 'monitor'], pos: 'noun', def: 'watching and checking something carefully over time', id: 'pemantauan', ex: 'Monitoring the weather helps farmers.' }
    ],
    questions: [
      { type: 'main', q: 'What is the main idea of this text?', choices: ['Krakatoa\'s 1883 eruption was extremely powerful and affected the whole world', 'Rodrigues Island is near Mauritius', 'All volcanoes make loud sounds', 'Sunsets in Europe are red'], a: 0, why: 'The text describes the huge eruption and its effects locally and worldwide.' },
      { type: 'detail', q: 'What caused most of the deaths?', choices: ['Hot lava', 'The loud sound', 'Tsunami waves', 'Cold temperatures'], a: 2, why: 'Paragraph 3: most died "because of the waves rather than the volcano itself."' },
      { type: 'cause', q: 'Why were sunsets red in Europe after the eruption?', choices: ['Europe had its own volcano', 'Ash and gas spread around the atmosphere', 'The sun became hotter', 'Ships carried red dust'], a: 1, why: 'Paragraph 4: ash and gas spread around the planet, making sunsets glow red and orange.' },
      { type: 'vocab', q: 'Which word from the text is closest in meaning to "enormous"?', choices: ['Incredible', 'Massive', 'Active', 'Modern'], a: 1, why: 'Both "massive" and "enormous" mean very large.' },
      { type: 'infer', q: 'Why did few people understand the danger before the explosion?', choices: ['There were no modern instruments to warn them', 'Nobody lived near Krakatoa', 'The volcano was completely silent', 'Scientists said it was safe'], a: 0, why: 'Paragraph 2: "there were no modern instruments to warn people."' },
      { type: 'purpose', q: 'Why does the author end with information about monitoring systems?', choices: ['To show that people learned from the disaster', 'To sell instruments', 'To say that volcanoes are no longer dangerous', 'To describe Anak Krakatau\'s color'], a: 0, why: 'The last sentence says "Thanks to what we learned from 1883..." — people improved warnings.' }
    ],
    speak: 'The sound was so loud that people heard it almost four thousand eight hundred kilometers away.',
    write: { prompt: 'Why is it important to have warning systems for volcanoes and tsunamis? Use one fact from the text.', minWords: 40, hint: 'Try "monitoring", "massive", or "atmosphere".' }
  },
  {
    id: 'r-moon',
    title: 'Footprints That Last Forever',
    level: 4,
    genre: 'Nonfiction',
    topic: 'Space',
    emoji: '🌕',
    text: [
      'On July 20, 1969, astronaut Neil Armstrong climbed down a ladder and became the first person to step onto the Moon. "That\'s one small step for man, one giant leap for mankind," he said. Millions of people around the world watched on television. Soon after, Buzz Aldrin joined him on the dusty surface.',
      'The Moon is very different from Earth. It has almost no atmosphere, so there is no air to breathe, no wind, and no rain. The sky above the Moon looks black, even during the day. Temperatures can rise above 100°C in sunlight and fall below minus 150°C in the dark.',
      'Gravity on the Moon is only about one-sixth as strong as on Earth. A child who weighs 36 kilograms on Earth would feel as light as 6 kilograms there. Astronauts discovered that it was easier to hop like kangaroos than to walk normally.',
      'One of the most surprising facts about the Moon is that the astronauts\' footprints are probably still there. On Earth, wind and rain would erase a footprint in a day. On the Moon, with no wind or water, footprints can remain for millions of years, unless a small space rock happens to hit them.',
      'Even though the Moon looks bright at night, it does not make its own light. It reflects light from the Sun, like a giant mirror in the sky. Scientists are now planning new missions to return to the Moon and, perhaps one day, to build a base where people can live and work.'
    ],
    vocab: [
      { w: 'astronaut', forms: ['astronaut'], pos: 'noun', def: 'a person trained to travel in space', id: 'astronaut, antariksawan', ex: 'The astronaut floated inside the space station.' },
      { w: 'surface', forms: ['surface'], pos: 'noun', def: 'the top or outside layer of something', id: 'permukaan', ex: 'Leaves floated on the surface of the pond.' },
      { w: 'gravity', forms: ['gravity'], pos: 'noun', def: 'the force that pulls things toward a planet or moon', id: 'gravitasi', ex: 'Gravity makes an apple fall to the ground.' },
      { w: 'erase', forms: ['erase'], pos: 'verb', def: 'to remove something completely', id: 'menghapus', ex: 'Please erase the board.' },
      { w: 'reflects', forms: ['reflects', 'reflect'], pos: 'verb', def: 'sends back light, heat, or sound from a surface', id: 'memantulkan', ex: 'A mirror reflects your face.' },
      { w: 'mission', forms: ['mission', 'missions'], pos: 'noun', def: 'an important trip or job with a special goal', id: 'misi', ex: 'The mission was to explore Mars.' }
    ],
    questions: [
      { type: 'cause', q: 'Why can footprints last millions of years on the Moon?', choices: ['The ground is made of glue', 'There is no wind or water to erase them', 'Astronauts protect them', 'The Moon is very cold'], a: 1, why: 'Paragraph 4: "with no wind or water, footprints can remain for millions of years."' },
      { type: 'detail', q: 'How strong is gravity on the Moon compared to Earth?', choices: ['Twice as strong', 'The same', 'About one-sixth as strong', 'Ten times stronger'], a: 2, why: 'Paragraph 3: "only about one-sixth as strong as on Earth."' },
      { type: 'infer', q: 'Why did astronauts find it easier to hop than walk?', choices: ['Their boots were too small', 'Low gravity made them feel very light', 'The surface was hot', 'They were playing a game'], a: 1, why: 'Weaker gravity made them light, so hopping was easier.' },
      { type: 'vocab', q: '"It reflects light from the Sun, like a giant mirror." What does "reflects" mean?', choices: ['Makes its own light', 'Sends back light that hits it', 'Hides light', 'Eats light'], a: 1, why: 'A mirror sends back light — so the Moon sends back sunlight.' },
      { type: 'detail', q: 'Why does the sky above the Moon look black even in the day?', choices: ['The Moon has almost no atmosphere', 'The Sun is turned off', 'It is always night on the Moon', 'The Moon is painted black'], a: 0, why: 'Paragraph 2 connects the black sky to having almost no atmosphere.' },
      { type: 'main', q: 'Which title would ALSO fit this text well?', choices: ['How to Build a Rocket', 'Surprising Facts About the Moon', 'The Life of Buzz Aldrin', 'Why Kangaroos Hop'], a: 1, why: 'The text shares many surprising Moon facts: gravity, footprints, temperature, light.' }
    ],
    speak: 'That is one small step for man, one giant leap for mankind.',
    write: { prompt: 'If you could live in a Moon base for one week, what would you do? Use two facts from the text.', minWords: 40, hint: 'Try "gravity", "surface", or "astronaut".' }
  },
  {
    id: 'r-mangrove',
    title: 'The Girl Who Planted a Forest',
    level: 5,
    genre: 'Story',
    topic: 'Environment',
    emoji: '🌱',
    text: [
      'When Putri was ten, a storm flooded her fishing village on the north coast of Java. Salty water rushed into houses, and the small road to school disappeared under mud. Her father pointed to the empty shoreline. "When I was a boy," he said, "mangrove trees grew all along this beach. Their roots held the soil together and slowed down the waves. Then people cut them down to build fish ponds."',
      'Putri could not stop thinking about those trees. She read everything she could find about mangroves. She learned that their tangled roots act like a natural wall against waves, that they provide shelter for young fish and crabs, and that they store large amounts of carbon, which helps fight climate change.',
      'With her pocket money, Putri bought twenty mangrove seedlings from a nursery in the next village. Every Sunday she waded into the muddy water to plant them. Some neighbors laughed. "Twenty little sticks cannot stop the sea," one fisherman said. At first, it seemed he was right: a high tide washed half of her seedlings away.',
      'Instead of giving up, Putri asked the nursery owner for advice. She learned to plant the seedlings in sheltered spots and to protect them with bamboo fences. She also persuaded her classmates to join her, and together they formed a club called "Akar Kuat," or "Strong Roots."',
      'Five years later, a thick green belt of young mangroves lines the shore. The club has planted more than three thousand trees. Fishermen say they are catching more crabs than before, and during the last big storm, the water that reached the village was only ankle-deep. The fisherman who once laughed now brings his grandchildren to help plant. "I was wrong," he admits. "Little sticks can become a forest."'
    ],
    vocab: [
      { w: 'shoreline', forms: ['shoreline'], pos: 'noun', def: 'the edge of the land next to the sea', id: 'garis pantai', ex: 'We walked along the shoreline at sunset.' },
      { w: 'tangled', forms: ['tangled'], pos: 'adjective', def: 'twisted together in a messy way', id: 'kusut, saling membelit', ex: 'My headphone cables are tangled.' },
      { w: 'shelter', forms: ['shelter'], pos: 'noun', def: 'a place that protects you from danger or bad weather', id: 'tempat berlindung', ex: 'We found shelter from the rain under a tree.' },
      { w: 'seedlings', forms: ['seedlings', 'seedling'], pos: 'noun', def: 'very young plants that have grown from seeds', id: 'bibit', ex: 'We planted tomato seedlings in the garden.' },
      { w: 'persuaded', forms: ['persuaded', 'persuade'], pos: 'verb', def: 'made someone agree to do something by giving good reasons', id: 'membujuk, meyakinkan', ex: 'She persuaded her dad to buy a puppy.' },
      { w: 'admits', forms: ['admits', 'admit'], pos: 'verb', def: 'says that something is true, often unwillingly', id: 'mengakui', ex: 'He admits that he broke the vase.' }
    ],
    questions: [
      { type: 'main', q: 'What is the theme (big message) of this story?', choices: ['Fishing is a difficult job', 'Small actions, done with persistence, can make a big difference', 'Storms are always dangerous', 'Children should not play in mud'], a: 1, why: 'Putri\'s small plantings grew into a forest because she kept trying.' },
      { type: 'cause', q: 'According to Putri\'s father, why did the mangroves disappear?', choices: ['A storm destroyed them', 'People cut them down to build fish ponds', 'They died from too much salt', 'Crabs ate their roots'], a: 1, why: 'Paragraph 1: "people cut them down to build fish ponds."' },
      { type: 'detail', q: 'Which is NOT a benefit of mangroves mentioned in the text?', choices: ['They slow down waves', 'They give shelter to young fish', 'They store carbon', 'They produce sweet fruit to sell'], a: 3, why: 'The text mentions waves, shelter, and carbon — not fruit.' },
      { type: 'infer', q: 'What does Putri\'s response to losing half her seedlings show about her character?', choices: ['She is careless', 'She is determined and willing to learn', 'She is afraid of the sea', 'She is angry at the fisherman'], a: 1, why: 'Instead of giving up, she asked for advice and improved her method.' },
      { type: 'vocab', q: '"She also persuaded her classmates to join her." What does "persuaded" mean?', choices: ['Forced', 'Convinced with good reasons', 'Paid', 'Ignored'], a: 1, why: 'To persuade is to make someone agree by giving good reasons.' },
      { type: 'infer', q: 'Why is the fisherman\'s final line, "Little sticks can become a forest," important?', choices: ['It shows he changed his mind about Putri\'s work', 'It shows he wants to cut the trees', 'It means sticks are useful for fishing', 'It proves he never laughed'], a: 0, why: 'Earlier he laughed at the "little sticks"; now he admits he was wrong.' },
      { type: 'detail', q: 'What happened during the last big storm?', choices: ['The village flooded like before', 'The water that reached the village was only ankle-deep', 'All the mangroves were destroyed', 'Putri moved away'], a: 1, why: 'The last paragraph says the water was "only ankle-deep."' }
    ],
    speak: 'Their tangled roots act like a natural wall against waves.',
    write: { prompt: 'Putri did not give up when things went wrong. Write about a problem in your area and one small action you could take to help.', minWords: 50, hint: 'Try "persuaded", "shelter", or "seedlings".' }
  },
  {
    id: 'r-internet',
    title: 'How a Message Travels the World',
    level: 5,
    genre: 'Nonfiction',
    topic: 'Technology',
    emoji: '🌐',
    text: [
      'When you send a message to a friend in another country, it arrives in less than a second. It may feel like magic, but your message actually makes an amazing journey.',
      'First, your phone breaks the message into small pieces of data called packets. Each packet is labeled with the address of where it is going, a little like an envelope in the post. The packets travel by radio waves from your phone to a nearby cell tower or Wi-Fi router, and from there into a much larger network.',
      'Surprisingly, most of the internet\'s long-distance traffic does not travel through space. Although satellites carry some data, about 99 percent of international data moves through cables lying on the ocean floor. These submarine cables are about as thick as a garden hose, and inside them are thin glass fibers that carry information as flashes of light. Hundreds of these cables connect the continents, and Indonesia, with its thousands of islands, relies on many of them.',
      'Along the way, special computers called routers read the address on each packet and send it in the right direction. Not every packet takes the same path. If one route is busy or broken, packets simply take another one. When all the packets reach your friend\'s phone, they are put back together in the correct order, and the message appears on the screen.',
      'This system is fast and flexible, but it is not indestructible. Occasionally, a ship\'s anchor or an undersea earthquake damages a cable, and internet connections in a region can slow down until repair ships fix it. So the next time a message arrives instantly, remember the long, invisible journey it took, across towers, routers, and the deep ocean floor.'
    ],
    vocab: [
      { w: 'packets', forms: ['packets', 'packet'], pos: 'noun', def: 'small pieces of data sent across a network', id: 'paket data', ex: 'The video is sent as thousands of packets.' },
      { w: 'network', forms: ['network'], pos: 'noun', def: 'a system of connected things, like computers or roads', id: 'jaringan', ex: 'Our school computers are on one network.' },
      { w: 'submarine', forms: ['submarine'], pos: 'adjective', def: 'under the sea', id: 'bawah laut', ex: 'Submarine cables connect the islands.' },
      { w: 'relies', forms: ['relies', 'rely'], pos: 'verb', def: 'needs something and depends on it', id: 'bergantung pada', ex: 'The farmer relies on the rain.' },
      { w: 'flexible', forms: ['flexible'], pos: 'adjective', def: 'able to change easily when things change', id: 'fleksibel, luwes', ex: 'Our plan is flexible, so we can go tomorrow instead.' },
      { w: 'indestructible', forms: ['indestructible'], pos: 'adjective', def: 'impossible to break or destroy', id: 'tidak dapat dihancurkan', ex: 'No phone is truly indestructible.' }
    ],
    questions: [
      { type: 'seq', q: 'What is the FIRST thing that happens when you send a message?', choices: ['Routers read the address', 'The phone breaks it into packets', 'The packets travel through ocean cables', 'The packets are put back together'], a: 1, why: 'Paragraph 2 begins: "First, your phone breaks the message into small pieces... called packets."' },
      { type: 'detail', q: 'How does most international internet data travel?', choices: ['Through satellites in space', 'Through cables on the ocean floor', 'By airplane', 'Through radio from one phone to another'], a: 1, why: 'About 99 percent moves through submarine cables.' },
      { type: 'vocab', q: 'The system is "flexible." Which example from the text shows this?', choices: ['Packets take another route if one is busy or broken', 'Cables are as thick as a garden hose', 'Messages arrive in less than a second', 'Ships have anchors'], a: 0, why: 'Being able to change routes easily is what makes it flexible.' },
      { type: 'infer', q: 'Why does Indonesia rely on many submarine cables?', choices: ['Because it has thousands of islands separated by sea', 'Because it has no electricity', 'Because satellites are not allowed', 'Because it has no mountains'], a: 0, why: 'Cables under the sea connect islands to each other and to other countries.' },
      { type: 'purpose', q: 'Why does the author compare a packet to "an envelope in the post"?', choices: ['To show that packets are made of paper', 'To help readers understand that each packet carries an address', 'To explain how to send a letter', 'To show that the internet is slow'], a: 1, why: 'Like an envelope, a packet is labeled with where it is going.' },
      { type: 'cause', q: 'What can cause internet connections in a region to slow down?', choices: ['Too many satellites', 'A damaged undersea cable', 'Sending short messages', 'Using Wi-Fi at night'], a: 1, why: 'The last paragraph: anchors or earthquakes can damage cables and slow connections.' },
      { type: 'main', q: 'Which sentence best summarizes the text?', choices: ['Phones are expensive', 'A message travels as packets through towers, routers, and ocean cables before arriving', 'Satellites carry all our messages', 'Earthquakes happen under the sea'], a: 1, why: 'The text explains every step of the message\'s journey.' }
    ],
    speak: 'About ninety-nine percent of international data moves through cables on the ocean floor.',
    write: { prompt: 'Explain to a younger child how a message travels from your phone to a friend far away. Use at least three steps.', minWords: 50, hint: 'Use "packets", "network", and "first/then/finally".' }
  },
  {
    id: 'r-sleep',
    title: 'Why Your Brain Needs Sleep',
    level: 4,
    genre: 'Nonfiction',
    topic: 'Health',
    emoji: '😴',
    text: [
      'Many children think sleep is boring, or a waste of time that could be used for games and videos. But while you sleep, your brain is surprisingly busy. Doctors recommend that children aged 6 to 12 get between 9 and 12 hours of sleep every night.',
      'One important job of sleep is to help you remember what you learned. During the day, your brain collects lots of new information. At night, it sorts through this information, keeps the important parts, and stores them as long-term memories. This is why a good night\'s sleep before a test is often more useful than staying up late to study.',
      'Sleep also helps your body grow and repair itself. During deep sleep, your body releases a hormone that helps you grow taller and heal small injuries. In addition, scientists have discovered that the brain cleans out waste while you sleep, a little like a night-time cleaning crew.',
      'When children do not get enough sleep, they often feel grumpy and find it hard to concentrate. They may make more mistakes and even get sick more often. On the other hand, children who sleep well usually have more energy, better moods, and better grades.',
      'Here are some tips for better sleep: go to bed at the same time every night, stop using screens about an hour before bedtime, and keep your bedroom dark and quiet. Your brain will thank you in the morning!'
    ],
    vocab: [
      { w: 'recommend', forms: ['recommend'], pos: 'verb', def: 'to say that something is good or should be done', id: 'menyarankan', ex: 'I recommend this book; it is great!' },
      { w: 'memories', forms: ['memories', 'memory'], pos: 'noun', def: 'things you remember from the past', id: 'ingatan, kenangan', ex: 'I have happy memories of my holiday.' },
      { w: 'hormone', forms: ['hormone'], pos: 'noun', def: 'a chemical made in the body that controls how it grows and works', id: 'hormon', ex: 'Hormones help our bodies grow.' },
      { w: 'grumpy', forms: ['grumpy'], pos: 'adjective', def: 'easily annoyed and in a bad mood', id: 'mudah marah, rewel', ex: 'My little brother is grumpy when he is hungry.' },
      { w: 'concentrate', forms: ['concentrate'], pos: 'verb', def: 'to give all your attention to one thing', id: 'berkonsentrasi', ex: 'It is hard to concentrate when it is noisy.' }
    ],
    questions: [
      { type: 'detail', q: 'How many hours of sleep do doctors recommend for children aged 6 to 12?', choices: ['5 to 7 hours', '7 to 8 hours', '9 to 12 hours', '14 to 16 hours'], a: 2, why: 'Paragraph 1: "between 9 and 12 hours."' },
      { type: 'infer', q: 'Why might sleeping well before a test be better than studying late?', choices: ['Sleep helps the brain store what you learned', 'Tests are easier in the morning', 'Teachers like sleepy students', 'Studying is bad for the brain'], a: 0, why: 'Paragraph 2: at night, the brain stores important information as long-term memories.' },
      { type: 'vocab', q: '"They often feel grumpy." Which word means the same as "grumpy"?', choices: ['Cheerful', 'In a bad mood', 'Hungry', 'Strong'], a: 1, why: 'Grumpy means easily annoyed or in a bad mood.' },
      { type: 'purpose', q: 'Why does the author compare the brain to a "night-time cleaning crew"?', choices: ['To show the brain cleans out waste during sleep', 'To say we should clean our rooms at night', 'To describe a job for adults', 'To explain dreams'], a: 0, why: 'The comparison helps explain that the brain removes waste while you sleep.' },
      { type: 'detail', q: 'Which is one tip for better sleep from the text?', choices: ['Play games until you feel tired', 'Keep the light on', 'Stop using screens about an hour before bed', 'Drink sweet tea at night'], a: 2, why: 'The last paragraph lists stopping screens an hour before bedtime.' }
    ],
    speak: 'Go to bed at the same time every night.',
    write: { prompt: 'Describe your bedtime routine. Which tip from the text could you try this week?', minWords: 40, hint: 'Use "recommend" and "concentrate".' }
  }
];

App.QTYPES = {
  main: { label: 'Main Idea', id: 'Ide Pokok', icon: '🎯' },
  detail: { label: 'Key Detail', id: 'Detail Penting', icon: '🔍' },
  vocab: { label: 'Word Meaning', id: 'Arti Kata', icon: '📖' },
  infer: { label: 'Inference', id: 'Menyimpulkan', icon: '🧠' },
  seq: { label: 'Sequence', id: 'Urutan', icon: '🔢' },
  purpose: { label: 'Author\'s Purpose', id: 'Tujuan Penulis', icon: '✍️' },
  cause: { label: 'Cause & Effect', id: 'Sebab-Akibat', icon: '⚡' },
  video: { label: 'Listening', id: 'Menyimak', icon: '🎧' }
};

App.LEVELS = {
  1: { name: 'Level 1 · Sprout', grade: '≈ Kelas 4' },
  2: { name: 'Level 2 · Seedling', grade: '≈ Kelas 5' },
  3: { name: 'Level 3 · Explorer', grade: '≈ Kelas 6' },
  4: { name: 'Level 4 · Voyager', grade: '≈ Kelas 6–7' },
  5: { name: 'Level 5 · Champion', grade: '≈ Kelas 7–8' }
};
