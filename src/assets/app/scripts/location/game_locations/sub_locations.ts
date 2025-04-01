/* NOTE: Due to the way that UUIDs are generated, changing the order of class instantiation may result in regenerating UUIDs and may also result in inconsistencies with the player's save data. 

As such, ensure that all "safe zones", which are areas where the player's can confidently save without the risk of issues, are defined at the top of this file and should NEVER have their positions altered unless you want to break them :p 

Edit: I've added a safeguard that'll prevent the saved area id from messing up too bad as long as the passage doesn't *also* change. 

TLDR: Don't think too much about anything if only a single area is attached to a passage. Even if multiple are attached to a passage, it shouldn't be much of an issue as long as you don't mess up the order. Even if you do, worst case scenario is that the player get's warped to a similar passage (and I'll probably implement a tool to manually fix that).

If the player stays in a "safe-zone", this is a non-issue. */
