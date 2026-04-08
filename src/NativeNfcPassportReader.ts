import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type StartReadingParams = {
  bacKey: {
    documentNo: string;
    expiryDate: string;
    birthDate: string;
  };
  includeImages?: boolean; // default: false
};

export type NfcResult = {
  birthDate: string;
  placeOfBirth?: string;
  issuingAuthority: string;
  documentNo: string;
  expiryDate: string;
  firstName: string;
  gender: string;
  identityNo?: string;
  lastName: string;
  mrz: string;
  nationality: string;
  facePhoto?: string; // base64
  signaturePhoto?: string; // base64
  // TODO: support on android
  documentType: string;
  documentSubType?: string;
  ldsVersion: string;
  // verifications
  chipAuthSupported: boolean;
  chipAuthStatus: 'notDone' | 'success' | 'failed';
  activeAuthSupported: boolean;
  activeAuthPassed: boolean; // Ignore if activeAuthSupported is false
  documentAuthentic: boolean;
};

export interface Spec extends TurboModule {
  startReading(params: StartReadingParams): Promise<NfcResult>;
  stopReading(): void;
  isNfcEnabled(): Promise<boolean>;
  isNfcSupported(): Promise<boolean>;
  openNfcSettings(): Promise<boolean>;
  addListener(eventName: string): void;
  removeListeners(count: number): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NfcPassportReader');
