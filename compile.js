const path = require('path');
const fs = require('fs');
const solc = require('solc');

const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');

module.exports = solc.compile(source, 1).contracts[':Campaign'];
/*
    Requiring compile.sj script(Creating an instance) returns a:
    Interface ->  ABI
    Bytecode -> Compiled contract 
*/