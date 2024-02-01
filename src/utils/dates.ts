// FORMAT TO 1 OR 2 IN 01 AND 02
const format = (num = 0) => {
  if(num < 10 && num > 0) {
    return `0${num}`
  }
  return num;
}

export const currentDay = () => {
  const date = new Date();
  return `${date.getFullYear()}-${format(date.getMonth() + 1)}-${format(date.getDate())}`;
}

export const firstOfMOnth = () => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth()+1}-01`;
}

export const lastOfMonth = () => { 
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth()+1}-31`;
}

export const yesterday = () => {
  const date = new Date();
  return `${date.getFullYear()}-${format(date.getMonth() + 1)}-${format(date.getDate() == 1 ? date.getDate() : date.getDate() - 1)}`;
}


