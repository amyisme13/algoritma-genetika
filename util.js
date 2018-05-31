exports.randomNumber = (lower, upper, float = false) => {
  let l = lower;
  let u = upper;
  if (!upper) {
    l = 0;
    u = lower;
  }

  let ru = Math.random() * (u - l + 1);
  if (!float) {
    ru = Math.floor(ru);
  }
  const result = l + ru;

  if (result < lower) {
    return lower;
  }
  if (result > upper) {
    return upper;
  }
  return result;
};
