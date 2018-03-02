/**
 * Created by hebao on 2018/3/2.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  ART,
}  from 'react-native'
import Morph from 'art/morph/path'

const {width, height} = Dimensions.get('window')
const {Surface, Shape, Path} = ART

const CJPathInit = [
  'M0 0 L300 0',
  'M0 0 L0 100 L50 180 L100 158 L150 162 L200 130 L250 104 L300 90 L300 0',
]
const CJPath = CJPathInit.map((svg) => Morph.Path(svg))

export default class CJExample extends Component {
  constructor(props) {
    super(props)
    this.state = {
      transition: new Morph.Tween(CJPath[0], CJPath[1])
    }
  }

  componentDidMount() {
    this.animate()
  }

  animate = (start) => {
    GLOBAL.requestAnimationFrame((timestamp) => {
      if (!start) start = timestamp
      let delta = (timestamp - start) / 1000//计算timestamp和start的时间差，用以计算动画执行时常， diff／1000，表示当前动画时长持续几秒
      if (delta <= 1) {//设定动画时长为1s，1s内递归调用requestAnimationFrame，以实现帧刷新动画
        this.state.transition.tween(delta)
        this.setState(this.state)
        this.animate(start)
      }
    })
  }

  render() {
    return (
      <View style={Styles.wrap}>
        <Surface width={width} height={height}>
          <Shape
            x={0}
            y={100}
            stroke={'#36ffff'}
            strokeWidth={2}
            d={this.state.transition}
            fill={'#38ffbc'}/>
        </Surface>
      </View>
    )
  }
}

const Styles = StyleSheet.create({
  wrap: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transform: [{scaleY: -1}]
  }
})