export function signTypedData(web3Instance, messageParams, from) {
  return new Promise((resolve, reject) => {
    const jsonRPCRequest = {
      method: 'eth_signTypedData',
      params: [messageParams, from],
      jsonrpc: '2.0',
      id: new Date().getTime(),
    };

    web3Instance.currentProvider.send(jsonRPCRequest, (error, result) => {
      if (error || result.error) {
        return reject(error || result.error);
      }

      return resolve(result.result);
    });
  });
}
