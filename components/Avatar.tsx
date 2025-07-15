import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {avatarColors} from '@/constants';

interface AvatarProps {
  name: string; 
}

const Avatar = ({ name }: AvatarProps) => {
  const initials = name.split(" ").map((word:string) => word[0]).join("").toUpperCase().slice(0, 2);
  const randomColor = useMemo(() => {
    const i = Math.floor(Math.random() * avatarColors.length);
    return avatarColors[i];
  }, [])

  return (
    <View
      className="w-10 h-10 rounded-full items-center justify-center"
      style={{ backgroundColor: randomColor }}>
      <Text className="h3 font-bold text-white">{initials}</Text>
    </View>
  )
}

const styles = StyleSheet.create({})

export default Avatar;
