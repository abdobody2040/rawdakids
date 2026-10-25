// src/components/ParentGateModal.tsx
// Modal wrapper for ParentGateView matching Mockup Page 5

import React from 'react';
import { Modal, View, StyleSheet, Platform } from 'react-native';
import ParentGateView from './ParentGateView';

interface ParentGateModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ParentGateModal({
  visible,
  onClose,
  onSuccess,
}: ParentGateModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.sheetCard}>
          <ParentGateView
            onSuccess={onSuccess}
            onClose={onClose}
            showCloseButton={true}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  sheetCard: {
    width: '100%',
    maxWidth: 400,
    height: 640,
    backgroundColor: '#FFFDF9',
    borderRadius: 32,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
      default: { elevation: 8 },
    }),
  },
});
