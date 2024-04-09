import dayjs from "dayjs";

import type { ResolutionString } from "@public/vendor/charting_library/charting_library";

function getNextBarTimeByResolution(
  resolution: ResolutionString,
  barTime: number,
) {
  const date = dayjs.utc(barTime);
  let nextDate: dayjs.Dayjs;
  switch (resolution) {
    case "30S":
      nextDate = dayjs.utc(date.add(30, "second"));
      break;
    case "1":
      nextDate = dayjs.utc(date.add(1, "minute"));
      break;
    case "5":
      nextDate = dayjs.utc(date.add(5, "minute"));
      break;
    case "15":
      nextDate = dayjs.utc(date.add(15, "minute"));
      break;
    case "30":
      nextDate = dayjs.utc(date.add(30, "minute"));
      break;
    case "60":
      nextDate = dayjs.utc(date.add(1, "hour"));
      break;
    case "120":
      nextDate = dayjs.utc(date.add(2, "hour"));
      break;
    case "240":
      nextDate = dayjs.utc(date.add(4, "hour"));
      break;
    case "360":
      nextDate = dayjs.utc(date.add(6, "hour"));
      break;
    case "720":
      nextDate = dayjs.utc(date.add(12, "hour"));
      break;
    case "D":
      nextDate = dayjs.utc(date.add(1, "day"));
      break;
    case "W":
      nextDate = dayjs.utc(date.add(1, "week"));
      break;
    case "M":
      nextDate = dayjs.utc(date.add(1, "month"));
      break;
    default:
      throw new Error("Unsupported resolution");
  }

  return nextDate.utc(false).unix();
}

export { getNextBarTimeByResolution };
