
import React from 'react';
import { type InputProps} from '../types/InputTypes'

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, errorMessage, className, type, ...rest }, ref) => {
    return (
      <div className="mb-4">
        {/* block text-sm/6 font-medium text-gray-900 */}
        {label && (
          <label htmlFor={rest?.id} className="block text-sm/6 font-medium text-gray-900">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type= {type ?? 'text'}
          className={`appearance-none border-0 border-b-2  focus:outline-none w-full py-2 px-3 ${
            errorMessage ? 'border-red-500' : 'border-blue-500'
          } ${className || ''}`}
          {...rest}
        />
        {errorMessage && (
          <p className="text-red-500 text-xs italic mt-1">{errorMessage}</p>
        )}
      </div>
    );
  }
);

export default Input