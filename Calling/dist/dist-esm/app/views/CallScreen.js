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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { useAzureCommunicationCallAdapter, toFlatCommunicationIdentifier } from '@azure/communication-react';
import { useTeamsCallAdapter } from '@azure/communication-react';
import { onResolveVideoEffectDependencyLazy } from '@azure/communication-react';
import React, { useCallback, useMemo, useRef } from 'react';
import { createAutoRefreshingCredential } from '../utils/credential';
import { WEB_APP_TITLE } from '../utils/AppUtils';
import { CallCompositeContainer } from './CallCompositeContainer';
export const CallScreen = (props) => {
    const { token, userId, isTeamsIdentityCall } = props;
    const callIdRef = useRef();
    const subscribeAdapterEvents = useCallback((adapter) => {
        adapter.on('error', (e) => {
            // Error is already acted upon by the Call composite, but the surrounding application could
            // add top-level error handling logic here (e.g. reporting telemetry).
            console.log('Adapter error event:', e);
        });
        adapter.onStateChange((state) => {
            var _a, _b, _c;
            const pageTitle = convertPageStateToString(state);
            document.title = `${pageTitle} - ${WEB_APP_TITLE}`;
            if (((_a = state === null || state === void 0 ? void 0 : state.call) === null || _a === void 0 ? void 0 : _a.id) && callIdRef.current !== ((_b = state === null || state === void 0 ? void 0 : state.call) === null || _b === void 0 ? void 0 : _b.id)) {
                callIdRef.current = (_c = state === null || state === void 0 ? void 0 : state.call) === null || _c === void 0 ? void 0 : _c.id;
                console.log(`Call Id: ${callIdRef.current}`);
            }
        });
        adapter.on('transferAccepted', (e) => {
            console.log('Call being transferred to: ' + e);
        });
    }, []);
    const afterCallAdapterCreate = useCallback((adapter) => __awaiter(void 0, void 0, void 0, function* () {
        subscribeAdapterEvents(adapter);
        return adapter;
    }), [subscribeAdapterEvents]);
    const afterTeamsCallAdapterCreate = useCallback((adapter) => __awaiter(void 0, void 0, void 0, function* () {
        subscribeAdapterEvents(adapter);
        return adapter;
    }), [subscribeAdapterEvents]);
    const credential = useMemo(() => {
        if (isTeamsIdentityCall) {
            return new AzureCommunicationTokenCredential(token);
        }
        return createAutoRefreshingCredential(toFlatCommunicationIdentifier(userId), token);
    }, [token, userId, isTeamsIdentityCall]);
    if (isTeamsIdentityCall) {
        return React.createElement(TeamsCallScreen, Object.assign({ afterCreate: afterTeamsCallAdapterCreate, credential: credential }, props));
    }
    if (props.callLocator) {
        return React.createElement(AzureCommunicationCallScreen, Object.assign({ afterCreate: afterCallAdapterCreate, credential: credential }, props));
    }
    else {
        return (React.createElement(AzureCommunicationOutboundCallScreen, Object.assign({ afterCreate: afterCallAdapterCreate, credential: credential }, props)));
    }
};
const TeamsCallScreen = (props) => {
    const { afterCreate, callLocator: locator, userId } = props, adapterArgs = __rest(props, ["afterCreate", "callLocator", "userId"]);
    if (!(locator && 'meetingLink' in locator)) {
        throw new Error('A teams meeting locator must be provided for Teams Identity Call.');
    }
    if (!('microsoftTeamsUserId' in userId)) {
        throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
    }
    const teamsAdapterOptions = useMemo(() => ({
        videoBackgroundOptions: {
            videoBackgroundImages
        }
    }), []);
    const adapter = useTeamsCallAdapter(Object.assign(Object.assign({}, adapterArgs), { userId,
        locator, options: teamsAdapterOptions }), afterCreate);
    return React.createElement(CallCompositeContainer, Object.assign({}, props, { adapter: adapter }));
};
const AzureCommunicationCallScreen = (props) => {
    const { afterCreate, callLocator: locator, userId } = props, adapterArgs = __rest(props, ["afterCreate", "callLocator", "userId"]);
    if (!('communicationUserId' in userId)) {
        throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
    }
    const callAdapterOptions = useMemo(() => {
        return {
            videoBackgroundOptions: {
                videoBackgroundImages,
                onResolveDependency: onResolveVideoEffectDependencyLazy
            },
            callingSounds: {
                callEnded: { url: '/assets/sounds/callEnded.mp3' },
                callRinging: { url: '/assets/sounds/callRinging.mp3' },
                callBusy: { url: '/assets/sounds/callBusy.mp3' }
            },
            reactionResources: {
                likeReaction: { url: '/assets/reactions/likeEmoji.png', frameCount: 102 },
                heartReaction: { url: '/assets/reactions/heartEmoji.png', frameCount: 102 },
                laughReaction: { url: '/assets/reactions/laughEmoji.png', frameCount: 102 },
                applauseReaction: { url: '/assets/reactions/clapEmoji.png', frameCount: 102 },
                surprisedReaction: { url: '/assets/reactions/surprisedEmoji.png', frameCount: 102 }
            }
        };
    }, []);
    const adapter = useAzureCommunicationCallAdapter(Object.assign(Object.assign({}, adapterArgs), { userId,
        locator, options: callAdapterOptions }), afterCreate);
    return React.createElement(CallCompositeContainer, Object.assign({}, props, { adapter: adapter }));
};
const AzureCommunicationOutboundCallScreen = (props) => {
    const { afterCreate, targetCallees: targetCallees, userId } = props, adapterArgs = __rest(props, ["afterCreate", "targetCallees", "userId"]);
    if (!('communicationUserId' in userId)) {
        throw new Error('A MicrosoftTeamsUserIdentifier must be provided for Teams Identity Call.');
    }
    const callAdapterOptions = useMemo(() => {
        return {
            videoBackgroundOptions: {
                videoBackgroundImages,
                onResolveDependency: onResolveVideoEffectDependencyLazy
            },
            callingSounds: {
                callEnded: { url: '/assets/sounds/callEnded.mp3' },
                callRinging: { url: '/assets/sounds/callRinging.mp3' },
                callBusy: { url: '/assets/sounds/callBusy.mp3' }
            },
            reactionResources: {
                likeReaction: { url: '/assets/reactions/likeEmoji.png', frameCount: 102 },
                heartReaction: { url: '/assets/reactions/heartEmoji.png', frameCount: 102 },
                laughReaction: { url: '/assets/reactions/laughEmoji.png', frameCount: 102 },
                applauseReaction: { url: '/assets/reactions/clapEmoji.png', frameCount: 102 },
                surprisedReaction: { url: '/assets/reactions/surprisedEmoji.png', frameCount: 102 }
            },
            onFetchProfile: (userId, defaultProfile) => __awaiter(void 0, void 0, void 0, function* () {
                if (userId === '<28:orgid:Enter your teams app here>') {
                    return { displayName: 'Teams app display name' };
                }
                return defaultProfile;
            })
        };
    }, []);
    const adapter = useAzureCommunicationCallAdapter(Object.assign(Object.assign({}, adapterArgs), { userId, targetCallees: targetCallees, options: callAdapterOptions }), afterCreate);
    return React.createElement(CallCompositeContainer, Object.assign({}, props, { adapter: adapter }));
};
const convertPageStateToString = (state) => {
    switch (state.page) {
        case 'accessDeniedTeamsMeeting':
            return 'error';
        case 'badRequest':
            return 'error';
        case 'leftCall':
            return 'end call';
        case 'removedFromCall':
            return 'end call';
        default:
            return `${state.page}`;
    }
};
const videoBackgroundImages = [
    {
        key: 'contoso',
        url: '/assets/backgrounds/contoso.png',
        tooltipText: 'Contoso Background'
    },
    {
        key: 'pastel',
        url: '/assets/backgrounds/abstract2.jpg',
        tooltipText: 'Pastel Background'
    },
    {
        key: 'rainbow',
        url: '/assets/backgrounds/abstract3.jpg',
        tooltipText: 'Rainbow Background'
    },
    {
        key: 'office',
        url: '/assets/backgrounds/room1.jpg',
        tooltipText: 'Office Background'
    },
    {
        key: 'plant',
        url: '/assets/backgrounds/room2.jpg',
        tooltipText: 'Plant Background'
    },
    {
        key: 'bedroom',
        url: '/assets/backgrounds/room3.jpg',
        tooltipText: 'Bedroom Background'
    },
    {
        key: 'livingroom',
        url: '/assets/backgrounds/room4.jpg',
        tooltipText: 'Living Room Background'
    }
];
//# sourceMappingURL=CallScreen.js.map