import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import React from 'react';

// Navigation
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackPramList } from '../App';

import ProductItem from '../components/ProductItem';
import Seprator from '../components/Seprator';

// data
import { PRODUCT_LIST } from '../data/constant';

type HomeProps = NativeStackScreenProps<RootStackPramList, 'Home'>

const Home = ({ navigation }: HomeProps) => {
    return (
        <View>
            <FlatList
                data={PRODUCT_LIST}
                keyExtractor={item => item.id}
                ItemSeparatorComponent={Seprator}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => {
                            navigation.navigate('Details', { product: item });
                        }}
                    >
                        <ProductItem product={item} />
                    </Pressable>
                )}
            />
        </View>
    );
};

export default Home;

const styles = StyleSheet.create({});
