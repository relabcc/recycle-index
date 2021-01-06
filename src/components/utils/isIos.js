import Bowser from 'bowser';

let isIos;
if (typeof window !== 'undefined') {
  const browser = Bowser.getParser(window.navigator.userAgent);
  isIos = browser.getOSName() === 'iOS' || window.location.search.includes('ios');
}

export default isIos
