import { ApiPromise, Keyring, WsProvider } from "@polkadot/api"
import { Metadata } from "@polkadot/types"
import { useCallback, useEffect, useState } from "react"

import { presetWsUrls } from "./constants"
import { SeedInput } from "./SeedInput"
import { metadataFromOpaque } from "./util"
import { WsSelect } from "./WsSelect"

const keyring = new Keyring()

const defaultSeed = "test test test test test test test test test test test junk"
const defaultWsUrl = presetWsUrls[0]

export const App = () => {
  const [seed, setSeed] = useState(defaultSeed)
  const [wsUrl, setWsUrl] = useState(defaultWsUrl)

  const [address, setAddress] = useState("")
  useEffect(() => {
    try {
      const keypair = keyring.createFromUri(`${seed}/m/44'/60'/0'/0/0`, {}, "ethereum")
      setAddress(keypair.address.toString())
    } catch {
      setAddress("")
    }
  }, [seed])

  const [balance, setBalance] = useState<string | null>(null)
  useEffect(() => {
    try {
      const keypair = keyring.createFromUri(`${seed}/m/44'/60'/0'/0/0`, {}, "ethereum")

      const abort = new AbortController()

      const api = new ApiPromise({ provider: new WsProvider(wsUrl) })
      abort.signal.onabort = () => api.disconnect()

      setBalance("loading")

      //
      ;(async () => {
        try {
          await api.isReadyOrError
          if (abort.signal.aborted) return

          const balance = await api.query.system.account(keypair.address)

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setBalance((balance as any)?.data?.free?.toString?.() ?? "0")
        } catch {
          setBalance(null)
        }
      })()

      return () => abort.abort()
    } catch {
      setBalance(null)
    }
  }, [seed, wsUrl])

  const [output, setOutput] = useState("")
  const addOutput = useCallback((data: string) => setOutput((o) => o + data + "\n"), [])

  const test = useCallback(() => {
    const keypair = keyring.createFromUri(`${seed}/m/44'/60'/0'/0/0`, {}, "ethereum")

    const abort = new AbortController()

    const api = new ApiPromise({ provider: new WsProvider(wsUrl) })
    abort.signal.onabort = () => api.disconnect()

    addOutput("Creating extrinsic...")

    //
    ;(async () => {
      try {
        await api.isReadyOrError
        if (abort.signal.aborted) return

        const opaqueMetadata = await api.call.metadata.metadataAtVersion(15)
        const metadataRpc = metadataFromOpaque(opaqueMetadata.toU8a())
        // addOutput("metadataRpc: " + metadataRpc)

        const metadata = new Metadata(api.registry, metadataRpc)
        // addOutput("metadata: " + JSON.stringify(metadata.toJSON(), null, 2))

        api.registry.setMetadata(metadata)

        const extrinsic = await api.tx.balances
          .transferKeepAlive(keypair.address, 0)
          .signAsync(keypair)

        addOutput(
          `Extrinsic signature: ${extrinsic.signature}\n(length ${extrinsic.signature.byteLength})`
        )
      } catch (cause) {
        addOutput(`Failed: ${String(cause)}`)
      }
    })()

    return () => abort.abort()
  }, [addOutput, seed, wsUrl])

  return (
    <div className="flex min-w-[640px] flex-col gap-4">
      <h1 className="text-xl">Laos Signature Test</h1>
      <SeedInput
        value={seed}
        onClick={() => setSeed("")}
        onChange={(e) => setSeed(e.currentTarget.value)}
        onReset={() => setSeed(defaultSeed)}
      />
      <div className="text-sm">
        {address ? "Address: " : "Invalid seed or key"}
        {address}
      </div>
      <div className="-mt-4 text-sm">
        {balance !== null ? "Balance: " : "No balance"}
        {balance}
      </div>
      <WsSelect
        value={wsUrl}
        onClick={() => setWsUrl("")}
        onChange={(e) => setWsUrl(e.currentTarget.value)}
        onReset={() => setWsUrl(defaultWsUrl)}
      />
      <button
        className="ocus:outline-none rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:text-gray-100 focus:ring active:opacity-85"
        onClick={test}
      >
        Test
      </button>
      {output && <pre className="p-4 text-xs dark:bg-gray-800">{output}</pre>}
    </div>
  )
}
