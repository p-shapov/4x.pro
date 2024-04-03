import dayjs from "dayjs";

const getNow = () => {
  return dayjs();
};

const getNowUnix = () => {
  return getNow().unix();
};

export { getNow, getNowUnix };
