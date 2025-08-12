// I used 3.02 mph as the average and scaled it down to metres per second
// NOTE - It should take, on average, 10 seconds to leave a room for the immediate one close by (e.g a room with coords [2,6] to another with coords [2,7]) so every single value difference in coordinates (or the result of `getDistanceBetweenTwoPoints` times 10) is worth 10 seconds at the `averageWalkingSpeed` i.e (1/ averageWalkingSpeed * (INSERT EXTRA VALUES HERE) = 10 on average).
const AVERAGE_WALKING_SPEED = [1.35, "metres", "second"] as const;

export { AVERAGE_WALKING_SPEED };
