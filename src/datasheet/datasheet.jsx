import React from 'react';
import ReactDOM from 'react-dom';

// import update from 'react/lib/update';
import PropTypes from 'prop-types';

import Row from './row.jsx';
function buildArray(number = 0) {
  let _array = [];
  for (let index = 0; index < number; index++) {
    _array.push({});
  }
  return _array
}

const ROW_HEIGHT = 33; //默认行高
const SCROLL_PERCENT = 0.8; //滚动预加载百分比
class Datasheet extends React.Component {
  static propTypes = {
    header: PropTypes.array,
    dataSource: PropTypes.array,
    onChange: PropTypes.func,
    onLoad: PropTypes.func,
    count: PropTypes.number, //一次加载的数据条数 至少满足：count <= dataSource.length
    page: PropTypes.number
  }
  static  defaultProps = {
    count: 20
  }
  constructor(props) {
    super(props);
    this.state = {
      dataSource: []
    }
    this.page = 1;
    this.handleSeleteCell = this.handleSeleteCell.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleDoubleClick = this.handleDoubleClick.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }
  componentWillMount() {
    if (this.props.dataSource && Array.isArray(this.props.dataSource)) {
      this.setState({ dataSource: this.initHeadData(this.props.dataSource) });
    }
  }
  componentDidMount() {
    // const $datasheet = ReactDOM.findDOMNode(this);
    // const $parentNode = $datasheet.parentNode;
    // console.log('la', $parentNode.clientWidth)
  }
  componentWillReceiveProps(nextProps) {
    // if(nextProps.dataSource.length !== nextProps)
      this.setState({dataSource: this.initHeadData(nextProps.dataSource)})
  }
  initHeadData(dataSource) {
    let header = this.props.header;
    return Array.isArray(dataSource) ? dataSource.map(item => {
      if (header.length > item.length) {
          return [].concat(item, buildArray(header.length - item.length))
      }
      return item;
    }) : []
  }
  handleSeleteCell(rIndex, index) {
    const dataSource = this.state.dataSource;
    const _dataSource = dataSource.map((item, idx) => {
      if (rIndex === idx) {
        return item.map((c, jdx) => ({
            ...c,
            editable: false,
            selected: jdx === index ? true : false
          })
        );
      }
      return item.map(c => ({...c, editable: false, selected: false }));
    })
    this.setState({ dataSource: _dataSource })
  }
  handleChange(rIndex, index, value) {
    let [rowData, cellData] = [null, null];
    const dataSource = this.state.dataSource.map((item, idx) => {
      if (idx === rIndex) {
        rowData = item.map((c, jdx) => {
          if (jdx === index) {
            cellData = {...c, value}
            return cellData;
          }
          return c;
        });
        return rowData;
      }
      return item;
    });
    this.setState({ dataSource }, () => {
      let row = rowData.map(item => {
        let { value, editable, selected, ...others} = item;
        return { value, ...others }
      });
      if (this.props.onChange && typeof this.props.onChange === 'function') {
        let { value, editable, selected, ...others} = cellData;
        this.props.onChange({ index, rowIndex: rIndex }, { value, ...others }, row)
      }
    })
  }
  handleKeyDown() {
    const dataSource = this.state.dataSource;
    const _dataSource = dataSource.map((item, idx) =>
      item.map(c => ({...c, editable: c.selected ? true : false }))
    )
    this.setState({ dataSource: _dataSource })
  }
  handleDoubleClick(rIndex, index) {
    const dataSource = this.state.dataSource.map((item, idx) => {
      if (idx === rIndex) {
        return item.map((c, jdx) => ({
          ...c,
          editable: jdx === index ? true : false
        }));
      }
      return item.map(c => ({...c, editable: false, selected: false }));
    })
    this.setState({ dataSource });
  }
  handleScroll() {
    const { count } = this.props;
    const { scrollTop, scrollHeight, clientHeight } = this.refs.datasheet;
      this.refs.thead.style.transform = `translateY(${scrollTop}px)`;
      if (scrollTop + clientHeight >= ROW_HEIGHT * (count + 1)) {
        this.page += 1;
        this.props.onLoad(this.page, this.refs.datasheet)
      }
      if (scrollTop > 0 && scrollTop < ROW_HEIGHT && this.page > 1 ) {
        this.page -= 1;
        this.props.onLoad(this.page, this.refs.datasheet)
      }
  }
  render() {
    const dataSource = this.state.dataSource;
    const header = this.props.header;
    const { xScroll } = this.props;
    let tStyle = null;
    if (xScroll) {
      tStyle={ width: xScroll };
    }
    return (
      <div
        className="dh-datasheet"
        ref="datasheet"
        onScroll={this.handleScroll}
        onWheel={this.handleScroll}
        >
        <table
          tabIndex="-1"
          cellSpacing="0"
          onKeyDown={this.handleKeyDown}
          style={tStyle}
        >
          <thead ref="thead">
            <tr>
              <th />
              {
                header.map((item, idx) => (
                  <th key={`datasheet-th-${idx}`}>{item.title}</th>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {
              dataSource.map((item, idx) => (
                <Row
                  index={idx}
                  data={item}
                  key={`datasheet-row-${idx}`}
                  onChange={this.handleChange}
                  onDoubleClick={this.handleDoubleClick}
                  onEditable={this.handleEditable}
                  onSelectCell={this.handleSeleteCell}
                />
              ))
            }
          </tbody>
        </table>
      </div>
    )
  }
}
export default Datasheet
