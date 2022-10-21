import { decodeBase64 } from "../src/utils/decode-base64"

test("Decoding \"Hello world!\"", () => {
  const data = "SGVsbG8gd29ybGQh"
  expect(decodeBase64(data)).toEqual("Hello world!")
})

test("Decoding \"foo bar\"", () => {
  const data = "Zm9vIGJhcg=="
  expect(decodeBase64(data)).toEqual("foo bar")
})
