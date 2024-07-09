const isLiableForBirth = (womb: Womb) => {
  // This will check to see if an inputted womb is ready to giving birth, regardless of the actual chance of a successful delivery
  // Include something to account for superfetation. Like a giant IF statement
  // If the womb's current capacity is within 90% of the max capacity, force birth ASAP
  // Check whether if all the fetuses are in the development range for birthing. If false, prevent birth so long as the womb's max capacity has not been exceeded/near. If true, create a random choice that decides whether it's time to birth. Increase the chance as gestational weeks progress
};
