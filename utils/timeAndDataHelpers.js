// Create a function that returns the current local time in 24hr format with seconds

export const getCurrentTime = () => {
  const date = new Date();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const time = `${hours}:${minutes}:${seconds}`;
  return time;
};


// Create a function that will get the current date in the format YYYY-MM-DD
export const getCurrentDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dateString = `${year}-${month}-${day}`;
  return dateString;
}

// convert date string to date format Sunday, January 1
export const convertDateString = (date) => {
  const dateObj = new Date(date);
  const day = dateObj.toString().slice(0, 3);
  const month = dateObj.toString().slice(4, 7);
  const dayNum = dateObj.toString().slice(8, 10);
  const dateString = `${day}, ${month} ${dayNum}`;
  return dateString;
}
