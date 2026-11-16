function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

export function downloadColoringSvg(svg: SVGSVGElement, filename: string) {
  const copy = svg.cloneNode(true) as SVGSVGElement
  const style = document.createElementNS('http://www.w3.org/2000/svg', 'style')
  style.textContent = '.region,.region-static{stroke:#2b2d42;stroke-width:4;stroke-linejoin:round}'
  copy.insertBefore(style, copy.firstChild)
  downloadBlob(
    new Blob([new XMLSerializer().serializeToString(copy)], { type: 'image/svg+xml;charset=utf-8' }),
    filename,
  )
}

export function downloadDrawingPng(canvas: HTMLCanvasElement, filename: string) {
  const dataUrl = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.href = dataUrl
  link.download = filename
  link.click()
}
