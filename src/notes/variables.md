# Variables

## Story Variables

## Player Variables

### $player

$player is an object that contains the PC data. It's defaults can be found in ::StoryInit. Some variables can produce different descriptions if they have specific values, e.g ShortStack, Heavyset, RailThin, etc.

- .name : Accepts string. Stores the PC's name.

- .weight : Accepts int. Stores the PC's weight in kg. During character creation, a minimum of 55 and max of 80 is enforced. Depending on the value, the PC can be Emaciated, Underweight, Average, Pudgy, Chubby, Curvy, Overweight, Fat, Obese.

- .height : Accepts int. Stores the PC's height in cm. During character creation, a minimum of 140 and max of 180 is enforced. Depending on the value, the PC can be Dwarf, Very Short, Short, Somewhat Short, Average, Somewhat Tall, Tall, Very Tall, MiniGiant.

- .wombHp : Accepts int. Stores a value from 0 till 100. Determines how healthy the PC's womb is.

- .wombCap : Accepts int. Stores /_TODO - Continue this later _/
