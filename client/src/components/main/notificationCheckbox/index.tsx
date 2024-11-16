import React, { useState } from 'react';
import useUserContext from '../../../hooks/useUserContext';
import { addUserToNotifyList, removeUserToNotifiyList as removeUserToNotifyList } from '../../../services/questionService';

interface NotificationCheckboxProps {
  qid: string;
  notifyList: string[];
}

const NotificationCheckbox: React.FC<NotificationCheckboxProps> = ({ qid, notifyList }) => {
  const { user } = useUserContext();
  const [checked, setChecked] = useState(notifyList.includes(user._id));

  const handleChange = () => {
    setChecked(!checked);
    if (qid) {
      if (checked) {
        removeUserToNotifyList(qid, user._id);
      } else {
        addUserToNotifyList(qid, user._id);
      }
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
