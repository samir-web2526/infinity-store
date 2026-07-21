const USD_TO_BDT = 60;

export function convertToBDT(dollarAmount) {
  return Math.round(dollarAmount * USD_TO_BDT);
}

export function formatBDT(amount) {
  return `৳${convertToBDT(amount).toLocaleString("en-BD")}`;
}
