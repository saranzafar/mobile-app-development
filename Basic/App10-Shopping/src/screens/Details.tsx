import { Image, ScrollView, Text, View } from 'react-native';
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackPramList } from '../App';
import Icon from 'react-native-vector-icons/FontAwesome';

type DetailsProps = NativeStackScreenProps<RootStackPramList, 'Details'>;

const Details = ({ route }: DetailsProps) => {
    const { product } = route.params;

    return (
        <ScrollView className="flex-1 bg-gray-50">
            <View className="p-4">
                <Image
                    source={{ uri: product.imageUrl }}
                    className="w-full h-64 rounded-lg mb-4"
                    resizeMode="cover"
                />
                <View className="bg-white p-4 rounded-lg shadow-sm">
                    <Text className="text-2xl font-bold text-gray-800 mb-2">{product.name}</Text>
                    <View className="flex-row items-center mb-2">
                        <Icon name="star" size={20} color="#FFD700" />
                        <Text className="text-lg text-gray-600 ml-1">{product.rating}</Text>
                    </View>
                    <View className="flex-row mb-4">
                        <Text className="text-xl text-gray-500 line-through mr-2">
                            ${product.originalPrice.toFixed(2)}
                        </Text>
                        <Text className="text-xl text-green-600 font-semibold">
                            ${product.discountPrice.toFixed(2)}
                        </Text>
                    </View>
                    <View className="flex-row flex-wrap">
                        {product.tags.map((tag, index) => (
                            <View key={index} className="bg-blue-100 px-3 py-1 rounded-full mr-2 mb-2">
                                <Text className="text-blue-800 text-sm">{tag}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default Details;
