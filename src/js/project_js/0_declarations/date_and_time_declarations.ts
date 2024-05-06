setup.updateGameTimeVariable = (timeInSeconds: number) => {
  // copy out the date
  const oldDate = new Date(variables().gameDateAndTime);

  // Convert to milliseconds and add to the old date
  variables().gameDateAndTime = new Date(
    oldDate.getTime() + 1000 * timeInSeconds
  );
};
