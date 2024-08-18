// A bunch of locations represent single floors of a total structure/building. This should help with grouping them
const gRelatedLocations: RelatedMapLocations = {
  [MapLocationContainer.FERTILO_INC]: {
    name: "Fertilo Inc",
    generalCoords: [45000, 45000],
    relatedLocations: [
      MapLocation.FERTILO_INC_FIRST_FLOOR_UNDERGROUND,
      MapLocation.FERTILO_INC_GROUND_FLOOR,
      MapLocation.FERTILO_INC_FIRST_FLOOR,
      MapLocation.FERTILO_INC_SECOND_FLOOR,
      MapLocation.FERTILO_INC_THIRD_FLOOR,
      MapLocation.FERTILO_INC_TOP_FLOOR,
    ],
  },
};
