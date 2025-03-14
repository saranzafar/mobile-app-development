import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import Snackbar from 'react-native-snackbar';
import { AppwriteContext } from '../appwrite/AppwriteContext';
import { FAB } from '@rneui/themed';

type UserObj = {
    name: string;
    email: string;
}

const Home = () => {
    const { appwrite, setIsLoggedIn } = useContext(AppwriteContext);
    const [userData, setUserData] = useState<UserObj>();

    const handleLogout = () => {
        appwrite.logout()
            .then(() => {
                setIsLoggedIn(false);
                Snackbar.show({
                    text: 'Logout Successful',
                    duration: Snackbar.LENGTH_SHORT,
                });
            });
    };

    useEffect(() => {
        appwrite.getCurrentUser()
            .then((response) => {
                if (response) {
                    const user: UserObj = {
                        name: response.name,
                        email: response.email,
                    };
                    setUserData(user);
                }
            });
    }, [appwrite]);

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Image
                    source={{
                        uri: 'https://appwrite.io/images/home.png',
                        width: 300,
                        height: 100,
                    }}
                    style={styles.image}
                    resizeMode="contain"
                />

                <Text style={styles.taglineText}>
                    Build Fast. Scale Big. All in One Place.
                </Text>

                {userData && (
                    <View style={styles.userInfoContainer}>
                        <Text style={styles.userText}>Name: {userData.name}</Text>
                        <Text style={styles.userText}>Email: {userData.email}</Text>
                    </View>
                )}

                <FAB
                    placement="right"
                    color="#f02e65"
                    size="large"
                    title="Logout"
                    icon={{ name: 'logout', color: '#FFFFFF' }}
                    onPress={handleLogout}
                    style={styles.fab}
                    titleStyle={styles.fabTitle}
                />
            </View>
        </SafeAreaView>
    );
};

export default Home;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
    },
    image: {
        marginVertical: 40,
        alignSelf: 'center',
    },
    taglineText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#2D4158',
        fontWeight: '600',
        marginBottom: 40,
        paddingHorizontal: 20,
    },
    userInfoContainer: {
        backgroundColor: '#F5F5F5',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        maxWidth: 320,
    },
    userText: {
        fontSize: 16,
        color: '#2D4158',
        marginVertical: 6,
        fontWeight: '500',
    },
    fab: {
        marginRight: 16,
        marginBottom: 16,
    },
    fabTitle: {
        color: '#FFFFFF',
        fontWeight: '600',
    },
});
