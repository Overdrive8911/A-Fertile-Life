setup.updateGameTimeVariable = (timeInSeconds: number) => {
  // copy out the date
  const oldDate = new Date(variables().gameTime);

  // Convert to milliseconds and add to the old date
  variables().gameTime = new Date(oldDate.getTime() + 1000 * timeInSeconds);
};
