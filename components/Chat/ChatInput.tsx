import { Message } from "@/types";
import { IconArrowUp } from "@tabler/icons-react";
import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";
import axios from 'axios';

interface Props {
  onSend: (message: Message) => void;
}

export const ChatInput: FC<Props> = ({ onSend }) => {
  const [content, setContent] = useState<string>();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > 4000) {
      alert("Message limit is 4000 characters");
      return;
    }

    setContent(value);
  };

  const handleSend = () => {
    if (!content) {
      alert("Please enter a message");
      return;
    }
    onSend({ role: "user", content });
    setContent("");
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef && textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current?.scrollHeight}px`;
    }
  }, [content]);


  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUploadPDF = async () => {
    if (!selectedFile) {
      console.log('No file selected');
      return;
    }
    const formData = new FormData();
    formData.append('pdf', selectedFile);
    try {
      const response = await axios.post("http://localhost:5000/langchain-agent/cosmos-db/tools/pdf", formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data) {
        alert("Upload completed successfully")
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        className="min-h-[44px] rounded-lg pl-4 pr-12 py-2 w-full focus:outline-none focus:ring-1 focus:ring-neutral-300 border-2 border-neutral-200"
        style={{ resize: "none" }}
        placeholder="Type a message..."
        value={content}
        rows={1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <div>
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />
        <button  
          style={{
              backgroundColor: '#e5e7eb',
              color: 'black',
              padding: '3px 5px',
              border: 'black',
              outline: '1px solid gray',
              fontSize: '15px',
              cursor: 'pointer',
          }}
          onClick={() => handleUploadPDF()}>
            Upload
        </button>
      </div>
      <button onClick={() => handleSend()}>
        <IconArrowUp className="absolute right-2 bottom-3 h-8 w-8 hover:cursor-pointer rounded-full p-1 bg-blue-500 text-white hover:opacity-80" />
      </button>
    </div>
  );
};
