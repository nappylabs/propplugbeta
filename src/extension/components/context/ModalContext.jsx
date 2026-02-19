import React, { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [featureName, setFeatureName] = useState('');

  const openWaitlistModal = (feature) => {
    setFeatureName(feature);
    setIsWaitlistModalOpen(true);
  };

  const closeWaitlistModal = () => {
    setIsWaitlistModalOpen(false);
    setFeatureName('');
  };

  const value = {
    isWaitlistModalOpen,
    featureName,
    openWaitlistModal,
    closeWaitlistModal,
  };

  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
};