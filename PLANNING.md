# PLANNING.md

## Vision
To create a user-friendly Quran application that allows users to read surahs and listen to ayah-by-ayah audio recitations. The application should be modern, responsive, and intuitive, with a focus on a Gen Z aesthetic.

## Architecture
- **Frontend**: React with TypeScript, utilizing Vite for fast development.
- **Styling**: Tailwind CSS for utility-first styling and `shadcn-ui` for pre-built, accessible components.
- **State Management**: React Context API for managing global state, specifically for the audio player.
- **Routing**: `react-router-dom` for client-side navigation.
- **API Integration**: Fetching Quran data and audio links from `api.alquran.cloud`.

## Tech Stack
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn-ui
- react-router-dom
- lucide-react (for icons)
- sonner (for toasts)
- tanstack/react-query (for data fetching)

## Coding Guidelines
- Follow PEP 8 for Python (if any backend is added later).
- Use Prettier for consistent code formatting in TypeScript/JavaScript.
- Enforce type checks with TypeScript.
- Modularize components and logic for reusability and maintainability.
- Document functions and complex logic with JSDoc/Google-style comments.
- Write unit tests for critical components and features.

## Audio Playback Feature Details
### Vision
To provide a seamless and intuitive audio recitation experience for each ayah, with a floating control panel for easy management of playback.

### Architecture
- **AudioPlayer Context**: A React Context (`AudioPlayerContext`) to manage the global state of the audio player, including the currently playing ayah, playback status, and control functions (play, pause, next, previous).
- **AudioPlayer Component**: A hidden `<audio>` HTML element managed by the `AudioPlayerContext` to handle the actual audio playback.
- **SurahDetail Integration**: Each ayah in the `SurahDetail` page will have a play icon. Clicking this icon will trigger the `playAyah` function from the `AudioPlayerContext` to play the specific ayah.
- **FloatingAudioPlayer Component**: A persistent, floating UI component that displays the current playing ayah's information (Surah name, Ayah number, a snippet of the text) and provides controls for play/pause, skip to next ayah, and skip to previous ayah.

### Audio Playback
- **Ayah-by-Ayah Playback**: Users can play individual ayahs directly from the Surah Detail page.
- **Floating Audio Control Panel**: A persistent control panel at the bottom of the screen provides play/pause, next/previous ayah navigation, and autoplay functionality.
  - **Scroll-based Visibility**: The control panel dynamically hides on scroll down and reappears on scroll up or when scrolling stops, with smooth CSS transitions.
  - **Start Surah Playback**: When the play button on the floating control panel is pressed and no ayah is currently playing, it will start playing the current surah from the first ayah.

### Technology Stack for Audio Feature
- HTML5 `<audio>` element.
- React `useRef` for direct DOM interaction with the audio element.
- React `useEffect` for handling audio events and side effects.
- `lucide-react` for play/pause/skip icons.

### Design Considerations
- **Responsiveness**: The floating audio player will be responsive and adapt to different screen sizes, maintaining a consistent Gen Z aesthetic.
- **Simplicity**: The design will be minimalist, using clear icons and concise text.
- **Modern Aesthetic**: Leveraging Tailwind CSS and `shadcn-ui` to ensure a modern, clean, and visually appealing interface with appropriate use of whitespace and typography.
- **Accessibility**: Ensuring the controls are easily clickable and the information is readable.
- **Scroll-based Visibility**: The floating audio player will dynamically hide when the user scrolls down and reappear when the user scrolls up or stops scrolling, providing an uncluttered viewing experience while maintaining accessibility to controls.