import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // We are in the browser and metamask is running.

  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
  // console.log("ethereum");
} else {
  // We are on the server *OR* the user is not running metamask
  // console.log("no ethereum");
  const provider = new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_INFURA_ROBSTEN_URL);
  web3 = new Web3(provider);
}
// const provider = new Web3.providers.HttpProvider(process.env.NEXT_PUBLIC_INFURA_ROBSTEN_URL);
// web3 = new Web3(provider);
// web3.eth.accounts.wallet.create(
//   2,
//   "54674321§3456764321§345674321§3453647544±±±§±±±!!!43534534534534"
// );
// console.log("web3", web3.eth);

export default web3;

// import Web3 from "web3";
// import Web3Modal from "web3modal";
// let web3;
// if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
//   const providerOptions = {
//     /* See Provider Options Section */
//   };

//   const web3Modal = new Web3Modal({
//     network: "ropsten", // optional
//     cacheProvider: true, // optional
//     providerOptions, // required
//   });

//   const provider = await web3Modal.connect();

//   web3 = new Web3(provider);
// }

// export default web3;
