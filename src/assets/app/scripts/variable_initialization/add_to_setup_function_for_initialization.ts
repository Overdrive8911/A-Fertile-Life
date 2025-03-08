import { saveVar_gameDateAndTime } from "./general_variables";
import { saveVar_player } from "./player_variables";

setup.initializeSaveVariables = () => {
  // SECTION - STATE DATA
  variables().gameDateAndTime = saveVar_gameDateAndTime;
  variables().player = saveVar_player;

  // SECTION - STATIC DATA
};
