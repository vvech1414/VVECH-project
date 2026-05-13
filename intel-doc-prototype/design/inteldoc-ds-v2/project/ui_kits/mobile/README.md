# IntelDoc Mobile — UI Kit

Patient-app surface (iOS, 440×956 native, rendered in 390-wide phone frame for preview).

## Files
- `index.html` — clickable prototype (home/glycemia/chat/diary/market + add & sugar bottom sheets)
- `Primitives.jsx` — Button, Chip, Card, ChatBubble, TabBar, FAB, BottomSheet, Icon
- `Screens.jsx` — ScreenMain, ScreenGlycemia, ScreenChat, ScreenDiary, ScreenMarket, GlycemiaChart, TimeInRange

## Source of truth
- Figma page: `/IntelDoc_UI/*`
- Uploaded PNGs: all seven `Screen *.png` and nine `Bottom sheet *.png` renders

## Notes / caveats
- **Iconsax** (Vuesax) originals were substituted with Lucide-style inline SVG paths at matching stroke weight. Swap `IntelDocIcons` in `Primitives.jsx` if you receive the real set.
- Home-screen star behind the Time-in-Range badge is omitted in this pass.
- The Profile / My Trackings / edit-name / dictation sheets are designed in the Figma but not yet rebuilt here; they reuse primitives already exported.
