// memorization for performance; don't use this for mutable function
export default function(fun) {
  const cache = {};

  return function(...args){
    const key = JSON.stringify(args);

    // fetch
    let hit = cache[key];
    if (typeof hit !== 'undefined') {
      return typeof hit === 'object' && hit !== null
        ? JSON.parse(JSON.stringify(hit))
        : hit
    }

    // put
    let result = fun.apply(this, args);
    cache[key] = result;
    setTimeout(() => { delete cache[key]; }, 60 * 60 * 1000); // ttl is 1 hour

    return typeof result === 'object' && result !== null
      ? JSON.parse(JSON.stringify(result))
      : result
  }
}
