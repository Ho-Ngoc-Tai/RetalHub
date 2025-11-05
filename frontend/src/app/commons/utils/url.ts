import { omit } from "lodash";

export function object2StringQuery(object: object) {
  if (!object) return "";
  const obj = Object.fromEntries(Object.entries(object).filter(([, v]) => v !== null && v !== undefined && v !== ""));
  const queryString = new URLSearchParams(omit({ ...obj }, ["limit"])).toString();
  return queryString;
}

export function removeEmptyObject(object: object) {
  return Object.fromEntries(Object.entries(object).filter(([, v]) => v !== null && v !== undefined && v !== ""));
}
