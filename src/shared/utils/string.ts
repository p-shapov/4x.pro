const trim = (str: string, from: number, to: number) => {
  return `${str.slice(0, from)}...${str.slice(str.length - to, str.length)}`;
};

export { trim };
