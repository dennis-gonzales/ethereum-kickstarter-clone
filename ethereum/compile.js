const path = require('path');
const fse = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
const campaignPath = path.resolve(__dirname, 'contracts', 'Campaign.sol');

const source = fse.readFileSync(campaignPath, 'utf-8');
const output = solc.compile(source, 1).contracts;

fse.removeSync(buildPath);
fse.ensureDirSync(buildPath);

for (let contract in output) {
    fse.outputJSONSync(
        path.resolve(buildPath, `${contract.replace(':', '')}.json`),
        output[contract]
    );
}