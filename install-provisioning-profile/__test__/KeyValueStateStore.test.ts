import { KeyValueStateStore } from "../src/KeyValueStateStore"
import { MockKeyValueStateWriterReader } from "./mock/MockKeyValueStateWriterReader"

test("It saves isPost", () => {
  const stateStore = new KeyValueStateStore(new MockKeyValueStateWriterReader())
  expect(stateStore.isPost).not.toBeTruthy()
  stateStore.isPost = true
  expect(stateStore.isPost).toBeTruthy()
})

test("It saves provisioningProfilePath", () => {
  const filename = "foo.mobileprovision"
  const stateStore = new KeyValueStateStore(new MockKeyValueStateWriterReader())
  expect(stateStore.provisioningProfilePath).toBeNull()
  stateStore.provisioningProfilePath = filename
  expect(stateStore.provisioningProfilePath).toBe(filename)
})
