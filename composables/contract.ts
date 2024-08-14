import { contractInvoke, type InvokeArgs } from "~/services/soroban-contracts/contract-invoke"
import type { WrappedContract, WrappedContractInvokeArgs } from "~/services/soroban-contracts/types"
import { getDeployment } from "~/services/soroban-contracts/utils";

export const useContractID = () => useState<string>('contractID', () => '');

export const useRegisteredContract  = () => useState<WrappedContract | undefined>('wrappedContract', () => {
  const mySorobanContext = useSoroban();
  const getContractID = useContractID();

  const { deployments, activeChain }  = mySorobanContext.value;
  let networkPassphrase = activeChain?.networkPassphrase || '';
  const contractID = getContractID.value;

  if (!contractID) return undefined;

  const deploymentInfo = getDeployment(
    deployments || [],
    contractID,
    networkPassphrase
  );

  const wrappedInvokeFunction =  async (args: WrappedContractInvokeArgs) => {
    const contractInvokeArgs: InvokeArgs = {
      ...args,
      sorobanContext: mySorobanContext.value,
      contractAddress: deploymentInfo?.contractAddress!,
    }

    return contractInvoke(contractInvokeArgs)
  }

  if (!deploymentInfo) return undefined;

  const newWrappedContract = {
    deploymentInfo,
    invoke: wrappedInvokeFunction
  }

  return newWrappedContract;
})