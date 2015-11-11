export default function sequence(length = 100, monomers = 'acgt') {
  const monos = monomers.split('');
  const seq = []; //this is by reference, not by value

  for (let index = 0; index < length; index++) {
    const rando = Math.floor(Math.random() * 4);
    seq.push(monos[rando]);
  }

  return seq.join('');
}
