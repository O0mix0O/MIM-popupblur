# Melvor Idle UI Blur Mod

This mod adds a blur effect to the game's elements when any modal is visible. The blur effect is removed once the modal is no longer displayed.

## Features

- **Adds blur**: When a modal appears, it applies a `filter: blur(5px)` to the `#page-container` and `#skill-footer-minibar-container` and other elements.
- **Removes blur**: Once the modal disappears, the blur effect is removed.

## How It Works

- **Modal Visibility Detection**: The mod uses JavaScript to monitor the visibility of the modal. When the modal becomes visible, the blur effect is applied to the main game content. The blur is removed when the modal is no longer visible.

## Acknowledgments

- Thanks to the Melvor Idle community for supporting modding and making this mod possible!