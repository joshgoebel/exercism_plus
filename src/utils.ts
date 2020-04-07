export const onMacintosh = () => {
  return /Macintosh/.test(navigator.userAgent)
}

export const redirect = (url:string) => window.location.href = url

export function $(html:string) : Element {
  var wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  return (wrapper.firstChild || wrapper) as Element;
}

