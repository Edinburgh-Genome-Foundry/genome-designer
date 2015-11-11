export default function UUID() {
  let date = new Date().getTime();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function replacer(frag) {
    const replacement = (date + Math.random() * 16) % 16 | 0;
    date = Math.floor(date / 16);
    return (frag === 'x' ? replacement : (replacement & 0x3 | 0x8)).toString(16);
  });
}
