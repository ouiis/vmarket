export default function (timestamp) {
  let time = new Date(timestamp * 1000);
  let yyyy = time.getFullYear();
  let mm = ("0" + (time.getMonth() + 1)).substr(-2);
  let dd = ("0" + time.getDate()).substr(-2);

  return `${yyyy}-${mm}-${dd}`;
}