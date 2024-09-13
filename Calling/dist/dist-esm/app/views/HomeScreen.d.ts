/// <reference types="react" />
import { RoomLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { TeamsMeetingIdLocator } from '@azure/communication-calling';
import { CallAdapterLocator } from '@azure/communication-react';
export declare type CallOption = 'ACSCall' | 'TeamsMeeting' | 'Rooms' | 'StartRooms' | 'TeamsIdentity' | 'TeamsAdhoc';
export interface HomeScreenProps {
    startCallHandler(callDetails: {
        displayName: string;
        callLocator?: CallAdapterLocator | TeamsMeetingLinkLocator | RoomLocator | TeamsMeetingIdLocator;
        option?: CallOption;
        role?: string;
        teamsToken?: string;
        teamsId?: string;
        outboundTeamsUsers?: string[];
    }): void;
    joiningExistingCall: boolean;
}
export declare const HomeScreen: (localData: any, props: HomeScreenProps) => JSX.Element;
//# sourceMappingURL=HomeScreen.d.ts.map