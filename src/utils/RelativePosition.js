import { format } from 'd3-format'

const perFormat = format('.2%')

class RelativePostion {
  constructor([w, h]) {
    this.canvasWidth = w
    this.canvasHeight = h
  }

  #getRawPercent = (pos) => [
    (pos[0] / this.canvasWidth),
    (pos[1] / this.canvasHeight),
  ]

  getPercent = pos => this.#getRawPercent(pos).map(perFormat)

  getPixel = (pos) => (width) => {
    const perPos = this.#getRawPercent(pos)
    return [
      perPos[0] * width,
      perPos[1] * width / this.canvasWidth * this.canvasHeight
    ]
  }

  getWidthPercent = w => perFormat(w / this.canvasWidth)
  getWidthPixel = w => width => (w / this.canvasWidth) * width

  getHeightPixel = width => (width / this.canvasWidth) * this.canvasHeight
}

export default RelativePostion
