// @flow

import { createDecipher } from 'react-native-crypto';
import { Buffer } from 'buffer';
import { setConnectUserData, removeConnectUserData } from './index';
import emitter from '../emitter';

export const decryptData = (data) => async (dispatch, getState) => {
  const { connectQrData } = getState().main;

  const { aesKey } = connectQrData;
  const decipher = createDecipher('aes192', aesKey);

  let decrypted = decipher.update(data, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  const decryptedObj = JSON.parse(decrypted);
  decryptedObj.publicKey = new Uint8Array(
    Buffer.from(decryptedObj.publicKey, 'base64'),
  );

  dispatch(removeConnectUserData());
  dispatch(setConnectUserData(decryptedObj));
  emitter.emit('connectDataReady');
};
