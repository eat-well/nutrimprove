import React, { useState } from 'react';
import PropTypes from 'prop-types';
import MainButton from '../MainButton';
import LoadingSpinner from '../LoadingSpinner';
import { deleteUser } from '../../interfaces/api/users';
import { isAdmin } from '../../helpers/userUtils';

const DeleteUserButton = ({ user, action, className }) => {
  const [confirm, setConfirm] = useState(false);
  const [disabled, setDisabled] = useState(isAdmin(user)); // Admin users not deletable

  const confirmButtonActions = async () => {
    setDisabled(true);
    await deleteUser(user.email);
    action(user.email);
  };

  const setTempConfirmation = () => {
    setConfirm(true);
    setTimeout(() => {
      setConfirm(false);
    }, 3000);
  };

  const defaultButton = () => (
    <MainButton action={setTempConfirmation} disabled={disabled} className={className}>
      Delete User
    </MainButton>
  );

  const confirmButton = () => (
    <MainButton
      action={confirmButtonActions}
      colour={'secondary'}
      disabled={disabled}
      className={className}
    >
      Confirm Deletion
      <LoadingSpinner context={`deleteUser-${user.email}`} />
    </MainButton>
  );

  return confirm ? confirmButton() : defaultButton();
};

DeleteUserButton.propTypes = {
  user: PropTypes.object.isRequired,
  action: PropTypes.object,
};

export default DeleteUserButton;