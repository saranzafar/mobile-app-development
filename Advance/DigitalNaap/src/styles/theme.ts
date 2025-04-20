// Example: src/styles/theme.ts
export interface Theme {
    colors: {
        background: string;
        text: string;
        primary: string;
        gradientStart: string;
        gradientEnd: string;
    };
}

export const lightTheme: Theme = {
    colors: {
        background: '#ffffff',
        text: '#333333',
        primary: '#6200ee',
        gradientStart: '#6200ee',
        gradientEnd: '#9c67ff', // a lighter version of primary
    },
};

export const darkTheme: Theme = {
    colors: {
        background: '#333333',
        text: '#ffffff',
        primary: '#bb86fc',
        gradientStart: '#bb86fc',
        gradientEnd: '#d3a7ff',
    },
};
