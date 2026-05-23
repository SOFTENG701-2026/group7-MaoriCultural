# Waiata audio clips

Drop mp3 / wav / m4a / ogg files in this folder. The Waiata page (`LearningSongWithAIPage`) picks them up automatically through `import.meta.glob`, so no code change is needed.

## Expected filenames

| File              | Where it plays                                                        |
| ----------------- | --------------------------------------------------------------------- |
| `line-1.mp3`      | Kiwi replay — "Mā is white"                                           |
| `line-2.mp3`      | Kiwi replay — "Whero is red"                                          |
| `line-3.mp3`      | Kiwi replay — "Kākāriki green"                                        |
| `line-4.mp3`      | Kiwi replay — "Pango is black"                                        |
| `line-5.mp3`      | Kiwi replay — "Mangu is too"                                          |
| `word-ma.mp3`     | Need help — slow pronunciation of "mā"                                |
| `word-whero.mp3`  | Need help — slow pronunciation of "whero"                             |
| `word-kakariki.mp3` | Need help — slow pronunciation of "kākāriki"                        |
| `word-pango.mp3`  | Need help — slow pronunciation of "pango"                             |
| `word-mangu.mp3`  | Need help — slow pronunciation of "mangu"                             |
| `kapai.mp3`       | Positive feedback — "Ka pai!"                                         |
| `try-again.mp3`   | Gentle "let's try again" prompt                                       |
| `click-kiki.mp3`  | "Click Kiki to hear this line again" (intro/help hint)                |

Any missing file is fine — the page falls back to browser TTS for that clip.

Keep the recordings short (≤ 2 s for words, ≤ 4 s for lines). Trim silence on both ends so playback feels snappy.
