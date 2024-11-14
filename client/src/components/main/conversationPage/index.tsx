import React from 'react';
import './index.css';
import useConversationPage from '../../../hooks/useConversationPage';
import ChatSection from '../chatSection';
import { getMetaData } from '../../../tool';

/**
 * ConversationSection renders a page displaying a list of the current user's conversations
 */
const ConversationPage = () => {
  const {
    user,
    clist,
    selectedConversation,
    participants,
    setParticipants,
    textErr,
    navigateChat,
    handleCreateConversation,
  } = useConversationPage();

  return (
    <div className='conversation-page'>
      {selectedConversation && (
        <div className='chat-section'>
          <ChatSection conversationId={selectedConversation} />
        </div>
      )}

      <div className='rightSideBar'>
        <h2>Conversations</h2>
        <div className='new-conversation'>
          <input
            type='text'
            placeholder='Enter usernames separated by commas'
            value={participants}
            onChange={e => setParticipants(e.target.value)}
            className='conversation-input'
          />
          <button onClick={handleCreateConversation} className='create-conversation-button'>
            Create Conversation
          </button>
        </div>

        {textErr && <div className='error'>{textErr}</div>}

        {clist?.map((c, idx) => (
          <li key={idx} className='conversation-list'>
            <div
              className='conversation'
              onClick={() => {
                navigateChat(c);
              }}>
              <div className='convo-participants'>
                {c.participants
                  .map(participant => participant.username)
                  .filter(username => username !== user.username)
                  .join(', ')}
              </div>
              <div className='convo-meta'>
                {c.lastMessage} {getMetaData(new Date(c.updatedAt))}
              </div>
            </div>
          </li>
        ))}
      </div>
    </div>
  );
};

export default ConversationPage;
