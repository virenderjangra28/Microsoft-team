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
import { fromFlatCommunicationIdentifier } from '@azure/communication-react';
import { setLogLevel } from '@azure/logger';
import { initializeIcons, Spinner } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { createGroupId, fetchTokenResponse, getGroupIdFromUrl, getTeamsLinkFromUrl, isLandscape, isOnIphoneAndNotSafari, navigateToHomePage, WEB_APP_TITLE } from './utils/AppUtils';
import { createRoom, getRoomIdFromUrl, addUserToRoom } from './utils/AppUtils';
import { useIsMobile } from './utils/useIsMobile';
import { CallError } from './views/CallError';
import { CallScreen } from './views/CallScreen';
import { HomeScreen } from './views/HomeScreen';
import { UnsupportedBrowserPage } from './views/UnsupportedBrowserPage';
import { getMeetingIdFromUrl } from './utils/AppUtils';
setLogLevel('error');
initializeIcons();
const App = () => {
    const [page, setPage] = useState('home');
    // User credentials to join a call with - these are retrieved from the server
    const [token, setToken] = useState();
    const [userId, setUserId] = useState();
    const [userCredentialFetchError, setUserCredentialFetchError] = useState(false);
    // Call details to join a call - these are collected from the user on the home screen
    const [callLocator, setCallLocator] = useState();
    const [targetCallees, setTargetCallees] = useState(undefined);
    const [displayName, setDisplayName] = useState('');
    const [isPresenter, setIsPresenter] = useState();
    const [isTeamsCall, setIsTeamsCall] = useState(false);
    const [localData, setLocalData] = useState();
    // Get Azure Communications Service token from the server
    useEffect(() => {
        (() => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { token, user } = yield fetchTokenResponse();
                setToken(token);
                setUserId(user);
            }
            catch (e) {
                console.error(e);
                setUserCredentialFetchError(true);
            }
        }))();
    }, []);
    const isMobileSession = useIsMobile();
    const isLandscapeSession = isLandscape();
    useEffect(() => {
        if (isMobileSession && isLandscapeSession) {
            console.log('ACS Calling sample: Mobile landscape view is experimental behavior');
        }
    }, [isMobileSession, isLandscapeSession]);
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin === 'http://localhost:4200') {
                setLocalData(event.data);
                setDisplayName(event.data.name);
                setIsPresenter(event.data.presenter);
            }
        };
        window.addEventListener('message', handleMessage);
    }, []);
    const supportedBrowser = !isOnIphoneAndNotSafari();
    if (!supportedBrowser) {
        return React.createElement(UnsupportedBrowserPage, null);
    }
    switch (page) {
        case 'home': {
            document.title = `home - ${WEB_APP_TITLE}`;
            // Show a simplified join home screen if joining an existing call
            const joiningExistingCall = !!getGroupIdFromUrl() || !!getTeamsLinkFromUrl() || !!getMeetingIdFromUrl() || !!getRoomIdFromUrl();
            return (React.createElement(React.Fragment, null, displayName && (React.createElement(HomeScreen, { localData: localData, joiningExistingCall: joiningExistingCall, startCallHandler: (callDetails) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a;
                    setDisplayName(callDetails.displayName);
                    let callLocator = callDetails.callLocator ||
                        getRoomIdFromUrl() ||
                        getTeamsLinkFromUrl() ||
                        getMeetingIdFromUrl() ||
                        getGroupIdFromUrl() ||
                        createGroupId();
                    if (callDetails.option === 'Rooms') {
                        callLocator = getRoomIdFromUrl() || callDetails.callLocator;
                    }
                    if (callDetails.option === 'TeamsAdhoc') {
                        const outboundTeamsUsers = (_a = callDetails.outboundTeamsUsers) === null || _a === void 0 ? void 0 : _a.map((user) => {
                            return fromFlatCommunicationIdentifier(user);
                        });
                        callLocator = undefined;
                        setTargetCallees(outboundTeamsUsers);
                    }
                    // There is an API call involved with creating a room so lets only create one if we know we have to
                    if (callDetails.option === 'StartRooms') {
                        let roomId = '';
                        try {
                            roomId = yield createRoom();
                        }
                        catch (e) {
                            console.log(e);
                        }
                        callLocator = { roomId: roomId };
                    }
                    if (callLocator && 'roomId' in callLocator) {
                        if (userId && 'communicationUserId' in userId) {
                            yield addUserToRoom(userId.communicationUserId, callLocator.roomId, callDetails.role);
                        }
                        else {
                            throw 'Invalid userId!';
                        }
                    }
                    setCallLocator(callLocator);
                    // Update window URL to have a joinable link
                    if (callLocator && !joiningExistingCall) {
                        window.history.pushState({}, document.title, window.location.origin + getJoinParams(callLocator) + getIsCTEParam(!!callDetails.teamsToken));
                    }
                    setIsTeamsCall(!!callDetails.teamsToken);
                    callDetails.teamsToken && setToken(callDetails.teamsToken);
                    callDetails.teamsId &&
                        setUserId(fromFlatCommunicationIdentifier(callDetails.teamsId));
                    setPage('call');
                }) }))));
        }
        case 'call': {
            if (userCredentialFetchError) {
                document.title = `error - ${WEB_APP_TITLE}`;
                return (React.createElement(CallError, { title: "Error getting user credentials from server", reason: "Ensure the sample server is running.", rejoinHandler: () => setPage('call'), homeHandler: navigateToHomePage }));
            }
            if (!token || !userId || (!displayName && !isTeamsCall) || (!targetCallees && !callLocator)) {
                document.title = `credentials - ${WEB_APP_TITLE}`;
                return React.createElement(Spinner, { label: 'Getting user credentials from server', ariaLive: "assertive", labelPosition: "top" });
            }
            return (React.createElement(CallScreen, { token: token, userId: userId, displayName: displayName, callLocator: callLocator, targetCallees: targetCallees, isTeamsIdentityCall: isTeamsCall }));
        }
        default:
            document.title = `error - ${WEB_APP_TITLE}`;
            return React.createElement(React.Fragment, null, "Invalid page");
    }
};
const getIsCTEParam = (isCTE) => {
    return isCTE ? '&isCTE=true' : '';
};
const getJoinParams = (locator) => {
    if ('meetingLink' in locator) {
        return '?teamsLink=' + encodeURIComponent(locator.meetingLink);
    }
    if ('meetingId' in locator) {
        return ('?meetingId=' + encodeURIComponent(locator.meetingId) + (locator.passcode ? '&passcode=' + locator.passcode : ''));
    }
    if ('roomId' in locator) {
        return '?roomId=' + encodeURIComponent(locator.roomId);
    }
    return '?groupId=' + encodeURIComponent(locator.groupId);
};
export default App;
//# sourceMappingURL=App.js.map