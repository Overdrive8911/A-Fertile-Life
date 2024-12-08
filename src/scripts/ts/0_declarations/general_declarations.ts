const getRandomNumberFromRangeInclusive = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};
const getWeightedAverage = (...input: number[]) => {
  // Get the total sum
  let sum = 0;
  input.forEach((number) => {
    sum += number;
  });
  console.log(`sum:${sum}`);

  // Use the sum to produce ratios and multiply each ratio by 100
  const weights = input.map((number) => {
    return (number / sum) * 100;
  });
  console.log(`weights:${weights}`);

  // Multiply each initial number and their weight, then obtain their sum
  // const weightedValues = input.map((number, index) => {
  //   return number * weights[index];
  // })
  let sumOfWeightedValues = 0;
  input.forEach((number, index) => {
    sumOfWeightedValues += number * weights[index];
  });

  // Divided the sum of weighted values by 100 and return the answer
  return sumOfWeightedValues / 100;
};
