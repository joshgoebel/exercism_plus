export const onMacintosh = () => {
  return /Macintosh/.test(navigator.userAgent)
}

export const redirect = (url) => window.location.href = url

export function $(html) {
  var wrapper = document.createElement('div');
  wrapper.innerHTML = html.trim();
  return wrapper.firstChild;
}

