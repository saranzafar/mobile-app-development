import { FlatList, Pressable, View } from 'react-native';
import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackPramList } from '../App';
import ProductItem from '../components/ProductItem';
import Seprator from '../components/Seprator';
import { PRODUCT_LIST } from '../data/constant';

type HomeProps = NativeStackScreenProps<RootStackPramList, 'Home'>;

const Home = ({ navigation }: HomeProps) => {
    return (
        <View className="flex-1 bg-gray-50">
            <FlatList
                data={PRODUCT_LIST}
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={Seprator}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => navigation.navigate('Details', { product: item })}
                        className="bg-white p-4 mx-4 my-2 rounded-lg shadow-sm"
                    >
                        <ProductItem product={item} />
                    </Pressable>
                )}
                className="flex-grow"
            />
        </View>
    );
};

export default Home;
