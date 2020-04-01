/* higher level HTTP abstractions */

export const get = async (url, opts = {}) => {
  try {
    console.time(`REQ: ${url}`)
    let resp = await fetch(url, opts)
    let blob = await resp.blob()
    let html = await blob.text()
    console.timeEnd(`REQ: ${url}`)
    return html
  }
  catch(error) {
    console.log(error)
    return null
  }

}

// move to utility?
export const trimBody = (html) => {
  let start = html.indexOf("<body")
  html = html.slice(start)
  let end = html.indexOf("</body>")
  return html.slice(0,end+7)
}