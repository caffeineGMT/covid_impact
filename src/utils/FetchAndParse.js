import * as d3 from "d3";

export default async function fetchAndParse(path, parseCallBack) {
  const data = await d3.csv(path);
  return parseCallBack(data);
}
