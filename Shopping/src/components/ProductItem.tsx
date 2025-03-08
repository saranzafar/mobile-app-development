import { Image, StyleSheet, Text, View } from 'react-native';
import React, { PropsWithChildren } from 'react';

type ProductProps = PropsWithChildren<{
    product: Product
}>

const ProductItem = ({ product }: ProductProps) => {
    return (
        <View>
            <Image
                source={{ uri: product.imageUrl }}
            />
            <View>
                <Text>{product.name}</Text>
                <View>
                    <Text>{product.rating}*</Text>
                </View>

                <View>
                    <Text>{product.originalPrice.toLocaleString()}</Text>
                    <Text>{product.discountPrice.toLocaleString()}</Text>
                </View>
            </View>
        </View>
    );
};

export default ProductItem;

const styles = StyleSheet.create({});
