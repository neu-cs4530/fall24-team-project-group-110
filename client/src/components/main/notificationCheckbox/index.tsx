import React, { useState } from 'react';
import useUserContext from '../../../hooks/useUserContext';
import {
  addUserToNotifyListQuestion,
  removeUserToNotifyListQuestion,
} from '../../../services/questionService';
import {
  removeUserToNotifyListConversation,
  addUserToNotifyListConversation,
} from '../../../services/conversationService';

interface NotificationCheckboxProps {
  targetId: string;
  notifyList: string[];
  type: 'question' | 'conversation';
}

const NotificationCheckbox: React.FC<NotificationCheckboxProps> = ({
  targetId,
  notifyList,
  type,
}) => {
  const { user } = useUserContext();
  const [checked, setChecked] = useState(notifyList.includes(user._id));

  const handleChange = () => {
    setChecked(!checked);
    switch (type) {
      case 'question':
        if (targetId) {
          if (checked) {
            removeUserToNotifyListQuestion(targetId, user._id);
          } else {
            addUserToNotifyListQuestion(targetId, user._id);
          }
        }
        break;
      case 'conversation':
        if (targetId) {
          if (checked) {
            removeUserToNotifyListConversation(targetId, user._id);
          } else {
            addUserToNotifyListConversation(targetId, user._id);
          }
        }
        break;
      default:
    }
  };

  return (
    <div>
      <label htmlFor='notificationCheckbox'>Get Notifications</label>
      <input type='checkbox' checked={checked} onChange={handleChange} id='notificationCheckbox' />
    </div>
  );
};

export default NotificationCheckbox;
