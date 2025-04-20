import { ID, Account, Client } from 'appwrite';
import Config from 'react-native-config';

import Snackbar from 'react-native-snackbar';

const appwriteClient = new Client();

// const APPWRITE_ENDPOINT: string = Config.APPWRITE_ENDPOINT!;
// const APPWRITE_PROJECT_ID: string = Config.APPWRITE_PROJECT_ID!;

const APPWRITE_ENDPOINT: string = 'https://cloud.appwrite.io/v1';
const APPWRITE_PROJECT_ID: string = '67cdb9fc002c8ccb1057';

type CreateUserAccount = {
    email: string;
    password: string;
    name: string;
}

type LoginUserAccount = {
    email: string;
    password: string;
}

class AppwriteService {
    account;

    constructor() {
        appwriteClient
            .setEndpoint(APPWRITE_ENDPOINT)
            .setProject(APPWRITE_PROJECT_ID);

        this.account = new Account(appwriteClient);
    }

    //create a new record of user inside the appwrite
    async createAccount({ email, password, name }: CreateUserAccount) {
        try {
            const userAccount = await this.account.create(
                ID.unique(),
                email,
                password,
                name
            );
            if (userAccount) {
                return this.login({ email, password });
            } else {
                return userAccount;
            }
        } catch (error) {
            Snackbar.show({
                text: String((error)),
                duration: Snackbar.LENGTH_LONG,
            });
            console.log('Appwrite service create account error: ', error);
        }
    }

    async login({ email, password }: LoginUserAccount) {
        try {
            return await this.account.createEmailPasswordSession(email, password);
        } catch (error) {
            Snackbar.show({
                text: String((error)),
                duration: Snackbar.LENGTH_LONG,
            });
            console.log('Appwrite service login account error: ', error);
        }
    }

    async getCurrentUser() {
        try {
            return await this.account.get();
        } catch (error) {
            Snackbar.show({
                text: String((error)),
                duration: Snackbar.LENGTH_LONG,
            });
            console.log('Appwrite service get curren user account error: ', error);
        }
    }

    async logout() {
        try {
            return await this.account.deleteSession('current');
        } catch (error) {
            Snackbar.show({
                text: String((error)),
                duration: Snackbar.LENGTH_LONG,
            });
            console.log('Appwrite service logout account error: ', error);
        }
    }
}
export default AppwriteService;

