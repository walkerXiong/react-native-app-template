import React, {Component, PropTypes} from 'react'
import {StyleSheet, View} from 'react-native'
import Svg, {Defs, Stop, G, Path, LinearGradient} from 'react-native-svg'
import {arc} from 'd3-shape'
import Chroma from 'chroma-js'

export default class CircularProgress extends Component {
  linearDefs = [];
  linearPaths = [];

  static propTypes = {
    startAngle: PropTypes.number,
    endAngle: PropTypes.number,
    startColor: PropTypes.string,
    endColor: PropTypes.string,
    noOfSeg: PropTypes.number,
    r1: PropTypes.number,
    r2: PropTypes.number,
  }

  static defaultProps = {
    startAngle: 0,
    endAngle: 360,
    startColor: '#f95c06',
    endColor: '#ffba00',
    noOfSeg: 10,
    r1: 50,
    r2: 55,
  }

  constructor(props) {
    super(props)
    this.generateLinear(props);
  }

  generateLinear(props) {
    let {startAngle, endAngle, startColor, endColor, noOfSeg, r1, r2} = props;

    let _stepColors = Chroma.scale([startColor, endColor]).colors(noOfSeg + 1)
    console.log('xq debug===_stepColors:' + JSON.stringify(_stepColors))
    let _stepAngle = 2 * Math.PI / 360 * (endAngle - startAngle) / noOfSeg

    for (let i = 0; i < noOfSeg; i++) {
      let _startAngle = startAngle + i * _stepAngle
      let _endAngle = startAngle + (i + 1) * _stepAngle + 0.005

      this.linearDefs.push(
        <LinearGradient
          key={'LinearDef' + i}
          id={'LinearDef' + i}
          x1={r1 * Math.sin(_startAngle)}
          y1={-r1 * Math.cos(_startAngle)}
          x2={r1 * Math.sin(_endAngle)}
          y2={-r1 * Math.cos(_endAngle)}>
          <Stop offset="0" stopColor={_stepColors[i]}/>
          <Stop offset="1" stopColor={_stepColors[i + 1]}/>
        </LinearGradient>
      )

      let circlePath = arc()
        .innerRadius(r1)
        .outerRadius(r2)
        //.cornerRadius(i === 0 || i === noOfSeg - 1 ? ((r2 - r1) / 2) : 0)
        .startAngle(_startAngle)
        .endAngle(_endAngle)

      this.linearPaths.push(
        <Path
          key={'LinearPath' + i}
          x={150}
          y={100}
          d={circlePath()}
          fill={'url(#LinearDef' + i + ')'}/>
      )
    }
  }

  render() {
    return (
      <View style={Styles.wrap}>
        <View style={{width: 300, height: 200, marginTop: 2}}>
          <Svg width={300} height={200}>
            <Defs>
              {this.linearDefs}
            </Defs>
            <G>
              {this.linearPaths}
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