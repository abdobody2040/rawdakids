import React, { useEffect, useRef } from 'react';
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
  const previousActiveElement = useRef<any>(null);

  useEffect(() => {
    if (!visible) return;
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      previousActiveElement.current = document.activeElement;

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        } else if (e.key === 'Tab') {
          const dialogEl = document.getElementById('parent-gate-dialog');
          if (!dialogEl) return;
          const focusable = dialogEl.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="button"]'
          );
          if (focusable.length === 0) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey) {
            if (document.activeElement === first) {
              e.preventDefault();
              last.focus();
            }
          } else {
            if (document.activeElement === last) {
              e.preventDefault();
              first.focus();
            }
          }
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      const timer = setTimeout(() => {
        const dialogEl = document.getElementById('parent-gate-dialog');
        const first = dialogEl?.querySelector<HTMLElement>(
          'button, [role="button"], input'
        );
        first?.focus();
      }, 50);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleKeyDown);
        if (
          previousActiveElement.current &&
          typeof previousActiveElement.current.focus === 'function'
        ) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [visible, onClose]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <View
          id="parent-gate-dialog"
          nativeID="parent-gate-dialog"
          role="dialog"
          aria-modal={true}
          aria-labelledby="parent-gate-title"
          style={styles.sheetCard}
        >
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
