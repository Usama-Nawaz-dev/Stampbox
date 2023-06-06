// @flow
import React, { Component } from "react";
import { View, Text } from "react-native";
import moment from "moment";
import colors from "../constant/colors";

export default class TimeAgo extends Component {
  props: {
    time: string,
    interval?: number,
    hideAgo?: boolean,
    color?: string,
  };
  state: { timer: null | number } = { timer: null };

  static defaultProps = {
    hideAgo: false,
    interval: 60000,
  };

  componentDidMount() {
    this.createTimer();
  }

  createTimer = () => {
    this.setState({
      timer: setTimeout(() => {
        this.update();
      }, this.props.interval),
    });
  };

  componentWillUnmount() {
    clearTimeout(this.state.timer);
  }

  update = () => {
    this.forceUpdate();
    this.createTimer();
  };

  render() {
    const { time, hideAgo, color } = this.props;
    return (
      <Text
        style={{
          fontSize: 10,
          color: color ? color : colors.lightText,
        }}
        {...this.props}
      >
        {moment(time).fromNow(hideAgo)}
      </Text>
    );
  }
}
