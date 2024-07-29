/**
 * This function is responsible to convert seedPhrase string in to array of words
 * @param str seedPhrase string
 *
 * @returns words  string[]
 */
export const convertMnemonicToArray = (str: string) => {
  const words = str.split(" ");
  for (let i = 0; i < words.length - 1; i++) {
    words[i] += "";
  }
  return words;
};
