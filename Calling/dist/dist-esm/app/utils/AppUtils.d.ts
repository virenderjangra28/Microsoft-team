import { GroupLocator, TeamsMeetingLinkLocator } from '@azure/communication-calling';
import { ParticipantRole, RoomCallLocator } from '@azure/communication-calling';
import { TeamsMeetingIdLocator } from '@azure/communication-calling';
/**
 * Get ACS user token from the Contoso server.
 */
export declare const fetchTokenResponse: () => Promise<any>;
/**
 * Generate a random user name.
 * @return username in the format user####
 */
export declare const createRandomDisplayName: () => string;
/**
 * Get group id from the url's query params.
 */
export declare const getGroupIdFromUrl: () => GroupLocator | undefined;
export declare const createGroupId: () => GroupLocator;
/**
 * Create an ACS room
 */
export declare const createRoom: () => Promise<string>;
/**
 * Add user to an ACS room with a given roomId and role
 */
export declare const addUserToRoom: (userId: string, roomId: string, role: ParticipantRole) => Promise<void>;
/**
 * Get teams meeting link from the url's query params.
 */
export declare const getTeamsLinkFromUrl: () => TeamsMeetingLinkLocator | undefined;
/**
 * Get teams meeting id and passcode from the url's query params.
 */
export declare const getMeetingIdFromUrl: () => TeamsMeetingIdLocator | undefined;
/**
 * Get teams meeting link from the url's query params.
 */
export declare const getIsCTE: () => boolean | undefined;
/**
 * Get room id from the url's query params.
 */
export declare const getRoomIdFromUrl: () => RoomCallLocator | undefined;
export declare const isOnIphoneAndNotSafari: () => boolean;
export declare const isLandscape: () => boolean;
export declare const navigateToHomePage: () => void;
export declare const WEB_APP_TITLE: string;
//# sourceMappingURL=AppUtils.d.ts.map