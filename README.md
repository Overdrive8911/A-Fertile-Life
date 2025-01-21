# A Fertile Life

## Compiling the game

Run `./build` for the regular game of `./build -t` for testing.

## To Note

- Try to reduce the use of ids in css as much as possible. You can use id attributes, i.e [id="..."] instead (make sure to only use this in the "base" folder).
- Every passage should be given the appropriate tags. If a passage occurs in a particular location, give it tags prepended by `location_` and/or `subLocation_` as required. Ensure that these locations have corresponding co-ordinates in `locationDataObject` in `location_declarations.ts`
