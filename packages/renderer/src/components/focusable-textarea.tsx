import { Textarea } from "@/components/ui/textarea";

const textareaEl = { current: null as HTMLTextAreaElement | null };

// eslint-disable-next-line react-refresh/only-export-components
export function focusTextarea() {
  requestAnimationFrame(() => textareaEl.current?.focus());
}

const handleRef = (el: HTMLTextAreaElement | null) => {
  textareaEl.current = el;
};

interface FocusableTextareaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
}

const FocusableTextarea = ({
  value,
  onChange,
  className,
}: FocusableTextareaProps) => (
  <Textarea
    ref={handleRef}
    value={value}
    onChange={onChange}
    className={className}
  />
);

export default FocusableTextarea;
