const trim = (str: string, from: number, to?: number) => {
  if (to) {
    return `${str.slice(0, from)}...${str.slice(str.length - to, str.length)}`;
  } else {
    return str.slice(0, from);
  }
};

export { trim };
