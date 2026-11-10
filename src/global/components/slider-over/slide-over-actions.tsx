import type { FC, ReactNode } from "react";

const SlideOverActions: FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <div className="center absolute top-6 right-16 z-10 gap-2">
            {children}
        </div>
    );
};

export default SlideOverActions;
