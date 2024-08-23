import { useState } from "react"

const presetWsUrls = [
  "wss://rpc.laos.laosfoundation.io",
  "wss://rpc.laosmercury.gorengine.com",
  "wss://wss.api.moonbeam.network",
]

function App() {
  const [wsUrl, setWsUrl] = useState(presetWsUrls[0])

  return (
    <>
      <label htmlFor="wsurl">ws url</label>
      <input
        id="wsurl"
        type="text"
        value={wsUrl}
        onChange={(e) => setWsUrl(e.currentTarget.value)}
      />
      <div></div>
      <h1>Vite + React</h1>
      <div className="card">
        {/* <button onClick={() => setCount((count) => count + 1)}>count is {count}</button> */}
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
    </>
  )
}

export default App
