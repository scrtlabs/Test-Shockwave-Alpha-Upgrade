const { spawn } = require("child_process");
import { SecretNetworkClient, Wallet } from "secretjs";

async function main() {
  const wallet = new Wallet(
    "cost member exercise evoke isolate gift cattle move bundle assume spell face balance lesson resemble orange bench surge now unhappy potato dress number acid"
  );

  const secretjs = SecretNetworkClient.create({
    chainId: "shockwavealpha-1",
    grpcWebUrl: "http://localhost:9091",
    wallet,
    walletAddress: wallet.address,
  });

  const v1_2 = spawn("bash", [
    "-c",
    `SGX_MODE=SW SCRT_SGX_STORAGE="${__dirname}/.sgx_secrets" LD_LIBRARY_PATH="$LD_LIBRARY_PATH:${__dirname}" RUST_BACKTRACE=1 ./secretd --home "${__dirname}/.secretd" start --bootstrap`,
  ]);
}

main();
