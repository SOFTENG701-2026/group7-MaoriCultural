# Requirements Analysis: Waiata Songs Module — *Ngā Tae*

## 1. Module Goal

The **Waiata Songs** module is designed to help Year 1–3 children learn basic Māori colour words through the waiata *Ngā Tae*. The purpose of this module is not to assess whether children can sing perfectly. Instead, it supports children in listening, repeating, singing line by line, and understanding simple Māori vocabulary through a familiar song-based activity.

*Ngā Tae* is suitable for young learners because colour words are concrete, visual, and easy to connect with everyday knowledge. Children can connect Māori words with colours they already know, such as:

- **mā** = white
- **whero** = red
- **kākāriki** = green
- **pango** = black
- **mangu** = black / also black

Therefore, the main goal of this module is to help children hear, imitate, recognise, and understand Māori colour words in a waiata context.

---

## 2. Target Users

The target users are **Year 1–3 children**. Children at this age are still developing reading, listening, pronunciation, and attention skills. Therefore, the module should be simple, visual, repeatable, accessible, and encouraging.

The design should consider that children in this age group:

- may have short attention spans;
- may need repeated listening before speaking;
- may not be familiar with Māori pronunciation;
- learn better through visual examples and imitation;
- need encouragement rather than strict correction;
- benefit from short, step-by-step tasks;
- may not yet be confident readers;
- may have reading difficulties, low vision, or other visual accessibility needs.

For this reason, the module should teach the song **one line at a time**, and only ask checking questions after the child has practised all song lines. Each page should also provide a **Read to me** function so that children can hear the instructions, lyrics, questions, and feedback aloud.

---

## 3. Learning Requirements

The learning requirements of the Waiata Songs module are:

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

The learning focus is on **listening, imitation, pronunciation practice, word recognition, meaning understanding, visible progress, and accessible audio support**.

---

## 4. User Flow Requirements

The Waiata Songs module should follow this flow:

1. Start page
2. Listen page
3. Sing line 1
4. Receive feedback and one puzzle piece
5. Sing line 2
6. Receive feedback and one puzzle piece
7. Sing line 3
8. Receive feedback and one puzzle piece
9. Sing line 4 / final line
10. Receive feedback and one puzzle piece
11. Word check
12. Meaning check
13. Reward page

This order is important because it lets children experience and practise the song first before answering questions. If questions appear after every line, the singing activity may feel interrupted and more like a test. A better flow is to let children complete the line-by-line singing first, then check what they recognised and understood.

The puzzle reward also supports this flow. After each line, children receive a visible piece of progress, which helps maintain motivation across the whole song.

Each page should also include a **Read to me** function. This ensures that children who cannot read confidently can still understand the current task through audio support.

---

## 5. Functional Requirements

### FR1: Start Page

The system should introduce the activity as a Māori colour song activity. The Start page should clearly show the learning goals:

- Listen to *Ngā Tae*
- Sing one line at a time
- Learn Māori colour words

The page should use bright, child-friendly visuals so that children understand this is a song and colour learning activity.

The Start page should also include a **Read to me** button. This button should read aloud the learning goals and starting instructions so that children with developing reading skills or visual accessibility needs can understand the activity.

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

When the child clicks the Kiwi, the system should replay only the current line. This is more suitable for young children than a complex audio player because the child can simply interact with the character to hear the line again.

The Kiwi replay function and the **Read to me** function should be treated as different features:

- **Kiwi replay** = plays the current song line again;
- **Read to me** = reads the current page instructions, task, question, answer options, and feedback aloud.

Both functions should be kept because they support different learning needs.

---

### FR5: Read to Me Function

Each page in the Waiata Songs module should provide a **Read to me** button. This button should read aloud the key content on the current page, including instructions, lyrics, questions, answer options, feedback, and next-step guidance.

This function is important because some Year 1–3 children may not be confident readers yet. It also supports children with reading difficulties, low vision, or other visual accessibility needs. Children should be able to understand what to do without relying only on written text.

The **Read to me** function should work differently across pages:

- On the Start page, it should read the learning goals and starting instructions.
- On the Listen page, it should read the instruction to listen to the song first.
- On the Sing-along page, it should read the task, such as: “Try singing this line. Click Kiki if you want to hear it again.”
- On the Word check page, it should read the question and answer options aloud.
- On the Meaning check page, it should read the question and colour options aloud.
- On the Reward page, it should read the completion feedback and reward message.

This helps children with developing reading skills, reading difficulties, or visual impairments participate in the Waiata Songs activity more independently.

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

The purpose of this feature is to make the line-by-line learning process more motivating for Year 1–3 children. Instead of only receiving a final reward at the end, children can see their progress after each line. This supports short attention spans and gives children a clear sense of achievement during the song-learning process.

When all song lines are completed, the puzzle pieces should form one full picture related to the meaning of *Ngā Tae*, such as a colourful image showing the colours from the song. This final image helps children connect the Māori colour words with their meanings.

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

During the **Meaning check**, the **Finish** or **Reward** button should remain disabled until the child correctly matches the Māori colour word to its colour meaning. If the child selects the wrong colour, the system should provide supportive feedback rather than marking the child harshly.

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

The child must select the correct answer before continuing.

The Word check page should include a **Read to me** button that reads the question and options aloud, so children who struggle with reading or have visual impairments can participate more independently.

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

The Meaning check page should include a **Read to me** button that reads the question and options aloud, so children do not need to rely only on written text.

---

### FR12: Reward Page

After the child completes the line-by-line singing and both checks, the system should show a reward page.

The reward page should summarise the child’s progress:

- Waiata complete!
- You listened to *Ngā Tae*.
- You tried singing each line.
- You learned Māori colour words.
- You completed the colour puzzle.

The badge can be called a **Waiata badge**, because the activity belongs to the song-learning module. The reward should focus on participation and learning progress, rather than perfect singing performance.

If the puzzle reward feature is implemented, the final reward page should show the completed puzzle image. This image should represent the meaning of *Ngā Tae*, for example by showing the colours learned in the song. This gives children a visual sense of completion and reinforces the connection between the song lyrics and colour meanings.

The Reward page should also include a **Read to me** button that reads the completion feedback and reward message aloud.

---

### FR13: Global Rewards Icon

The system should provide a separate **Rewards icon** on the main interface. Children should be able to click this icon to view the rewards they have earned across the learning activities.

For the Waiata Songs module, the Rewards view should show the child’s **Waiata badge**, completed puzzle image, and progress related to the *Ngā Tae* colour song. This gives children a place to review their achievements after finishing the activity.

The **Rewards icon** should not replace the in-activity rewards. Instead, it should work as a collection space. During the Waiata activity, children receive puzzle pieces after completing each line. After finishing the whole activity, they receive a Waiata badge. The Rewards icon allows them to view these rewards again later.

This is suitable for Year 1–3 children because visible rewards can help maintain motivation and give children a clear sense of progress and achievement.

---

## 6. Non-functional Requirements

The module should be:

- **Age-appropriate:** suitable for Year 1–3 children.
- **Visual:** colour words should be supported by matching colour visuals.
- **Simple:** instructions and buttons should be easy to understand.
- **Encouraging:** feedback should support confidence, not punish mistakes.
- **Repeatable:** children should be able to hear each line again.
- **Low-pressure:** the system should not score pitch, rhythm, or singing accuracy.
- **Accessible:** text should be large, buttons should be easy to click, and each page should include a **Read to me** function for children with developing reading skills, reading difficulties, or visual impairments.
- **Structured:** children should complete each step before moving forward.
- **Motivating:** children should be able to see progress through visual rewards, such as puzzle pieces, badges, and the Rewards icon.

---

## 7. Acceptance Criteria

The Waiata Songs module can be considered successful if:

- Children can understand that the activity is about *Ngā Tae* and Māori colours.
- Children can listen to the song before singing.
- Children can practise each line one at a time.
- Children can click Kiwi to replay the current line.
- Each page includes a **Read to me** button.
- The **Read to me** button reads aloud the main instructions, lyrics, questions, answer options, and feedback on the current page.
- Children who are not confident readers can still understand what to do through audio support.
- The **Read to me** function supports children with reading difficulties or visual impairments.
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
- Children can open the **Rewards icon** to view earned badges, puzzle pieces, and learning rewards.
- The puzzle reward feature can be implemented as a future enhancement if it is not included in the first version.

---

## 8. Summary

The Waiata Songs module uses *Ngā Tae* to support a simple and age-appropriate learning flow for Year 1–3 children:

1. Listen to *Ngā Tae*
2. Sing the song line by line
3. Click Kiwi to replay the current line
4. Use **Read to me** to hear page instructions, lyrics, questions, and feedback
5. Use AI help for pronunciation and meaning support
6. Receive positive feedback and one puzzle piece after a reasonable singing attempt
7. Complete the puzzle as the song lines are learned
8. Recognise a Māori colour word in Word check
9. Match the word to its colour meaning in Meaning check
10. Earn a Waiata badge
11. Review earned rewards through the Rewards icon

This design is suitable for young learners because the colour words are concrete, the song lines are short, and the interaction is visual and repeatable. The puzzle reward and Global Rewards icon make progress visible during and after the activity, which can help maintain motivation for Year 1–3 children.

The **Read to me** function also improves accessibility by allowing children to hear instructions, lyrics, questions, and feedback aloud. This supports early readers, children with reading difficulties, and children with visual impairments.

The focus is not on judging singing performance, but on encouraging children to participate, practise Māori pronunciation, and understand basic colour vocabulary through waiata.