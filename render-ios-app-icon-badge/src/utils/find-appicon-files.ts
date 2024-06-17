import recursive from "recursive-readdir"

export default async function (dir: string) {
  const files: string[] = await recursive(dir)
  return files.filter(file => {
    var isInAppIconSet = file.indexOf(".appiconset") != -1
    var isImage = file.match(/.(png|jpg|jpeg|gif)$/)
    return isInAppIconSet && isImage
  })
}
