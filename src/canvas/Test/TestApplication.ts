import { Canvas2DApplication } from '../Application/Canvas2DApplication'
import { Size, Rectangle, vec2 } from '../math2D';

// 文字左右如何对齐
type TextAlign = 'start' | 'left' | 'center' | 'right' | 'end'
// 可以认为是设置文字的如何对齐的
type TextBaseline = 'alphabetic' | 'hanging' | 'top' | 'middle' | 'bottom'

type FontType = '10px sans-serif' | '15px sans-serif' | '20px sans-serif' | '25px sans-serif'

export class TestApplication extends Canvas2DApplication {
  private _lineDashOffset: number = 0

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)

    this.addTimer(this.timerCallback.bind(this), 0.033)
  }

  public render(): void {
    if (this.context2D !== null) {
      this.context2D.clearRect(0, 0, this.context2D.canvas.width, this.context2D.canvas.height)
      // this._drawRect(20, 20, 100, 100)
      this.testCanvas2DTextLayout()
    }
  }

  public timerCallback(id: number, data: any): void {
    this._updateLineDashOffse()
    this._drawRect(10, 10, 100, 100)
  }

  private _drawRect(x: number, y: number, w: number, h: number) {
    if (this.context2D) {
      this.context2D.save()

      this.context2D.fillStyle = 'grey'
      this.context2D.strokeStyle = 'blue'
      this.context2D.lineWidth = 2
      // this.context2D.lineCap = 'square'
      // this.context2D.lineJoin = 'miter'
      // this.context2D.miterLimit = 0.1
      this.context2D.setLineDash([10, 5])
      this.context2D.lineDashOffset = this._lineDashOffset

      this.context2D.beginPath()

      this.context2D.moveTo(x, y)
      this.context2D.lineTo(x + w, y)
      this.context2D.lineTo(x + w, y + h)
      this.context2D.lineTo(x, y + h)

      this.context2D.closePath()

      this.context2D.fill()

      this.context2D.stroke()

      this.context2D.restore()
    }
  }

  private _updateLineDashOffse(): void {
    this._lineDashOffset++
    if (this._lineDashOffset > 10000) {
      this._lineDashOffset = 0
    }
  }

  /**
   * 绘制圆
   */
  public fillCircle(x: number, y: number, radius: number, fillStyle: string | CanvasGradient | CanvasPattern): void {
    if (this.context2D !== null) {
      this.context2D.save()

      this.context2D.fillStyle = fillStyle
      this.context2D.beginPath()

      this.context2D.arc(x, y, radius, 0, Math.PI * 2)
      this.context2D.fill()

      this.context2D.restore()
    }
  }

  /**
   * 线段绘制
   */
  public strokeLine(x0: number, y0: number, x1: number, y1: number): void {
    if (this.context2D !== null) {
      this.context2D.beginPath()
      this.context2D.moveTo(x0, y0)
      this.context2D.lineTo(x1, y1)
      this.context2D.stroke()
    }
  }

  /**
   * 绘制坐标系
   */
  public strokeCoord(originX: number, originY: number, width: number, height: number): void {
    if (this.context2D !== null) {
      this.context2D.save()

      this.context2D.strokeStyle = 'red'
      this.strokeLine(originX, originY, originX + width, originY)

      this.context2D.strokeStyle = 'blue'
      this.strokeLine(originX, originY, originX, originY + height)

      this.context2D.restore()
    }
  }

  /**
   * 网格背景绘制
   */
  public strokeGrid(color: string = 'grey', interval: number = 10): void {
    if (this.context2D !== null) {
      this.context2D.save()

      this.context2D.strokeStyle = color
      this.context2D.lineWidth = 0.5

      // 从左至右每隔interval个像素画一条垂直线
      for (let i: number = interval + 0.5; i < this.canvas.width; i += interval) {
        this.strokeLine(i, 0, i, this.canvas.height)
      }

      // 从上至下每隔interval个像素画一条水平线
      for (let i: number = interval + 0.5; i < this.canvas.height; i += interval) {
        this.strokeLine(0, i, this.canvas.width, i)
      }
      this.context2D.restore()

      // 绘制网格背景坐标系的原点
      this.fillCircle(0, 0, 5, 'green')

      // 为网格背景绘制全局坐标系
      // Cavnas中全局坐标系的原点在左上角，并且x轴总是指向右侧，y轴指向下方
      // 全局坐标系永远不会变换，总是固定的
      this.strokeCoord(0, 0, this.canvas.width, this.canvas.height)
    }
  }

  /**
   * 绘制文本
   */
  public fillText(
    text: string,
    x: number,
    y: number,
    color: string = 'white',
    align: TextAlign = 'left',
    baseline: TextBaseline = 'top',
    font: FontType = '10px sans-serif',
  ) {
    if (this.context2D !== null) {
      this.context2D.save()

      this.context2D.textBaseline = baseline
      this.context2D.font = font
      this.context2D.fillStyle = color
      this.context2D.fillText(text, x, y)

      this.context2D.restore()
    }
  }

  /**
   * 测试 文本 布局
   */
  public testCanvas2DTextLayout(): void {
    // 要绘制的矩形离canvas的margin（外边距）分别是【20，20，20，20】
    let x: number = 20
    let y: number = 20
    let width: number = this.canvas.width - x * 2
    let height: number = this.canvas.height - y * 2
    let drawX: number = x
    let drawY: number = y
    // 原点半径为3像素
    let radius: number = 3
    // 1.画背景rect
    // this.fillRectWithTitle(x, y, width, height)

    // 每个位置，先绘制drawX和drawY的坐标原点，然后绘制文本

    // 2.左上
    this.fillText('left - top', drawX, drawY, 'white', 'left', 'top', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 3.右上
    drawX = x + width
    drawY = y
    this.fillText('right - top', drawX, drawY, 'white', 'right', 'top', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 4.右下
    drawX = x + width
    drawY = y + height
    this.fillText('right - bottom', drawX, drawY, 'white', 'right', 'bottom', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 5.左下
    drawX = x
    drawY = y + height
    this.fillText('left - bottom', drawX, drawY, 'white', 'left', 'bottom', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 6.中心 
    drawX = x + width * 0.5
    drawY = y + height * 0.5
    this.fillText('center - middle', drawX, drawY, 'white', 'center', 'middle', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 7.中上
    drawX = x + width * 0.5
    drawY = y
    this.fillText('center - top', drawX, drawY, 'white', 'center', 'top', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 8.右中
    drawX = x + width
    drawY = y + height * 0.5
    this.fillText('right - middle', drawX, drawY, 'white', 'right', 'middle', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 9.中下
    drawX = x + width * 0.5
    drawY = y + height
    this.fillText('center - bottom', drawX, drawY, 'white', 'center', 'bottom', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')

    // 10.左中
    drawX = x
    drawY = y + height * 0.5
    this.fillText('left - middle', drawX, drawY, 'white', 'left', 'middle', '20px sans-serif')
    this.fillCircle(drawX, drawY, radius, 'black')
  }

  /**
   * 测试，计算字体大小
   * 以W的宽度乘以 一定的缩放比例，作为衡量的高度
   */
  public calcTextSize(text: string, char: string = 'W', scale: number = 0.5): Size {
    if (this.context2D !== null) {
      const width: number = this.context2D.measureText(text).width
      const w: number = this.context2D.measureText(char).width
      const height = w + w * scale

      return Size.create(width, height)
    }

    throw new Error('Context2D is null!')
  }

  /**
   * parentWidth / parentHeight 是父矩形的尺寸
   * 这些子矩形是相对于父矩形坐标系的表示
   * 这意味着父矩形的原点为[0,0],所以参数是父矩形的width和height, 而没有x和y坐标
   */
  public calcLocalTextRectangle(layout: ETextLayout, text: string, parentWidth: number, parentHeight: number): Rectangle {
    // 首先计算出要绘制文本的尺寸（width/height)
    const s: Size = this.calcTextSize(text)
    // 创建一个二维向量
    let o: vec2 = vec2.create();
  }
}

export enum ETextLayout {
  LEFT_TOP,
  RIGHT_TOP,
  RIGHT_BOTTOM,
  LEFT_BOTTOM,
  CENTER_MIDDLE,
  CENTER_TOP,
  RIGHT_MIDDLE,
  CENTER_BOTTOM,
  LEFT_MIDDLE
}
