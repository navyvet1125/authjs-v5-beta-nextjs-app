"use client";
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface TwoFactorInputProps {
    value?: string;
    protected?: boolean;
    onChange?: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
}

export const TwoFactorInput: React.FC<TwoFactorInputProps> = ({
     value: propValue = '',
     protected: isProtected = false,
     onChange,
    disabled = false,
    placeholder = '',
 }) => {
  const [value, setValue] = useState<string>('');
    useEffect(() => {
        const sanitizedValue = propValue.trim().replace(/[^0-9]/g, '').slice(0, 6);
        setValue(sanitizedValue);
    }, [propValue]);

  const handleInputChange = (index: number, inputValue: string) => {
    const inputs = document.querySelectorAll('.two-factor-input input');
    if (inputValue.length > 1) return; // Prevent more than one character in each input

    const newValue = value.split('');
    newValue[index] = inputValue;
    const updatedValue = newValue.join('');
    setValue(updatedValue);



    // Focus the next input if a digit is entered
    if (inputValue) {
      for (let i = index + 1; i < inputs.length; i++) {
        const input = inputs[i] as HTMLInputElement;
        if (!input.value) {
          input.focus();
          break;
        }
      }
    }

    // Blur the previous input if the digit is deleted and no fields after the current one contain data
    if (!inputValue && index > 0) {
      let hasDataAfter = false;
      for (let i = index + 1; i < inputs.length; i++) {
        const input = inputs[i] as HTMLInputElement;
        if (input.value) {
          hasDataAfter = true;
          break;
        }
      }
      if (!hasDataAfter) {
        const prevInput = inputs[index - 1] as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
        }
      }
    }

    // Move focus to the last input if all inputs are filled and the current input isn't the last input
    const allFilled = Array.from(inputs).every(input => (input as HTMLInputElement).value);
    if (allFilled && index < inputs.length - 1) {
      const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
      lastInput.focus();
    }

    // Trigger the onChange callback after all other logic if provided
    if (onChange) {
      onChange(updatedValue);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text').trim().replace(/[^0-9]/g, '').slice(0, 6);
    setValue(paste);
    if (onChange) onChange(paste);
    // e.preventDefault();
};

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    const inputs = document.querySelectorAll('.two-factor-input input');
    if (event.key === 'ArrowLeft' && index > 0) {
      const prevInput = inputs[index - 1] as HTMLInputElement;
      prevInput.focus();
      if (prevInput.value) {
        setTimeout(() => prevInput.select(), 0);
      }
    } else if (event.key === 'ArrowRight' && index < inputs.length - 1) {
      const nextInput = inputs[index + 1] as HTMLInputElement;
      nextInput.focus();
      if (nextInput.value) {
        setTimeout(() => nextInput.select(), 0);
      }
    }
  };

  const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
    const input = e.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, ''); // Allow only numeric input
  };

  return (
    <FormItem>
        <FormLabel>Two-factor code</FormLabel>
            
            <div className="flex justify-center gap-2 two-factor-input">
            {[...Array(6)].map((_, index) => (
                        <FormControl key={index}>

                <Input
                
                type={isProtected ? 'password' : 'text'}
                maxLength={1}
                className="w-12 h-12 text-2xl text-center focus:outline-none focus:ring-0 focus:border-none shadow-none"
                placeholder={placeholder}
                value={value[index] || ''}
                disabled={disabled}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onInput={handleInput}
                onPaste={handlePaste}
                inputMode='numeric'

                />
                </FormControl>
            ))}
            </div>
            <FormMessage></FormMessage> 
        
    </FormItem>
  );
};
