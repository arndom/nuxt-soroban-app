<template>
  <slot />
</template>

<script setup lang="ts">
import { defaultSorobanContext } from "~/services/soroban-core/soroban-context-defaults";
import type { SorobanContextType, SorobanProviderProps } from "~/services/soroban-core/soroban-context-types"
import { fromURLToHorizonServer, fromURLToServer, networkToActiveChain } from "~/services/soroban-core/soroban-context-utils";
import * as StellarSdk from '@stellar/stellar-sdk'
import type { Connector, WalletChain } from "@soroban-react/types";

const props = withDefaults(defineProps<SorobanProviderProps>(), {
  autoconnect: false,
  deployments: () => [],
  server: () => defaultSorobanContext.server,
  serverHorizon: () => defaultSorobanContext.serverHorizon
})

const { appName, autoconnect, chains, activeChain, connectors, deployments } = props;
let { server, serverHorizon } = props;

const activeConnector =
  connectors.length && connectors.length > 1 ? connectors[1] : connectors[0];

const isConnectedRef = ref(false)
console.log('SorobanReactProvider is RELOADED')

if (activeChain?.sorobanRpcUrl) {
  server = fromURLToServer(activeChain.sorobanRpcUrl)
}

if (activeChain?.networkUrl) {
  serverHorizon = fromURLToHorizonServer(activeChain.networkUrl)
}

// const mySorobanContext: Ref<SorobanContextType> = ref({
//   ...defaultSorobanContext,
//   deployments,
//   appName,
//   autoconnect,
//   chains,
//   connectors,
//   activeConnector,
//   activeChain,
//   server,
//   serverHorizon,

//   connect: async () => {
//     console.log('ENTERING CONNECT with context: ', mySorobanContext)

//     if (mySorobanContext.value.activeConnector) {
//       // Now we will check if the wallet is freighter so that we keep the old way of choosing the network from the wallet for backward compatibility
//       if (mySorobanContext.value.activeConnector.id === 'freighter') {
//         let networkDetails =
//           await mySorobanContext.value.activeConnector.getNetworkDetails()

//         //TODO: TEMP FIX while waiting for freighter to fix soroban public rpc https://github.com/stellar/freighter/issues/1335
//         if (networkDetails.sorobanRpcUrl === "http://soroban-rpc-pubnet-prd.soroban-rpc-pubnet-prd.svc.cluster.local:8000") {
//           networkDetails.sorobanRpcUrl = "https://mainnet.stellar.validationcloud.io/v1/XFb5Lma6smizBnnRPEgYMbuNm0K3FWzJ7854GNSQ2EY"
//         }

//         let activeChain = networkToActiveChain(networkDetails, chains)

//         if (
//           !chains.find(
//             (c: any) =>
//               c.networkPassphrase === networkDetails?.networkPassphrase
//           )
//         ) {
//           const error = new Error(
//             'Your Wallet network is not supported in this app'
//           )
//           throw error
//         }

//         if (!networkDetails?.sorobanRpcUrl) {
//           const error = new Error(
//             'Soroban RPC URL is not set, please check your freighter wallet network configuration'
//           )
//           throw error
//         }

//         server =
//           networkDetails &&
//           new StellarSdk.SorobanRpc.Server(networkDetails.sorobanRpcUrl, {
//             allowHttp: networkDetails.sorobanRpcUrl.startsWith('http://'),
//           })

//         serverHorizon =
//           networkDetails &&
//           new StellarSdk.Horizon.Server(networkDetails.networkUrl, {
//             allowHttp: networkDetails.networkUrl.startsWith('http://'),
//           })

//         console.log(
//           'SorobanReactProvider: Connecting with FREIGHTER : ',
//           mySorobanContext.value.activeConnector.name
//         )

//         let address = await mySorobanContext.value.activeConnector.getPublicKey()

//         // Now we can track that the wallet is finally connected
//         isConnectedRef.value = true

//         // setSorobanContext((c: any) => ({
//         //   ...c,
//         //   activeChain,
//         //   address,
//         //   server,
//         //   serverHorizon,
//         // }))

//         mySorobanContext.value.activeChain = activeChain
//         mySorobanContext.value.address = address
//         mySorobanContext.value.server = server
//         mySorobanContext.value.serverHorizon = serverHorizon
//       }
//       // If connector is any other wallet that does not have getNetworkDetails we will need to set the active chain and server from somewehere else in the front end
//       else {
//         console.log(
//           'SorobanReactProvider: Connecting with ',
//           mySorobanContext.value.activeConnector.name
//         )
//         let address = await mySorobanContext.value.activeConnector.getPublicKey()

//         // Now we can track that the wallet is finally connected
//         isConnectedRef.value = true

//         // setSorobanContext((c: any) => ({
//         //   ...c,
//         //   address,
//         // }))

//         mySorobanContext.value.address = address
//       }
//     } else {
//       console.log('SorobanReactProvider: No active Connector')
//     }
//   },

//   disconnect: async () => {
//     isConnectedRef.value = false

//     // TODO: Maybe reset address to undefined
//     // TODO: Handle other things here, such as perhaps resetting address to undefined.
//     let address = undefined

//     // setSorobanContext((c: any) => ({
//     //   ...c,
//     //   address,
//     // }))

//     mySorobanContext.value.address = address
//   },

//   setActiveChain: (chain: WalletChain) => {
//     console.log('Chainging activeChain to : ', chain)

//     // When the user in frontend changes the activeChain to read the blockchain without wallet
//     let server: StellarSdk.SorobanRpc.Server | undefined = undefined,
//       serverHorizon: StellarSdk.Horizon.Server | undefined = undefined
//     const _activeChain = chain

//     if (_activeChain.sorobanRpcUrl) {
//       server = fromURLToServer(_activeChain.sorobanRpcUrl)
//     }

//     if (_activeChain.networkUrl) {
//       serverHorizon = fromURLToHorizonServer(_activeChain.networkUrl)
//     }

//     // setSorobanContext((c: any) => ({
//     //   ...c,
//     //   server,
//     //   serverHorizon,
//     //   activeChain,
//     // }))

//     mySorobanContext.value.server = server
//     mySorobanContext.value.serverHorizon = serverHorizon
//     mySorobanContext.value.activeChain = _activeChain


//   },

//   setActiveConnectorAndConnect: async (connector: Connector) => {
//     console.log('Changing connector to ', connector.name)
//     let activeConnector = connector

//     console.log('SorobanReactProvider: Changing connector')

//     // We better connect here otherwise in the frontend the context is not updated fast enough, and the user connects to the old connector first.
//     let address = await activeConnector.getPublicKey()

//     isConnectedRef.value = true

//     // setSorobanContext((c: any) => ({
//     //   ...c,
//     //   activeConnector,
//     //   address,
//     // }))
//     mySorobanContext.value.activeConnector = activeConnector
//     mySorobanContext.value.address = address
//   },
// })

const mySorobanContext = useSoroban();

callOnce(() => {
  mySorobanContext.value.connect = async () => {
    console.log('ENTERING CONNECT with context: ', mySorobanContext)

    if (mySorobanContext.value.activeConnector) {
      // Now we will check if the wallet is freighter so that we keep the old way of choosing the network from the wallet for backward compatibility
      if (mySorobanContext.value.activeConnector.id === 'freighter') {
        let networkDetails =
          await mySorobanContext.value.activeConnector.getNetworkDetails()

        //TODO: TEMP FIX while waiting for freighter to fix soroban public rpc https://github.com/stellar/freighter/issues/1335
        if (networkDetails.sorobanRpcUrl === "http://soroban-rpc-pubnet-prd.soroban-rpc-pubnet-prd.svc.cluster.local:8000") {
          networkDetails.sorobanRpcUrl = "https://mainnet.stellar.validationcloud.io/v1/XFb5Lma6smizBnnRPEgYMbuNm0K3FWzJ7854GNSQ2EY"
        }

        let activeChain = networkToActiveChain(networkDetails, chains)

        if (
          !chains.find(
            (c: any) =>
              c.networkPassphrase === networkDetails?.networkPassphrase
          )
        ) {
          const error = new Error(
            'Your Wallet network is not supported in this app'
          )
          throw error
        }

        if (!networkDetails?.sorobanRpcUrl) {
          const error = new Error(
            'Soroban RPC URL is not set, please check your freighter wallet network configuration'
          )
          throw error
        }

        server =
          networkDetails &&
          new StellarSdk.SorobanRpc.Server(networkDetails.sorobanRpcUrl, {
            allowHttp: networkDetails.sorobanRpcUrl.startsWith('http://'),
          })

        serverHorizon =
          networkDetails &&
          new StellarSdk.Horizon.Server(networkDetails.networkUrl, {
            allowHttp: networkDetails.networkUrl.startsWith('http://'),
          })

        console.log(
          'SorobanReactProvider: Connecting with FREIGHTER : ',
          mySorobanContext.value.activeConnector.name
        )

        let address = await mySorobanContext.value.activeConnector.getPublicKey()

        // Now we can track that the wallet is finally connected
        isConnectedRef.value = true

        // setSorobanContext((c: any) => ({
        //   ...c,
        //   activeChain,
        //   address,
        //   server,
        //   serverHorizon,
        // }))

        mySorobanContext.value.activeChain = activeChain
        mySorobanContext.value.address = address
        mySorobanContext.value.server = server
        mySorobanContext.value.serverHorizon = serverHorizon
      }
      // If connector is any other wallet that does not have getNetworkDetails we will need to set the active chain and server from somewehere else in the front end
      else {
        console.log(
          'SorobanReactProvider: Connecting with ',
          mySorobanContext.value.activeConnector.name
        )
        let address = await mySorobanContext.value.activeConnector.getPublicKey()

        // Now we can track that the wallet is finally connected
        isConnectedRef.value = true

        // setSorobanContext((c: any) => ({
        //   ...c,
        //   address,
        // }))

        mySorobanContext.value.address = address
      }
    } else {
      console.log('SorobanReactProvider: No active Connector')
    }
  }

  mySorobanContext.value.disconnect = async () => {
    isConnectedRef.value = false

    // TODO: Maybe reset address to undefined
    // TODO: Handle other things here, such as perhaps resetting address to undefined.
    let address = undefined

    // setSorobanContext((c: any) => ({
    //   ...c,
    //   address,
    // }))

    mySorobanContext.value.address = address
  }

  mySorobanContext.value.setActiveChain = (chain: WalletChain) => {
    console.log('Chainging activeChain to : ', chain)

    // When the user in frontend changes the activeChain to read the blockchain without wallet
    let server: StellarSdk.SorobanRpc.Server | undefined = undefined,
      serverHorizon: StellarSdk.Horizon.Server | undefined = undefined
    const _activeChain = chain

    if (_activeChain.sorobanRpcUrl) {
      server = fromURLToServer(_activeChain.sorobanRpcUrl)
    }

    if (_activeChain.networkUrl) {
      serverHorizon = fromURLToHorizonServer(_activeChain.networkUrl)
    }

    // setSorobanContext((c: any) => ({
    //   ...c,
    //   server,
    //   serverHorizon,
    //   activeChain,
    // }))

    mySorobanContext.value.server = server
    mySorobanContext.value.serverHorizon = serverHorizon
    mySorobanContext.value.activeChain = _activeChain
  }

  mySorobanContext.value.setActiveConnectorAndConnect = async (connector: Connector) => {
    console.log('Changing connector to ', connector.name)
    let activeConnector = connector

    console.log('SorobanReactProvider: Changing connector')

    // We better connect here otherwise in the frontend the context is not updated fast enough, and the user connects to the old connector first.
    let address = await activeConnector.getPublicKey()

    isConnectedRef.value = true

    // setSorobanContext((c: any) => ({
    //   ...c,
    //   activeConnector,
    //   address,
    // }))
    mySorobanContext.value.activeConnector = activeConnector
    mySorobanContext.value.address = address
  }
})

console.log(
  'SorobanReactProvider: Active connector is ',
  mySorobanContext.value.activeConnector?.name
)

watch(mySorobanContext, (newID, oldID, onCleanup) => {
  let timeoutId: NodeJS.Timeout | null = null

  // If it turns out that requesting an update from Freighter is too taxing,
  // then this could be increased. Humans perceive 100ms response times as instantaneous
  // (source: https://www.pubnub.com/blog/how-fast-is-realtime-human-perception-and-technology/)
  // but you also have to consider the re-render time of components.
  const freighterCheckIntervalMs = 200

  async function checkForAddressChanges() {
    // Returns if not installed / not active / not connected (TODO: currently always isConnected=true)
    if (
      !mySorobanContext.value.activeConnector ||
      !mySorobanContext.value.activeConnector.isConnected() ||
      !isConnectedRef.value ||
      !mySorobanContext.value.activeChain
    )
      return
    // For now we can only do this with freighter. xBull doesn't handle the repeated call well.
    else if (mySorobanContext.value.activeConnector.id !== 'freighter') {
      return
    } else {
      let hasNoticedWalletUpdate = false

      try {
        // NOTICE: If the user logs out from or uninstalls the Freighter extension while they are connected
        // on this site, then a dialog will appear asking them to sign in again. We need a way to ask Freighter
        // if there is _any_ connected user, without actually asking them to sign in. Unfortunately, that is not
        // supported at this time; but it would be easy to submit a PR to the extension to add support for it.
        let address = await mySorobanContext.value.activeConnector?.getPublicKey()

        // TODO: If you want to know when the user has disconnected, then you can set a timeout for getPublicKey.
        // If it doesn't return in X milliseconds, you can be pretty confident that they aren't connected anymore.

        if (mySorobanContext.value.address !== address) {
          console.log(
            'SorobanReactProvider: address changed from:',
            mySorobanContext.value.address,
            ' to: ',
            address
          )
          hasNoticedWalletUpdate = true

          console.log('SorobanReactProvider: reconnecting')

          // setSorobanContext((c: any) => ({
          //   ...c,
          //   address,
          // }))
          mySorobanContext.value.address = address
        }
      } catch (error) {
        // I would recommend keeping the try/catch so that any exceptions in this async function
        // will get handled. Otherwise React could complain. I believe that eventually it may cause huge
        // problems, but that might be a NodeJS specific approach to exceptions not handled in promises.

        console.error('SorobanReactProvider: error: ', error)
      } finally {
        if (!hasNoticedWalletUpdate)
          timeoutId = setTimeout(
            checkForAddressChanges,
            freighterCheckIntervalMs
          )
      }
    }
  }

  checkForAddressChanges()

  onCleanup(() => {
    if (timeoutId != null) clearTimeout(timeoutId)
  });
})

watch(mySorobanContext, (newID, oldID, onCleanup) => {
  let timeoutId: NodeJS.Timeout | null = null

  const freighterCheckIntervalMs = 200

  async function checkForNetworkChanges() {
    // Returns if not installed / not active / not connected (TODO: currently always isConnected=true)
    if (
      !mySorobanContext.value.activeConnector ||
      !mySorobanContext.value.activeConnector.isConnected() ||
      !isConnectedRef.value ||
      !mySorobanContext.value.activeChain
    )
      return
    // For now we can only do this with freighter. xBull doesn't have the getNetworkDetails method exposed.
    else if (mySorobanContext.value.activeConnector.id !== 'freighter') {
      return
    } else {
      let hasNoticedWalletUpdate = false

      try {
        let networkDetails =
          await mySorobanContext.value.activeConnector.getNetworkDetails()

        //TODO: TEMP FIX while waiting for freighter to fix soroban public rpc https://github.com/stellar/freighter/issues/1335
        if (networkDetails.sorobanRpcUrl === "http://soroban-rpc-pubnet-prd.soroban-rpc-pubnet-prd.svc.cluster.local:8000") {
          networkDetails.sorobanRpcUrl = "https://mainnet.stellar.validationcloud.io/v1/XFb5Lma6smizBnnRPEgYMbuNm0K3FWzJ7854GNSQ2EY"
        }
        let newActiveChain = networkToActiveChain(networkDetails, chains)

        // We check that we have a valid network details and not a blank one like the one xbull connector would return
        if (
          networkDetails.network &&
          (newActiveChain.networkPassphrase !==
            mySorobanContext.value.activeChain.networkPassphrase ||
            newActiveChain?.sorobanRpcUrl !==
            mySorobanContext.value?.activeChain?.sorobanRpcUrl)
        ) {
          console.log(
            'SorobanReactProvider: network changed from:',
            mySorobanContext.value.activeChain.networkPassphrase,
            ' to: ',
            newActiveChain.networkPassphrase
          )
          hasNoticedWalletUpdate = true

          mySorobanContext.value.setActiveChain &&
            mySorobanContext.value.setActiveChain(newActiveChain)
        }
      } catch (error) {
        console.error('SorobanReactProvider: error: ', error)
      } finally {
        if (!hasNoticedWalletUpdate)
          timeoutId = setTimeout(
            checkForNetworkChanges,
            freighterCheckIntervalMs
          )
      }
    }
  }

  checkForNetworkChanges()

  onCleanup(() => {
    if (timeoutId != null) clearTimeout(timeoutId)
  });
})
</script>
