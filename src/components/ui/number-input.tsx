
import * as React from "react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface NumberInputProps extends Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> {
  value?: number | null
  onChange?: (value: number | null) => void
  allowDecimals?: boolean
  min?: number
  max?: number
  placeholder?: string
}

const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  ({ className, value, onChange, allowDecimals = true, min, max, placeholder, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState<string>(() => {
      return value !== null && value !== undefined ? value.toString() : ""
    })

    // Update display value when external value changes
    React.useEffect(() => {
      const newDisplayValue = value !== null && value !== undefined ? value.toString() : ""
      if (newDisplayValue !== displayValue || (value === null && displayValue !== "")) {
        setDisplayValue(newDisplayValue)
      }
    }, [value])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      
      // Allow empty string during typing
      if (inputValue === "") {
        setDisplayValue("")
        return
      }

      // Validate the input format
      const decimalRegex = allowDecimals ? /^-?\d*\.?\d*$/ : /^-?\d*$/
      
      if (decimalRegex.test(inputValue)) {
        setDisplayValue(inputValue)
      }
    }

    const handleBlur = () => {
      if (displayValue === "" || displayValue === "-" || displayValue === ".") {
        setDisplayValue("")
        onChange?.(null)
        return
      }

      const numericValue = parseFloat(displayValue)
      
      if (isNaN(numericValue)) {
        setDisplayValue("")
        onChange?.(null)
        return
      }

      // Apply min/max constraints
      let finalValue = numericValue
      if (min !== undefined && finalValue < min) {
        finalValue = min
      }
      if (max !== undefined && finalValue > max) {
        finalValue = max
      }

      // Update display to show the final cleaned value
      setDisplayValue(finalValue.toString())
      onChange?.(finalValue)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Allow: backspace, delete, tab, escape, enter, home, end, left, right
      if ([8, 9, 27, 13, 46, 35, 36, 37, 39].indexOf(e.keyCode) !== -1 ||
          // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+Z
          (e.keyCode === 65 && e.ctrlKey === true) ||
          (e.keyCode === 67 && e.ctrlKey === true) ||
          (e.keyCode === 86 && e.ctrlKey === true) ||
          (e.keyCode === 88 && e.ctrlKey === true) ||
          (e.keyCode === 90 && e.ctrlKey === true)) {
        return
      }
      
      // Ensure that it is a number or decimal point and stop the keypress
      if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && 
          (e.keyCode < 96 || e.keyCode > 105) &&
          e.keyCode !== 190 && e.keyCode !== 110) {
        e.preventDefault()
      }
    }

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="decimal"
        className={cn(className)}
        value={displayValue}
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
      />
    )
  }
)
NumberInput.displayName = "NumberInput"

export { NumberInput }
