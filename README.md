# uniswap-universal-publisher
Publishing Universal-Router decoded data by GraphQL mutation from the latest txpool and transaction in Ethereum

# Prerequisite

- GraphQL: Need to properly set up for the use of mutation
- Mongo DB: The data will regist to Mongo DB via GraphQL mutation

# Installation and Running

##  1. Install Node Js

```bash
$ sudo apt install nodejs
```

## 2. [Install uniswap-universal-decoder](https://github.com/HiroyukiNaito/uniswap-universal-decoder)

```bash
$ cd ./[application execute path]
$ git clone https://github.com/HiroyukiNaito/uniswap-universal-decoder.git
$ cd uniswap-universal-decoder
$ yarn install 
```

## 3. Install uniswap-universal-publisher

```bash
$ cd ./[application execute path]
$ git clone https://github.com/HiroyukiNaito/uniswap-universal-publisher.git
$ cd uniswap-universal-publisher
$ yarn install 
```

## 4. Set environmental valuables of uniswap-universal-batcher

```bash
$ vi .env
```
```bash
# Designate proper GraphQL endpoint
GRAPHQL_URL=http://localhost:4000/graphql

# Node.js heap size
NODE_OPTIONS="--max-old-space-size=4046"

# L1 Uniswap Universal Router Address
UNIVERSAL_ROUTER_ADDRESS=0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD

# Your L1 Websocket RPC endpoint url 
RPC_WEBSOCKET_URL=ws://localhost:8546

# L2 Uniswap Universal Router Address
L2_UNIVERSAL_ROUTER_ADDRESS=0x198EF79F1F515F02dFE9e3115eD9fC07183f02fC

# Your L2 Websocket RPC endpoint url
L2_RPC_WEBSOCKET_URL=ws://localhost:9546

# CAUTION: If you don't have L2 RPC endpoint, please assign empty value (ex. L2_RPC_WEBSOCKET_URL="")
# Currently supports only Optimism and Base
# Will skip obtain L2 endpoint data
```

## 5. Export environmental valuables
```bash
$ export $(cat .env | xargs)
```

## 6. Run the app
```bash
$ node runPublish.js
```
