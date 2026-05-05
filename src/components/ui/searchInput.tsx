"use client";

import { Search } from "lucide-react";
import { Input, InputProps } from "./input";
import { cn } from "@/lib/utils";

interface SearchInputProps extends InputProps {
    containerClassName?: string;
}

const SearchInput = ({ className, containerClassName, placeholder, ...props }: SearchInputProps) => {
    return (
        <div className={cn("relative w-full", containerClassName)}>
            <Input
                placeholder={placeholder}
                className={cn(
                    "rtl:pl-12 ltr:pr-12 h-10",
                    className
                )}
                {...props}
            />
            {/* <Search
                className="absolute rtl:left-4 ltr:right-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
            /> */}
        </div>
    );
};

export default SearchInput;