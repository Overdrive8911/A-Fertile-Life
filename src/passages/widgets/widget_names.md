# Widget names and information

## List of Widgets

1. `<<PC>>` - This widget gives the player's name color e.g `The player's name is <<PC>>`.
2. `<<changePCPersonality>>` - This widget is used to increment or decrement the PC's personality as well as also increasing and decreasing other personality values depending on some situations  e.g `<<changePCPersonality "personality" value>>` where `"personality"` is the name of any valid personality found in `$player.personality` and `value` is the amount to raise it by
3. `<<updatePlayerStats>>` - Updates the 6 stats that are displayed.
4. `<<character>>...<</character>>` - Adds the appropriate character icon to some text.

## TODO

1. [ ] Allow `<<PC>>` to return the player's first name by default as well as the full name if given the "full" parameter.
