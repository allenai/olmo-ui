import { PropsWithChildren } from 'react';
import { GoogleReCaptchaContext } from 'react-google-recaptcha-v3';

export const FakeGoogleReCaptchaProvider = ({ children }: PropsWithChildren) => {
    // Mock a function to return a fake token when invoked
    const executeRecaptcha = async () => 'mocked-token';

    return (
        <GoogleReCaptchaContext.Provider value={{ executeRecaptcha }}>
            {children}
        </GoogleReCaptchaContext.Provider>
    );
};
