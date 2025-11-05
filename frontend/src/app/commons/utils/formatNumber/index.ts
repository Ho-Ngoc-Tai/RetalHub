export function formatNumber(price: number, decimaCount = 0, decimal = ".", thousands = ","): string {
  try {
    const amount = price;
    let decimalCount = Math.abs(decimaCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    const fixedAmount = Math.abs(Number(amount) || 0).toFixed(decimalCount);
    const i = parseInt(fixedAmount).toString();
    const j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousands}`) +
      (decimalCount
        ? decimal +
          Math.abs(Number(amount) - parseInt(i))
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch {
    // Handle error silently
  }
  return "";
}

export function formatShortNumber(num: number, digits?: number): string {
  try {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
    ];
    const regexp = /\.0+$|(?<=\.[0-9]*[1-9])0+$/;
    const item = lookup.findLast((item) => num >= item.value);

    return item ? (num / item.value).toFixed(digits).replace(regexp, "").concat(item.symbol) : "0";
  } catch {
    return num.toString();
  }
}

// decimal = 10,100,1000,....
export const roundedNumber = (number: number, decimal?: number): number | undefined => {
  try {
    if (typeof number !== "number") return;
    return Math.round(number * (decimal || 10)) / (decimal || 10);
  } catch {
    return number;
  }
};

export const generateUUID = () => {
  // Public Domain/MIT
  let d = new Date().getTime(); //Timestamp
  let d2 = (typeof performance !== "undefined" && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
};

export const numberNoItemIndex = (page: number | null, limit: number | null, index: number) => {
  return ((page ?? 1) - 1) * (limit ?? 10) + (index + 1);
};
