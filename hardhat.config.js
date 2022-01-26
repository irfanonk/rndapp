/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-waffle");
require("dotenv/config");

const { HARDHAT_PORT } = process.env;

module.exports = {
  solidity: "0.7.3",
  networks: {
    localhost: { url: `http://127.0.0.1:${HARDHAT_PORT}` },
    hardhat: {
      accounts: [{"privateKey":"0xf57a3243def5a09c60cf90decaa7a887ed4c1a6c9caabd11ced7df6d982f91fd","balance":"1000000000000000000000"},{"privateKey":"0xe1df9dab6479da4ba4f4d20271b1e6d5eb38cdb50b8456096dafe704f7b69e6d","balance":"1000000000000000000000"},{"privateKey":"0xf49009d362b1ebbaef80430e28600d2a09943e483b6f618e07535de5fc7b43e9","balance":"1000000000000000000000"},{"privateKey":"0x460799735aa52facc811a4735ca56abbe3ef0fef218a6cc1a2118e8ef7069de1","balance":"1000000000000000000000"},{"privateKey":"0x025b2161e629b5e9f9e696ccc3decb438a34affa24ae92df92fb99c5028c79b6","balance":"1000000000000000000000"},{"privateKey":"0xc216af0e546fe1d31b99c09b81361a3248cc2b058e49b8b8a09049c5780ad8de","balance":"1000000000000000000000"},{"privateKey":"0x0f2de2efdd3927a8e49f6e547362007456d20dbe6a74f70d94bc495b28b5cc45","balance":"1000000000000000000000"},{"privateKey":"0x21463be8459c1efafe02dc04b689faceb62173c11c52119bbcec55c6ab7b5cad","balance":"1000000000000000000000"},{"privateKey":"0x1e71c22f29f94c53b4b8750506bdeb5f4a49fc3f7061a523740d88b2db1f70ff","balance":"1000000000000000000000"},{"privateKey":"0xec340b495cfee819f4007209d9a24d9a6f264ed3d30ddc5b31521c00bfa9b8c7","balance":"1000000000000000000000"}]
    },
  },
  paths: {
    sources: './contracts',
    tests: './__tests__/contracts',
    cache: './cache',
    artifacts: './artifacts',
  },
};