// @flow

import {
  USER_SCORE,
  GROUPS_COUNT,
  SEARCH_PARAM,
  SET_NEW_GROUP_CO_FOUNDERS,
  CLEAR_NEW_GROUP_CO_FOUNDERS,
  SET_ELIGIBLE_GROUPS,
  DELETE_ELIGIBLE_GROUP,
  SET_CURRENT_GROUPS,
  JOIN_GROUP,
  JOIN_GROUP_AS_CO_FOUNDER,
  LEAVE_GROUP,
  UPDATE_CONNECTIONS,
  CONNECTIONS_SORT,
  ADD_CONNECTION,
  UPDATE_USER_DATA,
  REMOVE_USER_DATA,
  USER_PHOTO,
  SET_CONNECT_QR_DATA,
  REMOVE_CONNECT_QR_DATA,
  REMOVE_CONNECTION,
  SET_CONNECT_USER_DATA,
  REMOVE_CONNECT_USER_DATA,
} from '../actions';
import { b64ToUrlSafeB64 } from '../utils/encoding';

/**
 * INITIAL STATE
 * structure the state of the app here
 *
 * @param score number
 * @param name String
 * @param photo Image
 * @param groupsCount Number
 * @param searchParam String
 * @param connections Array => Object
 */

export const initialState: Main = {
  score: 0,
  name: '',
  photo: { filename: '' },
  groupsCount: 0,
  searchParam: '',
  newGroupCoFounders: [],
  eligibleGroups: [],
  currentGroups: [],
  connections: [],
  publicKey: '',
  safePubKey: '',
  secretKey: new Uint8Array([]),
  connectionsSort: '',
  connectQrData: {
    aesKey: '',
    ipAddress: '',
    uuid: '',
    user: '',
    qrString: '',
    channel: '',
  },
  connectUserData: {
    publicKey: '',
    photo: '',
    name: '',
    timestamp: 0,
    signedMessage: '',
    score: 0,
  },
};

export const mainReducer = (state: Main = initialState, action: action) => {
  let newElGroups;
  let groupIndex;
  // let group;
  let newKnownMembers;
  switch (action.type) {
    case USER_SCORE:
      return {
        ...state,
        score: action.score,
      };
    case GROUPS_COUNT:
      return {
        ...state,
        groupsCount: action.groupsCount,
      };
    case USER_PHOTO:
      return {
        ...state,
        photo: action.photo,
      };
    case SEARCH_PARAM:
      return {
        ...state,
        searchParam: action.searchParam,
      };
    case SET_NEW_GROUP_CO_FOUNDERS: {
      return {
        ...state,
        newGroupCoFounders: action.newGroupCoFounders,
      };
    }
    case CLEAR_NEW_GROUP_CO_FOUNDERS: {
      return {
        ...state,
        newGroupCoFounders: [],
      };
    }
    case SET_ELIGIBLE_GROUPS:
      return {
        ...state,
        eligibleGroups: action.eligibleGroups,
      };
    case DELETE_ELIGIBLE_GROUP:
      return {
        ...state,
        eligibleGroups: state.eligibleGroups.filter(
          (group) => group.id !== action.groupId,
        ),
      };
    case SET_CURRENT_GROUPS:
      return {
        ...state,
        currentGroups: action.currentGroups,
      };
    case JOIN_GROUP:
      action.group.isNew = false;
      action.group.knownMembers.push(state.safePubKey);
      return {
        ...state,
        currentGroups: [action.group, ...state.currentGroups],
        eligibleGroups: state.eligibleGroups.filter(
          (group) => group.id !== action.group.id,
        ),
      };
    case JOIN_GROUP_AS_CO_FOUNDER:
      // modify eligibleGroups[groupIndex].knownMembers, creating copies
      // at each of those three levels
      newElGroups = state.eligibleGroups.slice();
      groupIndex = newElGroups.findIndex((g) => g.id === action.groupId);
      group = newElGroups[groupIndex];
      newKnownMembers = [...group.knownMembers, state.safePubKey];
      newElGroups[groupIndex] = { ...group, knownMembers: newKnownMembers };
      return {
        ...state,
        eligibleGroups: newElGroups,
      };
    case LEAVE_GROUP:
      return {
        ...state,
        currentGroups: state.currentGroups.filter(
          (group) => group.id !== action.groupId,
        ),
      };
    case UPDATE_CONNECTIONS:
      return {
        ...state,
        connections: action.connections,
      };
    case CONNECTIONS_SORT:
      return {
        ...state,
        connectionsSort: action.connectionsSort,
      };
    case REMOVE_CONNECTION:
      return {
        ...state,
        connections: state.connections.filter(
          (val: connection) => val.publicKey !== action.publicKey,
        ),
      };
    case UPDATE_USER_DATA:
      return {
        ...state,
        photo: action.photo,
        name: action.name,
        publicKey: action.publicKey,
        safePubKey: b64ToUrlSafeB64(action.publicKey),
        secretKey: action.secretKey,
      };
    case REMOVE_USER_DATA:
      return {
        ...state,
        photo: '',
        name: '',
        publicKey: '',
        safePubKey: '',
        secretKey: null,
      };
    case SET_CONNECT_QR_DATA:
      // Compute the websocket channel and download (but not upload) path

      action.connectQrData.channel =
        action.connectQrData.uuid +
        (action.connectQrData.user === '1' ? '2' : '1');
      return {
        ...state,
        connectQrData: action.connectQrData,
      };
    case REMOVE_CONNECT_QR_DATA:
      return {
        ...state,
        connectQrData: {
          aesKey: '',
          ipAddress: '',
          uuid: '',
          user: '',
          qrString: '',
          channel: '',
        },
      };
    case SET_CONNECT_USER_DATA:
      return {
        ...state,
        connectUserData: action.connectUserData,
      };
    case REMOVE_CONNECT_USER_DATA:
      return {
        ...state,
        connectUserData: {
          publicKey: '',
          photo: '',
          name: '',
          timestamp: '',
          signedMessage: '',
        },
      };
    default:
      return state;
  }
};

// unnecessary for now, but when the app gets larger, combine reducers here

export default mainReducer;
