import { columns } from './columns'
import { DataTable } from './data-table'

//import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import Loading from '@/components/custom/loading'
import { useAuthHeader } from 'react-auth-kit'

export default function CropPage() {
  //let [searchParams, setSearchParams] = useSearchParams()

  const authHeader = useAuthHeader()
  const header = authHeader()

  const [query, setQuery] = useState({
    filter: {},
    options: {
      page: 1,
      limit: 10,
    },
  })

  const { isLoading, isError, error, data, isFetching } = useQuery({
    queryKey: ['crops', query],
    queryFn: async () => {
      const data = await axios.get(
        'crops',

        {
          params: query,
          // headers: { Authorization: `Bearer ${token}` },
          headers: { Authorization: header },
        },
      )
      return data
    },
    keepPreviousData: true,
    staleTime: Infinity,
  })

  if (isLoading) return <Loading />
  if (isFetching) return <div>fetching</div>
  if (isError) return 'An error has occurred ...'

  //TODO add prefetch for next page
  const crops = data?.data.data
  return (
    <div className='container mx-auto'>
      {/* <div className=' p-6 w-full py-0'> */}
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
