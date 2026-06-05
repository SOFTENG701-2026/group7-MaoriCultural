<script lang="ts">
  // A storybook illustration that displays a PNG scene image. Uses
  // container-query units so the art scales from a full story page down to a
  // small sequencing card. Supports black-and-white → colour reveal (storybook
  // cover) and a subtle ken-burns animation.
  interface Props {
    image: string
    colored?: boolean // false → desaturated (locked / not-yet-finished cover)
    animate?: boolean // gentle floating motion on the image
  }
  let { image, colored = true, animate = true }: Props = $props()
</script>

<div class="scene" class:bw={!colored} class:still={!animate}>
  <img class="art" src={image} alt="" draggable="false" />
</div>

<style>
  .scene {
    container-type: size;
    position: relative;
    width: 100%;
    height: 100%;
    aspect-ratio: 16 / 10;
    overflow: hidden;
    border-radius: 8px;
    background: #1a2a3a;
    isolation: isolate;
  }

  .art {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: filter 1.1s ease;
    animation: kenburns 12s ease-in-out infinite alternate;
  }

  /* Black-and-white (locked / unfinished) for the storybook cover reveal. */
  .scene.bw .art {
    filter: grayscale(1) contrast(0.92) brightness(1.02);
    animation: none;
  }

  /* Still mode (sequencing cards, drag ghost — no motion). */
  .scene.still .art {
    animation: none;
  }

  @keyframes kenburns {
    from { transform: scale(1); }
    to { transform: scale(1.04); }
  }

  @media (prefers-reduced-motion: reduce) {
    .art { animation: none !important; }
  }
</style>
