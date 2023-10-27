// Importing modules
const ethers = require("ethers");
const pino = require('pino');
const logger = pino({
  level: process.env.PINO_LOG_LEVEL || 'info',
  formatters: {
    bindings: (bindings) => ({ pid: bindings.pid, host: bindings.hostname }),
    level: (label) => ({ level: label.toUpperCase()}),
    },
    timestamp: pino.stdTimeFunctions.isoTime,
});
const util = require("util");
const {
    hasUniswapCommands,
    uniswapFullDecodedInput,
} = require("../uniswap-universal-decoder/universalDecoder");

// Publishing txpool data by Graphql Mutation call
const txpoolMutation = async (args) => {
    const router = args["router"];
    const wssUrl = args["wss"];
    const layer = args["layer"];
    const provider = new ethers.WebSocketProvider(wssUrl); 
    provider.on('pending', async (tx) => {
             const txnData = await provider.getTransaction(tx);
                (txnData) 
                 ? ((txnData.to === router && hasUniswapCommands(txnData["data"])) 
                    ? (async () => {
                        const decodedData =  uniswapFullDecodedInput(txnData["data"]);
                        const fullData = Object.assign({}, txnData, {"decodedData": decodedData, "createdAt": new Date()});
                        const query = createMutaionString(fullData, args["TxpoolMutation"], args["TxpoolMutationMethod"]);
                        await (callMutation(query))(args["graphql"]).
                            then(result => logger.info({result: result}, `${layer}: Txpool Data Published`)).
                            catch(error => logger.error(error, `${layer}: Txpool Data Publish error!`));
                      })()
                    : null)  
                : null ;                 
    })
};

// Publishing Transaction data by Graphql Mutation call
const txMutation = async (args) => {
    const router = args["router"];
    const wssUrl = args["wss"];
    const layer = args["layer"];
    const provider = new ethers.WebSocketProvider(wssUrl); 
    provider.on('block', async (tx) => {
                const blockHeader = await provider.getBlock(tx);
                const blockHashList = blockHeader["transactions"];
                await Promise.all(blockHashList.map(async (j) => { 
                      const txnData = await provider.getTransaction(j);
                      (txnData["to"] === router && hasUniswapCommands(txnData["data"])) 
                        ? (async () => {
                            const decodedData =  uniswapFullDecodedInput(txnData["data"]);
                            const fullData = Object.assign({}, txnData, {"decodedData": decodedData,"blockHeader": blockHeader, "createdAt": new Date()})
                            const query = createMutaionString(fullData, args["TxnMutation"], args["TxnMutationMethod"]);
                            await (callMutation(query))(args["graphql"]).
                                then(result => logger.info({result: result}, `${layer}: Transaction Data Published`)).
                                catch(error => logger.error(error, `${layer}: Transaction Data Publish error!`));
                          })()
                        : null;             
                }));
    })
};

const createMutaionString =  (fullData, mutationName, mutationMethod) => {
   // Bigint to String
   const jsonData = JSON.stringify(fullData, (_, v) => typeof v === 'bigint' ? v.toString() : v);
   // Removing double quotation of keys in the dictionary
   const data = jsonData.replace(/"([^"]+)":/g, '$1:');
   const query = JSON.stringify({
      query: `mutation {
          ${mutationName}(
            ${mutationMethod}: ${data}
          ) {
            hash
          }
        }`})
    return query
}

const callMutation = (query) => async (graphqlUrl) =>  {
    const response = await fetch(graphqlUrl, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: query
        });
    const responseData = await response.json();
    return responseData
}

const runPublish = (args) => {
    // L2 don't have txpool basically, so only call txMutation(args)
     args["layer"]==="l1"  
      ?  (txpoolMutation(args),txMutation(args))  
      :  txMutation(args);
}

module.exports = {
    txpoolMutation,
    txMutation,
    createMutaionString,
    callMutation,
    runPublish,
    logger
};
