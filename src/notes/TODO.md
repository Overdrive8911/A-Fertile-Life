# TODO

- [ ] Improve the numberslider macro so that it can also accept decimals as its start, end, and default values
- [ ] The PC should be able to should be able to have 3 personalities that are decided by the user's choices, namely; enthusiastic, apathetic, and disapproving of pregnancy. This will decide a couple of their actions and what they'll say. Basically, just ass a proper personality system.
- [ ] Whenever a stat changes, the associated text should be coloured depending on if the stat change was "good" or not.
- [ ] Allow the player to choose their general nationality.
- [ ] Make a widget that'll make all the `<span class="…speech">…</span>` unneeded.
- [ ] Add spaces to all `—` aka em-dash instances.
- [ ] Add a timetable that'll act as the schedule for the PC.
- [ ] Make the letter the PC reads at the start resemble an actual letter.
- [ ] Add a new readme to show th convention used in adding and editing twee files.
- [ ] Make the prologue much more interactive.
- [ ] Add different ways the player can meet Mr. Fert at the beginning of the game.
- [ ] Remove all unnecessary elements and optimize the game.
- [ ] Make a splash screen appear whenever a day/week/month/year passes.
- [ ] Include asset growth (bewbs, booty, thighs, hips, general rotundness, etc :D)
- [x] Implement hunger drain while pregnant (only applies to the player) (`2ce76f5efb79f3a6871485fead5cb8bf3a427ed1`)
  - [x] Should consider the development stage per fetus, number of fetuses, and a bit of each fetuses weight.
- [ ] Implement proper functionality of `curCapacity` and `maxCapacity` of the class `Womb`.
- [ ] Improve the birthing formula and make it more consistent.
- [ ] Implement perks. And the general ability to use items.
- [ ] Milk production
  - [ ] Starts when pregnant
  - [ ] Ends after a while when not pregnant. This duration can be extended if the player regularly milks themselves

Prevent `expToAdd` from returning a non-zero value if no time has passed.

Slightly reduce the chance of birth

## Perks and Side Effect Progress <!-- See `applyPerk()` and `applySideEffect()` in src\scripts\ts\0_declarations\preg\2_preg_class_definitions.ts -->

### Perks

- [x] Gestator
  - [x] Implement the speed boost for fetus growth (`0fd7a36aa1172685831a0dedcd7d698fd939698a`)
  - [x] Implement the hunger drain (`b7e164a4c160c81a08e76ca1b2c3b71af8cd3a86`)
- [x] Hyper Fertility (`104f40e85467bbc8192145c55621fc231aaa909a`. See `tryCreatePregnancy()` in specific)
- [x] Superfetation (`b0002902d972e0b343915c33efc64bf76f67b361`)
- [x] Elasticity (`48b8a262f557024ac92d5bd465747b90ea223b47`)
  - [x] Increase womb exp gained (up to 50%)
  - [x] Slightly increase both comfort and max capacity (up to 20%)
- [x] Immunity Boost (`b737b5158fc62934a5b2524dbe4e4837813dc637`)
- [ ] Motherly Hips
- [ ] Motherly Boobs
- [ ] Iron Spine
- [ ] Sensitive Womb
- [ ] Healthy Womb
- [ ] Fortified Womb
- [ ] No Postpartum
- [x] Add the ability to upgrade perks (`9af0138aeb123b7e31dc6dfa49517f7716c4a466`)
- [x] Only store the current level of perks in the save file. Use global variables for the other 2 (`1a598c034fce0b478d10e162f04ed246d2956523`)
- [ ] Add more perks like:
  - [ ] Polyhydramnios (excess amniotic fluid. No other benefits beyond bigger tum :3)

### Side Effects

- [ ] Craving Crisis
- [ ] Motherly Hunger
- [ ] Restless Brood
- [ ] Heavy Womb
- [ ] Contractions
- [ ] Labour
- [ ] Sex Craving (? Lol)
- [ ] Growth Spurt (? Forgot what this actually means)
- [x] Implement proper functionality of their duration (`f73517177739a842494b84333638721aca527d3b`)
