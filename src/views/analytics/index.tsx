import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import Loading from '@/components/custom/loading'
import { useAuthHeader } from 'react-auth-kit'
import axios from 'axios'
import { useQuery } from '@tanstack/react-query'

import { Server, Database } from 'lucide-react'

const AnalyticsPage = () => {
  const authHeader = useAuthHeader()
  const header = authHeader()

  const { isLoading, isError, data, isFetching } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const data = await axios.get('analytics', {
        headers: { Authorization: header },
      })
      return data
    },
    keepPreviousData: true,
    staleTime: Infinity, //TODO make this 60*5 seconds to keep loading in every 5 mins
  })

  const serverCheck = useQuery({
    queryKey: ['analytics/healthcheck'],
    queryFn: async () => {
      const data = await axios.get('analytics/healthcheck', {
        headers: { Authorization: header },
      })
      return data
    },
    keepPreviousData: true,
    staleTime: Infinity, //TODO make this 60 seconds to keep loading in every minute
  })

  if (isLoading || serverCheck.isLoading) return <Loading />
  if (isFetching || serverCheck.isFetching) return <Loading />
  if (isError || serverCheck.isError) return 'An error has occurred ...'

  const db = data.data.data.db
  const models = data.data.data.collections
  const collections = [models.crop, models.category, models.user]
  const serverData = serverCheck.data.data

  return (
    <>
      <div className='hidden h-full w-full flex-col  md:flex'>
        <div className='flex-1 space-y-4 p-8 pt-6'>
          {/* <div className='mt-10 scroll-m-20 pb-2 text-lg font-semibold tracking-tight transition-all first:mt-0'>
            Server Analytics
          </div> */}
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-2'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  <div className='flex  items-center'>
                    <div>Server Health</div>
                    <span className='relative ml-2 flex h-3 w-3'>
                      <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75'></span>
                      <span className='relative inline-flex h-3 w-3 rounded-full bg-primary'></span>
                    </span>
                  </div>
                </CardTitle>

                {/* <Server className='h-4 w-4 text-muted-foreground animate-pulse' /> */}
                <Server className='h-4 w-4 animate-pulse text-primary' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {Math.round((serverData.uptime + Number.EPSILON) * 100) / 100}
                  s uptime
                </div>
                <p className='text-xs text-muted-foreground'>
                  Server is healthy ...
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>
                  Database Details
                </CardTitle>
                <Database className='h-4 w-4 animate-pulse text-primary' />
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>
                  {Math.round(
                    ((db.storageSize + db.indexSize) / 1024 + Number.EPSILON) *
                      100,
                  ) / 100}{' '}
                  kb size
                </div>
                <p className='text-xs text-muted-foreground'>
                  data collections - {db.collections}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className='grid grid-cols-6 gap-4'>
            <Card>
              <CardHeader>
                <CardTitle>Total Objects</CardTitle>
                <CardDescription>{db.objects}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Objects dataSize</CardTitle>
                <CardDescription>
                  {Math.round((db.dataSize / 1024 + Number.EPSILON) * 100) /
                    100}{' '}
                  kb
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Indexes</CardTitle>
                <CardDescription>{db.indexes}</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Object Size</CardTitle>
                <CardDescription>
                  {Math.round((db.avgObjSize / 1024 + Number.EPSILON) * 100) /
                    100}{' '}
                  kb
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Normal Storage</CardTitle>
                <CardDescription>
                  {Math.round((db.storageSize / 1024 + Number.EPSILON) * 100) /
                    100}{' '}
                  kb
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Indexes Size</CardTitle>
                <CardDescription>
                  {Math.round((db.indexSize / 1024 + Number.EPSILON) * 100) /
                    100}{' '}
                  kb
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className='h-4'></div>

          {/* <div className='mt-10 scroll-m-20 pb-2 text-lg font-semibold tracking-tight transition-colors first:mt-0'>
            Component Details
          </div> */}

          <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-3'>
            {collections.map((item) => {
              return (
                <Card>
                  <CardHeader>
                    <CardTitle className='text-sm font-medium'>
                      {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
                    </CardTitle>
                    <CardDescription>{`${item.count} entries`}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className='text-xs text-muted-foreground'>{`Indexes - ${item.nindexes}`}</p>
                    <p className='text-xs text-muted-foreground'>{`Total Size - ${
                      Math.round((item.size / 1024 + Number.EPSILON) * 100) /
                      100
                    } kb`}</p>

                    <p className='text-xs text-muted-foreground'>{`Average object Size - ${
                      Math.round(
                        (item.avgObjSize / 1024 + Number.EPSILON) * 100,
                      ) / 100
                    } kb`}</p>

                    <p className='text-xs text-muted-foreground'>{`Free Storage Size - ${
                      Math.round(
                        (item.freeStorageSize / 1024 + Number.EPSILON) * 100,
                      ) / 100
                    } kb`}</p>
                    <p className='text-xs text-muted-foreground'>{`Normal Storage Size - ${
                      Math.round(
                        (item.storageSize / 1024 + Number.EPSILON) * 100,
                      ) / 100
                    } kb`}</p>
                    <p className='text-xs text-muted-foreground'>{`Index Size - ${
                      Math.round(
                        (item.totalIndexSize / 1024 + Number.EPSILON) * 100,
                      ) / 100
                    } kb`}</p>
                    <p className='text-xs text-muted-foreground'>{`Total Size - ${
                      Math.round(
                        (item.totalSize / 1024 + Number.EPSILON) * 100,
                      ) / 100
                    } kb`}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
//Math.round((() + Number.EPSILON) * 100) / 100
export default AnalyticsPage
