import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { marked } from 'marked';
import { Delta } from 'quill';

interface Props {
    value?: string
    onChange?: (value: string) => void;
}

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"]
  ]
}

export default function TextEditor({ value, onChange }: Props) {

    const handleOnChange = (value, delta, source, editor) => {
        if (onChange) {
            console.log(value);
            onChange(value);
        }
    }

    return (
        <ReactQuill
            theme="snow"
            value={value}
            onChange={handleOnChange}
            modules={modules}
        />
    );
}