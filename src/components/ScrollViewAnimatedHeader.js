// @flow

import React, { Component, Fragment } from "react";
import { Animated } from "react-native";

import type AnimatedValue from "react-native/Libraries/Animated/src/nodes/AnimatedValue";

type Props = {
  children: React$Node,
  headerComponent: ({ scrollY: AnimatedValue }) => React$Node,
};

type State = {
  scrollY: Object,
};

/**
 * @name ScrollViewAnimatedHeader
 *
 * @prop chidren React.Node - children to render
 * @prop headerComponent React.Component - the header that needs to be animated on scroll
 *                                         it takes scrollY as prop
 */
export default class ScrollViewAnimatedHeader extends Component<Props, State> {
  state = {
    scrollY: new Animated.Value(0),
  };

  render() {
    const { children, headerComponent: Header } = this.props;

    return (
      <Fragment>
        <Animated.ScrollView
          contentContainerStyle={{ marginTop: 150 }}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    y: this.state.scrollY,
                  },
                },
              },
            ],
            {
              useNativeDriver: true,
            },
          )}
        >
          {children}
        </Animated.ScrollView>
        <Header scrollY={this.state.scrollY} />
      </Fragment>
    );
  }
}