import React, {Component} from 'react'
import {StyleSheet, View} from 'react-native'
import Svg, {Defs, Stop, G, Path, LinearGradient} from 'react-native-svg'
import {arc} from 'd3-shape'
import Chroma from 'chroma-js'

export default class CircularProgress extends Component {
  startAngle = 0
  endAngle = 360
  startColor = '#f95c06'
  endColor = '#ffba00'
  noOfSeg = 10
  r1 = 50
  r2 = 55

  constructor(props) {
    super(props)
  }

  generateLinear() {
    let _stepColors = Chroma.scale([this.startColor, this.endColor]).colors(this.noOfSeg + 1)
    console.log('xq debug===_stepColors:' + JSON.stringify(_stepColors))
    let _stepAngle = 2 * Math.PI / 360 * (this.endAngle - this.startAngle) / this.noOfSeg
    let _linearDefs = [], _linearPath = []

    for (let i = 0; i < this.noOfSeg; i++) {
      let _startAngle = this.startAngle + i * _stepAngle
      let _endAngle = this.startAngle + (i + 1) * _stepAngle + 0.005

      _linearDefs.push(
        <LinearGradient
          key={'LinearDef' + i}
          id={'LinearDef' + i}
          x1={this.r1 * Math.sin(_startAngle)}
          y1={-this.r1 * Math.cos(_startAngle)}
          x2={this.r1 * Math.sin(_endAngle)}
          y2={-this.r1 * Math.cos(_endAngle)}>
          <Stop offset="0" stopColor={_stepColors[i]}/>
          <Stop offset="1" stopColor={_stepColors[i + 1]}/>
        </LinearGradient>
      )

      let circlePath = arc()
        .innerRadius(this.r1)
        .outerRadius(this.r2)
        //.cornerRadius(i === 0 || i === this.noOfSeg - 1 ? ((this.r2 - this.r1) / 2) : 0)
        .startAngle(_startAngle)
        .endAngle(_endAngle)

      _linearPath.push(
        <Path
          key={'LinearPath' + i}
          x={150}
          y={100}
          d={circlePath()}
          fill={'url(#LinearDef' + i + ')'}/>
      )
    }

    return [_linearDefs, _linearPath]
  }

  render() {
    let renderLinear = this.generateLinear();
    return (
      <View style={Styles.wrap}>
        <View style={{width: 300, height: 200, marginTop: 2}}>
          <Svg width={300} height={200}>
            <Defs>
              {renderLinear[0]}
            </Defs>
            <G>
              {renderLinear[1]}
            </G>
          </Svg>
        </View>
      </View>
    );
  }
}

const Styles = StyleSheet.create({
  wrap: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});