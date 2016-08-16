import Color from 'color'

import { getColorList } from './lib/utils/colors'
import { hostnameFactory } from './lib/info-items/hostname'
import { memoryFactory } from './lib/info-items/memory'
import { uptimeFactory } from './lib/info-items/uptime'
import { cpuFactory } from './lib/info-items/cpu'

const LINE_HEIGHT = '18px',
  LINE_PADDING = '10px',
  FONT_STYLE = 'bold 12px Monospace',
  ITEM_MARGIN = '7px',
  LINE_COLOR = '#222222',
  HOSTNAME_COLOR = '#00D0FF',
  MEMORY_INFO_COLOR = '#FFFFFF',
  UPTIME_INFO_COLOR = '#FFCC00'

export function mapHyperTermState (state, map) {
  return Object.assign({}, map, {
    colors    : state.ui.colors,
    fontFamily: state.ui.fontFamily
  })
}

export function decorateHyperTerm (HyperTerm, { React }) {
  const HyperLine = ({ style, colors, plugins }) => {
    return (
      <div style={Object.assign({}, {
        display      : "flex",
        alignItems   : "center",
        position     : "absolute",
        bottom       : 0,
        width        : "100%",
        height       : LINE_HEIGHT,
        paddingLeft  : LINE_PADDING,
        paddingRight : LINE_PADDING,
        font         : FONT_STYLE,
        pointerEvents: "none"
      }, style)}>
        {
          plugins.map((item) => {
            const Component = item.componentFactory(React, colors)
            return <Component style={{
              marginRight: ITEM_MARGIN,
              color      : item.color
            }} />
          })
        }
      </div>
    )
  }

  return class extends React.Component {
    constructor( props, context ) {
      super( props, context )

      this.colors = getColorList( this.props.colors )
      this.plugins = [
        {
          componentFactory: hostnameFactory,
          color: this.colors.blue
        },
        {
          componentFactory: memoryFactory,
          color: this.colors.white
        },
        {
          componentFactory: uptimeFactory,
          color: this.colors.yellow
        },
        {
          componentFactory: cpuFactory,
          color: 'transparent'
        }
      ]
    }

    render() {
      return <HyperTerm {...this.props} customChildren={(
        <HyperLine
          style={{
          fontFamily: this.props.fontFamily,
          background: Color(this.colors.black).darken(0.2).hslString()
          }}
          colors={this.colors}
          plugins={this.plugins}
        />
      )} />
    }
  }
}
