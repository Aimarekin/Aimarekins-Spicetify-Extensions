function hook(hookFrom, hookTo) {
    const fromProto = Object.getPrototypeOf(hookFrom);
    const originalFunc = fromProto[hookTo];
    let call = 0;
    fromProto[hookTo] = new Proxy(originalFunc, {
        apply: function(target, thisArg, argumentsList) {
            const result = target.apply(thisArg, argumentsList);
            console.log(`CALL #${call++} TO ${hookTo}.\nTHIS:`, thisArg, "\nARGS:", argumentsList, "\nRESULT:", result);
            return result;
        }
    })
    console.log("HOOKED TO:", hookFrom, "\nFUNCTION:", hookTo, " - ", originalFunc);
}