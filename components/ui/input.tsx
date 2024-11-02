import React, { useState } from 'react';

interface CustomTextareaProps {
  placeholder: string;
  value: string;
  onInputChange: (value: string) => void;
  wordLimit?: number;
}

const CustomTextarea: React.FC<CustomTextareaProps> = ({
  placeholder,
  value,
  onInputChange,
  wordLimit = 120,
}) => {
  const [wordCount, setWordCount] = useState(0);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.target.value;

    // Calculate word count, setting to 0 if the text is empty or only whitespace
    const words = newValue.trim() ? newValue.trim().split(/\s+/).length : 0;
    setWordCount(words);

    // Limit word count
    if (words <= wordLimit) {
      onInputChange(newValue);
    }
  };

  return (
    <div>
      <textarea
        className="border bg-black border-gray-300 rounded-md p-2 w-full h-32 resize-none focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
      />
      <p className="text-gray-500 text-sm mt-1">
        Word Count: {wordCount}/{wordLimit}
      </p>
    </div>
  );
};

export default CustomTextarea;
