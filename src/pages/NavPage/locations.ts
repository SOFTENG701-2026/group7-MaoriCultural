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
}

export const LOCATIONS: Loc[] = [
  { id: 'purakau', label: 'Purākau', img: purakauImg, icon: { x: 29, y: 30 }, stand: { x: 21, y: 38 }, w: 9.6 },
  { id: 'waiata',  label: 'Waiata',  img: waiataImg,  icon: { x: 47, y: 38 }, stand: { x: 47, y: 50 }, w: 9.0 },
  { id: 'pepeha',  label: 'Pepeha',  img: pepehaImg,  icon: { x: 65, y: 57 }, stand: { x: 57, y: 64 }, w: 9.0 },
  { id: 'tikanga', label: 'Tikanga', img: tikangaImg, icon: { x: 33, y: 79 }, stand: { x: 33, y: 90 }, w: 9.0 },
]