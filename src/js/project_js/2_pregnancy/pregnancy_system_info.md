1. Pregnancy is started when the function `tryCreatePregnancy()` is called. It accepts the virility and a special bonus for it (which is affected by other things including drugs) as well as a `Womb` object, of which, the required fertility and appropriate bonuses are calculated.
2. In it, it calls `tryToImpregnate()` which determines if conception suceeds, after which, the rest of the original function is run.
3. Depending on the fertility, verility and some randomness, a specific amount of fetuses that can grow to maturity without much complications are generated
