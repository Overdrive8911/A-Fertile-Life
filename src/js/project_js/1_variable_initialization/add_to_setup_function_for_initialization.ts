setup.initializeSaveVariables = () => {
  // SECTION - STATE DATA
  variables().gameDateAndTime = saveVar_gameDateAndTime;
  variables().player = saveVar_player;
  // TODO - lastPregUpdateFunctionCall seems redundant
  variables().lastPregUpdateFunctionCall = saveVar_lastPregUpdateFunctionCall;

  // SECTION - STATIC DATA
};
