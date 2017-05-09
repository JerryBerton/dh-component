import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../icon';
class Input extends React.Component {
  static defaultProps = {
    placeholder: '',
    searched: false
  }
  static propsTypes = {
    width: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string
    ]),
    placeholder: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    disabled: PropTypes.bool,
    addonBefore: PropTypes.oneOfType([
      PropTypes.element,
    ]),
    addonAfter: PropTypes.oneOfType([
      PropTypes.element,
    ]),
    searched: PropTypes.bool,
    danger: PropTypes.bool
  }

  constructor(props) {
    super(props);
    this.state = {
      focus: false
    };
    this.handleBlur = this.handleBlur.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
  }
  componentWillMount() {
    if (this.props.value) {
      this.state.value = this.props.value;
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.state.value = nextProps.value;
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return !nextProps.value !== nextState.value;
  }
  handleBlur(e) {
    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
    this.setState({
      focus: false
    })
  }
  handleFocus(e) {
    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
    this.setState({
      focus: true
    })
  }
  render() {
    const {
      width,
      addonBefore,
      addonAfter,
      searched,
      ...props } = this.props;
    const style = {
      transform: this.state.focus  ? 'scaleX(1)':' scaleX(0)'
    };
    return (
      <div className="dh-input" style={{ width }}>
        {
          addonBefore &&  searched === false ? (
            <div className="dh-input-before">
            {this.props.addonBefore}
            </div>
          ) : null
        }
        {
          searched ? (
            <div className={classNames('dh-input-before', {
              'dh-input-search': searched
            })}>
              <Icon type="search"/>
            </div>
          ): null
        }
        <div className="dh-input-warp">
          <input
            className="dh-input-warp-inner"
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            {...props}
          />
        </div>


        {
          addonAfter ? (
            <div className="dh-input-after">
              { this.props.addonAfter}
            </div>
          ) : null
        }
      <div
        style={style}
        className="dh-input-bordered"/>
      </div>
    )
  }
}
export default Input;
