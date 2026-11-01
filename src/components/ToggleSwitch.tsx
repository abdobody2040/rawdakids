// src/components/ToggleSwitch.tsx
// High-visibility, accessible, RTL-safe toggle switch component for Noor Kids
// Solves React Native Web RTL transform & shrinking bugs on mobile/web browsers.

import React, { useEffect, useRef } from 'react';
import {
  Pressable,
  Animated,
  StyleSheet,
  Platform,
  ViewStyle,
} from 'react-native';

export interface ToggleSwitchProps {
  value: boolean;
  onValueChange: (newValue: boolean) => void;
  disabled?: boolean;
  activeTrackColor?: string;
  inactiveTrackColor?: string;
  activeThumbColor?: string;
  inactiveThumbColor?: string;
  trackWidth?: number;
  trackHeight?: number;
  accessibilityLabel?: string;
  style?: ViewStyle;
  testID?: string;
}

export default function ToggleSwitch({
  value,
  onValueChange,
  disabled = false,
  activeTrackColor = '#10B981',
  inactiveTrackColor = '#CBD5E1',
  activeThumbColor = '#FFFFFF',
  inactiveThumbColor = '#FFFFFF',
  trackWidth = 50,
  trackHeight = 28,
  accessibilityLabel,
  style,
  testID,
}: ToggleSwitchProps) {
  const padding = 3;
  const thumbSize = trackHeight - padding * 2;
  const travelDistance = trackWidth - thumbSize - padding * 2;

  const animValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value ? 1 : 0,
      duration: 180,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [value, animValue]);

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, travelDistance],
  });

  const handlePress = () => {
    if (!disabled && onValueChange) {
      onValueChange(!value);
    }
  };

  return (
    <Pressable
      testID={testID}
      onPress={handlePress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={[styles.hitTarget, style, disabled && styles.disabled]}
    >
      <Animated.View
        style={[
          styles.track,
          {
            width: trackWidth,
            height: trackHeight,
            borderRadius: trackHeight / 2,
            backgroundColor: value ? activeTrackColor : inactiveTrackColor,
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              top: padding,
              left: padding,
              backgroundColor: value ? activeThumbColor : inactiveThumbColor,
              transform: [{ translateX }],
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  hitTarget: {
    minWidth: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer' as any,
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed' as any,
  },
  track: {
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
    // Soft shadow for depth
    ...Platform.select({
      web: {
        boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.12)',
        transition: 'background-color 0.2s ease',
      },
      default: {
        elevation: 1,
      },
    }),
  },
  thumb: {
    position: 'absolute',
    ...Platform.select({
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        transition: 'transform 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.22,
        shadowRadius: 2.5,
        elevation: 3,
      },
    }),
  },
});
