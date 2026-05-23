# Requirements Analysis: Map Explorer and Waiata Songs Module — *Ngā Tae*

## 1. Overall Module Goal

The system is designed as a child-friendly Māori cultural learning experience for Year 1–3 children. The learning journey begins from a **Map Explorer Home Page**, where children can choose different cultural learning areas, such as **Pūrākau**, **Waiata**, **Pepeha**, and **Tikanga**.

This document focuses on the **Waiata Songs** module, which helps children learn basic Māori colour words through the waiata *Ngā Tae*. The purpose is not to assess whether children can sing perfectly. Instead, the module supports children in listening, repeating, singing line by line, and understanding simple Māori vocabulary through a familiar song-based activity.

*Ngā Tae* is suitable for young learners because colour words are concrete, visual, and easy to connect with everyday knowledge. Children can connect Māori words with colours they already know, such as:

- **mā** = white
- **whero** = red
- **kākāriki** = green
- **pango** = black
- **mangu** = black / also black

Therefore, the main goal of the Waiata Songs module is to help children hear, imitate, recognise, and understand Māori colour words in a waiata context.

---

## 2. Target Users

The target users are **Year 1–3 children**. Children at this age are still developing reading, listening, pronunciation, and attention skills. Therefore, the system should be simple, visual, repeatable, accessible, and encouraging.

The design should consider that children in this age group:

- may have short attention spans;
- may need repeated listening before speaking;
- may not be familiar with Māori pronunciation;
- learn better through visual examples, imitation, and play;
- need encouragement rather than strict correction;
- benefit from short, step-by-step tasks;
- may not yet be confident readers;
- may have reading difficulties, low vision, or other visual accessibility needs.

For this reason, the Waiata Songs module should teach the song **one line at a time**, and only ask checking questions after the child has practised all song lines. Each page should also provide a **Read to me** function so that children can hear the instructions, lyrics, questions, answer options, and feedback aloud.

---

## 3. Learning Requirements

The learning requirements include:

- Children should be able to enter the learning activity from a clear map-based home page.
- Children should be able to select the **Waiata** learning area from the map.
- Children should be able to listen to *Ngā Tae* before singing.
- Children should practise the song line by line.
- Children should be able to replay the current line when needed.
- Children should receive pronunciation support for Māori colour words.
- Children should receive positive feedback after making a reasonable attempt at each line.
- Children should be able to recognise at least one Māori colour word from the song.
- Children should be able to match a Māori colour word to its colour meaning.
- Children should receive a small visual reward, such as a puzzle piece, after completing each song line.
- Children should see their progress build toward a final completed picture that represents the meaning of the song.
- Children should be able to open the **Rewards icon** to view earned rewards, such as the Waiata badge and completed puzzle.
- Children should be able to use a **Read to me** button on each page to hear the instructions, lyrics, questions, answer options, and feedback read aloud.
- Children with developing reading skills, reading difficulties, or visual impairments should be able to understand the task without relying only on written text.
- After completing a module, children should return to the map, where Kiwi moves toward the recommended next learning area. The child should still click the highlighted module to enter it.

The learning focus is on **guided exploration, listening, imitation, pronunciation practice, word recognition, meaning understanding, visible progress, and accessible audio support**.

---

## 4. User Flow Requirements

The overall user flow should be:

1. Map Explorer Home Page
2. Select **Waiata** on the map
3. Start page
4. Listen page
5. Sing line 1
6. Receive feedback and one puzzle piece
7. Sing line 2
8. Receive feedback and one puzzle piece
9. Sing line 3
10. Receive feedback and one puzzle piece
11. Sing line 4 / final line
12. Receive feedback and one puzzle piece
13. Word check
14. Meaning check
15. Reward page
16. Return to Map Explorer Home Page
17. Kiwi moves toward the recommended next module
18. The child clicks the highlighted module to enter the next activity

This order lets children first enter the experience through a playful map, then complete the Waiata learning flow in a structured way. The song is practised before checking questions appear. If questions appear after every line, the singing activity may feel interrupted and more like a test.

The puzzle reward also supports this flow. After each line, children receive a visible piece of progress, which helps maintain motivation across the whole song.

Each page should also include a **Read to me** function. This ensures that children who cannot read confidently can still understand the current task through audio support.

---

## 5. Functional Requirements

### FR0: Map Explorer Home Page

The system should provide a **Map Explorer Home Page** as the entry point for the learning experience. This page should look like a child-friendly adventure map of Aotearoa, where different learning modules are shown as large tappable locations or icons.

The map should include clear module areas, such as:

- **Pūrākau** for stories;
- **Waiata** for songs;
- **Pepeha** for identity and introduction;
- **Tikanga** for customs and cultural practices.

Each module icon should be visually distinct and large enough for Year 1–3 children to click easily. When the child clicks the **Waiata** location on the map, the system should open the Waiata Songs module and begin the *Ngā Tae* learning flow.

The map should feel like an exploration game rather than a normal menu. The Kiwi character can appear on the map as a guide, helping children understand that they are travelling between different learning areas. When a child selects a module, the system can show a simple transition, such as Kiwi moving toward the selected location or the selected icon giving a visual response.

After the child completes a module, the system should return to the Map Explorer Home Page. Kiwi should then automatically move toward the recommended next learning module, and the next module icon can show a simple visual cue, such as glowing, bouncing, or pulsing.

However, the system should not automatically open the next module. The child should still click the highlighted module to enter it. This keeps the experience playful while still giving the child control over navigation.

The map page should include a simple learner profile area, such as **“Kia ora! Explorer”**, so the child feels personally welcomed into the activity.

The page should include a **Read to me** button. This should read out the map instructions and explain what the child can do, for example:

> Choose a place on the map to start learning. Tap Waiata to learn a Māori song.

The map should also include a **Rewards icon**, allowing children to view rewards they have earned, such as badges, puzzle pieces, or completed reward pictures.

A **Settings icon** should also be included for simple learning and accessibility preferences, such as sound, volume, Read to me mode, text size, and high contrast mode. This icon should be placed separately from the learning module icons so children do not confuse settings with a learning activity.

---

### FR1: Start Page

The system should introduce the activity as a Māori colour song activity. The Start page should clearly show the learning goals:

- Listen to *Ngā Tae*
- Sing one line at a time
- Learn Māori colour words

The page should use bright, child-friendly visuals so that children understand this is a song and colour learning activity.

The Start page should also include a **Read to me** button. This button should read aloud the learning goals and starting instructions.

---

### FR2: Listen Page

The system should provide a **Play** button that allows the child to listen to *Ngā Tae* or a short preview of the song.

The Listen page should not ask the child to sing or answer questions yet. Its role is to let the child hear the Māori words and become familiar with the song before singing.

The Listen page should include a **Read to me** button that reads the instruction, such as telling the child to listen to the song first before moving to line-by-line singing.

---

### FR3: Line-by-line Singing

The system should teach the song one line at a time. Each sing-along page should display only the current line, for example:

- Mā is white
- Whero is red
- Kākāriki green
- Pango is black
- Mangu is too

Each line should be paired with a matching colour visual, such as a colour card or paint splash. This helps children connect:

- Māori pronunciation;
- Māori spelling;
- colour meaning.

Each singing page should include:

- the current lyric line;
- a matching colour visual;
- a clickable Kiwi character;
- a **Try singing** button;
- a **Need help?** button;
- a **Read to me** button;
- a **Next** button;
- a visible progress reward area, such as a puzzle progress display.

---

### FR4: Kiwi Replay Function

The Kiwi character should act as a replay helper. It should prompt the child with:

> Click me to hear this line again.

When the child clicks the Kiwi, the system should replay only the current line.

The Kiwi replay function and the **Read to me** function should be treated as different features:

- **Kiwi replay** = plays the current song line again;
- **Read to me** = reads the current page instructions, task, question, answer options, and feedback aloud.

Both functions should be kept because they support different learning needs.

---

### FR5: Read to Me Function

Each page in the Waiata Songs module should provide a **Read to me** button. This button should read aloud the key content on the current page, including instructions, lyrics, questions, answer options, feedback, and next-step guidance.

This function is important because some Year 1–3 children may not be confident readers yet. It also supports children with reading difficulties, low vision, or other visual accessibility needs.

The **Read to me** function should work differently across pages:

- On the Start page, it should read the learning goals and starting instructions.
- On the Listen page, it should read the instruction to listen to the song first.
- On the Sing-along page, it should read the task, such as: “Try singing this line. Click Kiki if you want to hear it again.”
- On the Word check page, it should read the question and answer options aloud.
- On the Meaning check page, it should read the question and colour options aloud.
- On the Reward page, it should read the completion feedback and reward message.

---

### FR6: Try Singing Function and Positive Feedback

When the child clicks **Try singing**, the system should encourage them to try saying or singing the current line.

The system should not assess rhythm, pitch, or musical accuracy. For Year 1–3 learners, strict singing assessment would be too difficult and may reduce confidence.

Instead, the system should only check:

- whether the child attempted to speak or sing;
- whether the Māori colour word in the current line was roughly present.

For example, if the current line is **“Whero is red”**, the AI should mainly check whether the child roughly said **whero**.

If the child makes a reasonable attempt, the system should show positive feedback, such as:

> Ka pai! You tried “whero”.

After this positive feedback appears, the **Next** button should be enabled so the child can move to the next line.

If the key Māori colour word is not recognised, the AI should provide a short pronunciation hint and invite the child to try again, rather than saying the child is wrong.

---

### FR7: Line-by-line Puzzle Reward

After the child makes a reasonable attempt at each song line, the system should give immediate positive feedback and reward the child with one puzzle piece.

For example, after practising **“Whero is red”**, the child could receive one puzzle piece connected to the colour red. After each completed line, another piece is added to the puzzle.

When all song lines are completed, the puzzle pieces should form one full picture related to the meaning of *Ngā Tae*, such as a colourful image showing the colours from the song.

This feature is useful but not essential for the first implementation. If time is limited, it can be implemented as a future enhancement after the main song-learning flow is completed.

---

### FR8: AI Help Function

The **Need help?** button should provide short, context-sensitive AI support.

If the child has not tried singing yet, AI can suggest:

> Click Kiki to hear this line again, then try singing.

If the child has already tried but the Māori colour word is not recognised, AI can break the word into smaller pronunciation parts, such as:

- mā
- whe-ro
- kā-kā-ri-ki
- pan-go
- man-gu

If the child asks for help repeatedly, AI should reduce the difficulty step by step:

1. First say the colour word.
2. Then say the whole line.
3. Then try singing it with Kiki.

If the child makes a reasonable attempt, AI can give encouraging feedback and explain the meaning:

> Ka pai! Whero means red.

The AI should function as a supportive guide, not as an examiner.

---

### FR9: Progression Control

The module should control progression so that children complete each learning step before moving forward.

During the line-by-line singing pages, the **Next** button should remain disabled until the child has attempted the current line using **Try singing**. The child does not need to sing perfectly, but they should make a reasonable attempt before moving to the next line.

After a reasonable attempt is accepted, the system should:

1. show positive feedback;
2. award one puzzle piece;
3. enable the **Next** button.

During the **Word check**, the **Next** button should remain disabled until the child selects the correct Māori colour word from the options. If the child selects an incorrect option, the system should give a short hint and allow them to try again.

During the **Meaning check**, the **Finish** or **Reward** button should remain disabled until the child correctly matches the Māori colour word to its colour meaning.

---

### FR10: Word Check

After the child has practised all song lines, the system should show a **Word check** question.

The purpose of Word check is to check whether the child can recognise a Māori colour word from *Ngā Tae*.

A suitable question is:

> Which one is a Māori colour word from *Ngā Tae*?

Example options:

- whero
- kai
- whare
- kuri

Correct answer:

- **whero**

This checks whether the child can identify **whero** as a Māori colour word from the song, while the other options are Māori words but not colour words from this activity.

The Word check page should include a **Read to me** button that reads the question and options aloud.

---

### FR11: Meaning Check

After Word check, the system should show a **Meaning check** question.

The purpose of Meaning check is to check whether the child understands the meaning of the Māori colour word.

A suitable question is:

> What colour does “whero” mean?

Example options:

- red
- white
- green
- black

Correct answer:

- **red**

The difference between the two checks is:

- **Word check** = recognising which word is a Māori colour word from the song.
- **Meaning check** = understanding what colour that word means.

The child must select the correct colour meaning before receiving the reward.

The Meaning check page should include a **Read to me** button that reads the question and options aloud.

---

### FR12: Reward Page

After the child completes the line-by-line singing and both checks, the system should show a reward page.

The reward page should summarise the child’s progress:

- Waiata complete!
- You listened to *Ngā Tae*.
- You tried singing each line.
- You learned Māori colour words.
- You completed the colour puzzle.

The badge can be called a **Waiata badge**. The reward should focus on participation and learning progress, rather than perfect singing performance.

If the puzzle reward feature is implemented, the final reward page should show the completed puzzle image. This image should represent the meaning of *Ngā Tae*, for example by showing the colours learned in the song.

The Reward page should also include a **Read to me** button that reads the completion feedback and reward message aloud.

---

### FR13: Global Rewards Icon

The system should provide a separate **Rewards icon** on the main interface. Children should be able to click this icon to view the rewards they have earned across the learning activities.

For the Waiata Songs module, the Rewards view should show:

- the **Waiata badge** earned after completing the module;
- the puzzle pieces earned after each completed song line;
- the completed puzzle image when all pieces are collected;
- the child’s progress in the *Ngā Tae* activity, such as completed singing lines, Word check, and Meaning check;
- locked rewards for activities that have not been completed yet.

The **Rewards icon** should not replace the in-activity rewards. During the Waiata activity, children receive puzzle pieces after completing each line. At the end of the module, they receive a Waiata badge. The Global Rewards view works as a collection space where children can review these rewards later.

The Rewards view should be simple and visual. It should not show scores, rankings, or performance grades.

---

### FR14: Settings Icon

The system should provide a **Settings icon** on the main interface. The Settings panel should allow children, teachers, or caregivers to adjust simple learning and accessibility preferences.

The Settings panel should include:

- **Sound on/off:** turn background music and sound effects on or off.
- **Volume level:** choose a simple volume level, such as low, medium, or high.
- **Read to me mode:** choose whether instructions are read only when the button is clicked, or automatically when a page opens.
- **Text size:** switch between normal and large text.
- **High contrast mode:** improve visibility for children who need clearer contrast.

High contrast mode should be implemented mainly through code by increasing contrast for text, buttons, cards, and interactive elements. It should not require a completely new set of background images. However, important learning content should not rely only on background images or colour alone. For the colour song, each colour visual should also include a text label, such as **“whero = red”**, so that children can still understand the content in high contrast mode.

These settings should apply across the Map Explorer Home Page and the Waiata Songs module. The Settings panel should remain simple so that it supports accessibility without making the interface confusing for Year 1–3 children.

---

## 6. Non-functional Requirements

The module should be:

- **Age-appropriate:** suitable for Year 1–3 children.
- **Visual:** colour words should be supported by matching colour visuals and text labels.
- **Simple:** instructions and buttons should be easy to understand.
- **Encouraging:** feedback should support confidence, not punish mistakes.
- **Repeatable:** children should be able to hear each line again.
- **Low-pressure:** the system should not score pitch, rhythm, or singing accuracy.
- **Accessible:** text should be large, buttons should be easy to click, each page should include a **Read to me** function, and Settings should support larger text, high contrast mode, and audio control.
- **Structured:** children should complete each step before moving forward.
- **Motivating:** children should be able to see progress through puzzle pieces, badges, completed reward pictures, and the Global Rewards view.
- **Playful:** the map and Kiwi movement should make the system feel like an exploration game rather than a static menu.

---

## 7. Acceptance Criteria

The Map Explorer and Waiata Songs module can be considered successful if:

- Children can understand that the map is the entry point for different Māori cultural learning activities.
- Children can identify and select the **Waiata** module from the map.
- Kiwi visually guides children toward selected or recommended learning areas.
- After completing a module, children return to the map and Kiwi moves toward the recommended next module.
- The next recommended module is highlighted, but the child must click it to enter.
- Children can understand that the Waiata activity is about *Ngā Tae* and Māori colours.
- Children can listen to the song before singing.
- Children can practise each line one at a time.
- Children can click Kiwi to replay the current line.
- Each page includes a **Read to me** button.
- The **Read to me** button reads aloud the main instructions, lyrics, questions, answer options, and feedback on the current page.
- Children who are not confident readers can still understand what to do through audio support.
- Children can use **Need help?** to receive pronunciation support.
- Children are not judged on pitch, rhythm, or perfect singing accuracy.
- Children receive positive feedback after making a reasonable attempt at a line.
- The **Next** button remains disabled until the child has attempted the current singing line.
- After each reasonable singing attempt, the child receives a puzzle piece.
- The puzzle pieces gradually build toward a complete picture.
- The completed puzzle picture represents the meaning of *Ngā Tae*.
- In **Word check**, the child must select the correct Māori colour word before continuing.
- In **Meaning check**, the child must select the correct colour meaning before receiving the reward.
- Incorrect answers trigger supportive hints and allow the child to try again.
- Children receive a **Waiata badge** after completing the activity.
- Children can open the **Rewards icon** to view earned badges, collected puzzle pieces, completed puzzle images, and learning progress.
- The Rewards view shows locked and unlocked rewards clearly.
- The Rewards view does not show scores, rankings, or performance grades.
- Children, teachers, or caregivers can open the **Settings icon** to adjust sound, volume, Read to me mode, text size, and high contrast mode.
- Settings changes apply across the Map Explorer Home Page and the Waiata Songs module.
- The puzzle reward feature can be implemented as a future enhancement if it is not included in the first version.

---

## 8. Summary

The system uses a playful map-based structure to guide Year 1–3 children through Māori cultural learning activities. Children begin from the **Map Explorer Home Page**, choose a learning area such as **Waiata**, complete the module, and return to the map. After completing a module, Kiwi automatically moves toward the recommended next learning area, while the child still chooses when to click and enter.

The Waiata Songs module uses *Ngā Tae* to support a simple and age-appropriate learning flow:

1. Start from the Map Explorer Home Page
2. Select **Waiata**
3. Listen to *Ngā Tae*
4. Sing the song line by line
5. Click Kiwi to replay the current line
6. Use **Read to me** to hear page instructions, lyrics, questions, and feedback
7. Use AI help for pronunciation and meaning support
8. Receive positive feedback and one puzzle piece after a reasonable singing attempt
9. Complete the puzzle as the song lines are learned
10. Recognise a Māori colour word in Word check
11. Match the word to its colour meaning in Meaning check
12. Earn a Waiata badge
13. Review earned rewards through the Rewards icon
14. Adjust simple learning and accessibility preferences through the Settings icon
15. Return to the map and follow Kiwi toward the next recommended module

This design is suitable for young learners because the colour words are concrete, the song lines are short, and the interaction is visual and repeatable. The puzzle reward and Global Rewards icon make progress visible during and after the activity, which can help maintain motivation for Year 1–3 children.

The **Read to me** function improves accessibility by allowing children to hear instructions, lyrics, questions, and feedback aloud. Settings also support accessibility by allowing sound control, volume adjustment, Read to me mode, larger text, and high contrast mode.

The focus is not on judging singing performance, but on encouraging children to participate, practise Māori pronunciation, and understand basic colour vocabulary through waiata.