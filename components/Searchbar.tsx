import React from "react";
import { Image, TextInput, View, Pressable } from "react-native";
import { icons } from "@/constants/icons";

interface Props {
    placeholder: string;
    onPress?: () => void;
    value?: string;
    onChangeText?: (text: string) => void;
}

const Searchbar = ({ placeholder, onPress, value, onChangeText }: Props) => {
    return (
        <View className="flex-row items-center bg-dark-300 rounded-full px-4 py-3 shadow-md">
            {/* Search Icon */}
            <Image
                source={icons.search}
                className="w-5 h-5 opacity-70"
                resizeMode="contain"
                tintColor="#ab8bff"
            />

            {/* Search Input */}
            <TextInput
                onPress={onPress}
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                placeholderTextColor="#a8b5db"
                className="flex-1 ml-3 text-white text-base"
            />

            {/* Clear Button */}
            {(value?.length ?? 0) > 0 && (
                <Pressable onPress={() => onChangeText("")}>
                    <Image source={icons.close} className="w-5 h-5 opacity-60" tintColor="gray" />
                </Pressable>
            )}
        </View>
    );
};

export default Searchbar;