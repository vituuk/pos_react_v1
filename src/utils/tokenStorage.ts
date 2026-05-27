// Set cookie (4 hours default)
export const setAccessToken = (token: string, hours: number = 4) => {
    const date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));

    const expires = `expires=${date.toUTCString()}`;
    const expiresAt = date.getTime();

    document.cookie = `accessToken=${token};${expires};path=/;SameSite=Strict;Secure`;
    document.cookie = `accessTokenExpiry=${expiresAt};${expires};path=/;SameSite=Strict;Secure`;
};

const getCookie = (name: string): string | null => {
    const cookieName = `${name}=`;
    const cookies = decodeURIComponent(document.cookie).split(';');

    for (let c of cookies) {
        c = c.trim();
        if (c.startsWith(cookieName)) {
            return c.substring(cookieName.length);
        }
    }
    return null;
};

export const getAccessToken = (): string | null => {
    const token = getCookie("accessToken");
    const expiry = getCookie("accessTokenExpiry");

    if (!token) return null;

    if (expiry) {
        const expiryTime = Number(expiry);
        const now = Date.now();

        if (now > expiryTime) {
            removeAccessToken();
            return null;
        }
    }

    return token;
};

// Remove cookie  
export const removeAccessToken = () => {
    const expired = "Thu, 01 Jan 1970 00:00:00 UTC";

    document.cookie = `accessToken=;expires=${expired};path=/;SameSite=Strict;Secure`;
    document.cookie = `accessTokenExpiry=;expires=${expired};path=/;SameSite=Strict;Secure`;
};
