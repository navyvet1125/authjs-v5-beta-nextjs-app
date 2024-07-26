"use client";
import { useCallback, useEffect, useState } from 'react'
import { CardWrapper } from '@/components/auth/cardWrapper';
import { BeatLoader } from 'react-spinners';
import { useSearchParams } from 'next/navigation';
import { newVerification } from '@/actions/new-verification';
import { resendVerificationToken } from '@/actions/resend';
import { FormError } from '@/components/formError';
import { FormSuccess } from '@/components/formSuccess';
import { Button } from '@/components/ui/button';
import { set } from 'zod';

const NewVerificationForm = () => {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    // const [verifying, setVerifying] = useState(false);
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const verifyToken = useCallback(async () => {
        if (!token){
            setError("Invalid or missing token");
            return;
        }
        newVerification(token)
        .then((data) => {
            if (data.error) {
                setSuccess(undefined);
                setError(data.error);
            } else {
                setError(undefined);
                setSuccess(data.success);
            }
        })
        .catch((error) => {
            console.error("Error in newVerification! ", error);
            setSuccess(undefined);
            setError("An error occurred");
        });
    }, [token]);

    const resubmitToken = useCallback(async () => {
        if (!token){
            setError("Invalid or missing token");
            return;
        }
        setError(undefined);
        setSuccess(undefined);
        resendVerificationToken(token)
        .then((data) => {
            if (data.error) {
                setSuccess(undefined);
                setError(data.error);
            } else {
                setError(undefined);
                setSuccess(data.success);
            }
        })
        .catch((error) => {
            console.error("Error in resubmitToken! ", error);
            setSuccess(undefined);
            setError("An error occurred");
        });
    }, [token]);

    useEffect(() => {
        verifyToken();
    }, [verifyToken]);

    return (
        <CardWrapper
            headerLabel="Verify your email"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <div className="flex flex-col items-center w-full justify-center">
                { !error && !success && (<BeatLoader color="#2563EB" />)}
                <FormError message={error} />
                <FormSuccess message={success} />

                {error === "Token expired" && (
                    <Button onClick={resubmitToken}
                        className='w-full'
                    >
                        Request new token
                    </Button>
                 )}
            </div> 
        </CardWrapper>
    )
}

export default NewVerificationForm
