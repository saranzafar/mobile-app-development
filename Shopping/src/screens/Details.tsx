import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
// Navigation
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackPramList } from '../App';

type DetailsProps = NativeStackScreenProps<RootStackPramList, 'Details'>

const Details = ({ route }: DetailsProps) => {
    const { product } = route.params;

    return (
        <ScrollView>
            <View>
                <Image
                    source={{ uri: product.imageUrl }}
                />
            </View>
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
                {product.tags.map((tag, index) => (
                    <View key={index}>
                        <Text>{tag}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default Details;

const styles = StyleSheet.create({});
