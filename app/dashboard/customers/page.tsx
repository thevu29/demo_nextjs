import Table from '@/app/ui/customers/table';
import Search from '@/app/ui/search';
import { lusitana } from '@/app/ui/fonts';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredCustomers } from '@/app/lib/data';
import { Metadata } from 'next';
 
export const metadata: Metadata = {
  title: 'Customers',
};

const Page = async ({
    searchParams,
}: {
    searchParams?: {
        query?: string;
    }
}) => {
    const query = searchParams?.query || '';
    const customers = await fetchFilteredCustomers(query);

    return (
        <div className="w-full">
            <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
                Customers
            </h1>
            <Search placeholder="Search customers..." />
            <Suspense key={query} fallback={<InvoicesTableSkeleton />}>
                <Table customers={customers} />
            </Suspense>
        </div>
    );
}

export default Page;