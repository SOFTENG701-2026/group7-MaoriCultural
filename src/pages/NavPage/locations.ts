// Author: Shirley
// Map location data for the navigation page. All coordinates are percentages
// of the map stage, so the layout scales with the screen. Tweak these to
// nudge any place on the map.
import { purakauImg, waiataImg, tikangaImg, pepehaImg } from './assets'

export type Pt = { x: number; y: number }

export type Loc = {
  id: string
  label: string
  img: string
  icon: Pt // centre of the icon, in % of the map
  stand: Pt // where the kiwi stands when it arrives
  w: number // icon width, in % of the map
  eyebrow: string // small kicker above the title in the info popup
  intro: string // short teaching introduction shown in the info popup
}

export const LOCATIONS: Loc[] = [
  {
    id: 'purakau',
    label: 'Purākau',
    img: purakauImg,
    icon: { x: 29, y: 30 },
    stand: { x: 21, y: 38 },
    w: 9.6,
    eyebrow: 'Ngā Purākau · Māori Stories',
    intro:
      'Purākau are special Māori stories. They tell about gods, heroes, and how the world began. Want to hear one?',
  },
  {
    id: 'waiata',
    label: 'Waiata',
    img: waiataImg,
    icon: { x: 47, y: 38 },
    stand: { x: 47, y: 50 },
    w: 9.0,
    eyebrow: 'He Waiata · Māori Songs',
    intro:
      'Waiata are Māori songs. People sing them to tell stories and to say hello to friends. Let’s sing one!',
  },
  {
    id: 'pepeha',
    label: 'Pepeha',
    img: pepehaImg,
    icon: { x: 65, y: 57 },
    stand: { x: 57, y: 64 },
    w: 9.0,
    eyebrow: 'Tō Pepeha · About You',
    intro:
      'A pepeha tells people who you are. You name your mountain, your river, and your family. Let’s make yours!',
  },
  {
    id: 'tikanga',
    label: 'Tikanga',
    img: tikangaImg,
    icon: { x: 33, y: 79 },
    stand: { x: 33, y: 90 },
    w: 9.0,
    eyebrow: 'Ngā Tikanga · Māori Ways',
    intro:
      'Tikanga are Māori ways of doing things right. They help us be kind and care for others. Let’s find out more!',
  },
]