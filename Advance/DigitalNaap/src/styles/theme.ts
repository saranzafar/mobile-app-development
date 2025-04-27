export interface Theme {
    colors: {
        border: string;
        background: string;
        card: string;
        text: string;
        primary: string;
        gradientStart: string;
        gradientEnd: string;
        error: string;
    };
}

export const lightTheme: Theme = {
    colors: {
        background: '#FFFFFF',
        card: '#F5F5F5',
        text: '#333333',
        primary: '#6200EE',
        gradientStart: '#6200EE',
        gradientEnd: '#9C67FF',
        error: '#FF0000',
        border: '#D3D3D3',
    },
};

export const darkTheme: Theme = {
    colors: {
        background: '#121212',
        card: '#1E1E1E',
        text: '#FFFFFF',
        primary: '#BB86FC',
        gradientStart: '#BB86FC',
        gradientEnd: '#D3A7FF',
        error: '#CF6679',
        border: '#444444',
    },
};
