const networks = ["solana"] as const;
type Network = (typeof networks)[number];

type NetworkConfig = {
  NetworkRPCURLs: Record<Network, string>;
  NetworkLabels: Record<Network, string>;
};

const NetworkLabels: Record<Network, string> = {
  solana: "Solana",
};

const NetworkRPCURLs: Record<Network, string> = {
  solana: process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
};

const networkConfig: NetworkConfig = {
  NetworkRPCURLs,
  NetworkLabels,
};

export { networks, networkConfig };
export type { Network };
