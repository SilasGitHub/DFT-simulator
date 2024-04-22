// https://stackoverflow.com/a/55613750/12314121
export const downloadFile = (data: string, fileName: string, mimeType: string) => {
    const blob = new Blob([data], {type: mimeType})
    const href = URL.createObjectURL(blob)

    const link = document.createElement("a")
    link.href = href
    link.download = fileName
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    URL.revokeObjectURL(href)
}