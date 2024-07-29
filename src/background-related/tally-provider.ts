import { Web3Provider } from "@ethersproject/providers";
import { DAPPEVENTS } from "utils/constants";
import { EVMNetwork, toHexChainID } from "./networks";

// Not sure the best place to put this in but it feels like it deserves its own file.
export default class TallyWeb3Provider extends Web3Provider {
  switchChain(network: EVMNetwork): Promise<unknown> {
    return this.send(DAPPEVENTS.switchNetwork, [
      {
        chainId: toHexChainID(network.chainID),
      },
    ]);
  }
}
