export const enum StoryFlags {
  NONE = 0,
  /**
   * Used to determine if a particular story-important scene is active
   */
  IS_EVENT_ACTIVE = 1 << 0,
}

/**
 * NOTE: **This only tests if all the bits in the flag match, otherwise it returns false. So be careful with it for flags with multiple set bits. Use `isAnyStoryFlagActive()` instead.**
 */
export function areAllStoryFlagSet(flag: StoryFlags) {
  return (variables().storyFlags & flag) == StoryFlags.NONE ? false : true
}

export function isAnyStoryFlagSet(flags: StoryFlags) {
  return variables().storyFlags & flags ? true : false
}

export function setStoryFlag(flag: StoryFlags) {
  variables().storyFlags |= flag
}

export function clearStoryFlag(flag: StoryFlags) {
  variables().storyFlags &= ~flag
}

export function toggleStoryFlag(flag: StoryFlags) {
  variables().storyFlags ^= flag
}
