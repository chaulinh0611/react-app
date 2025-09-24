import type { LucideProps } from "lucide-react";
import { Github, Chrome } from "lucide-react";

export const Icons = {
  google: (props: LucideProps) => <Chrome {...props} />,
  gitHub: (props: LucideProps) => <Github {...props} />,
};
