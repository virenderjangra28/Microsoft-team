// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { CallComposite } from '@azure/communication-react';
import { Spinner } from '@fluentui/react';
import React, { useEffect, useMemo } from 'react';
import { useSwitchableFluentTheme } from '../theming/SwitchableFluentThemeProvider';
import { useIsMobile } from '../utils/useIsMobile';
import { isIOS } from '../utils/utils';
export const CallCompositeContainer = (props) => {
    const { adapter } = props;
    const { currentTheme, currentRtl } = useSwitchableFluentTheme();
    const isMobileSession = useIsMobile();
    const shouldHideScreenShare = isMobileSession || isIOS();
    useEffect(() => {
        /**
         * We want to make sure that the page is up to date. If for example a browser is dismissed
         * on mobile, the page will be stale when opened again. This event listener will reload the page
         */
        window.addEventListener('pageshow', (event) => {
            if (event.persisted) {
                window.location.reload();
            }
        });
        return () => {
            window.removeEventListener('pageshow', () => {
                window.location.reload();
            });
        };
    }, []);
    const options = useMemo(() => ({
        callControls: {
            screenShareButton: shouldHideScreenShare ? false : undefined,
            endCallButton: {
                hangUpForEveryone: 'endCallOptions'
            }
        },
        autoShowDtmfDialer: true
    }), [shouldHideScreenShare]);
    // Dispose of the adapter in the window's before unload event.
    // This ensures the service knows the user intentionally left the call if the user
    // closed the browser tab during an active call.
    useEffect(() => {
        const disposeAdapter = () => adapter === null || adapter === void 0 ? void 0 : adapter.dispose();
        window.addEventListener('beforeunload', disposeAdapter);
        return () => window.removeEventListener('beforeunload', disposeAdapter);
    }, [adapter]);
    if (!adapter) {
        return React.createElement(Spinner, { label: 'Creating adapter', ariaLive: "assertive", labelPosition: "top" });
    }
    let callInvitationUrl = window.location.href;
    // Only show the call invitation url if the call is a group call or Teams call, do not show for Rooms, 1:1 or 1:N calls
    if (props.callLocator && !isGroupCallLocator(props.callLocator) && !isTeamsMeetingLinkLocator(props.callLocator)) {
        callInvitationUrl = undefined;
    }
    return (React.createElement(CallComposite, { adapter: adapter, fluentTheme: currentTheme.theme, rtl: currentRtl, callInvitationUrl: callInvitationUrl, formFactor: isMobileSession ? 'mobile' : 'desktop', options: options }));
};
const isTeamsMeetingLinkLocator = (locator) => {
    return 'meetingLink' in locator;
};
const isGroupCallLocator = (locator) => {
    return 'groupId' in locator;
};
//# sourceMappingURL=CallCompositeContainer.js.map