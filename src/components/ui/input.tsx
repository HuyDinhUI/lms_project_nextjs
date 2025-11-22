
import { IconSearch } from '@tabler/icons-react';
import React, { useEffect, useRef, useState } from 'react'

export const InputSearch = () => {
    const [onSearch, setOnSearch] = useState<boolean>(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (ref.current && !ref.current.contains(event.target as Node)) {
                    setOnSearch(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }, []);
    return (
        <div ref={ref} className='flex items-center ring ring-gray-400 flex-1 rounded-sm relative'>
            <div className='p-2'>
                <IconSearch size={15} />
            </div>
            <input onFocus={() => setOnSearch(true)} className='outline-none w-full' placeholder='Search'></input>
            {onSearch && 
            <div className='absolute w-full h-50 p-2 bg-white top-10 rounded dark:bg-card border-1 z-999'>
                <label className='uppercase text-[10px] dark:text-gray-200'>Recent boards</label>
            </div>}
        </div>
    )
}

type InputVariant = 'default' | 'primary' | 'danger'
type InputSize = 'sm' | 'md' | 'lg'

type InputProps = {
    placeholder?: string,
    variant?: InputVariant,
    sizeOpt?: InputSize,
} & React.InputHTMLAttributes<HTMLInputElement>

const variantClass: Record<InputVariant, string> = {
    default: 'ring ring-gray-200 dark:ring-gray-500',
    primary: '',
    danger: ''
}

const sizeClass: Record<InputSize, string> = {
    sm: '',
    md: 'p-2',
    lg: ''
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            placeholder,
            variant = 'default',
            sizeOpt = 'md',
            className,
            ...rest
        },
        ref
    ) => {
        const base = 'w-full rounded-sm'
        const finalClass = `${base} ${variantClass[variant]} ${sizeClass[sizeOpt]} ${className}`

        return (
            <input ref={ref} className={finalClass} {...rest} placeholder={placeholder}>
                
            </input>
        )
    }

)

Input.displayName = "Input";