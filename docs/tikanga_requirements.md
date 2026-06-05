# Tikanga Module Requirements Analysis — Two-Level Version

## 1. Overall Module Goal

The Tikanga module is designed for Year 1–3 children. Its goal is to help children understand respectful behaviour in a Māori cultural context through a short interactive story.

The story is: **Kiki is visiting a marae with his class for the first time**. Kiki is not sure what to do in each part of the visit, so the learner helps him make respectful choices. After each scene is completed, the matching location on the **Marae Visit Map** lights up. At the end, the learner earns a Tikanga Badge.

The module provides two learning levels:

* **Beginner Level** — for learners who are new to tikanga, marae, or Māori cultural practices. This level uses simple English support, clear icons, audio prompts, and direct respectful-behaviour choices.
* **Confident Level** — for learners who have seen or learned some marae tikanga before. This level introduces a few simple Māori terms, uses more realistic choices, and asks learners to think about people, place, and context.

The two levels are not based only on whether a learner is Māori or non-Māori. Māori learners may choose Beginner Level if they are new to these concepts, and non-Māori learners may choose Confident Level if they already have some prior knowledge. Teachers can also recommend a suitable level for each learner.

This module does not teach the full pōwhiri process or all marae protocol. It only teaches safe respectful behaviours and reminds children that, in real life, tikanga can depend on the people, place, and local guidance.

---

## 2. Learning Outcomes

By the end of the Tikanga module, children should be able to:

* understand that **tikanga** means respectful ways of doing things;
* understand that a **marae** is a special Māori meeting place;
* understand that visitors should stay with the group and follow the people leading the visit;
* understand that before a greeting or hongi, they should watch, wait, and follow guidance;
* identify calm and respectful behaviours inside a wharenui / meeting space;
* choose respectful behaviours around kai and caring for the place;
* understand that tikanga may differ depending on people, place, and context.

In **Beginner Level**, learners mainly recognise respectful behaviours through pictures, simple words, audio prompts, and direct feedback.

In **Confident Level**, learners choose the best action in more realistic situations and connect simple Māori concepts to practical behaviour.

---

# Page 1: Start Page — Kiki’s First Marae Visit

## Page Purpose

Introduce the story, show that Kiki is visiting a marae, and let the learner choose a suitable learning level.

## Child-facing Content

Title:

**Kiki’s First Marae Visit**

Kiki says:

**Kia ora! I am visiting a marae. Help me make respectful choices.**

Short explanation:

**Marae = a special Māori meeting place.**

Level choice:

**Choose your visit level:**

**Beginner Level**
**I am learning about marae and tikanga for the first time.**

**Confident Level**
**I have seen or learned some marae tikanga before.**

Task text:

**Help Kiki light up the visit map.**

## Beginner Level Flow

The page shows Kiki and his class standing outside a marae entrance. The **Marae Visit Map** shows four grey stations:

* Entrance
* Welcome Area
* Wharenui
* Kai Area

Kiki says:

**We will visit one place at a time. Listen, watch, stay calm, and care.**

The learner chooses Beginner Level and taps **Start Visit**.

## Confident Level Flow

The page shows the same map. The map labels remain short, but the page introduces one Māori term:

**Manuhiri = visitors**

Kiki says:

**I am visiting as manuhiri. Help me follow tikanga.**

The learner chooses Confident Level and taps **Start Visit**.

## Image / Visual Design

The page shows:

* Kiki and his class standing outside a marae entrance;
* a simplified cartoon marae-style background;
* a small **Marae Visit Map** in the corner with four grey stations:

  * Entrance
  * Welcome Area
  * Wharenui
  * Kai Area

## Buttons

* **Beginner Level**
* **Confident Level**
* **Start Visit**
* **Read to me**
* **Back to Map**

## Animation / Implementation

* Kiki can gently wave using a simple CSS bounce or image swap.
* The four map stations can briefly pulse to show that they will be completed later.
* Complex animation is not required. Static images with simple glow effects are enough for the MVP.

## Functional Requirements

* The page must show that Kiki is visiting a marae.
* The page must explain marae in one short sentence.
* The learner must choose Beginner Level or Confident Level.
* The selected level must be saved in module state.
* The page must show four incomplete map stations.
* Beginner Level must use simple English support.
* Confident Level must introduce **manuhiri** with a short meaning.
* Text must be short and easy for young children to understand.

## Reason

Young children need to understand the story mission before learning details. Starting with a level choice allows learners with different prior knowledge to receive suitable support without assuming their level based on identity.

---

# Page 2: What is Tikanga?

## Page Purpose

Explain tikanga in a simple way and preview the behaviours that will be practised during the marae visit.

## Beginner Level Flow

Title:

**What is Tikanga?**

Kiki says:

**Tikanga means respectful ways of doing things.**

Four behaviour icons appear:

* 👂 **Listen first**
* 👀 **Watch and wait**
* 🏠 **Stay calm inside**
* 🍽️🌿 **Share kai and care**

Each icon is tappable. When the learner taps an icon, the system plays the matching short audio prompt, such as **“Listen first”** or **“Watch and wait.”**

The **Next: Entrance** button unlocks after the learner has tapped or listened to the four icons.

## Confident Level Flow

Title:

**What is Tikanga?**

Kiki says:

**Tikanga means respectful ways of doing things. Tikanga can be different in different places.**

Four behaviour icons appear:

* 👂 **Listen**
* 👀 **Watch**
* 🏠 **Respect**
* 🌿 **Care**

Each icon is tappable and plays the matching short audio prompt.

Then the learner answers:

**If this marae does things differently, what should Kiki do?**

Options:

1. **Watch the tangata whenua**
2. **Do what he did last time**
3. **Choose by himself**

Correct answer:

**Watch the tangata whenua**

Feedback:

**Ka pai. Follow the local guidance.**

Need help text:

**Tangata whenua = local people / hosts**

## Image / Visual Design

The page shows Kiki opening the Marae Visit Map. Four icons appear around the map. Each icon should be large, clear, and easy to tap.

## Buttons

* **Icon buttons**
* **Check answer**
* **Next: Entrance**
* **Read to me**
* **Back**

## Animation / Implementation

* The four icons can fade in one by one.
* When tapped, each icon can slightly enlarge and return to normal.
* These can be implemented with simple CSS transitions.

## Functional Requirements

* The page must show one short definition of tikanga.
* Beginner Level must use simple behaviour labels.
* Confident Level must show that tikanga can depend on people, place, and context.
* Each icon must be tappable and play the matching short audio prompt.
* The page must not say that the learner taps icons to “hear the meaning” if the actual feature is only audio prompts.
* In Beginner Level, **Next** unlocks after the learner taps or listens to the four icons.
* In Confident Level, **Next** unlocks after the learner answers the short contextual question.
* The page must avoid long explanations.

## Reason

This page gives children the minimum knowledge they need before entering the story. Beginner Level focuses on simple behaviour recognition. Confident Level adds cultural depth by showing that tikanga is not just one fixed rule everywhere.

---

# Page 3: Station 1 — Entrance

## Page Purpose

Teach children that when arriving at a marae, Kiki should stay with the group and follow the people leading the visit.

## Beginner Level Flow

Station title:

**Entrance**

Kiki asks:

**We are arriving. What should I do first?**

Options:

1. 👂 **Listen to the guide**
2. 🏃 **Run inside**
3. 📢 **Shout loudly**

Correct answer:

**Listen to the guide**

Correct feedback:

**Ka pai! Listening first shows respect.**

## Confident Level Flow

Station title:

**Entrance**

Kiki asks:

**Kiki is manuhiri. What should he do first?**

Options:

1. 👂 **Stay with the group**
2. 🚶 **Walk ahead**
3. 🗣️ **Lead the class**

Correct answer:

**Stay with the group**

Correct feedback:

**Ka pai! Manuhiri wait and listen.**

Need help text:

**Manuhiri = visitors**

## Image / Visual Design

The scene shows:

* Kiki and classmates outside the entrance;
* an adult, host, or guide speaking;
* Kiki looking unsure;
* three large picture buttons below the scene.

The map corner shows Station 1. It is grey before the correct answer and lights up after the learner completes the station.

## Buttons

* **Listen to the guide**
* **Stay with the group**
* **Run inside / Walk ahead**
* **Shout loudly / Lead the class**
* **Need help?**
* **Read to me**
* **Next: Welcome Area**

## Incorrect Choice Feedback

Beginner Level:

If the learner chooses **Run inside**:

**Try again. We listen before going in.**

If the learner chooses **Shout loudly**:

**Try again. Quiet listening shows respect.**

Confident Level:

If the learner chooses **Walk ahead**:

**Try again. Kiki should stay with the group.**

If the learner chooses **Lead the class**:

**Try again. Even if Kiki has visited before, he should follow the people leading this visit.**

If the learner chooses incorrectly a second time:

**Look for the choice that keeps Kiki with the group.**

The correct answer softly glows. There is no score penalty and no red cross.

## Animation / Implementation

* Incorrect buttons use a CSS shake effect.
* Correct answers use a glow highlight.
* Station 1 changes from grey to bright using a CSS class.
* Kiki’s expression can switch between neutral, confused, and happy images.

## Functional Requirements

* The page must show one clear question and three choices.
* Beginner Level must focus on basic listening behaviour.
* Confident Level must focus on the visitor role and staying with the group.
* Confident Level wrong answers should be realistic, not only obviously naughty.
* Incorrect choices must give specific feedback.
* Station 1 must light up after the required task is completed.
* **Next** must only appear or unlock after the station is completed.
* The page must include **Read to me** and **Need help?**.

## Reason

“Listen first” and “stay with the group” are safe and practical behaviours for young children. Confident Level adds cultural context by introducing Kiki as manuhiri without making the text too heavy.

---

# Page 4: Station 2 — Outside Welcome Area

## Page Purpose

Teach children that before a greeting, Kiki should watch, wait, and follow guidance. This page may mention hongi, but it must not ask children to physically imitate it.

## Beginner Level Flow

Station title:

**Outside Welcome Area**

Short note:

**Some people may greet with a hongi. Watch and follow guidance.**

Kiki asks:

**Before greeting, what should I do?**

Options:

1. 👀 **Watch and wait**
2. 🤝 **Rush in**
3. 😂 **Make fun**

Correct answer:

**Watch and wait**

After the correct answer, a second-step button appears:

**Greet gently if invited**

Final feedback:

**Ka pai! Watch, wait, and greet with respect.**

## Confident Level Flow

Station title:

**Outside Welcome Area**

Short note:

**Kiki has seen a hongi before. He still needs to watch and wait.**

Kiki asks:

**What should Kiki do now?**

Options:

1. 👀 **Watch and wait**
2. 🤝 **Copy it now**
3. 🙂 **Practise with a friend**

Correct answer:

**Watch and wait**

After the correct answer, a second-step button appears:

**Greet if invited**

Final feedback:

**Ka pai! Kiki waited for guidance.**

## Image / Visual Design

The scene shows:

* people greeting respectfully in the background;
* an adult, host, or guide nearby;
* Kiki and classmates waiting;
* simple greeting imagery or silhouettes, not detailed physical instruction.

## Buttons

* **Watch and wait**
* **Rush in / Copy it now**
* **Make fun / Practise with a friend**
* **Greet gently if invited**
* **Greet if invited**
* **Need help?**
* **Read to me**
* **Next: Wharenui**

## Incorrect Choice Feedback

Beginner Level:

If the learner chooses **Rush in**:

**Try again. We do not rush into a greeting.**

If the learner chooses **Make fun**:

**Try again. A greeting needs respect.**

Confident Level:

If the learner chooses **Copy it now**:

**Try again. Seeing something before does not mean Kiki should copy it by himself.**

If the learner chooses **Practise with a friend**:

**Try again. A greeting should be done with guidance and respect.**

If the learner chooses incorrectly a second time:

**Look for the choice that says watch and wait.**

## Animation / Implementation

* After the correct answer, Kiki changes from unsure to calmly waiting.
* The second-step button fades in.
* Station 2 lights up after the second step.
* This can be implemented with conditional rendering and CSS fade-in.

## Functional Requirements

* The page must briefly explain hongi awareness.
* The system must not ask children to physically imitate hongi.
* Beginner Level must use direct behaviour choices.
* Confident Level must show that previous experience does not replace current guidance.
* The correct flow must include watching and waiting before greeting.
* Station 2 lights up only after the required actions are completed.
* Incorrect choices must give specific feedback.
* The visual design must not provide detailed physical instruction for hongi.

## Reason

This page keeps a Māori greeting context, but the focus is on observation, waiting, and following guidance. Confident Level gives a more realistic challenge because a child may have seen hongi before but still needs to follow the current context.

---

# Page 5: Station 3 — Wharenui / Meeting Space

## Page Purpose

Teach children that inside a wharenui or special meeting space, Kiki should stay calm, listen respectfully, and care for the space.

## Beginner Level Flow

Station title:

**Wharenui**

Short explanation:

**Wharenui = meeting house / special meeting space.**

Kiki asks:

**Inside, what shows respect?**

The learner must find two respectful behaviours.

Correct behaviours:

* 👂 **Sit and listen**
* 👀 **Watch the speaker**

Incorrect behaviours:

* 🏃 **Run around**
* 🍪 **Eat inside**
* 🪑 **Climb on furniture**

Correct feedback:

**Ka pai! Calm body, listening ears.**

## Confident Level Flow

Station title:

**Wharenui**

Short explanation:

**Wharenui = special meeting space.**

Kiki asks:

**Inside the wharenui, choose two respectful actions.**

Correct behaviours:

* 👂 **Sit and listen**
* 👀 **Watch the speaker**

More realistic incorrect behaviours:

* 📸 **Take photos**
* ✋ **Touch carvings**
* 🎒 **Put bags anywhere**

Correct feedback:

**Ka pai! Calm body, careful hands.**

Need help text:

**Look respectfully. Keep hands to yourself. Follow the group.**

## Image / Visual Design

The scene shows a simplified wharenui-style room:

* a speaker;
* people sitting calmly;
* several clickable behaviour hotspots;
* Māori-inspired patterns in the background, without copying detailed real wharenui designs.

## Buttons / Hotspots

Beginner Level:

* **Sit and listen**
* **Watch the speaker**
* **Run around**
* **Eat inside**
* **Climb on furniture**

Confident Level:

* **Sit and listen**
* **Watch the speaker**
* **Take photos**
* **Touch carvings**
* **Put bags anywhere**

Common buttons:

* **Need help?**
* **Read to me**
* **Next: Kai Area**

## Incorrect Choice Feedback

Beginner Level:

If the learner clicks **Run around**:

**Try again. Running inside can disturb others.**

If the learner clicks **Eat inside**:

**Try again. Kai belongs in the right place.**

If the learner clicks **Climb on furniture**:

**Try again. We look after special places.**

Confident Level:

If the learner clicks **Take photos**:

**Try again. Kiki should not take photos unless the group is told it is okay.**

If the learner clicks **Touch carvings**:

**Try again. Looking respectfully is safer than touching.**

If the learner clicks **Put bags anywhere**:

**Try again. Kiki should follow where the group puts their things.**

If the learner chooses incorrectly a second time:

**Inside, calm body and careful hands help.**

Correct hotspots softly glow.

## Animation / Implementation

* Correct hotspots glow.
* Incorrect hotspots shake.
* Progress displays 0/2, 1/2, 2/2.
* Station 3 lights up after completion.
* This can be implemented with component state and CSS classes.

## Functional Requirements

* The page must show five clickable behaviours.
* The learner must select two correct behaviours.
* Correct behaviours must remain highlighted.
* Incorrect behaviours must give specific feedback.
* Confident Level incorrect options must be practical and believable.
* Station 3 lights up only after both correct behaviours are selected.
* The page must include **Read to me** and **Need help?**.

## Reason

This page uses scene-based learning rather than a normal multiple-choice question. Beginner Level teaches clear calm behaviour. Confident Level uses more realistic mistakes children might actually make, such as taking photos, touching objects, or putting bags in the wrong place.

---

# Page 6: Station 4 — Wharekai / Kai and Care

## Page Purpose

Teach children that at kai time, Kiki should wait, share, say thank you, and care for the place safely.

## Beginner Level Flow

Station title:

**Kai and Care**

Short explanation:

**Kai = food.**

### Step 1: Kai Time

Kiki asks:

**It is kai time. What should I do?**

Options:

1. 🍽️ **Wait and say thank you**
2. 🏃 **Push in**
3. 🍰 **Take all the kai**

Correct answer:

**Wait and say thank you**

### Step 2: After Kai

Kiki asks:

**After kai, how can I care for this place?**

Options:

1. 🌿 **Tell an adult or tidy safely**
2. 🗑️ **Leave rubbish**
3. 👟 **Step on plants**

Correct answer:

**Tell an adult or tidy safely**

Final feedback:

**Ka pai! You cared for people and place.**

## Confident Level Flow

Station title:

**Kai and Care**

Short support text:

**Manaakitanga = care for people.**
**Kaitiakitanga = care for place.**

### Step 1: Kai Time

Kiki asks:

**What shows manaakitanga?**

Options:

1. 🍽️ **Wait and share**
2. 🍰 **Take favourite food first**
3. 🧃 **Eat before others**

Correct answer:

**Wait and share**

Feedback:

**Ka pai! You cared for people.**

### Step 2: After Kai

Kiki asks:

**What shows kaitiakitanga?**

Options:

1. 🌿 **Tidy safely**
2. 🪑 **Move things without asking**
3. 🗑️ **Leave rubbish**

Correct answer:

**Tidy safely**

Feedback:

**Ka pai! You cared for the place.**

## Image / Visual Design

The page has two scene states.

**State 1: Kai time**

* Kiki is near a kai table;
* classmates are waiting;
* Kiki wants to eat but needs to choose the respectful action.

**State 2: After kai**

* there is a small rubbish item or messy area;
* there are plants nearby;
* Kiki needs to choose a safe way to care for the place.

After Step 1 is correct, the page fades into Step 2.

## Buttons

Beginner Step 1:

* **Wait and say thank you**
* **Push in**
* **Take all the kai**

Beginner Step 2:

* **Tell an adult or tidy safely**
* **Leave rubbish**
* **Step on plants**

Confident Step 1:

* **Wait and share**
* **Take favourite food first**
* **Eat before others**

Confident Step 2:

* **Tidy safely**
* **Move things without asking**
* **Leave rubbish**

Common buttons:

* **Need help?**
* **Read to me**
* **Next: Map Complete**

## Incorrect Choice Feedback

Beginner Level:

If the learner chooses **Push in**:

**Try again. Pushing is not fair to others.**

If the learner chooses **Take all the kai**:

**Try again. Sharing kai is kind.**

If the learner chooses **Leave rubbish**:

**Try again. We care for this place.**

If the learner chooses **Step on plants**:

**Try again. Plants need care too.**

Confident Level:

If the learner chooses **Take favourite food first**:

**Try again. Manaakitanga means thinking about others too.**

If the learner chooses **Eat before others**:

**Try again. Wait until it is time to eat.**

If the learner chooses **Move things without asking**:

**Try again. Helping is good, but Kiki should not move things unless it is okay.**

If the learner chooses **Leave rubbish**:

**Try again. Visitors can still help care for the place.**

If the learner chooses incorrectly again:

**Look for the safe caring choice.**

## Animation / Implementation

* Step 1 to Step 2 uses a fade transition.
* Correct answers make Kiki smile.
* Incorrect answers shake.
* Station 4 lights up after Step 2.
* This can be implemented with conditional rendering.

## Functional Requirements

* The page must include two short steps.
* Beginner Level must teach waiting, saying thank you, and safe care.
* Confident Level must introduce **manaakitanga** and **kaitiakitanga** through short practical actions.
* Each Māori term must have a short meaning.
* Incorrect answers must give specific hints.
* Step 2 can only appear after Step 1 is correct.
* Station 4 lights up only after both steps are completed.
* The page must not ask children to handle unsafe tasks alone.
* The page must include **Read to me** and **Need help?**.

## Reason

Kai is familiar and concrete for children. Beginner Level teaches simple respectful actions. Confident Level connects these actions to Māori values without using long theoretical explanations.

---

# Page 7: Marae Visit Map Complete

## Page Purpose

Summarise the four scenes and show that Kiki has completed the marae visit.

## Beginner Level Flow

Title:

**Marae Visit Complete!**

Kiki says:

**You helped me make respectful choices.**

Map summary:

* 👂 **Listen first**
* 👀 **Watch and wait**
* 🏠 **Stay calm inside**
* 🍽️🌿 **Share kai and care**

Reminder:

**In real life, listen to the people leading the visit.**

## Confident Level Flow

Title:

**Marae Visit Complete!**

Kiki says:

**You helped me follow tikanga.**

Map summary:

* 👂 **Manuhiri listen**
* 👀 **Watch and wait**
* 🏠 **Respect wharenui**
* 🌿 **Care for people and place**

Short check:

**Tikanga can depend on...**

Options:

1. **People, place, and context**
2. **One rule everywhere**
3. **Only saying Māori words**

Correct answer:

**People, place, and context**

Feedback:

**Ka pai! Tikanga is respect in the right context.**

## Image / Visual Design

The page shows the complete Marae Visit Map. All four stations are bright and connected by a glowing path. Kiki stands beside the map and smiles.

## Buttons

* **Finish**
* **Try Again**
* **Check answer**
* **Read to me**
* **Back**

## Animation / Implementation

* The four stations and connecting path can glow when the page loads.
* Kiki can gently wave.
* If time is limited, a static highlighted map is acceptable for the MVP.

## Functional Requirements

* The page must show all four stations completed.
* Beginner Level must summarise the four respectful behaviours simply.
* Confident Level must summarise the visit using short Māori-linked ideas.
* Confident Level must include one short contextual check.
* The page must include a cultural safety reminder.
* The page must not add a repeated path challenge or formal quiz.
* Tapping **Finish** moves to the reward page.

## Reason

This page gives children a sense of completion and helps them remember the module as one complete story. Confident Level reinforces the idea that tikanga is connected to people, place, and context.

---

# Page 8: Reward Page

## Page Purpose

Celebrate completion of the Tikanga module and add the Tikanga Badge to the global rewards system.

## Beginner Level Flow

Title:

**Tikanga Complete!**

Kiki says:

**Ka pai! You helped me learn tikanga.**

Summary:

**Tikanga means respectful ways of doing things.**

You learned:

* **Listen first**
* **Watch and wait**
* **Stay calm inside**
* **Share kai and care**

Reward:

**Tikanga Explorer Badge unlocked!**

Final reminder:

**In real life, follow the people leading the visit.**

## Confident Level Flow

Title:

**Tikanga Complete!**

Kiki says:

**Ka pai! You made thoughtful tikanga choices.**

You practised:

* **manuhiri** — being a respectful visitor;
* **tangata whenua** — following local hosts;
* **manaakitanga** — caring for people;
* **kaitiakitanga** — caring for place.

Reward:

**Tikanga Navigator Badge unlocked!**

Final reminder:

**Tikanga is learned through people, place, and respectful practice.**

## Image / Visual Design

The page shows:

* Kiki standing beside the completed map;
* the Tikanga Badge appearing;
* the badge can include simple icons: ear, eye, house, kai / leaf.

## Buttons

* **Back to Map**
* **Show Badge**
* **Try Again**
* **Read to me**

## Animation / Implementation

* The badge can appear with a simple scale animation.
* The completed map stays visible as evidence of the child’s learning.
* CSS transition is enough; complex animation is not required.

## Functional Requirements

* The page must show a completion message.
* The page must show the Tikanga Badge.
* Beginner Level unlocks a **Tikanga Explorer Badge**.
* Confident Level unlocks a **Tikanga Navigator Badge**.
* Badge names should not suggest that one learner is better than another.
* The system must mark the Tikanga module as complete.
* The badge must appear in the global Rewards panel.
* The page must not show scores, rankings, or grades.

## Reason

The reward page reinforces effort and completion without creating competition. Beginner Level celebrates learning the core behaviours. Confident Level celebrates thoughtful choices in context.

---

# Shared Module Requirements

## Level Design

The module should provide two levels:

* **Beginner Level**
* **Confident Level**

The learner can choose a level at the start, or the teacher can recommend a level. The system should not assume the learner’s level based only on whether they are Māori or non-Māori.

## Beginner Level Characteristics

Beginner Level should include:

* simple English support;
* clear icons and visual cues;
* direct respectful-behaviour choices;
* audio support on every page;
* gentle retry feedback;
* no formal scoring;
* no complex cultural reasoning questions.

## Confident Level Characteristics

Confident Level should include:

* a few simple Māori terms in context;
* short meanings for each Māori term;
* more realistic and practical wrong choices;
* choices that require contextual thinking;
* understanding that previous experience does not replace current local guidance;
* connection to people, place, and context;
* help options so learners are not blocked.

## Māori Terms Used in Confident Level

The Confident Level may include the following simple Māori terms:

* **manuhiri** — visitors
* **tangata whenua** — local people / hosts
* **manaakitanga** — care for people
* **kaitiakitanga** — care for place

To avoid text-heavy pages, each term should be introduced with a short meaning and visual support.

## Accessibility Requirements

* Every page must include **Read to me**.
* Text must be short and large.
* Buttons must be large and easy for children to tap.
* Images and icons must support children who are not confident readers yet.
* Sound on/off should be available.
* High contrast and larger text should be supported if time allows.
* Confident Level must still include help options.

## Cultural Safety Requirements

* The module must not claim to teach all marae protocol.
* The module must not present tikanga as identical in every place.
* The module must show that tikanga can depend on people, place, and context.
* The module must not ask children to physically imitate hongi.
* The module must only teach safe respectful behaviours.
* Content should be reviewed by teachers or culturally knowledgeable people before use.
* Beginner Level must not be labelled as only for non-Māori learners.
* Confident Level must not be labelled as only for Māori learners.
* The app must not present itself as a cultural authority.

## AI Decision

The MVP should not use generative AI to create Tikanga content.

Reason:

Tikanga is contextual and culturally sensitive. Open-ended AI may generate oversimplified or inaccurate cultural explanations. The MVP should use fixed, reviewed scenarios and feedback.

Possible future AI use:

* simple hints based on approved content;
* teacher-side activity drafting;
* keyword pronunciation support.

AI should not:

* freely generate tikanga rules;
* explain iwi-specific or marae-specific protocol without review;
* act as an open chatbot for children;
* replace human cultural guidance.

## Implementation Notes

The module can be implemented with fixed scenes, selected difficulty level, and station progress state.

Example:

```js
let learnerLevel = "beginner"; // or "confident"

let currentStation = 1;

let stationProgress = {
  entrance: false,
  welcome: false,
  wharenui: false,
  kaiCare: false
};
```

Each scene can store different tasks for the two levels:

```js
const entranceScene = {
  title: "Entrance",
  beginner: {
    question: "We are arriving. What should I do first?",
    options: [
      { label: "Listen to the guide", correct: true },
      { label: "Run inside", correct: false, wrongHint: "We listen before going in." },
      { label: "Shout loudly", correct: false, wrongHint: "Quiet listening shows respect." }
    ]
  },
  confident: {
    question: "Kiki is manuhiri. What should he do first?",
    options: [
      { label: "Stay with the group", correct: true },
      { label: "Walk ahead", correct: false, wrongHint: "Kiki should stay with the group." },
      { label: "Lead the class", correct: false, wrongHint: "Kiki should follow the people leading this visit." }
    ]
  }
};
```

Animations can use simple CSS classes:

* `.shake` for incorrect answers;
* `.glow` for correct answers;
* `.station-complete` for completed map stations;
* `.fade-in` for new step content.

The MVP does not require complex animation.

## Summary

The Tikanga module is designed as **Kiki’s First Marae Visit**. Children help Kiki move through four marae visit scenes: Entrance, Outside Welcome Area, Wharenui, and Kai/Care.

The two-level design provides meaningful content differentiation. Beginner Level supports learners who are new to tikanga through simple explanations, icons, audio prompts, and direct choices. Confident Level supports learners with more prior knowledge through simple Māori terms, realistic choices, and contextual thinking. This allows the module to support Māori and non-Māori learners respectfully without assuming a learner’s ability based only on identity.