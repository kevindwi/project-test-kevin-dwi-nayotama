export const changeHostname = (oldUrl) => {
  var url = new URL(oldUrl);
  url.hostname = "suitmedia.static-assets.id";
  return url.href;
};

export const decodeHTML = (html) => {
  const parser = new DOMParser();
  const decoded = parser.parseFromString(html, "text/html");
  return decoded.documentElement.textContent;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const days = date.getDate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = date.getFullYear().toString();
  const month = months[date.getMonth()];
  return `${days} ${month} ${year}`;
};
