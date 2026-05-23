// Author: Ethan
// Ngā Tae — the five sing-along lines that the Waiata learning page teaches,
// one at a time (FR3). Each line carries the Māori colour word the AI listens
// for (FR6/FR8), the matching colour swatch (kept readable in high-contrast
// mode by always pairing it with a written label), and a tiny pronunciation
// breakdown the Need help button can fall back on (FR8).

export type SongLine = {
  /** What appears as the lyric on the page. */
  lyric: string
  /** Māori colour word the AI primarily listens for in this line. */
  maoriWord: string
  /** Extra accepted spellings/spoken forms (lowercased), to be lenient. */
  aliases: string[]
  /** Plain-English colour name shown alongside the swatch ("whero = red"). */
  english: string
  /** Swatch background. For pure-white the card still carries a dark border. */
  color: string
  /** Pronunciation chunks used by the Need help breakdown (FR8). */
  syllables: string[]
}

export const SONG_LINES: SongLine[] = [
  {
    lyric: 'Mā is white',
    maoriWord: 'mā',
    aliases: ['ma', 'maa', 'maah'],
    english: 'white',
    color: '#ffffff',
    syllables: ['mā'],
  },
  {
    lyric: 'Whero is red',
    maoriWord: 'whero',
    aliases: ['fero', 'wero', 'where-oh', 'wheh-roh'],
    english: 'red',
    color: '#e23b3b',
    syllables: ['whe', 'ro'],
  },
  {
    lyric: 'Kākāriki green',
    maoriWord: 'kākāriki',
    aliases: ['kakariki', 'ka-ka-ri-ki', 'kakareeki', 'cackariki'],
    english: 'green',
    color: '#3cb371',
    syllables: ['kā', 'kā', 'ri', 'ki'],
  },
  {
    lyric: 'Pango is black',
    maoriWord: 'pango',
    aliases: ['pan-go', 'pan goh', 'panko', 'pangoh'],
    english: 'black',
    color: '#1a1a1a',
    syllables: ['pan', 'go'],
  },
  {
    lyric: 'Mangu is too',
    maoriWord: 'mangu',
    aliases: ['man-gu', 'mango', 'man goo', 'mangoo'],
    english: 'also black',
    color: '#2c2c2c',
    syllables: ['man', 'gu'],
  },
]
