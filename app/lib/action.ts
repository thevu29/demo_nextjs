'use server';

import db from '@/app/lib/db';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { signIn } from '@/auth';

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.'
    }),
    amount: z.coerce
        .number()
        .gt(0, 'Amount must be greater than $0.'),
    status: z.enum(['pending', 'paid'], {
        invalid_type_error: 'Please select an invoice status.'
    }),
    date: z.string()
})

export type State = {
    errors?: {
        customerId?: string[],
        amount?: string[],
        status?: string[]
    };
    message?: string | null;
}

const CreateInvoice = FormSchema.omit({ id: true, date: true });

export const createInvoice = async (prevState: State, formData: FormData) => {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.'
        };
    }

    const { customerId, amount, status } = validatedFields.data
    const amountInCents = amount * 100;
    const date = new Date().toISOString();

    try {
        await db.invoice.create({
            data: {
                amount: amountInCents,
                date,
                status,
                customerId
            }
        });
    } catch (error) {
        console.log(error);
        return {
            message: 'Database Error: Failed to Create Invoice.'
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

const UpdateInvoice = FormSchema.omit({ id: true, date: true });

export const updateInvoice = async (id: string, prevState: State, formData: FormData) => {
    const validatedFields = UpdateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Update Invoice.'
        };
    }

    const { customerId, amount, status } = validatedFields.data
    const amountInCents = amount * 100;

    try {
        await db.invoice.update({
            where: { id },
            data: {
                amount: amountInCents,
                status,
                customerId
            }
        });
    } catch (error) {
        console.log(error);
        return {
            message: 'Database Error: Failed to Update Invoice.',
        };
    }

    revalidatePath('/dashboard/invoices');
    redirect('/dashboard/invoices');
}

export const deleteInvoice = async (id: string) => {
    try {
        await db.invoice.delete({ where: { id } });
        revalidatePath('/dashboard/invoices');
    } catch (error) {
        console.log(error);
        return {
            message: 'Database Error: Failed to Delete Invoice.',
        };
    }
}

export const authenticate = async (
    prevState: string | undefined,
    formData: FormData
) => {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}