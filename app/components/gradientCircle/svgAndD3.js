'use strict';
import React, {Component} from 'react'
import {View, StyleSheet} from 'react-native'

import Svg, {Defs, Stop, G, Path, LinearGradient, Line} from 'react-native-svg'
import {arc} from 'd3-shape'
import SingleLinearGradient from 'react-native-linear-gradient'


export default class TestPage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let rIn, rOut, rMiddle, startAngle, endAngle;
    rIn = 50;//内圆半径
    rOut = 55;//外圆半径
    rMiddle = 52.5;//圆心半径
    startAngle = 0;//起始角度 0 度
    endAngle = 300;//终点角度 300 度

    /**
     * d3-shape arc 绘制一个圆，Arcs are always centered at ⟨0,0⟩，
     * 所以Path需要位移 X Y 的距离，以期将绘制的圆形，移动到画布的中心
     */
    let circlePath = arc()
      .innerRadius(rIn)
      .outerRadius(rOut)
      .cornerRadius(rMiddle - rIn)
      .startAngle(startAngle)
      .endAngle(2 * Math.PI / 360 * endAngle);

    let startX = (rMiddle * Math.sin(0)).toFixed(2);
    let startY = (-rMiddle * Math.cos(0).toFixed(2));
    let endX = (rMiddle * Math.sin(2 * Math.PI / 360 * endAngle)).toFixed(2);
    let endY = (-rMiddle * Math.cos(2 * Math.PI / 360 * endAngle)).toFixed(2);

    return (
      <View style={Styles.wrap}>

        <View style={{width: 300, height: 200, backgroundColor: '#000000'}}>
          <Svg width={300} height={200}>
            <Defs>
              <LinearGradient
                id={'directStartToEndLengthLine'}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}>
                <Stop offset="0" stopColor={"#ff0000"}/>
                <Stop offset="0.36" stopColor={"#ef52a3"}/>
                <Stop offset="0.7" stopColor={"#b445dd"}/>
                <Stop offset="1" stopColor={"#0000ff"}/>
              </LinearGradient>
            </Defs>

            <G>
              <Line
                x={100}
                y={100}
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke={'url(#directStartToEndLengthLine)'}
                strokeWidth="5"/>

              <Path
                x={100}
                y={100}
                d={circlePath()}
                fill={'url(#directStartToEndLengthLine)'}/>
            </G>
          </Svg>
        </View>

        <View style={{width: 300, height: 200, backgroundColor: '#000000', marginTop: 2}}>
          <Svg width={300} height={200}>
            <Defs>
              <LinearGradient
                id={'wholeArcLengthLine'}
                x1={0}
                y1={0}
                x2={(2 * Math.PI * rMiddle * endAngle / 360).toFixed(2)}
                y2={0}>
                <Stop offset="0" stopColor={"#ff0000"}/>
                <Stop offset="0.36" stopColor={"#ef52a3"}/>
                <Stop offset="0.7" stopColor={"#b445dd"}/>
                <Stop offset="1" stopColor={"#0000ff"}/>
              </LinearGradient>
            </Defs>

            <G>
              <Line
                x={5}
                y={10}
                x1={0}
                y1={0}
                x2={(2 * Math.PI * rMiddle * endAngle / 360).toFixed(2)}
                y2={0}
                stroke={'url(#wholeArcLengthLine)'}
                strokeWidth="5"/>

              <Path
                x={100}
                y={100}
                d={circlePath()}
                fill={'url(#wholeArcLengthLine)'}/>
            </G>
          </Svg>
        </View>

        <View style={{width: 200, height: 120, backgroundColor: '#000000', marginTop: 2}}>
          <Svg width={200} height={100}>
            <Defs>
              <LinearGradient
                id={'matchToSingleLinearGradient_half'}
                x1={0}
                y1={0}
                x2={50}//所匹配的shape的长度应该为50，否则就会被截断或者超出部分都以最终offset的stopColor为主
                y2={0}>
                <Stop offset="0" stopColor={"#ff0000"}/>
                <Stop offset="0.36" stopColor={"#ef52a3"}/>
                <Stop offset="0.7" stopColor={"#b445dd"}/>
                <Stop offset="1" stopColor={"#0000ff"}/>
              </LinearGradient>
              <LinearGradient
                id={'matchToSingleLinearGradient'}
                x1={0}
                y1={0}
                x2={100}//所匹配的shape的长度应该为100，否则就会被截断或者超出部分都以最终offset的stopColor为主
                y2={0}>
                <Stop offset="0" stopColor={"#ff0000"}/>
                <Stop offset="0.36" stopColor={"#ef52a3"}/>
                <Stop offset="0.7" stopColor={"#b445dd"}/>
                <Stop offset="1" stopColor={"#0000ff"}/>
              </LinearGradient>
              <LinearGradient
                id={'matchToSingleLinearGradient_multi'}
                x1={0}
                y1={0}
                x2={200}//所匹配的shape的长度应该为200，否则就会被截断或者超出部分都以最终offset的stopColor为主
                y2={0}>
                <Stop offset="0" stopColor={"#ff0000"}/>
                <Stop offset="0.36" stopColor={"#ef52a3"}/>
                <Stop offset="0.7" stopColor={"#b445dd"}/>
                <Stop offset="1" stopColor={"#0000ff"}/>
              </LinearGradient>
            </Defs>

            <G>
              <Line
                x={0}
                y={10}
                x1={0}
                y1={0}
                x2={50}//正常长度为50的Line
                y2={0}
                stroke={'url(#matchToSingleLinearGradient_half)'}
                strokeWidth={20}/>
              <Line
                x={0}
                y={30}
                x1={0}
                y1={0}
                x2={50}//此处的 x2 只到了50，然而 matchToSingleLinearGradient 中的 x2 为100，所以此Line的渐变是下面一条的一半
                y2={0}
                stroke={'url(#matchToSingleLinearGradient)'}
                strokeWidth={20}/>
              <Line
                x={0}
                y={50}
                x1={0}
                y1={0}
                x2={100}//正常长度为100的Line
                y2={0}
                stroke={'url(#matchToSingleLinearGradient)'}
                strokeWidth={20}/>
              <Line
                x={0}
                y={70}
                x1={0}
                y1={0}
                x2={200}//此处的 x2 拉到了200，然而 matchToSingleLinearGradient 中的 x2 为100，所以此Line的渐变超出部分以最终offset的stopColor为主
                y2={0}
                stroke={'url(#matchToSingleLinearGradient)'}
                strokeWidth={20}/>
              <Line
                x={0}
                y={90}
                x1={0}
                y1={0}
                x2={200}//正常长度为200的Line
                y2={0}
                stroke={'url(#matchToSingleLinearGradient_multi)'}
                strokeWidth={20}/>
              {/*strokeWidth 是以Line为基线（但Line并没有实际宽度）上下描边，所以这边设置 y=90，strokeWidth=20，90 + 20 ／ 2 = 100（120为画布的高度，还有20为底下组件的高度），然后Line就贴着画布的底部了*/}
            </G>
          </Svg>
          <SingleLinearGradient
            start={{x: 0.0, y: 1.0}}
            end={{x: 1.0, y: 1.0}}
            locations={[0, 0.36, 0.7, 1.0]}
            colors={['#ff0000', '#ef52a3', '#b445dd', '#0000ff']}
            style={{
              width: 100,
              height: 20,
            }}/>
        </View>
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
  },
});