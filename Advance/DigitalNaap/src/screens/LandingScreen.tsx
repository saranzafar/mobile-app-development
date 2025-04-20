import React from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { RootStackParamList } from '../navigations/AppNavigator';
import { useTheme } from '../contexts/ThemeContext';
import { LogIn, UserPlus } from 'lucide-react-native';

const { width } = Dimensions.get('window');

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

const LandingScreen: React.FC<Props> = ({ navigation }) => {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={theme.colors.background === '#ffffff' ? 'dark-content' : 'light-content'}
                backgroundColor="transparent"
                translucent
            />

            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.appName, { color: theme.colors.primary }]}>DigitalNaap</Text>
            </View>

            {/* Main Content */}
            <View style={styles.contentContainer}>
                {/* Illustration with subtle gradient background */}
                <View style={styles.illustrationWrapper}>
                    <LinearGradient
                        colors={[
                            theme.colors.gradientStart + '10',
                            theme.colors.gradientEnd + '20',
                        ]}
                        style={styles.illustrationBackground}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    />
                    <Image
                        source={require('../assets/illustrations/landing_illustration.png')}
                        style={styles.illustration}
                        resizeMode="contain"
                    />
                </View>

                {/* Welcome Message */}
                <View style={styles.welcomeContainer}>
                    <Text style={[styles.welcomeTitle, { color: theme.colors.text }]}>
                        Manage Client Measurements
                    </Text>
                    <Text style={[styles.welcomeDescription, { color: theme.colors.text + '99' }]}>
                        Digitize and organize all your tailoring data in one simple, easy-to-use application.
                    </Text>
                </View>
            </View>

            {/* Action Buttons Container */}
            <View style={styles.actionContainer}>
                <TouchableOpacity
                    style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.primaryButtonText}>Sign In</Text>
                    <LogIn size={20} color="#fff" style={styles.buttonIcon} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.secondaryButton, { borderColor: theme.colors.primary }]}
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={[styles.secondaryButtonText, { color: theme.colors.primary }]}>
                        Create Account
                    </Text>
                    <UserPlus size={20} color={theme.colors.primary} style={styles.buttonIcon} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 24, // Safe area for status bar
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 8,
    },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    illustrationWrapper: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 32,
        position: 'relative',
    },
    illustrationBackground: {
        position: 'absolute',
        width: width * 0.9,
        height: width * 0.6,
        borderRadius: 24,
    },
    illustration: {
        width: width * 0.8,
        height: width * 0.6,
    },
    welcomeContainer: {
        marginBottom: 16,
    },
    welcomeTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    welcomeDescription: {
        fontSize: 16,
        lineHeight: 24,
    },
    actionContainer: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    secondaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 56,
        borderRadius: 12,
        borderWidth: 1.5,
        backgroundColor: 'transparent',
        marginBottom: 24,
    },
    secondaryButtonText: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    buttonIcon: {
        marginLeft: 4,
    },
    guestButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    guestText: {
        fontSize: 14,
        fontWeight: '500',
    },
    guestIcon: {
        marginLeft: 6,
    },
});

export default LandingScreen;
