import { makeMockStateStore } from "./mock/make-mock-state-store"

test("It saves isPost", () => {
  const stateStore = makeMockStateStore()
  expect(stateStore.isPost).not.toBeTruthy()
  stateStore.isPost = true
  expect(stateStore.isPost).toBeTruthy()
})

test("It saves provisioningProfilePath", () => {
  const filename = "foo.mobileprovision"
  const stateStore = makeMockStateStore()
  expect(stateStore.provisioningProfilePath).toBeNull()
  stateStore.provisioningProfilePath = filename
  expect(stateStore.provisioningProfilePath).toBe(filename)
})
