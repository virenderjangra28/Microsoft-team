// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v1 as generateGUID } from 'uuid';
/**
 * Get ACS user token from the Contoso server.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchTokenResponse = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch('/token?scope=voip');
    if (response.ok) {
        const responseAsJson = yield response.json();
        const token = responseAsJson.token;
        if (token) {
            return responseAsJson;
        }
    }
    throw new Error('Invalid token response');
});
/**
 * Generate a random user name.
 * @return username in the format user####
 */
export const createRandomDisplayName = () => 'user' + Math.ceil(Math.random() * 1000);
/**
 * Get group id from the url's query params.
 */
export const getGroupIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const gid = urlParams.get('groupId');
    return gid ? { groupId: gid } : undefined;
};
export const createGroupId = () => ({ groupId: generateGUID() });
/**
 * Create an ACS room
 */
export const createRoom = () => __awaiter(void 0, void 0, void 0, function* () {
    const requestOptions = {
        method: 'POST'
    };
    const response = yield fetch(`/createRoom`, requestOptions);
    if (!response.ok) {
        throw 'Unable to create room';
    }
    const body = yield response.json();
    return body['id'];
});
/**
 * Add user to an ACS room with a given roomId and role
 */
export const addUserToRoom = (userId, roomId, role) => __awaiter(void 0, void 0, void 0, function* () {
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: userId, roomId: roomId, role: role })
    };
    const response = yield fetch('/addUserToRoom', requestOptions);
    if (!response.ok) {
        throw 'Unable to add user to room';
    }
});
/**
 * Get teams meeting link from the url's query params.
 */
export const getTeamsLinkFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const teamsLink = urlParams.get('teamsLink');
    return teamsLink ? { meetingLink: teamsLink } : undefined;
};
/**
 * Get teams meeting id and passcode from the url's query params.
 */
export const getMeetingIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const meetingId = urlParams.get('meetingId');
    const passcode = urlParams.get('passcode');
    return meetingId ? { meetingId: meetingId, passcode: passcode ? passcode : undefined } : undefined;
};
/**
 * Get teams meeting link from the url's query params.
 */
export const getIsCTE = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('isCTE') === 'true';
};
/**
 * Get room id from the url's query params.
 */
export const getRoomIdFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('roomId');
    return roomId ? { roomId } : undefined;
};
/*
 * TODO:
 *  Remove this method once the SDK improves error handling for unsupported browser.
 */
export const isOnIphoneAndNotSafari = () => {
    const userAgent = navigator.userAgent;
    // Chrome uses 'CriOS' in user agent string and Firefox uses 'FxiOS' in user agent string.
    return userAgent.includes('iPhone') && (userAgent.includes('FxiOS') || userAgent.includes('CriOS'));
};
export const isLandscape = () => window.innerWidth < window.innerHeight;
export const navigateToHomePage = () => {
    window.location.href = window.location.href.split('?')[0];
};
export const WEB_APP_TITLE = document.title;
//# sourceMappingURL=AppUtils.js.map