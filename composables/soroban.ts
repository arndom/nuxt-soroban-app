import { defaultSorobanContext } from "~/services/soroban-core/soroban-context-defaults";
import type { SorobanContextType, SorobanProviderProps } from "~/services/soroban-core/soroban-context-types";
import { fromURLToHorizonServer, fromURLToServer } from "~/services/soroban-core/soroban-context-utils";

export const useSoroban = () => useState<SorobanContextType>('mySorobanContext', () => {
  const props: SorobanProviderProps = {
    autoconnect: false,
    deployments: [],
    ...defaultSorobanContext,
  }

  const { appName, autoconnect, chains, activeChain, connectors, deployments } = props;
  let { server, serverHorizon } = props;

  const activeConnector =
  connectors.length && connectors.length > 1 ? connectors[1] : connectors[0];

  if (activeChain?.sorobanRpcUrl) {
    server = fromURLToServer(activeChain.sorobanRpcUrl)
  }

  if (activeChain?.networkUrl) {
    serverHorizon = fromURLToHorizonServer(activeChain.networkUrl)
  }

  return {
    ...defaultSorobanContext,
    deployments,
    appName,
    autoconnect,
    chains,
    connectors,
    activeConnector,
    activeChain,
    server,
    serverHorizon,
  }
})