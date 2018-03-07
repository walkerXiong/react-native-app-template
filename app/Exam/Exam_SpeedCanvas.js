/**
 * Created by woowalker on 2016/12/13.
 */
'use strict'
import React, {Component} from 'react'
import {
  View,
  ART,
  Dimensions,
} from 'react-native'
import PropTypes from 'prop-types'
const {Surface, Shape, Path, Transform} = ART
const {width, height} = Dimensions.get('window')

/**
 * T只需要一个坐标，其控制点已由前面的Q的控制点控制（控制方式为对称控制，比如Q5 20, 10 20 T15 35，相当于Q5 20, 10 20 T15 20, 15 35）
 * 因此起点坐标(0,0)、Q终点坐标(10,20)与T坐标(15,35)组成一条二次平滑贝塞尔曲线，
 * 平滑的意思是Q终点坐标并不是作为下一条贝塞尔曲线的起点，而是通过T坐标使Q终点坐标再次延伸一点至T坐标，构成贝塞尔曲线的顺滑结尾，并以T坐标为下一条贝塞尔曲线的起点坐标
 *
 * 一条平滑的曲线path如下：
 * const _path = new Path("M0 0 Q5 20, 10 20 T15 35, Q17.5 50, 20 50 T25 25, Q27.5 0, 30 0 T35 0, Q37.5 0, 40 0 T45 15, Q47.5 30, 50 30 T55 20, Q57.5 10, 60 10 T65 5, Q67.5 0, 70 0")
 * 其中点(10, 20) (20, 50) (30, 0) (40, 0) (50, 30) (60, 10) (70, 0) 为需要画出的峰值顶点，其余点均为辅助画出平滑曲线的控制点，我们将其抽象成组件中的 this.state.speedArr 数组
 */
export default class SpeedCanvas extends Component {
  aniStartTime = null

  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number,
    speed: PropTypes.number,
    step: PropTypes.number,//一次推进10距离单位
    updateTimes: PropTypes.number,
    animation: PropTypes.bool,
    surfaceWrapStyle: PropTypes.any
  }

  static defaultProps = {
    width: width,
    height: Math.ceil(height * 0.2),
    speed: 0,
    step: 20,//一次推进10距离单位
    updateTimes: 1000,
    animation: true,
    surfaceWrapStyle: {
      borderTopWidth: 2,
      borderTopColor: '#36ffff'
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      /**
       * 起点坐标(0, 0)
       * 有效坐标：[[[10,20],[5,20],[15,35]],[[20,50],[17.5,50],[25,25]],[[30,0],[27.5,0],[35,0]],[[40,0],[37.5,0],[45,15]],[[50,30],[47.5,30],[55,20]],[[60,10],[57.5,10],[65,5]],[[70,0],[67.5,0],[72.5,0]]]
       * 其中数组第一个速率坐标，第二个为Q控制点坐标，第三个为T控制点坐标
       */
      speedArr: [],
      speedStr: '',

      speedStep: 0,//步进一个速率点
      speedPos: [],
      speedIndex: -1,
    }
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.receiveSpeed(nextProps.speed)
  }

  receiveSpeed = (speed) => {
    let {step, animation} = this.props
    this.state.speedStep += 1//步进一个速率点
    /**
     * 第一个点为原点坐标(0, 0)，第二个点的控制点由第一、二、三个点确定，第三个点由第二、三、四个点确定，以此类推
     * 具体来说就是：
     * 1、第二个点的Q坐标的X坐标由第一个点的T坐标的X坐标和第二个点的X坐标确定（取中间值，parent + (curr - parent) / 2），Y坐标同第二个点的Y坐标
     * 2、第二个点的T坐标的X坐标由第二个点的X坐标和第三个点的X坐标确定（取中间值，curr + (children - curr) / 2），Y坐标由第二个点的Y坐标和第三个点的Y坐标确定（取中间值，curr + (children - curr) / 2）
     * 以此类推，因此，一个点的最终确定，需要包括该点本身一共三个点来一起确定
     */
    let {speedArr, speedStep} = this.state, _posX, _posY, _path = 'M0 0 '
    _posX = speedStep * step
    _posY = speed
    //步进一个速率点，则数组增加一条记录
    speedArr.push({
      pos: {
        x: _posX,
        y: _posY
      }
    })
    //新增一条记录之后，可以确定前一个记录点的所有Q、T控制点（三点确认一个点）
    if (speedStep >= 2) {
      let _checkPoint = speedArr[speedStep - 2]//可完全确定的记录点
      let _checkPointParent = speedArr[speedStep - 3]//可完全确定的记录点的前一个点
      let _checkPointChildren = speedArr[speedStep - 1]//可完全确定的记录点的后一个点，也即当前新增的记录点
      //确认Q点坐标
      if (!_checkPoint.posQ) {
        _checkPoint.posQ = {
          x: !_checkPointParent ? _checkPoint.pos.x / 2 : _checkPointParent.posT.x + (_checkPoint.pos.x - _checkPointParent.posT.x) / 2,
          y: _checkPoint.pos.y
        }
      }
      //确认T点坐标
      if (!_checkPoint.posT) {
        _checkPoint.posT = {
          x: _checkPoint.pos.x + (_checkPointChildren.pos.x - _checkPoint.pos.x) / 2,
          y: _checkPoint.pos.y + (_checkPointChildren.pos.y - _checkPoint.pos.y) / 2
        }
      }
      //同时可确认当前新增记录点的Q点坐标
      _checkPointChildren.posQ = {
        x: _checkPoint.posT.x + (_checkPointChildren.pos.x - _checkPoint.posT.x) / 2,
        y: _checkPointChildren.pos.y
      }
    }
    //处理新增的第一个点记录，第一个点可以确认Q坐标
    else {
      speedArr[0].posQ = {
        x: _posX / 2,
        y: _posY
      }
    }
    //生成path
    for (let i = 0, j = speedArr.length; i < j; i++) {
      if (speedArr[i].posQ) {
        _path += 'Q' + speedArr[i].posQ.x + ' ' + (speedArr[i].posQ.y) + ', ' + speedArr[i].pos.x + ' ' + (speedArr[i].pos.y)
        if (!!speedArr[i].posT) {
          _path += ' T' + speedArr[i].posT.x + ' ' + (speedArr[i].posT.y) + ', '
        }
      }
    }
    //闭合path
    _path += ' T' + ((speedStep + 1) * step) + ' 0'
    //更新画布
    if (animation) {
      this.state.speedStr = _path
      this.state.speedPos = [...new Array(this.state.speedStep * step).keys()]
      !this.aniStartTime && this.updateCanvas()
    }
    else {
      this.setState({speedStr: _path})
    }
  }

  updateCanvas = () => {
    let {step, updateTimes} = this.props
    let {speedIndex, speedPos} = this.state
    GLOBAL.requestAnimationFrame((timestamp) => {
      if (!this.aniStartTime) this.aniStartTime = timestamp
      if (timestamp - this.aniStartTime >= updateTimes / step) {
        if (++speedIndex < speedPos.length) {
          this.aniStartTime = timestamp
          this.setState({speedIndex})
          this.updateCanvas()
        }
        else {
          this.aniStartTime = null
        }
      }
      else {
        this.updateCanvas()
      }
    })
  }

  render() {
    let {width, height, step, animation, surfaceWrapStyle} = this.props
    let {speedStr, speedPos, speedIndex, speedStep} = this.state

    return (
      <View style={[{width, height, transform: [{scaleY: -1}]}, surfaceWrapStyle]}>
        <Surface
          width={width}
          height={height}>
          <Shape
            d={new Path(speedStr)}
            stroke={'#36ffff'}
            strokeWidth={2}
            fill={'rgba(54,255,255,0.2)'}
            transform={new Transform().move(width - (animation ? (speedPos[speedIndex] ? speedPos[speedIndex] : 0) : (speedStep * step)))}/>
        </Surface>
      </View>
    )
  }
}