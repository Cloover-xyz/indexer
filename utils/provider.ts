import { RpcProvider } from "starknet";
import { record, z } from "zod";
import { ENV } from "./env";

export const Networks = z.enum(["mainnet", "sepolia"]);
export type NetworkType = z.infer<typeof Networks>;

const NetworkNodeUrlsSchema = record(Networks, z.string());
type NetworkNodeUrlsType = z.infer<typeof NetworkNodeUrlsSchema>;

const NETWORK_NODE_URLS: NetworkNodeUrlsType = {
  mainnet: `https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_7/${ENV.ALCHEMY_API_KEY}`,
  sepolia: `https://starknet-sepolia.g.alchemy.com/starknet/version/rpc/v0_7/${ENV.ALCHEMY_API_KEY}`,
};

export const getStarknetProvider = (network: NetworkType) => {
  return new RpcProvider({
    nodeUrl: NETWORK_NODE_URLS[network],
  });
};

export const getValidatedNetwork = (network: string) => {
  const validatedNetwork = Networks.safeParse(network);
  if (!validatedNetwork.success) {
    throw new Error(`Invalid network: ${network} ${validatedNetwork.error}`);
  }
  return validatedNetwork.data;
};
