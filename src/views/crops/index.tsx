import { columns } from './columns'
import { DataTable } from './data-table'

import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useQuery } from 'react-query'
import { useState } from 'react'

import Loading from '@/components/custom/loading'

export default function CropPage() {
    //let [searchParams, setSearchParams] = useSearchParams()

    const [query, setQuery] = useState({
        filter: {},
        options: {
            page: 1,
            limit: 10,
        },
    })

    const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGY3YTQyZTdlYzZiNTg4N2QxZDJmOTYiLCJyb2xlIjoiYWRtaW4iLCJleHBpcmUiOjE2OTY2MjQ2NzAzOTksImlhdCI6MTY5NDAzMjY3MH0.V5fUTp4NSt2Gs6blf-oiM4TrPDE8U_8hgwSOz5cAcbE'
    const { isLoading, isError, error, data, isFetching, isPreviousData } =
        useQuery({
            queryKey: ['crops', query],
            queryFn: async () => {
                const data = await axios.get(
                    'https://agro-api-b67m.onrender.com/api/v1/crops',

                    {
                        params: query,
                        headers: { Authorization: `Bearer ${token}` },
                    }
                )
                console.log(data)
                return data
            },
            keepPreviousData: true,
        })

    if (isLoading) return <Loading />

    if (isError) return 'An error has occurred: ' + error

    const crops = data?.data.data
    return (
        <div className='container mx-auto py-0'>
            {/* {JSON.stringify(data?.data.data.docs, null, 4)} */}

            {/* <DataTable columns={columns} data={data} /> */}
            <DataTable
                columns={columns}
                data={crops.docs}
                totalCount={crops.totalDocs}
                pageSize={crops.limit}
                currentPage={crops.page}
                onPageChange={(page) => {
                    setQuery({
                        filter: {},
                        options: {
                            page: page,
                            limit: query.options.limit,
                        },
                    })
                }}
                onLimitChange={(limit) => {
                    setQuery({
                        filter: {},
                        options: {
                            page: 1,
                            limit: limit,
                        },
                    })
                }}
            />
            {/* <DataTablePagination /> */}
        </div>
    )
}
