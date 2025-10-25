# How Pregnancy works

- A `Womb` may be inseminated by an `InseminatorSource` which may impregnate it depending on their combined fertility + virility.
- When a `Womb` is impregnated, a new `Pregnancy` instance is initialized and stored within it.
  - This is to make handling superfetation easier (because in that case multiple pregnancies with different factors and birth dates will have to coexist), but for the most part, there'd be only a single `Pregnancy` instance in a womb.
-  When a`Pregnancy` instance is to be initialized, it must be given` the number of `Fetus`es to spawn.
	- `Fetus`es in a `Pregnancy` may grow at slightly different rates but will be birthed together at the same time.
- As time passes, `Fetus`es' stats rise, in turn increasing their `Pregnancy`'s stats and the `Womb`'s volume too.
-
