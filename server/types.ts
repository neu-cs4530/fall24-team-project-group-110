import { Request } from 'express';
import { ObjectId } from 'mongodb';
import { Server } from 'socket.io';

export type FakeSOSocket = Server<ClientToServerEvents, ServerToClientEvents>;

/**
 * Type representing the possible ordering options for questions.
 */
export type OrderType = 'newest' | 'unanswered' | 'active' | 'mostViewed';

/**
 * Interface representing an Answer document, which contains:
 * - _id - The unique identifier for the answer. Optional field
 * - text - The content of the answer
 * - ansBy - The username of the user who wrote the answer
 * - ansDateTime - The date and time when the answer was created
 * - comments - Object IDs of comments that have been added to the answer by users, or comments themselves if populated
 */
export interface Answer {
  _id?: ObjectId;
  text: string;
  ansBy: string;
  ansDateTime: Date;
  comments: Comment[] | ObjectId[];
}

/**
 * Interface extending the request body when adding an answer to a question, which contains:
 * - qid - The unique identifier of the question being answered
 * - ans - The answer being added
 */
export interface AnswerRequest extends Request {
  body: {
    qid: string;
    ans: Answer;
  };
}

/**
 * Type representing the possible responses for an Answer-related operation.
 */
export type AnswerResponse = Answer | { error: string };

/**
 * Interface representing a Tag document, which contains:
 * - _id - The unique identifier for the tag. Optional field.
 * - name - Name of the tag
 */
export interface Tag {
  _id?: ObjectId;
  name: string;
  description: string;
}

/**
 * Interface representing a Question document, which contains:
 * - _id - The unique identifier for the question. Optional field.
 * - title - The title of the question.
 * - text - The detailed content of the question.
 * - tags - An array of tags associated with the question.
 * - askedBy - The username of the user who asked the question.
 * - askDateTime - he date and time when the question was asked.
 * - answers - Object IDs of answers that have been added to the question by users, or answers themselves if populated.
 * - views - An array of usernames that have viewed the question.
 * - upVotes - An array of usernames that have upvoted the question.
 * - downVotes - An array of usernames that have downvoted the question.
 * - comments - Object IDs of comments that have been added to the question by users, or comments themselves if populated.
 */
export interface Question {
  _id?: ObjectId;
  title: string;
  text: string;
  tags: Tag[];
  askedBy: string;
  askDateTime: Date;
  answers: Answer[] | ObjectId[];
  views: string[];
  upVotes: string[];
  downVotes: string[];
  comments: Comment[] | ObjectId[];
}

/**
 * Type representing the possible responses for a Question-related operation.
 */
export type QuestionResponse = Question | { error: string };

/**
 * Interface for the request query to find questions using a search string, which contains:
 * - order - The order in which to sort the questions
 * - search - The search string used to find questions
 * - askedBy - The username of the user who asked the question
 */
export interface FindQuestionRequest extends Request {
  query: {
    order: OrderType;
    search: string;
    askedBy: string;
  };
}

/**
 * Interface for the request parameters when finding a question by its ID.
 * - qid - The unique identifier of the question.
 */
export interface FindQuestionByIdRequest extends Request {
  params: {
    qid: string;
  };
  query: {
    username: string;
  };
}

/**
 * Interface for the request body when adding a new question.
 * - body - The question being added.
 */
export interface AddQuestionRequest extends Request {
  body: Question;
}

/**
 * Interface for the request body when upvoting or downvoting a question.
 * - body - The question ID and the username of the user voting.
 *  - qid - The unique identifier of the question.
 *  - username - The username of the user voting.
 */
export interface VoteRequest extends Request {
  body: {
    qid: string;
    username: string;
  };
}

/**
 * Interface representing a Comment, which contains:
 * - _id - The unique identifier for the comment. Optional field.
 * - text - The content of the comment.
 * - commentBy - The username of the user who commented.
 * - commentDateTime - The date and time when the comment was posted.
 *
 */
export interface Comment {
  _id?: ObjectId;
  text: string;
  commentBy: string;
  commentDateTime: Date;
}

/**
 * Interface representing a User document, which contains:
 * - _id - The unique identifier for the user. Optional field.
 * - username - The username of the user.
 * - firstName - The first name of the user.
 * - lastName - The last name of the user.
 * - email - The email address of the user.
 * - password - The password of the user.
 * - bio - A string description of the user.
 * - picture - A string URL of the user's profile picture.
 * - comments - An array of references to `Comment` documents associated with the user.
 * - questions - An array of references to `Question` documents associated with the user.
 * - answers - An array of references to `Answer` documents associated with the user.
 * - followers - An array of references to `User` documents that are following the user.
 * - following - An array of references to `User` documents that the user is following.
 * - notifications - An array of references to `Notification` documents associated with the user.
 */
export interface User {
  _id?: ObjectId;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  bio: string;
  picture: string;
  comments: Comment[] | ObjectId[];
  questions: Question[] | ObjectId[];
  answers: Answer[] | ObjectId[];
  followers: User[] | ObjectId[];
  following: User[] | ObjectId[];
  notifications: Notification[] | ObjectId[];
}

/**
 * Interface representing a Notification document, which contains:
 * - _id - The unique identifier for the notification. Optional field.
 * - text - The content of the notification.
 * - targetId - The id associated with the object notification is about (ex. Question or Conversation).
 * - dateTime - The date and time when the notification was created.
 */
export interface Notification {
  _id?: ObjectId;
  type: string;
  text: string;
  targetId: string;
  dateTime: Date;
}

/**
 * Interface for the request body when adding a new notification.
 * - body - The notification being added.
 */
export interface AddNotificationRequest extends Request {
  body: {
    uid: string;
    notif: Notification;
  };
}

/**
 * Interface for the request parameters when finding a notification by its ID.
 * - nid - The unique identifier of the notification.
 */
export interface FindNotificationByIdRequest extends Request {
  params: {
    nid: string;
  };
}

/**
 * Interface for the request parameters when finding a notification by its ID and the user it belongs to.
 * - nid - The unique identifier of the notification.
 * - uid - The unique identifier of the user.
 */
export interface FindNotificationByIdAndUserRequest extends Request {
  params: {
    nid: string;
    uid: string;
  };
}

/**
 * Interface for the request body when adding a new user.
 * - body - The user being added
 */
export interface AddUserRequest extends Request {
  body: User;
}

/**
 * Interface extending the request body when editing a user, which contains:
 * - uid - The unique identifier of the user being edited
 * - newUserData - The new user fields that has been edited
 */
export interface EditUserRequest extends Request {
  body: {
    uid: string,
    newUserData: Partial<User>,
  }
}

export interface GetUserRequest extends Request {
  params: {
    uid: string;
  };
}

export interface AddUserRequest extends Request {
  body: User;
}

/**
 * Interface extending the request body when adding a comment to a question or an answer, which contains:
 * - id - The unique identifier of the question or answer being commented on.
 * - type - The type of the comment, either 'question' or 'answer'.
 * - comment - The comment being added.
 */
export interface AddCommentRequest extends Request {
  body: {
    id: string;
    type: 'question' | 'answer';
    comment: Comment;
  };
}

/**
 * Type representing the possible responses for a Comment-related operation.
 */
export type CommentResponse = Comment | { error: string };

/**
 * Type representing the possible responses for a User-related operation.
 */
export type UserResponse = User | { error: string };

/**
 * Type representing the possible responses for a Tag-related operation.
 */
export type NotificationResponse = Notification | { error: string };

/**
 * Type representing the possible responses for a User-related operation involving a list of users.
 */
export type UserListResponse = User[] | { error: string };

/**
 * Interface representing the payload for a comment update event, which contains:
 * - result - The updated question or answer.
 * - type - The type of the updated item, either 'question' or 'answer'.
 */
export interface CommentUpdatePayload {
  result: AnswerResponse | QuestionResponse | null;
  type: 'question' | 'answer';
}

/**
 * Interface representing the payload for a vote update event, which contains:
 * - qid - The unique identifier of the question.
 * - upVotes - An array of usernames who upvoted the question.
 * - downVotes - An array of usernames who downvoted the question.
 */
export interface VoteUpdatePayload {
  qid: string;
  upVotes: string[];
  downVotes: string[];
}

/**
 * Interface representing the payload for an answer update event, which contains:
 * - qid - The unique identifier of the question.
 * - answer - The updated answer.
 */
export interface AnswerUpdatePayload {
  qid: string;
  answer: AnswerResponse;
}

/**
 * Interface representing the possible events that the server can emit to the client.
 */
export interface ServerToClientEvents {
  questionUpdate: (question: QuestionResponse) => void;
  answerUpdate: (result: AnswerUpdatePayload) => void;
  viewsUpdate: (question: QuestionResponse) => void;
  voteUpdate: (vote: VoteUpdatePayload) => void;
  commentUpdate: (comment: CommentUpdatePayload) => void;
  userUpdate: (user: UserResponse) => void;
  joinRoom: (conversationId: string) => void;
  leaveRoom: (conversationId: string) => void;
  newMessage: (message: MessageResponse) => void;
  conversationUpdate: (conversation: ConversationResponse) => void;
}

export interface ClientToServerEvents {
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
}

/**
 * Interface representing the payload for a login request, which contains:
 * - username - The username of the user.
 * - password - The password of the user.
 */
export interface LoginRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

/**
 * Interface extending the request body when adding a new conversation, which contains:
 * - body - The usernames of the participants of the conversation.
 */
export interface AddConversationRequest extends Request {
  body: {
    participants: string[];
  }
}

/**
 * Interface extending the request body when adding a new message, which contains:
 * - body - The message being added.
 */
export interface AddMessageRequest extends Request {
  body: Message;
}

/**
 * Interface extending the request query to find conversations on username participating in, which contains:
 * - username - The username participating in the conversations
 */
export interface FindConversationsByUsernameRequest extends Request {
  query: {
    userId: string,
  };
}

/**
 * Interface extending the request parameters when finding a conversation by its ID.
 * - qid - The unique identifier of the conversation. 
 */
export interface FindConversationByIdRequest extends Request {
  params: {
    cid: string;
  };
}

/**
 * Interface for the request parameters when finding messages for conversation by the conversion ID.
 * - qid - The unique identifier of the conversation. 
 */
export interface FindMessagesByConversationIdRequest extends Request {
  params: {
    qid: string;
  };
}

/**
 * Interface representing a message document, which contains:
 * - _id - The unique identifier for the message. Optional field.
 * - conversationId - The unique identifier for the conversation the message belongs to.
 * - sender - The username of the user who sent the message.
 * - text - The content of the message.
 * - sentAt - The date and time when the message was sent.
 */
export interface Message {
  _id?: ObjectId;
  conversationId: string;
  sender: string;
  text: string;
  sentAt: Date;
}

/**
 * Interface representing a conversation document, which contains:
 * - _id - The unique identifier for the conversation. Optional field.
 * - participants - An array of usernames of the users participating in the conversation.
 * - lastMessage - The most recent message sent for the conversation.
 * - updatedAt - The date and time when the conversation was last updated.
 */
export interface Conversation {
  _id?: ObjectId;
  participants: User[] | ObjectId[];
  lastMessage: string;
  updatedAt: Date;
}

/**
 * Type representing the possible responses for a Conversation-related operation.
 */
export type ConversationResponse = Conversation | { error: string };

/**
 * Type representing the possible responses for a Message-related operation.
 */
export type MessageResponse = Message | { error: string };
