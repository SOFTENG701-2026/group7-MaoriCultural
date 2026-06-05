// All image assets for the Purākau module, gathered in one place so every page
// and component imports its art from a single categorised module instead of
// reaching into ../../assets on its own (mirrors NavPage/assets.ts).

import type { SceneImage } from './stories'

// ── Kiki the kiwi — guide poses (shared app-wide kiwi family) ────────────────
export { default as kikiHello } from '../../assets/kiwihello.png'
export { default as kikiYes } from '../../assets/kiwiyes.png'
export { default as kikiThink } from '../../assets/kiwithink.png'
export { default as kikiTryAgain } from '../../assets/kiwitryagain.png'
export { default as kikiGo } from '../../assets/kiwigo.png'

// ── Step 3 props — five carved taonga the child chooses between ──────────────
// (true-alpha cut-outs so they sit cleanly on the wooden tray)
export { default as propTaiaha } from '../../assets/ui_purakau/true_alpha_ui_assets/01_taiaha.png'
export { default as propPatunihi } from '../../assets/ui_purakau/true_alpha_ui_assets/02_patunihi.png'
export { default as propFeathers } from '../../assets/ui_purakau/true_alpha_ui_assets/03_native_feathers.png'
export { default as propWahaika } from '../../assets/ui_purakau/true_alpha_ui_assets/04_wahaika.png'
export { default as propMatau } from '../../assets/ui_purakau/true_alpha_ui_assets/05_matau.png'
export { default as woodenTray } from '../../assets/ui_purakau/true_alpha_ui_assets/wooden_tray_transparent.png'

// ── Frames, signs & scene backdrop ───────────────────────────────────────────
export { default as cardFrame } from '../../assets/ui_purakau/transparent_ui_assets_v2/generic_picture_card_frame_transparent.png'
export { default as rebuilderSign } from '../../assets/ui_purakau/transparent_ui_assets_v2/story_rebuilder_sign_transparent.png'
export { default as beachScene } from '../../assets/ui_purakau/transparent_ui_assets_v2/clean_background_solid.png'
export { default as pathTile } from '../../assets/ui_purakau/transparent_ui_assets_v2/path_tile_front_transparent.png'

// ── Storybook chrome ─────────────────────────────────────────────────────────
export { default as openBook } from '../../assets/ui_purakau/ui_assets_real_alpha/open_book_alpha.png'
export { default as woodTable } from '../../assets/ui_purakau/ui_assets_real_alpha/wood_tabletop_background.png'
export { default as arrowLeft } from '../../assets/ui_purakau/ui_assets_real_alpha/left_button_alpha.png'
export { default as arrowRight } from '../../assets/ui_purakau/ui_assets_real_alpha/right_button_alpha.png'

// ── Story scene images (Story 1: Māui and the Giant Fish, 5 illustrations) ───
import fishImg1 from '../../assets/ui_purakau/true_alpha_ui_assets/1.png'
import fishImg2 from '../../assets/ui_purakau/true_alpha_ui_assets/2.png'
import fishImg3 from '../../assets/ui_purakau/true_alpha_ui_assets/3.png'
import fishImg4 from '../../assets/ui_purakau/true_alpha_ui_assets/4.png'
import fishImg5 from '../../assets/ui_purakau/true_alpha_ui_assets/5.png'
export { fishImg1, fishImg2, fishImg3, fishImg4, fishImg5 }

// ── Story scene images (Story 2: The Separation of Earth and Sky, 7) ─────────
import skyImg1 from '../../assets/ui_purakau/story_2/purakau-01-te-kore-v2.png'
import skyImg2 from '../../assets/ui_purakau/story_2/purakau-02-ranginui-papatuanuku-v2.png'
import skyImg3 from '../../assets/ui_purakau/story_2/purakau-03-children-debate-v2.png'
import skyImg4 from '../../assets/ui_purakau/story_2/purakau-04-tane-separates-sky-earth-v2.png'
import skyImg5 from '../../assets/ui_purakau/story_2/purakau-05-tawhirimatea-storm-v2.png'
import skyImg6 from '../../assets/ui_purakau/story_2/purakau-06-humanity-and-nature-v2.png'
import skyImg7 from '../../assets/ui_purakau/story_2/purakau-07-creation-continues-v2.png'

/** Resolve a SceneImage key to the actual PNG URL for use in SceneArt. */
export const SCENE_IMAGES: Record<SceneImage, string> = {
  'img-1': fishImg1,
  'img-2': fishImg2,
  'img-3': fishImg3,
  'img-4': fishImg4,
  'img-5': fishImg5,
  'sky-1': skyImg1,
  'sky-2': skyImg2,
  'sky-3': skyImg3,
  'sky-4': skyImg4,
  'sky-5': skyImg5,
  'sky-6': skyImg6,
  'sky-7': skyImg7,
}

// ── Decorations & the story badge (green pounamu hei matau) ──────────────────
export { default as heiMatau } from '../../assets/ui_purakau/ui_assets_real_alpha/green_fish_hook_alpha.png'
export { default as fernLeaf } from '../../assets/ui_purakau/ui_assets_real_alpha/fern_leaf_alpha.png'
