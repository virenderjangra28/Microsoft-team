// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React, { useState } from 'react';
import { Stack, PrimaryButton, Image, ChoiceGroup, Text, TextField } from '@fluentui/react';
import heroSVG from '../../assets/hero.svg';
import { imgStyle, infoContainerStyle, callContainerStackTokens, callOptionsGroupStyles, configContainerStyle, configContainerStackTokens, containerStyle, containerTokens, headerStyle, teamsItemStyle, buttonStyle } from '../styles/HomeScreen.styles';
import { outboundTextField } from '../styles/HomeScreen.styles';
import { ThemeSelector } from '../theming/ThemeSelector';
import { saveDisplayNameToLocalStorage } from '../utils/localStorage';
import { DisplayNameField } from './DisplayNameField';
import { getRoomIdFromUrl } from '../utils/AppUtils';
import { getIsCTE } from '../utils/AppUtils';
export const HomeScreen = (localData, props) => {
    var _a;
    const imageProps = { src: heroSVG.toString() };
    const headerTitle = props.joiningExistingCall ? 'Join Call' : 'Start or join a call';
    const callOptionsGroupLabel = localData.localData['presenter'] == '1' ? 'Select a call option' : 'Join Call';
    const buttonText = 'Next';
    const callOptions = localData.localData['presenter'] == '1' ? [{ key: 'StartRooms', text: 'Start a Rooms call' }] : [{ key: 'Rooms', text: 'Join a Rooms Call' }];
    const roomIdLabel = 'Room ID';
    const teamsTokenLabel = 'Enter a Teams token';
    const teamsIdLabel = 'Enter a Teams Id';
    const roomsRoleGroupLabel = 'Rooms Role';
    const roomRoleOptions = localData.localData['presenter'] == '1' ? [{ key: 'Presenter', text: 'Presenter' }] : [{ key: 'Attendee', text: 'Attendee' }];
    // Get display name from local storage if available
    // const defaultDisplayName = localStorageAvailable ? getDisplayNameFromLocalStorage() : null;
    const [displayName, setDisplayName] = useState((_a = localData.localData['name']) !== null && _a !== void 0 ? _a : undefined);
    const [chosenCallOption, setChosenCallOption] = useState(callOptions[0]);
    const [callLocator, setCallLocator] = useState();
    const [meetingId, setMeetingId] = useState();
    const [passcode, setPasscode] = useState();
    const [chosenRoomsRoleOption, setRoomsRoleOption] = useState(roomRoleOptions[1]);
    const [teamsToken, setTeamsToken] = useState();
    const [teamsId, setTeamsId] = useState();
    const [outboundTeamsUsers, setOutboundTeamsUsers] = useState();
    const startGroupCall = chosenCallOption.key === 'ACSCall';
    const teamsCallChosen = chosenCallOption.key === 'TeamsMeeting';
    const teamsIdentityChosen = chosenCallOption.key === 'TeamsIdentity';
    const teamsAdhocChosen = chosenCallOption.key === 'TeamsAdhoc';
    const defaultKey = localData.localData['presenter'] == '1' ? 'StartRooms' : 'Rooms';
    const buttonEnabled = (displayName || teamsToken) &&
        (startGroupCall ||
            (teamsCallChosen && callLocator) ||
            (((chosenCallOption.key === 'Rooms' && callLocator) || chosenCallOption.key === 'StartRooms') &&
                chosenRoomsRoleOption) ||
            (teamsAdhocChosen && outboundTeamsUsers) ||
            (teamsIdentityChosen && callLocator && teamsToken && teamsId));
    const showDisplayNameField = !teamsIdentityChosen;
    const [teamsIdFormatError, setTeamsIdFormatError] = useState(false);
    return (React.createElement(Stack, { horizontal: true, wrap: true, horizontalAlign: "center", verticalAlign: "center", tokens: containerTokens, className: containerStyle },
        React.createElement(Image, Object.assign({ alt: "Welcome to the ACS Calling sample app", className: imgStyle }, imageProps)),
        React.createElement(Stack, { className: infoContainerStyle },
            React.createElement(Text, { role: 'heading', "aria-level": 1, className: headerStyle }, headerTitle),
            React.createElement(Stack, { className: configContainerStyle, tokens: configContainerStackTokens },
                React.createElement(Stack, { tokens: callContainerStackTokens },
                    !props.joiningExistingCall && (React.createElement(ChoiceGroup, { styles: callOptionsGroupStyles, label: callOptionsGroupLabel, defaultSelectedKey: defaultKey, options: callOptions, required: true, onChange: (_, option) => {
                            option && setChosenCallOption(option);
                            setTeamsIdFormatError(false);
                        } })),
                    (teamsCallChosen || teamsIdentityChosen) && (React.createElement(TextField, { className: teamsItemStyle, iconProps: { iconName: 'Link' }, label: 'Meeting Link', required: true, placeholder: 'Enter a Teams meeting link', onChange: (_, newValue) => {
                            newValue ? setCallLocator({ meetingLink: newValue }) : setCallLocator(undefined);
                        } })),
                    (teamsCallChosen || teamsIdentityChosen) && (React.createElement(Text, { className: teamsItemStyle, block: true, variant: "medium" },
                        React.createElement("b", null, "Or"))),
                    (teamsCallChosen || teamsIdentityChosen) && (React.createElement(TextField, { className: teamsItemStyle, iconProps: { iconName: 'MeetingId' }, label: 'Meeting Id', required: true, placeholder: 'Enter a meeting id', onChange: (_, newValue) => {
                            setMeetingId(newValue);
                            newValue ? setCallLocator({ meetingId: newValue, passcode: passcode }) : setCallLocator(undefined);
                        } })),
                    (teamsCallChosen || teamsIdentityChosen) && (React.createElement(TextField, { className: teamsItemStyle, iconProps: { iconName: 'passcode' }, label: 'Passcode', placeholder: 'Enter a meeting passcode', onChange: (_, newValue) => {
                            // meeting id is required, but passcode is not
                            setPasscode(newValue);
                            meetingId ? setCallLocator({ meetingId: meetingId, passcode: newValue }) : setCallLocator(undefined);
                        } })),
                    teamsCallChosen && (React.createElement(Text, { className: teamsItemStyle, block: true, variant: "medium" },
                        React.createElement("b", null, "And"))),
                    (chosenCallOption.key === 'TeamsIdentity' || getIsCTE()) && (React.createElement(Stack, null,
                        React.createElement(TextField, { className: teamsItemStyle, label: teamsTokenLabel, required: true, placeholder: 'Enter a Teams Token', onChange: (_, newValue) => setTeamsToken(newValue) }))),
                    (chosenCallOption.key === 'TeamsIdentity' || getIsCTE()) && (React.createElement(Stack, null,
                        React.createElement(TextField, { className: teamsItemStyle, label: teamsIdLabel, required: true, placeholder: 'Enter a Teams user ID (8:orgid:<UUID>)', errorMessage: teamsIdFormatError ? `Teams user ID should be in the format '8:orgid:<UUID>'` : undefined, onChange: (_, newValue) => {
                                if (!newValue) {
                                    setTeamsIdFormatError(false);
                                    setTeamsId(undefined);
                                }
                                else if (newValue.match(/8:orgid:[a-zA-Z0-9-]+/)) {
                                    setTeamsIdFormatError(false);
                                    setTeamsId(newValue);
                                }
                                else {
                                    setTeamsIdFormatError(true);
                                    setTeamsId(undefined);
                                }
                            } }))),
                    chosenCallOption.key === 'Rooms' && (React.createElement(Stack, null,
                        React.createElement(TextField, { className: teamsItemStyle, label: roomIdLabel, required: true, placeholder: 'Enter a room ID', onChange: (_, newValue) => setCallLocator(newValue ? { roomId: newValue } : undefined) }))),
                    (chosenCallOption.key === 'Rooms' || chosenCallOption.key === 'StartRooms' || getRoomIdFromUrl()) && (React.createElement(ChoiceGroup, { styles: callOptionsGroupStyles, label: roomsRoleGroupLabel, defaultSelectedKey: "Presenter", options: roomRoleOptions, required: true, onChange: (_, option) => option && setRoomsRoleOption(option) })),
                    teamsAdhocChosen && (React.createElement(Stack, null,
                        React.createElement(TextField, { className: outboundTextField, label: 'Teams user ID', required: true, placeholder: 'Enter a Teams user ID (8:orgid:<UUID>)', errorMessage: teamsIdFormatError ? `Teams user ID should be in the format '8:orgid:<UUID>'` : undefined, onChange: (_, newValue) => {
                                if (!newValue) {
                                    setTeamsIdFormatError(false);
                                    setOutboundTeamsUsers(undefined);
                                }
                                else if (newValue.match(/8:orgid:[a-zA-Z0-9-]+/)) {
                                    setTeamsIdFormatError(false);
                                    setOutboundTeamsUsers(newValue);
                                }
                                else {
                                    setTeamsIdFormatError(true);
                                    setOutboundTeamsUsers(undefined);
                                }
                            } })))),
                showDisplayNameField && React.createElement(DisplayNameField, { defaultName: displayName, setName: setDisplayName }),
                React.createElement(PrimaryButton, { className: buttonStyle, text: buttonText, onClick: () => {
                        if (displayName || teamsIdentityChosen) {
                            displayName && saveDisplayNameToLocalStorage(displayName);
                            const teamsParticipantsToCall = parseParticipants(outboundTeamsUsers);
                            props.startCallHandler({
                                //TODO: This needs to be updated after we change arg types of TeamsCall
                                displayName: !displayName ? 'Teams UserName PlaceHolder' : displayName,
                                callLocator: callLocator,
                                option: chosenCallOption.key,
                                role: chosenRoomsRoleOption.key,
                                teamsToken,
                                teamsId,
                                outboundTeamsUsers: teamsParticipantsToCall
                            });
                        }
                    } }),
                React.createElement("div", null,
                    React.createElement(ThemeSelector, { label: "Theme", horizontal: true }))))));
};
/**
 * splits the participant Id's so we can call multiple people.
 */
const parseParticipants = (participantsString) => {
    if (participantsString) {
        return participantsString.replaceAll(' ', '').split(',');
    }
    else {
        return undefined;
    }
};
//# sourceMappingURL=HomeScreen.js.map