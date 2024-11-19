import { Socket } from 'socket.io-client';

export type FakeSOSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

/**
 * Enum representing the possible ordering options for questions.
 * and their display names.
 */
export const orderTypeDisplayName = {
  newest: 'Newest',
  unanswered: 'Unanswered',
  active: 'Active',
  mostViewed: 'Most Viewed',
} as const;

/**
 * Type representing the keys of the orderTypeDisplayName object.
 * This type can be used to restrict values to the defined order types.
 */
export type OrderType = keyof typeof orderTypeDisplayName;

/**
 * Interface represents a comment.
 *
 * text - The text of the comment.
 * commentBy - Username of the author of the comment.
 * commentDateTime - Time at which the comment was created.
 */
export interface Comment {
  text: string;
  commentBy: string;
  commentDateTime: Date;
}

/**
 * Interface representing a tag associated with a question.
 *
 * @property name - The name of the tag.
 * @property description - A description of the tag.
 */
export interface Tag {
  _id?: string;
  name: string;
  description: string;
}

/**
 * Interface represents the data for a tag.
 *
 * name - The name of the tag.
 * qcnt - The number of questions associated with the tag.
 */
export interface TagData {
  name: string;
  qcnt: number;
}

/**
 * Interface representing the voting data for a question, which contains:
 * - qid - The ID of the question being voted on
 * - upVotes - An array of user IDs who upvoted the question
 * - downVotes - An array of user IDs who downvoted the question
 */
export interface VoteData {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing the follower data for a user, which contains:
 * - uid - The ID of the user being followed
 * - followrs - An array of user IDs who followed the user
 */
export interface FollowData {
  uid: string;
  followers: User[];
}

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Comments associated with the answer.
 */
export interface Answer {
  _id?: string;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[];
}

/**
 * Interface representing the structure of a Question object.
 *
 * - _id - The unique identifier for the question.
 * - tags - An array of tags associated with the question, each containing a name and description.
 * - answers - An array of answers to the question
 * - title - The title of the question.
 * - views - An array of usernames who viewed the question.
 * - text - The content of the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - The date and time when the question was asked.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 * - comments - Comments associated with the question.
 * - notifyList - An array of user IDs to notify when the question is updated.
 */
export interface Question {
  _id?: string;
  tags: Tag[];
  answers: Answer[];
  title: string;
  views: string[];
  text: string;
  askedBy: string;
  askDateTime: Date;
  upVotes: string[];
  downVotes: string[];
  comments: Comment[];
  notifyList: string[];
}

/**
 * Interface representing the payload for a vote update socket event.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

export interface AnswerUpdatePayload {
  qid: string;
  answer: Answer;
}

export interface CommentUpdatePayload {
  result: Question | Answer;
  type: 'question' | 'answer';
}

export interface NotificationUpdatePayload {
  uid: string;
  notification: Notification;
}

export interface FollowUpdatePayload {
  uid: string;
  followers: User[];
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: Question) => void;
  answerUpdate: (update: AnswerUpdatePayload) => void;
  viewsUpdate: (question: Question) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (update: CommentUpdatePayload) => void;
  joinRoom: (conversationId: string) => void;
  leaveRoom: (conversationId: string) => void;
  newMessage: (message: Message) => void;
  conversationUpdate: (conversation: Conversation) => void;
  notificationUpdate: (notification: NotificationUpdatePayload) => void;
  followUpdate: (user: FollowUpdatePayload) => void;
}

export interface ClientToServerEvents {
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
}

/**
 * Represents a user in the application.
 */
export interface User {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  bio: string;
  picture: string;
  comments: Comment[];
  questions: Question[];
  answers: Answer[];
  followers: User[];
  following: User[];
  notifications: Notification[];
  verified: boolean;
}

export interface EditableUserFields {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  picture: string;
}

/**
 * Interface representing a notification object.
 * - _id - The unique identifier for the notification.
 * - type - The type of notification.
 * - text - The content of the notification.
 * - targetId - The ID of the associated object for the notification (e.g., Question or Conversation).
 * - dateTime - The date and time when the notification was created.
 */
export interface Notification {
  _id?: string;
  type: string;
  text: string;
  targetId: string;
  dateTime: Date;
}

/**
 * Interface representing a message document, which contains:
 * - _id - The unique identifier for the message. Optional field.
 * - conversationId - The unique identifier for the conversation the message belongs to.
 * - sender - The user who sent the message.
 * - text - The content of the message.
 * - sentAt - The date and time when the message was sent.
 */
export interface Message {
  _id?: string;
  conversationId: string;
  sender: User;
  text: string;
  sentAt: Date;
}

/**
 * Interface representing the structure of a Conversation object:
 *
 * - _id - The unique identifier for the conversation. Optional field.
 * - participants - An array of usernames of the users participating in the conversation.
 * - lastMessage - The most recent message sent for the conversation.
 * - updatedAt - The date and time when the conversation was last updated.
 * - notifyList - An array of user IDs to notify when a new message is sent.
 */
export interface Conversation {
  _id?: string;
  participants: User[];
  lastMessage: string;
  updatedAt: Date;
  notifyList: string[];
}

/**
 * Interface representing the payload for a new conversation request
 *
 * participants - An array of usernames of the users participating in the conversation.
 */
export interface NewConversationPayload {
  participants: string[];
}

export type ProfileTabs = 'profile' | 'followers' | 'following';
