import { DeviceEventEmitter, Platform } from 'react-native';
import NativeNfcPassportReader, {
  type NfcResult,
  type StartReadingParams,
} from './NativeNfcPassportReader';

const LINKING_ERROR =
  `The package 'react-native-nfc-passport-reader-v2' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const NfcPassportReaderNativeModule = NativeNfcPassportReader
  ? NativeNfcPassportReader
  : new Proxy({} as any, {
      get() {
        throw new Error(LINKING_ERROR);
      },
    });

enum NfcPassportReaderEvent {
  TAG_DISCOVERED = 'onTagDiscovered',
  NFC_STATE_CHANGED = 'onNfcStateChanged',
}

export default class NfcPassportReader {
  static startReading(params: StartReadingParams): Promise<NfcResult> {
    return NfcPassportReaderNativeModule.startReading(params);
  }
  static stopReading() {
    if (Platform.OS === 'android') {
      NfcPassportReaderNativeModule.stopReading();
    } else {
      throw new Error('Unsupported platform');
    }
  }
  static addOnTagDiscoveredListener(callback: () => void) {
    if (Platform.OS === 'android') {
      this.addListener(NfcPassportReaderEvent.TAG_DISCOVERED, callback);
    }
  }
  static addOnNfcStateChangedListener(callback: (state: 'off' | 'on') => void) {
    if (Platform.OS === 'android') {
      this.addListener(NfcPassportReaderEvent.NFC_STATE_CHANGED, callback);
    }
  }
  static isNfcEnabled(): Promise<boolean> {
    if (Platform.OS === 'android') {
      return NfcPassportReaderNativeModule.isNfcEnabled();
    } else if (Platform.OS === 'ios') {
      return NfcPassportReaderNativeModule.isNfcSupported();
    } else {
      throw new Error('Unsupported platform');
    }
  }
  static isNfcSupported(): Promise<boolean> {
    return NfcPassportReaderNativeModule.isNfcSupported();
  }
  static openNfcSettings(): Promise<boolean> {
    if (Platform.OS === 'android') {
      return NfcPassportReaderNativeModule.openNfcSettings();
    } else {
      throw new Error('Unsupported platform');
    }
  }
  private static addListener(
    event: NfcPassportReaderEvent,
    callback: (data: any) => void
  ) {
    DeviceEventEmitter.addListener(event, callback);
  }
  static removeListeners() {
    if (Platform.OS === 'android') {
      DeviceEventEmitter.removeAllListeners(
        NfcPassportReaderEvent.TAG_DISCOVERED
      );
      DeviceEventEmitter.removeAllListeners(
        NfcPassportReaderEvent.NFC_STATE_CHANGED
      );
    }
  }
}

export type { NfcResult, StartReadingParams };
