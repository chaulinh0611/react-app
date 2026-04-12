import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

interface Props {
    value?: string;
    onChange?: (value: string) => void;
}

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean'],
    ],
};

export default function TextEditor({ value, onChange }: Props) {
    const handleOnChange = (nextValue: string) => {
        if (onChange) {
            onChange(nextValue);
        }
    };

    return <ReactQuill theme="snow" value={value} onChange={handleOnChange} modules={modules} />;
}
