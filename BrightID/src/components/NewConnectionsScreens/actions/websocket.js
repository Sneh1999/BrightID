// @flow

import io from 'socket.io-client';
import { Alert } from "react-native";
import { fetchData } from './fetchData';

export const setUpWs = () => (
  dispatch: (() => null) => null,
  getState: () => {
    main: {
      connectQrData: {
        ipAddress: string,
        uuid: string,
        channel: string,
      },
    },
  },
) => {
  try {
    const { ipAddress, channel } = getState().main.connectQrData;

    const socket = io.connect(`http://${ipAddress}`);

    socket.emit('join', channel);

    console.log(`Joined channel: ${channel}`);

    socket.on('signals', () => {
      console.log('signals');
      dispatch(fetchData());
    });

    return socket;
  } catch (err){
    Alert.alert(err.message || 'Error', err.stack);
  }
};
