// ConfirmModal.js
import React from 'react';
import { Modal, View, Text, Button, TouchableOpacity } from 'react-native';

interface ConfirmModalProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal = ({
  visible,
  message,
  onConfirm,
  onCancel,
  confirmText = 'OK',
  cancelText = 'Cancel',
}: ConfirmModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View className="w-72 p-5 bg-white rounded-xl shadow-lg">
          <Text className="text-base font-quicksand mb-5 text-center">{message}</Text>
          <View className="flex flex-row justify-between">
            <TouchableOpacity onPress={onConfirm} >
              <Text className="h2 text-[#f6c445]">{confirmText}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onCancel} >
              <Text className="h2 text-[#9AC1F0]">{cancelText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;

