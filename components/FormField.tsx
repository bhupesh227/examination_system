import React, { useEffect } from 'react'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormFieldProps <T extends FieldValues> {
    control: Control<T>;
    name:  Path<T>;
    label: string;
    placeholder?: string;
    type?: "text" | "email" | "password" | "number" | "date" | "file" | "select" | "checkbox" | "radio";
    description?: string;
}

const FormField = <T extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    type = "text",
    description = "",
}:FormFieldProps<T>) => {
    const [showDescription, setShowDescription] = React.useState(false);
    const wrapperRef = React.useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowDescription(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, []);
  return (
    <Controller control={control} name={name} render={({ field }) => (
        <FormItem  onClick={() => setShowDescription(!showDescription)}>
            <FormLabel className='label'>{label}</FormLabel>
            <FormControl>
            <Input
                {...field}
                type={type}
                placeholder={placeholder}
                className="input"
            />
            </FormControl>
            {showDescription && (
                <FormDescription className='description'>
                    {description}
                </FormDescription>
            )}
            
            <FormMessage/>
        </FormItem>
    )}/>
  )
}

export default FormField