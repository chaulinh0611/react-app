import * as React from 'react'

function cn(...classes: (string | undefined)[]) {
    return classes.filter(Boolean).join(' ')
}

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Separator = ({ className, ...props }: SeparatorProps) => {
    return <div className={cn('shrink-0 bg-slate-200 h-[1px] w-full', className)} {...props} />
}
