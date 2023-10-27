const {
    runPublish,
    logger
} = require("./publisher");

// setting arguments
const args = {
    "layer": "l1",
    "router" : process.env.UNIVERSAL_ROUTER_ADDRESS,
    "wss":  process.env.RPC_WEBSOCKET_URL,
    "graphql" : process.env.GRAPHQL_URL,
    "TxpoolMutation" : "createTxnPoolData",
    "TxpoolMutationMethod" : "newTxnPoolData",
    "TxnMutation" : "createTxnData",
    "TxnMutationMethod" : "newTxnData"
} 
const args2 = {
    "layer": "l2",
    "router" :  process.env.L2_UNIVERSAL_ROUTER_ADDRESS,
    "wss": process.env.L2_RPC_WEBSOCKET_URL,
    "graphql" : process.env.GRAPHQL_URL,
    "TxnMutation" : "createl2TxnData",
    "TxnMutationMethod" : "newl2TxnData"
}
process.env.RPC_WEBSOCKET_URL
    ? runPublish(args)
    : logger.info("No RPC settings! So, L1 mutation skipping");

process.env.L2_RPC_WEBSOCKET_URL 
    ? runPublish(args2) 
    : logger.info("No L2RPC settings! So, L2 mutation skipping");
