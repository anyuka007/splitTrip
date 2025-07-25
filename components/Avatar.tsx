import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {avatarColors} from '@/constants';
import { AvatarProps } from '@/type';


const Avatar = ({ name }: AvatarProps) => {
  const initials = name.split(" ").map((word:string) => word[0]).join("").toUpperCase().slice(0, 2);
  const randomColor = useMemo(() => {
    const i = Math.floor(Math.random() * avatarColors.length);
    return avatarColors[i];
  }, []);

  return (
    <View
      className="w-10 h-10 rounded-full items-center justify-center" style={{ borderWidth: 2, borderColor: randomColor }}
      >
      <Text className="h3 font-bold" style={{ color: randomColor }}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({})

export default Avatar;
