// @flow

import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { BleErrorCode } from "react-native-ble-plx";
import Icon from "react-native-vector-icons/dist/Feather";
import { Trans } from "react-i18next";
import {
  PairingFailed,
  GenuineCheckFailed,
} from "@ledgerhq/live-common/lib/errors";
import LocationRequired from "../LocationRequired";
import { TrackScreen } from "../../analytics";
import Touchable from "../../components/Touchable";
import LText from "../../components/LText";
import Button from "../../components/Button";
import TranslatedError from "../../components/TranslatedError";
import BluetoothScanning from "../../components/BluetoothScanning";
import HelpLink from "../../components/HelpLink";
import Circle from "../../components/Circle";
import IconArrowRight from "../../icons/ArrowRight";
import colors from "../../colors";

type Props = {
  error: Error,
  status: string,
  onRetry: () => void,
  onBypassGenuine: () => void,
};

const hitSlop = {
  top: 16,
  left: 16,
  right: 16,
  bottom: 16,
};

const GenericErrorHeader = () => (
  <Circle bg={colors.lightAlert} size={80}>
    <LText>
      <Icon name="alert-triangle" size={40} color={colors.alert} />
    </LText>
  </Circle>
);

const PairingFailure = () => <BluetoothScanning isError />;

class RenderError extends Component<Props> {
  render() {
    const { error, status, onBypassGenuine, onRetry } = this.props;

    // $FlowFixMe
    if (error.errorCode === BleErrorCode.LocationServicesDisabled) {
      return <LocationRequired onRetry={onRetry} errorType="disabled" />;
    }

    // $FlowFixMe
    if (error.errorCode === BleErrorCode.BluetoothUnauthorized) {
      return <LocationRequired onRetry={onRetry} errorType="unauthorized" />;
    }

    const primaryError =
      status === "pairing"
        ? new PairingFailed()
        : status === "genuinecheck"
          ? new GenuineCheckFailed()
          : error;

    const Header = status === "pairing" ? PairingFailure : GenericErrorHeader;

    return (
      <View style={styles.root}>
        <TrackScreen category="PairDevices" name="Error" />
        <View style={styles.body}>
          <Header />
          <LText semiBold secondary style={styles.title}>
            <TranslatedError error={primaryError} />
          </LText>
          <LText style={styles.description}>
            <TranslatedError error={primaryError} field="description" />
          </LText>
          <View style={styles.buttonContainer}>
            <Button
              event="PairDevicesRetry"
              type="primary"
              title={<Trans i18nKey="common.retry" />}
              onPress={onRetry}
              containerStyle={styles.button}
            />
          </View>
          {status === "genuinecheck" ? (
            <Touchable
              event="PairDevicesBypassGenuine"
              onPress={onBypassGenuine}
              hitSlop={hitSlop}
              style={styles.linkContainer}
            >
              <LText style={styles.linkText} semiBold>
                <Trans i18nKey="PairDevices.bypassGenuine" />{" "}
              </LText>
              <IconArrowRight size={16} color={colors.live} />
            </Touchable>
          ) : (
            <HelpLink style={styles.linkContainer} />
          )}
        </View>
        {status === "genuinecheck" ? (
          <View style={styles.footer}>
            <HelpLink style={styles.linkContainerGenuine} />
          </View>
        ) : null}
      </View>
    );
  }
}

export default RenderError;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: "column",
  },
  body: {
    flex: 1,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  title: {
    marginTop: 32,
    textAlign: "center",
    color: colors.darkBlue,
    fontSize: 18,
  },
  description: {
    marginTop: 16,
    paddingHorizontal: 24,
    textAlign: "center",
    fontSize: 14,
    lineHeight: 21,
    color: colors.smoke,
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 32,
  },
  button: {
    flex: 1,
  },
  linkContainer: {
    marginTop: 24,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  linkContainerGenuine: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  linkText: {
    color: colors.live,
    marginLeft: 6,
  },
  footer: {
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderColor: colors.lightFog,
  },
});
