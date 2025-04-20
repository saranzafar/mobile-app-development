export const getOptimizedImageUrl = (url: string, width: number, height: number): string => {
    return `${url}?w=${width}&h=${height}&fit=crop&auto=format`;
};
