import { TypeRegistry } from "@polkadot/types"
import { u8aToNumber } from "@polkadot/util"

export const metadataFromOpaque = (opaque: Uint8Array) => {
  try {
    // pjs codec for OpaqueMetadata doesn't allow us to decode the actual Metadata, find it ourselves
    const u8aBytes = opaque
    for (let i = 0; i < 20; i++) {
      // skip until we find the magic number that is used as prefix of metadata objects (usually in the first 10 bytes)
      if (u8aToNumber(u8aBytes.slice(i, i + 4)) !== 0x6174656d) continue

      const metadata = new TypeRegistry().createType("Metadata", u8aBytes.slice(i))

      return metadata.toHex()
    }
    throw new Error("Magic number not found")
  } catch (cause) {
    throw new Error("Failed to decode metadata from OpaqueMetadata", { cause })
  }
}
