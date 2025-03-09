import { Image, Text, View } from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

interface ProductItemProps {
    product: Product;
}

const ProductItem = ({ product }: ProductItemProps) => {

    return (
        <View className="flex-row items-center">
            <Image
                source={{ uri: product.imageUrl }}
                className="rounded-md mr-4 w-20 h-20"
                resizeMode="cover"
            />
            <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-800">{product.name}</Text>
                <View className="flex-row items-center">
                    <Icon name="star" size={16} color="#FFD700" />
                    <Text className="text-sm text-gray-600 ml-1">{product.rating}</Text>
                </View>
                <Text className="text-md text-green-600 font-medium">
                    ${product.discountPrice.toFixed(2)}
                </Text>
            </View>
        </View>
    );
};

export default ProductItem;
