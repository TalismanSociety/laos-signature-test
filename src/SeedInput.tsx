export const SeedInput = ({
  value,
  onClick,
  onChange,
  onReset,
}: Pick<
  React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  "value" | "onClick" | "onChange"
> & { onReset: () => void }) => (
  <div>
    <label htmlFor="wsUrl" className="block text-sm font-medium text-gray-900 dark:text-gray-200">
      seedOrKey
    </label>

    <div className="relative mt-1.5">
      <input
        type="text"
        id="seedOrKey"
        className="w-full rounded-lg border-gray-300 p-2 pe-10 text-gray-700 sm:text-sm dark:bg-gray-800 dark:text-gray-300 [&::-webkit-calendar-picker-indicator]:opacity-0"
        placeholder="Enter a seed or key"
        value={value}
        onClick={onClick}
        onChange={onChange}
      />

      <span className="absolute inset-y-0 end-2 flex w-8 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-5 text-gray-500"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 21 21"
          fillRule="evenodd"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-5 cursor-pointer text-gray-500 hover:text-gray-300"
          onClick={onReset}
        >
          <g transform="matrix(0 1 1 0 2.5 2.5)">
            <path d="m3.98652376 1.07807068c-2.38377179 1.38514556-3.98652376 3.96636605-3.98652376 6.92192932 0 4.418278 3.581722 8 8 8s8-3.581722 8-8-3.581722-8-8-8" />
            <path d="m4 1v4h-4" transform="matrix(1 0 0 -1 0 6)" />
          </g>
        </svg>
      </span>
    </div>
  </div>
)
