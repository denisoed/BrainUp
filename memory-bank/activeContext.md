# Active Context

## Current Focus
- ✅ Articulation difficulty system implementation
- ✅ Improved progress display logic for articulation metrics
- ✅ Fixed face mask mirroring for articulation game
- Performance optimization and user experience improvements
- Memory Bank maintenance

## Recent Changes
- **Fixed Face Mask Mirroring**: Resolved issue where face landmarks didn't align with mirrored video
  - Modified `drawFullFaceMask` to apply canvas transformation (scale + translate)
  - Updated `drawSimpleLandmarks` to mirror x-coordinates manually
  - Now face mask properly overlays on mirrored video feed
  - Enhanced visual feedback accuracy for articulation exercises
- **Improved Articulation Progress Display**: Fixed progress bar logic to show relative progress towards target thresholds
  - Changed metrics display to show only relevant metrics for current exercise
  - Progress bars now show percentage towards required threshold (not absolute values)
  - Added visual indicators for achieved targets (green color)
  - Improved UX with target-based progress calculation
  - Enhanced accessibility by showing only active metrics

- **Articulation Difficulty System**: Implemented complete difficulty system for articulation exercises
  - Added difficulty settings UI in SettingsPage.vue (easy/medium/hard)
  - Added localization for difficulty settings in ru.json and en.json
  - Integrated localStorage for difficulty settings persistence
  - Modified ArticulationGame.vue to use getExercisesByDifficulty function
  - System filters exercises by targets count: easy (1), medium (2), hard (3+)
  - Current distribution: 1 easy, 4 medium, 0 hard exercises
  
- **Previous Optimization**: Reduced threshold values and hold times for all articulation exercises
  - lip_round_smile: reduced lipRound from 0.35 to 0.25, lipStretch from 0.60 to 0.45, holdMs from 2000 to 1500
  - jaw_open_close: reduced jawOpen from 0.4 to 0.3, holdMs from 1500 to 1000
  - lip_stretch: reduced lipStretch from 0.7 to 0.5, holdMs from 2000 to 1500
  - lip_pucker: reduced lipRound from 0.5 to 0.35, holdMs from 1500 to 1000
  - mouth_alternate: reduced jawOpen from 0.3 to 0.2, lipRound from 0.2 to 0.15, holdMs from 1000 to 800

## Next Steps
1. Test updated progress display logic with real users
2. Test difficulty system with real users
3. Consider adding more hard exercises (3+ targets)
4. Monitor user feedback and adjust systems if needed
5. Continue feature development
6. Maintain documentation

## Active Decisions
- Using Vue 3 with Composition API
- Pinia for state management
- TypeScript for type safety
- Vite as build tool
- Cypress for e2e testing
- localStorage for user preferences persistence
- Target-based difficulty classification for exercises

## Current Considerations
- User experience optimization for articulation exercises
- Balancing exercise difficulty distribution
- Performance optimization strategies
- Testing coverage requirements
- Future expansion of exercise library 