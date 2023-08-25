titleize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

statFormalizer = (string) => {
  if (/-/gi.test(string) === false) return string;
  if (/attack/gi.test(string) === true) return 'spAtk';
  if (/defense/gi.test(string) === true) return 'spDef';
};

formalizeHeightAndWeight = (number) => {
  return number / 10;
};

unitFormalizer = (string) => {
  if (/height/gi.test(string)) return ' m';
  if (/weight/gi.test(string)) return ' kg';
  return '';
};
