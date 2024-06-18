import tmp from "tmp"

export default function () {
  const file: { name: string, removeCallback: () => void } = tmp.fileSync()
  return { filePath: file.name, cleanUp: file.removeCallback }
}
