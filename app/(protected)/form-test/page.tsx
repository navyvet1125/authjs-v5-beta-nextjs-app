import React from 'react'
import { TestForm } from '@/app/(protected)/form-test/testForm'
// import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { currentUser } from '@/lib/auth';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { CardWrapper } from '@/components/auth/cardWrapper';

const FormTestPage = async () => {
const user = await currentUser();
  return (
    <CardWrapper  
        headerLabel={'Two Factor Authentication'}
        backButtonLabel={''}
        backButtonHref={''}>
        <TestForm />
    </CardWrapper>
  )
}

export default FormTestPage
