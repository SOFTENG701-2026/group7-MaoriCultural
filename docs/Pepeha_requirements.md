# Pepeha Module Requirements Analysis — Two-Level Version

## Overall Module Goal

The Pepeha module is a short sticker-collection adventure for Year 1–3 children. The learner helps Kiki complete a **practice pepeha** by collecting four pieces:

1. **Ingoa** — name
2. **Maunga** — mountain
3. **Awa** — river
4. **Whānau** — family / caring people

The module provides two learning levels:

* **Beginner Level** — for learners who are new to pepeha, te reo Māori, or Māori place-based concepts. This level focuses on simple meanings, icons, audio prompts, and guided sticker collection.
* **Confident Level** — for learners who already know some pepeha, te reo Māori, or Māori cultural concepts. This level focuses on place connection, belonging, practice examples, and respectful handling of pepeha knowledge.

The two levels are not based only on whether a learner is Māori or non-Māori. Māori learners may choose Beginner Level if they are new to pepeha, and non-Māori learners may choose Confident Level if they already have some prior knowledge. Teachers can also recommend a suitable level.

The module does **not** ask children to invent their own maunga, awa, iwi, hapū, or whakapapa. Instead, the learner chooses a fixed, teacher-reviewed Auckland school example for Kiki. The system then shows that school example’s maunga and awa. At the end, learners are reminded that their own pepeha should come from people who know their story, such as whānau, family, trusted adults, or local cultural guidance.

The experience should feel like helping Kiki, not filling in a form. Children collect stickers, add them to Kiki’s Pepeha Board, practise short lines, answer a small check, and unlock a Pepeha Badge.

---

# Page 1: Meet Kiki

## Page Purpose

Introduce Kiki, explain the mission, and let the learner choose a suitable level.

## Child-facing Content

Title:

**Pepeha Adventure**

Kiki says:

**Kia ora! I’m Kiki. Help me finish my pepeha!**

Level choice:

**Choose your adventure level:**

**Beginner Level**
**I am learning pepeha for the first time.**

**Confident Level**
**I already know some pepeha or te reo Māori.**

Mission:

**Find my name, mountain, river, and whānau.**

## Beginner Level Flow

The page shows Kiki beside an empty Pepeha Board with four missing sticker spaces:

* 👤 **Ingoa = name**
* 🏔️ **Maunga = mountain**
* 🌊 **Awa = river**
* ❤️ **Whānau = caring people**

Kiki says:

**Let’s start with my name. Ingoa means name.**

The learner taps the name sticker.

Sticker content:

👤 **Ingoa Sticker**
**Ko Kiki tōku ingoa.**
**My name is Kiki.**

## Confident Level Flow

The page shows the same Pepeha Board, but the labels appear first in te reo Māori:

* 👤 **Ingoa**
* 🏔️ **Maunga**
* 🌊 **Awa**
* ❤️ **Whānau**

Kiki says:

**Let’s begin my practice pepeha. Find the ingoa sticker.**

After the learner taps the sticker, the system shows:

**Ko Kiki tōku ingoa.**

Need help text:

**Ingoa = name**

## Visual / Interaction Design

Kiki stands beside an empty Pepeha Board. The **Ingoa** space glows first. The learner taps the name sticker and sees it move onto the board.

## Functional Requirements

* Show Kiki and an empty Pepeha Board.
* Let the learner choose Beginner Level or Confident Level.
* Save the selected level in module state.
* Show four missing sticker spaces: Ingoa, Maunga, Awa, Whānau.
* In Beginner Level, show English meanings by default.
* In Confident Level, show Māori labels first and provide meanings through **Need help**.
* Let the learner tap **Add Name Sticker**.
* After tapping, the Ingoa sticker appears on the board.
* Unlock **Start Adventure** only after the name sticker is added.
* Include **Read to me** and **Back to Map**.

## Buttons

* **Beginner Level**
* **Confident Level**
* **Add Name Sticker**
* **Start Adventure**
* **Read to me**
* **Back to Map**

## Feedback

**Ka pai! Name sticker added!**

## Reason

Starting with Kiki’s name makes the flow logical because pepeha introduces who someone is. The two-level design supports learners with different prior knowledge without assuming their cultural background.

---

# Page 2: What is a Pepeha?

## Page Purpose

Explain pepeha briefly and introduce the four key parts.

## Beginner Level Flow

Title:

**What is a Pepeha?**

Kiki says:

**A pepeha tells who we are and where we belong.**

Kiki’s notebook shows:

* 👤 **Ingoa = name**
* 🏔️ **Maunga = mountain**
* 🌊 **Awa = river**
* ❤️ **Whānau = people who care for us**

Each icon is tappable. When tapped, the system plays a short audio prompt, such as **“Ingoa, name”** or **“Awa, river.”**

Once all four words have been heard, a short listen-and-match exercise unlocks
(the same shape as Confident, but at word level):

### Exercise — Listen and match (word recognition)

Instruction:

**Listen, then tap the right picture.**

The system plays and shows one word; the learner taps the matching icon
(👤 / 🏔️ / 🌊 / ❤️). Two questions:

1. **Maunga** → tap 🏔️ (mountain)
2. **Awa** → tap 🌊 (river)

Correct tap: icon highlights with **Ka pai!**
Wrong tap: gentle wiggle and a **Listen again** hint; the learner may retry. No
score.

## Confident Level Flow

Title:

**What is a Pepeha?**

Kiki says:

**A pepeha can connect people, places, and belonging.**

Instead of single-word meanings, the Confident notebook shows each part inside a
short, complete te reo Māori sentence with light English support. The learner
taps each line to hear the full sentence and is encouraged to try saying it
(low-pressure, pronunciation is never judged):

* 👤 **Ko Kiki tōku ingoa.** — My name is Kiki.
* 🏔️ **Ko te maunga tēnei.** — This is the mountain.
* 🌊 **Ko te awa tēnei.** — This is the river.
* ❤️ **Ko tōku whānau tēnei.** — This is my whānau.

After tapping a line, it is marked **I tried** (not just “heard”). Once all four
lines have been tried, a short listen-and-match exercise unlocks.

### Exercise — Listen and match (sentence comprehension)

Instruction:

**Listen, then tap the right picture.**

The system plays and shows one full sentence; the learner taps the matching icon
(👤 / 🏔️ / 🌊 / ❤️). Two questions:

1. **Ko te maunga tēnei.** → tap 🏔️ (maunga)
2. **Ko te awa tēnei.** → tap 🌊 (awa)

Correct tap: icon highlights with **Ka pai!**
Wrong tap: gentle wiggle and a **Listen again** hint; the learner may retry. No
score.

This keeps the Confident level focused on growing te reo confidence — using the
parts inside whole sentences — rather than only longer English meanings.
Place-connection / cultural-safety questions about *which* maunga or awa to use
belong on the later school (Page 3) and maunga (Page 4) pages, not on this
introductory page. The practice sentences should be teacher-reviewed.

## Visual / Interaction Design

Use one interactive notebook. Before tapping, the notebook is closed. After tapping, it opens and shows the four icons. Each icon can be tapped for audio.

## Functional Requirements

* Show a closed notebook first.
* Open the notebook when tapped.
* Reveal the four pepeha parts with icons.
* Each icon/line must be tappable and play a short audio prompt.
* In Beginner Level, show simple Māori-English word meanings.
* In Confident Level, show each part inside a full te reo Māori sentence with
  light English support, and let the learner try saying it (mark **I tried**).
* Both levels then run the same short listen-and-match exercise (2 questions:
  maunga, awa) — Beginner plays the word, Confident plays the full sentence.
  Cultural-safety questions about which maunga/awa to use belong on Pages 3–4,
  not here.
* Keep text short.
* Unlock **Next** after the level activity is completed — all four parts heard
  (Beginner) / tried (Confident), and both listen-and-match questions correct.
* Include **Read to me** and **Back**.

## Buttons

* **Tap notebook**
* **Listen icons / sentences**
* **I tried** (Confident)
* **Listen and match** (tap the right picture)
* **Next**
* **Read to me**
* **Back**

## Reason

Beginner Level teaches the basic parts of a pepeha. Confident Level adds cultural depth by showing that pepeha is not just a vocabulary activity; it connects to real people, places, and belonging.

---

# Page 3: Choose Kiki’s School Example

## Page Purpose

Let the learner choose one fixed Auckland school example for Kiki. The school example is used as a safe practice context for Kiki’s maunga and awa.

## Beginner Level Flow

Title:

**Choose Kiki’s School**

Kiki says:

**Pick a school. We will find its mountain and river!**

Small note:

**This is Kiki’s practice example.**

School cards show Māori and English labels:

1. **Rosebank School**
   **Mountain / Maunga: Ōwairaka**
   **River / Awa: Whau**

2. **Don Buck School**
   **Mountain / Maunga: Pukewhakataratara**
   **River / Awa: Mōmutu**

3. **Glen Eden Primary School**
   **Mountain / Maunga: Waikūmete**
   **River / Awa: Waikūmete**

4. **Kauri Park School**
   **Mountain / Maunga: Rangitoto**
   **River / Awa: Kahika**

The learner taps one school profile.

## Confident Level Flow

Title:

**Choose Kiki’s Practice Example**

Kiki says:

**Choose a school example for Kiki. This is not your own pepeha.**

School cards show Māori labels first:

1. **Rosebank School**
   **Maunga: Ōwairaka**
   **Awa: Whau**

After selecting a school, the learner answers:

**Why do we use a school example for Kiki?**

Options:

1. **So Kiki can practise safely**
2. **So everyone copies Kiki**
3. **So Kiki can guess any place**

Correct answer:

**So Kiki can practise safely**

Feedback:

**Ka pai! Kiki’s example helps us learn without guessing our own pepeha.**

## Visual / Interaction Design

Show a simple Auckland map with school pins. Under the map, show large school profile buttons. The selected school glows. A small tag says:

**Practice example**

## Functional Requirements

* Show at least three school profiles.
* Each profile includes school name, maunga, and awa.
* The learner taps one school profile.
* The selected school glows.
* Save the selected school profile in module state.
* In Beginner Level, show English support beside maunga and awa.
* In Confident Level, make clear that the school profile is a practice example, not the learner’s own pepeha.
* Unlock **Find Maunga** after the required task is completed.
* Do not use AI to generate school data.
* Use fixed, teacher-reviewed school profile data.

## Buttons

* **School profile buttons**
* **Check answer**
* **Find Maunga**
* **Read to me**
* **Back**

## Feedback

Beginner Level:

**Ka pai! Kiki will learn this school example.**

Confident Level:

**Ka pai! This is a safe practice example for Kiki.**

## Reason

This page makes the module more meaningful than vocabulary learning. Beginner Level helps learners recognise school-based maunga and awa. Confident Level reinforces cultural safety by making clear that Kiki’s example should not be copied as the learner’s own pepeha.

---

# Page 4: Find the Maunga

## Page Purpose

Teach **maunga = mountain** and collect the selected school’s maunga sticker.

## Beginner Level Flow

Title:

**Find the Maunga**

Kiki says:

**Maunga means mountain. Tap the mountain!**

The learner sees three objects:

* mountain
* river
* people

If Rosebank School is selected, after the learner taps the mountain, the page shows:

**Ōwairaka**
**Ko Ōwairaka te maunga.**
**Ōwairaka is the mountain.**

Sticker:

🏔️ **Maunga Sticker**
**Ōwairaka**
**Ko Ōwairaka te maunga.**

## Confident Level Flow

Title:

**Find the Maunga**

Kiki says:

**Find the maunga for Kiki’s school example.**

After tapping the mountain, the page shows:

**Ko Ōwairaka te maunga.**

Short check:

**Why does Kiki use this maunga?**

Options:

1. **It belongs to this practice school example**
2. **It is the tallest mountain**
3. **Kiki picked it randomly**

Correct answer:

**It belongs to this practice school example**

Feedback:

**Ka pai! Maunga should not be guessed.**

## Visual / Interaction Design

Show a small cartoon landscape with three tappable objects:

* mountain
* river
* people

The learner taps the mountain. After the correct tap, the maunga name appears with a sticker.

## Functional Requirements

* Show mountain, river, and people images.
* The learner taps the mountain image.
* Wrong taps give a short hint.
* Correct tap reveals the selected school’s maunga.
* In Beginner Level, focus on recognising maunga as mountain.
* In Confident Level, focus on why maunga should come from a reviewed practice example, not guessing.
* Show a Maunga Sticker.
* Add the sticker to the board after tapping **Add Sticker**.
* Unlock **Find Awa** after sticker is added.
* Include **Listen**, **Need help?**, and **Read to me**.

## Buttons

* **Mountain image**
* **Listen**
* **Need help?**
* **Check answer**
* **Add Sticker**
* **Find Awa**
* **Read to me**

## Feedback

Correct tap:

**You found it!**

After adding:

**Maunga sticker added!**

Wrong tap:

**Try again. Maunga means mountain.**

## Reason

Beginner Level teaches the visual meaning of maunga. Confident Level gives a more meaningful challenge by showing that maunga is connected to real place knowledge and should not be randomly chosen.

---

# Page 5: Find the Awa

## Page Purpose

Teach **awa = river** and collect the selected school’s awa sticker.

## Beginner Level Flow

Title:

**Find the Awa**

Kiki says:

**Awa means river. Follow the water!**

If Rosebank School is selected, after the learner taps the river, the page shows:

**Whau**
**Ko Whau te awa.**
**Whau is the river.**

Sticker:

🌊 **Awa Sticker**
**Whau**
**Ko Whau te awa.**

## Confident Level Flow

Title:

**Find the Awa**

Kiki says:

**Find the awa for Kiki’s school example.**

After tapping the river, the page shows:

**Ko Whau te awa.**

Short check:

**What should Kiki remember about awa in pepeha?**

Options:

1. **Awa connects to place**
2. **Awa means any water**
3. **Awa should be guessed**

Correct answer:

**Awa connects to place**

Feedback:

**Ka pai! Awa is part of place connection.**

## Visual / Interaction Design

Show a blue river path with Kiki near the water. The learner taps the river or water drop.

## Functional Requirements

* Show a clear river or water image.
* The learner taps the river or water icon.
* Wrong taps give a short hint.
* Correct tap reveals the selected school’s awa.
* In Beginner Level, focus on recognising awa as river.
* In Confident Level, focus on awa as place connection.
* Show an Awa Sticker.
* Add the sticker to the board after tapping **Add Sticker**.
* Unlock **Whānau Circle** after sticker is added.
* Include **Listen**, **Need help?**, and **Read to me**.

## Buttons

* **River / water image**
* **Listen**
* **Need help?**
* **Check answer**
* **Add Sticker**
* **Whānau Circle**
* **Read to me**

## Feedback

Correct tap:

**You found the awa!**

After adding:

**Awa sticker added!**

Wrong tap:

**Try again. Awa means river.**

## Reason

The awa page repeats the successful sticker pattern but uses a different visual scene. Confident Level adds cultural depth by focusing on place connection rather than only word recognition.

---

# Page 6: Whānau Circle Stickers

## Page Purpose

Teach **whānau** as family, extended family, or people who help us belong, without collecting private family details.

## Beginner Level Flow

Title:

**Kiki’s Whānau Circle**

Kiki says:

**Whānau means people who care for us.**

The learner chooses 2–3 stickers:

* ❤️ **My whānau**
* 👩‍🏫 **My teacher**
* 🧒 **My classmates**
* 😊 **My friends**

Selected stickers move into Kiki’s circle.

Generated board piece:

❤️ **Whānau Piece**
**Whānau helps Kiki belong.**

## Confident Level Flow

Title:

**Kiki’s Whānau Circle**

Kiki says:

**Whānau can help people know their story.**

The learner chooses 2–3 stickers:

* ❤️ **Whānau**
* 🧑‍🤝‍🧑 **People who know Kiki**
* 😊 **People who care**
* 🏫 **School community**

After choosing, the learner answers:

**Who can help with your own pepeha?**

Options:

1. **People who know your story**
2. **A random app**
3. **Kiki’s example**

Correct answer:

**People who know your story**

Feedback:

**Ka pai! Your own pepeha should come from people who know your connections.**

Generated board piece:

❤️ **Whānau Piece**
**Whānau helps Kiki belong.**

## Visual / Interaction Design

Kiki stands inside a warm circle. Around Kiki are round stickers. The learner taps 2–3 stickers. Selected stickers move into Kiki’s circle or glow.

## Functional Requirements

* Show Kiki in a belonging circle.
* Show at least four selectable whānau stickers.
* Allow the learner to choose 2–3 stickers.
* Selected stickers move into the circle or glow.
* Unlock **Add to Board** after at least two stickers are selected.
* In Beginner Level, focus on caring people.
* In Confident Level, focus on whānau knowledge and people who know someone’s story.
* Do not ask the learner to type family names.
* Do not collect private family information.
* Save selected sticker labels as Kiki’s support circle.
* Include **Clear**, **Read to me**, and **Add to Board**.

## Buttons

* **Whānau sticker buttons**
* **Clear**
* **Check answer**
* **Add to Board**
* **Read to me**
* **Next**

## Feedback

After one sticker:

**Nice choice!**

After enough stickers:

**Kiki’s circle is growing!**

After adding:

**Whānau piece added!**

## Reason

This page teaches belonging visually and avoids collecting private family information. Confident Level gives a stronger cultural safety message by showing that a real pepeha should be supported by people who know the learner’s story.

---

# Page 7: Kiki’s Pepeha Board

## Page Purpose

Combine all collected pieces into one completed practice pepeha.

## Beginner Level Flow

Title:

**Kiki’s Pepeha Board**

Kiki says:

**You found all my pieces!**

The board shows each line with English support:

1. 👤 **Ingoa**
   **Ko Kiki tōku ingoa.**
   **My name is Kiki.**

2. 🏔️ **Maunga**
   **Ko Ōwairaka te maunga.**
   **Ōwairaka is the mountain.**

3. 🌊 **Awa**
   **Ko Whau te awa.**
   **Whau is the river.**

4. ❤️ **Whānau**
   **Whānau helps Kiki belong.**

Reminder:

**Ask people who know your story for your own pepeha.**

## Confident Level Flow

Title:

**Kiki’s Pepeha Board**

Kiki says:

**You completed Kiki’s practice pepeha.**

The board shows the pepeha lines first:

1. **Ko Kiki tōku ingoa.**
2. **Ko Ōwairaka te maunga.**
3. **Ko Whau te awa.**
4. **Whānau helps Kiki belong.**

Small label:

**Practice example**

The learner can tap **Show meaning** to reveal English support.

Short check:

**What is the safest thing to do before making your own pepeha?**

Options:

1. **Talk with people who know your connections**
2. **Copy Kiki’s board**
3. **Choose the prettiest places**

Correct answer:

**Talk with people who know your connections**

Feedback:

**Ka pai! Kiki’s board is for practice. Your own pepeha may be different.**

## Visual / Interaction Design

The board looks like a scrapbook or sticker board. The selected school is shown only as context:

**School example: Rosebank School**

## Functional Requirements

* Show all four collected pieces.
* Show selected school name as context.
* Clearly label Kiki’s board as a practice example.
* In Beginner Level, show English meanings by default.
* In Confident Level, show English meanings through a **Show meaning** button.
* In Confident Level, include one short cultural safety check.
* Each piece has a **Listen** button.
* Do not present Kiki’s example as the child’s own pepeha.
* Include **Practise with Kiki**, **Choose another school**, and **Read to me**.

## Buttons

* **Listen**
* **Show meaning**
* **Check answer**
* **Practise with Kiki**
* **Choose another school**
* **Read to me**
* **Back**

## Feedback

**Pepeha Board complete!**

## Reason

This page lets children see the result of their own actions. Beginner Level supports understanding. Confident Level reinforces the difference between a safe practice example and a learner’s personal pepeha.

---

# Page 8: Practise with Kiki

## Page Purpose

Let learners practise Kiki’s practice pepeha one line at a time.

## Beginner Level Flow

Title:

**Practise with Kiki**

Instruction:

**Listen. Say it. Tap “I tried”.**

Practice lines:

1. **Ko Kiki tōku ingoa.**
2. **Ko Ōwairaka te maunga.**
3. **Ko Whau te awa.**
4. **Whānau helps Kiki belong.**

The learner taps:

* **Listen**
* **I tried**
* **Next line**

The system rewards participation and does not judge pronunciation.

## Confident Level Flow

Title:

**Practise with Kiki**

Instruction:

**Practise Kiki’s example. Then choose what is true.**

The learner practises the four lines with less visible English support.

After practice, the learner answers:

**This pepeha is...**

Options:

1. **Kiki’s practice example**
2. **Everyone’s pepeha**
3. **The learner’s real pepeha**

Correct answer:

**Kiki’s practice example**

Feedback:

**Ka pai! We can practise with Kiki, but our own pepeha needs our own connections.**

## Functional Requirements

* Show one line at a time.
* Provide **Listen** for the current line.
* Provide **I tried** for low-pressure practice.
* Unlock **Next line** only after **I tried**.
* In Beginner Level, always show simple hints.
* In Confident Level, reduce visible English support and include a short cultural safety check.
* Do not require microphone access in MVP.
* Do not judge accent or perfect pronunciation.
* Include **Read to me**.

## Buttons

* **Listen**
* **I tried**
* **Need help?**
* **Next line**
* **Check answer**
* **Read to me**
* **Back to Board**

## Need Help Examples

* **Start with “Ko”.**
* **Say the place name slowly.**
* **Awa means river.**
* **This is Kiki’s practice example.**

## Feedback

After each line:

**Ka pai! You practised this line.**

After all lines:

**Great! You practised Kiki’s pepeha.**

## Reason

The page supports practice without pressure. Confident Level avoids making sentence ordering the main challenge and instead reinforces respectful understanding of practice examples.

---

# Page 9: Help Kiki Remember

## Page Purpose

Check understanding through a simple sticker game, not a formal test.

## Beginner Level Flow

Title:

**Help Kiki Remember**

Instruction:

**Tap the right sticker.**

Questions:

1. **Which one is the maunga?**
   Options: Ōwairaka / Whau / Kiki / Whānau

2. **Which one is the awa?**
   Options: Whau / Ōwairaka / Kiki / Whānau

3. **What is whānau?**
   Options: Caring people / Mountain / River / Backpack

4. **For your own pepeha, what should you do?**
   Options: Ask people who know your story / Guess any mountain / Copy Kiki

## Confident Level Flow

Title:

**Help Kiki Remember**

Instruction:

**Choose the best answer.**

Questions:

1. **Why should Kiki not invent a maunga?**
   Options:

    * Pepeha should connect to real place knowledge
    * Any mountain is fine
    * The tallest mountain is always correct
      Correct answer: **Pepeha should connect to real place knowledge**

2. **Why is whānau important?**
   Options:

    * Whānau can help people know their story
    * Whānau means river
    * Whānau means a school bag
      Correct answer: **Whānau can help people know their story**

3. **If a learner already knows their own pepeha, what can they do?**
   Options:

    * Share it only if they want to and if it is okay
    * Type it into every app
    * Replace Kiki’s example for everyone
      Correct answer: **Share it only if they want to and if it is okay**

4. **What is Kiki’s board?**
   Options:

    * A practice example
    * Everyone’s real pepeha
    * A random place list
      Correct answer: **A practice example**

## Visual / Interaction Design

Use sticker-style answer buttons. Correct stickers jump into Kiki’s backpack. Wrong stickers wiggle and return.

## Functional Requirements

* Show one question at a time.
* Use sticker-style answer choices.
* In Beginner Level, use simple recognition questions.
* In Confident Level, use cultural safety and place-connection questions.
* Correct answer unlocks the next question.
* Wrong answer gives a hint and allows retry.
* No score, grade, or ranking.
* Include **Read to me** and **Need help?**.
* Confident Level must include an option for learners who already know their own pepeha, without forcing them to share it.

## Buttons

* **Answer stickers**
* **Need help?**
* **Read to me**
* **Next**
* **Finish**

## Feedback

Correct:

**Ka pai!**

Wrong:

**Try again. Look at Kiki’s board.**

Final correct answer:

**Āe! Pepeha should be handled with care.**

## Reason

This checks learning while keeping the activity playful. Beginner Level checks basic meaning. Confident Level checks respectful understanding, including privacy, place connection, and the difference between Kiki’s example and the learner’s own pepeha.

---

# Page 10: Reward Page

## Page Purpose

Celebrate completion and connect the digital activity back to real classroom or whānau learning.

## Beginner Level Flow

Title:

**Pepeha Complete!**

Kiki says:

**Ka pai! You helped me finish my pepeha.**

Summary:

**You learned:**

* 👤 **Ingoa = name**
* 🏔️ **Maunga = mountain**
* 🌊 **Awa = river**
* ❤️ **Whānau = caring people**

Reward:

**Pepeha Explorer Badge unlocked!**

Reminder:

**Ask people who know your story about your own pepeha.**

## Confident Level Flow

Title:

**Pepeha Complete!**

Kiki says:

**Ka pai! You helped me practise pepeha with care.**

Summary:

**You practised:**

* using a **practice example**;
* noticing **place connection**;
* understanding that maunga and awa should not be guessed;
* respecting that personal pepeha can be private;
* remembering that your own pepeha should come from your own connections.

Reward:

**Pepeha Navigator Badge unlocked!**

Final reminder:

**Your own pepeha belongs to your story. Share it only when it feels right and is okay.**

## Visual / Interaction Design

Kiki holds the completed Pepeha Board. A Pepeha Badge appears with mountain, river, and heart symbols.

## Functional Requirements

* Show completion message.
* Show Pepeha Badge.
* Beginner Level unlocks a **Pepeha Explorer Badge**.
* Confident Level unlocks a **Pepeha Navigator Badge**.
* Badge names should not suggest that one learner is better than another.
* In Beginner Level, summarise four learned concepts.
* In Confident Level, summarise practice example, place connection, privacy, and cultural care.
* Mark Pepeha module as complete.
* Add badge to global Rewards panel.
* Include **Back to Map**, **Try another school**, **Read to me**, and **Show Badge**.

## Buttons

* **Back to Map**
* **Try another school**
* **Read to me**
* **Show Badge**

## Feedback

Beginner Level:

**Pepeha Explorer Badge unlocked!**

Confident Level:

**Pepeha Navigator Badge unlocked!**

## Reason

The reward reinforces effort and completion, not competition. Beginner Level celebrates learning the basic parts of pepeha. Confident Level celebrates thoughtful and respectful handling of pepeha knowledge.

---

# Shared Requirements

## Level Design

The module should provide two levels:

* **Beginner Level**
* **Confident Level**

The learner can choose a level at the start, or the teacher can recommend one. The system should not assume the learner’s level based only on whether they are Māori or non-Māori.

## Beginner Level Characteristics

Beginner Level should include:

* simple Māori-English meanings;
* more icons and visual hints;
* direct recognition tasks;
* audio support on every page;
* low-pressure practice;
* no complex cultural reasoning questions;
* gentle retry feedback;
* no formal scoring.

## Confident Level Characteristics

Confident Level should include:

* more focus on place connection and belonging;
* clear distinction between Kiki’s practice example and the learner’s own pepeha;
* more realistic wrong answers;
* questions about why maunga and awa should not be guessed;
* respectful handling of learners who may already know their own pepeha;
* privacy-sensitive choices;
* help options so learners are not blocked.

## Accessibility

* Every page includes **Read to me**.
* Text is short and large.
* Buttons are large and easy to tap.
* Icons support understanding without reading.
* Sound on/off should be available.
* High contrast and larger text should be supported if possible.
* Confident Level should still include help options.

## Cultural Safety

* Do not ask learners to invent their own maunga or awa.
* Do not ask learners to type iwi, hapū, whakapapa, or private family details.
* Clearly label Kiki’s pepeha as a practice example.
* Remind learners that their own pepeha should come from people who know their story.
* Allow learners who already know their own pepeha to keep it private.
* Do not require learners to share personal pepeha information.
* Use official or teacher-reviewed school profile data.
* Do not let AI generate maunga, awa, whānau, iwi, hapū, whakapapa, or identity content.
* Beginner Level must not be labelled as only for non-Māori learners.
* Confident Level must not be labelled as only for Māori learners.
* The app must not present itself as a cultural authority.

## AI Decision

The MVP should **not** use generative AI to create pepeha content.

Reason:

Pepeha involves identity, place, family knowledge, and cultural connection. Open-ended AI may invent incorrect or inappropriate pepeha content. The MVP should use fixed, reviewed school examples and safe feedback.

Possible future AI use:

* pronunciation support;
* speech-to-text attempt detection;
* teacher-side draft support using approved content.

AI should not:

* generate pepeha lines freely;
* assign a child a maunga or awa;
* invent whānau, iwi, hapū, or whakapapa;
* ask children to reveal private family information;
* replace whānau, family, teacher, or local cultural guidance.

## Implementation Notes

Use fixed school profile data. The selected profile controls later maunga and awa content.

Example:

```js
const schoolProfiles = [
  {
    id: "rosebank",
    schoolName: "Rosebank School",
    area: "Avondale, Auckland",
    maunga: "Ōwairaka",
    awa: "Whau",
    maungaLine: "Ko Ōwairaka te maunga.",
    awaLine: "Ko Whau te awa."
  }
];
```

The selected level should also be saved:

```js
const learnerState = {
  level: "beginner", // or "confident"
  selectedSchoolId: "rosebank",
  collectedStickers: ["ingoa", "maunga", "awa", "whanau"]
};
```

The interface should use the selected level to control:

* amount of English support;
* type of questions;
* feedback messages;
* whether cultural safety checks are shown;
* badge type.

## Summary

This two-level Pepeha module supports learners with different prior knowledge. Beginner Level helps learners understand the basic parts of pepeha through simple meanings, stickers, audio prompts, and guided practice. Confident Level provides deeper cultural differentiation by focusing on place connection, practice examples, privacy, and respectful handling of pepeha knowledge.

This allows the module to support Māori and non-Māori learners respectfully without assuming a learner’s ability or cultural knowledge based only on identity.
