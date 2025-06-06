import React, { useEffect, useState } from 'react';
import { Space, Switch, Typography } from 'antd';
import useUserContext from '../../../hooks/useUserContext';
import {
  addUserToNotifyListQuestion,
  removeUserToNotifyListQuestion,
} from '../../../services/questionService';
import {
  removeUserToNotifyListConversation,
  addUserToNotifyListConversation,
} from '../../../services/conversationService';

const { Text } = Typography;

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
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(notifyList.includes(user._id));
  }, [notifyList, user._id]);

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
    <Space direction='horizontal' align='center'>
      <Text>Get Notifications:</Text>
      <Switch
        checked={checked}
        onChange={handleChange}
        checkedChildren='On'
        unCheckedChildren='Off'
      />
    </Space>
  );
};

export default NotificationCheckbox;
