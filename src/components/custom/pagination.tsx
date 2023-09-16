import { usePagination, DOTS } from '@/hooks/pagination'
import { cn } from '@/lib/utils'

import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationProps = {
    onPageChange: (page: number | string) => void
    totalCount: number
    siblingCount?: number
    currentPage: number
    pageSize: number
    className?: string
}

const Pagination = ({
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    className,
}: PaginationProps) => {
    // const {
    //     onPageChange,
    //     totalCount,
    //     siblingCount = 1,
    //     currentPage,
    //     pageSize,
    //     className,
    // } = props
    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize,
    })

    if (currentPage === 0 || !paginationRange || paginationRange.length < 2) {
        return null
    }

    const onNext = () => {
        onPageChange(currentPage + 1)
    }

    const onPrevious = () => {
        onPageChange(currentPage - 1)
    }

    const lastPage = paginationRange[paginationRange.length - 1]
    const paginationItemCss =
        'h-8 select-none shrink-0 grow-0 text-center flex box-border items-center tracking-wide leading-normal text-sm min-w-[32px] mx-1 my-auto px-3 py-0 rounded-full hover:bg-secondary hover:cursor-pointer'
    return (
        <div className='flex items-center justify-center pl-2 '>
            <div className='flex-1 text-sm  font-medium pr-1'>{`${
                (currentPage - 1) * pageSize + 1
            }-${
                currentPage * pageSize < totalCount
                    ? currentPage * pageSize
                    : totalCount
            } of ${totalCount}`}</div>
            <ul
                className={cn(
                    'flex list-none items-center justify-center',
                    className
                )}
            >
                <li
                    // className={classnames('pagination-item', {
                    //     disabled: currentPage === 1,
                    // })}

                    className={cn(paginationItemCss, 'relative', {
                        'pointer-events-none hover:bg-transparent hover:cursor-default':
                            currentPage === 1,
                    })}
                    onClick={onPrevious}
                >
                    <div className='arrow left' />
                    {/* &#x2C2; */}
                    <ChevronLeft
                        className={cn(
                            'stroke-[2] absolute h-4 w-4 -ml-1 rounded-full',
                            {
                                'stroke-[0.5]': currentPage === 1,
                            }
                        )}
                    />
                </li>
                {paginationRange.map((pageNumber, index) => {
                    if (pageNumber === DOTS) {
                        //pagination-item dots
                        return (
                            <li
                                className='bg-transparent cursor-default'
                                key={index}
                            >
                                &#8230;
                            </li>
                        )
                    }

                    return (
                        <li
                            // className={classnames('pagination-item', {
                            //     selected: pageNumber === currentPage,
                            // })}
                            className={cn(paginationItemCss, {
                                'bg-accent': pageNumber === currentPage,
                            })}
                            onClick={() => onPageChange(pageNumber)}
                            key={index}
                        >
                            {pageNumber}
                        </li>
                    )
                })}
                <li
                    // className={classnames('pagination-item', {
                    //     disabled: currentPage === lastPage,
                    // })} //TODO
                    className={cn(paginationItemCss, 'relative', {
                        'pointer-events-none hover:bg-transparent hover:cursor-default':
                            currentPage === lastPage,
                    })}
                    onClick={onNext}
                >
                    <div className='arrow right' />
                    <ChevronRight
                        className={cn(
                            'stroke-[2] absolute h-4 w-4 -ml-1 rounded-full',
                            { 'stroke-[0.5]': currentPage === lastPage }
                        )}
                    />
                    {/* &#x2C3; */}
                </li>
            </ul>
        </div>
    )
}

export default Pagination
